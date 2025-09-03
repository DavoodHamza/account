import { Alert } from "antd";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import taxgologo from "../../assets/images/logo2.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import ConsultingForm from "../consulting/component/ConsultingForm";
import ScheduleDemo from "./components/scheduleDemo";
import DriveUs from "./driveUs";
import Features from "./features";
import Integration from "./integration";
import StayConnected from "./stayConnected";
import "./styles.scss";
import TaxgoSystem from "./taxgoSystem";
import Video from "./video";
function Home(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigate();

  const { t } = props;
  return (
    <div className="website-screens-1">
      <WebsiteHeader />
      <div className="website-Mainbox">
        <div className="website-HomeBox1 ">
          <Container>
            <Row>
              <Col sm={6} className="d-none d-sm-block" />
              <Col sm={6} xs={12} className="d-flex justify-content-end">
                <div className="RetailInfo">
                  <div>
                    {t("home_page.homepage.retail_title1")}
                    <br />
                    {t("home_page.homepage.retail_title2")}

                    <a
                      href="https://www.retailxpress.net/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="RetailLink"
                    >
                      &nbsp;&nbsp;Retail Xpress
                    </a>
                  </div>
                  <a
                    href="https://www.retailxpress.net/"
                    target="_blank"
                    style={{ cursor: "pointer" }}
                  >
                    <IoArrowForwardCircleOutline color="#b0b0b0" size={25} />
                  </a>
                </div>
              </Col>
              <Col className="col-12">
                <Alert
                  className="mt-0 py-0 w-100 py-3"
                  message={t("home_page.homepage.alert")}
                  type="warning"
                  style={{ textAlign: "center" }}
                  showIcon
                  closable
                />
              </Col>

              <Col xs={12} className="blankdiv" />
              <Col sm={10} md={6} xs={12}>
                <div className="website-HomeBox2 ">
                  {/* <div className="website-HomeBoxline">
                    <div className="website-HomeBoxItem">
                      <LiaStoreSolid />
                    </div>
                  </div> */}
                  <br />
                  <div className="website-HomeBoxtxt1">
                    {t("home_page.homepage.simple") +
                      ",  " +
                      t("home_page.homepage.best") +
                      "  &  " +
                      t("home_page.homepage.affordable")}
                    <br />
                    {t("home_page.homepage.accounting") +
                      "  " +
                      t("home_page.homepage.software") +
                      "  " +
                      t("home_page.homepage.solution")}
                  </div>
                  <div className="website-HomeBoxtxt1"></div>

                  <img
                    src={taxgologo}
                    className="website-Homelogo"
                    alt="logo"
                    style={{ marginRight: 20 }}
                  />

                  <br />
                  <Row>
                    <Col md={4} xs={6}>
                      <button
                        //onClick={() => navigation("/contact")}
                        onClick={() => setIsOpen(true)}
                        className="website-HomeBoxBtn1"
                      >
                        {t("home_page.homepage.schedule_demo")}
                      </button>
                    </Col>
                    <Col md={4} xs={6}>
                      <button
                        // onClick={() => navigation("/questionScreen")}
                        onClick={() => navigation("/signup")}
                        className="website-HomeBoxBtn2"
                      >
                        {t("home_page.homepage.Create Account")}
                      </button>
                    </Col>
                  </Row>
                </div>
              </Col>
              {/* <Col sm={6} className="bg-info">
                <div className="website-HomeBox2">
                  <br />
                </div>
              </Col> */}
            </Row>
            {isOpen && <ScheduleDemo isOpen={isOpen} setIsOpen={setIsOpen} />}
          </Container>
        </div>
        <Features />
        <TaxgoSystem />
        <br />
        <br />
        <Integration />
        <br />
        <br />
        <StayConnected />
        <br />
        <br />
        <DriveUs />
        <br />
        <br />
        <br />
        <Video />
        <br />
        <br />
        <ConsultingForm />
      </div>
      {/* <ChatBot /> */}
      <Whatsapp />
      <WebsiteFooter />
    </div>
  );
}

export default withTranslation()(Home);
