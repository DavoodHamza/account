import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GET } from "../../utils/apiCalls";
import { Button, Tag } from "antd";
import PageHeader from "../../components/pageHeader";
import LoadingBox from "../../components/loadingBox";
import { Container } from "react-bootstrap";
import moment from "moment";
import StripeLogTable from "./components/table";
import StatusModal from "./components/StatusModal";

const StripeLogScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [data, setData] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [rowData, setRowData] = useState<any>();
  const { t } = useTranslation();
  const columns = [
      {
    name: "id",
    title: t("home_page.homepage.slno"),
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "date",
      title:  t("home_page.homepage.date"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => moment(data?.date).format("YYYY-MM-DD"),
    },
    {
      name: "stripeId",
      title:  t("home_page.homepage.transactionID"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "amount",
      title:  t("home_page.homepage.amount_tb"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "invoiceNo",
      title: t("home_page.homepage.invoiceNo"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "status",
      title:  t("home_page.homepage.status"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => <Tag>{data?.status}</Tag>,
    },
    {
      name: "id",
      title: t("home_page.homepage.action"),
      dataType: "string",
      cellRender: ({data}: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              setIsOpen(true);
              setRowData(data);
            }}
          >
            Approve
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchStripeLog();
  }, []);

  const fetchStripeLog = async () => {
    try {
      setIsLoading(true);
      let url = `stripe_log/list/${adminid}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.stripe_log")}
        firstPathLink={location.pathname}
        goback="/usr/dashboard"
        title={t("home_page.homepage.stripe_log")}
      />
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Container>
            <br />
          <StripeLogTable columns={columns} list={data} title={`${t("home_page.homepage.transaction_log")}`}/>
          </Container>
        )}
      </div>

      {
        isOpen && <StatusModal data={rowData} isOpen={isOpen} setIsOpen={setIsOpen} 
        fetchStripeLog={fetchStripeLog}/>
      }
    </>
  );
};

export default StripeLogScreen;
