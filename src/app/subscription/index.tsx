import { Button, Input, Radio, Space, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GrFormAdd } from "react-icons/gr";
import { TiMinus } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import compnayImage from "../../assets/images/company_img.webp";
import counterImage from "../../assets/images/counter_img.webp";
import API from "../../config/api";
import { GET, POST } from "../../utils/apiCalls";
import PaymentScreenModal from "../StripePayment";
import CompanyHeader from "../companyList/components/header";
import "./styles.scss";
import moment from "moment";
import { storePaystackData } from "../../redux/slices/paystackSlice";

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.User);
  const [pricingDetails, setPricingDetails] = useState<any>();
  const [period, setPeriod] = useState(1);
  const [customPeriod, setCustomPeriod] = useState(2);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [planDetails, setPlanDetails] = useState<any>();
  const [company, setCompany] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isRetail, setIsRetail] = useState<boolean>();
  const [isSoleTrader, setIsSoleTrader] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [affiliationCode, setAffiliationCode] = useState(
    user?.isAffiliateCodeUsed ? "" : user?.affiliationCode
  );
  const [clientSecret, setClientSecret] = useState("");
  const [PaymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  let currency = user?.countryInfo?.currencycode;

  const addPayment = async () => {
    try {
      let totalPrice = Number(pricingDetails?.totalPrice)?.toFixed(2);
      let totalPriceInSubcurrency = Math.round(Number(totalPrice) * 100);
      const res: any = await POST(API.PAYMENT_CREATE, {
        amount: totalPriceInSubcurrency,
        currency: currency?.toLowerCase(),
        adminid: user?.id,
      });
      console.log("David 2 --->", res);

      setClientSecret(res?.client_secret);
      if (res?.statusCode !== 503 && res?.statusCode !== 500) {
        setOpenModal(true);
      } else {
        notification.warning({
          message: "Error",
          description: res.message,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const initializePayment = async () => {
    try {
      const totalPrice = Number(pricingDetails?.totalPrice)?.toFixed(2);
      const obj = {
        adminid: user?.id,
        total: pricingDetails?.totalPrice,
        company: company,
        currency: currency,
        counter: counter,
        soleTrader: isSoleTrader,
        retailXpress: isRetail,
        period: isCustomSelected ? customPeriod : period,
        affiliationCode,
      };
      dispatch(storePaystackData(obj));
      const res: any = await POST(API.PAYSTACK_PAYMENT, {
        amount: totalPrice,
        email: user?.email,
        callback_url: API.WEBURL + "paystack",
      });

      console.log("David 1 --->", res);

      if (res?.status) {
        const authorizationUrl = res?.data?.authorization_url;
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
        }
      }
    } catch (error) {
      console.log("--------- error --", error);
      console.error("Error initializing payment:", error);
    }
  };

  const card = [
    {
      id: 1,
      head: <div>Multiple Companies</div>,
      image: compnayImage,
      para: "You can access all the features with multiple companies",
    },
    {
      id: 2,
      head: <div>Multiple Retail Counters</div>,
      image: counterImage,
      para: "You can access all the features with multiple counters",
    },
  ];

  useEffect(() => {
    fetchSbscriptionDetails();
  }, []);

  const fetchSbscriptionDetails = async () => {
    try {
      setIsLoading(true);
      let url = API.USER_SUBSCRIBED_PLAN;
      const response: any = await GET(url, null);
      if (response?.status) {
        setPlanDetails(response?.data);
        setCompany(response?.data?.company);

        // Handle period initialization properly
        const currentPeriod = response?.data?.period;
        if ([1, 12, 24].includes(currentPeriod)) {
          setPeriod(currentPeriod);
          setIsCustomSelected(false);
        } else {
          // If it's a custom period
          setCustomPeriod(currentPeriod || 2);
          setPeriod(currentPeriod || 2);
          setIsCustomSelected(true);
        }

        setCounter(response?.data?.counter);
        setIsRetail(response?.data?.retailXpressWithTaxgo);
        setIsSoleTrader(response?.data?.soleTrader);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async () => {
    try {
      // Use the effective period (custom period if custom is selected, otherwise standard period)
      const effectivePeriod = isCustomSelected ? customPeriod : period;

      let url =
        API.GET_PRICING +
        `?company=${company}&counter=${counter}&retailXpressWithTaxgo=${isRetail}&soleTrader=${isSoleTrader}&period=${effectivePeriod}&currencyCode=${currency}`;

      const response: any = await GET(url, null);
      if (response.status) {
        console.log("responseresponse", response);
        setPricingDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle period selection
  const handlePeriodChange = (selectedPeriod: number) => {
    setIsCustomSelected(false);
    setPeriod(selectedPeriod);
  };

  // Handle custom period selection
  const handleCustomPeriodSelect = () => {
    setIsCustomSelected(true);
    setPeriod(customPeriod);
  };

  // Handle custom period value change
  const handleCustomPeriodChange = (newCustomPeriod: number) => {
    setCustomPeriod(newCustomPeriod);
    if (isCustomSelected) {
      setPeriod(newCustomPeriod);
    }
  };

  useEffect(() => {
    handleChange();
  }, [period, company, counter, isRetail, isSoleTrader]);

  // Get the display period for UI
  const getDisplayPeriod = () => {
    if (isCustomSelected) {
      return customPeriod;
    }
    return period;
  };

  return (
    <div className="subscription-mainContainer">
      <CompanyHeader />
      <Container>
        <Row>
          <Col md={4} style={{ padding: 40 }}>
            <div
              className={
                new Date(planDetails?.subscriptionExpiry) <= new Date()
                  ? "subscription-plancontainer"
                  : "subscription-activePlancontainer"
              }
            >
              <span>
                {new Date(planDetails?.subscriptionExpiry) <= new Date()
                  ? "Plan Expired!"
                  : "Plan Active!"}
              </span>
              <p>
                {new Date(planDetails?.subscriptionExpiry) <= new Date()
                  ? "Your free plan has ended. Purchase a new plan to continue using Tax GO and its services."
                  : `Your plan is currently active. Choose the best add-ons to elevate your business.
                  Plan will expire on ${moment(
                    planDetails?.subscriptionExpiry
                  ).format("DD-MM-YYYY")}`}
              </p>
            </div>

            <div className="subscription-planNameContainer">
              <div className="subscription-planTextContainer">
                <span>Company</span>
                {new Date(planDetails?.subscriptionExpiry) <= new Date() ? (
                  <span style={{ color: "red" }}>Locked</span>
                ) : (
                  <span style={{ color: "#34b628" }}>Available</span>
                )}
              </div>
              <div className="subscription-planName">
                {planDetails?.company} Company
              </div>
            </div>

            <div className="subscription-planNameContainer">
              <div className="subscription-planTextContainer">
                <span>Retail Counter</span>
                {new Date(planDetails?.subscriptionExpiry) <= new Date() ? (
                  <span style={{ color: "red" }}>Locked</span>
                ) : (
                  <span style={{ color: "#34b628" }}>Available</span>
                )}
              </div>
              <div className="subscription-planName">
                {planDetails?.counter} Counter
              </div>
            </div>

            <div className="subscription-planNameContainer">
              <div className="subscription-planTextContainer">
                <span>Retail Xpress</span>
                {new Date(planDetails?.subscriptionExpiry) <= new Date() ? (
                  <span style={{ color: "red" }}>Locked</span>
                ) : planDetails?.counter > 0 ? (
                  <span style={{ color: "#34b628" }}>Available</span>
                ) : (
                  <span style={{ color: "#34b628" }}>Not Subscribed</span>
                )}
              </div>
              <div className="subscription-planName">Full POS Access</div>
            </div>
          </Col>

          <Col md={4} style={{ background: "#ECECEF", padding: 40 }}>
            <Row className="subscriptionScreen-totalAmountContainer">
              <Col md={6} className="totalAmountText">
                Total Amount <br />
                in {user?.countryInfo?.currencycode}
              </Col>
              <Col md={6} className="totalAmountContainer">
                <span>{user?.countryInfo?.symbol}</span>{" "}
                <span>{pricingDetails?.totalPrice?.toFixed(2)}</span>
              </Col>
            </Row>

            <Row className="subscriptionScreen-companyContainer">
              <Col md={12}>
                <div className="textCompanyText">Number of Companies</div>
                <div className="descriptionText">
                  You have the flexibility to manage the accounting for an
                  unlimited number of companies, ensuring that all your business
                  needs are covered effectively.
                </div>
              </Col>
              <Col md={8}>
                <Space.Compact block className="count-container">
                  <div className="subscription-countBox">
                    <TiMinus
                      size={28}
                      onClick={() => setCompany(Math.max(company - 1, 1))}
                      style={{ cursor: "pointer" }}
                    />
                  </div>{" "}
                  <span className="subscription-companyCount">{company}</span>{" "}
                  <div className="subscription-countBox">
                    <GrFormAdd
                      size={30}
                      onClick={() => setCompany(company + 1)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </Space.Compact>
              </Col>
              <Col md={4} className="totalAmountContainer">
                <span style={{ fontSize: 16 }}>
                  {user?.countryInfo?.symbol}
                </span>
                {pricingDetails?.company?.price?.toFixed(2)}
              </Col>
            </Row>

            <Row className="subscriptionScreen-companyContainer">
              <Col md={12}>
                <div className="textCompanyText">Number of Counters</div>
                <div className="descriptionText">
                  You can effortlessly add and manage accounting for any number
                  of counters with POS application access, allowing you to
                  efficiently oversee all sales points and streamline your
                  business operations
                </div>
              </Col>
              <Col md={8}>
                <Space.Compact block className="count-container">
                  <div className="subscription-countBox">
                    <TiMinus
                      size={28}
                      onClick={() => setCounter(Math.max(counter - 1, 0))}
                      style={{ cursor: "pointer" }}
                    />
                  </div>{" "}
                  <span className="subscription-companyCount">{counter}</span>{" "}
                  <div className="subscription-countBox">
                    <GrFormAdd
                      size={30}
                      onClick={() => setCounter(counter + 1)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </Space.Compact>
              </Col>
              <Col md={4} className="totalAmountContainer">
                <span style={{ fontSize: 16 }}>
                  {user?.countryInfo?.symbol}
                </span>
                {pricingDetails?.counter?.price?.toFixed(2)}
              </Col>
            </Row>

            {/* Period Selection */}
            <div style={{ marginTop: 20 }}>
              <div className="textCompanyText" style={{ marginBottom: 10 }}>
                Subscription Period
              </div>

              <Radio.Group
                value={isCustomSelected ? "custom" : period}
                style={{ width: "100%", marginBottom: 10 }}
                buttonStyle="solid"
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    handleCustomPeriodSelect();
                  } else {
                    handlePeriodChange(Number(e.target.value));
                  }
                }}
              >
                <Radio.Button value={1} style={{ width: "25%", height: 40 }}>
                  1 Mon
                </Radio.Button>
                <Radio.Button value={12} style={{ width: "25%", height: 40 }}>
                  12 Mon
                </Radio.Button>
                <Radio.Button value={24} style={{ width: "25%", height: 40 }}>
                  24 Mon
                </Radio.Button>
                <Radio.Button
                  value="custom"
                  style={{ width: "25%", height: 40 }}
                >
                  Custom
                </Radio.Button>
              </Radio.Group>

              {/* Custom Period Input */}
              {isCustomSelected && (
                <Row
                  className="subscriptionScreen-companyContainer"
                  style={{ marginTop: 15, padding: 5 }}
                >
                  <Col md={12}>
                    <div className="textCompanyText">
                      Custom Period (Months)
                    </div>
                    <div className="descriptionText">
                      Select your preferred subscription duration
                    </div>
                  </Col>
                  <Col md={8}>
                    <Space.Compact block className="count-container">
                      <div className="subscription-countBox">
                        <TiMinus
                          size={28}
                          onClick={() =>
                            handleCustomPeriodChange(
                              Math.max(customPeriod - 1, 1)
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <span className="subscription-companyCount">
                        {customPeriod}
                      </span>
                      <div className="subscription-countBox">
                        <GrFormAdd
                          size={30}
                          onClick={() =>
                            handleCustomPeriodChange(customPeriod + 1)
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </Space.Compact>
                  </Col>
                  <Col md={4} className="totalAmountContainer">
                    <span style={{ fontSize: 12, color: "#666" }}>
                      {customPeriod} month{customPeriod !== 1 ? "s" : ""}
                    </span>
                  </Col>
                </Row>
              )}
            </div>

            {/* Affiliation Code */}
            {!user?.isAffiliateCodeUsed && (
              <div style={{ marginTop: 20 }}>
                <div className="formLabel">Affiliation Code</div>
                <Input
                  placeholder="Enter your Code"
                  onChange={(e) => setAffiliationCode(e.target.value)}
                  value={affiliationCode}
                  style={{ marginTop: 5 }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <Row style={{ marginTop: 20 }}>
              <Col md={6}>
                <Button
                  style={{ width: "100%", height: 45 }}
                  onClick={() => navigate(-1)}
                  loading={isLoading}
                >
                  Close
                </Button>
              </Col>
              <Col md={6}>
                <Button
                  type="primary"
                  style={{ width: "100%", height: 45 }}
                  onClick={() => {
                    if (user?.countryInfo?.currencycode === "NGN") {
                      initializePayment();
                    } else {
                      addPayment();
                    }
                  }}
                  loading={isLoading}
                >
                  Proceed to Payment
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md={4} style={{ padding: 40 }}>
            <h4
              className="pricing-miniCard-head1"
              style={{ textAlign: "start", padding: 0 }}
            >
              What's included When You Upgrade...
            </h4>

            <Row justify="center" gutter={[32, 32]}>
              {card?.map((item: any) => (
                <Col md={12} className="pricing-card3" key={item.id}>
                  <div
                    className="pricing-miniCard-head2"
                    style={{ marginBottom: 4 }}
                  >
                    {item?.head}
                  </div>
                  <img
                    src={item?.image}
                    alt=""
                    className="pricing-minicard-image"
                  />
                  <div className="formLabel" style={{ marginTop: 4 }}>
                    {item?.para}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      {openModal && (
        <PaymentScreenModal
          totalPrice={pricingDetails?.totalPrice}
          data={{
            adminid: user?.id,
            total: pricingDetails?.totalPrice,
            company: company,
            currency: currency,
            counter: counter,
            soleTrader: isSoleTrader,
            retailXpress: isRetail,
            period: isCustomSelected ? customPeriod : period,
            affiliationCode,
          }}
          openModal={openModal}
          clientSecret={clientSecret}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;
