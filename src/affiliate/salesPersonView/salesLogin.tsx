import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Logo2 from "../../assets/images/logo2.webp";
import Whatsapp from "../../components/whatsapp";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, notification } from "antd";
import { t } from "i18next";
import API from "../../config/api";
import { REGISTERGET } from "../../utils/apiCalls";
import { useDispatch } from "react-redux";
import { salesPersonLogin } from "../../redux/slices/userSlice";

const SalesPersonLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      let url = API.BASE_URL + API.AFFILIATE_LOGIN + values?.affiliationCode;
      var response: any = await REGISTERGET(url, null);
      if (response.status) {
        dispatch(salesPersonLogin(response.data));
        navigate(`/affiliate-details`);
        notification.success({
          message: "Success",
          description: "Logged in Sucessfully",
        });
      } else {
        notification.error({
          message: "Failed",
          description: "Invalid Credentials",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed",
        description: "Failed to Login,Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={8} style={{ margin: 0, padding: 0 }}>
            <div className="website-SignupBox1">
              <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
            </div>
          </Col>
          <Col sm={4} style={{ margin: 0, padding: 0 }}>
            <div className="website-SignupBack" onClick={() => navigate(-1)}>
              <BiArrowBack />
            </div>
            <div className="website-SignupBox2">
              <div className="website-Signuptxt1">Affiliate Login</div>
              <br />

              <Form onFinish={onFinish}>
                <Form.Item
                  name="affiliationCode"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your code!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter your code" />
                </Form.Item>

                <Button
                  block
                  size="large"
                  type="primary"
                  style={{ height: 45, marginTop: 5 }}
                  htmlType="submit"
                  loading={isLoading}
                >
                  {t("home_page.homepage.submit")}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Whatsapp />
    </>
  );
};

export default SalesPersonLogin;
