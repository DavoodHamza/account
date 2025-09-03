import { Button, Card, DatePicker, notification } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { MdFileDownload } from "react-icons/md";
import { DaySummaryTemplate } from "./component/template";

const DayReportSummary = () => {
  const [daySummary, setDaySummary] = useState<any>([]);
  const [emailModal, setEmailModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const today = new Date();
  const [endDate, setEndDate] = useState(moment(today).format("YYYY-MM-DD"));
  const [firstDate, setFirstDate] = useState(
    moment(today).format("YYYY-MM-DD")
  );
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();

  useEffect(() => {
    getDaySummary(firstDate, endDate, page, limit);
  }, [firstDate, endDate]);

  const getDaySummary = async (
    sdate: any,
    ldate: any,
    page: any,
    limit: any
  ) => {
    try {
      setIsLoading(true);
      const formattedDate = moment(new Date(sdate)).format("YYYY-MM-DD");
      const formattedEndDate = moment(new Date(ldate)).format("YYYY-MM-DD");
      const url = `${API.DAY_REPORT_SUMMARY}?companyid=${user?.companyInfo?.id}&sdate=${formattedDate}&ldate=${formattedEndDate}`;

      const response: any = await GET(url, null);

      if (response?.status) {
        setDaySummary(response?.data);
      } else {
        notification.error({
          message: "Something went wrong",
          description: "No data found from the server",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again later..!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setFirstDate(dates[0]);
    setEndDate(dates[1]);
    getDaySummary(dates[0], dates[1], page, limit);
  };

  const downLoadPdf = async (templates: any) => {
    let templateContent = templates;
    templateContent = templateContent;
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "Day Report",
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
    a.download = `DayReport_report_${moment(firstDate).format(
      "DD-MM-YYYY"
    )}_${moment(endDate).format("DD-MM-YYYY")}`;
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
      filename: "Day Report",
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
      notification.success({ message: "Email Sent Successfully " });
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
      setIsDownloadLoading(true);
      let obj = {
        user,
        personalData: user?.companyInfo,
        data: daySummary,
        endDate,
        firstDate,
      };

      let templates: any = null;

      if (user) {
        templates = DaySummaryTemplate(obj);
      }
      if (type === "email") {
        sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }

      setIsDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setIsDownloadLoading(false);
    }
  }

  return (
    <>
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <Row>
              <Col md={6} />
              <Col md={4}>
                <DatePicker.RangePicker
                  size="large"
                  style={{ width: "100%", textAlign: "right" }}
                  defaultValue={[
                    dayjs(firstDate, "YYYY-MM-DD"),
                    dayjs(endDate, "YYYY-MM-DD"),
                  ]}
                  onChange={handleDateRangeChange}
                />
              </Col>
              <Col md={2}>
                <Button
                  onClick={() => genrateTemplate("downLoad", {})}
                  loading={isDownloadLoading}
                  type="primary"
                  style={{ height: "40px" }}
                  block
                >
                  {t("home_page.homepage.download")} <MdFileDownload size={20} />
                </Button>
              </Col>
            </Row>
            <br />
            <Table bordered>
              <thead>
                <tr style={{ backgroundColor: "#feefc3" }}>
                  <th>{t("home_page.homepage.slno")}</th>
                  <th>{t("home_page.homepage.Date")}</th>
                  <th>{t("home_page.homepage.Type")}</th>
                  <th>{t("home_page.homepage.LedgerName")}</th>
                  <th>{t("home_page.homepage.Debit")}</th>
                  <th>{t("home_page.homepage.Credit")}</th>
                </tr>
              </thead>
              <tbody>
                {daySummary?.allData?.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ height: "40vh" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {t("home_page.homepage.No_data")}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {daySummary?.allData?.map(
                      (allDataItem: any, allDataIndex: number) =>
                        allDataItem?.values?.map(
                          (item: any, itemIndex: number) => (
                            <tr key={`${allDataIndex}-${itemIndex}`}>
                              {itemIndex === 0 && (
                                <>
                                  <td
                                    rowSpan={allDataItem?.values?.length}
                                    style={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    {allDataIndex + 1}
                                  </td>
                                  <td
                                    rowSpan={allDataItem?.values?.length}
                                    style={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    {moment(allDataItem?.date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </td>
                                  <td
                                    rowSpan={allDataItem?.values?.length}
                                    style={{
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                  >
                                    {allDataItem?.type}
                                  </td>
                                </>
                              )}

                              <td>{item?.ledgerName}</td>
                              <td>{item?.debit}</td>
                              <td>{item?.credit}</td>
                            </tr>
                          )
                        )
                    )}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <strong>{t("home_page.homepage.totals")}</strong>
                      </td>
                      <td>
                        <strong>
                          {Number(daySummary?.totalDebit).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <strong>
                          {Number(daySummary?.totalCredit).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </>
  );
};

export default DayReportSummary;
