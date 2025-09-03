import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import DetailsTable from "./DetailsTable";
import { Button, Card, Tooltip, notification } from "antd";
import { Container, Table } from "react-bootstrap";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { journalTemplate } from "./template";
import SendMailModal from "../../../components/sendMailModal";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";

function JournalDetails() {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState<any>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const column = [
    {
      name: "details",
      title: t("home_page.homepage.Details"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "debit",
      title: t("home_page.homepage.Debit"),
      alignment: "center",
    },
    {
      name: "credit",
      title: t("home_page.homepage.Credit"),
      alignment: "center",
    },
  ];

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const url = API.JOURNAL + `getJournalById/${id}`;
      const { data }: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.log(error);
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
        personalData: data,
        invoiceData: "saleList?.ledgerList",
        openingBalance: "saleList?.openingBalance",
        type: "Customer",
      };

      let templates: any = null;
      if (!user) {
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
      if (!user) {
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
      
      if(user){
        templates = journalTemplate(obj)
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
        user,
        personalData: data,
        invoiceData: "saleList?.ledgerList",

        openingBalance: "saleList?.openingBalance",

        type: "Customer",
      };
      let templates = journalTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }

  const downLoadPdf = async (templates: any) => {
    try {
      let templateContent = templates?.replace("\r\n", "");
      templateContent = templateContent?.replace('\\"', '"');
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
      a.download = `Journaldetails${moment(new Date()).format("DD-MM-YYYY")}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);
  return (
    <div>
      <PageHeader
        firstPathLink={location.pathname.replace(`/details/${id}`, "")}
        firstPathText={t("home_page.homepage.Journal_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.JournalDetails")}
        buttonTxt={t("home_page.homepage.EDIT")}
        onSubmit={() => navigate(`/usr/journal/edit/${id}`)}
        goback="/usr/journal"
        title={t("home_page.homepage.JournalDetails")}
        children={
          <div>
            <Tooltip
              title="Download Invoice"
              mouseEnterDelay={0.5}
              arrow={false}
              color="white"
              overlayClassName="toolTip-Card"
              overlayInnerStyle={{
                color: "#000000",
                marginTop: 5,
                fontSize: "14px",
              }}
              placement={"bottom"}
            >
              <Button
                loading={downloadLoading}
                onClick={() => generateTemplate(data?.type, data)}
              >
                <MdFileDownload size={20} />
              </Button>
              <Button className="Report-HeaderButton-print" onClick={() => setEmailModal(true)}><MdAttachEmail size={20} /></Button>
            </Tooltip>
          </div>
        }
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <br />
          <Container>
            <Card>
              <Table>
                <thead>
                  <tr>
                    <th>{t("home_page.homepage.Date")}</th>
                    <th>{t("home_page.homepage.Reference")}</th>
                    <th>{t("home_page.homepage.Description")}</th>
                    <th>{t("home_page.homepage.Amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{moment(data?.userdate).format("DD-MM-YYYY")}</td>
                    <td>{data?.reference}</td>
                    <td>{data?.description}</td>
                    <td>{data?.total}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            {emailModal ? (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={user.email}
            fileName={`Journal${new Date()}.pdf`}
            Attachment={`${user.companyInfo.bname}_Journal_${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: user.email,
              subject: `Journal`,
              content: 'JournalDetails',
            }}
          />
        ) : null}
          </Container>
          <div>
            <DetailsTable columns={column} data={data?.column} />
          </div>
        </>
      )}
    </div>
  );
}
export default JournalDetails;
