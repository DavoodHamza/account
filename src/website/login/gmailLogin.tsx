import { notification, Button, Spin } from "antd";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { withTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";
import { Auth, GoogleProvider } from "../../config/firebase";
import { login, setToken } from "../../redux/slices/userSlice";
import { GETBASEURL, REGISTERPOST } from "../../utils/apiCalls";
import { jwtDecode } from "jwt-decode";

function GmailLogin(props: any) {
  const { t } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginWithGmail = async () => {
    try {
      signInWithPopup(Auth, GoogleProvider).then((res: any) => {
        setIsLoading(true);
        let data = res?._tokenResponse;
        let credentials = {
          email: data?.email,
          idToken: data?.idToken,
        };
        getBaseUrl(credentials);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const LoginEmail = async (values: any, BASEURL: any) => {
    try {
      setIsLoading(true);
      let url = BASEURL + API.LOGIN_GMAIL;
      var loginRes: any = await REGISTERPOST(url, { idToken: values?.idToken });
      if (loginRes.status) {
        dispatch(setToken(loginRes?.data?.token));
        dispatch(login(loginRes?.data));
        notification.success({
          message: "Success",
          description: t("home_page.homepage.logged_successfully"),
        });
        navigate("/company");

        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description: loginRes.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to login,Please try again later",
      });
      navigate("/login");
      setIsLoading(false);
    }
  };

  const getBaseUrl = async (data: any) => {
    let endpoint = "base/active/email/" + data.email;
    const response: any = await GETBASEURL(endpoint, {});
    if (response.status) {
      LoginEmail(data, response?.data?.baseUrl);
    } else {
      notification.error({
        message:
          "Oops! Something went wrong with your sign-In. Please try again later or contact support for help.",
        description: (
          <Button
            type={"link"}
            onClick={() => navigate('/contact')}
          >
            {t("home_page.homepage.click_here")}
          </Button>
        )
      }); 
    }
  };
  return (
    <div className="website-LoginBtn1" onClick={() => loginWithGmail()}>
      {isLoading ? (
        <Spin />
      ) : (
        <FcGoogle size={20} style={{ marginRight: 10 }} />
      )}
      {t("home_page.homepage.Login_with_google")}
    </div>
  );
}

export default withTranslation()(GmailLogin);
