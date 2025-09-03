import { Button, Checkbox, Form, Input, Radio, notification } from "antd";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";
import {
  login,
  setBaseUrl,
  setToken,
  superAdminLogin,
} from "../../redux/slices/userSlice";
import { REGISTERPOST } from "../../utils/apiCalls";

function EmailLogin(props: any) {
  const { t } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("admin");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const submit = async (values: any, BASEURL: any) => {
    try {
      setIsLoading(true);
      let url =
        values?.type === "staff" ? API.STAFF_EMAIL_LOGIN : API.LOGIN_EMAIL;
      var loginRes: any = await REGISTERPOST(BASEURL + url, {
        ...values,
        ...(values?.type === "staff" ? { isTaxgo: true } : {})
      });
      if (loginRes.status) {
        if (loginRes?.data?.isAdmin) {
          dispatch(superAdminLogin(loginRes?.data));
          dispatch(setToken(loginRes?.data?.token));
          navigate("/admin/dashboard");
          notification.success({
            message: "Success",
            description: "Logged in successfully",
          });
        } else {
          if (loginRes?.data?.isStaff) {
            dispatch(setToken(loginRes?.data?.token));
            dispatch(
              login({
                ...loginRes?.data,
                companyid: loginRes?.data?.staff?.companyid,
              })
            );
            notification.success({
              message: "Success",
              description: "Logged in successfully",
            });
            navigate("/usr/staff-activities");
          } else {
            dispatch(setToken(loginRes?.data?.token));
            dispatch(login(loginRes?.data));
            navigate("/company");
          }
        }
        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description: loginRes?.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: "Failed to login,Please try again later",
      });
      navigate("/login");
    }
  };
  const getBaseUrl = async (data: any) => {
    setIsLoading(true);
    let url = API.MASTER_BASE_URL + "base/staff/activeUrl";
    const response: any = await REGISTERPOST(url, { email: data.email });
    if (response.status) {
      dispatch(setBaseUrl(response?.data?.baseUrl));
      submit(data, response?.data?.baseUrl);
    } else {
      notification.error({
        message:
          "Oops! Something went wrong with your sign-In. Please try again later or  contact support for help.",
        description: (
          <Button type={"link"} onClick={() => navigate("/contact")}>
            Click here
          </Button>
        ),
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form onFinish={getBaseUrl}>
        <Form.Item
          name="type"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: "Please select a user type!",
            },
          ]}
          initialValue={"admin"}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            style={{ width: "100%" }}
          >
            <Radio.Button
              value={"admin"}
              style={{ width: "50%", textAlign: "center" }}
            >
              {t("home_page.homepage.admin")}
            </Radio.Button>
            <Radio.Button
              value={"staff"}
              style={{ width: "50%", textAlign: "center" }}
            >
              {t("home_page.homepage.staff")}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="email"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message:
                userType === "admin"
                  ? `${t("home_page.homepage.Please_input")}`
                  : t("home_page.homepage.Please_input_email"),
            },
          ]}
        >
          <Input
            style={{ width: "100%" }}
            size="large"
            placeholder={
              userType === "admin"
                ? t("home_page.homepage.Enter_email")
                : t("home_page.homepage.Enteremailstaff")
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          style={{ marginBottom: 10 }}
          rules={[
            {
              required: true,
              message: t("home_page.homepage.input_password_"),
            },
          ]}
        >
          <Input.Password
            style={{ width: "100%" }}
            size="large"
            placeholder={t("home_page.homepage.Enter_password")}
          />
        </Form.Item>
        <Row>
          <Col>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>{t("home_page.homepage.Remember_me")}</Checkbox>
            </Form.Item>
          </Col>
          <Col>
            <div
              className="website-Logintxt3"
              onClick={() => navigate("/forgot")}
              style={{ cursor: "pointer" }}
            >
              {t("home_page.homepage.Forgot_Password")}
            </div>
          </Col>
        </Row>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            style={{ height: 45 }}
            htmlType="submit"
            loading={isLoading}
          >
            {t("home_page.homepage.Sign_In")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default withTranslation()(EmailLogin);
