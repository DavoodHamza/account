import { Button, Col, Form, Input, InputNumber, Row, notification } from "antd";
import "../../consulting/style.scss";
import { useEffect, useState } from "react";
import { POST } from "../../../utils/apiCalls";
import { withTranslation } from "react-i18next";
function ConsultingForm(props:any) {
    const { t } = props;
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const SendEmail = async (index: any) => {
    setIsLoading(true);
    let mailBody = {
      name: index.fullname,
      email: index.email,
      phone: index.phone,
      message: index.message,
    };
    try {
      const add_supplier_url = "contactus/add";
      const { data, message }: any = await POST(add_supplier_url, mailBody);
      if (data) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: message,
        });
        form.resetFields();
      } else {
        setIsLoading(false);

        notification.error({
          message: "Error",
          description: "Your request failed..!",
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Error",
        description: "Your request failed..!",
      });
    }
  };
  const { TextArea } = Input;
  return (
    <div className="ConsultingForm-bg">
      <div className="CardsPage-coveringDiv">
        <div className="ConsultingForm-taitil">
          {t("home_page.homepage.Got_Any")}{" "}
        </div>
        <div className="ConsultingForm-text">
          {t("home_page.homepage.Got_Any_body")}{" "}
        </div>
        <Form onFinish={SendEmail} form={form} layout="vertical">
          <Row gutter={20}>
            <Col lg={12} md={24} sm={24} xs={24}>
              <Row gutter={20}>
                <Col md={24} sm={24} xs={24}>
                  <Form.Item
                    name="fullname"
                    label={
                      <label className="ConsultingForm-label">
                        {t("home_page.homepage.name")}
                      </label>
                    }
                  >
                    <Input className="ConsultingForm-input"></Input>
                  </Form.Item>
                </Col>
                <Col md={12} sm={24} xs={24}>
                  {" "}
                  <Form.Item
                    name="email"
                    label={
                      <label className="ConsultingForm-label">
                        {t("home_page.homepage.form_E-mail")}
                      </label>
                    }
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: t("home_page.homepage.Please_input_your_Email"),
                      },
                    ]}
                  >
                    <Input className="ConsultingForm-input"></Input>
                  </Form.Item>
                </Col>
                <Col md={12} sm={24} xs={24}>
                  <Form.Item
                    name="phone"
                    label={
                      <label className="ConsultingForm-label">
                        {t("home_page.homepage.phone_number")}
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.Pleaseyournumber"),
                      },
                    ]}
                  >
                    <InputNumber
                      type="number"
                      className="ConsultingForm-input"
                      controls={false}
                    ></InputNumber>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col lg={12} md={24} sm={24} xs={24}>
              <Col md={24}>
                <Form.Item
                  name="message"
                  label={
                    <label className="ConsultingForm-label">
                      {t("home_page.homepage.message")}
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.Pleaseentermessage"),
                    },
                    {
                      min: 5,
                      message: "Message must be at least 5 characters!",
                    },
                  ]}
                >
                  <TextArea
                    className="ConsultingForm-textArea"
                    // placeholder="write a detailed message about the enquiry or requirements."
                    placeholder={t("home_page.homepage.message_palceholder")}
                  ></TextArea>
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    className="ConsultingForm-btn"
                    loading={isLoading}
                  >
                    {t("home_page.homepage.send_message")}
                  </Button>
                </Form.Item>
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default withTranslation()(ConsultingForm);
