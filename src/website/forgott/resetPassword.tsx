import { Button, Form, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Logo2 from "../../assets/images/logo2.webp";
import API from "../../config/api";
import { REGISTERPOST } from "../../utils/apiCalls";
import "./styles.scss";

function ResetPassword(props: any) {
  const { t } = props;

  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [passwordValidation, setPasswordValidation] = useState<any>({
    status: "",
    help: "",
  });
  const [form] = useForm();

  const { token } = useParams();
  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const url = API.RESETPASSWORD;
      const data = {
        password: values?.password,
        token: token,
      };
      const response: any = await REGISTERPOST(API.BASE_URL + url, data);
      if (response.status) {
        setIsLoading(true);
        notification.success({
          message: "Success",
          description: "Your Password has been updated successfully.",
        });
        navigation("/login");
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update password",
        });
      }
    } catch (error) {
      console.error(error, "something went wrong");
      notification.error({
        message: "Server Error",
        description: "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (value: any) => {
    const minLength = 8;
    const specialCharacterRegex = /[.*@!#%&()^~]/;
    const digitRegex = /\d/;

    if (value.length < minLength) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Password_must_characters"),
      });
    } else if (!specialCharacterRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Password_special"),
      });
    } else if (!digitRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.New_password_must"),
      });
    } else {
      setPasswordValidation({
        status: "success",
        help: "",
      });
    }
  };

  const compareToFirstPassword = (item: any, value: any) => {
    const targetField = item.field === "confirm" ? "password" : "confirm";
    const firstPassword = form.getFieldValue(targetField);

    if (value && value !== firstPassword) {
      return Promise.reject("The two passwords do not match!");
    } else {
      return Promise.resolve();
    }
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm={8} style={{ margin: 0, padding: 0 }}>
            <div className="website-ResetPasswordBox1">
              <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
            </div>
          </Col>
          <Col sm={4} style={{ margin: 0, padding: 0 }}>
            <div
              className="website-ResetPasswordBack"
              onClick={() => navigation(-1)}
            >
              <BiArrowBack />
            </div>
            <div className="website-ResetPasswordBox2">
              <div>
                <div className="website-ResetPasswordtxt1">
                  {t("home_page.homepage.new_password")}
                </div>
                <br />
                <div className="website-ResetPasswordtxt2">
                  {t("home_page.homepage.previous_password")}.
                </div>
                <Form onFinish={onFinish} form={form}>
                  <Form.Item
                    name="password"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password!",
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ]}
                    validateStatus={passwordValidation.status}
                    help={passwordValidation.help}
                  >
                    <Input.Password
                      placeholder="New Password"
                      onChange={(e) => validatePassword(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        validator: compareToFirstPassword,
                      },
                    ]}
                  >
                    <Input.Password placeholder="Confirm Password" />
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
                      {t("home_page.homepage.reset_password")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="website-ResetPasswordtxt4">
                {t("home_page.homepage.number_yet")} ?{" "}
                <Button type="link" onClick={() => navigation("/signup")}>
                  {t("home_page.homepage.signup")}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withTranslation()(ResetPassword);
