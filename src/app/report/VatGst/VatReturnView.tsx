import dayjs from "dayjs";
import { Spin } from "antd/es";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Button, Card, DatePicker, Select, notification } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "../styles.scss";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import moment from "moment";
import { useTranslation } from "react-i18next";

const customIcon = <LoadingOutlined type="loading" spin />;

const VatReturnView = () => {
  const User = useSelector((state: any) => state.User.user);
  const isCountry101 = User?.companyInfo?.tax === "gst";
  const navigate = useNavigate();
  const { edate, sdate, id } = useParams();
  const { t } = useTranslation();
  const year = moment(new Date()).format("YYYY");

  const FirstQuater: any = [
    moment(User?.companyInfo?.tax == "gst" ?`${year}-04-01`:`${year}-01-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
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
  const location = useLocation();
  const [totalVat, setTotalVat] = useState(0);
  const [endDate, setEndDate] = useState(edate);
  const [startDate, setStartDate] = useState(sdate);
  const [productVatList, setProductVatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [dateRangeValue, setDateRangeValue] = useState<any>([
    moment(sdate).format("YYYY-MM-DD"),
    moment(edate).format("YYYY-MM-DD"),
  ]);

  useEffect(() => {
    getVatNominalList(sdate,endDate);
  }, []);

  useEffect(() => {
    setStartDate(dateRangeValue[0]);
    setEndDate(dateRangeValue[1]);
    setTimeout(() => {
      setIsLoading2(true);
      getVatNominalList(dateRangeValue[0], dateRangeValue[1]);
    }, 200);
  }, [dateRangeValue]);

  const getVatNominalList = async (startDate?: any, endDate?: any) => {
    try {
      let url =
        API.VAT_RETURN_NOMINAL +
        User?.id +
        "/" +
        User?.companyInfo.id +
        "/" +
        id +
        "/" +
        startDate +
        "/" +
        endDate;
      const VatNominal: any = await GET(url, null);
      setProductVatList(VatNominal?.data?.productVatList);
      setTotalVat(VatNominal?.data?.totalVat);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Something went wrong. Please try again later..!",
      });
    } finally {
      setIsLoading(false);
      setIsLoading2(false);
    }
  };

  const OnPeriodChange = (period: any) => {
    if (period?.children === "First Quater") {
      setDateRangeValue(FirstQuater);
    } else if (period?.children === "Second Quater") {
      setDateRangeValue(SecondQuater);
    } else if (period?.children === "Third Quater") {
      setDateRangeValue(ThirdQuater);
    } else if (period?.children === "Fourth Quater") {
      setDateRangeValue(FourthQuater);
    }
  };

  const OnDateChange = (val: any) => {
    if (val?.length) {
      let sdate: any = dayjs(val[0]).format("YYYY-MM-DD");
      let edate: any = dayjs(val[1]).format("YYYY-MM-DD");
      if (val[0]) setStartDate(sdate);
      if (val[1]) setEndDate(edate);
      startDate &&
        endDate &&
        setTimeout(() => {
          setIsLoading2(true);
          getVatNominalList(sdate, edate);
        }, 300);
    }
  };

  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.Report")}
        firstPathLink = "/usr/report"
        secondPathText = {User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GST") : t("home_page.homepage.vat")}
        secondPathLink ={location.pathname}
        thirdPathText = {User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTReturn_View") : t("home_page.homepage.VATReturn_View")}
        thirdPathLink ={location.pathname}
        title={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTReturn_View") : t("home_page.homepage.VATReturn_View")}
      />
      <br />
      <Container>
        <Card>
          <Row>
            <Col md={"4"}>
              <div className="VatReturn-label">{t("home_page.homepage.Period")}</div>
              <Select
                size="large"
                allowClear
                placeholder={"Period"}
                className="width100"
                defaultValue={"Custom"}
                onChange={(val: any, data: any) => {
                  OnPeriodChange(data);
                }}
              >
                {[
                  "First Quater",
                  "Second Quater",
                  "Third Quater",
                  "Fourth Quater",
                  "Custom",
                ].map((item: any, i: number) => (
                  <Select.Option key={i}>{item}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col md={"8"}>
              <div className="VatReturn-label"> {t("home_page.homepage.From")} - {t("home_page.homepage.To")}</div>
              <DatePicker.RangePicker
                defaultValue={[
                  dayjs(edate, "YYYY/MM/DD"),
                  dayjs(sdate, "YYYY/MM/DD"),
                ]}
                value={
                  dateRangeValue
                    ? [dayjs(dateRangeValue[0]), dayjs(dateRangeValue[1])]
                    : null
                }
                format={"YYYY/MM/DD"}
                onCalendarChange={(val: any) => {
                  OnDateChange(val);
                }}
                size="large"
                className="width100"
              />
            </Col>
          </Row>
        </Card>
        <br />
        <Card
          title={User?.companyInfo?.tax === "gst" ? t("home_page.homepage.GSTReport_Sales"): t("home_page.homepage.VATReport_Sales")}
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
              <strong>{"From: " + startDate}</strong>
              <strong>{"To: " + endDate}</strong>
            </div>
          </div>
        </Card>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <Row>
              <Table bordered hover>
                <thead className="Report-thead">
                  <th className="Report-table-th">{t("home_page.homepage.SNo")}</th>
                  <th className="Report-table-th">{t("home_page.homepage.PRODUCTNAME")}</th>
                  {isCountry101 && (
                    <>
                    <th className="Report-table-th">{t("home_page.homepage.CGST")}</th>
                    <th className="Report-table-th">{t("home_page.homepage.SGST")}</th>
                    </>
                  )}
                  <th className="Report-table-th">{t("home_page.homepage.TOTAL")}</th>
                  <th className="Report-table-th">{t("home_page.homepage.ACTION")}</th>
                </thead>
                <tbody>
                  {productVatList && productVatList?.map((list: any, i: number) => {
                    return (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{list?.product}</td>
                          {isCountry101 && (
                            <>
                            <td>{list?.amount / 2}</td>
                            <td>{list?.amount / 2}</td>
                            </>
                          )}
                          <td>{list?.amount}</td>
                          <td
                            className="Report-td-link"
                            onClick={() =>
                              navigate(
                                `/usr/report/vatNominalView/${id}/${list?.id}/${startDate}/${endDate}/${list?.product}`
                              )
                            }
                          >
                            {t("home_page.homepage.ViewDetails")}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                  <tr>
                    <td></td>
                    <td className="Report-table-td-total">{isCountry101 ? "Overall GST":"Overall VAT"}</td>
                    {isCountry101 && (
                      <>
                      <td className="Report-table-td-total">{Number(totalVat / 2)?.toFixed(2)}</td>
                      <td className="Report-table-td-total">{Number(totalVat / 2)?.toFixed(2)}</td>
                      </>
                    )}
                    <td className="Report-table-td-total">
                      {Number(totalVat)?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </Card>
        )}
      </Container>
    </>
  );
};

export default VatReturnView;
