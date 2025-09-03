import { Button, Card, Checkbox, Tooltip, notification } from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsPrinter } from "react-icons/bs";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import PrintModal from "../../../components/printModal/printModal";
import SendMailModal from "../../../components/sendMailModal";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import {
  template1,
  template2,
  template3,
  template4,
  template5,
} from "../components/templates";
import "../styles.scss";

function ViewCreditNote() {
  const { id }: any = useParams();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [staffData, setStaffData] = useState<any>();
  const User = useSelector((state: any) => state.User);
  const user = User.user;
  const [printLoading, setPrintLoading] = useState(false);
  const [template, setTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  let _subTotal = 0;
  let _tatalVat = 0;
  let _overollDiscount = 0;
  let discountAmount: any = 0;
  let amountAdded = 0;

  useEffect(() => {
    getInvoiceDetails();
  }, []);

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
      let url = API.VIEW_SALE_INVOICE + id + "/scredit";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails.status) {
        setDetails(getInvDetails?.data);
        getInvDetails?.data?.invoiceDetails?.usertype === "staff" &&
          fetchStaff(getInvDetails?.data?.invoiceDetails?.createdBy);
        setIsFullLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
    }
  };
  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      const chunkSize = 8;
      const splitArray = [];
      const invoiceItems = details?.invoiceItems;

      for (let i = 0; i < invoiceItems.length; i += chunkSize) {
        splitArray.push(invoiceItems.slice(i, i + chunkSize));
      }
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
        pagetype: "SALES CREDIT NOTE",
        selectedBank: User.user?.companyInfo?.bankInfo,
      };
      let templates: any = null;
      if (!User.user.companyInfo.defaultinvoice) {
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
      if (!User.user?.companyInfo?.bankInfo) {
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
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
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
    a.download = `CreditNote${details?.invoiceDetails?.customer?.bus_name}_${
      details?.invoiceDetails?.invoiceno
    }_${moment(new Date()).format("DD-MM-YYYY")}`;
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
  const printtemplate = async () => {
    try {
      setPrintLoading(true);
      setDownloadLoading(true);
      const chunkSize = 8;
      const splitArray = [];
      const invoiceItems = details?.invoiceItems;

      for (let i = 0; i < invoiceItems.length; i += chunkSize) {
        splitArray.push(invoiceItems.slice(i, i + chunkSize));
      }
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
        pagetype: "SALES CREDIT NOTE",
        selectedBank: User.user?.companyInfo?.bankInfo,
      };
      let templates: any = null;
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      } else if (User.user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      } else if (User.user.companyInfo.defaultinvoice === "5") {
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

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.SalesCreditView")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.SalesCreditView")}
        secondPathLink={"/usr/sales-invoice"}
        children={
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
            &nbsp;
            <Tooltip
              title="Share Invoice"
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
              {/* <Button onClick={() => setEmailModal(true)}>
                <IoShareSocial size={20} />
              </Button> */}
            </Tooltip>
          </div>
        }
      />
      <>
        <Container>
          <br />
          {isFullLoading ? (
            <LoadingBox />
          ) : (
            <Card>
              <Row>
                {details?.invoiceDetails?.salesType ===
                "WithoutStockReversal" ? (
                  <>
                    <Col md="12">
                      <div className="salesInvoice-Header">
                        {t("home_page.homepage.Credit_Note")}
                      </div>
                      <Table bordered>
                        <tbody>
                          <tr>
                            <td className="items-head">
                              {t("home_page.homepage.invoice_no")}
                            </td>
                            <td>
                              <strong>
                                {details?.invoiceDetails?.invoiceno}
                              </strong>
                            </td>
                            <td className="items-head">
                              {t("home_page.homepage.invoice_date")}{" "}
                            </td>
                            <td className="items-value">
                              {dayjs(details?.invoiceDetails?.sdate).format(
                                "DD-MM-YY"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">
                              {t("home_page.homepage.CustomerAddress")}{" "}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.customer &&
                                `${details?.invoiceDetails?.customer?.name},
                                ${details?.invoiceDetails?.customer?.address},
                                ${
                                  details?.invoiceDetails?.customer?.city !==
                                  null
                                    ? details?.invoiceDetails?.customer?.city
                                    : ""
                                },
                                ${details?.invoiceDetails?.customer?.postcode}`}
                            </td>
                            <td className="items-head">
                              {t("home_page.homepage.Description")}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.quotes &&
                                details?.invoiceDetails?.quotes}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">
                              {t("home_page.homepage.Reference")}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.reference &&
                                details?.invoiceDetails?.reference}{" "}
                            </td>
                            <td className="items-head">
                              {t("home_page.homepage.Amount")}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.total &&
                                details?.invoiceDetails?.total}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md="12">
                      <div className="salesInvoice-Header">
                        {t("home_page.homepage.Credit_Note")}
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
                              <strong>
                                {details?.invoiceDetails?.invoiceno}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">
                              {" "}
                              {t("home_page.homepage.invoice_date")}
                            </td>
                            <td className="items-value">
                              {dayjs(details?.invoiceDetails?.sdate).format(
                                "DD-MM-YY"
                              )}
                            </td>
                            <td className="items-head">
                              {t("home_page.homepage.Invoice_Address")}{" "}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.customer?.bus_name},
                              {details?.invoiceDetails?.inaddress
                                ? details?.invoiceDetails?.inaddress
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">
                              {t("home_page.homepage.AgainstSalesInvoice")}
                            </td>
                            <td className="items-head">
                              {details?.invoiceDetails?.sales_ref}
                            </td>
                            <td className="items-head">
                              {t("home_page.homepage.Reference")}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.reference}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">Created by</td>
                            <td className="items-value">
                              {details?.invoiceDetails?.usertype === "admin"
                                ? user?.fullName
                                : staffData?.name}
                            </td>
                            <td className="items-head">
                              {User?.user?.companyInfo?.tax === "gst"
                                ? "GSTIN/UIN"
                                : "Vat Number"}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.customer?.vat_number}
                            </td>
                          </tr>
                          <tr>
                            <td className="items-head">
                              {t("home_page.homepage.Terms")}
                            </td>
                            <td className="items-value">
                              {details?.invoiceDetails?.terms}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col>
                      {details.invoiceItems &&
                        details.invoiceItems.length > 0 && (
                          <>
                            <div className="salesInvoice-SubHeader ">
                              {t("home_page.homepage.Invoice_Items")}
                            </div>

                            <Table bordered>
                              <thead>
                                <tr>
                                  <th>PRODUCT</th>
                                  {User?.user?.companyInfo?.tax === "gst" && (
                                    <th>HSN/SAC</th>
                                  )}
                                  <th>QUANTITY</th>
                                  <th>PRICE</th>
                                  {User?.user?.companyInfo?.tax === "gst" ? (
                                    <>
                                      <th>GST %</th>
                                      {User?.user.companyInfo?.taxno?.substring(
                                        0,
                                        2
                                      ) ===
                                      details?.invoiceDetails?.customer.vat_number?.substring(
                                        0,
                                        2
                                      ) ? (
                                        <>
                                          <th>SGST AMT</th>
                                          <th>CGST AMT</th>
                                        </>
                                      ) : (
                                        <th>IGST AMT</th>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <th>TAX %</th>
                                      <th>TAX AMT</th>
                                    </>
                                  )}
                                  <th>INC TAX</th>
                                  <th>DISC %</th>
                                  <th>DISC AMT</th>
                                  <th>TOTAL</th>
                                </tr>
                              </thead>
                              {details?.invoiceItems?.map(
                                (item: any, index: number) => (
                                  <tbody>
                                    <tr key={index}>
                                      <td>{item?.description}</td>
                                      {User?.user?.companyInfo?.tax ===
                                        "gst" && (
                                        <td>{item?.product?.hsn_code}</td>
                                      )}
                                      <td>{item?.quantity}</td>
                                      <td>{item?.costprice}</td>
                                      <td>{item?.vat}%</td>
                                      {User?.user?.companyInfo?.tax ===
                                      "gst" ? (
                                        <>
                                          {User?.user.companyInfo?.taxno?.substring(
                                            0,
                                            2
                                          ) ===
                                          details?.invoiceDetails?.customer.vat_number?.substring(
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
                                          <td>{item?.vatamt}</td>
                                        </>
                                      )}
                                      <td style={{ textAlign: "center" }}>
                                        <Checkbox
                                          checked={
                                            item.includevat == 1 ? true : false
                                          }
                                        />
                                      </td>
                                      <td>{item?.percentage}</td>
                                      <td>{item?.description}</td>
                                      <td>{item?.total}</td>
                                    </tr>
                                  </tbody>
                                )
                              )}
                            </Table>
                          </>
                        )}
                    </Col>
                    <Col sm={8}></Col>
                    <Col sm={4}>
                      <Table bordered>
                        <tbody>
                          <tr>
                            <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                            <td>{details?.invoiceDetails?.taxable_value}</td>
                          </tr>
                          {User?.user?.companyInfo?.tax === "gst" ? (
                            <>
                              {User?.user?.companyInfo?.taxno?.substring(
                                0,
                                2
                              ) ===
                              details?.invoiceDetails?.[
                                "customer.vat_number"
                              ]?.substring(0, 2) ? (
                                <>
                                  <tr>
                                    <td>TOTAL CGST</td>
                                    <td>
                                      {(
                                        Number(
                                          details?.invoiceDetails?.total_vat
                                        ) / 2
                                      )?.toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>TOTAL SGST</td>
                                    <td>
                                      {(
                                        Number(
                                          details?.invoiceDetails?.total_vat
                                        ) / 2
                                      )?.toFixed(2)}
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <tr>
                                  <td>TOTAL IGST</td>
                                  <td>
                                    {Number(
                                      details?.invoiceDetails?.total_vat
                                    )?.toFixed(2)}
                                  </td>
                                </tr>
                              )}
                            </>
                          ) : (
                            <tr>
                              <td>TOTAL VAT</td>
                              <td>
                                {Number(
                                  details?.invoiceDetails?.total_vat
                                )?.toFixed(2)}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                            <td>{details?.invoiceDetails?.overall_discount}</td>
                          </tr>
                          {/* <tr>
                            <td>ROUND OFF</td>
                            <td>
                              {Number(
                                details?.invoiceDetails?.roundOff
                              )?.toFixed(2)}
                            </td>
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
                  </>
                )}
              </Row>
            </Card>
          )}
          {emailModal ? (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              fileName={`CreditNotes${new Date()}.pdf`}
              ownMail={User.user.email}
              Attachment={`${details?.invoiceDetails?.customer?.bus_name}_${
                details?.invoiceDetails?.invoiceno
              }_${moment(new Date()).format("DD-MM-YYYY")}`}
              defaultValue={{
                to: details?.invoiceDetails.customer.email,
                subject: `Sales Credit Notes ${details?.invoiceDetails?.invoiceno}`,
                content: User.user.companyInfo.defaultmail,
              }}
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
      </>
    </>
  );
}

export default ViewCreditNote;
