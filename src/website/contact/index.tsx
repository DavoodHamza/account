import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { Input, Form, Button, notification, InputNumber } from "antd";
import { IoCallOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiGlobe } from "react-icons/ci";
import "./styles.scss";
import { POST } from "../../utils/apiCalls";
import { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Whatsapp from "../../components/whatsapp";
// import ChatBot from "../../components/bot";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
function Contact(props: any) {
  const { t } = props;
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const onChange = (e: RadioChangeEvent) => {
    if (value == e.target.value) {
      setValue("");
    } else {
      setValue(e.target.value);
    }
  };

  const SendEmail = async (index: any) => {
    setIsLoading(true);
    let mailBody = {
      name: index.fullname,
      email: index.email,
      phone: index.phone,
      message: index.message,
      ContactOption: value,
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

  return (
    <div className="website-screens">
      <WebsiteHeader />
      <br />
      <Container>
        <Form onFinish={SendEmail} form={form}>
          <Row className="g-0">
            <Col md={6}>
              <div className="contact-box1">
                <p className="contactBox-tex1">
                  {t("home_page.homepage.Let_s")}
                </p>
                {t("home_page.homepage.Got_Any_body")}
                <br />
                <br />
                <div className="contact-box2">
                  <CiLocationOn size={27} color="#ff9800 " />
                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="https://www.google.com/maps/place/42+Summit+Trail,+Petawawa,+ON+K8H+3N5,+Canada/@45.9024219,-77.2725329,17z/data=!3m1!4b1!4m6!3m5!1s0x4cd6ccc04623d3e1:0x5e40f2509d56e4d4!8m2!3d45.9024219!4d-77.2725329!16s%2Fg%2F11c5jhhl13?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D"
                    >
                      {t("home_page.homepage.address2")}
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <IoCallOutline size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    {" "}
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="tel:+35315549629"
                    >
                 +1-343-999-1997
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiMail size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="mailto:info@taxgoglobal.com"
                    >
                      info@taxgoglobal.com
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiGlobe size={26} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    www.taxgoglobal.com
                  </div>
                </div>
              </div>
              {/* update */}

              <div className="contact-box1">
                <br />
                <br />
                <div className="contact-box2">
                  <CiLocationOn size={27} color="#ff9800 " />
                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                                  href="https://www.google.com/maps/place/4+Damastown+Way,+Macetown+South,+Dublin,+Ireland/@53.412584,-6.4087859,17z/data=!3m1!4b1!4m5!3m4!1s0x48676d49afa44f5d:0xb3654f1e161deda3!8m2!3d53.4125808!4d-6.406211?entry=ttu"

                    >
                 {t("home_page.homepage.address")}
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <IoCallOutline size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    {" "}
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="tel: +1-343-999-1997"
                    >
                    +1-343-999-1997
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiMail size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="mailto:info@taxgoglobal.com"
                    >
                      info@taxgoglobal.com
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiGlobe size={26} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    www.taxgoglobal.com
                  </div>
                </div>
              </div>
              {/* new update  */}

              <div className="contact-box-sub">
                <br />
                <br />
                <div className="contact-box2">
                  <CiLocationOn size={27} color="#ff9800 " />
                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      
                      href="https://www.google.com/maps/search/?api=1&query=No.10+Felicia+Koleosho+Street%2C+OACDA+Estate+Opebi%2C+Ikeja"
                    >
            {t("home_page.homepage.address3")}
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <IoCallOutline size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    {" "}
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="tel:+2349117356897"
                    >
                      +2349117356897
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiMail size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="mailto:info@taxgoglobal.com"
                    >
                      info@taxgoglobal.com
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiGlobe size={26} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    www.taxgoglobal.com
                  </div>
                </div>
              </div>


              <div className="contact-box-sub">
                <br />
                <br />
                <div className="contact-box2">
                  <CiLocationOn size={27} color="#ff9800 " />
                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="https://www.google.com/maps/dir//west,+Kaithapoyil+Bridge,+Kaithappoyil,+kozhikode,+Kerala+673586/@11.4825334,75.9120231,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3ba66deaf70c83cd:0x6cca385417bef6b5!2m2!1d75.9944353!2d11.4825683?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D"
                    >
            {t("home_page.homepage.address4")}
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <IoCallOutline size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    {" "}
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="tel:+91-7025001001"
                    >
                      +91-7025001001
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiMail size={23} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    <a
                      style={{ color: "black", textDecoration: "none" }}
                      href="mailto:info@taxgoglobal.com"
                    >
                      info@taxgoglobal.com
                    </a>
                  </div>
                </div>
                <br />
                <div className="contact-box2">
                  <CiGlobe size={26} color="#ff9800 " />

                  <div style={{ paddingLeft: "10px", color: "black" }}>
                    www.taxgoglobal.com
                  </div>
                </div>
              </div>
            </Col>

            {/* new update  */}

            <Col md={6}>
              <div className="contact-box-sub">
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value="Product">
                    {t("home_page.homepage.product_switch")}
                  </Radio>
                  <Radio value="Remote">
                    {t("home_page.homepage.product_Remote")}
                  </Radio>
                  <Radio value="Tickets">
                    {t("home_page.homepage.product_Tickets")}
                  </Radio>
                  <Radio value="Support">
                    {t("home_page.homepage.product_Contact")}
                  </Radio>
                  <Radio value="Escalate">
                    {t("home_page.homepage.product_Escalate")}
                  </Radio>
                </Radio.Group>
                <br />
                <br />
                <br />
                <label className="formLabel">
                  {t("home_page.homepage.name")}
                </label>
                <Form.Item name="fullname">
                  <Input type="text" size="large" />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Email")}
                </label>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input size="large"></Input>
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.mobile")}
                </label>
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your number",
                    },
                  ]}
                >
                  <InputNumber
                    type="number"
                    size="large"
                    controls={false}
                    style={{ width: "100%" }}
                  ></InputNumber>
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.message")}
                </label>
                <Form.Item
                  name="message"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a message!",
                    },
                    {
                      min: 5,
                      message: "Message must be at least 5 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    style={{ width: "100%" }}
                    rows={3}
                  ></Input.TextArea>
                </Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="contactBox-btn"
                  loading={isLoading}
                >
                  {t("home_page.homepage.send_message")}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
      <Whatsapp />
      {/* <ChatBot /> */}
      <br />
      <WebsiteFooter />
    </div>
  );
}

export default withTranslation()(Contact);
