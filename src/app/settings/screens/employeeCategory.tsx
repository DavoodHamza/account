import { notification } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import CreateSettings from "../components/form";
import Table from "../components/table";
import { useTranslation } from "react-i18next";


function EmployeeCategory() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [id, setId] = useState("create");
  const [initalValue, setInitalValue] = useState({});
  const [data, setData] = useState([]);
  const { t } = useTranslation();
console.log(user)
  const columns = [
    {
      name: "emplyeeCategory",
      title: `${t("home_page.homepage.Employee_Category")}`,
      dataType: "string",
      alignment: "center",
    },
  ];
  useEffect(() => {
    fetcEmployeeCategory();
  }, []);
  const fetcEmployeeCategory = async () => {
    try {
      setIsLoading(true);
      let unit_url = `employeeCategory/list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(unit_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  };

  const fetchEmplyeeCategoryDelete = async (id: any) => {
    try {
      let url = API.EMPLOYEECAREGORY_DELETE + id;
      const data: any = await DELETE(url);
      if (data) {
        notification.success({
          message: "Deleted Succesfully",
          description: "Your employee catogory has been deleted successfully.",
        });
        fetcEmployeeCategory();
      }
    } catch(error) {
      console.log(error);
    }
  };
  const emplyeeCategoryGet = async (id: any) => {
    try {
      let url = API.EMPLOYEECATEGORY_GET_BYID + id;
      let data: any = await GET(url, {});
      let inital = {
        category: data?.emplyeeCategory,
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
          title={window.innerWidth <= 480 ? "" :`${t("home_page.homepage.Employee_Category")}`}
          onBtnClick={() => {
            setId("create");
            setIsForm(true);
          }}
          handleDeleteClick={fetchEmplyeeCategoryDelete}
          handleEditClick={emplyeeCategoryGet}
        />
      )}
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            setInitalValue({});
          }}
          source={"employeeCategory"}
          tittle={t("home_page.homepage.EmployeeCategory")}
          id={id}
          reload={() => fetcEmployeeCategory()}
          initalValue={initalValue}
        />  
      ) : null}
    </div>
  );
}

export default EmployeeCategory;
