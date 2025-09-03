import { useEffect, useState, useTransition } from "react";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LedgerTable from "../component/table";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
const LedgerDefaultLedger = () => {
  const {t} =useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDefaultLedger = async () => {
    try {
      setIsLoading(true);
      const get_default_ledger_url = API.GET_ACCOUNT_MASTER_LIST;
      const { data }: any = await GET(get_default_ledger_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultLedger();
  }, []);

  const Columns = [
      {
    name: "id",
    title: t("home_page.homepage.slno"),
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "nominalcode",
      title: t("home_page.homepage.Nominal_Code"),
      dataType: "string",
      alignment: "center",
      allowEditing: false,
    },
    {
      name: "laccount",
      title: t("home_page.homepage.Ledger_Account"),
      alignment: "left",
      allowEditing: false,
    },
    {
      name: "categoryDetails.category",
      title: t("home_page.homepage.Category"),
      dataType: "string",
      alignment: "center",
      allowEditing: false,
    },
    {
      name: "groupDetails.categorygroup",
      title: t("home_page.homepage.Category_Group"),
      dataType: "string",
      alignment: "center",
      allowEditing: false,
    },
  ];
   const location = useLocation();
  return (
    <>
      <PageHeader title={t("home_page.homepage.Default_Ledger")}
      secondPathLink ={location.pathname}
      secondPathText ={t("home_page.homepage.Default_Ledger")}
      />
  
      {isLoading ? (
        <LoadingBox />
      ) : (
        <LedgerTable
          products={data}
          columns={Columns}
          title={t("home_page.homepage.Default_Ledger")}
          type = "Default Ledger"
        />
      )}
    </>
  );
};

export default LedgerDefaultLedger;
