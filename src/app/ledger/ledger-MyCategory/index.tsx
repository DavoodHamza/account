import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LedgerTable from "../component/table";
import AddDefualtCategory from "./addCategory";
import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LedgerMyCategory = () => {
  const {t} =useTranslation();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.User);
  const [edit, setEdit] = useState() as any
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const adminid = user?.id;

  useEffect(() => {
    fetchMyCategoryList();
  }, []);

  const navigate = useNavigate()

  const fetchMyCategoryList = async () => {
    try {
      setIsLoading(true);
      let url = API.GET_LEDGER_CATEGORY + `myLedgerCategory/${adminid}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const columns = [
      {
    name: "id",
    title:  t("home_page.homepage.slno"),
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
      : data.categorygroup == 3 ? "Expenditure" : data.categorygroup == 4 ? "Capital" : data.categorygroup == 5 ? "Income" : ""
  
    },
  ];

  const handleOnEdit = (val: any) => {
    setEdit(val?.row?.data);
    setOpen(true);
  };

  const handleAdd = () => {
    setEdit(null);
    setOpen(true);
  };

  const handleView = (val:any) =>{
    navigate(`/usr/ledger-view/${val}`)
  }

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.My_Category")}
        secondPathLink ={location.pathname}
        secondPathText ={t("home_page.homepage.My_Category")}
        firstPath={location?.pathname.slice(5)}
        goBack={"/usr/ledgerMyCategory"}
      >
        <div>
        <Button type="primary" onClick={() => handleAdd()}>
        {t("home_page.homepage.Add_Category")}
          </Button>
        </div>
        </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <LedgerTable
          products={data}
          columns={columns}
          title={t("home_page.homepage.My_Category")}
          defualtCategoryOnEdit={(item: any) => handleOnEdit(item)}
          handleView={(val: any) => handleView(val)}
          type= 'My Category'
        />
      )}
      {open && (
        <AddDefualtCategory
          onOpen={open}
          onClose={() => setOpen(false)}
          onEdit={edit}
          refresh={() => fetchMyCategoryList()}
        />
      )}
    </>
  );
};

export default LedgerMyCategory;
