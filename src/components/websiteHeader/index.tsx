import { MenuOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../assets/images/logo2.webp";
import LanguageSwitcher from "../../language/LanguageSwitcher";
import CustomDrawer from "./CustomDrawer";
import "./styles.scss";
function WebsiteHeader(props: any) {
  const { t } = props;
  const navigation = useNavigate();
  const location = useLocation();
  const [isTop, setTop] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const tsTop = window.scrollY < 100;
      if (tsTop !== isTop) {
        setTop(tsTop);
      }
    });
  });
  const chpath = (path: any) => {
    if (location.pathname === path) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div
      className={
        props.white
          ? "websiteHeader scrolled"
          : isTop
          ? "websiteHeader"
          : "websiteHeader scrolled"
      }
    >
      <Row>
        <div className="mainHeader_Parent">
          <Col sm={1} xs={2}>
            <div onClick={() => navigation("/")}>
              <img className="websiteHeader-logo" src={logo2} alt="logo" />
            </div>
          </Col>
          <Col md={6} xs={0}>
            <div className="websiteHeader-row">
              <div></div>
              <div></div>
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/") ? "#18A762" : "#000" }}
                onClick={() => navigation("/")}
              >
                <div>{t("home_page.homepage.home")}</div>
              </div>
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/plans") ? "#18A762" : "#000" }}
                onClick={() => navigation("/plans")}
              >
                {t("home_page.homepage.pricing")}
              </div>
              {/* <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/services") ? "#18A762" : "#000" }}
                onClick={() => navigation("/services")}
              >
                {t("home_page.homepage.service")}
              </div> */}
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/aboutus") ? "#18A762" : "#000" }}
                onClick={() => navigation("/aboutus")}
              >
                {t("home_page.homepage.Aboutus")}
              </div>
              {/* <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/news") ? "#18A762" : "#000" }}
                onClick={() => navigation("/news")}
              >
                {t("home_page.homepage.newspage")}
                
              </div> */}
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/our_Products") ? "#18A762" : "#000" }}
                onClick={() => navigation("/our_Products")}
              >
                {t("OurProducts")}
              </div>

              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/support") ? "#18A762" : "#000" }}
                onClick={() => navigation("/support")}
              >
                {t("home_page.homepage.Support")}
              </div>
              <div
                className="websiteHeader-txt1"
                style={{
                  color: chpath("/help-tutorial") ? "#18A762" : "#000",
                }}
                onClick={() => navigation("/help-tutorial")}
              >
                {t("home_page.homepage.help_links")}
              </div>
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/contact") ? "#18A762" : "#000" }}
                onClick={() => navigation("/contact")}
              >
                {t("sidebar.title.contact")}
              </div>
              <div></div>
              <div
                className="websiteHeader-txt1"
                style={{ color: chpath("/login") ? "#18A762" : "#000" }}
                onClick={() => navigation("/login")}
              >
                {t("home_page.homepage.Sign_in")}
              </div>
            </div>
          </Col>
          <Col md={3} xs={0}>
            <div className=" login_session ">
              <Button
                className="websiteHeader-btn2"
                onClick={() => navigation("/signup")}
              >
                {t("home_page.homepage.get_started")}
              </Button>
              <Popover
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
                placement="bottom"
              >
                <Button className="websiteHeader-btn4">
                  {" "}
                  {t("home_page.homepage.be_Affiliate")}
                </Button>
              </Popover>
            </div>
          </Col>
          <Col md={1} sm={3} xs={4}>
            <div className="d-flex align-items-center justify-content-around  gap-2">
              <div>
                <LanguageSwitcher />
              </div>
              <div className="menuIcon">
                <MenuOutlined
                  style={{ fontSize: 25, color: "#000" }}
                  onClick={() => setIsOpen(true)}
                />
              </div>
            </div>
          </Col>
          {isOpen && (
            <CustomDrawer
              open={isOpen}
              chatpath={(val: any) => chpath(val)}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      </Row>
    </div>
  );
}
export default withTranslation()(WebsiteHeader);
