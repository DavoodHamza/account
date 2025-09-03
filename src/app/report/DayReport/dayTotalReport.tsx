import { notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SendMailModal from "../../../components/sendMailModal";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { DaySummaryTemplate } from "./component/template";
import DaySummaryTable from "./dayTable";

const DayTotalReport = () => {
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const location = useLocation();
  const [daySummary, setDaySummary] = useState<any>([]);
  const [meta, setMeta] = useState<any>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { t } = useTranslation();

  const today = new Date();
  const yesterday = moment(today).subtract(1, "days").format("YYYY-MM-DD");

  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(yesterday);
  const { user } = useSelector((state: any) => state.User);

  useEffect(() => {
    getDaySummary(firstDate, endDate, page, limit);
  }, [firstDate, endDate, page, limit]);

  const getDaySummary = async (
    sdate: any,
    ldate: any,
    page: any,
    limit: any
  ) => {
    try {
      setIsLoading(true);
      const formattedDate = moment(new Date(sdate)).format("YYYY-MM-DD");
      const formattedEndDate = moment(new Date(ldate)).format("YYYY-MM-DD");
      let url =
        API.DAY_DETAIL_REPORT +
        `?sdate=${formattedDate}&ldate=${formattedEndDate}&companyid=${user?.companyInfo?.id}`;
      const daySummary: any = await GET(url, null);

      if (daySummary?.status) {
        setDaySummary(daySummary?.data);
      } else {
        notification.error({
          message: "Something went wrong",
          description: "no data found from the server",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again later..!",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };
  const handleDateRangeChange = (dates: any) => {
    setFirstDate(dates[0]);
    setEndDate(dates[1]);
    getDaySummary(dates[0], dates[1], page, limit);
  };

  const downLoadPdf = async (templates: any) => {
    let templateContent = templates;
    templateContent = templateContent;
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "Trial Balance",
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
    a.download = `DayReport_report_${moment(firstDate).format(
      "DD-MM-YYYY"
    )}_${moment(endDate).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
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
      notification.success({ message: "Email Sent Successfully " });
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
      setIsDownloadLoading(true);
      let obj = {
        user,
        personalData: user.companyInfo,
        data: daySummary,
        endDate,
        firstDate,
      };

      let templates: any = null;

      if (user) {
        templates = DaySummaryTemplate(obj);
      }
      if (type === "email") {
        sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }

      setIsDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setIsDownloadLoading(false);
    }
  }

  return (
    <>
      <Container>
        <DaySummaryTable
          list={daySummary}
          ldate={endDate}
          handleDateRangeChange={handleDateRangeChange}
          onPageChange={(page: any, take: any) => {
            setPage(page);
            setLimit(take);
          }}
          setPage={(page: any) => setPage(page)}
          setLimit={(limit: any) => setLimit(limit)}
          page={page}
          limit={limit}
          meta={meta}
          sdate={firstDate}
          loading={isLoading}
        />
      </Container>
      {emailModal && (
        <SendMailModal
          open={emailModal}
          close={() => setEmailModal(false)}
          onFinish={(val: any) => genrateTemplate("email", val)}
          ownMail={user.email}
          fileName={`dat_report${new Date()}.pdf`}
          Attachment={`${user.companyInfo.bname}_dat_report_${moment(
            new Date()
          ).format("DD-MM-YYYY")}`}
          defaultValue={{
            to: user.email,
            subject: `Day Report`,
            content: `Day Report`,
          }}
        />
      )}
    </>
  );
};

export default DayTotalReport;
