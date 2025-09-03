import { notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import CreateSettings from "../components/form";
import Table from "../components/table";


function Unit() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState("create");
  const { t } = useTranslation();
  const [initalValue, setInitalValue] = useState({});
  const adminid = user?.id;

  const columns = [
    {
      title: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
    },  
    {
      name: "formalName",
      title:`${t("home_page.homepage.Formal_Name")}`,
      dataType: "string",
      alignment: "center",
    },

    {
      name: "unit",
      title: `${t("home_page.homepage.Unit")}`,
      dataType: "string",
      alignment: "center",
    },

    {
      name: "decimalValues",
      title:`${t("home_page.homepage.Decimal_Value")}`,
      dataType: "number",
      alignment: "center",
    },
  ];
  useEffect(() => {
    fetchUnits();
  }, []);
  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.UNIT_LIST_USER + `${adminid}/${user?.companyInfo?.id}`;
      const {data}: any = await GET(unit_url, null);
      setData(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnitDelete = async (id: any) => {
    try {
      let url = API.UNIT_DELETE + id;
      const data: any = await GET(url,null);
      if (data.status) {
        notification.success({
          message: "Success",
          description: "Your location deleted successfully.",
        });
        fetchUnits(); 
      }else{
        notification.error({
          message: "Failed",
          description: "Failed to delete location.",
        });
      }
    } catch(error) {
      console.log(error);
      notification.error({
        message: "Failed",
        description: "Failed to delete location.Please try again later",
      });
    }
  };
  const uniitGetById = async (id: any) => {
    try {
      let url = API.UNIT_GETBY_ID + id;
      let data: any = await GET(url, {});
      let inital = {
        formalName: data?.formalName,
        unit: data?.unit,
        decimalValues: data?.decimalValues,
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
          title={window.innerWidth <= 480 ? "" : 
          `${t("home_page.homepage.Units")}`}
          onBtnClick={() => {
            setIsForm(true);
            setId("create");
          }}
          handleDeleteClick={fetchUnitDelete}
          handleEditClick={uniitGetById}
        />
      )}
      {isForm && (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            setInitalValue({});
          }}
          source={"unit"}
          tittle={t("home_page.homepage.Units")}
          reload={() => fetchUnits()}
          id={id}
          initalValue={initalValue}
        />
      )}
    </div>
  );
}

export default Unit;
