import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import image1 from "../../assets/images/Frame 265.webp";
import image3 from "../../assets/images/Frame 268 (1).svg";
import image2 from "../../assets/images/Frame 268 (1).webp";
import image4 from "../../assets/images/Frame 268 (2).webp";

function Integration(props: any) {
  const { t } = props;
  const data = [
    {
      icon: image1,
      text: `${t("sidebar.title.sale")}`,
      description: `${t("sidebar.title.sale_body")}`,
      backgroundcolour: "#F4F6F8",
    },
    {
      icon: image2,
      text: `${t("home_page.homepage.payroll")}`,
      description: `${t("home_page.homepage.payroll_body")}`,
    },
    {
      icon: image3,
      text: `${t("sidebar.title.purchase")}`,
      description: `${t("sidebar.title.purchase_body")}`,
      backgroundcolour: "#F4F6F8",
    },
    {
      icon: image4,
      text: `${t("sidebar.title.E_Commerce")}`,
      description: `${t("sidebar.title.E_Commerce_body")}`,
    },
  ];
  return (
    <div>
      <Container>
        <div className="integration-Box1">
          <div className="Integration-Box2">
            {t("home_page.homepage.integration")}
          </div>
          <br />
          <Row>
            {data.map((item, index) => (
              <Col className="gy-3" md={3} key={index}>
                <div className="Integration-Box4">
                  <div
                    className="Integration-Box5"
                    style={{ backgroundColor: `${item.backgroundcolour}` }}
                  >
                    <div>
                      <div
                        style={{
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img className="Integration-img" src={item.icon} />
                        <span className="Integration-heading">{item.text}</span>
                      </div>
                    </div>
                    <div className="Integration-text">{item.description}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default withTranslation()(Integration);
