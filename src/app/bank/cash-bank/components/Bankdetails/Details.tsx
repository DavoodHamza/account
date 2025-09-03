import { Alert, Button, Card } from "antd";
import { Col, Container, Row, Table } from "react-bootstrap";
import { RiEditFill } from "react-icons/ri";
import "../../styles.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Details({ bankDetails, bank }: any) {
  const {t} = useTranslation();
  const navigate = useNavigate();
  return (
    <Container>
      <Card>
        <Row>
          <Col md="6">
            <Alert
              message={
                <h5
                  className=""
                  style={{
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    color: "gray",
                  }}
                >
                  {t("home_page.homepage.AvailableBalance")}
                  <span>
                    {Number(bankDetails?.total) +
                      Number(bankDetails?.opening || 0) ||
                      Number(bankDetails?.amount) ||
                      0}{" "}
                    {t("home_page.homepage.INR")}
                  </span>
                </h5>
              }
            />
          </Col>
          <Col md="6" className="d-flex justify-content-end">
            <Button
              type="link"
              size="small"
              onClick={() =>
                navigate(`/usr/cashBank/addbank/edit`, {
                  state: {
                    type: "2",
                    data: bank,
                  },
                })
              }
            >
              <RiEditFill size={24} />
            </Button>
          </Col>
        </Row>
        <br />
        <Table bordered responsive={true} style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.BankName")}</th>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.IBAN")}</th>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.BIC/BANKSwift")}</th>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}> {t("home_page.homepage.AccountType")}</th>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.SortCode")}</th>
              <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.Opening_Balance")} </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bankDetails?.laccount}</td>
              <td>{bankDetails?.ibannum}</td>
              <td>{bankDetails?.bicnum}</td>
              <td>{bankDetails?.acctype}</td>
              <td>
                {bankDetails?.sortcode1}-{bankDetails?.sortcode2}-
                {bankDetails?.sortcode3}
              </td>
              <td>{bankDetails?.opening}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default Details;
