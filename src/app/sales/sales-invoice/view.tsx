import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  EditOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Modal,
  Timeline,
  Tooltip,
  notification,
  Dropdown,
  Menu,
} from "antd";
import { FaEdit } from "react-icons/fa";
import dayjs from "dayjs";
import moment from "moment";
import { MdOutlineContentCopy } from "react-icons/md";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoMdAlarm } from "react-icons/io";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { PiStripeLogo } from "react-icons/pi";
import { SiGridsome } from "react-icons/si";
import { useSelector } from "react-redux";
import { BsPrinter } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import Paymentmodal from "../../../components/paymentmodal/paymentmodal";
import SendMailModal from "../../../components/sendMailModal";
import API from "../../../config/api";
import { GET, POST } from "../../../utils/apiCalls";
import {
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
} from "../components/templates";
import "../styles.scss";
import PrintModal from "../../../components/printModal/printModal";
import ImeiModal from "../components/imeiViewModal";
// import InvoiceCopy from "../sales-invoice/copy";
function SaleInvoiceView(props: any) {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const User = useSelector((state: any) => state.User);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [selectBank, setSlectedBank] = useState<any>({});
  const [paymentModal, setPaymentModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [staffData, setStaffData] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [template, setTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imeiModalOpen, setImeiModalOpen] = useState<boolean>(false);
  const [imei, setImei] = useState<any>([]);
  const [selectedPageSize, setSelectedPageSize] = useState<string>("POS-80");
  const navigate = useNavigate();

  const { user } = useSelector((state: any) => state.User);

  let _subTotal = 0;
  let _tatalVat = 0;
  let _overollDiscount = 0;
  let discountAmount: any = 0;
  let amountAdded = 0;
  useEffect(() => {
    getInvoiceDetails();
    getBankList();
  }, []);
  const stripeMail = async () => {
    try {
      let url = API.Stripe_mail;
      if (!User?.user?.companyInfo?.stripeKey) {
        notification.error({ message: "Please set the Stripe key" });
        return;
      } else {
        let obj = {
          saleId: details?.invoiceDetails?.id,
          email: details?.invoiceDetails?.customer?.email,
          amount: Number(details?.invoiceDetails?.total) * 100,
          currency: User?.user?.companyInfo?.countryInfo?.symbol?.toLowercase(),
        };
        console.log(obj);
        const response: any = await POST(url, obj);
        notification.success({
          message: "Success",
          description: response.message,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFullLoading(false);
    }
  };

  const fetchStaff = async (staffid: number) => {
    try {
      setIsFullLoading(true);
      const customer_details_url = API.CONTACT_MASTER + `details/${staffid}`;
      const { data }: any = await GET(customer_details_url, null);
      setStaffData(data);
      setIsFullLoading(false);
    } catch (error) {
      console.log(error);
      setIsFullLoading(false);
    }
  };

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_SALE_INVOICE + id + "/sales";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails?.status) {
        setDetails(getInvDetails?.data);
        getInvDetails?.data?.invoiceDetails?.usertype === "staff" &&
          fetchStaff(getInvDetails?.data?.invoiceDetails?.createdBy);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFullLoading(false);
    }
  };

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      const chunkSize = 8;
      const splitArray = [];
      const invoiceItems = details?.invoiceItems;

      for (let i = 0; i < invoiceItems?.length; i += chunkSize) {
        splitArray.push(invoiceItems?.slice(i, i + chunkSize));
      }

      if (invoiceItems?.length > 6) {
      }
      let obj = {
        user: User?.user,
        customer: details?.invoiceDetails?.customer,
        sale: details?.invoiceDetails,
        invoicearray: splitArray,
        productlist: details?.invoiceItems,
        bankList: details?.banking,
        vatTotal: _tatalVat,
        netTotal: _subTotal,
        Discount: _overollDiscount,
        round: amountAdded,
        total: details?.invoiceDetails?.total,
        vatRate: _tatalVat,
        isPaymentInfo: false,
        pagetype: "Tax Invoice",
        selectedBank: User.user?.companyInfo?.bankInfo,
        path:
          details?.invoiceItems && details?.invoiceItems[0]?.product?.itemtype,
        taxType:
          details?.invoiceDetails &&
          details?.invoiceDetails.customer.vat_number?.substring(0, 2) ===
            User?.user?.companyInfo?.taxno?.substring(0, 2),
      };

     
      let templates: any = null;
      if (!User.user.companyInfo.defaultinvoice) {
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
      if (!User?.user?.companyInfo?.bankInfo?.id) {
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
      if (User.user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (User.user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (User.user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      } else if (User.user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      } else if (User.user.companyInfo.defaultinvoice === "5") {
        templates = template5(obj);
      } else if (User.user.companyInfo.defaultinvoice === "6") {
        templates = template6(obj);
      } else if (User.user.companyInfo.defaultinvoice === "7") {
        templates = template8(obj);
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
    // templateContent = templateContent.replace('\\"', '"');
    let updatedTemplateContent = templateContent
      ?.replace(/[\r\n]/g, "")
      ?.replace(/\\"/g, "")
      ?.replace(/[\u0100-\uffff]/g, "");

    const encodedString = btoa(
      unescape(encodeURIComponent(updatedTemplateContent))
    );
    // const encodedString = btoa(templateContent);
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
    a.download = `sales${details?.invoiceDetails.customer.bus_name}_${
      details?.invoiceDetails?.invoiceno
    }_${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };
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
      filename: "Sales Invoice.pdf",
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

  async function paymentFinish(val: any) {
    try {
      let status = null;
      if (val.outStanding <= 0) {
        status = "2"; //paid
      } else if (val.outStanding < details?.invoiceDetails?.total) {
        status = "1"; //part Paid
      } else if (val.outStanding >= details?.invoiceDetails?.total) {
        status = "0"; //unpaid
      }

      let payload = {
        userid: User.user?.id,
        adminid: User.user?.id,
        status: status,
        customerid: details?.invoiceDetails?.customer?.id,
        outstanding: val?.outStanding,
        bankid: val?.paymentBank,
        sinvoice: id,
        logintype: "usertype",
        type: "Customer Payment",
        date: val?.paymentDate,
        paidmethod: val?.paymentMethod,
        amount: val?.amoutToPaid,
        userdate: new Date(),
      };
      let url = API.SALES_PAYMENT;
      let response: any = await POST(url, payload);
      if (response.status) {
        notification.success({ message: response.message });
        setPaymentModal(false);
        await getInvoiceDetails();
      }
    } catch (error) {
      console.log("error", error);
      notification.error({ message: "Something went wrong to your payment." });
      setPaymentModal(false);
    }
  }

  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" +
        User.user?.id +
        "/" +
        User?.user?.companyInfo?.id;
      const { data }: any = await GET(url, null);

      setSlectedBank(data.bankList);
    } catch (error) {}
  };

  const printtemplate = async (pageSize: string = selectedPageSize) => {
    const chunkSize = 8;
    const splitArray = [];
    const invoiceItems = details?.invoiceItems;

    for (let i = 0; i < invoiceItems.length; i += chunkSize) {
      splitArray.push(invoiceItems.slice(i, i + chunkSize));
    }

    if (invoiceItems.length > 6) {
    }
    try {
      setPrintLoading(true);
      let obj = {
        user: User.user,
        customer: details?.invoiceDetails?.customer,
        sale: details?.invoiceDetails,
        invoicearray: splitArray,
        productlist: details?.invoiceItems,
        bankList: details?.banking,
        vatTotal: _tatalVat,
        netTotal: _subTotal,
        Discount: _overollDiscount,
        round: amountAdded,
        total: details?.invoiceDetails?.total,
        vatRate: _tatalVat,
        isPaymentInfo: false,
        pagetype: "Tax Invoice",
        selectedBank: User.user?.companyInfo?.bankInfo,
        path: details?.invoiceItems[0]?.product?.itemtype,
        taxType:
          details?.invoiceDetails &&
          details?.invoiceDetails.customer.vat_number?.substring(0, 2) ===
            User?.user?.companyInfo?.taxno?.substring(0, 2),
        pageSize: pageSize,
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
      } else if (user.companyInfo.defaultinvoice === "6") {
        templates = template6(obj);
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
  const handleClick = () => {
    navigate(`/usr/sale-invoice-form/${details?.invoiceDetails?.id}`);
  };

  // Page size options
  const pageSizeOptions = [
    { key: "POS-58", label: "POS 58mm (58 × 200 mm)" },
    { key: "POS-80", label: "POS 80mm (80 × 200 mm)" },
    { key: "Receipt", label: "Receipt (80 × 300 mm)" },
    { key: "Small-Invoice", label: "Small Invoice (100 × 150 mm)" },
    { key: "A6", label: "A6 (105 × 148 mm)" },
    { key: "A5", label: "A5 (148 × 210 mm)" },
    { key: "A4", label: "A4 (210 × 297 mm)" },
    { key: "A3", label: "A3 (297 × 420 mm)" },
    { key: "A2", label: "A2 (420 × 594 mm)" },
    { key: "A1", label: "A1 (594 × 841 mm)" },
    { key: "A0", label: "A0 (841 × 1189 mm)" },
    { key: "Letter", label: "Letter (8.5 × 11 in)" },
    { key: "Legal", label: "Legal (8.5 × 14 in)" },
  ];

  const handlePageSizeSelect = ({ key }: { key: string }) => {
    setSelectedPageSize(key);
    printtemplate(key);
  };

  const printMenu = (
    <Menu
      items={pageSizeOptions.map(option => ({
        key: option.key,
        label: option.label,
        onClick: () => handlePageSizeSelect({ key: option.key }),
      }))}
    />
  );

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.SalesInvoice_View")}
        goBack={"/dashboard"}
        firstPathText={"Sales Invoice"}
        firstPathLink={"/usr/sales-invoice"}
        secondPathText={t("home_page.homepage.SalesInvoice_View")}
        secondPathLink={"/usr/sales-invoice"}
        children={
          <div>
            <Tooltip
              title="Invoice Copy"
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
                onClick={() => navigate(`/usr/InvoiceCopy/${id}`)}
                // loading={downloadLoading}
              >
                <MdOutlineContentCopy size={20} />
              </Button>
            </Tooltip>
            &nbsp;
            <Tooltip
              title={`Print Invoice (${selectedPageSize})`}
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
              <Dropdown
                overlay={printMenu}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button loading={printLoading}>
                  <BsPrinter size={20} />
                </Button>
              </Dropdown>
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
                onClick={() => genrateTemplate?.("downLoad", {})}
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
            &nbsp;
            <Tooltip
              title="Stripe"
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
              <Button onClick={stripeMail}>
                <PiStripeLogo size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      />
      <Container>
        <br />
        {isFullLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <Row>
              <Col md="12">
                <div className="salesInvoice-Header">
                  <div className="heading">
                    {t("home_page.homepage.Sales_Invoice")}
                  </div>
                  <div className="button-container">
                    <Button onClick={handleClick} block>
                      {/* <FaEdit
                      size={18}
                      color="gray"
                      style={{ paddingRight: "5px" }}
                    /> */}
                      {t("home_page.homepage.Edit")}
                    </Button>
                  </div>
                </div>

                <Table bordered>
                  <tbody>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.seriesNo")}
                      </td>

                      <td>
                        <strong>
                          {
                            details?.invoiceDetails?.locationDetails
                              ?.locationCode
                          }
                        </strong>
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.invoice_no")}
                      </td>
                      <td>
                        <strong>{details?.invoiceDetails?.invoiceno}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.invoice_date")}
                      </td>
                      <td className="items-value">
                        {dayjs(details?.invoiceDetails?.sdate).format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.Due_Date")}
                      </td>
                      <td className="items-value">
                        {dayjs(details?.invoiceDetails?.ldate).format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.Cutomer_Name")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.customer?.name}
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.Business_Name")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.customer?.bus_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.Invoice_Address")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.inaddress}
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.Delivery_Address")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.cname},
                        {details?.invoiceDetails?.deladdress}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.Reference")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.reference
                          ? details?.invoiceDetails?.reference
                          : "-"}
                      </td>

                      <td className="items-head">
                        {User?.user?.companyInfo?.tax === "gst"
                          ? t("home_page.homepage.GSTIN_UIN")
                          : t("home_page.homepage.vat_number")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.customer?.vat_number}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.created_by")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.usertype === "admin"
                          ? user?.fullName
                          : staffData?.name}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <div className="salesInvoice-SubHeader ">
                  {t("home_page.homepage.Invoice_Items")}
                </div>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>{t("home_page.homepage.PRODUCT")}</th>
                      {User?.user?.companyInfo?.tax === "gst" && (
                        <th>{t("home_page.homepage.hsn_sac")}</th>
                      )}
                      <th>{t("home_page.homepage.QUANTITY")}</th>
                      <th>{t("home_page.homepage.UNIT")}</th>
                      <th>{t("home_page.homepage.PRICE")}</th>
                      {User?.user?.companyInfo?.tax === "gst" ? (
                        <>
                          <th>{t("home_page.homepage.GST")} %</th>
                          {details?.invoiceDetails &&
                          details?.invoiceDetails?.customer?.vat_number?.substring(
                            0,
                            2
                          ) ===
                            User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                            <>
                              <th>{t("home_page.homepage.CGST_Amt")}</th>
                              <th>{t("home_page.homepage.SGST_AMT")}</th>
                            </>
                          ) : (
                            <th>{t("home_page.homepage.IGST_AMT")}</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th>{t("home_page.homepage.TAX_%")}</th>
                          <th>{t("home_page.homepage.TAX_AMT")}</th>
                        </>
                      )}
                      <th>{t("home_page.homepage.INC_TAX")}</th>
                      <th>{t("home_page.homepage.DISC_%")}</th>
                      <th>{t("home_page.homepage.DISC_AMT")}</th>
                      <th>{t("home_page.homepage.TOTAL")}</th>
                      <th>IMEI Numbers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.invoiceItems?.map((item: any) => {
                      let vatPercent = Number(item?.vat);
                      discountAmount = 0;
                      let vatAmount = Number(item?.vatamt);

                      if (item.includevat == 1) {
                        _subTotal =
                          Number(item?.costprice) * Number(item?.quantity) -
                          vatAmount +
                          _subTotal;
                      } else {
                        _subTotal =
                          Number(item?.costprice) * Number(item?.quantity) +
                          _subTotal;
                      }
                      if (item.discount > 0) {
                        const discountRate = item?.discount / 100;
                        discountAmount =
                          item.includevat == 1
                            ? Number(item?.costprice) *
                              Number(item?.quantity) *
                              discountRate
                            : (Number(item?.costprice) *
                                Number(item?.quantity) +
                                vatAmount) *
                              discountRate;
                      }

                      _tatalVat = _tatalVat + vatAmount;
                      _overollDiscount = _overollDiscount + discountAmount;
                      let _totalAmount =
                        _subTotal + _tatalVat - _overollDiscount;
                      let roundedNumber = Math.round(_totalAmount);
                      amountAdded = roundedNumber - _totalAmount;

                      return (
                        <tr>
                          <td>{item?.description}</td>
                          {User?.user?.companyInfo?.tax === "gst" && (
                            <td>{item?.product?.hsn_code}</td>
                          )}
                          <td>{item?.quantity}</td>
                          <td>{item?.product?.unitDetails?.unit}</td>
                          <td>{item?.costprice}</td>
                          {User?.user?.companyInfo?.tax === "gst" ? (
                            <>
                              <td>{item?.vat}%</td>
                              {details?.invoiceDetails &&
                              details?.invoiceDetails?.customer?.vat_number?.substring(
                                0,
                                2
                              ) ===
                                User?.user?.companyInfo?.taxno?.substring(
                                  0,
                                  2
                                ) ? (
                                <>
                                  <td>{item?.vatamt / 2}</td>
                                  <td>{item?.vatamt / 2}</td>
                                </>
                              ) : (
                                <td>{item?.vatamt}</td>
                              )}
                            </>
                          ) : (
                            <>
                              <td>{item?.vat}%</td>
                              <td>{item?.vatamt}</td>
                            </>
                          )}

                          <td style={{ textAlign: "center" }}>
                            <Checkbox
                              checked={item.includevat == 1 ? true : false}
                            />
                          </td>
                          <td>{item?.discount}</td>
                          <td>{discountAmount.toFixed(2)}</td>
                          <td>{item?.total}</td>
                          {item?.imei?.some(
                            (str: any) =>
                              typeof str === "string" && str?.trim() !== ""
                          ) ? (
                            <td>
                              <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                  setImeiModalOpen(true);
                                  setImei(item?.imei);
                                }}
                              >
                                View
                              </Button>
                            </td>
                          ) : (
                            <td></td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col sm={8}></Col>
              <Col sm={4}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                      <td>{_subTotal?.toFixed(2)}</td>
                    </tr>
                    {User?.user?.companyInfo?.tax === "gst" ? (
                      <>
                        {details?.invoiceDetails &&
                        details?.invoiceDetails?.customer?.vat_number?.substring(
                          0,
                          2
                        ) ===
                          User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                          <>
                            <tr>
                              <td>{t("home_page.homepage.totel_cgst")}</td>
                              <td>{(_tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>{t("home_page.homepage.totel_sgst")}</td>
                              <td>{(_tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td>{t("home_page.homepage.totel_igst")}</td>
                            <td>{_tatalVat?.toFixed(2)}</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td>{t("home_page.homepage.totel_vat")}</td>
                        <td>{_tatalVat?.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                      <td>{_overollDiscount?.toFixed(2)}</td>
                    </tr>
                    {details?.invoiceDetails?.loyaltyDiscountAmount ? (
                      <tr>
                        <td>Loyalty Point Discount</td>
                        <td>
                          {details?.invoiceDetails?.loyaltyDiscountAmount}
                        </td>
                      </tr>
                    ) : null}
                    {/* <tr>
                      <td>ROUND OFF</td>
                      <td>{amountAdded?.toFixed(2)}</td>
                    </tr> */}
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.TOTAL_AMOUNT")}
                      </td>
                      <td className="items-head">
                        {details?.invoiceDetails?.total}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Table bordered>
              <tbody>
                <tr>
                  <td>
                    <strong>{t("home_page.homepage.Terms")}</strong>
                    <hr />
                    <div>{details?.invoiceDetails?.terms}</div>
                  </td>
                  <td>
                    <strong>{t("home_page.homepage.Notes")}</strong>
                    <hr />
                    <div>{details?.invoiceDetails?.quotes}</div>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table bordered>
              <tbody>
                <tr>
                  <td>
                    {t("home_page.homepage.Payment_Status")}: &nbsp;
                    {details?.invoiceDetails?.status === 0 ? (
                      <>
                        <IoMdAlarm size={25} color="red" />
                        &nbsp; {t("home_page.homepage.Awaiting_Payment")}
                      </>
                    ) : details?.invoiceDetails?.status === 1 ? (
                      <>
                        <SiGridsome size={25} color="orange" />
                        &nbsp;{t("home_page.homepage.Payment_Pending")}
                      </>
                    ) : (
                      <>
                        <BsCheckCircleFill size={25} color="green" />
                        &nbsp; {t("home_page.homepage.Paid")}
                      </>
                    )}
                  </td>
                  <td>
                    {t("home_page.homepage.outstanding")}:&nbsp;
                    <strong>
                      {details?.invoiceDetails?.outstanding || 0.0}
                    </strong>
                  </td>
                  {/* <tr> */}
                  {/* <td>ROUND OFF</td>
                  <td>
                    {Number(details?.invoiceDetails?.roundOff)?.toFixed(2)}
                  </td> */}
                  {/* </tr> */}
                  {details?.invoiceDetails?.status === 2 ? null : (
                    <td>
                      <Button
                        block
                        type="primary"
                        size="large"
                        onClick={() => setPaymentModal(true)}
                      >
                        {t("home_page.homepage.Add_Payment")}
                      </Button>
                    </td>
                  )}
                </tr>
              </tbody>
            </Table>

            <Modal
              open={paymentModal}
              onCancel={() => setPaymentModal(false)}
              width={800}
              maskClosable={false}
              footer={false}
              title={t("home_page.homepage.Add_Payment")}
            >
              <Paymentmodal
                onCancel={() => setPaymentModal(false)}
                onFinish={(val: any) => paymentFinish(val)}
                outstanding={details?.invoiceDetails?.outstanding}
                bankList={selectBank}
              />
            </Modal>
            <div className="salesInvoice-SubHeader ">
              {t("home_page.homepage.Invoice_TimeLine")}
            </div>
            <br />
            <Timeline mode="alternate">
              {details?.invoiceDetails?.status === 2 && (
                <Timeline.Item
                  dot={
                    <DollarCircleOutlined
                      style={{ color: "green", fontSize: 20 }}
                    />
                  }
                  color="green"
                >
                  <div className="heading-txt3">
                    {t("home_page.homepage.Paid")}
                  </div>
                  <br />
                  {t("home_page.homepage.PaymentRecorded_on")}{" "}
                  {details?.invoiceDetails.paymentdate &&
                    moment(details?.invoiceDetails.paymentdate).format(
                      "MMMM Do YYYY @ h:mm a"
                    )}
                </Timeline.Item>
              )}

              {details?.invoiceDetails?.status === 0 && (
                <Timeline.Item
                  dot={<FileDoneOutlined style={{ fontSize: 20 }} />}
                  color="gray"
                >
                  <div className="heading-txt3">
                    {t("home_page.homepage.Pending_Payment")}
                  </div>
                  <br />
                  {t("home_page.homepage.Nopayment_yet")}
                </Timeline.Item>
              )}

              {details.banking?.map((item: any, index: any) => {
                return (
                  <Timeline.Item
                    key={index}
                    dot={<DollarCircleOutlined style={{ fontSize: 20 }} />}
                    color="blue"
                  >
                    <div className="heading-txt3">
                      {details?.invoiceDetails?.status === 2
                        ? "Invoice Paid "
                        : "Part of Invoice Paid"}
                    </div>
                    <br />
                    {t("home_page.homepage.Madeapayment_on")}{" "}
                    {moment(new Date(item.date)).format("DD-MMM-YYYY")}
                    {t("home_page.homepage.of")}{" "}
                    <strong>{parseInt(item.amount)}</strong>{" "}
                    {t("home_page.homepage.to")} {item?.bankInf?.laccount}
                  </Timeline.Item>
                );
              })}

              {details.banking?.map((item: any, index: any) => {
                if (index > 0) {
                  return null;
                }
                return (
                  <>
                    {item.type === "Live Payment" ? null : (
                      <Timeline.Item
                        // key={index}
                        dot={<ClockCircleOutlined style={{ fontSize: 20 }} />}
                        color="red"
                      >
                        <div className="heading-txt3">
                          {t("home_page.homepage.Due")}
                        </div>
                        <br />
                        {t("home_page.homepage.InvoiceDue_on")}{" "}
                        {moment(details?.invoiceDetails?.ldate).format(
                          "DD-MMM-yyyy"
                        )}
                      </Timeline.Item>
                    )}
                  </>
                );
              })}

              <Timeline.Item
                dot={<EditOutlined style={{ fontSize: 20 }} />}
                color="gray"
                className="heading-txt"
              >
                <div className="heading-txt3">
                  {t("home_page.homepage.Created")}
                </div>
                <br />
                {t("home_page.homepage.Invoiceplaced_on")}{" "}
                {moment(new Date(details?.invoiceDetails?.created_at)).format(
                  "DD-MMM-yyyy @ h:mm a"
                ) || moment(new Date()).format("DD-MMM-yyyy @ h:mm a")}
              </Timeline.Item>
            </Timeline>
          </Card>
        )}
        {emailModal ? (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={User.user.email}
            Attachment={`${details?.invoiceDetails?.customer?.bus_name}_${
              details?.invoiceDetails?.invoiceno
            }_${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: details?.invoiceDetails.customer.email,
              subject: `Sales Invoice ${details?.invoiceDetails?.invoiceno}`,
              content: User.user.companyInfo.defaultmail,
            }}
            fileName={`SalesInvoice${new Date()}.pdf`}
          />
        ) : null}
        {modalOpen ? (
          <PrintModal
            open={modalOpen}
            modalClose={(val: any) => setModalOpen(val)}
            template={template}
            pageSize={selectedPageSize}
          />
        ) : null}
        <ImeiModal
          open={imeiModalOpen}
          onClose={() => {
            setImeiModalOpen(false);
            setImei([]);
          }}
          imeiNumbers={imei || []}
        />
      </Container>
      <br />
    </>
  );
}

export default SaleInvoiceView;
