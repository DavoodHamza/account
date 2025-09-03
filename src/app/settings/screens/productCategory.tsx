import { notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import CreateSettings from "../components/form";
import Table from "../components/table";

function ProductCategory() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [id, setId] = useState("create");

  const [initalValue, setInitalValue] = useState({});
  const { t } = useTranslation();


  const [data, setData] = useState([]);
  const adminid = user?.id;

  const columns = [
    {
      caption: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
    },
    {
      name: "category",
      title: `${t("home_page.homepage.Category")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "categoryType",
      title: `${t("home_page.homepage.categoryType")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ( {data}: any) => data?.categoryType === "product" ? "Product" : data?.categoryType === "service" ? "Service" : "-",
    },
  ];
  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.PRODUCTCATEGORY_LIST_USER + `${adminid}/${user?.companyInfo?.id}`;
      const {data}: any = await GET(unit_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };
  const deleteCategory = async (id: any) => {
    try {
      setIsLoading(true);
      let unit_url = API.PRODUCTCATEGORY_DELETE + id;
      const data: any = await GET(unit_url,null);
      if (data) {
        notification.success({
          message: "Deleted Succesfully",
          description: "Your product catogory has been deleted successfully.",
        });
        fetchCategory();
      }
      setIsLoading(false);
    } catch (error) {}
  };

  const productCategoryGet = async (id: any) => {
    try {
      let url = API.PRODUCTCATEGORY_GETBY_ID + id;
      let data: any = await GET(url, {});
      let inital = {
        category: data?.category,
        categoryType:data?.categoryType
      };

      setInitalValue(inital);
      setId(id);
      setTimeout(() => {
        setIsForm(true);
      }, 100);
    } catch (error) {}
  };
  return (
    <div>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          data={data}
          columns={columns}
          title={window.innerWidth <= 480 ? "" : `${t("home_page.homepage.Product_Category_Service_category")}`}
          handleDeleteClick={deleteCategory}
          handleEditClick={productCategoryGet}
          onBtnClick={() => {
            setIsForm(true);
            setId("create");
          }}
        />
      )}
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            setInitalValue({});
          }}
          source={"productServiceCategory"}
          tittle={t("home_page.homepage.Product_Category_Service_category")}
          id={id}
          reload={() => fetchCategory()}
          initalValue={initalValue}
        />
      ) : null}
    </div>
  );
}

export default ProductCategory;
