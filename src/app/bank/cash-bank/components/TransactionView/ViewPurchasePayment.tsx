import React, { useEffect, useState } from "react";
import PageHeader from "../../../../../components/pageHeader";
import { Container, Table } from "react-bootstrap";
import { Card, Tooltip, Button, notification } from "antd";
import { useLocation, useParams } from "react-router-dom";
import { GET } from "../../../../../utils/apiCalls";
import API from "../../../../../config/api";
import moment from "moment";
import LoadingBox from "../../../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import { BsPrinter } from "react-icons/bs";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import {
  template1,
  template2,
  template3,
  template4,
  template5,
} from "../templates";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SendMailModal from "../../../../../../src/components/sendMailModal";
import PrintModal from "../../../../../components/printModal/printModal";
import { TemplateReceipts } from "../TransactionView/ReceiptTemplate";
function ViewPurchasePayment() {
  const { t } = useTranslation();
  const location = useLocation();
  const [printLoading, setPrintLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<any>([]);
  const [saledetail, setsaleDetail] = useState<any>({});
  const { id: transactionid, purchaseType: type } = useParams();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [Id, setId] = useState<any>({});
  const [Type, setType] = useState<"sales" | "purchase" | null>(null);
  const [template, setTemplate] = useState();
  const [heading, setHeading] = useState();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const url = API.LEDGER_DEATAILS + `${transactionid}`;
      const { data }: any = await GET(url, null);
      let datas: any = [data];
      setHeading(data?.type);
      if (data.saleid) {
        setId(data.saleid);
        setType("sales");
      } else if (data.purchaseid) {
        setId(data.purchaseid);
        setType("purchase");
      }
      setDetails(datas);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url;
      if (Type === "purchase") {
        url = API.VIEW_PURCHASE_INVOICE + `${Id}` + "/" + `${Type}`;
      } else {
        url = API.VIEW_SALE_INVOICE + `${Id}` + "/" + `${Type}`;
      }
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails?.status) {
        setsaleDetail(getInvDetails?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFullLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
    if (Id && Type) {
      getInvoiceDetails();
    }
  }, [Id, Type]);
  const sendMailPdf = async (templates: any, email: any) => {
    let templateContent = templates?.replace("\r\n", "");
    templateContent = templateContent?.replace('\\"', '"');
    let updatedTemplateContent = templateContent
      ?.replace(/[\r\n]/g, "")
      ?.replace(/\\"/g, "")
      ?.replace(/[\u0100-\uffff]/g, "");
    const encodedString = btoa(
      unescape(encodeURIComponent(updatedTemplateContent))
    );
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      email: email,
      filename: `${heading}.pdf`,
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
      const chunkSize = 8;
      const splitArray = [];
      const invoiceItems = saledetail?.invoiceItems;
      for (let i = 0; i < invoiceItems.length; i += chunkSize) {
        splitArray.push(invoiceItems.slice(i, i + chunkSize));
      }
      let obj = {
        user: user,
        customer: saledetail?.invoiceDetails?.customer,
        sale: saledetail?.invoiceDetails,
        productlist: saledetail?.invoiceItems,
        invoicearray: splitArray,
        bankList: saledetail?.banking,
        netTotal: Number(saledetail?.invoiceDetails?.taxable_value),
        vatTotal: Number(saledetail?.invoiceDetails?.total_vat),
        isPaymentInfo: true,
        pagetype: heading,
        selectedBank: user?.companyInfo?.bankInfo,
        path: saledetail?.invoiceItems[0]?.product?.itemtype,
      };

      let templates: any = null;
      if (!user.companyInfo.defaultinvoice) {
        notification.error({
          message: <div>{t("home_page.homepage.please_select_email")}</div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}
            >
              {t("home_page.homepage.click_select")}
            </Button>
          ),
        });
        setDownloadLoading(false);
        return;
      }
      if (!user?.companyInfo?.bankInfo?.id) {
        notification.error({
          message: <div>{t("home_page.homepage.select_default_bank")} </div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/company-profile")}
            >
              {t("home_page.homepage.click_select")}
            </Button>
          ),
        });
        setDownloadLoading(false);
        return;
      }
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      } else if (user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      } else if (user.companyInfo.defaultinvoice === "5") {
        templates = template5(obj);
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
  const downLoadPdf = async (templates: any) => {
    let templateContent = templates?.replace("\r\n", "");
    templateContent = templateContent?.replace('\\"', '"');
    let updatedTemplateContent = templateContent
      ?.replace(/[\r\n]/g, "")
      ?.replace(/\\"/g, "")
      ?.replace(/[\u0100-\uffff]/g, "");

    const encodedString = btoa(
      unescape(encodeURIComponent(updatedTemplateContent))
    );
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "",
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
    a.download = `${heading}_${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const printtemplate = async () => {
    try {
      setPrintLoading(true);
      const chunkSize = 8;
      const splitArray = [];
      const invoiceItems = saledetail?.invoiceItems;
      for (let i = 0; i < invoiceItems.length; i += chunkSize) {
        splitArray.push(invoiceItems.slice(i, i + chunkSize));
      }

      let obj = {
        user: user,
        customer: saledetail?.invoiceDetails?.customer,
        sale: saledetail?.invoiceDetails,
        productlist: saledetail?.invoiceItems,
        invoicearray: splitArray,
        bankList: saledetail?.banking,
        total: saledetail?.invoiceDetails?.total,
        vatTotal: saledetail?.invoiceDetails?.total_vat,
        isPaymentInfo: true,
        pagetype: heading,
        selectedBank: user?.companyInfo?.bankInfo,
        taxType:
          saledetail?.invoiceDetails &&
          saledetail?.invoiceDetails.customer.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2),
      };
      let templates: any = null;
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      } else if (user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      } else if (user.companyInfo.defaultinvoice === "5") {
        templates = template5(obj);
      }
      setTemplate(templates);
      setPrintLoading(false);
      setIsLoading(false);
      setModalOpen(true);
    } catch (error) {
      console.log(error);
      setPrintLoading(false);
    }
  };
  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user: user,
        personalData: user.companyInfo,
        legerDetails: details,
      };
      let templates = TemplateReceipts(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathText={t("home_page.homepage.BankDetails")}
        thirdPathLink={location.pathname}
        thirdPathText={t("home_page.homepage.View")}
        goback={-1}
        title={
          type == "supplier-payment"
            ? "View Supplier Payment"
            : type == "other-payment"
            ? "Other Payment"
            : type == "customer-refund"
            ? "Customer Refund"
            : type == "other-receipt"
            ? "View Other Reciept"
            : type == "customer-receipt"
            ? "View Customer Reciept"
            : type == "supplier-refund"
            ? "Supplier Refund"
            : ""
        }
        children={
          type === "customer-receipt" ? (
            <div>
              <Tooltip
                title="Print Invoice"
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
                <Button onClick={() => printtemplate()} loading={printLoading}>
                  <BsPrinter size={20} />
                </Button>
              </Tooltip>
              &nbsp;
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
                  onClick={() => genrateTemplate("downLoad", {})}
                  loading={downloadLoading}
                >
                  <MdFileDownload size={20} />
                </Button>
              </Tooltip>
              &nbsp;
              <Tooltip
                title="Mail invoice"
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
                <Button onClick={() => setEmailModal(true)}>
                  <MdAttachEmail size={20} />
                </Button>
              </Tooltip>
            </div>
          ) : (
            <>
              <Button
                className="Report-HeaderButton-dwnld"
                onClick={() => generateTemplate("downLoad", {})}
                loading={downloadLoading}
              >
                <MdFileDownload size={20} />
              </Button>{" "}
            </>
          )
        }
      />
      <Container>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            {type == "other-payment" ||
            type == "supplier-payment" ||
            type == "customer-refund" ? (
              <Table
                bordered
                responsive={true}
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.DATE")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.AccountName")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.PAIDMETHOD")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.REFERENCE")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.Amount")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details?.map((item: any) => (
                    <tr>
                      <td>{moment(item?.userdate).format("DD-MM-YYYY")}</td>
                      <td>{item?.name}</td>
                      <td>
                        {item?.paidmethod || item?.ledgerDetails?.paidmethod}
                      </td>
                      <td>
                        {item?.reference === "" || item?.reference === null
                          ? "-"
                          : item?.reference}
                      </td>
                      <td>{item?.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : type == "customer-receipt" ||
              type == "other-receipt" ||
              type == "supplier-refund" ? (
              <Table
                bordered
                responsive={true}
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.TRANSACTIONDATE")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.AccountName")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.PAIDTO/FROM")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.PAIDMETHOD")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.REFERENCE")}
                    </th>
                    <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.AMOUNT")}
                    </th>
                    {details[0]?.paidmethod == "Cheque" ? (
                      <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                        Cheque Status
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {details?.map((item: any) => (
                    <tr>
                      <td>{moment(item?.sdate).format("DD-MM-YYYY")}</td>
                      <td>{item?.name}</td>
                      <td>{item?.ledgername}</td>
                      <td>{item?.paidmethod}</td>
                      <td>
                        {item?.reference === "" || item?.reference === null
                          ? "-"
                          : item?.reference}
                      </td>
                      <td>{item?.debit}</td>
                      {item?.paidmethod == "Cheque" ? (
                        <td>{item?.check_status}</td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              ""
            )}
          </Card>
        )}
        {emailModal ? (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={user.email}
            Attachment={`${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: details?.invoiceDetails?.customer?.email,
              subject: `Receipts`,
              content: user?.companyInfo?.defaultmail,
            }}
            fileName={`Receipts${new Date()}.pdf`}
          />
        ) : null}
        {modalOpen ? (
          <PrintModal
            open={modalOpen}
            modalClose={(val: any) => setModalOpen(val)}
            template={template}
          />
        ) : null}
      </Container>
    </div>
  );
}

export default ViewPurchasePayment;
