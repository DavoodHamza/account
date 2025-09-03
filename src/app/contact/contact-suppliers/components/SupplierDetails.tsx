import { Button, Card, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdBusiness } from "react-icons/io";
import { MdAttachEmail, MdEmail, MdFileDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import SendMailModal from "../../../../components/sendMailModal";
import API from "../../../../config/api";
import { DELETE, GET } from "../../../../utils/apiCalls";
import { template1 } from "../../contact-customers/templates/template";
import PurchaseInvoiceTable from "./PurchaseInvoiceTable";
function CustomerDetails() {
  const {t} = useTranslation();
  const location = useLocation();

  const { fDate, lDate } = location.state || {};
  const today = new Date();
  const startDay =moment(new Date(today.setDate(1))).format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(lDate || moment(new Date()).format("YYYY-MM-DD"));
  const [firstDate, setFirstDate] = useState(fDate || startDay);
  const [totalDebit,setTotalDebit] = useState(0)
  const [totalCredit,setTotalCredit] = useState(0)
  const [totalClosing,setTotalClosing] = useState(0)
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [data, setData] = useState<any>([]);
  const [purchaseList, setPurchaseList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const fetchSupplierDetails = async () => {
    try {
      setIsLoading(true);
      const customer_details_url = API.CONTACT_MASTER + `details/${id}`;
      const { data }: any = await GET(customer_details_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchPurchaseList = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      const purchase_list_url =
        API.CONTACT_MASTER +
        `statementListByContact/${adminid}/${id}/${sdate}/${ldate}`;
      const { data }: any = await GET(purchase_list_url, null);
      setPurchaseList(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const delete_ledger = API.LEDGER_DEATAILS + id;
      const data: any = await DELETE(delete_ledger);
      fetchPurchaseList(firstDate, currentDate);
      notification.success({
        message: "Data Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something went wrong!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setCurrentDate(dates[0]);
    setFirstDate(dates[1]);
    fetchPurchaseList(dates[0], dates[1]);
  };

  useEffect(() => {
    fetchSupplierDetails();
    fetchPurchaseList(firstDate, currentDate);
  }, []);

  const personalDetails = [
    {
      label: t("home_page.homepage.Name"),
      text: data?.name,
      icon: <FaUserCircle size={22} />,
    },
    {
      label: t("home_page.homepage.Business_Email"),
      text: data?.email ? data?.email : "-",
      icon: <MdEmail size={22} />,
    },
    {
      label: t("home_page.homepage.Business_Mobile"),
      text: data?.mobile ? data?.mobile : "-",
      icon: <FaPhoneAlt size={18} />,
    },
    {
      label: t("home_page.homepage.Address"),
      text: data?.address ? data?.address : "-",
      icon: <FaLocationDot size={20} />,
    },
  ];

  const businessDetails = [
    {
      label: t("home_page.homepage.Business_Name"),
      text: data?.bus_name ? data?.bus_name : "-",
      icon: <IoMdBusiness size={20} />,
    },
    {
      label:
      user?.companyInfo?.tax === "gst"
          ? t("home_page.homepage.GSTIN_UIN")
          : t("home_page.homepage.VAT_Number"),
      text: data?.vat_number ? data?.vat_number : "-",
      icon: <IoMdBusiness size={20} />,
    },
    {
      label: t("home_page.homepage.Country"),
      text: data?.country ? data?.country : "-",
      icon: <FaLocationDot size={20} />,
    },
    {
      label: t("home_page.homepage.Reference"),
      text: data?.reference,
      icon: <IoMdBusiness size={20} />,
    },
  ];
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
        invoiceData: purchaseList?.ledgerList,
        totalDebit,
        totalCredit,
        totalClosing,
        openingBalance: purchaseList?.openingBalance,
        currentDate,
        firstDate,
        type: "Supplier",
      };
      let templates = template1(obj);
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
        invoiceData: purchaseList?.ledgerList,
        totalDebit,
        totalCredit,
        totalClosing,
        openingBalance: purchaseList?.openingBalance,
        currentDate,
        firstDate,
        type: "Supplier",
      };
      let templates = template1(obj);
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
    a.download = `Supplierdetails${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace(`/details/${id}`, "")}
        firstPathText={t("home_page.homepage.Suppliers_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.SupplierDetails")}
        goback="/usr/contactSuppliers"
        title={t("home_page.homepage.SupplierDetails")}
        children={
          <div>
            <Button
              onClick={() => generateTemplate("downLoad", {})}
              loading={downloadLoading}
            >
              <MdFileDownload size={20} />
            </Button>{" "}
            <Button onClick={() => setEmailModal(true)}>
              <MdAttachEmail size={20} />
            </Button>
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
              <h5>{t("home_page.homepage.SupplierDetails")}</h5>
              <hr />
              <Row>
                <Col md={6}>
                  {personalDetails.map((details: any) => (
                    <div className="customer-details-row">
                      <div className="customer-icon-container">
                        {" "}
                        {details.icon}
                      </div>{" "}
                      <h6 className="customer-icon-text mb-0">
                        {details.label} :
                      </h6>
                      <h6 className="customer-icon-text mb-0">
                        {details?.text}
                      </h6>
                    </div>
                  ))}
                </Col>
                <Col md={6}>
                  {businessDetails.map((details: any) => (
                    <div className="customer-details-row">
                      <div className="customer-icon-container">
                        {details.icon}{" "}
                      </div>
                      <h6 className="customer-icon-text mb-0">
                        {details.label} :
                      </h6>
                      <h6 className="customer-icon-text mb-0">
                        {details?.text}
                      </h6>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card>

            <br />
            <Card>
              <PurchaseInvoiceTable
                list={purchaseList?.ledgerList}
                oneMonthAgoDate={firstDate}
                handleDateRangeChange={handleDateRangeChange}
                handleDelete={handleDelete}
                currentDate={currentDate}
                openingBalance={purchaseList?.openingBalance}
                name={data?.name}
                setTotalClosing={setTotalClosing}
                setTotalDebit={setTotalDebit}
                setTotalCredit={setTotalCredit}
              />
            </Card>
            {emailModal ? (
              <SendMailModal
                open={emailModal}
                close={() => setEmailModal(false)}
                onFinish={(val: any) => genrateTemplate("email", val)}
                ownMail={user.email}
                fileName={`supplierDetails${new Date()}.pdf`}
                Attachment={`${data.bus_name}_${moment(new Date()).format(
                  "DD-MM-YYYY"
                )}`}
                defaultValue={{
                  to: user.email,
                  subject: `Supplier Details`,
                  content: user.email,
                }}
              />
            ) : null}
          </Container>
        </>
      )}
    </>
  );
}

export default CustomerDetails;
