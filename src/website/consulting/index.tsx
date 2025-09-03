import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import rectangle from "../../assets/images/Rectangle 67.webp";
import ladyimg from "../../assets/images/smiling-confident-businesswoman-posing-with-arms-folded 1.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import "../consulting/style.scss";
import CardsPage from "./component/CardsPage";
import ConsultingForm from "./component/ConsultingForm";

function Consulting(props: any) {
  const { t } = props;
  return (
    <>
      <div className="Consulting-componentBg">
        <WebsiteHeader />
        <Container>
          <Row>
            <Col lg={6} xs={12}>
              <div className="Consulting-ladyImgDiv">
                <img className="Consulting-ladyImg" src={ladyimg} />
              </div>
            </Col>
            <Col lg={6} xs={12}>
              <div className="Consulting-mainTextDiv">
                <div className="Consulting-Header1">
                  {t("home_page.homepage.Accounting_consulting_head")}
                </div>
                <div className="Consulting-miniText">
                  {t("home_page.homepage.Accounting_consulting_body")}
                </div>
                <div className="Consulting-Header1 Consulting-Header2">
                  {t("home_page.homepage.what_we_do_head")}
                </div>
                <div>
                  <div className="Consulting-miniText">
                    <div style={{ paddingRight: "15px" }}>
                      <img src={rectangle} />
                    </div>{" "}
                    {t("home_page.homepage.what_we_do_body1")}
                  </div>
                  <div className="Consulting-miniText">
                    <div style={{ paddingRight: "15px" }}>
                      <img src={rectangle} />
                    </div>{" "}
                    {t("home_page.homepage.what_we_do_body2")}
                  </div>
                  <div className="Consulting-miniText">
                    <div style={{ paddingRight: "15px" }}>
                      <img src={rectangle} />
                    </div>{" "}
                    {t("home_page.homepage.what_we_do_body3")}
                  </div>
                  <div className="Consulting-miniText">
                    <div style={{ paddingRight: "15px" }}>
                      <img src={rectangle} />
                    </div>
                    {t("home_page.homepage.what_we_do_body4")}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <CardsPage />
      <ConsultingForm />
      <Whatsapp />
      {/* <ChatBot/> */}
      <WebsiteFooter />
    </>
  );
}

export default withTranslation()(Consulting);
