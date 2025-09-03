import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";

import Table from "../component/table";
import "../styles.scss";
import moment from "moment";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

const Employees = () => {
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const adminid = user?.id;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      let url = API.EMPLOYEES_LIST + `${adminid}/${user?.companyInfo?.id}`;
      const data: any = await GET(url, null);
      let modifiedData = data.map((item: any) => ({
        id: item?.id,
        fullName: `${item?.firstName} ${item?.lastName}` || "",
        email: item?.email || "",
        phone: item?.phone || "",
        date_of_join: moment(item.date_of_join).format("DD-MM-YYYY") || "",
        Designation: item?.Designation || "",
        employeeGroup: item?.employeeGroupDetails?.emplyeeCategory || "",
        salaryPackage: item?.salaryPackage,
      }));
      setData(modifiedData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDelete = async (id: any) => {
    try {
      setIsLoading(true);
      const url = API.DELETE_EMPLOYEE + id;
      const response: any = await DELETE(url);
      if (response.status) {
        notification.success({
          message: "Success",
          description: response.message,
        });
        fetchEmployees();
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      name: "id",
      title: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    // {
    //   name: "id",
    //   title: "Employee Id",
    //   dataType: "number",
    //   alignment: "center",
    // },
    {
      name: "fullName ",
      title: `${t("home_page.homepage.Full_Name_Epl")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "email",
      title: `${t("home_page.homepage.Email_Epl")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "phone",
      title: `${t("home_page.homepage.Phone_Epl")}`,
      alignment: "center",
    },
    {
      name: "date_of_join",
      title: `${t("home_page.homepage.Date_Of_Join_Epl")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "Designation",
      title: `${t("home_page.homepage.Designation_Epl")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "employeeGroup",
      title: `${t("home_page.homepage.Employee_Group_Epl")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "salaryPackage",
      title: `${t("home_page.homepage.Salary_Package_Epl")}`,
      dataType: "number",
      alignment: "center",
    },
  ];

  return (
    <>
      <PageHeader
        firstPath={location?.pathname.slice(5)}
        buttonTxt={`${t("home_page.homepage.ADD_Epl")}`}
        onSubmit={() => navigate("/usr/payroll/form/employees/create")}
        title={`${t("home_page.homepage.Payroll_Employees_Epl")}`}
        secondPathLink={location.pathname}
        secondPathText="Pay Roll - Employees"
      />
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Table
            products={data}
            columns={columns}
            onItemSelect={() => {}}
            title={
              window.innerWidth <= 497
                ? ""
                : `${t("home_page.homepage.Employees_Epl")}`
            }
            view="/usr/payroll/employees/viewPage/"
            edit="/usr/payroll/form/employees/"
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default Employees;
