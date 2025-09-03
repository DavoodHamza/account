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
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsCheckCircleFill } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoMdAlarm } from "react-icons/io";
import { SiGridsome } from "react-icons/si";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import Paymentmodal from "../../../../components/paymentmodal/paymentmodal";
import API from "../../../../config/api";
import { GET, POST } from "../../../../utils/apiCalls";
import "../../styles.scss";
import { template1, template2, template3 } from "./template";
import { useTranslation } from "react-i18next";

function PurchaceInvoiceView(props: any) {
  
  const { t } = useTranslation();
  const { id }: any = useParams();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isBttLoding, setIsBttLoding] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [subTottal, setSubTottal] = useState<any>();
  const [taxAmount, setTaxAmount] = useState<any>();
  const [roundOff, setRoundOff] = useState<any>();
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectBank, setSlectedBank] = useState<any>();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const User = useSelector((state: any) => state.User);
  const [staffData, setStaffData] = useState<any>();
  const navigate = useNavigate();
  const user = User.user;

  let overalDiscount = 0;
  let subAllTottal = 0;

  useEffect(() => {
    getInvoiceDetails();
    getBankList();
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
      let url = API.VIEW_PURCHASE_INVOICE + id + "/purchase";
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

  async function paymentFinish(val: any) {
    try {
      setIsBttLoding(true);
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
        supplierid: details?.invoiceDetails?.supplier?.id,
        outstanding: val?.outStanding,
        bankid: val?.paymentBank,
        sinvoice: id,
        logintype: "usertype",
        type: "Supplier Payment",
        date: val?.paymentDate,
        paidmethod: val?.paymentMethod,
        amount: val?.amoutToPaid,
        userdate: new Date(),
      };
      let url = API.PURCHASE_PAYMENT;
      let response: any = await POST(url, payload);
      if (response.status) {
        notification.success({ message: response.message });
        setIsBttLoding(false);
        setPaymentModal(false);
        await getInvoiceDetails();
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: "Something went wrong to your payment." });
      setIsBttLoding(false);
      setPaymentModal(false);
    }
  }

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user: User.user,
        customer: details?.invoiceDetails?.supplier,
        purchase: details?.invoiceDetails,
        productlist: details?.invoiceItems,
        sale: details?.invoiceDetails,
        // customer: details?.invoiceDetails?.customer,
        bankList: details?.banking,
        vatTotal: taxAmount,
        netTotal: subAllTottal,
        total: details?.invoiceDetails?.total,
        vatRate: taxAmount,
        isPaymentInfo: false,
        pagetype: "Invoice",
      };
      let templates: any = null;
      if (User.user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (User.user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (User.user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
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
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "Purchase Invoice",
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
    a.download = `Purchase${details?.invoiceDetails?.supplier?.bus_name}_${
      details?.invoiceDetails?.invoiceno
    }_${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.PurchaseInvoice_View")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.PurchaseInvoice_View")}
        secondPathLink={`/usr/purchase-invoice-view/${id}`}
        firstPathText={t("home_page.homepage.Purchase_Invoice")}
        firstPathLink={"/usr/purchace-invoice"}
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
                onClick={() => navigate(`/usr/purchace-invoice-form/duplicate/${details?.invoiceDetails?.id}`)}
                loading={downloadLoading}
              >
                <MdOutlineContentCopy size={20} />
              </Button>
            </Tooltip>
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
              {/* <Button
                onClick={() => genrateTemplate("downLoad", {})}
                loading={downloadLoading}
              >
                <MdFileDownload size={20} />
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
                <Col md="12">
                  <div className="salesInvoice-Header">
                    {t("home_page.homepage.Purchase_Invoice")}
                  </div>

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
                        <td className="items-head">{t("home_page.homepage.Createdby")}</td>
                      <td className="items-value">
                        {details?.invoiceDetails?.usertype === 'admin' ? `${user?.fullName}` : staffData?.name }
                      </td>
                      </tr>
                      <tr>
                        <td className="items-head">
                          {" "}
                          {t("home_page.homepage.invoice_date")}
                        </td>
                        <td className="items-value">
                          {moment(details?.invoiceDetails?.sdate).format(
                            "DD MMMM YYYY"
                          )}
                        </td>
                        <td className="items-head">
                          {t("home_page.homepage.Due_Date")}
                        </td>
                        <td className="items-value">
                          {moment(details?.invoiceDetails?.ldate).format(
                            "DD MMMM YYYY"
                          )}
                        </td>
                      </tr>
                      <tr>
                      <td className="items-head">{User?.user?.companyInfo?.tax === "gst" ?  "GSTIN/UIN" :"Vat Number"}</td>
                      <td className="items-value">
                        {details?.invoiceDetails?.supplier?.vat_number}
                      </td>
                      <td className="items-head"></td>
                      <td className="items-value">
                      </td>
                    </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={12}>
                  <div className="salesInvoice-SubHeader ">
                    {t("home_page.homepage.Invoice_Items")}
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>{t("home_page.homepage.PRODUCT")}</th>
                        {User?.user?.companyInfo?.tax === 'gst' && <th>{t("home_page.homepage.HSN/SAC")}</th>}
                        <th>{t("home_page.homepage.QUANTITY")}</th>
                        <th>{t("home_page.homepage.PRICE")}</th>
                        {User?.user?.companyInfo?.tax === "gst" ? (
                          <>
                            <th>{t("home_page.homepage.GST")}%</th>
                            {details?.invoiceDetails?.supplier?.vat_number?.substring(
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
                              {User?.user?.companyInfo?.tax === 'gst' &&  <td>{item?.product?.hsn_code}</td> }
                              <td>
                                {Number(item.quantity)}&nbsp;&nbsp;
                                {item?.product?.unitDetails?.unit}
                              </td>
                              <td>{Number(item.costprice)}</td>
                              <td>{item?.vat}%</td>
                              {User?.user?.companyInfo?.tax === "gst" ? (
                                <>
                                  {details?.invoiceDetails?.supplier?.vat_number?.substring(
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
                                  <td>{item?.vatamt}</td>
                                </>
                              )}
                              <td>
                                <Checkbox
                                  checked={item.includevat == 1 ? true : false}
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
                          ) === User?.user?.companyInfo?.taxno?.substring(0, 2) ? (
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
                        <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                        <td>{Math.round(overalDiscount)?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>ROUND OFF</td>
                        <td>{Number(details?.invoiceDetails?.roundOff)?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                        <td>{details?.invoiceDetails?.total}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      {t("home_page.homepage.Payment_Status")}: &nbsp;
                      {details?.invoiceDetails?.status === 0 ? (
                        <>
                          {" "}
                          <IoMdAlarm size={25} color="red" />
                          &nbsp;{t("home_page.homepage.Unsettled")}
                        </>
                      ) : details?.invoiceDetails?.status === 1 ? (
                        <>
                          {" "}
                          <SiGridsome size={25} color="orange" />
                          &nbsp; {t("home_page.homepage.PartiallyPaid")}
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
                    {details?.invoiceDetails?.status === 2 ? null : (
                      <td>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => setPaymentModal(true)}
                          block
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
                  loding={isBttLoding}
                />
              </Modal>
              <div className="salesInvoice-SubHeader ">
                {t("home_page.homepage.Invoice_TimeLine")}
              </div>
              <br />
              <Timeline mode="alternate">
                {details?.invoiceDetails?.status === 2 && (
                  <Timeline.Item
                    dot={<DollarCircleOutlined style={{ color: "green" }} />}
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
                    <div>{t("home_page.homepage.Pending_Payment")}</div>
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
                          ? "Invoice Paid Full"
                          : "Part of Invoice Paid"}
                      </div>
                      <br />
                      {t("home_page.homepage.Madeapayment_on")}{" "}
                      {moment(new Date(item.date)).format("DD-MMM-YYYY")} of{" "}
                      <strong>{Math.abs(parseInt(item.amount))}</strong> to{" "}
                      {item?.bankInf?.laccount}
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
                  Invoice placed on{" "}
                  {moment(new Date(details?.invoiceDetails?.createdat)).format(
                    "DD-MMM-yyyy @ h:mm a"
                  ) || moment(new Date()).format("DD-MMM-yyyy @ h:mm a")}
                </Timeline.Item>
              </Timeline>
            </Card>
          )}
        </Container>
      </>
    </>
  );
}

export default PurchaceInvoiceView;
