// import { Button, Card, DatePicker, notification } from "antd";
// import { useEffect, useState } from "react";
// import { Col, Container, Row } from "react-bootstrap";
// import { MdAttachEmail, MdFileDownload } from "react-icons/md";
// import { useSelector } from "react-redux";
// import LoadingBox from "../../../components/loadingBox";
// import PageHeader from "../../../components/pageHeader";
// import "../styles.scss";
// import { useTranslation } from "react-i18next";
// import dayjs from "dayjs";
// import moment from "moment";
// import { useLocation, useNavigate } from "react-router-dom";
// import SendMailModal from "../../../components/sendMailModal";
// import API from "../../../config/api";
// import { GET, POST } from "../../../utils/apiCalls";
// import Sheet from "./sheet";
// import { balanceSheetTemplate } from "./template";

// const BalanceSheet = () => {
//   const [emailModal, setEmailModal] = useState(false);
//   const navigate = useNavigate();
//   const { user } = useSelector((state: any) => state.User);
//   const location = useLocation();
//   const { t } = useTranslation();

//   const dateFormat = "YYYY-MM-DD";
//   const [fromDate, setFromDate] = useState(
//     moment(user.companyInfo.books_begining_from).format(dateFormat)
//   );
//   const [toDate, setToDate] = useState(moment().format(dateFormat));
//   const [downloadLoading, setDownloadLoading] = useState(false);
//   const [profitLoss, setProfitLoss] = useState<any>([]);

//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState({});

//   useEffect(() => {
//     loadData(fromDate, toDate);
//     getProfitLoss(fromDate, toDate)
//   }, [])

//   const ChangeDates = (values: any) => {
//     let from = moment(user.companyInfo.books_begining_from).format(dateFormat);
//     let to = (values).format(dateFormat)
//     setFromDate(from);
//     setToDate(to);
//     loadData(from, to);
//     getProfitLoss(from, to)
//   };
//   const downLoadPdf = async (templates: any) => {
//     let templateContent = templates.replace("\r\n", "");
//     templateContent = templateContent.replace('\\"', '"');
//     const encodedString = btoa(templateContent);
//     const pdf_url = API.PDF_GENERATE_URL;
//     const pdfData = {
//       filename: "Sales Invoice",
//       html: encodedString,
//       isDownload: true,
//       sendEmail: false,
//       type: "",
//       userid: "",
//     };
//     const token = user.token;

//     const response = await fetch(pdf_url, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(pdfData),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const pdfBlob = await response.arrayBuffer();
//     const blob = new Blob([pdfBlob], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `BalanceSheet${moment(new Date()).format("DD-MM-YYYY")}`;
//     a.click();
//     URL.revokeObjectURL(url);

//   }
//   const sendMailPdf = async (templates: any, email: any) => {
//     let templateContent = templates.replace("\r\n", "");
//     templateContent = templateContent.replace('\\"', '"');
//     const encodedString = btoa(templateContent);
//     const pdf_url = API.PDF_GENERATE_URL;
//     const pdfData = {
//       email: email,
//       filename: "Sales Invoice",
//       html: encodedString,
//       isDownload: false,
//       sendEmail: true,
//       type: "",
//       userid: "",
//     };
//     const token = user.token;

//     const response = await fetch(pdf_url, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(pdfData),
//     });

//     if (response.ok) {
//       notification.success({ message: "Email Successfully Sent" });
//       setEmailModal(false);
//     }
//     if (!response.ok) {
//       notification.success({
//         message:
//           "Apologies, there was an error when attempting to send the email.",
//       });
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//   };
//   async function genrateTemplate(type: any, emaildata: any) {
//     try {
//       setDownloadLoading(true);
//       let obj = {
//         user,
//         balanceSheetData: data,
//         User: user,
//         personalData: user.companyInfo,
//         toDate: toDate,
//         profit:data,
//       };

//       let templates: any = null;
//       if (!user) {
//         notification.error({
//           message: <div>Please select an email template</div>,
//           description: (
//             <Button
//               type={"link"}
//               onClick={() => navigate("/usr/settings/customize")}
//             >
//               Click to select
//             </Button>
//           ),
//         });
//         return;
//       }
//       if (!user) {
//         notification.error({
//           message: <div>Please select default Bank </div>,
//           description: (
//             <Button
//               type={"link"}
//               onClick={() => navigate("/usr/profile/business")}
//             >
//               Click to select
//             </Button>
//           ),
//         });
//         return;
//       }

//       if (user) {
//         templates = balanceSheetTemplate(obj)
//       }
//       if (type === "email") {
//         sendMailPdf(templates, emaildata);
//       } else {
//         await downLoadPdf(templates);
//       }

//       setDownloadLoading(false);
//     } catch (error) {
//       console.log(error);
//       setDownloadLoading(false);
//     }
//   }
//   async function generateTemplate(type: any, emaildata: any) {
//     try {
//       setDownloadLoading(true);
//       let obj = {
//         user,
//         balanceSheetData: data,
//         User: user,
//         personalData: user.companyInfo,
//         toDate: toDate,
//         profit:data,

//       }
//       let templates = balanceSheetTemplate(obj);
//       await downLoadPdf(templates);
//       setDownloadLoading(false);
//     } catch (error) {
//       console.log(error);
//       setDownloadLoading(false);
//     }
//   }

//   const loadData = async (from: any, to: any) => {
//     try {
//       setIsLoading(true);
//       let obj = {
//         adminid: user?.id,
//         companyid:user?.companyInfo?.id,
//         from: from,
//         to: to
//       }
//       const response: any = await POST(API.BALANCESHEET, obj);
//       if (response?.status) {
//         setData(response?.data);
//       } else {

//       }
//       // setIsLoading(false);
//     } catch (err) {
//       setIsLoading(false);
//     }
//   };

//   const getProfitLoss = async (sdate: any, edate: any) => {
//     try {
//       // setIsLoading(true);
//       let url =
//         API.PROFITLOSS +
//         user?.id +
//         "/" +
//         user?.companyInfo?.id +
//         "/" +
//         sdate +
//         "/" +
//         edate;
//       const profitLoss: any = await GET(url, null);
//         setProfitLoss(profitLoss?.data);

//     } catch (error) {
//       console.log(error);
//       notification.error({
//         message: "Error",
//         description: "Something went wrong. Please try again later..!",
//       });
//     } finally {
//       setIsLoading(false);
//       // setTimeout(() => {
//       //   setIsLoading(false);
//       // }, 2000);
//     }
//   };

//   return (
//     <div>
//       <PageHeader
//         title={t("home_page.homepage.BalanceSheet")}
//         secondPathText ={t("home_page.homepage.BalanceSheet")}
//         secondPathLink = {location.pathname}
//         firstPathText={t("home_page.homepage.Report")}
//         firstPathLink="/usr/report"
//         children={
//           <div>
//             <Button onClick={() => generateTemplate("downLoad", {})}>
//               <MdFileDownload size={20} />
//             </Button>
//             &nbsp;
//             <Button onClick={() => setEmailModal(true)}>
//               <MdAttachEmail size={20} />
//             </Button>
//             &nbsp;
//             {/* <Button>
//               <IoShareSocial size={20} />
//             </Button> */}
//           </div>
//         }
//       />
//       <Card style={{ height: 70 }}>
//         <Row>
//           <Col sm={9}></Col>
//           <Col sm={3} style={{ padding: 0, marginTop: -10 }}>
//             <DatePicker
//               style={{ width: "100%" }}
//               defaultValue={dayjs(toDate, dateFormat)}
//               size="large" format={dateFormat}
//               onChange={(value: any) => ChangeDates(value)}
//             />
//           </Col>
//         </Row>
//       </Card>
//       <br />
//       {isLoading ? (
//         <LoadingBox />
//       ) : (
//         <Container>
//           <Card>
//             <Sheet toDate={toDate} data={data} user={user} profitLoss={profitLoss} />
//           </Card>
//           {emailModal ? (
//             <SendMailModal
//               open={emailModal}
//               close={() => setEmailModal(false)}
//               onFinish={(val: any) => genrateTemplate("email", val)}
//               ownMail={user.email}
//               fileName={`balanceSheetDetails${new Date()}.pdf`}
//               Attachment={`${user.companyInfo.bname}_balanceSheet_${moment(new Date()).format("DD-MM-YYYY")}`}
//               defaultValue={{
//                 to: user.email,
//                 subject: `Balance Sheet`,
//                 content: `Balance Sheet Details`,
//               }}
//             />
//           ) : null}
//         </Container>
//       )}
//     </div>
//   );
// };

// export default BalanceSheet;

import { Button, Card, DatePicker, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import "../styles.scss";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import SendMailModal from "../../../components/sendMailModal";
import API from "../../../config/api";
import { GET, POST } from "../../../utils/apiCalls";
import Sheet from "./sheet";
import { balanceSheetTemplate } from "./template";

const BalanceSheet = () => {
  const [emailModal, setEmailModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const location = useLocation();
  const { t } = useTranslation();

  const dateFormat = "YYYY-MM-DD";
  const [fromDate, setFromDate] = useState(
    moment(user.companyInfo.books_begining_from).format(dateFormat)
  );
  const [toDate, setToDate] = useState(moment().format(dateFormat));
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [profitLoss, setProfitLoss] = useState<any>({
    values: { netProfit: 0 },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalLabilities: 0,
    totalAssets: 0,
    currentLiability: [],
    currentAsset: [],
    bankSum: 0,
    cashinHand: 0,
    stockWIthVatRecivable: 0,
    vatPayble: 0,
    vatRecivable: 0,
    futureLiability: [],
    futureAsset: [],
    datacapital: [],
    capital: 0,
    fixedAssets: [],
    totalFixedAssets: 0,
  });

  useEffect(() => {
    loadData(fromDate, toDate);
    getProfitLoss(fromDate, toDate);
  }, []);

  const ChangeDates = (values: any) => {
    let from = moment(user.companyInfo.books_begining_from).format(dateFormat);
    let to = values.format(dateFormat);
    setFromDate(from);
    setToDate(to);
    loadData(from, to);
    getProfitLoss(from, to);
  };

  const safeNumber = (value: any) => (isNaN(Number(value)) ? 0 : Number(value));

  const downLoadPdf = async (templates: any) => {
    try {
      let templateContent = templates.replace("\r\n", "");
      templateContent = templateContent.replace('\\"', '"');
      const encodedString = btoa(templateContent);
      const pdf_url = API.PDF_GENERATE_URL;
      const pdfData = {
        filename: "Balance Sheet",
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
      a.download = `BalanceSheet${moment(new Date()).format("DD-MM-YYYY")}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      notification.error({
        message: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
      });
    }
  };

  const sendMailPdf = async (templates: any, email: any) => {
    try {
      let templateContent = templates.replace("\r\n", "");
      templateContent = templateContent.replace('\\"', '"');
      const encodedString = btoa(templateContent);
      const pdf_url = API.PDF_GENERATE_URL;
      const pdfData = {
        email: email,
        filename: "Balance Sheet",
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
      } else {
        notification.error({
          message: "Email Failed",
          description: "Failed to send email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Email error:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while sending email.",
      });
    }
  };

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);

      const profitValue = safeNumber(profitLoss?.values?.netProfit || 0);

      let obj = {
        user,
        balanceSheetData: data,
        User: user,
        personalData: user.companyInfo,
        toDate: toDate,
        profit: profitValue,
      };

      let templates: any = null;

      if (!user) {
        notification.error({
          message: <div>Please select an email template</div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}>
              Click to select
            </Button>
          ),
        });
        return;
      }

      templates = balanceSheetTemplate(obj);

      if (type === "email") {
        await sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }
    } catch (error) {
      console.error("Template generation error:", error);
      notification.error({
        message: "Error",
        description: "Failed to generate document. Please try again.",
      });
    } finally {
      setDownloadLoading(false);
    }
  }

  const loadData = async (from: any, to: any) => {
    try {
      setIsLoading(true);
      let obj = {
        adminid: user?.id,
        companyid: user?.companyInfo?.id,
        from: from,
        to: to,
      };

      const response: any = await POST(API.BALANCESHEET, obj);

      if (response?.status) {
        setData({
          ...response.data,
          totalLabilities: safeNumber(response.data?.totalLabilities),
          totalAssets: safeNumber(response.data?.totalAssets),
          bankSum: safeNumber(response.data?.bankSum),
          cashinHand: safeNumber(response.data?.cashinHand),
          stockWIthVatRecivable: safeNumber(
            response.data?.stockWIthVatRecivable
          ),
          vatPayble: safeNumber(response.data?.vatPayble),
          vatRecivable: safeNumber(response.data?.vatRecivable),
          capital: safeNumber(response.data?.capital),
          totalFixedAssets: safeNumber(response.data?.totalFixedAssets),
        });
      } else {
        notification.error({
          message: "Error",
          description: response?.message || "Failed to load balance sheet data",
        });
      }
    } catch (err) {
      console.error("Balance sheet load error:", err);
      notification.error({
        message: "Error",
        description: "Failed to load balance sheet data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProfitLoss = async (sdate: any, edate: any) => {
    try {
      let url =
        API.PROFITLOSS +
        user?.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        sdate +
        "/" +
        edate;

      const response: any = await GET(url, null);

      if (response?.data) {
        setProfitLoss({
          ...response.data,
          values: {
            ...response.data.values,
            netProfit: safeNumber(response.data.values?.netProfit),
          },
        });
      }
    } catch (error) {
      console.error("Profit/Loss load error:", error);
      notification.error({
        message: "Error",
        description: "Failed to load profit/loss data",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.BalanceSheet")}
        secondPathText={t("home_page.homepage.BalanceSheet")}
        secondPathLink={location.pathname}
        firstPathText={t("home_page.homepage.Report")}
        firstPathLink="/usr/report"
        children={
          <div>
            <Button
              onClick={() => genrateTemplate("downLoad", {})}
              loading={downloadLoading}>
              <MdFileDownload size={20} />
            </Button>
            &nbsp;
            <Button
              onClick={() => setEmailModal(true)}
              loading={downloadLoading}>
              <MdAttachEmail size={20} />
            </Button>
          </div>
        }
      />
      <Card style={{ height: 70 }}>
        <Row>
          <Col sm={9}></Col>
          <Col sm={3} style={{ padding: 0, marginTop: -10 }}>
            <DatePicker
              style={{ width: "100%" }}
              defaultValue={dayjs(toDate, dateFormat)}
              size="large"
              format={dateFormat}
              onChange={(value: any) => ChangeDates(value)}
            />
          </Col>
        </Row>
      </Card>
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Sheet
              toDate={toDate}
              data={data}
              user={user}
              profitLoss={profitLoss}
            />
          </Card>
          {emailModal && (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              ownMail={user.email}
              fileName={`balanceSheetDetails${new Date()}.pdf`}
              Attachment={`${user.companyInfo.bname}_balanceSheet_${moment(
                new Date()
              ).format("DD-MM-YYYY")}`}
              defaultValue={{
                to: user.email,
                subject: `Balance Sheet`,
                content: `Balance Sheet Details`,
              }}
            />
          )}
        </Container>
      )}
    </div>
  );
};

export default BalanceSheet;
