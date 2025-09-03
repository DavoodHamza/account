import { useEffect, useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LedgerTable from "../component/table";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LedgerDefaultCategory = () => {
  const {t} =useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchDefaultCategoryList();
  }, []);

  const fetchDefaultCategoryList = async () => {
    try {
      setIsLoading(true);
      const default_category_url =
        API.GET_LEDGER_CATEGORY + `defaultLedgerCategory`;
      const { data }: any = await GET(default_category_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const Columns = [
      {
    name: "id",
    title: t("home_page.homepage.slno"),
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "category",
      title: t("home_page.homepage.Category_Name"),
      dataType: "string",
      alignment: "center",
      allowEditing: false,
    },
    {
      name: "categorygroup",
      title: t("home_page.homepage.Category_Group"),
      dataType: "string",
      alignment: "center",
      allowEditing: false,
      cellRender: ( {data}: any) => data.categorygroup == 1 ? "Assets" :  data.categorygroup == 2 ? "Liability" 
      : data.categorygroup == 3 ? "Expenditure" : data.categorygroup == 4 ? "Capital" : data.categorygroup == 5 ? "Income" : "",
    },
  ];
  return (
    <>
      <PageHeader title={t("home_page.homepage.Defualt_Category")} 
      secondPathLink = {location.pathname}
      secondPathText={t("home_page.homepage.Defualt_Category")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <LedgerTable
          products={data}
          columns={Columns}
          title={t("home_page.homepage.Defualt_Category")}
          type = "Default Category"
        />
      )}
    </>
  );
};

export default LedgerDefaultCategory;
