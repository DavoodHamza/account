import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { Button, Form, notification } from "antd";
import { PUT } from "../../utils/apiCalls";
import PickImage from "./components/pickImage";
import Cropper, { ReactCropperElement } from "react-cropper";
import { COMPRESS_IMAGE } from "../../utils/apiCalls";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/slices/userSlice";
import "./styles.scss";
import { Row,Col } from "react-bootstrap";
import API from "../../config/api";

const ImagePicker = (props: any) => {
  const [form] = Form.useForm();
  const [Notifications, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>({});
  const type = props?.type || "update";
  const fileInputRef = useRef(null);

  const {user} = useSelector((state:any)=>state?.User)

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (type == update) {
      form.setFieldsValue({
        image: props?.data?.image,
      });
    } else {
      form.resetFields();
    }
  }, [props?.data, type]);

  const handleCropAndSubmit = async () => {
    setIsLoading(true);

    try {
      let imageUrl = props?.data?.image;

      if (cropperRef.current) {
        const canvas: HTMLCanvasElement | null =
          cropperRef.current.cropper.getCroppedCanvas();

        if (canvas) {
          const croppedData = canvas.toDataURL("image/jpeg");

          const ImageBlob = await fetch(croppedData).then((r) => r.blob());
          const name = moment(new Date()).unix();
          const file = new File([ImageBlob], name + "N.jpg");
          imageUrl = await COMPRESS_IMAGE(file);
        }
      }

      const data = {
        image: imageUrl?.url,
      };
      let url = API.UPDATE_PROFILE + user?.id + '/' + user?.companyInfo?.id;
      const response: any = await PUT(url, data);

      if (response?.status) {
        notification.success({
          message: "Success",
          description: `Image updated successfully`,
        });
        form.resetFields();
        props?.modalClose();
        dispatch(update(response?.data));
        // props?.refreshData();
        setImage({});
        setCroppedImage(null);
        setCropModalOpen(false);
      } else {
        notification.error({
          message: `Failed`,
          description: response.message,
        });
      }
    } catch (err: any) {
      notification.error({
        // message: `Failed to ${type == update ? "Update" : "Add New item"}`,
        message:"Server Error",
        description: 'Failed to update image!! Please try again later',
      });
      console.log("crop catch",err)
    }

    setIsLoading(false);
  };

  return (
    <Modal
      title="Add New Photo"
      open={props?.open}
      okText="Save"
      centered
      width={500}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        props?.modalClose();
        setImage({});
        setCropModalOpen(false);
      }}
    >
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 600 }}
        layout="vertical"
      >
        {cropModalOpen ? (
          <div className="mt-2">
            <Spin spinning={isLoading} size="large">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setImage({
                      file: selectedFile,
                      url: URL.createObjectURL(selectedFile),
                    });
                    setCropModalOpen(true);
                  }
                }}
              />
              <Cropper
                ref={cropperRef as React.RefObject<ReactCropperElement>}
                src={image?.url}
                style={{ height: 400, width: "100%" }}
                aspectRatio={aspectRatio}
                guides={true}
              />
              <br/>
             <Row>
                <Col sm={6}>
                <Button
                block
                size="large"
                  onClick={() => {
                    if (fileInputRef.current) {
                      (fileInputRef.current as any).click();
                    }
                  }}
                >
                  Choose Another Image
                </Button>
                </Col>
                <Col sm={6}>
                <Button
                block
                size="large"
                  type="primary"
                  onClick={() => handleCropAndSubmit()}
                >Upload Image</Button>
                </Col>
              </Row>
            </Spin>
          </div>
        ) : (
          <>
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please Upload image",
                },
              ]}
            >
              <PickImage
                onChange={(file: any) => {
                  setImage(file);
                  setCropModalOpen(true);
                }}
                fileURL={
                  image?.url
                    ? image.url
                    : type == update
                    ? props?.data?.companyInfo?.bimage
                    : null
                }
              />
            </Form.Item>
            <Row>
              <Col sm={6}>
                <Button
                  block
                  danger
                  size="large"
                  onClick={() => {
                    props?.modalClose();
                    setImage({});
                  }}
                >
                  Close
                </Button>
              </Col>
              <Col sm={6}>
                <Button
                  size="large"
                  block
                  type="primary"
                  loading={isLoading}
                >
                  {type == "update" ? "Update" : "Add"}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ImagePicker;
