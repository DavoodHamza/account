import { Card } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MdInbox } from "react-icons/md";
function NoInvoice() {
  const { t } = useTranslation();
  return (
    <Container>
      <Card>
        <Row>
          <Col className="d-flex justify-content-center mb-3" md={12}>
            <MdInbox size={70} color="#6C757D" />
          </Col>
          <Col
            className="heading-txt2 d-flex justify-content-center text-secondary"
            md={12}
          >
            {t("home_page.homepage.PleaseChooseDifferentCustomer")}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default NoInvoice;
