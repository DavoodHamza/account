import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { Button, Card, Form, Input, message, Space } from "antd";
import { InputOTP } from "antd-input-otp";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Auth } from "../../../config/firebase";
import { POST } from "../../../utils/apiCalls";
import PrefixSelector from "../../../components/prefixSelector";
import { useTranslation } from "react-i18next";

function UpdateMobileNumber(props: any) {
  const { t } = useTranslation();
  const User = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [autho, setautho] = useState<any>(null);
  const [data, setdata] = useState<any>({});
  const [verification, setverification] = useState(false);
  const navigate = useNavigate();
  const LoginPhone = async (values: any) => {
    setdata(values);
    try {
      let recaptchaContainer: any = document.getElementById('recaptcha');
      let recaptchas = await new RecaptchaVerifier(Auth, recaptchaContainer, {size:"invisible"});
      // let recaptchas = await new RecaptchaVerifier(Auth, "recaptcha", {size:"invisible"});
      let phone = `${values.code}${values.phonenumber}`;

        let checkPhone: any = await signInWithPhoneNumber(
          Auth,
          phone,
          recaptchas
          );
        setverification(true);
        if (checkPhone?.verificationId) {
          setautho(checkPhone);
        } else {
          message.success(`${t("home_page.homepage.something_went_wrong")}`);
        }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const verifyOtp = async (values: any) => {
    // console.log("verify otp Fn running values : ", values);
    try {
      setIsLoading(true);
      let otp = values.otp.join("");
      // console.log("--------OTP---------", otp);
      let verify = await autho.confirm(otp);
      if (verify?.user?.phoneNumber) {
        updatePhoneNumber();
      }
    } catch (err) {
      setIsLoading(false);
    }
  };
  const updatePhoneNumber = async () => {
    let body = {
      country_code: data?.code,
      phonenumber: data?.phonenumber,
    };
    let url = API.UPDATE_PHONENUMBER + User?.user?.id;
    try {
      const data = await POST(url, body);
      if (data && data) {
        message.success(`${t("home_page.homepage.Updated_phone_number_Successfully")}`);
        navigate("/usr/profile");
        props.onChange();
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };
  return (
    <>
      <Form
        onFinish={verification ? verifyOtp : LoginPhone}
        initialValues={{
          phonenumber: User.user.phonenumber,
          code: User.user.country_code,
        }}
      >
        <Card
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{t("home_page.homepage.Change_Your_Mobile_Number")}</strong>
            </div>
          }
        >
          {verification ? <div style={{paddingBottom:"10px",fontSize:"20px",fontWeight:"normal"}}>{t("home_page.homepage.OTP")}</div> : <div>{t("home_page.homepage.phone_number")}</div>}

          <Space.Compact style={{ width: "100%" }}>
            {verification ? (
              <Form.Item
                style={{ width: "100%" }}
                name="otp"
                rules={[
                  {
                    required: true,
                    message: `${t("home_page.homepage.Input_6_digit_verification_code")}`,
                  },
                ]}
              >
                <div style={{ marginLeft: -50 }}>
                  <InputOTP
                    size="small"
                    autoFocus
                    inputType="numeric"
                    length={6}
                  />
                </div>
              </Form.Item>
            ) : (
              <>
                <Form.Item name="phonenumber" style={{ width: "100%" }}>
                  <Input
                    placeholder={t("home_page.homepage.Mobile_Number")}
                    size="large"
                    addonBefore={<PrefixSelector />}
                    type="text"
                    onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                    /[^0-9]/g,
                    ""
                    );
                }}      
                  />
                </Form.Item>
              </>
            )}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              onClick={verification ? verifyOtp : LoginPhone}
            >
              {verification ? `${t("home_page.homepage.Verify_Phone_number")}` : `${t("home_page.homepage.phone_number")}`}
            </Button>
          </Space.Compact>
          <div id="recaptcha"></div>
        </Card>
      </Form>
    </>
  );
}

export default UpdateMobileNumber;
