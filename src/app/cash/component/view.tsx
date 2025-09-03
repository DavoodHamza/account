import { Card, notification } from "antd";
import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/cjs/data-grid";
import { Container } from "react-bootstrap";
import PageHeader from "../../../components/pageHeader";
import { useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useEffect, useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function CashView() {
  const { t } = useTranslation();
  const { id, type } = useParams();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [columnss, setColumn] = useState<any>([]);
  const { user } = useSelector((state: any) => state.User);
  const LoadLedgerDeatails = async () => {
    try {
      setIsLoading(true);
      let URL = API.LEDGER_DEATAILS + id + "/" + user?.id + "/" + type;
      const data: any = await GET(URL, null);
      if (data.status) {
        let datas: any = [data.data];
        setData(datas);
        setIsLoading(false);
        const column =
          data.data.type === "Bank Transfer" ? columnsBank : columns;
        setColumn(column);
      } else {
        notification.error({ message: data.message });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    LoadLedgerDeatails();
  }, []);
  const columns = [
    {
      name: "sdate",
      title: "TRANSACTION DATE ----",
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
    },
    {
      name: "name",
      title: "CUSTOMER/SUPPLIER",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "ledgername",
      title: "PAID",
      alignment: "center",
    },
    {
      name: "reference",
      title: "REFERENCE",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "paidAmount",
      title: "AMOUNT",
      dataType: "string",
      alignment: "center",
    },
  ];
  const columnsBank = [
    {
      name: "sdate",
      title: t("home_page.homepage.TRANSACTIONDATE"),
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
    },
    {
      name: "paidmethod",
      title: t("home_page.homepage.PAIDMETHOD"),
      alignment: "center",
    },
    {
      name: "secondname",
      title: t("home_page.homepage.PAID_FROM"),
      alignment: "center",
    },
    {
      name: "paidfromname",
      title: t("home_page.homepage.PAIDTO"),
      alignment: "center",
    },
    {
      name: "reference",
      title: t("home_page.homepage.REFERENCE"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "paidAmount",
      title: t("home_page.homepage.AMOUNT"),
      dataType: "string",
      alignment: "center",
    },
  ];
  return (
    <>
      <PageHeader
        firstPathLink={"/usr/cash"}
        firstPathText={t("home_page.homepage.Cash")}
        secondPathLink={`/usr/cash/cashTable/${type}`}
        secondPathText={t("home_page.homepage.CashTable")}
        goback={-1}
        title={`View ${data ? data[0]?.type : "----"}`}
      />
      <br />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <DataGrid
              dataSource={data}
              columnAutoWidth={true}
              showBorders={true}
              // onExporting={onExporting}
              showRowLines={true}
              remoteOperations={false}
            >
              {columnss.map((column: any) => {
                return (
                  <Column
                    dataField={column.name}
                    caption={column.title}
                    dataType={column.dataType}
                    format={column.format}
                    alignment={column.alignment}
                  ></Column>
                );
              })}
            </DataGrid>
          </Card>
        )}
      </Container>
    </>
  );
}

export default CashView;
