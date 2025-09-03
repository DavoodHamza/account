import React, { useEffect, useState } from "react";
import { GET, POST } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles.scss";
import Table from "../component/table";
import moment from "moment";
import { Modal, notification } from "antd";
import PaySheetPaymentmodal from "../component/paymentModal";
import { useTranslation } from "react-i18next";

const PaySheet = () => {
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBank, setSlectedBank] = useState<any>();
  const [isBtnLoding, setIsBtnLoding] = useState(false);
  const [id, setId] = useState<any>();
  const [amount, setAmount] = useState(0);

  const [add, setAdd] = useState(false);

  const adminid = user?.id;

  useEffect(() => {
    fetchPaysheet();
    getBankList();
  }, []);

  const handleType = (val: any, type: any) => {
    setType(type);
  };

  const fetchPaysheet = async () => {
    try {
      setIsLoading(true);
      let url = API.PAYSHEET_LIST_USER + user?.companyInfo?.id;
      const data: any = await GET(url, null);
      let modifiedData = data.map((item: any) => {
        return {
          id: item.id,
          employeeId: item?.employeeId,
          name:
            `${item?.employee?.firstName} ${item?.employee?.lastName}` || "",
          email: item?.employee?.email || "",
          phone: item?.employee?.phone || "",
          date_of_join:
            moment(item?.employee?.date_of_join).format("DD-MM-YYYY") || "",
          Designation: item?.employee?.Designation || "",
          salaryPackage: item?.employee?.salaryPackage || "",
          totalEarnings: item?.totalEarnings || "",
          totalDeduction: item?.totalDeduction || "",
          netSalary: item?.netSalary || "",
        };
      });
      setData(modifiedData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);

      setSlectedBank(data.bankList);
    } catch (error) {}
  };

  async function paymentFinish(val: any) {
    try {
      setIsBtnLoding(true);

      let payload = {
        adminid: adminid,
        paidfrom: val?.paymentBank,
        logintype: "usertype",
        type: "payroll",
        date: val?.paymentDate,
        paidmethod: val?.paymentMethod,
        sdate: new Date(),
        userdate: new Date(),
        booleantype: "73",
      };
      let url = API.PAYSHEET_PAYMENT + id;
      let response: any = await POST(url, payload);
      if (response.status) {
        notification.success({ message: response.message });
        setIsBtnLoding(false);
        setIsOpen(false);
      } else {
        notification.error({ message: "something wrong" });
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: "Something went wrong to your payment." });
      setIsBtnLoding(false);
      setIsOpen(false);
    }
  }

  const handleModalOpen = (val: any) => {
    setIsOpen(true);
    setId(val?.id);
    setAmount(val?.netSalary);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const columns = [
    {
      name: "id",
      title: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "employeeId",
      title: `${t("home_page.homepage.Employee_Id_paysheet")}`,
      dataType: "number",
      alignment: "center",
    },
    {
      name: "name",
      title: `${t("home_page.homepage.Employee_Name_paysheet")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "phone",
      title: `${t("home_page.homepage.Phone_Number_paysheet")}`,
      alignment: "center",
    },
    {
      name: "email",
      title: `${t("home_page.homepage.Email_paysheet")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "salaryPackage",
      title: `${t("home_page.homepage.Salary_Package_paysheet")}`,
      dataType: "number",
      alignment: "center",
    },
    {
      name: "date_of_join",
      title: `${t("home_page.homepage.Date_of_Join_paysheet")}`,
      dataType: "date",
      alignment: "center",
    },
    {
      name: "totalEarnings",
      title: `${t("home_page.homepage.Total_Earnings_paysheet")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "totalDeduction",
      title: `${t("home_page.homepage.Total_Deduction_paysheet")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "netSalary",
      title: `${t("home_page.homepage.Net_Salary_paysheet")}`,
      dataType: "string",
      alignment: "center",
    },
  ];

  return (
    <>
      <PageHeader
        firstPath={location?.pathname.slice(5)}
        buttonTxt={add ? null : `${t("home_page.homepage.ADD_paysheet")}`}
        onSubmit={
          add ? null : () => navigate("/usr/payroll/form/paysheet/create")
        }
        goBack={-1}
        title={`${t("home_page.homepage.Payroll_PaySheet")}`}
        secondPathLink={location.pathname}
        secondPathText="Pay Roll - Pay Sheet"
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
                : `${t("home_page.homepage.Payroll")}`
            }
            isOpen={handleModalOpen}
            view="/usr/payroll/paysheet-view/"
            edit="/usr/payroll/form/paysheet/"
          />
        )}
      </div>
      {isOpen && (
        <Modal
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          width={800}
          maskClosable={false}
          footer={false}
          title="Add Payment"
        >
          <PaySheetPaymentmodal
            onCancel={() => setIsOpen(false)}
            onFinish={(val: any) => paymentFinish(val)}
            bankList={selectedBank}
            loding={isBtnLoding}
            amount={amount}
          />
        </Modal>
      )}
    </>
  );
};

export default PaySheet;
