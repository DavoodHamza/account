import { Button, Form, Input, Modal, Select, Upload, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import API from "../../../config/api";
import {
  BASE_PUT,
  GET,
  POST,
  PUT,
  REGISTERGET,
  REGISTERPOST,
} from "../../../utils/apiCalls";
import ImagePicker from "../../../components/imageUploader";
import "../styles.scss";

const BlogForm = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [image, setImage] = useState();
  const [image2, setImage2] = useState();
  const [toggle, toggleModal] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = API.BLOG + "/" + props?.id;
      const { data, status }: any = await GET(url, null);
      if (status) {
        setImage2(data?.image);
        form.setFieldsValue({
          title: data?.title,
          content: data?.content,
          status: data?.status,
          category: data?.category,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    props?.type === "edit" && fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const url = props?.type === "create" ? API.BLOG : `blog/${props?.id}`;
      let obj = {
        title: values?.title,
        image: image,
        content: values?.content,
        category: values?.category,
      };
      const response: any =
        props?.type === "create" ? await POST(url, obj) : await PUT(url, obj);

      if (response.status) {
        notification.success({
          message: "Success",
          description:
            props?.type === "create"
              ? "Blog published successfully"
              : "Blog updated successfully",
        });
        props?.reload();
        props?.setIsOpen(false);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to publish blog",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to publish blog!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const options = [
    "Business",
    "Finance",
    "Accounting",
    "Updated",
    "World",
    "Daily News",
  ]?.map((value) => ({ value, label: value }));

  const handleImageUpload = (imageData: any) => {
    setImage(imageData);
  };

  return (
    <>
      <Modal
        open={props?.openModal}
        closable={true}
        centered
        width={800}
        footer={false}
        maskClosable={false}
        onCancel={() => props?.setIsOpen(false)}
      >
        <h4 className="blog-title">
          {props?.type === "create" ? "Create New News" : "Update News"}
        </h4>
        <Form form={form} onFinish={onFinish}>
          <Row>
            <Col md={12}>
              <div className="">
                <label className="formLabel">Title</label>
                <Form.Item name="title">
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div>
                <label className="formLabel">Category</label>
                <Form.Item name="category">
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select a Category"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                  >
                    {options?.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="">
                <label className="formLabel">Description</label>
                <Form.Item name="content">
                  <Input.TextArea rows={5} size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div>
                <div>Image</div>
                {image || image2 ? (
                  <div className="blogForm_box1">
                    <img src={image || image2} className="blogForm_img" />
                  </div>
                ) : (
                  ""
                )}
                <br />
                <Button onClick={() => toggleModal(true)}>
                  Upload Image Here
                </Button>
              </div>
            </Col>
            <br />

            <Col xs={6} />
            <Col xs={3}>
              <Button
                block
                size="large"
                onClick={() => props?.setIsOpen(false)}
              >
                Cancel
              </Button>
            </Col>
            <Col xs={3}>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={isLoading}
                block
              >
                Publish
              </Button>
            </Col>
          </Row>
        </Form>
        <ImagePicker
          onImageUpdated={(data: any) => handleImageUpload(data)}
          open={toggle}
          modalClose={() => toggleModal(false)}
        />
      </Modal>
    </>
  );
};

export default BlogForm;
