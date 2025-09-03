import { Col, Row } from "antd";
import { withTranslation } from "react-i18next";
import img1 from "../../../assets/images/img1.webp";
import img2 from "../../../assets/images/img2.webp";
import img3 from "../../../assets/images/img3.webp";
import img4 from "../../../assets/images/img4.webp";
import img5 from "../../../assets/images/img5.webp";
import img6 from "../../../assets/images/img6.webp";
import img7 from "../../../assets/images/img7.webp";
import img8 from "../../../assets/images/img8.webp";
import "../../consulting/style.scss";

function CardsPage(props: any) {
  const { t } = props;
  const cardsArray = [
    {
      image: img1,
      textTaitil: `${t("home_page.homepage.FINANCIAL_ANALYSIS_head")}`,
      text: `${t("home_page.homepage.STRATEGIC_PLANNING_body")}`,
    },
    {
      image: img2,
      textTaitil: `${t("home_page.homepage.REGULATORY_COMPLIANCE_head")}`,
      text: `${t("home_page.homepage.REGULATORY_COMPLIANCE_body")}`,
      border: "1px solid #D3D3D3",
      BackgroundColor: "#ffff",
    },
    {
      image: img3,
      textTaitil: `${t("home_page.homepage.COST_MANAGEMENT_head")}`,
      text: `${t("home_page.homepage.COST_MANAGEMENT_body")}`,
    },
    {
      image: img4,
      textTaitil: `${t("home_page.homepage.SYSTEMS_IMPLEMENTATION_head")}`,
      text: `${t("home_page.homepage.SYSTEMS_IMPLEMENTATION_body")}`,
      border: "1px solid #D3D3D3",

      BackgroundColor: "#ffff",
    },
    {
      image: img5,
      textTaitil: `${t("home_page.homepage.RISK_MANAGEMENT_head")}`,
      text: `${t("home_page.homepage.RISK_MANAGEMENT_body")}`,
    },
    {
      image: img6,
      textTaitil: `${t("home_page.homepage.STRATEGIC_PLANNING_head")}`,
      text: `${t("home_page.homepage.STRATEGIC_PLANNING_body")}`,
      border: "1px solid #D3D3D3",

      BackgroundColor: "#ffff",
    },
    {
      image: img7,
      textTaitil: `${t("home_page.homepage.PERFORMANCE_MEASUREMENT_head")}`,
      text: `${t("home_page.homepage.PERFORMANCE_MEASUREMENT_body")}`,
    },
    {
      image: img8,
      textTaitil: `${t("home_page.homepage.AUDIT_SUPPORT_head")}`,
      text: `${t("home_page.homepage.AUDIT_SUPPORT_body")}`,
      BackgroundColor: "#ffff",
      border: "1px solid #D3D3D3",
    },
    {
      text: `${t("home_page.homepage.In_summary")}`,
    },
  ];
  return (
    <div className="CardsPage-coveringDiv">
      <div className="CardsPage-mainHeader">
        {t("home_page.homepage.Here_are_some_key")}
      </div>
      <Row gutter={[16, 16]}>
        {cardsArray.map((item: any, index: any) => (
          <Col lg={8} md={12} sm={24} xs={24}>
            <div
              className="CardsPage-cardDiv h-100"
              style={{
                backgroundColor: item.BackgroundColor,
                border: item.border,
              }}
            >
              {index === 8 ? (
                ""
              ) : (
                <img
                  style={{
                    width: "100%",
                    borderTopRightRadius: "8px",
                    borderTopLeftRadius: "8px",
                  }}
                  src={item?.image}
                />
              )}

              <div className="Cardspage-cradTextDiv">
                {index === 8 ? (
                  ""
                ) : (
                  <div className="CardsPage-cardTaitil">{item.textTaitil}</div>
                )}
                <div
                  className={
                    index === 8
                      ? "CardsPage-cardtextOnly CardsPage-cardtext"
                      : "CardsPage-cardtext"
                  }
                >
                  {item.text}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default withTranslation()(CardsPage);
