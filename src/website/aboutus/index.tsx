import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import Emeka from "../../assets/images/emeka-img.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";

import "./styles.scss";

function AboutUs(props: any) {
  const { t } = props;
  return (
    <div className="website-screens bg-image">
      <WebsiteHeader />
      <Container>
        <Row style={{ paddingBottom: 20, paddingTop: 20 }}>
          <Col md={{ span: 8, order: 1 }} xs={{ order: 2 }}>
            <h5 className="about-title">{t("home_page.homepage.About_us")}</h5>
            <p className="about-paragraph">{t("home_page.homepage.emeka")}.</p>
            <p className="about-paragraph">{t("home_page.homepage.Driven")}.</p>
            <p className="about-paragraph">
              {t("home_page.homepage.oppertunity")}.
            </p>
            <p className="about-paragraph">
              {t("home_page.homepage.ambition")}.
            </p>
            <p className="about-paragraph">{t("home_page.homepage.content")}</p>
            <p className="about-paragraph">
              {t("home_page.homepage.visionary")}.{" "}
            </p>
            <p className="about-paragraph">{t("home_page.homepage.pursuit")}</p>
            <h6 className="about-end">{t("home_page.homepage.dublin")}.</h6>
          </Col>
          <Col md={{ span: 3, offset: 1 }} xs={{ order: 1 }}>
            <div className="aboutImage">
              <img src={Emeka} alt="emeka" style={{ width: "100%" }} />
            </div>
          </Col>
        </Row>
      </Container>
      <Whatsapp />
      <WebsiteFooter />
    </div>
  );
}

export default withTranslation()(AboutUs);
