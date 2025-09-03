import { Alert, Button, Card, DatePicker, Spin, Modal } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiUsers } from "react-icons/hi2";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { TbGraphFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import img1 from "../../assets/images/A.webp";
import img2 from "../../assets/images/B.webp";
import img3 from "../../assets/images/C.webp";
import LoadingBox from "../../components/loadingBox";
import API from "../../config/api";
import { storeBankList } from "../../redux/slices/banklistSlice";
import { GET, POST } from "../../utils/apiCalls";
import OrderTable from "./components/OrderTable";
import PurchaseGraph from "./components/PurchaseGraph";
import SalesGraph from "./components/SalesGraph";
import VerificationModal from "./components/VerificationModal";
import "./style.scss";
import { jwtDecode } from "jwt-decode";
import { PiWarningCircle } from "react-icons/pi";

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionExpiryDate, setSubscriptionExpiryDate] =
    useState<Date | null>(null);

  const columns = [
    {
      name: "id",
      title: `${t("home_page.homepage.slno")}`,
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "invoiceno",
      title: `${t("home_page.homepage.Order_No")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "cname",
      title: `${t("home_page.homepage.Customer_Name")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "userdate",
      title: `${t("home_page.homepage.Item_Name")}`,
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
    },
    {
      name: "status",
      title: `${t("home_page.homepage.Status")}`,
      alignment: "center",
    },
    {
      name: "total",
      title: `${t("home_page.homepage.Amount")}`,
      alignment: "center",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [progress, setProgress] = useState<any>();
  const [customerData, setCustomerData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>();
  const [proformaInvoiceData, setProformaInvoiceData] = useState<any>([]);

  const { user } = useSelector((state: any) => state.User);
  const companyid = user?.companyInfo?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const startDay = moment(new Date(today.setDate(1))).format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(startDay);

  const adminid = user?.id;
  const token = useSelector((state: any) => state?.User?.user?.token);

  const fetchBankList = async () => {
    try {
      const bank_url =
        API.GET_BANK_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_url, null);
      dispatch(storeBankList(data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const proformaInvoiceList = async () => {
    try {
      setIsLoading(true);
      let proforma_Invoice_List_url =
        API.PROFORMA_INVOICE_LIST +
        adminid +
        `/${user?.companyInfo?.id}/proforma`;
      const { data }: any = await GET(proforma_Invoice_List_url, null);
      const latestOrders = data
        ?.sort(
          (a: any, b: any) =>
            new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        )
        ?.slice(0, 10);
      setProformaInvoiceData(latestOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomersInRange = async () => {
    try {
      setIsLoading(true);
      let customer_list_url =
        API.CONTACT_MASTER + `${adminid}/${companyid}/customer`;
      const { data }: any = await GET(customer_list_url, null);
      setCustomerData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGraphData = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      let graphData_url = API.GRAPH_DATA;
      const { data }: any = await POST(graphData_url, {
        adminid,
        companyid,
        ldate,
        sdate,
      });
      setGraphData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setCurrentDate(dates ? dates[0] : new Date());
    setFirstDate(dates ? dates[1] : new Date());
    fetchGraphData(
      dates ? dates[0] : new Date(),
      dates ? dates[1] : new Date()
    );
  };

  const progressData = async () => {
    try {
      setIsLoading(true);
      const sales_data = API.CUSTOM_DATA;
      const { data }: any = await POST(sales_data, {
        adminid,
        sdate: new Date(),
        companyid,
      });
      setProgress(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setDataLoading(true);
      let url = API.GET_USER_DETAILS;
      const response: any = await GET(url, null);
      if (!response?.data?.emailverified) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    proformaInvoiceList();
    fetchBankList();
    progressData();
    fetchGraphData(firstDate, currentDate);
    fetchCustomersInRange();

    // Check for upcoming subscription expiry
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded?.subscriptionExpiry) {
        const expiryDate = new Date(decoded.subscriptionExpiry);
        setSubscriptionExpiryDate(expiryDate);

        const today = new Date();
        const twoWeeksFromNow = new Date();
        twoWeeksFromNow.setDate(today.getDate() + 7);

        if (expiryDate > today && expiryDate <= twoWeeksFromNow) {
          setShowSubscriptionModal(true);
        }
      }
    }
  }, [token]);

  const decoded: any = token ? jwtDecode(token) : null;
  const subscriptionEndDate = decoded?.subscriptionExpiry
    ? new Date(decoded.subscriptionExpiry)
    : null;

  return (
    <>
      <Container>
        <br />
        {subscriptionEndDate && subscriptionEndDate <= new Date() && (
          <>
            <Alert
              message={
                <div className="company-textMessageContainer">
                  <div>
                    <PiWarningCircle size={24} color="red" />
                  </div>
                  <span>
                    {moment(subscriptionEndDate).format("YYYY-MM-DD") ===
                    moment(new Date()).format("YYYY-MM-DD")
                      ? `Your subscription plan expires today`
                      : `Your current subscription has been expired,`}
                  </span>
                  <button onClick={() => navigate("/subscription")}>
                    Renew Plan.
                  </button>
                </div>
              }
              type="error"
            />
            <br />
          </>
        )}
        <div className="dashboard-greetig-container">
          <strong className="dashboard-username-text">
            {t("home_page.homepage.Hi")},{" "}
            {user?.isStaff ? user?.staff?.name : user?.fullName}
          </strong>
          <DatePicker.RangePicker
            defaultValue={[
              dayjs(currentDate, "YYYY/MM/DD"),
              dayjs(firstDate, "YYYY/MM/DD"),
            ]}
            onChange={handleDateRangeChange}
          />
        </div>
        <br />
        <Row>
          <Col md={4}>
            <Card className="dashboard-card">
              <div className="d-flex align-items-center justify-content-between pb-2">
                <div className="d-flex align-items-center">
                  <div className="dashboard-icon-container">
                    {isLoading ? (
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
                  {`${user?.companyInfo?.countryInfo?.symbol} ${
                    progress?.totalSales || 0
                  }`}
                </span>
                <p
                  className="dashboard-sales-progress mb-0"
                  style={{
                    backgroundColor: "rgb(238 224 196)",
                    color: "orange",
                  }}
                >
                  <IoMdArrowUp />
                  {Number(progress?.salesPercentageChange)?.toFixed(2) ||
                    0} %{" "}
                </p>
              </div>
              <span style={{ fontSize: "12px" }}>
                {Number(progress?.salesPercentageChange) >= 0
                  ? t("home_page.homepage.Increase")
                  : "Decrease"}{" "}
                {t("home_page.homepage.Increase_total_sales")}{" "}
                {Number(progress?.salesPercentageChange)?.toFixed(2) || 0}%{" "}
                {t("home_page.homepage.from_last_month")}
              </span>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "100%" }}>
              <div className="d-flex align-items-center justify-content-between pb-2">
                <div className="d-flex align-items-center">
                  <div className="dashboard-icon-container">
                    {isLoading ? (
                      <Spin />
                    ) : (
                      <HiUsers size={24} color="rgb(119 117 236)" />
                    )}
                  </div>
                  <div>
                    <h5 className="dashboard-icons-text mb-0">
                      {t("home_page.homepage.Total_Customers")}
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
                  {customerData?.totalCustomers || 0}
                </span>
                <p className="dashboard-sales-progress mb-0">
                  {Number(customerData?.percentage) >= 0 ? (
                    <IoMdArrowUp />
                  ) : (
                    <IoMdArrowDown />
                  )}
                  {customerData?.percentage?.toFixed(2) || 0}%{" "}
                </p>
              </div>
              <span style={{ fontSize: "12px" }}>
                {Number(customerData?.percentage) >= 0
                  ? t("home_page.homepage.Increase")
                  : "Decrease"}{" "}
                {t("home_page.homepage.Increase_total_customers")}{" "}
                {customerData?.percentage?.toFixed(2) || 0}%{" "}
                {t("home_page.homepage.from_last_month")}
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
                    {isLoading ? (
                      <Spin />
                    ) : (
                      <RiMoneyDollarCircleFill
                        size={28}
                        color="rgb(83 213 83)"
                      />
                    )}
                  </div>
                  <h5 className="dashboard-icons-text mb-0">
                    {t("home_page.homepage.Total_Profit")}
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
                  {progress?.profitPercentage?.toFixed(2) || 0}%
                </span>
                <p
                  className="dashboard-sales-progress mb-0"
                  style={{
                    color: "rgb(83 213 83)",
                    backgroundColor: "#c5e6c5",
                  }}
                >
                  {Number(progress?.profitPercentage) >= 0 ? (
                    <IoMdArrowUp />
                  ) : (
                    <IoMdArrowDown />
                  )}
                  {Number(progress?.profitPercentage)?.toFixed(2) || 0}%{" "}
                </p>
              </div>
              <span style={{ fontSize: "12px" }}>
                {`${
                  Number(progress?.profitPercentage) >= 0
                    ? t("home_page.homepage.Increase")
                    : "Decrease"
                } 
                ${t("home_page.homepage.total_profit")} ${
                  Number(progress?.profitPercentage)?.toFixed(2) || 0
                }% ${t("home_page.homepage.from_last_month")}`}
              </span>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={6}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>{t("dashboard.title.sale_preview")}</h4>
                <Button
                  onClick={() => navigate("/usr/sales-invoice")}
                  size="small"
                  type="link"
                >
                  {t("home_page.homepage.View_All")}
                </Button>
              </div>
              <br />
              {graphData?.sdatasets?.length ? (
                <SalesGraph data={graphData?.sdatasets} />
              ) : (
                <LoadingBox />
              )}
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4>{t("dashboard.title.purchase_preview")}</h4>
                <Button
                  onClick={() => navigate("/usr/purchace-invoice")}
                  size="small"
                  type="link"
                >
                  {t("home_page.homepage.View_All")}
                </Button>
              </div>
              <br />
              {graphData?.pdatasets?.length ? (
                <PurchaseGraph data={graphData?.pdatasets || []} />
              ) : (
                <LoadingBox />
              )}
            </Card>
          </Col>
        </Row>
        <br />
        <Card>
          <OrderTable
            data={proformaInvoiceData}
            columns={columns}
            onItemSelect={() => {}}
            onPageChange={(p: any, t: any) => {}}
            title={t("dashboard.title.latest_order")}
          />
        </Card>

        <br />
      </Container>

      {openModal && (
        <VerificationModal
          user={user}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchUser={fetchUser}
          dataLoading={dataLoading}
        />
      )}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: "20px", // Increased from 18px
            }}
          >
            <PiWarningCircle size={24} color="#FAAD14" />
            <span>Subscription Expiring Soon</span>
          </div>
        }
        open={showSubscriptionModal}
        onCancel={() => setShowSubscriptionModal(false)}
        footer={[
          <Button
            key="later"
            onClick={() => setShowSubscriptionModal(false)}
            style={{ padding: "8px 20px", height: "auto" }} // Slightly larger button padding
          >
            Remind Me Later
          </Button>,
          <Button
            key="renew"
            type="primary"
            onClick={() => {
              setShowSubscriptionModal(false);
              navigate("/subscription");
            }}
            style={{
              padding: "8px 20px", // Slightly larger button padding
              height: "auto",
              backgroundColor: "#1890ff",
              borderColor: "#1890ff",
            }}
          >
            Renew Now
          </Button>,
        ]}
        style={{
          maxWidth: 500, // Increased from 420
          width: "100%", // Ensures it respects maxWidth but can be responsive
          borderRadius: 8,
        }}
        bodyStyle={{
          padding: "24px", // Increased from 20px 24px
          fontSize: "16px", // Optional: Increase body font size
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20, // Increased from 16
            lineHeight: 1.6, // Slightly more spacing between lines
          }}
        >
          <div
            style={{
              padding: 16, // Increased from 12
              backgroundColor: "#FFFBE6",
              borderRadius: 4,
              borderLeft: "3px solid #FAAD14",
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 500,
                color: "rgba(0, 0, 0, 0.85)",
                fontSize: "16px", // Optional: Match body font size
              }}
            >
              Your subscription will expire on{" "}
              <b>{subscriptionExpiryDate?.toLocaleDateString()}</b>.
            </p>
          </div>

          <p
            style={{
              margin: 0,
              color: "rgba(0, 0, 0, 0.65)",
              fontSize: "16px", // Optional: Match body font size
            }}
          >
            Renew now to avoid any interruption in service. Take a moment to
            ensure continuous access!
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Dashboard;
