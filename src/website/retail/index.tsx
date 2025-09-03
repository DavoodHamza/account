import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import image1 from "../../assets/images/appstore.webp";
import backendimg from "../../assets/images/backendimg.webp";
import image from "../../assets/images/device mockup 1.webp";
import invoicimgimg from "../../assets/images/invoiceimg.webp";
import navigation from "../../assets/images/navigationimg.webp";
import notificationimg from "../../assets/images/notificationimg.webp";
import image2 from "../../assets/images/playstore (1).webp";
import paymentimg from "../../assets/images/qrpaymentimg.webp";
import retailimg from "../../assets/images/retaillanding.webp";
import image3 from "../../assets/images/Rx.webp";
import staticsimg from "../../assets/images/statisticsimg.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import "./styles.scss";
function Retail(props: any) {
  const { t } = props;
  const FeaturesCard = [
    {
      Img: paymentimg,
      Text: `${t("home_page.homepage.QR_Payment")}`,
    },
    {
      Img: invoicimgimg,
      Text: `${t("home_page.homepage.Invoicing")}`,
    },
    {
      Img: backendimg,
      Text: `${t("home_page.homepage.Powerful_Backend")}`,
    },
    {
      Img: staticsimg,
      Text: `${t("home_page.homepage.Real_Time_Statistics")}`,
    },
    {
      Img: notificationimg,
      Text: `${t("home_page.homepage.Push_Notifications")}`,
    },
    {
      Img: navigation,
      Text: `${t("home_page.homepage.simple_navigations")}`,
    },
  ];
  return (
    <div className="website-screens">
      <WebsiteHeader />
      <Container>
        <div className="Retail-Box1">
          <div className="Retail-Box2">
            <Row className="gy-5">
              <Col lg={6} md={12}>
                <div className="Retail-Box4">
                  <div className="Retail-Box3">
                    {t("home_page.homepage.FREE_Accounting_App_head1")}
                    <br />
                    {t("home_page.homepage.FREE_Accounting_App_head2")}
                  </div>
                  <br />
                  <div className="Retail-Box5">
                    {t("home_page.homepage.Retail_Xpress")}
                  </div>

                  <div className="Retail-Box6">
                    {t("home_page.homepage.Remove_high")}
                  </div>
                  <br />
                  <div className="Retail-Box7">
                    {t("home_page.homepage.Retail_Xpress_is")}
                  </div>
                  <div style={{ display: "flex" }}>
                    <div>
                      <img src={image1} alt="img" />
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <img src={image2} alt="img" />
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <a href="https://retailxpress.net" target="_blank">
                        <img
                          src={image3}
                          alt="img"
                          style={{ width: "100px", height: "auto" }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div>
                  <img className="retail-img" src={retailimg} alt="img" />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <br />
      <div className="retailFeatures-coverDiv">
        <Row className="g-5">
          <Col xl={7} lg={12} className=" order-2 order-xl-1">
            <Row className="g-3">
              {FeaturesCard.map((item: any) => (
                <Col md={4} sm={6}>
                  <div className="retailFeatures-card">
                    <img
                      className="retailFeatures-cardImg"
                      src={item.Img}
                      alt="img"
                    />
                    {item.Text}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xl={5} lg={12} className=" order-1 order-xl-2">
            <div className="retailFeatures-textMainDiv">
              <div className="retailFeatures-taitil">
                {t("home_page.homepage.Perfect_Features_head")}
              </div>
              <div className="retailFeatures-description">
                {t("home_page.homepage.Perfect_Features_body")}
              </div>
              <div>
                <div className="retailFeatures-downloadText">
                  {t("home_page.homepage.Retail_Xpress_is")}
                </div>
                <img style={{ paddingRight: "20px" }} src={image1} alt="img" />
                <img src={image2} alt="img" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Container>
          <div className="retailstayConnected-Box1">
            <br />
            <div className="retailstayConnected-Box2">
              {t("home_page.homepage.Stay_Connected_head")}
            </div>
            <br />
            <div className="retailstayConnected-text1">
              {t("home_page.homepage.Stay_body1")}
              <br />
              {t("home_page.homepage.Stay_body2")}
              <br />
              {t("home_page.homepage.Stay_body3")}
            </div>
            <br />
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                padding: "15px",
              }}
            >
              <div style={{ marginRight: "15px" }}>
                <img src={image1} alt="img" />
              </div>
              <div>
                <img src={image2} alt="img" />
              </div>
              <br />
              <br />
            </div>
            <Row>
              <div className="d-flex justify-content-center">
                <Col md={8} sm={12}>
                  <div>
                    <img src={image} style={{ width: "100%" }} alt="img" />
                  </div>
                </Col>
              </div>
            </Row>
          </div>
        </Container>
      </div>
      <Whatsapp />
      {/* <ChatBot/> */}
      <WebsiteFooter />
    </div>
  );
}

export default withTranslation()(Retail);
