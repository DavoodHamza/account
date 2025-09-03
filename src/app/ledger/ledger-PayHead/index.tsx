import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { GET } from "../../../utils/apiCalls";
import AddLedger from "./components/addLedger";
import Table from "./components/table";
import { useTranslation } from "react-i18next";


function PayHead() {
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [addPayheadModal, setAddPayheadModal] = useState(false);
  const location = useLocation();
  const [edit, setEdit] = useState<any>();

  const [data, setData] = useState([]);
  const columns = [
      {
    name: "id",
    title: t("home_page.homepage.slno"),
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "laccount",
      title: t("home_page.homepage.Pay_Head_Name"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "payheadType",
      title:  t("home_page.homepage.Pay_Head_Type"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "calculationPeriod",
      title: t("home_page.homepage.Period"),
      dataType: "string",
      alignment: "center",
      cellRender: ({data}: any) =>
      <div>{data?.calculationPeriod == 1 ? 'Weekly' : data?.calculationPeriod == 2 ? 'Monthly' : data?.calculationPeriod == 3 ? 'Yearly' : ''}</div>,
    },
    {
      name: "categoryDetails.category",
      title: t("home_page.homepage.Category"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "groupDetails.categorygroup",
      title: t("home_page.homepage.Category_Group"),
      dataType: "string",
      alignment: "center",
    },
  ];

  useEffect(() => {
    fetchPayHeads();
  }, []);

  const fetchPayHeads = async () => {
    try {
      setIsLoading(true);
      let unit_url = `account_master/getPayHeadByCompany/${user?.companyInfo?.id}`;
      const data: any = await GET(unit_url, null);

      setData(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.Pay_Head")}
        firstPath={location?.pathname.slice(5)}
        secondPathLink = {location.pathname}
        secondPathText ={t("home_page.homepage.Pay_Head")}
        buttonTxt={t("home_page.homepage.ADD_NEW")}
        onSubmit={() => setAddPayheadModal(true)}
        goBack={"/usr/productStock"}
      />

      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
        <br />
        <Table
          products={data}
          columns={columns}
          onItemSelect={() => {}}
          handleEditClick={(val: any) => {
            setAddPayheadModal(true);
            setEdit(val);
          }}
          onPageChange={(p: any, t: any) => {}}
          title={t("home_page.homepage.Pay_Head")}
          type={"Pay Head"}
        />
        </>
      )}

      {addPayheadModal && (
        <AddLedger
          onOpen={addPayheadModal}
          onClose={() => {
            setAddPayheadModal(false);
          }}
          onSuccess={() => {
            setAddPayheadModal(false);
          }}
          reload={fetchPayHeads}
          edit={edit}
        />
      )}
    </>
  );
}

export default PayHead;
