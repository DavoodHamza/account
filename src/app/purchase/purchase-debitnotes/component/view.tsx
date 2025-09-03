import { Button, Card, Checkbox, Switch, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Table } from "react-bootstrap";
import "../../styles.scss";
import { useEffect, useState } from "react";
import { GET } from "../../../../utils/apiCalls";
import PageHeader from "../../../../components/pageHeader";
import LoadingBox from "../../../../components/loadingBox";
import moment from "moment";
import { MdFileDownload } from "react-icons/md";
import { template1, template2, template3,template4,template5 } from "./template";
import { useSelector } from "react-redux";
import API from "../../../../config/api";
import { useTranslation } from "react-i18next";
import { BsPrinter } from "react-icons/bs";
import PrintModal from "../../../../components/printModal/printModal";
function DebitNotInvoiceView() {
  const { t } = useTranslation();
  const [printLoading, setPrintLoading] = useState(false);
  const { id }: any = useParams();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [subTottal, setSubTottal] = useState<any>();
  const [taxAmount, setTaxAmount] = useState<any>();
  const [roundOff, setRoundOff] = useState<any>();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const User = useSelector((state: any) => state.User);
  const [staffData, setStaffData] = useState<any>();
  const user = User?.user;
  const [template, setTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  let overalDiscount = 0;
  let subAllTottal = 0;
  const navigate = useNavigate();

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
      let url = "purchaseinvoice/viewInvoice/" + id + "/purchase";
      const { data: invoiceDatas, status }: any = await GET(url, null);
      if (status) {
        setDetails(invoiceDatas);
        invoiceDatas?.invoiceDetails?.usertype === "staff" &&
          fetchStaff(invoiceDatas?.invoiceDetails?.createdBy);
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
        setRoundOff(
          Number(invoiceDatas?.invoiceDetails?.total) - Number(total)
        );
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
        customer: details?.invoiceDetails?.supplier,
        purchase: details?.invoiceDetails,
        invoicearray:splitArray,
        productlist: details?.invoiceItems,
        sale: details?.invoiceDetails,
        selectedBank: User.user?.companyInfo?.bankInfo,
        bankList: details?.banking,
        vatTotal: taxAmount,
        netTotal: subAllTottal,
        total: details?.invoiceDetails?.total,
        vatRate: taxAmount,
        isPaymentInfo: false,
        pagetype: "Debit Note Invoice",
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
      filename: "Purchase Debit",
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
    a.download = `DebitNote${details?.invoiceDetails?.supplier?.bus_name}_${
      details?.invoiceDetails?.invoiceno
    }_${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
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
        customer: details?.invoiceDetails?.supplier,
        purchase: details?.invoiceDetails,
        invoicearray:splitArray,
        productlist: details?.invoiceItems,
        sale: details?.invoiceDetails,
        bankList: details?.banking,
        vatTotal: taxAmount,
        selectedBank: User.user?.companyInfo?.bankInfo,
        netTotal: subAllTottal,
        total: details?.invoiceDetails?.total,
        vatRate: taxAmount,
        isPaymentInfo: false,
        pagetype: "Debit Note Invoice",
      };
      let templates: any = null;
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      }else if (user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      }else if (user.companyInfo.defaultinvoice === "5") {
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
        title={t("home_page.homepage.DebitNote_View")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.DebitNote_View")}
        secondPathLink={`/usr/purchace-debitnote-view/${id}`}
        firstPathText={t("home_page.homepage.Debit_Notes")}
        firstPathLink={"/usr/purchase-debit-note"}
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
          </div>
        }
      />
      <>
        <br />
        <Container className="p-1">
          {isFullLoading ? (
            <LoadingBox />
          ) : (
            <Card>
              <Row>
                <Col md="12">
                  <div className="salesInvoice-Header">
                    {t("home_page.homepage.Debit_Notes")}
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
                          {t("home_page.homepage.Supplier_Name")}
                        </td>
                        <td>
                          <strong>{details?.invoiceDetails?.sname}</strong>
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
                          {t("home_page.homepage.invoice_date")}{" "}
                        </td>
                        <td className="items-value">
                          {moment(details?.invoiceDetails?.sdate).format(
                            "DD MMMM YYYY"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="items-head">
                          {t("home_page.homepage.AgainstPurchaseInvoice")}
                        </td>
                        <td className="items-value">
                          {details?.invoiceDetails?.purchase_ref}
                        </td>
                        <td colSpan={2}></td>
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
                          <th>{t("home_page.homepage.HSN/SAC")}</th>
                        )}
                        <th>{t("home_page.homepage.QUANTITY")}</th>
                        <th>{t("home_page.homepage.PRICE")}</th>
                        {User?.user?.companyInfo?.tax === "gst" ? (
                          <>
                            <th>{t("home_page.homepage.GST")} %</th>
                            {details?.invoiceDetails?.supplier?.vat_number?.substring(
                              0,
                              2
                            ) ===
                            User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                              <th>{t("home_page.homepage.IGST_AMT")}</th>
                            ) : (
                              <>
                                <th>{t("home_page.homepage.SGST_AMT")}</th>
                                <th>{t("home_page.homepage.CGST_Amt")}</th>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <th>{t("home_page.homepage.TAX")}%</th>
                            <th>{t("home_page.homepage.TAX_AMT")}</th>
                          </>
                        )}
                        <th>{t("home_page.homepage.INC_TAX")}</th>
                        <th>{t("home_page.homepage.DISC_%")}</th>
                        <th>{t("home_page.homepage.DISC_AMT")}</th>
                        <th>{t("home_page.homepage.TOTAL")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.invoiceItems?.length &&
                        details?.invoiceItems?.map((item: any) => {
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
                              {User?.user?.companyInfo?.tax === "gst" && (
                                <td>{item?.product?.hsn_code}</td>
                              )}
                              <td>{Number(item.quantity)}</td>
                              <td>{Number(item.costprice)}</td>
                            
                               {User?.user?.companyInfo?.tax === "gst" ? (
                          <>
                              <td>{Number(item.vat)} %</td>
                            {details?.invoiceDetails?.supplier?.vat_number?.substring(
                              0,
                              2
                            ) ===
                            User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                              <td>{item?.vatamt}</td>
                            ) : (
                              <>
                                 <td>{item?.vatamt / 2}</td>
                                 <td>{item?.vatamt / 2}</td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                             <td>{Number(item.vat)} %</td>
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
                        <td>{t("home_page.homepage.TAXABLE_VALUE")} </td>
                        <td>{subAllTottal?.toFixed(2)}</td>
                      </tr>
                      {User?.user?.companyInfo?.tax === "gst" ? (
                        <>
                          {details?.invoiceDetails?.supplier?.vat_number?.substring(
                            0,
                            2
                          ) ===
                          User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
                            <>
                              <tr>
                                <td>{t("home_page.homepage.TOTAL_CGST")}</td>
                                <td>{(taxAmount / 2)?.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td>{t("home_page.homepage.TOTAL_SGST")}</td>
                                <td>{(taxAmount / 2)?.toFixed(2)}</td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td>{t("home_page.homepage.TOTAL_IGST")}</td>
                              <td>{taxAmount?.toFixed(2)}</td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td>{t("home_page.homepage.TOTAL_VAT")}</td>
                          <td>{taxAmount?.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td>{t("home_page.homepage.TOTAL_VAT")}</td>
                        <td>{Math.round(overalDiscount)?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>ROUND OFF</td>
                        <td>{details?.invoiceDetails?.roundOff}</td>
                      </tr>
                      <tr>
                        <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                        <td>{details?.invoiceDetails?.total}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card>
          )}
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

export default DebitNotInvoiceView;
