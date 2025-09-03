import "../../styles.scss";
import { Card } from "antd";
import { Container } from "react-bootstrap";
import BankTable from "../table";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../../components/pageHeader";
import { useTranslation } from "react-i18next";
function Reconcile(props: any) {
  const { t } = useTranslation();
  const { status, id } = useParams();
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
    },
    {
      name: "reference",
      title: t("home_page.homepage.Reference"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "type",
      title: t("home_page.homepage.AccountType"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "debit",
      title: t("home_page.homepage.Debit"),
      dataType: "number",
      alignment: "center",
    },
    {
      name: "credit",
      title: t("home_page.homepage.Credit"),
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <>
      {status == "1" ? (
        <PageHeader
          firstPathLink={`/usr/cashBank/${id}/details/reconcile`}
          firstPathText={t("home_page.homepage.Reconciliation")}
          title={t("home_page.homepage.ReconciliationStatement")}
        />
      ) : (
        ""
      )}
      <Container>
        <br />
        <Card>
          {status == "1" ? (
            <div className="Reconcile-Txt1">
              {t("home_page.homepage.RECONCILIATIONSTATEMENT")}
            </div>
          ) : (
            <div className="Reconcile-Txt1">
              {t("home_page.homepage.RECONCILETRANSACTIONS")}
            </div>
          )}
          <BankTable
            columns={columns}
            products={props?.data}
            status={true}
            onUpdate={(date: any, id: any) => props?.onUpdateDate(date, id)}
            onHandleDate={(date: any) => props?.onLoadData(date)}
            startDate={props.startDate}
            endDate={props.endDate}
            type="reconcile"
          />
        </Card>
      </Container>
    </>
  );
}
export default Reconcile;
