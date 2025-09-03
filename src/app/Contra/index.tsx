import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/pageHeader";
import PaymentTable from "../Payments/components/table";
import { Button } from "antd";
import { useAccessControl } from "../../utils/accessControl";

function ContraScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { canCreateContra, canUpdateContra, canDeleteContra } =
    useAccessControl();

  const handleOnEdit = (val: any) => {
      navigate( `/usr/contra-form/edit/${val?.id}`);
  };
  const columns = [
    {
      name: "id",
      title: t("home_page.homepage.sl_no"),
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
      name: "paidFrom",
      title: t("home_page.homepage.PaidFrom"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.paidFrom,
    },
    {
      name: "paidTo",
      title: t("home_page.homepage.PaidTo"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.paidTo,
    },
    {
      name: "debit", 
      title: t("home_page.homepage.Amount"),
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <>
      <PageHeader
        firstPathLink={location?.pathname}
        firstPathText={t("home_page.homepage.contra_voucher")}
        // buttonTxt={t("home_page.homepage.add")}
        // onSubmit={() => navigate("/usr/contra-form/create/0")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.contra_voucher")}
      >
        <div>
          {canCreateContra() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/contra-form/create/0")}
            >
              + {t("home_page.homepage.add")}{' '}{t("home_page.homepage.contra_voucher")}
            </Button>
          )}
        </div>
      </PageHeader>
        <Container>
        <PaymentTable
          columns={columns}
          onEdit={(data: any) => handleOnEdit(data)}
          type="Bank Transfer"
          canUpdatePayments={canUpdateContra}
          canDeletePayments={canDeleteContra}
        />
        <br />
      </Container>
      <br />
    </>
  );
}

export default ContraScreen;
