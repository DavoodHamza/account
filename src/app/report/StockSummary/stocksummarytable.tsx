import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import { Button, DatePicker, Spin, notification } from "antd";
import { stockSummaryTemplate } from "./template";
import SendMailModal from "../../../components/sendMailModal";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const customIcon = <LoadingOutlined type="loading" spin size={50} />;
const StocksummaryTable = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [create, setCreate] = useState("");
  const [data, setData] = useState([]);
  const [totalvalue, settotalvalue] = useState();
  const [totalQuantity, setTotalQuantity] = useState();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const adminid = user?.id;
  const [emailModal, setEmailModal] = useState(false);
  const todayy = dayjs().format("YYYY/MM/DD");
  const sdate = dayjs().startOf('month')
  const edate = dayjs(todayy)
  const [startDate, setStartDate] = useState(sdate);
  const [endDate, setEndDate] = useState(edate);
  const [isLoading2, setIsLoading2] = useState(false);
  const { t } = useTranslation();

  const businessStartDate: any = user?.companyInfo?.financial_year_start
    ? user?.companyInfo?.financial_year_start
    : user?.companyInfo?.books_begining_from;

  const OnDateChange = (val: any) => {
    if (val?.length) {
      let sdate: any = dayjs(val[0]).format("YYYY-MM-DD");
      let edate: any = dayjs(val[1]).format("YYYY-MM-DD");
      if (val[0]) setStartDate(sdate);
      if (val[1]) setEndDate(edate);
      startDate &&
        endDate &&
        setTimeout(() => {
          setIsLoading2(true);
          loadData(sdate, edate);
        }, 300);
    }
  };

  


  const loadData = async (sdate:any, edate:any) => {
    try {
      setIsLoading(true);
      const formattedSDate = moment(new Date(sdate)).format("YYYY-MM-DD");
      const formattedEDate = moment(new Date(edate)).format("YYYY-MM-DD");
      let product_url = API.GET_STOCK_DETAILS + `${adminid}/${user?.companyInfo?.id}/${formattedSDate}/${formattedEDate}`;
      const data: any = await GET(product_url, null);
      const totalCostPrice = data.reduce(
        (item: any, product: any) => Number(item) + Number(product.value),
        0
      );
      const totalCostQuantity = data.reduce(
        (item: any, product: any) => Number(item) + Number(product.quantity),
        0
      );
      settotalvalue(totalCostPrice);
      setTotalQuantity(totalCostQuantity);
      setData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMailPdf = async (templates: any, email: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      email: email,
      filename: "Sales Invoice",
      html: encodedString,
      isDownload: false,
      sendEmail: true,
      type: "",
      userid: "",
    };
    const token = user.token;

    const response = await fetch(pdf_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (response.ok) {
      notification.success({ message: "Email Successfully Sent" });
      setEmailModal(false);
    }
    if (!response.ok) {
      notification.success({
        message:
          "Apologies, there was an error when attempting to send the email.",
      });
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        personalData: user.companyInfo,
        stockSummary: data,
        totalValue: totalvalue,
        totalQuantity:totalQuantity,
      };
      let templates = stockSummaryTemplate(obj);
      if (type === "email") {
        sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }

      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        personalData: user.companyInfo,
        stockSummary: data,
        totalValue: totalvalue,
        totalQuantity:totalQuantity
      };
      let templates = stockSummaryTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }

  const downLoadPdf = async (templates: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "Sales Invoice",
      html: encodedString,
      isDownload: true,
      sendEmail: false,
      type: "",
      userid: "",
    };
    const token = user.token;

    const response = await fetch(pdf_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const pdfBlob = await response.arrayBuffer();
    const blob = new Blob([pdfBlob], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StockSummary${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    loadData(sdate,edate);
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <div className="StocksummaryTable-box">
          <div className="StocksummaryTable-box1">
            <div className="StocksummaryTable-head">
              <div className="StocksummaryTable-txt1">
                <b>{user?.companyInfo?.bname}</b>
              </div>

              {/* <div className="formLabel">From Date - To Date</div> */}
                  {/* <DatePicker.RangePicker
                    size="large"
                    // className="width100"
                    defaultValue={[
                      businessStartDate?dayjs(businessStartDate):dayjs().startOf('month'),
                      endDate?dayjs(endDate):dayjs(todayy),
                    ]}
                    // value={
                    //   dateRangeValue
                    //     ? [dayjs(dateRangeValue[0]), dayjs(dateRangeValue[1])]
                    //     : null
                    // }
                    format={"YYYY-MM-DD"}
                    onCalendarChange={(val: any) => {
                      OnDateChange(val);
                    }}
                  /> */}
              <div>
                <Button
                  onClick={() => generateTemplate("downLoad", {})}
                  className="Report-HeaderButton-dwnld"
                >
                  {t("home_page.homepage.Print")}
                </Button>{" "}
                <Button
                  onClick={() => setEmailModal(true)}
                  className="Report-HeaderButton-print"
                >
                 {t("home_page.homepage.Email")} 
                </Button>
                {/* <Button className="Report-HeaderButton-share">Share</Button> */}
              </div>
            </div>
            {isLoading ? (
              <div className="LoaderBox">
                <Spin indicator={customIcon} />
              </div>
            ): <Table bordered hover striped width={"auto"}>
            <thead className="Report-thead">
              <tr>
                <th className="Report-table-th">{t("home_page.homepage.PARTICULAR")} </th>
                <th className="Report-table-th">{t("home_page.homepage.PRODUCTCATEGORY")}</th>
                <th className="Report-table-th">{t("home_page.homepage.QUANTITY")}</th>
                <th className="Report-table-th">{t("home_page.homepage.RATE")}</th>
                <th className="Report-table-th">{t("home_page.homepage.VALUE")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: any) => (
                <tr key={item.id}>
                  <td
                    className="Report-td-link"
                    onClick={() =>
                      navigate(
                        `/usr/report/StockSummary/StockMonth/${item?.id}`
                      )
                    }
                  >
                    {item.idescription}
                  </td>
                  <td className="Report-table-td">{item.itemtype}</td>
                  <td className="Report-table-td">{item.quantity}</td>
                  <td className="Report-table-td">
                    {Number(item?.rate).toFixed(2)}
                  </td>
                  <td className="Report-table-td">
                    {Number(item.value).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="Report-table-td">
                  <b>{t("home_page.homepage.GRANDTOTAL")}</b>
                </td>
                <td className="Report-table-td"></td>
                <td className="Report-table-td">{Number(totalQuantity)}</td>
                <td className="Report-table-td"></td>
                <td className="Report-table-td">
                  <b>{Number(totalvalue).toFixed(2)}</b>
                </td>
              </tr>
            </tbody>
          </Table>}
           
          </div>
          {emailModal ? (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              ownMail={user.email}
              fileName={`stockSummaryDetails${new Date()}.pdf`}
              Attachment={`${user.companyInfo.bname}_stockSummary_${moment(
                new Date()
              ).format("DD-MM-YYYY")}`}
              defaultValue={{
                to: user.email,
                subject: t("home_page.homepage.Stock_Summary"),
                content: t("home_page.homepage.stock_Summary_Details"),
              }}
            />
          ) : null}
        </div>
      )}
    </>
  );
};
export default StocksummaryTable;
