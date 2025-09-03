import { Button, Form, Input, Select, notification } from "antd";
import { InputOTP } from "antd-input-otp";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
import API from "../../config/api";
import Country from "../../config/countryCode.json";
import { Auth } from "../../config/firebase";
import { login, setBaseUrl, setToken } from "../../redux/slices/userSlice";
import { GETBASEURL, REGISTERPOST } from "../../utils/apiCalls";
import { jwtDecode } from "jwt-decode";
function PhoneLogin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verification, setverification] = useState(false);
  const [data, setdata] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isResend, setIsResend] = useState<any>(null);
  const [autho, setautho] = useState<any>(null);
  const [seconds, setSeconds] = useState(59);
  const LoginPhone = async (values: any) => {
    try {
      setdata(values);
      setIsLoading(true);
      setError("");
      let recaptchas = await new RecaptchaVerifier(Auth, "recaptcha", {
        size: "invisible",
      });
      let phone = `${values.code}${values.phone}`;
      let checkPhone: any = await signInWithPhoneNumber(
        Auth,
        phone,
        recaptchas
      );
      if (checkPhone?.verificationId) {
        setautho(checkPhone);
        setverification(true);
        setSeconds(59);
      } else {
        setError("Somehting went wrong");
      }
      setIsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      // notification.error({
      //   message: "reCAPTCHA has expired. Please reload the page.",
      // });
      if (
        err.message === "reCAPTCHA has already been rendered in this element"
      ) {
        notification.error({
          message: "reCAPTCHA has expired. Please reload the page.",
        });
        window.location.reload()
      }
      setverification(false);
      setIsLoading(false);
      setError("Somehting went wrong");
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);
  const verifyOtp = async (values: any) => {
    try {
      setIsLoading(true);
      let otp = values.otp.join("");
      let verify = await autho.confirm(otp);
      if (verify?.user?.phoneNumber) {
        getBaseUrl(data);
      }
    } catch (err: any) {
      console.error("Error during OTP verification:", err.code);
      setIsResend(true)
      if (err.code === "auth/missing-code") {
        notification.error({
          message: "Verification code is missing. Please enter a valid code.",
        });
      } else if (err.code === "auth/invalid-verification-code") {
        notification.error({
          message: "Invalid verification code. Please enter a valid code.",
        });
      } else if (err.code === "auth/code-expired") {
        notification.error({
          message: "Verification code has expired. Please request a new one.",
        });
      } else {
        console.log(err);
      }
      setIsLoading(false);
    }
  };
  const onPhoneLogin = async (BASEURL: any) => {
    try {
      setIsLoading(true);
      let url = BASEURL + API.LOGIN_PHONE;
      let body = {
        code: data?.code,
        phone: data?.phone,
      };
      const loginRes: any = await REGISTERPOST(url, body);
      if (loginRes.status) {
        dispatch(setToken(loginRes?.data?.token));
        dispatch(login(loginRes?.data));
        navigate("/company");
        notification.success({
          message: "Success",
          description: "Logged in successfully",
        });
        setIsLoading(false);
      } else {
        notification.error({
          message: "Error",
          description: loginRes.message,
        });
        setIsLoading(true);
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Server Error",
        description: "Failed to login,Please try again later",
      });
    }
  };
  const getBaseUrl = async (data: any) => {
    var url = API.BASE_URL;
    let endpoint = "base/active/phoneNumber/" + data.phone;
    const response: any = await GETBASEURL(endpoint, {});
    if (response.status) {
      notification.success({
        message: "Success",
        description: "Logged in successfully",
      });
      dispatch(setBaseUrl(response?.data?.baseUrl));
      onPhoneLogin(response?.data?.baseUrl);

    } else {
      notification.error({
        message:
          "Oops! Something went wrong with your sign-In. Please try again later or contact support for help.",
        description: (
          <Button
            type={"link"}
            onClick={() => navigate('/contact')}
          >Click here</Button>
        )
      });
    }
  };
  const Selector = (
    <Form.Item name="code" noStyle>
      <Select style={{ width: 85 }} size="large" showSearch={true}>
        {Country.map((item: any) => {
          return (
            <Select.Option key={item.dial_code} value={item.dial_code}>
              {item.dial_code}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  return (
    <>
      <Form
        onFinish={verification ? verifyOtp : LoginPhone}
        initialValues={{ code: "+91" }}
      >
        {verification ? (
          <>
            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.input_digits"),
                },
              ]}
            >
              <InputOTP autoFocus inputType="numeric" length={6} />
            </Form.Item>
            {/* <div
              onClick={() => console.log("thameem")}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                color: seconds <= 0 ? "blue" : "grey",
                cursor: seconds <= 0 ? "pointer" : "not-allowed",
              }}
            >
              Resend OTP ({`${seconds}s`})
            </div> */}
          </>
        ) : (
          <>
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.input_phone_number")
                },
              ]}
            >
              <Input
                addonBefore={Selector}
                style={{ width: "100%" }}
                size="large"
                placeholder={t("home_page.homepage.Enter_Phone_Number")}
                type="number"
              />
            </Form.Item>
            <div id="recaptcha"></div>
          </>
        )}
        <Form.Item>
          <Button
            loading={isLoading}
            block
            size="large"
            type="primary"
            htmlType="submit"
            style={{ height: 45 }}
            onClick={verification ? verifyOtp : LoginPhone}
          >
            {verification ? t("home_page.homepage.login") : t("home_page.homepage.get_otp")}
          </Button>
        </Form.Item>
      </Form>
      {isResend ? (
        <>
          <Button
            block
            size="large"
            style={{ height: 45 }}
            onClick={LoginPhone}
          >
            {t("home_page.homepage.resend_otp")}
          </Button>
          <br />
          <br />
        </>
      ) : null}
    </>
  );
}
export default withTranslation()(PhoneLogin);
