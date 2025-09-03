import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { Button, Form, notification } from "antd";
import { PUT, POST2 } from "../../utils/apiCalls";
import PickImage from "../../components/imagePicker/components/pickImage";
import Cropper, { ReactCropperElement } from "react-cropper";
import { COMPRESS_IMAGE } from "../../utils/apiCalls";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/slices/userSlice";
import { Row, Col } from "react-bootstrap";
import API from "../../config/api";

const ImgPicker = (props: any) => {
  const [form] = Form.useForm();
  const [Notifications, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>({});
  const type = props?.type || "update";
  const fileInputRef = useRef(null);

  const { user } = useSelector((state: any) => state?.User);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "update") {
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

          // Update the state with the cropped image
          setCroppedImage(croppedData);

          const ImageBlob = await fetch(croppedData).then((r) => r.blob());
          const name = moment(new Date()).unix();
          const file = new File([ImageBlob], name + "N.jpg");
          imageUrl = await COMPRESS_IMAGE(file);

          var formdata = new FormData();
          formdata.append("userid", user?.id);
          formdata.append("file", file, file.name);
          let graphData_url = API.UPDATE_LOGO + user?.companyInfo?.id;
          const { data, status }: any = await POST2(graphData_url, formdata);
          if (status) {
            let obj = {
              ...data?.updatedData,
              isStaff: user?.isStaff,
              staff: user?.staff,
              token: user?.token,
            };
            props?.modalClose();
            dispatch(update(obj));
            setImage({});
            setCroppedImage(null);
            setCropModalOpen(false);
          } else {
            notification.error({
              message: `Failed`,
              description: "error",
            });
          }
        }
      }
    } catch (err: any) {
      notification.error({
        message: "Server Error",
        description: "Failed to update image!! Please try again later",
      });
      console.log("crop catch", err);
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
      <Form form={form} style={{ maxWidth: 600 }} layout="vertical">
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
                // aspectRatio={aspectRatio}
                viewMode={1}
                guides={true}
                autoCropArea={1}
                movable={true}
                zoomable={true}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
              />
              <br />
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
                    onClick={handleCropAndSubmit}
                  >
                    Upload Image
                  </Button>
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
                  croppedImage
                    ? croppedImage
                    : image?.url
                    ? image.url
                    : type === "update"
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
                <Button size="large" block type="primary" loading={isLoading}>
                  {type === "update" ? "Update" : "Add"}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ImgPicker;
