import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, notification } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { Table } from "react-bootstrap";
import "./styles.scss";
import PageHeader from "../../../components/pageHeader";
import moment from "moment";
import dayjs from "dayjs";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../utils/apiCalls";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { profitLossTemplate } from "./template";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";
const ProfitnLoss = () => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
   const { t } = useTranslation();

  const today = new Date();
  const startDay = moment(new Date(today.setDate(1))).format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(startDay);

  const User = useSelector((state: any) => state.User.user);
  const [isLoading, setIsLoading] = useState(true);
  const [profitLoss, setProfitLoss] = useState<any>([]);
  const [emailModal, setEmailModal] = useState(false);

  useEffect(() => {
    getProfitLoss(firstDate, currentDate);
  }, []);

  const { user } = useSelector((state: any) => state.User);

  const financialStartDate: any = user?.companyInfo?.financial_year_start;

  const getProfitLoss = async (sdate: any, edate: any) => {
    try {
      const formattedSDate = moment(new Date(sdate)).format("YYYY-MM-DD");
      const formattedEDate = moment(new Date(edate)).format("YYYY-MM-DD");
      setIsLoading(true);
      let url =
        API.PROFITLOSS +
        user?.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        formattedSDate +
        "/" +
        formattedEDate;
      const profitLoss: any = await GET(url, null);
      setProfitLoss(profitLoss?.data);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again later..!",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const sendMailPdf = async (templates: any, email: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      email: email,
      filename: "Profit and Loss",
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

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        User,
        profitLoss: profitLoss,
        personalData: User.companyInfo,
        currentDate,
        firstDate,
        type: "Customer",
      };

      let templates: any = null;
      if (!User) {
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
      if (!User) {
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
      if (User) {
        templates = profitLossTemplate(obj);
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
        User,
        profitLoss: profitLoss,
        personalData: User.companyInfo,
        currentDate,
        firstDate,
        type: "Customer",
      };
      let templates = profitLossTemplate(obj);
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
    // const encodedString = btoa(encodeURIComponent(templateContent));
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
    a.download = `ProfitandLoss${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDateRangeChange = (dates: any) => {
    setCurrentDate(dates[1]);
    setFirstDate(dates[0]);
    getProfitLoss(dates[0], dates[1]);
  };

  return (
    <>
      <div>
        <PageHeader
          firstPathText={t("home_page.homepage.Report")}
          secondPathText={t("home_page.homepage.Profit_Loss")}
          firstPathLink={location?.pathname}
          secondPathLink={location?.pathname}
          title={t("home_page.homepage.Profit_Loss")}
          children={
            <div>
              <Button
                className="Report-HeaderButton-dwnld"
                onClick={() => generateTemplate("downLoad", {})}
                loading={downloadLoading}
              >
                <MdFileDownload size={20} />
              </Button>
              &nbsp;
              <Button
                className="Report-HeaderButton-print"
                onClick={() => setEmailModal(true)}
              >
                <MdAttachEmail size={20} />
              </Button>
            </div>
          }
        />

        <Container>
          {isLoading ? (
            <LoadingBox />
          ) : (
            <>
              <br />
              <Row>
                <Col md={6} />
                <Col md={"6"}>
                  <DatePicker.RangePicker
                    size="large"
                    className="width100"
                    format={"YYYY-MM-DD"}
                    defaultValue={[
                      dayjs(firstDate, "YYYY-MM-DD"),
                      dayjs(currentDate, "YYYY-MM-DD"),
                     
                    ]}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current < moment(financialStartDate).startOf("day")
                      );
                    }}
                    onChange={handleDateRangeChange}
                  />
                </Col>
              </Row>
              <br />
              <Card>
                <Table
                  bordered
                  responsive={true}
                  style={{ tableLayout: "fixed" }}
                >
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                        {t("home_page.homepage.PARTICULAR")}
                      </th>
                      <th
                        style={{
                          width: 160,
                          backgroundColor: "#feefc3",
                          fontSize: 16,
                        }}
                      >
                       {t("home_page.homepage.AMOUNT")} 
                      </th>
                      <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
                      {t("home_page.homepage.PARTICULAR")}
                      </th>
                      <th
                        style={{
                          width: 160,
                          backgroundColor: "#feefc3",
                          fontSize: 16,
                        }}
                      >
                      {t("home_page.homepage.AMOUNT")} 

                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {t("home_page.homepage.OpeningStock")}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {Number(profitLoss?.openingStocks).toFixed(2) || 0.0}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      ></td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      ></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "900" }}>
                        <div className="profitandlossItem1">
                          <span
                            onClick={() => navigate("/usr/purchace-invoice")}
                            style={{ cursor: "pointer" }}
                          >
                            {t("home_page.homepage.Purchase")}
                          </span>
                          <span
                            onClick={() => navigate("/usr/purchace-invoice")}
                            style={{ cursor: "pointer" }}
                          >
                            {Number(profitLoss?.values?.purchaseTotal).toFixed(
                              2
                            ) || 0.0}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: "900" }}></td>
                      <td style={{ fontWeight: "900" }}>
                        <div className="profitandlossItem1">
                          <span
                            onClick={() => navigate("/usr/sales-invoice")}
                            style={{ cursor: "pointer" }}
                          >
                            {t("home_page.homepage.Sale")}
                          </span>
                          <span
                            onClick={() => navigate("/usr/sales-invoice")}
                            style={{ cursor: "pointer" }}
                          >
                            {Number(profitLoss?.values?.salesTotal).toFixed(
                              2
                            ) || 0.0}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: "900" }}></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "900" }}>
                        <>
                          <div className="profitandlossItem1">
                            <span
                              onClick={() =>
                                navigate("/usr/purchase-debit-note")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {t("home_page.homepage.PurchaseReturn")}
                            </span>
                            <span
                              onClick={() =>
                                navigate("/usr/purchase-debit-note")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {" "}
                              {Number(
                                profitLoss?.values?.purchaseDebitTotal
                              ).toFixed(2) || 0.0}
                            </span>
                          </div>
                        </>
                      </td>
                      <td></td>
                      <td style={{ fontWeight: "900" }}>
                        <>
                          <div className="profitandlossItem1">
                            <span
                              onClick={() => navigate("/usr/salesCredit")}
                              style={{ cursor: "pointer" }}
                            >
                              {t("home_page.homepage.SalesReturn")}
                            </span>
                            <span
                              onClick={() => navigate("/usr/salesCredit")}
                              style={{ cursor: "pointer" }}
                            >
                              {Number(
                                profitLoss?.values?.salesCreditTotal
                              ).toFixed(2) || 0.0}
                            </span>
                          </div>
                        </>
                      </td>
                      <td style={{ fontWeight: "900" }}></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "900" }}>{t("home_page.homepage.Actual_Purchase")}</td>
                      <td style={{ fontWeight: "900" }}>
                        {profitLoss?.values?.activePurchase || 0.0}
                      </td>
                      <td style={{ fontWeight: "900" }}>{t("home_page.homepage.Actual_Sale")}</td>
                      <td style={{ fontWeight: "900" }}>
                        {profitLoss?.values?.activeSales || 0.0}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td style={{ fontWeight: "900" }}>{t("home_page.homepage.Closing_Stock")}</td>
                      <td style={{ fontWeight: "900" }}>
                        {Number(profitLoss?.closingStocks).toFixed(2) || 0.0}
                      </td>
                    </tr>
                    
                      {
                        //direct expence
                        profitLoss?.directexpenses &&
                          profitLoss?.directexpenses
                            ?.filter(
                              (item: any) =>
                                item.ledger !== "Cost of Sales-goods" &&
                                item.ledger !== "Purchase Return"
                            )
                            .map((item: any) => (
                              <tr>
                                <td
                                  style={{
                                  
                                    fontWeight: "900",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    navigate(`/usr/ledger-view/${item.id}`)
                                  }
                                >
                                  <div className="pandltext">
                                    {item?.ledger}
                                  </div>
                                </td>
                                <td
                                  style={{
                                  
                                    fontWeight: "900",
                                  }}
                                >
                                  {Number(item?.amount).toFixed(2)}
                                </td>
                                {profitLoss?.directIncome &&
                                profitLoss?.directIncome.map((item: any) => (
                            <>
                                <td
                                   style={{
                                 
                                    fontWeight: "900",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    navigate(`/usr/ledger-view/${item.id}`)
                                  }
                                > {item?.ledger}</td>
                                <td
                                  style={{
                                    fontWeight: "900",
                                  }}
                                >{Number(item?.amount).toFixed(2)} </td>
                                </>
                                ))
                              }
                                </tr>
                            ))
                      }
                 
                    
                      {/* {
                        // direct income
                        profitLoss?.directIncome &&
                          profitLoss?.directIncome.map((item: any) => (
                            <tr>
                              <td
                                style={{
                               
                                  fontWeight: "900",
                                }}
                              ></td>
                              <td
                                style={{
                                 
                                  fontWeight: "900",
                                }}
                              ></td>
                              <td
                                style={{
                                 
                                  fontWeight: "900",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/usr/ledger-view/${item.id}`)
                                }
                              >
                                <div className="pandltext">{item?.ledger}</div>
                              </td>
                              <td
                                style={{
                                
                                  fontWeight: "900",
                                }}
                              >
                                {Number(item?.amount).toFixed(2)}
                              </td>
                              </tr>
                          ))
                      } */}
                  
                    {profitLoss?.values?.grossCD <= 0 && (
                      <tr>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GrossProfit_c/d")}</td>
                        <td style={{ fontWeight: "900" }}>
                          {Math.abs(profitLoss?.values?.grossCD)}
                        </td>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}></td>
                      </tr>
                    )}
                    {profitLoss?.values?.grossCD > 0 && (
                      <tr>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GrossLoss_c/d")}</td>
                        <td style={{ fontWeight: "900" }}>
                          {profitLoss?.values?.grossCD}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {t("home_page.homepage.Total")}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {profitLoss?.values?.debitSideTotal || 0}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {t("home_page.homepage.Total")}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {profitLoss?.values?.creditSideTotal || 0}
                      </td>
                    </tr>
                    <br />
                    {profitLoss?.values?.grossCD > 0 && (
                      <tr>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GrossLoss_b/d")} </td>
                        <td style={{ fontWeight: "900" }}>
                          {profitLoss?.values?.grossCD}
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                    {profitLoss?.values?.grossCD <= 0 && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GrossProfit_b/d")}</td>
                        <td style={{ fontWeight: "900" }}>
                          {Math.abs(profitLoss?.values?.grossCD)}
                        </td>
                      </tr>
                    )}

                    {/* {profitLoss?.indirectExpenseList?.length !== 0 && (
                      <tr>
                      <td style={{ backgroundColor: "#f2f2f2",fontWeight: "900"}}>
                      Indirect Expense
                      </td>
                      <td style={{backgroundColor: "#f2f2f2",fontWeight: "900"}}></td>
                      {profitLoss?.indirectIncomeList?.length !== 0 && (
                     <td style={{backgroundColor: "#f2f2f2",fontWeight: "900"}}>
                        Indirect Income
                      </td>
                     )}
                     <td style={{backgroundColor: "#f2f2f2",fontWeight: "900"}}></td>
                      </tr>
                    )}
                     */}
                    {profitLoss?.indirectExpenseList &&
                      profitLoss?.indirectExpenseList
                        ?.filter(
                          (item: any) =>
                            item.ledger !== "Purchase Return" &&
                            item.ledger !== "Cost of Sales-goods"
                        )
                        ?.map((item: any) => {
                          return (
                            <tr>
                              <td
                                style={{
                               
                                  fontWeight: "900",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/usr/ledger-view/${item.id}`)
                                }
                              >
                                <div className="pandltext">{item?.ledger}</div>
                              </td>
                              <td
                                style={{
                             
                                  fontWeight: "900",
                                }}
                              >
                                {Number(item?.amount).toFixed(2)}
                              </td>
                              {profitLoss?.indirectIncomeList &&
                               profitLoss?.indirectIncomeList?.map((item: any) => (
                                <>
                              <td
                                style={{
                                  fontWeight: "900",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/usr/ledger-view/${item.id}`)
                                }
                              >
                                <div className="pandltext">{item?.ledger}</div>
                                 </td>
                              <td
                                style={{
                                
                                  fontWeight: "900",
                                }}
                              >{Number(item?.amount).toFixed(2)} </td>
                              </>
                        ))}
                            </tr>
                          );
                        })}
                    {/* {profitLoss?.indirectIncomeList &&
                      profitLoss?.indirectIncomeList?.map((item: any) => {
                        return (
                          <tr>
                            <td
                              style={{
                              
                                fontWeight: "900",
                              }}
                            ></td>
                            <td
                              style={{
                                
                                fontWeight: "900",
                              }}
                            ></td>
                            <td
                              style={{
                              
                                fontWeight: "900",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/usr/ledger-view/${item.id}`)
                              }
                            >
                              <div className="pandltext">{item?.ledger}</div>
                            </td>
                            <td
                              style={{
                             
                                fontWeight: "900",
                              }}
                            >
                              {Number(item?.amount).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })} */}

                    {profitLoss?.values?.netProfit <= 0 && (
                      <tr>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.NetProfit")}</td>
                        <td style={{ fontWeight: "900" }}>
                          {Math.abs(profitLoss?.values?.netProfit) || 0.0}
                        </td>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}></td>
                      </tr>
                    )}
                    {profitLoss?.values?.netProfit > 0 && (
                      <tr>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}></td>
                        <td style={{ fontWeight: "900" }}>{t("home_page.homepage.NetLoss")}</td>
                        <td style={{ fontWeight: "900" }}>
                          {Math.abs(profitLoss?.values?.netProfit) || 0.0}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {" "}
                        {t("home_page.homepage.Total")}{" "}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {" "}
                        {profitLoss?.values?.grandLeftTotal || 0}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {" "}
                        {t("home_page.homepage.Total")}{" "}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#f2f2f2",
                          fontWeight: "900",
                        }}
                      >
                        {" "}
                        {profitLoss?.values?.grandRightTotal || 0}{" "}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </>
          )}
          {emailModal ? (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              ownMail={User.email}
              fileName={`profitAndLossDetails${new Date()}.pdf`}
              Attachment={`${User.companyInfo.bname}_profitAndLoss_${moment(
                new Date()
              ).format("DD-MM-YYYY")}`}
              defaultValue={{
                to: User.email,
                subject: `Profit & Loss`,
                content: `Profit & Loss Details`,
              }}
            />
          ) : null}
        </Container>
        <br />
      </div>
    </>
  );
};

export default ProfitnLoss;
