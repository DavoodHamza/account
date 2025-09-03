import { Button, Form, Modal, notification } from "antd";
import "cropperjs/dist/cropper.css";
import moment from "moment";
import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import PickImage from "./component/imagePick";
import { BASE_COMPRESS_IMAGE } from "../../utils/apiCalls";

const ImagePicker = (props: any) => {
  const [form] = Form.useForm();
  const [Notifications, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<any>({});
  const fileInputRef = useRef(null);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  const formSubmitHandler = async (values: any) => {
    setIsLoading(true);
    try {
      let imageUrl;
      if (croppedImage) {
        const ImageBlob = await fetch(croppedImage).then((r) => r.blob());
        let name = moment(new Date()).unix();
        let fileName = name + "N.jpg"; // Set the desired filename
        let file = new File([ImageBlob], fileName, { type: "image/jpeg" });
        imageUrl = file;
        const data: any = await BASE_COMPRESS_IMAGE(file);

        if (data?.status) {
          props?.onImageUpdated(data?.Location);
          Notifications["success"]({
            message: "Success",
            description: `Successfully ${
              props?.type === "registration" ? "Added" : "Updated"
            } `,
          });
          props?.modalClose();
          setImage({});
          setCroppedImage(null);
        }
      }
    } catch (err: any) {}
    setIsLoading(false);
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
      title={"Add New Photo"}
      open={props?.open}
      okText="Update"
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      onCancel={() => {
        props?.modalClose();
        setImage({});
      }}
    >
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 600 }}
        layout="vertical"
        onFinish={formSubmitHandler}
      >
        {cropModalOpen ? (
          <div className="mt-2">
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
            <div>
              {/* marginTop: 25  */}
              {/* <Button
                type="primary"
                onClick={handleCrop}
                loading={isLoading}
                htmlType="submit"
              >
                Crop Image
              </Button> */}

              <Button
                style={{}}
                onClick={() => {
                  if (fileInputRef.current) {
                    (fileInputRef.current as any).click();
                  }
                }}
              >
                Choose Another Image
              </Button>
            </div>
          </div>
        ) : (
          <Form.Item
            label="Image"
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
              fileURL={image?.url ? image.url : null}
            />
          </Form.Item>
        )}

        <div className="d-flex gap-3 justify-content-end">
          <Button
            onClick={() => {
              props?.modalClose();
              setImage({});
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            loading={isLoading}
            htmlType="submit"
            onClick={handleCrop}
          >
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ImagePicker;
