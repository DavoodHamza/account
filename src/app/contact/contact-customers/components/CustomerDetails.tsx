import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import API from "../../../../config/api";
import { DELETE, GET } from "../../../../utils/apiCalls";
import { Col, Container, Row } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail, MdFileDownload } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdBusiness } from "react-icons/io";
import SalesInvoiceTable from "./SalesInvoiceTable";
import PageHeader from "../../../../components/pageHeader";
import { useLocation } from "react-router-dom";
import LoadingBox from "../../../../components/loadingBox";
import { template1 } from "../templates/template";
import moment from "moment";
import { Button, Card, notification } from "antd";
import { MdAttachEmail } from "react-icons/md";
import SendMailModal from "../../../../components/sendMailModal";
import { useTranslation } from "react-i18next";
import { MdCreditCard } from "react-icons/md";

function CustomerDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const { fDate, lDate } = location?.state || {};
  const startDay = moment(new Date(today.setDate(1))).format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(
    lDate || moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(fDate || startDay);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalClosing, setTotalClosing] = useState(0);
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [data, setData] = useState<any>([]);
  const [saleList, setSaleList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [emailModal, setEmailModal] = useState(false);

  const fetchCustomerDetails = async () => {
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

  const fetchSaleListByCustomer = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      const sales_list_url =
        API.CONTACT_MASTER +
        `statementListByContact/${adminid}/${id}/${sdate}/${ldate}`;
      const { data }: any = await GET(sales_list_url, null);
      //const latest = data?.ledgerList?.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setSaleList(data);
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

      //soft delete
      // const delete_ledger = API.S_DELETE_LEDGER + id;
      // const data: any = await GET(delete_ledger,null);
      fetchSaleListByCustomer(currentDate, firstDate);
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
    fetchSaleListByCustomer(dates[0], dates[1]);
  };

  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    fetchSaleListByCustomer(firstDate, currentDate);
  }, [page, take]);

  const personalDetails = [
    {
      label: t("home_page.homepage.Name"),
      text: data?.name,
      icon: <FaUserCircle size={22} />,
    },

    {
      label: t("home_page.homepage.Business_Name"),
      text: data?.bus_name ? data?.bus_name : "-",
      icon: <IoMdBusiness size={20} />,
    },

    {
      label: t("home_page.homepage.Business_Mobile"),
      text: data?.mobile ? data?.mobile : "-",
      icon: <FaPhoneAlt size={18} />,
    },
    {
      label: t("home_page.homepage.Business_Email"),
      text: data?.email ? data?.email : "-",
      icon: <MdEmail size={22} />,
    },
  ];

  const businessDetails = [
    {
      label: t("home_page.homepage.Address"),
      text: data?.address ? data?.address : "-",
      icon: <FaLocationDot size={20} />,
    },
    {
      label:
          user?.companyInfo?.tax === "gst"
          ? t("home_page.homepage.GSTIN_UIN")
          : t("home_page.homepage.VAT_Number"),
      text: data?.vat_number ? data?.vat_number : "-",
      icon: <IoMdBusiness size={20} />,
    },
    // {
    //   label: "Telephone",
    //   text: data?.telephone ? data?.telephone : "-",
    //   icon: <FaPhoneAlt size={20} />,
    // },
    {
      label: t("home_page.homepage.country"),
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
        invoiceData: saleList?.ledgerList,
        totalDebit,
        totalCredit,
        totalClosing,
        openingBalance: saleList?.openingBalance,
        currentDate,
        firstDate,
        type: "Customer",
      };

      let templates: any = null;
      if (!user) {
        notification.error({
          message: (
            <div>{t("home_page.homepage.Pleaseselectanemailtemplate")}</div>
          ),
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}
            >
              {t("home_page.homepage.Clickto_select")}
            </Button>
          ),
        });
        return;
      }
      if (!user) {
        notification.error({
          message: (
            <div>{t("home_page.homepage.PleaseselectdefaultBank")} </div>
          ),
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/profile/business")}
            >
              {t("home_page.homepage.Clickto_select")}
            </Button>
          ),
        });
        return;
      }
      if (user) {
        templates = template1(obj);
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
        invoiceData: saleList?.ledgerList,
        totalDebit,
        totalCredit,
        totalClosing,
        openingBalance: saleList?.openingBalance,
        currentDate,
        firstDate,
        type: "Customer",
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
    a.download = `customerdetails${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace(`/details/${id}`, "")}
        firstPathText={t("home_page.homepage.Customers_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.Customer_Details")}
        goback="/usr/contactCustomers"
        title={t("home_page.homepage.Customer_Details")}
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
              <h5> {t("home_page.homepage.Customer_Details")}</h5>
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
                        {details.icon}
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
              <br />
              <h5>{t("home_page.homepage.Loyalty_Program")}</h5>
              <hr />
              <Row>
                <Col md={6}>
                  <div className="customer-details-row">
                    <div className="customer-icon-container">
                      <MdCreditCard size={20} />
                    </div>
                    <h6 className="customer-icon-text mb-0">
                     {t("home_page.homepage.CardNumber")}  :{" "}
                      {data?.loyaltyCardNumber ? data?.loyaltyCardNumber : "-"}
                    </h6>
                  </div>
                  {/* <br /> */}
                  <div className="customer-details-row">
                    <div className="customer-icon-container">
                      <MdCreditCard size={20} />
                    </div>
                    <h6 className="customer-icon-text mb-0">
                      loyalty Points :{" "}
                      {data?.loyaltyPoints ? data?.loyaltyPoints : "-"}
                    </h6>
                  </div>
                </Col>
                <Col md={6}>
                  {data?.referredCode && (
                    <div className="customer-details-row">
                      <div className="customer-icon-container">
                        <FaLocationDot size={20} />
                      </div>
                      <h6 className="customer-icon-text mb-0">
                          {t("home_page.homepage.Referred_from")} :{" "}
                        {data?.MdCreditCard ? data?.referredCode : "-"}
                      </h6>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>

            <br />
            <Card>
              <SalesInvoiceTable
                list={saleList?.ledgerList}
                currentDate={currentDate}
                oneMonthAgoDate={firstDate}
                onPageChange={(p: any, t: any) => onPageChange(p, t)}
                handleDateRangeChange={handleDateRangeChange}
                handleDelete={handleDelete}
                openingBalance={saleList?.openingBalance}
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
                fileName={`customerDetails${new Date()}.pdf`}
                Attachment={`${data.bus_name}_${moment(new Date()).format(
                  "DD-MM-YYYY"
                )}`}
                defaultValue={{
                  to: user.email,
                  subject: `Customer Details`,
                  content: user.email,
                }}
              />
            ) : null}
          </Container>
          <br />
        </>
      )}
    </>
  );
}

export default CustomerDetails;
