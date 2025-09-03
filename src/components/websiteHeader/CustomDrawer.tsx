import { Button, Drawer, Popover } from "antd";
import { t } from "i18next";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../assets/images/logo2.webp";
import "./styles.scss";

const CustomDrawer = (props: any) => {
  const navigation = useNavigate();
  const location = useLocation();
  const title = (
    <div className="d-flex justify-content-between align-items-center">
      <div onClick={() => navigation("/")}>
        <img className="websiteHeader-logo" src={logo2} alt="logo" />
      </div>
      <AiOutlineCloseCircle
        color={"red"}
        size={"30px"}
        onClick={props.onClose}
      />
    </div>
  );
  const chpath = (path: any) => {
    if (location.pathname === path) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Drawer
        title={title}
        width={280}
        onClose={props.onClose}
        open={props.open}
        closeIcon={false}
        maskClosable={true}
        footer={false}
      >
        <div className="websiteHeader_column">
          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/") ? "#18a762" : "#000" }}
            onClick={() => navigation("/")}
          >
            <div>{t("home_page.homepage.home")}</div>
          </div>
          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/plans") ? "#18a762" : "#000" }}
            onClick={() => navigation("/plans")}
          >
            {t("home_page.homepage.pricing")}
          </div>
          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/services") ? "#18a762" : "#000" }}
            onClick={() => navigation("/services")}
          >
            {t("home_page.homepage.service")}
          </div>

          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/aboutus") ? "#18a762" : "#000" }}
            onClick={() => navigation("/aboutus")}
          >
            {t("home_page.homepage.Aboutus")}
          </div>
          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/news") ? "#18a762" : "#000" }}
            onClick={() => navigation("/news")}
          >
            {t("home_page.homepage.newspage")}
          </div>
          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/suport") ? "#18a762" : "#000" }}
            onClick={() => navigation("/support")}
          >
            {t("home_page.homepage.Support")}
          </div>

          <div
            className="websiteHeader-txt1"
            style={{
              color: chpath("/help-tutorial") ? "#18a762" : "#000",
            }}
            onClick={() => navigation("/help-tutorial")}
          >
            {t("home_page.homepage.help_links")}
          </div>

          <div
            className="websiteHeader-txt1"
            style={{ color: chpath("/contact") ? "#18a762" : "#000" }}
            onClick={() => navigation("/contact")}
          >
            {t("sidebar.title.contact")}
          </div>
          <hr />
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <div className="affiliationPopup">
                <Button
                  type="primary"
                  onClick={() => navigation("/affiliate/create/0")}
                >
                  {t("home_page.homepage.register")}
                </Button>
                <Button onClick={() => navigation("/affiliate-login")}>
                  {t("home_page.homepage.login")}
                </Button>
              </div>
            }
          >
            <Button className="websiteHeader-btn4">
              {" "}
              {t("home_page.homepage.be_Affiliate")}
            </Button>
          </Popover>

          <Popover
            placement="bottom"
            trigger="click"
            content={
              <div className="affiliationPopup">
                <Button
                  type="primary"
                  block
                  onClick={() => navigation("/login")}
                >
                  {t("home_page.homepage.login")}
                </Button>
                <Button
                  block
                  style={{ border: "1px solid #949492" }}
                  onClick={() => navigation("/signup")}
                >
                  {t("home_page.homepage.signup")}
                </Button>
              </div>
            }
          >
            <Button block type="primary" style={{ width: 150 }}>
              {t("home_page.homepage.get_started")}
            </Button>
          </Popover>
        </div>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
