import { Card } from "antd";
import { t } from "i18next";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import BankTable from "./table";

function ReconcilePage() {
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const columns = [
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
      name: "amount",
      title: t("home_page.homepage.Total"),
      dataType: "number",
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
    {
      name: "runningTotal",
      title: t("home_page.homepage.RunningTotal"),
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathLink={`/usr/cashBank/${id}/details`}
        secondPathText={t("home_page.homepage.BankDetails")}
        thirdPathLink={`/usr/cashBank/reconcile/${id}`}
        thirdPathText={t("home_page.homepage.Reconcile")}
        goback={-1}
        title={t("home_page.homepage.BankReconciled")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <BankTable columns={columns} products={data} type={"reconiled"} />
          </Card>
        </Container>
      )}
    </div>
  );
}

export default ReconcilePage;
