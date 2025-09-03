import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import CreditNotesTable from "./CreditNotesTable";
import { useAccessControl } from "../../../utils/accessControl";

const CreditNotes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const { canCreateSales, canUpdateSales, canDeleteSales } = useAccessControl();
  const [data, setData] = useState([]); //CREDIT INVOICE LIST DATA
  const adminid = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [netTotal, setNetTotal] = useState<number>(0);

  useEffect(() => {
    fetchSalesCreditInvoiceList();
  }, []);

  useEffect(() => {
    const sumOfTotal = calculateTotalSum(data);
    setNetTotal(sumOfTotal);
  }, [data]);

  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;
  //get credit notes list
  const fetchSalesCreditInvoiceList = async () => {
    const scredit_url =
      API.SALES_LIST +
      `${adminid}/${createdBy}/${
        user?.companyInfo?.id
      }/scredit?order=DESC&page=${1}&take=${10}`;
    try {
      const { data }: any = await GET(scredit_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  //funtion to find net total of credit notes
  function calculateTotalSum(objects: any) {
    let totalSum = 0;
    for (let i = 0; i < objects?.length; i++) {
      totalSum += parseFloat(objects[i]?.total.replace(",", ""));
    }

    return totalSum;
  }

  //on page change
  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_SALES_INVOICE + id + "/scredit";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchSalesCreditInvoiceList();
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed",
        description: "Something went wrong!! Please try again later",
      });
    }
  };

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/salesCredit"}
        firstPathText={t("home_page.homepage.Credit_Note")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Credit_Note")}
      >
        {canCreateSales() && (
          <Button type="primary" onClick={() => navigate(`screditform/${0}`)}>
            {t("home_page.homepage.add_credit")}
          </Button>
        )}
      </PageHeader>

      <Container>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <CreditNotesTable
            list={data}
            onItemSelect={() => {}}
            title={"Sales Credit List"}
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsLoading={setIsLoading}
            netTotal={netTotal}
            handleDelete={deleteHandler}
            canUpdateSales={canUpdateSales}
            canDeleteSales={canDeleteSales}
          />
        )}
      </Container>
    </div>
  );
};

export default CreditNotes;
