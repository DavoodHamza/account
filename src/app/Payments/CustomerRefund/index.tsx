import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../components/pageHeader";
import PaymentTable from "../../Payments/components/table";
import { Button } from "antd";
import { useAccessControl } from "../../../utils/accessControl";

function CustomerRefundScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { canCreatePayments, canUpdatePayments, canDeletePayments } =
    useAccessControl();

  const handleOnEdit = (val: any) => {
    navigate(`/usr/customer-refund/edit/${val?.id}`);
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
      cellRender: ({ data }: any) => data?.customer || data?.busname,
    },
    {
      name: "paidTo",
      title: t("home_page.homepage.Bank_Cash"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "credit",
      title: t("home_page.homepage.Amount"),
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <>
      <PageHeader
        firstPathLink={location?.pathname}
        firstPathText={t("home_page.homepage.CustomerRefund")}
        // buttonTxt={t("home_page.homepage.add")}
        // onSubmit={() => navigate("/usr/customer-refund/create/0")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.CustomerRefund")}
      >
        <div>
          {canCreatePayments() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/customer-refund/create/0")}
            >
              + {t("home_page.homepage.add")}{" "}
              {t("home_page.homepage.CustomerRefund")}
            </Button>
          )}
        </div>
      </PageHeader>
      <Container>
        <PaymentTable
          columns={columns}
          onEdit={(data: any) => handleOnEdit(data)}
          type="Customer Refund"
          canUpdatePayments={canUpdatePayments}
          canDeletePayments={canDeletePayments}
        />
        <br />
      </Container>
    </>
  );
}

export default CustomerRefundScreen;
