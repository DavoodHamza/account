import { Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageHeader from "../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import { useSelector } from "react-redux";
import API from "../../config/api";
import { GET } from "../../utils/apiCalls";
import moment from "moment";
import StatementTable from "../staff/components/statementTable";
import { TbGraphFilled } from "react-icons/tb";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { t } from "i18next";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import img1 from "../../assets/images/A.webp";
import img2 from "../../assets/images/B.webp";
import img3 from "../../assets/images/C.webp";
import { HiCollection } from "react-icons/hi";

const StaffActivityList = () => {
  const columns = [
    {
      name: "id",
      title: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "date",
      title: "Date1",
      dataType: "string",
      cellRender: ({ data }: any) => moment(data?.date).format("YYYY-MM-DD"),
    },
    {
      name: "particular",
      title: "Particulars",
      dataType: "string",
    },
    {
      name: "type",
      title: "Voucher Type",
      dataType: "string",
    },
    {
      name: "debit",
      title: "Debit",
      dataType: "string",
    },
    {
      name: "credit",
      title: "Credit",
      dataType: "string",
    },
  ];

  const today = new Date();
  const startDay = moment(new Date(today.setDate(1))).format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(startDay);

  const [isLoading, setIsLoading] = useState(false);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [customeData, setCustomData] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((state: any) => state.User);

  useEffect(() => {
    fetchStaffTransactions(firstDate, currentDate);
  }, [firstDate, currentDate]);

  const fetchStaffTransactions = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      const sales_list_url =
        API.CONTACT_MASTER +
        `staffStatement/${user?.id}/${user?.staff?.id}/${sdate}/${ldate}`;
      const { data }: any = await GET(sales_list_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setCurrentDate(dates[0]);
    setFirstDate(dates[1]);
    fetchStaffTransactions(dates[0], dates[1]);
  };

  const fetchStaffCustomData = async () => {
    try {
      setIsCustomLoading(true);
      const url = API.STAFF_DASHBOARD_DATA + user?.staff?.id;
      const { data }: any = await GET(url, null);
      setCustomData(data);
      setIsCustomLoading(false);
    } catch (error) {
      console.log(error);
      setIsCustomLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffCustomData();
  }, []);

  let datasObj = {
    firstDate,
    currentDate,
  };
  return (
    <>
      <PageHeader
        firstPath="Activities"
        firstPathLink={location.pathname}
        onSubmit={() => navigate("/usr/staff/create/0")}
        goback="/usr/dashboard"
        title="Activities"
      />
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Container>
            <br />
            <Row>
              <Col md={4}>
                <Card style={{ height: "100%" }}>
                  <div className="d-flex align-items-center justify-content-between pb-2">
                    <div className="d-flex align-items-center">
                      <div className="dashboard-icon-container">
                        {isCustomLoading ? (
                          <Spin />
                        ) : (
                          <TbGraphFilled size={24} color="orange" />
                        )}
                      </div>
                      <div>
                        <h5 className="dashboard-icons-text mb-0">
                          {t("home_page.homepage.Total_Sales")}
                        </h5>
                      </div>
                    </div>

                    <div>
                      <img
                        src={img1}
                        alt="icon"
                        style={{ width: "40px", height: "30px" }}
                      />
                    </div>
                  </div>
                  <div
                    className=""
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span className="dashboard-total-sales-price">
                      {" "}
                      {`${user?.companyInfo?.countryInfo?.symbol}
                ${customeData?.totalSales || 0.0}
                    `}
                    </span>
                    <p
                      className="dashboard-sales-progress mb-0"
                      style={{
                        backgroundColor: "rgb(238 224 196)",
                        color: "orange",
                      }}
                    >
                      <IoMdArrowUp />
                      {Number(customeData?.salesPercentage)?.toFixed(2) ||
                        0.0}{" "}
                      %{" "}
                    </p>
                  </div>
                  <span style={{ fontSize: "12px" }}>
                    Increase total sales by{" "}
                    {Number(customeData?.salesPercentage)?.toFixed(2) || 0.0} %{" "}
                    from last day
                  </span>
                </Card>
              </Col>
              <Col md={4}>
                <Card style={{ height: "100%" }}>
                  <div className="d-flex align-items-center justify-content-between pb-2">
                    <div className="d-flex align-items-center">
                      <div className="dashboard-icon-container">
                        {isCustomLoading ? (
                          <Spin />
                        ) : (
                          <HiCollection size={24} color="rgb(119 117 236)" />
                        )}
                      </div>
                      <div>
                        <h5 className="dashboard-icons-text mb-0">
                          Total Collection
                        </h5>
                      </div>
                    </div>
                    <div>
                      <img
                        src={img2}
                        alt="icon"
                        style={{ width: "40px", height: "30px" }}
                      />
                    </div>
                  </div>
                  <div
                    className=""
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span className="dashboard-total-sales-price">
                      {" "}
                      {customeData?.totalCollection || 0}
                    </span>
                    <p className="dashboard-sales-progress mb-0">
                      <IoMdArrowUp />
                      {customeData?.collectionPercentage?.toFixed(2) || 0}%{" "}
                    </p>
                  </div>
                  <span style={{ fontSize: "12px" }}>
                    Increase total collection by{" "}
                    {customeData?.collectionPercentage?.toFixed(2) || 0}% from
                    last day
                  </span>
                </Card>
              </Col>
              <Col md={4}>
                <Card style={{ height: "100%" }}>
                  <div className="d-flex align-items-center justify-content-between pb-2">
                    <div className="d-flex align-items-center">
                      <div
                        className="dashboard-icon-container"
                        style={{ backgroundColor: "#c5e6c5" }}
                      >
                        {isCustomLoading ? (
                          <Spin />
                        ) : (
                          <RiMoneyDollarCircleFill
                            size={28}
                            color="rgb(83 213 83)"
                          />
                        )}
                      </div>
                      <h5 className="dashboard-icons-text mb-0">
                        Total Amount Closed
                      </h5>
                    </div>

                    <div>
                      <img
                        src={img3}
                        alt="icon"
                        style={{ width: "40px", height: "30px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className="dashboard-total-sales-price">
                      {customeData?.totalAmountClosed?.toFixed(2) || 0}
                    </span>
                    <p
                      className="dashboard-sales-progress mb-0"
                      style={{
                        color: "rgb(83 213 83)",
                        backgroundColor: "#c5e6c5",
                      }}
                    >
                      {Number(customeData?.totalClosedAmountPercentage) > 0 ? (
                        <IoMdArrowUp />
                      ) : (
                        <IoMdArrowDown />
                      )}
                      {Number(
                        customeData?.totalClosedAmountPercentage
                      )?.toFixed(2) || 0}
                      %
                    </p>
                  </div>
                  <span style={{ fontSize: "12px" }}>
                    {`${
                      Number(customeData?.totalClosedAmountPercentage) > 0
                        ? t("home_page.homepage.Increase")
                        : "Decrease"
                    } ${t("home_page.homepage.total_profit")} ${
                      Number(customeData?.totalClosedAmountPercentage)?.toFixed(
                        2
                      ) || 0
                    }% ${t("home_page.homepage.from_last_month")}`}
                  </span>
                </Card>
              </Col>
            </Row>
            <br />
            <Card>
              <StatementTable
                columns={columns}
                list={data}
                title="All Activities"
                onFilterData={datasObj}
                // onPageChange={(p: any, t: any) => onPageChange(p, t)}
                handleDateRangeChange={handleDateRangeChange}
              />
            </Card>
          </Container>
        )}
      </div>
    </>
  );
};

export default StaffActivityList;
