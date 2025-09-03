import { Button, Form, Input, notification } from "antd";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Logo2 from "../../assets/images/logo2.webp";
import Whatsapp from "../../components/whatsapp";
import API from "../../config/api";
import { REGISTERPOST } from "../../utils/apiCalls";
import "./styles.scss";

function Forgott(props: any) {
  const { t } = props;
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const url = API.FORGOTPASSWORD;
      const data = {
        email: values.email,
        // password_new: newPassword,
        // userid: user.id,
      };
      const response: any = await REGISTERPOST(API.BASE_URL + url, data);
      if (response.status) {
        notification.success({
          message: "Password Changing",
          description: "A mail has been sent to your Email.",
        });
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.error(error, "something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm={8} style={{ margin: 0, padding: 0 }}>
            <div className="website-ForgotBox1">
              <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
            </div>
          </Col>
          <Col sm={4} style={{ margin: 0, padding: 0 }}>
            <div className="website-ForgotBack" onClick={() => navigation(-1)}>
              <BiArrowBack />
            </div>
            <div className="website-ForgotBox2">
              <div>
                <div className="website-Forgottxt1">
                  {" "}
                  {t("home_page.homepage.Forgott_Password")}?{" "}
                </div>
                <br />
                <div className="website-Forgottxt2">
                  {t("home_page.homepage.associated")}
                </div>
                <Form onFinish={onFinish}>
                  <Form.Item name="email">
                    <Input placeholder={t("home_page.homepage.Enter_email")} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      block
                      size="large"
                      type="primary"
                      htmlType="submit"
                      style={{ height: 45 }}
                      loading={isLoading}
                    >
                      {t("home_page.homepage.reset")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="website-Forgottxt4">
                {" "}
                <span
                  className="website-Forgottxt3"
                  onClick={() => navigation("/signup")}
                  style={{ cursor: "pointer" }}
                >
                  {t("home_page.homepage.signup")}?
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Whatsapp />
    </div>
  );
}

export default withTranslation()(Forgott);
