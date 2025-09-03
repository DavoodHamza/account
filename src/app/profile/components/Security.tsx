import React, { useState } from "react";
import { Button, Form, Input, Card, Alert, notification } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { POST } from "../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";

function Security(props: any) {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [passwordValidation, setPasswordValidation] = useState<any>({
    status: "",
    help: "",
  });
  const { t } = useTranslation();

  const [form] = useForm();

  const onFinish = async (values: any) => {
    const { oldPassword, newPassword } = values;
    try {
      setLoading(true);
      const url = API.UPDATE_PASSWORD;
      const data = {
        password: oldPassword,
        password_new: newPassword,
        userid: user.id,
      };
      const response: any = await POST(url, data);
      if (response?.status) {
        notification.success({
          message: `${t("home_page.homepage.Updated_Password")}`,
          description: `${t("home_page.homepage.Your_Password_has")}`,
        });
        props.onChange();
      } else {
        notification.error({
          message: `${t("home_page.homepage.error")}`,
          description: `${t("home_page.homepage.failed_to_update_password")}(${response?.message
            })`,
        });
      }
    } catch (error) {
      console.error(error, `${t("home_page.homepage.something_went_wrong")}`);
      notification.error({
        message: `${t("home_page.homepage.error")}`,
        description: `${t("home_page.homepage.failed_to_update_password")}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (value: any) => {
    const minLength = 8;
    const specialCharacterRegex = /[.*@!#%&()^~]/;
    const digitRegex = /\d/;

    const oldPassword = form.getFieldValue("oldPassword");

    if (value.length < minLength) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Password_must_characters"),
      });
    } else if (!specialCharacterRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Passwordspecial_character"),
      });
    } else if (!digitRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Change_Password"),
      });
    } else {
      if (value === oldPassword) {
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
    }
  };

  const compareToFirstPassword = (item: any, value: any) => {
    const targetField =
      item.field === "confirmPassword" ? "newPassword" : "confirmPassword";
    const firstPassword = form.getFieldValue(targetField);

    if (value && value !== firstPassword) {
      return Promise.reject("The two passwords do not match!");
    }

    return Promise.resolve();
  };

  return (
    <Container>
      <Card>
        <div className="security-Txt1">
          {t("home_page.homepage.Change_Password")}
        </div>
        <br />
        <Form onFinish={onFinish} form={form}>
          <Row>
            <Col md={5}>
              <label className="formLabel">
                {t("home_page.homepage.OLD_PASSWORD")}
              </label>
              <Form.Item
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your old password!",
                  },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <label className="formLabel">
                {t("home_page.homepage.NEW_PASSWORD")}
              </label>
              <Form.Item
                name="newPassword"
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
                  size="large"
                  onChange={(e) => validatePassword(e.target.value)}
                />
              </Form.Item>

              <label className="formLabel">
                {t("home_page.homepage.CONFIRM_NEW_PASSWORD")}
              </label>
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    validator: compareToFirstPassword,
                  },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Row>
                <Col md={7}>
                    <Button
                      htmlType="submit"
                      size="large"
                      type="primary"
                      block
                      loading={loading}
                    >
                      {t("home_page.homepage.Change_Password")}
                    </Button>
                </Col>
                <Col md={5}></Col>
              </Row>
            </Col>
            <Col md={7}>
              <Alert
                message={<b>{t("home_page.homepage.PASSWORD_REQUIREMENTS")}</b>}
                description={
                  <div>
                    <p>{t("home_page.homepage.TO_CREATE_A")}</p>
                    <p>{t("home_page.homepage.Minimum_8_characters")}</p>
                    <p>{t("home_page.homepage.At_least_one")}</p>
                    <p>{t("home_page.homepage.At_least_one_number")}</p>
                    <p>{t("home_page.homepage.Cant_be_the_same")}</p>
                  </div>
                }
                type="info"
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}

export default Security;
