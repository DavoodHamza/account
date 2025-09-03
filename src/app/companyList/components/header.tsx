import "../styles.scss";
import { BiUser } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { Select, notification } from "antd";
import Clock from "react-live-clock";
import { IoHelpCircleOutline, IoCalculatorOutline } from "react-icons/io5";
import { Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { storeDirection } from "../../../redux/slices/languageSlice";
import Calculator from "../../../components/calculator";
import ProfileBox from "../../../navigation/components/profileBox";
import logo2 from "../../../assets/images/logo2.webp";
import { logout } from "../../../redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function CompanyHeader(props: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const dispatch = useDispatch();
  function handleChangeLanguage(language: string) {
    i18next.changeLanguage(language);
    if (language === "ar") {
      dispatch(storeDirection("RTL"));
    } else {
      dispatch(storeDirection("LTR"));
    }
  }

  const signoutUser = () => {
    notification.warning({
      message: `Your Session Expired`,
      description: "Please sign in again to continue",
    });
    dispatch(logout(null));
    navigate("/");
    return;
  };
  const Token = useSelector((state: any) => state?.User?.user?.token);
  if (Token) {
    const decoded: any = jwtDecode(Token);
    let currentDate = new Date();
    if (decoded.exp && decoded.exp * 1000 < currentDate.getTime()) {
      signoutUser();
    }
  }

  return (
    <div
      className="Navigation-Header"
      style={{ paddingBottom: 10, paddingTop: 10, border: 0 }}
    >
      <div className="Navigation-HeaderBox">
        <img
          className="Header-logo"
          // style={{ width: 200, height: 60, objectFit: "cover" }}
          src={logo2}
          alt="logo2"
        />
      </div>
      <div className="Navigation-HeaderBox">
        <Popover content={<Calculator />} placement="bottomRight">
          <div className="Navigation-HeaderIcon2 calculatorIcon">
            <IoCalculatorOutline />
          </div>
        </Popover>
        <div style={{ marginRight: 10 }}>
          <Select
            onChange={handleChangeLanguage}
            style={{ width: 100 }}
            defaultValue={"English"}
          >
            <Select.Option value={"en"}>English</Select.Option>
            <Select.Option value={"ar"}>Arabic</Select.Option>
            <Select.Option value={"hi"}>Hindi</Select.Option>
            <Select.Option value={"fr"}>French</Select.Option>
            <Select.Option value={"mn"}>Mongolian</Select.Option>
          </Select>
        </div>
        <div className="Navigation-HeaderTimeBox">
          <Clock format={"h:mm:ss A"} ticking={true} />
        </div>
        <div
          className="Navigation-HeaderIcon2 helpIcon"
          onClick={() => props.help()}
        >
          <IoHelpCircleOutline />
        </div>
        <div
          className="Navigation-HeaderIcon2"
          onClick={() => props.notification()}
        >
          <MdNotifications />
        </div>
        <Popover
          content={<ProfileBox val={1} type={props?.type} />}
          placement="bottomRight"
        >
          <div className="Navigation-HeaderBox">
            <div className="Navigation-HeaderIcon1">
              {user?.image == null || user?.image == "" ? (
                <BiUser />
              ) : (
                <div>
                  <img
                    src={user?.image}
                    className="sider-profile-img"
                    style={{ padding: 0 }}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div>
              <div className="Navigation-Headertxt1">
                {props?.type === "affiliate"
                  ? user?.name
                  : user?.isStaff
                  ? `${user?.staff?.name}`
                  : user?.fullName}
              </div>
              <div className="Navigation-Headertxt2">
                {props?.type === "affiliate"
                  ? "Affiliate"
                  : user?.isStaff
                  ? "Staff"
                  : "User"}
              </div>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}

export default CompanyHeader;
