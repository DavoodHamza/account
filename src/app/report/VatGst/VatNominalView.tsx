import dayjs from "dayjs";
import moment from "moment";
import { Spin } from "antd/es";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Button, Card, DatePicker, Select, notification } from "antd";

import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";

const customIcon = <LoadingOutlined type="loading" spin />;

const VatNominalView = () => {
  const { edate, sdate, ledger, id, product } = useParams();
  const User = useSelector((state: any) => state.User.user);
  const { t } = useTranslation();

  const [data, setData] = useState<any>([]);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);

  const [currentDate, setCurrentDate] = useState(edate);
  const [oneMonthAgoDate, setOneMonthAgoDate] = useState(sdate);

  const year = moment(new Date()).format("YYYY");
  const navigate = useNavigate();

  const FirstQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ? `${year}-04-01`:`${year}-01-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ? `${year}-06-30`:`${year}-03-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const SecondQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ? `${year}-07-01`:`${year}-04-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ?`${year}-09-30`:`${year}-06-30`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const ThirdQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ?`${year}-10-01`:`${year}-07-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ?`${year}-12-31`:`${year}-10-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const FourthQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ?`${year}-01-01`:`${year}-10-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(User?.companyInfo?.tax == "gst" ? `${year}-03-31`:`${year}-12-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];

  useEffect(() => {
    getNominalVat(oneMonthAgoDate, currentDate);
  }, [oneMonthAgoDate, currentDate]);

  const getNominalVat = async (startDate?: any, endDate?: any) => {
    try {
      const formattedSDate = moment(new Date(startDate)).format("YYYY-MM-DD");
      const formattedEDate = moment(new Date(endDate)).format("YYYY-MM-DD");
      let url =
        API.VAT_RETURN_VIEW +
        User?.id +
        "/" +
        User?.companyInfo.id +
        "/" +
        ledger +
        "/" +
        id +
        "/" +
        formattedSDate +
        "/" +
        formattedEDate;
      const nominalVat: any = await GET(url, null);
      if (nominalVat?.status) {
        setData(nominalVat?.data);
      } else {
        notification.error({
          message: "Something went wrong",
          description: "No Data Found",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again later..!",
      });
    } finally {
      setIsLoading(false);
      setIsLoading2(false);
    }
  };

  const OnPeriodChange = (period: any) => {
    if (period?.children === "First Quater") {
      setOneMonthAgoDate(FirstQuater[0]);
      setCurrentDate(FirstQuater[1]);
    } else if (period?.children === "Second Quater") {
      setOneMonthAgoDate(SecondQuater[0]);
      setCurrentDate(SecondQuater[1]);
    } else if (period?.children === "Third Quater") {
      setOneMonthAgoDate(ThirdQuater[0]);
      setCurrentDate(ThirdQuater[1]);
    } else if (period?.children === "Fourth Quater") {
      setOneMonthAgoDate(FourthQuater[0]);
      setCurrentDate(FourthQuater[1]);
    }
  };

  const OnDateChange = (val: any) => {
    if (val?.length) {
      setOneMonthAgoDate(val[0]);
      setCurrentDate(val[1]);
    }
  };

  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.Report")}
        firstPathLink="/usr/report"
        secondPathText={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GST"):t("home_page.homepage.vat")}
        secondPathLink={location.pathname}
        thirdPathText={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTReturn_View") :t("home_page.homepage.VATReturn_View")}
        thirdPathLink={location.pathname}
        title={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTReturn_View"): t("home_page.homepage.VATReturn_View")}

        // children={
        //   <div>
        //     <Button className="Report-HeaderButton-dwnld">Download</Button>{" "}
        //     <Button className="Report-HeaderButton-print">Print</Button>
        //   </div>
        // }
      />
      <br />
      <Container>
        <Card>
          <Row>
            <Col md={"4"}>
              <div className="formLabel">{t("home_page.homepage.Period")}</div>
              <Select
                size="large"
                allowClear
                placeholder={"Period"}
                className="width100"
                defaultValue={"Custom"}
                onChange={(val: any, data: any) => OnPeriodChange(data)}
              >
                {[
                  "Custom",
                  "First Quater",
                  "Second Quater",
                  "Third Quater",
                  "Fourth Quater",
                ].map((item: any, i: number) => (
                  <Select.Option key={i}>{item}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col md={"8"}>
              <div className="formLabel">{t("home_page.homepage.From")} - {t("home_page.homepage.To")}</div>
              <DatePicker.RangePicker
                allowClear
                value={[dayjs(oneMonthAgoDate), dayjs(currentDate)]}
                format={"YYYY-MM-DD"}
                onCalendarChange={(val: any) => {
                  OnDateChange(val);
                }}
                size="large"
                // className="width100"
              />
            </Col>
          </Row>
        </Card>
        <br />
        <Card
title={
  User?.companyInfo?.tax === "gst" 
    ? `${t("home_page.homepage.NominalGST_Report")} (${product})`
    : `${t("home_page.homepage.NominalVAT_Report")} (${product})`
}
         extra={
            isLoading2 ? (
              <div>
                {" "}
                <Spin indicator={customIcon} />
              </div>
            ) : null
          }
        >
          <div className="Report-pageDetails">
            <div style={{ display: "flex", flexDirection: "column" }}>
            {t("home_page.homepage.Business_Name")}
              
              <b>{User?.companyInfo?.bname}</b>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
            {User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GST_Period"):t("home_page.homepage.VAT_Period")}
              <strong>{"From: " + oneMonthAgoDate}</strong>
              <strong>{"To: " + currentDate}</strong>
            </div>
          </div>
        </Card>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <Table bordered hover>
              <thead className="Report-thead">
                <th className="Report-table-th">{t("home_page.homepage.Date")}</th>
                <th className="Report-table-th">{t("home_page.homepage.Invoice_Number")}</th>
                <th className="Report-table-th">{t("home_page.homepage.InvoiceType")}</th>

                {User?.companyInfo?.tax === "gst" ? (
                  <>
                    <th>{t("home_page.homepage.gst")}</th>
                    <th className="Report-table-th">{t("home_page.homepage.SGST_AMT")}</th>
                    <th className="Report-table-th">{t("home_page.homepage.CGST_Amt")}</th>
                    <th className="Report-table-th">{t("home_page.homepage.IGST_AMT")}</th>
                  </>
                ) : (
                  <>
                    <th className="Report-table-th">{t("home_page.homepage.vat")} %</th>
                    <th className="Report-table-th">{t("home_page.homepage.VATAMT")}</th>
                  </>
                )}
                {/* {data[0].taxtype==="gst"?<div></div>:
                <th className="Report-table-th">VAT/GST (%)</th>
                <th className="Report-table-th">VAT/GST (AMOUNT)</th>} */}
                <th className="Report-table-th">{t("home_page.homepage.Debit")}</th>
                <th className="Report-table-th">{t("home_page.homepage.Credit")}</th>
                <th className="Report-table-th">{t("home_page.homepage.Total")}</th>
                <th className="Report-table-th">{t("home_page.homepage.RunningTotal")}</th>
                <th className="Report-table-th"></th>
              </thead>
              <tbody>
                {data?.map((item: any, i: number) => {
                  return (
                    <>
                      <tr key={i}>
                        <td>{moment(item?.date).format("DD-MMM-YYYY")}</td>
                        <td>{item?.invoiceno}</td>
                        <td>{item?.invoicType}</td>
                        <td>{item?.incometax}</td>
                        {User?.companyInfo?.tax === "gst" ? (
                          <>
                            <td>{item && item?.sgst||"--"}</td>
                            <td>{item && item?.cgst||"--"}</td>
                            <td>{item && item?.igst||"--"}</td>
                          </>
                        ) : (
                          <td>{item && item?.incometaxamount}</td>
                        )}
                        <td>{item?.debit}</td>
                        <td>{item?.credit}</td>
                        <td>{item?.total}</td>
                        <td>{item?.runningtotal}</td>

                        <td
                          className="Report-td-link"
                          onClick={() => {
                            {
                              item?.invoicType === "Sales Invoice"
                                ? navigate(
                                    `/usr/sale-invoice-view/${item?.invoicId}`
                                  )
                                : navigate(
                                    `/usr/purchase-invoice-view/${item?.invoicIdPurchase}`
                                  );
                            }
                          }}
                        >
                          View
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </>
  );
};

export default VatNominalView;
