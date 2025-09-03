import { Card } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function Transaction({ details, balance, fetchBankDetails }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state: any) => state?.User);
  const handleOnEdit = (val: any) => {
    if (val?.type === "Customer Receipt" || val?.type === "Customer Reciept") {
      navigate(`/usr/cashBank/${id}/details/salesreciept/customer/${val?.id}`);
    } else if (val?.type === "Other Receipt") {
      navigate(`/usr/cashBank/${id}/details/salesreciept/other/${val?.id}`);
    } else if (val?.type === "Supplier Refund") {
      navigate(
        `/usr/cashBank/${id}/details/salesreciept/supplier-refund/${val?.id}`
      );
    } else if (val?.type === "Supplier Payment") {
      navigate(
        `/usr/cashBank/${id}/details/purchasepayment/supplier/${val?.id}`
      );
    } else if (val?.type === "Other Payment") {
      navigate(`/usr/cashBank/${id}/details/purchasepayment/other/${val?.id}`);
    } else if (val?.type == "Customer Refund") {
      navigate(
        `/usr/cashBank/${id}/details/purchasepayment/customer/${val?.id}`
      );
    } else {
      navigate(`/usr/cashBank/${id}/details/banktransfer/${val?.id}`);
    }
  };
  const columns = [
    {
      name: "id",
      title: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "date",
      title: t("home_page.homepage.Date"),
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
    },
    {
      name: "customer",
      title: t("home_page.homepage.Particulars"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.customer || data?.customer_name,
    },
    {
      name: "type",
      title: t("home_page.homepage.AccountType"),
      dataType: "string",
      alignment: "center",
    },

    {
      name: "credit", 
      title: t("home_page.homepage.Paid"),
      dataType: "number",
      alignment: "center",
    },
    {
      name: "debit", 
      title: t("home_page.homepage.Recieved"),
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <Container>
      <Row>
        <Col md="6">
          <Card>
            <h5
              className=""
              style={{
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                color: "gray",
              }}>
              {t("home_page.homepage.AvailableBalance")}
              <span>
                {Number(balance) || Number(details?.amount) || 0}{" "}
                {user?.countryInfo?.currencycode}
              </span>
            </h5>
          </Card>
        </Col>

        <Col md="6" />
      </Row>

      <TransactionTable
        columns={columns}
        onEdit={(data: any) => handleOnEdit(data)}
        fetchBankDetails={fetchBankDetails}
      />
      <br />
    </Container>
  );
}

export default Transaction;
