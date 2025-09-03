import { Button, Checkbox, Tooltip, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { GET } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import { MdAttachEmail, MdFileDownload, MdOutlineContentCopy } from "react-icons/md";
import { useSelector } from "react-redux";
import SendMailModal from "../../../components/sendMailModal";
import API from "../../../config/api";
import { template1, template2, template3, template4,template5} from "../components/templates";
import "../styles.scss";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { BsPrinter } from "react-icons/bs";
import PrintModal from "../../../components/printModal/printModal";

function PerfomaView() {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [subTottal, setSubTottal] = useState<any>();
  const [taxAmount, setTaxAmount] = useState<any>();
  const [emailModal, setEmailModal] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const User = useSelector((state: any) => state.User);
  const [template, setTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  let _tatalVat = 0;

  let discountAmount: any = 0;
  let amountAdded = 0;

  let overalDiscount = 0;
  let subAllTottal = 0;
  const navigate = useNavigate();

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user: User.user,
        customer: details?.invoiceDetails?.customer,
        sale: details?.invoiceDetails,
        productlist: details?.invoiceItems,
        bankList: details?.banking,
        vatTotal: _tatalVat,
        netTotal: subAllTottal,
        Discount: overalDiscount,
        round: amountAdded,
        total: details?.invoiceDetails?.total,
        vatRate: _tatalVat,
        isPaymentInfo: false,
        pagetype: "Proforma Invoice",
        selectedBank: User.user?.companyInfo?.bankInfo,
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
        return;
      }
      if (!User.user?.companyInfo?.bankInfo) {
        notification.error({
          message: <div> {t("home_page.homepage.select_default_bank")} </div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/profile/business")}
            >
              {t("home_page.homepage.click_select")}
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
      }else if (User.user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      }else if (User.user.companyInfo.defaultinvoice === "5") {
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
    a.download = `performa${details?.invoiceDetails?.customer?.bus_name}_${
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

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = "SaleInvoice/viewInvoice/" + id + "/proforma";
      const { data: invoiceDatas, status }: any = await GET(url, null);

      if (status) {
        setDetails(invoiceDatas);
        setSubTottal(
          invoiceDatas?.invoiceItems?.reduce((sum: any, item: any) => {
            if (item.includevat === 0) {
              return sum + Number(item.costprice) * Number(item.quantity);
            } else {
              return (
                sum +
                (Number(item.costprice) - Number(item.vatamt)) *
                  Number(item.quantity)
              );
            }
          }, 0)
        );

        setTaxAmount(
          invoiceDatas?.invoiceItems?.reduce(
            (sum: any, item: any) => sum + Number(item.vatamt),
            0
          )
        );
        let total = invoiceDatas?.invoiceItems?.reduce(
          (sum: any, item: any) => sum + Number(item.total),
          0
        );

        setIsFullLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
    }
  };
  const printtemplate = async () => {
    try {
      setPrintLoading(true);
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
        productlist: details?.invoiceItems,
        bankList: details?.banking,
        invoicearray:splitArray,
        vatTotal: _tatalVat,
        netTotal: subAllTottal,
        Discount: overalDiscount,
        round: amountAdded,
        total: details?.invoiceDetails?.total,
        vatRate: _tatalVat,
        isPaymentInfo: false,
        pagetype: "Proforma Invoice",
        selectedBank: User.user?.companyInfo?.bankInfo,
    };
    let templates: any = null;
      if (User.user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (User.user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (User.user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      }else if (User.user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      }else if (User.user.companyInfo.defaultinvoice === "5") {
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
        title={t("home_page.homepage.PerformaInvoiceView")}
        goBack={"/dashboard"}
        firstPathText={"Proforma Invoice"}
        firstPathLink={"/usr/sales-proforma-invoice"}
        secondPathText={t("home_page.homepage.PerformaInvoiceView")}
        secondPathLink={`/usr/perfoma-invoice-view/${id}`}
        // firstPathText={t("home_page.homepage.PerformaInvoice")}
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
              <Button
                onClick={() => navigate(`/usr/proforma-invoice-form/duplicate/${details?.invoiceDetails?.id}`)}
                loading={downloadLoading}
              >
                <MdOutlineContentCopy size={20} />
              </Button>
            </Tooltip>
            &nbsp;
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
              <Button
                onClick={() => printtemplate()}
                loading={printLoading}
              >
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
        }
      />
      <br />

      <Container>
        {isFullLoading ? (
          <LoadingBox />
        ) : (
          <div
            style={{
              padding: "10px",
              backgroundColor: "white",
            }}
          >
            <Row>
              <div className="items-head">
                <strong>{t("home_page.homepage.Invoice")}</strong>
              </div>

              <Col md="12">
                <Table bordered>
                  <tbody>
                    <tr>
                    <td className="items-head">
                          {t("home_page.homepage.seriesNo")}
                        </td>
                        
                        <td>
                          <strong>{details?.invoiceDetails?.locationDetails?.locationCode}</strong>
                        </td>
                      <td className="items-head">
                        {t("home_page.homepage.Customer_Name")}
                      </td>
                      <td>
                        <strong>{details?.invoiceDetails?.cname}</strong>
                      </td>
                    </tr>
                    <tr>
                    <td className="items-head">
                        {t("home_page.homepage.invoice_no")}
                      </td>
                      <td>
                        <strong>{details?.invoiceDetails?.invoiceno}</strong>
                      </td>
                      <td className="items-head">
                        {" "}
                        {t("home_page.homepage.invoice_date")}
                      </td>
                      <td className="items-value">
                        {moment(details?.invoiceDetails?.sdate).format(
                          "DD MMMM YYYY"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {" "}
                        {t("home_page.homepage.Delivery_Address")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.deladdress}
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.Invoice_Address")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.inaddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {" "}
                        {t("home_page.homepage.Terms")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.terms}
                      </td>

                      <td className="items-head">
                        {t("home_page.homepage.Reference")}{" "}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.reference}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">
                        {t("home_page.homepage.Status")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.status === 5
                          ? "Pending"
                          : details?.invoiceDetails?.status === 5
                          ? "Generated"
                          : "No Status"}
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
                        {t("home_page.homepage.Notes")}
                      </td>
                      <td className="items-value">
                        {details?.invoiceDetails?.quotes}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col md={12}>
                <div>
                  <strong>{t("home_page.homepage.Invoice_Items")}</strong>
                  <br />
                  <br />
                </div>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>{t("home_page.homepage.PRODUCT")}</th>
                      {User?.user?.companyInfo?.tax === "gst" ? (
                        <th>{t("home_page.homepage.hsn_sac")}</th>
                      ) : null}
                      <th>{t("home_page.homepage.QUANTITY")}</th>
                      <th>{t("home_page.homepage.PRICE")}</th>
                      {User?.user?.companyInfo?.tax === "gst" ? (
                        <>
                          {details?.invoiceDetails &&
                          details?.invoiceDetails.customer.vat_number?.substring(
                            0,
                            2
                          ) ===
                            User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                            <>
                              <th>{t("home_page.homepage.CGST_Amt")}</th>
                              <th>{t("home_page.homepage.SGST_AMT")}</th>
                            </>
                          ) : (
                            <>
                            <th>{t("home_page.homepage.GST")} </th>
                            <th>{t("home_page.homepage.IGST_AMT")}</th>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <th>{t("home_page.homepage.TAX_%")} </th>
                          <th>{t("home_page.homepage.TAX_AMT")}</th>
                        </>
                      )}
                      <th>{t("home_page.homepage.INC_TAX")}</th>
                      <th>{t("home_page.homepage.DISC_%")} </th>
                      <th>{t("home_page.homepage.DISC_AMT")}</th>
                      <th>{t("home_page.homepage.TOTAL")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details?.invoiceItems?.length &&
                      details?.invoiceItems.map((item: any) => {
                        let discountAmount = 0;
                        let total = 0;
                        if (item.includevat === 0) {
                          total =
                            Number(item.costprice) * Number(item.quantity) +
                            Number(item.vatamt);
                          subAllTottal =
                            subAllTottal +
                            Number(item.costprice) * Number(item.quantity);
                        } else {
                          total =
                            Number(item.costprice) * Number(item.quantity);
                          subAllTottal =
                            subAllTottal +
                            Number(item.costprice) * Number(item.quantity) -
                            item.vatamt;
                        }
                        if (item.discount > 0) {
                          const discountRate = Number(item.discount) / 100;
                          discountAmount = Number(total) * discountRate;
                          overalDiscount = overalDiscount + discountAmount;
                        }

                        return (
                          <tr>
                            <td>{item?.product?.idescription}</td>
                            {User?.user?.companyInfo?.tax === "gst" ? (
                              <td>{item?.product?.hsn_code}</td>
                            ) : null}
                            <td>{Number(item.quantity)}</td>
                            <td>{Number(item.costprice)}</td>
                            {User?.user?.companyInfo?.tax === "gst" ? (
                              <>
                            
                                {details?.invoiceDetails &&
                                details?.invoiceDetails[
                                  "customer.vat_number"
                                ]?.substring(0, 2) ===
                                  User?.user?.companyInfo?.taxno?.substring(
                                    0,
                                    2
                                  ) ? (
                                  <>
                                     <td>{item?.vat}%</td>
                                    <td>{item?.vatamt / 2}</td>
                                    <td>{item?.vatamt / 2}</td>
                                  </>
                                ) : (
                                  <>
                                  <td>{item?.vat}%</td>
                                  <td>{item?.vatamt}</td>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <td>{item?.vat}%</td>
                                <td>{item?.vatamt}</td>
                              </>
                            )}
                            <td>
                              <Checkbox
                                disabled
                                checked={item.includevat === 1 ? true : false}
                              />
                            </td>
                            <td>{Number(item.discount)} %</td>
                            <td>
                              {Math.round(Number(discountAmount))?.toFixed(2)}
                            </td>
                            <td>{Number(item.total)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Col>

              <Col md={8}></Col>
              <Col md={4}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                      <td>{subAllTottal?.toFixed(2)}</td>
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
                              <td>{(taxAmount / 2)?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>{t("home_page.homepage.totel_sgst")}</td>
                              <td>{(taxAmount / 2)?.toFixed(2)}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td>{t("home_page.homepage.totel_igst")}</td>
                            <td>{taxAmount?.toFixed(2)}</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td>{t("home_page.homepage.totel_vat")}</td>
                        <td>{taxAmount?.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                      <td>{Math.round(overalDiscount)?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>ROUND OFF</td>
                      <td>
                        {Number(details?.invoiceDetails?.roundOff)?.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                      <td>{details?.invoiceDetails?.total}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <hr />
          </div>
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
              subject: `Performa Invoice ${details?.invoiceDetails?.invoiceno}`,
              content: User.user.companyInfo.defaultmail,
            }}
            fileName={`PerformaInvoice${new Date()}.pdf`}
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
  );
}

export default PerfomaView;
