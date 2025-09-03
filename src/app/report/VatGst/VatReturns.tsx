import dayjs from "dayjs";
import moment from "moment";
import { Spin } from "antd/es";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Select, notification } from "antd";
import "../styles.scss";
import API from "../../../config/api";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { GET } from "../../../utils/apiCalls";
import { vatTemplate } from "./template";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";

const customIcon = <LoadingOutlined type="loading" spin size={50} />;

const VatReturns = () => {
  const { edate, sdate} = useParams();
  const newDate: any = moment(new Date()).format("YYYY-MM-DD");
  const navigate = useNavigate();
  const User = useSelector((state: any) => state.User.user);
  const isCountry101 = User?.companyInfo?.tax === "gst";
  const { t } = useTranslation();

  const year = moment(newDate).format("YYYY");
  const FirstQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ? `${year}-04-01`:`${year}-01-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ? `${year}-06-30`:`${year}-03-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const SecondQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ? `${year}-07-01`:`${year}-04-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ?`${year}-09-30`:`${year}-06-30`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const ThirdQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ?`${year}-10-01`:`${year}-07-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ?`${year}-12-31`:`${year}-10-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const FourthQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ?`${year}-01-01`:`${year}-10-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ? `${year}-03-31`:`${year}-12-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];

  const [vatSales, setVatSales] = useState<any>([]);
  const [vatPurchase, setVatPurchase] = useState<any>([]);
  const [totSaleValue, setTotSaleValue] = useState<any>(0);
  const [totPurchaseValue, setTotPurchaseValue] = useState<any>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  const Dtoday = moment(new Date());
  const DoneMonthAgo = moment(new Date().setMonth(Dtoday.month() - 1));

  const today = Dtoday.format("YYYY-MM-DD");
  const oneMonthAgo = DoneMonthAgo.format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(today);
  const [oneMonthAgoDate, setOneMonthAgoDate] = useState(oneMonthAgo);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [vat_on_sales, set_vat_on_sales] = useState<any>([]);
  const [total_vat_on_sales, set_total_vat_on_sales] = useState<any>([]);
  const [vat_on_purchase, set_vat_on_purchase] = useState<any>(0);
  const [total_vat_on_purchase, set_total_vat_on_purchase] = useState<any>(0);

  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("DD-MM-YYYY"));

  const todayy = dayjs().format("YYYY/MM/DD");



  const [dateRangeValue, setDateRangeValue] = useState<any>([
    moment(sdate).format("YYYY-MM-DD"),
    moment(edate).format("YYYY-MM-DD"),
  ]);

  const location = useLocation();
  useEffect(() => {
    setStartDate(dateRangeValue[0]);
    setEndDate(dateRangeValue[1]);
    setTimeout(() => {
      setIsLoading2(true);
      getVatReturn(dateRangeValue[0], dateRangeValue[1]);
    }, 200);
  }, [dateRangeValue]);

  const getVatReturn = async (startDate?: any, endDate?: any) => {
    try {
      setIsLoading2(true);
      const formattedSDate = moment(new Date(startDate)).format("YYYY-MM-DD");
      const formattedEDate = moment(new Date(endDate)).format("YYYY-MM-DD");
      let url =
        API.VAT_RETURN +
        User?.id +
        "/" +
        User?.companyInfo?.id +
        "/" +
        formattedSDate +
        "/" +
        formattedEDate;
      const vatReturn: any = await GET(url, null);
      if(vatReturn.status){
        let data = vatReturn?.data;
        const vatSales: any = data.map((item: any) => item?.vatSales);
        setVatSales(vatSales);
        const vatPurchase: any = data.map((item: any) => item?.vatPurchase);
        setVatPurchase(vatPurchase);
  
        const sumVatSales = sumDataBasedOnPercentage(vatSales);
        const sumVatPurchase = sumDataBasedOnPercentage(vatPurchase);
  
        const totalVatSales = calculateTotal(vatSales);
        setTotSaleValue(totalVatSales);
  
        const totalVatPurchase = calculateTotal(vatPurchase);
        setTotPurchaseValue(totalVatPurchase);
        set_vat_on_sales(vatSales);
        set_vat_on_purchase(vatPurchase);
        set_total_vat_on_sales(Number(sumVatSales));
        set_total_vat_on_purchase(Number(sumVatPurchase));
        setIsLoading2(false);
        setIsLoading(false);
      }else {
        notification.error({
          message: "Error",
          description: vatReturn.message,
        });
      }
      
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Network error. Please try again later.",
      });
    } finally {
      setIsLoading2(false);
      setIsLoading(false);
    }
  };

  function sumDataBasedOnPercentage(array: any) {
    return array.reduce((acc: any, item: any) => {
      const percentage = item.percentage;
      const total = parseFloat(item.total);
      acc[percentage] = (acc[percentage] || 0) + total;
      return acc;
    }, {});
  }

  function calculateTotal(array: any) {
    return array.reduce(
      (acc: any, item: any) => acc + parseFloat(item.total),
      0
    );
  }

  const OnPeriodChange = (period: any) => {
    if (period?.children === "First Quater") {
      setDateRangeValue(FirstQuater);
    } else if (period?.children === "Second Quater") {
      setDateRangeValue(SecondQuater);
    } else if (period?.children === "Third Quater") {
      setDateRangeValue(ThirdQuater);
    } else if (period?.children === "Fourth Quater") {
      setDateRangeValue(FourthQuater);
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
    const token = User.token;

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
        User,
        vatSales: vat_on_sales,
        vatPurchase: vat_on_purchase,
        totalSalesValue: totSaleValue,
        totalPurchaseValue: totPurchaseValue,
        personalData: User.companyInfo,
        currentDate,
        oneMonthAgoDate,
        type: 'Customer',
        toDate
      };

      let templates: any = null;
      if (!User) {
        notification.error({
          message: <div>Please select an email template</div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }
      if (!User) {
        notification.error({
          message: <div>Please select default Bank </div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/profile/business")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }
      
      if(User){
        templates = vatTemplate(obj)
      }
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
        User,
        vatSales: vat_on_sales,
        vatPurchase: vat_on_purchase,
        totalSalesValue: totSaleValue,
        totalPurchaseValue: totPurchaseValue,
        personalData: User.companyInfo,
        currentDate,
        oneMonthAgoDate,
        type: 'Customer'
      }
      let templates = vatTemplate(obj);
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
    const token = User.token;

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
    a.download = `Vat/Gst${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);

  }

 
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
          getVatReturn(sdate, edate);
        }, 300);
    }
  };

  return (
    <>
      <PageHeader
        title={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.vat_Report") : t("home_page.homepage.vat_Report") }
        firstPathText={t("home_page.homepage.Report")}
        firstPathLink="/usr/report"
        secondPathText={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.vat_Report") : t("home_page.homepage.vat_Report")}
        secondPathLink={location.pathname}
        children={
          <div>
            <Button className="Report-HeaderButton-dwnld" onClick={() => generateTemplate("downLoad", {})}><MdFileDownload size={20} /></Button>{" "}
            <Button className="Report-HeaderButton-print" onClick={() => setEmailModal(true)}><MdAttachEmail size={20} /></Button>
          </div>
        }
      />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <>
            <br />
            <Card>
              <Row>
                <Col md={"3"}>
                  <div className="formLabel"> {t("home_page.homepage.peroid")}</div>
                  <Select
                    size="large"
                    allowClear
                    placeholder={t("home_page.homepage.peroid")}
                    className="width100"
                    defaultValue={"Custom"}
                    onChange={(val: any, data: any) => {
                      OnPeriodChange(data);
                    }}
                  >
                    {[
                      "First Quater",
                      "Second Quater",
                      "Third Quater",
                      "Fourth Quater",
                      "Custom",
                    ].map((item: any, i: number) => (
                      <Select.Option key={i}>{item}</Select.Option>
                    ))}
                  </Select>

                </Col>
                <Col md={"6"}>
                  <div className="formLabel">{t("home_page.homepage.From_date")}</div>
                  <DatePicker.RangePicker
                    size="large"
                    className="width100"
                    // defaultValue={[
                    //   dayjs(dayjs().startOf('month'), "YYYY/MM/DD"),
                    //   dayjs(today, "YYYY/MM/DD"),
                    // ]}
                    defaultValue={[
                      dayjs().startOf('month'),
                      dayjs(todayy),
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
                  />
                </Col>
              </Row>
            </Card>
            <br />
            <Card title={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.OverallGST_Report") : t("home_page.homepage.OverallVAT_Report")}>
              <div className="Report-pageDetails">
                <div className="ReportHeadBox">
                    {t("home_page.homepage.Business_Name")}
                  <b>{User?.companyInfo?.bname}</b>
                </div>

                <div className="ReportHeadBox">
                  <b>{User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GST_Period") : t("home_page.homepage.VAT_Period")}</b>
                  <div>
                  {t("home_page.homepage.From")}: <b>{moment(startDate).format("DD-MM-YYYY")}</b>
                  </div>
                  <div>
                  {t("home_page.homepage.To")} : <b>{moment(endDate).format("DD-MM-YYYY")}</b>
                  </div>
                </div>
              </div>
            </Card>
            <br />

            {isLoading2 ? (
              <div className="LoaderBox">
                <Spin indicator={customIcon} />
              </div>
            ) : (
              <>
                <Card title={<strong>{User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTon_Sales") : t("home_page.homepage.VATon_Sales")}</strong>}>
                  <Table bordered hover striped>
                    <thead className="Report-thead">
                      <tr>
                      <th className="Report-table-th">{t("home_page.homepage.Rate")}</th>
                      {isCountry101 && (
                        <>
                          <th className="Report-table-th">{t("home_page.homepage.CGST")}</th>
                          <th className="Report-table-th">{t("home_page.homepage.CGST")}</th>
                        </>
                      )}
                      <th className="Report-table-th">{t("home_page.homepage.Amount")}</th>
                    </tr>
                    </thead>
                    <tbody>
                      {vat_on_sales && vat_on_sales?.map((item: any, i: number) => {
                        return (
                          <>
                            <tr key={i}>
                              <td>{item?.percentage}%</td>
                              {isCountry101 && (
                                <>
                                <td className="Report-table-td">{item?.total / 2}</td>
                                <td className="Report-table-td">{item?.total / 2}</td>
                                </>
                              )}
                              <td className="Report-table-td">{item?.total}</td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td>
                          <b>{isCountry101 ? t("home_page.homepage.TotalGSTon_Sales"):t("home_page.homepage.TotalVATon_Sales")}</b>
                        </td>
                        {isCountry101 && (
                          <>
                          <td>{totSaleValue && Number(totSaleValue/2).toFixed(2)}</td>
                          <td>{totSaleValue && Number(totSaleValue/2).toFixed(2)}</td>
                          </>
                        )}
                        <td
                          onClick={() =>
                            navigate(
                              `/usr/report/vatReturnView/54/${moment(
                                new Date(oneMonthAgoDate)
                              ).format("YYYY-MM-DD")}/${moment(
                                new Date(currentDate)
                              ).format("YYYY-MM-DD")}`
                            )
                          }
                          className="Report-table-td-total Report-td-link"
                        >
                          {totSaleValue && Number(totSaleValue).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
                <br />
                <Card title={<strong>{isCountry101 ? t("home_page.homepage.GSTon_Purchase"):t("home_page.homepage.VATon_Purchase")}</strong>}>
                  <Table bordered hover striped>
                    <thead className="Report-thead">
                      <th className="Report-table-th">{t("home_page.homepage.Rate")}</th>
                      {isCountry101 && (
                        <>
                        <th className="Report-table-th">{t("home_page.homepage.CGST")}</th>
                        <th className="Report-table-th">{t("home_page.homepage.CGST")}</th>
                        </>
                      )}
                      <th className="Report-table-th">{t("home_page.homepage.Amount")}</th>
                    </thead>
                    <tbody>
                      {vat_on_purchase && vat_on_purchase?.map((item: any, i: number) => {
                        return (
                          <>
                            <tr key={i}>
                              <td>{item?.percentage}%</td>
                              {isCountry101 && (
                                <>
                                <td className="Report-table-td">{item?.total / 2}</td>
                                <td className="Report-table-td">{item?.total / 2}</td>
                                </>
                              )}
                              <td className="Report-table-td">{item?.total}</td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td>
                          <b>{isCountry101 ? t("home_page.homepage.TotalGSTon_Sales") : t("home_page.homepage.VATon_Purchase")}</b>
                        </td>
                        {isCountry101 && (
                          <>
                          <td> {totPurchaseValue &&
                            Number(totPurchaseValue / 2).toFixed(2)}</td>
                          <td> {totPurchaseValue &&
                            Number(totPurchaseValue / 2).toFixed(2)}</td>
                          </>
                        )}
                        <td
                          onClick={() =>
                            navigate(
                              `/usr/report/vatReturnView/55/${moment(
                                new Date(oneMonthAgoDate)
                              ).format("YYYY-MM-DD")}/${moment(
                                new Date(currentDate)
                              ).format("YYYY-MM-DD")}`
                            )
                          }
                          className="Report-table-td-total Report-td-link"
                        >
                          {totPurchaseValue &&
                            Number(totPurchaseValue).toFixed(2)}
                        </td>
                      </tr>

                      <br />
                      <tr>
                        <td>
                          <b>{isCountry101 ? t("home_page.homepage.Overall_GST"): t("home_page.homepage.Overall_VAT")}</b>
                        </td>
                        {isCountry101 && (
                          <>
                          <td><b>{Number(
                              Number(totSaleValue / 2) - Number(totPurchaseValue / 2)
                            ).toFixed(2)}</b></td>
                        <td><b>{Number(
                              Number(totSaleValue / 2) - Number(totPurchaseValue / 2)
                            ).toFixed(2)}</b></td>
                          </>
                        )}
                        <td>
                          <b>
                            {Number(
                              Number(totSaleValue) - Number(totPurchaseValue)
                            ).toFixed(2)}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
                <br />
              </>
            )}
          </>
        )}
        {emailModal ? (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={User.email}
            fileName={`${isCountry101 ? 'GstDetails':'VatDetails'}${new Date()}.pdf`}
            Attachment={`${User.companyInfo.bname}${isCountry101 ? "_GstDetails_": "_vatDetails_"}${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: User.email,
              subject: `${isCountry101 ? 'GST' : 'VAT'}`,
              content: `${isCountry101 ? 'GST Details' : 'VAT Details'}`,
            }}
          />
        ) : null}
      </Container>
    </>
  );
};

export default VatReturns;
