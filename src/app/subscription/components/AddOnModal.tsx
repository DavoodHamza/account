import {
  Button,
  Card,
  Modal,
  Space,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GrFormAdd } from "react-icons/gr";
import { TiMinus } from "react-icons/ti";
import { useSelector, useDispatch } from "react-redux";
import API from "../../../config/api";
import { GET, POST } from "../../../utils/apiCalls";
import "../styles.scss";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "./stripeForm";

import { storePaystackData } from "../../../redux/slices/paystackSlice";

const stripePromise = loadStripe(
  // "pk_test_51JpFCRSHV8lwiYQsQVJI5CG02c4OBsM5cD3VzBNhj2cEbm3NRbXG6uqlW8JtjVObYE8Nq0FQZysceQXvYVAucTRL00Wv7kGDF5"
  "pk_live_51Ouwd52LpumERmJpRj4GxzJEoszU2ejwH3EoTD1nZCnyGoanOdzNq3yamWvdntUwhb2nRskxi51I9VFUKohTPlAz00MuOOZt1g"
);

const AddOnModal = (props: any) => {
  const [pricingDetails, setPricingDetails] = useState<any>();
  const [company, setCompany] = useState(1);
  const [counter, setCounter] = useState(1);
  const [isRetail, setIsRetail] = useState(props?.planDetails?.retailExpress);
  const [isSoleTrader, setIsSoleTrader] = useState(
    props?.planDetails?.soleTrader
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useDispatch();
  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret: clientSecret,
    appearance,
  };

  let currency = user?.countryInfo?.currencycode;

  const initializePayment = async () => {
    try {
      const totalPrice = Number(pricingDetails?.totalPrice)?.toFixed(2);
      const obj = {
        adminid: user?.id,
        total: pricingDetails?.totalPrice,
        company: company,
        counter: counter,
        soleTrader: isSoleTrader,
        retailXpress: props?.planDetails?.retailExpress ? false : isRetail,
        currency: currency,
        addOn: true,
        retailXpressWithTaxgo: props?.planDetails?.retailXpressWithTaxgo,
      };
      dispatch(storePaystackData(obj));
      const res: any = await POST(API.PAYSTACK_PAYMENT, {
        amount: totalPrice,
        email: user?.email,
        callback_url: API.WEBURL + "paystack",
      });

      if (res?.status) {
        const authorizationUrl = res?.data?.authorization_url;
        if (authorizationUrl) {
          // Open the Paystack payment page
          window.location.href = authorizationUrl;
        }
      }
    } catch (error) {
      console.log(error);
      console.error("Error initializing payment:", error);
    }
  };

  const addPayment = async () => {
    try {
      setIsLoading(true);
      let totalAmount = Number(pricingDetails?.totalPrice) * 100;
      let total_amount = totalAmount.toFixed(0);
      console.log("totalAmount==>",totalAmount)
      const res: any = await POST(API.PAYMENT_CREATE, {
        amount: Number(total_amount),
        currency: currency?.toLowerCase(),
        adminid: user?.id,
      });
      setClientSecret(res.client_secret);
      if (res.statusCode === 503 || res.statusCode === 500) {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async () => {
    try {
      let url =
        API.GET_PRICING +
        `?company=${company}&counter=${counter}&retailExpress=${isRetail}&soleTrader=${false}&addon=${true}&currencyCode=${currency}`;
      const response: any = await GET(url, null);
      if (response.status) {
        setPricingDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleChange();
  }, [company, counter, isRetail, isSoleTrader]);

  return (
    <Container>
      <Modal
        title={
          <div className="subscription-headtext">
            Enhance Your Plan with Add-ons <hr />
          </div>
        }
        open={props?.isOpen}
        closable={false}
        footer={false}
        centered
        width={clientSecret !== "" ? "1100px" : "550px"}
      >
        <Row>
          <Col md={clientSecret !== "" ? 6 : 12}>
            <Card style={{ background: "#ECECEF", padding: 20 }}>
              <Row className="subscriptionScreen-totalAmountContainer">
                <Col md={6} className="totalAmountText">
                  Total Amount <br />
                  in {currency}
                </Col>
                <Col md={6} className="totalAmountContainer">
                  <span>
                    {user?.countryInfo?.symbol}{" "}
                    {pricingDetails?.totalPrice?.toFixed(2)}
                  </span>
                </Col>
              </Row>

              {/* company */}
              <Row className="subscriptionScreen-companyContainer">
                <Col md={6} className="textCompanyText">
                  <span>Number of Companies</span>
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
                <Col
                  md={6}
                  className="totalAmountContainer"
                  style={{ textAlign: "end" }}
                >
                  {user?.countryInfo?.symbol}{" "}
                  {pricingDetails?.company?.price?.toFixed(2)}
                </Col>
              </Row>

              {/* counter */}
              <Row className="subscriptionScreen-companyContainer">
                <Col md={6} className="textCompanyText">
                  <span>Number of Counters</span>
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
                <Col
                  md={6}
                  className="totalAmountContainer"
                  style={{ textAlign: "end" }}
                >
                  {user?.countryInfo?.symbol}{" "}
                  {pricingDetails?.counter?.price?.toFixed(2)}
                </Col>
              </Row>

              {clientSecret === "" ? (
                <Row>
                  <Col md={6}>
                    <Button
                      type="default"
                      onClick={() => props?.setIsOpen(false)}
                      style={{ height: 45, width: "100%" }}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (user?.countryInfo?.currencycode === "NGN") {
                          initializePayment();
                        } else {
                          addPayment();
                        }
                      }}
                      loading={isLoading}
                      style={{ height: 45, width: "100%" }}
                    >
                      Proceed to Payment
                    </Button>
                  </Col>
                </Row>
              ) : null}
            </Card>
          </Col>
          {clientSecret && (
            <Col md={6}>
              <h5>Let’s Make Payment</h5>
              <p>
                To get your add on feature, input your card details to make
                payment. You will be redirected to your banks authorization
                page.{" "}
              </p>
              <br />
              <Elements options={options} stripe={stripePromise}>
                <StripeForm
                  data={{
                    adminid: user?.id,
                    total: pricingDetails?.totalPrice,
                    company: company,
                    counter: counter,
                    soleTrader: isSoleTrader,
                    retailXpress: props?.planDetails?.retailExpress
                      ? false
                      : isRetail,
                  }}
                  setIsOpen={props?.setIsOpen}
                />
              </Elements>
            </Col>
          )}
        </Row>
      </Modal>
    </Container>
  );
};

export default AddOnModal;
