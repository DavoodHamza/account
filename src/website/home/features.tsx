import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import cardimg1 from "../../assets/images/Frame 265.webp";
import cardimg2 from "../../assets/images/Group 132.webp";
import cardimg3 from "../../assets/images/Group 133.webp";
import cardimg4 from "../../assets/images/Group 134.webp";
import cardimg5 from "../../assets/images/Group 135.webp";
import "./styles.scss";
function Features(props: any) {
  const { t } = props;
  const data = [
    {
      icon: cardimg1,
      text: `${t("home_page.homepage.VAT_head")}`,
      description: `${t("home_page.homepage.VAT_body")}`,
    },
    {
      icon: cardimg2,
      text: `${t("home_page.homepage.Manage_head")}`,
      description: `${t("home_page.homepage.Manage_body")}`,
      backgroundcolour: "#F4F6F8",
    },
    {
      icon: cardimg3,
      text: `${t("home_page.homepage.Accounting_head")}`,
      description: `${t("home_page.homepage.Accounting_body")}`,
    },
    {
      icon: cardimg4,
      text: `${t("home_page.homepage.Analyse_head")}`,
      description: `${t("home_page.homepage.Analyse_body")}`,
      backgroundcolour: "#F4F6F8",
    },
    {
      icon: cardimg5,
      text: `${t("home_page.homepage.Reccurring_head")}`,
      description: `${t("home_page.homepage.Reccurring_body")}`,
    },
    {
      icon: cardimg3,
      text: `${t("home_page.homepage.Delivery_head")}`,
      description: `${t("home_page.homepage.Delivery_body")}`,
      backgroundcolour: "#F4F6F8",
    },
  ];
  return (
    <div>
      <Container>
        <div className="features-Box1">
          <div className="features-Box2">
            <br />
            <br />
            <div className="features-heading1">
              {t("home_page.homepage.The_features_we_provide")}
            </div>
            <br />
            <br />

            <Row>
              {data.map((item, index) => (
                <Col md={4} key={index} style={{ marginBottom: 20 }}>
                  <div
                    className="features-Box5"
                    style={{ backgroundColor: `${item.backgroundcolour}` }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img className="Features-img" src={item.icon} />
                      <span className="FeaturesCard-heading">{item.text}</span>
                    </div>
                    <div className="FeaturesCard-text">{item.description}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
}

export default withTranslation()(Features);
