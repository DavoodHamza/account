import React, { useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { Button, Form, notification } from "antd";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import PickImage from "../../../components/imagePicker/components/pickImage";
import { BASE_COMPRESS_IMAGE } from "../../../utils/apiCalls";
import { Col, Row } from "react-bootstrap";
// const update = "update";

const LogoPicker = (props: any) => {
  const [Notifications, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>({});
  const fileInputRef = useRef(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);
  const [btnACtive, setBtnActive] = useState(true);

  const handler = async (e: any) => {
    let imageUrl: any;
    try {
      if (croppedImage) {
        setIsLoading(true);
        const ImageBlob = await fetch(croppedImage).then((r) => r.blob());
        let name = moment(new Date()).unix();
        let file = new File([ImageBlob], name + "N.jpg");
        imageUrl = file;
        imageUrl = await BASE_COMPRESS_IMAGE(file);
        props.setImg(imageUrl?.Location);
      }
      props?.form?.setFieldsValue({ logo: imageUrl?.Location });

      props?.modalClose();
      setImage({});
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCrop = async () => {
    if (cropperRef.current) {
      const canvas: HTMLCanvasElement | null =
        cropperRef.current.cropper.getCroppedCanvas();
      if (canvas) {
        const croppedData = canvas.toDataURL("image/jpeg");
        setCroppedImage(croppedData);
        setImage({ url: croppedData });
        setCropModalOpen(false);
        try {
        } catch (error) {
          console.error("Form validation failed:", error);
        }
      }
    }
  };
  return (
    <Modal
      title={props?.mode === "affiliation" ? "Add Image" : "Add Logo"}
      open={props?.open}
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        props?.modalClose();
        setImage({});
      }}
    >
      {contextHolder}
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
                  {props?.mode === "affiliation"
                    ? "  Choose Another Image"
                    : "  Choose Another Logo"}
                </Button>
              </Col>
              <Col sm={6}>
                <Button block size="large" type="primary" onClick={handleCrop}>
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
                message:
                  props?.mode === "affiliation"
                    ? "  Choose Another Image"
                    : "  Choose Another Logo",
              },
            ]}
          >
            <PickImage
              onChange={(file: any) => {
                setImage(file);
                setCropModalOpen(true);
              }}
              fileURL={image?.url ? image.url : null}
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
                onClick={handler}
              >
                Add
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Modal>
  );
};

export default LogoPicker;
