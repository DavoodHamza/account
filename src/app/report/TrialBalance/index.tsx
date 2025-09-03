import { Button, notification } from "antd";
import PageHeader from '../../../components/pageHeader';
import TrialTable from '../TrialBalance/TrialTable';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { useEffect, useState } from "react";
import moment from "moment";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../utils/apiCalls";
import { trialBalanceTemplate } from "./template";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";

const TrialBalance = () => {
  const [isDownloadLoading,setIsDownloadLoading] = useState(false)
  const location = useLocation()
  const [trialbalance, settrialbalance] = useState<any>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const today = new Date();
  const startDay =moment(new Date(today.setDate(1))).format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [firstDate, setFirstDate] = useState(startDay);

  const { user } = useSelector((state: any) => state.User);

  const getTrialBalance = async (sdate: any, edate: any) => {
    try {
      setIsLoading(true)
      const formattedSDate = moment(new Date(sdate)).format("YYYY-MM-DD");
      const formattedEDate = moment(new Date(edate)).format("YYYY-MM-DD");
      let url =
        API.TRIAL_BALANCE +
        user?.id +
        "/" +
        user?.companyInfo?.id+
        "/" +
        formattedSDate +
        "/" +
        formattedEDate;
      const TrialBalance: any = await GET(url, null);

      if (TrialBalance?.status) {
        settrialbalance(TrialBalance?.data);
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
      setTimeout(()=>{
        setIsLoading(false);
      },2000)
    }
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
    a.download = `trial_balance_report_${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);

  }

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
        personalData:user.companyInfo,
        data:trialbalance?.ledgers,
        datas:trialbalance,
        currentDate,
        firstDate,
      };
      
      let templates: any = null;
    

      
      if(user){
        templates = trialBalanceTemplate(obj)
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
  useEffect(() => {
    getTrialBalance(firstDate, currentDate);
  }, [currentDate,firstDate]);

  return (
   <>
   <PageHeader
        firstPathText={t("home_page.homepage.Report")}
        firstPathLink='/usr/report'
        secondPathText={t("home_page.homepage.Trial_Balance")}
        secondPathLink= {location.pathname}
        title={t("home_page.homepage.Trial_Balance")}
        children={
          <div>
               <Button
                onClick={() => genrateTemplate("downLoad", {})}
                loading={isDownloadLoading}
              >
                <MdFileDownload size={20} />
              </Button>{' '}
              <Button 
              onClick={() => setEmailModal(true)}
              >
                <MdAttachEmail size={20} />
              </Button>
            
          </div>
        }
      />
      <Container>
     
      <TrialTable trialbalance={trialbalance} getTrialBalance={getTrialBalance}
       setFirstDate={setFirstDate}
        setCurrentDate={setCurrentDate}
        currentDate={currentDate}
        firstDate={firstDate}
        isLoading = {isLoading}
        />
      </Container>
      {emailModal && (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={user.email}
            fileName={`trialBalanceDetails${new Date()}.pdf`}
            Attachment={`${user.companyInfo.bname}_trialBalance_${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: user.email,
              subject: `Trial Balance`,
              content: `Trial Balance Details`,
            }}
          />
        ) }
   </>
  )
}

export default TrialBalance