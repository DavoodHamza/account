import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import bussiness from "../../assets/images/bussiness.webp";
import financeimg from "../../assets/images/finance2.webp";
import healthcare from "../../assets/images/healthcare.webp";
import instructor from "../../assets/images/instructor.webp";
import logistics from "../../assets/images/logistics.webp";
import photo from "../../assets/images/photo.webp";
import restuarent from "../../assets/images/restuarent (2).webp";
import retail from "../../assets/images/retail.webp";
function TaxgoSystem(props: any) {
  const { t } = props;
  const navigate = useNavigate();
  return (
    <div style={{ backgroundColor: "#f4f6f8" }}>
      <Container>
        {" "}
        <br />
        <br />
        <br />
        <br />
        <div className="TaxgoSystem-head1">
          {t("home_page.homepage.use_case")}
        </div>
        <br />
        <div className="TaxgoSystem-text1">
          {t("home_page.homepage.use_case_body1")}
          <br />
          {t("home_page.homepage.use_case_body2")}
          <br />
          {t("home_page.homepage.use_case_body3")}
        </div>
      </Container>

      <div className="TaxgoSystem-coverDiv">
        <Row className="d-flex justify-content-center gy-3 m-0">
          <Col
            style={{ padding: "0px" }}
            lg={2}
            md={4}
            sm={4}
            xs={12}
            className="order-4 order-lg-1"
          >
            <div
              onClick={() => navigate("/Restaurant")}
              className="TaxgoSystem-imgDiv1"
            >
              <img className="TaxgoSystem-Card2" src={restuarent} alt="img" />
            </div>
          </Col>
          <Col
            style={{ padding: "0px" }}
            lg={2}
            md={4}
            sm={4}
            xs={12}
            className="order-3 order-lg-2 order-1 order-sm-3"
          >
            <div className="TaxgoSystem-CardDiv">
              <div
                onClick={() => navigate("/Health")}
                className="TaxgoSystem-imgDiv"
              >
                <img className="TaxgoSystem-Card" src={healthcare} alt="img" />
              </div>
              <div
                onClick={() => navigate("/Finances")}
                className="TaxgoSystem-imgDiv"
              >
                <img className="TaxgoSystem-Card" src={financeimg} alt="img" />
              </div>
            </div>
          </Col>
          <Col
            style={{ padding: "0px" }}
            lg={3}
            md={4}
            sm={4}
            xs={12}
            className="order-2 order-lg-3"
          >
            <div className="TaxgoSystem-CardDiv">
              <div
                onClick={() => navigate("/Retails")}
                className="TaxgoSystem-imgDiv2"
              >
                <img className="TaxgoSystem-Card1" src={retail} alt="img" />
              </div>
              <div
                onClick={() => navigate("/Logistics")}
                className="TaxgoSystem-imgDiv2"
              >
                <img className="TaxgoSystem-Card1" src={logistics} alt="img" />
              </div>
            </div>
          </Col>
          <Col
            style={{ padding: "0px" }}
            lg={2}
            md={4}
            sm={4}
            xs={12}
            className="order-1 order-lg-4 order-3 order-sm-1"
          >
            <div className="TaxgoSystem-CardDiv">
              <div
                onClick={() => navigate("/Instuct")}
                className="TaxgoSystem-imgDiv"
              >
                <img className="TaxgoSystem-Card" src={instructor} alt="img" />
              </div>
              <div
                onClick={() => navigate("/Photographer")}
                className="TaxgoSystem-imgDiv"
              >
                <img className="TaxgoSystem-Card" src={photo} />
              </div>
            </div>
          </Col>
          <Col
            style={{ padding: "0px" }}
            lg={2}
            md={4}
            sm={4}
            xs={12}
            className="order-5"
          >
            <div
              onClick={() => navigate("/Business")}
              className="TaxgoSystem-imgDiv1"
            >
              <img className="TaxgoSystem-Card2" src={bussiness} alt="img" />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default withTranslation()(TaxgoSystem);
