import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import "../styles.scss";
import { Col, Row } from "react-bootstrap";
import { POST } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { useNavigate } from "react-router-dom";
const StripeForm = (props: any) => {
  const navigate = useNavigate();
  const stripe: any = useStripe();
  const elements: any = useElements();
  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(false);
  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {});
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      notification.error({
        message: "Error",
        description:
          "Failed to load payment option.! Please contact system admin",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          //return_url: `http://localhost:3000/payment-success?data=${encodedData}`,
          // return_url: `https://taxgov2.bairuhatech.com/payment-success?data=${encodedData}`,
        },
        redirect: "if_required",
      });
      if (error) {
        // console.error(error);
        setMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        let obj = {
          stripeId: paymentIntent?.id,
          status: paymentIntent?.status,
        //   period: props?.data?.period,
          adminid: props?.data?.adminid,
          amount: paymentIntent?.amount,
          company: props?.data?.company,
          counter: props?.data?.counter,
          retailXpress: props?.data?.retailXpress,
          soleTrader:false,
          addOn:true
        };
        let url = API.SUBSCRIPTION_PAYMENT;
        const response: any = await POST(url, obj);
        if (response.status) {
          navigate("/payment-success");
        } else {
          notification.error({
            message: "Error",
            description:
              "Payment successfull but failed update plan.! Please contact system admin",
          });
          navigate("/payment-failed");
        }
      } else {
        setMessage("An unexpected error occured..Please try again later..!");
      }
      setIsLoading(false);
    } catch (error) {
      setMessage("Payment Failed! Please try again later..!");
      setIsLoading(false);
    }
  };
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Row>
        <Col md={6}>
          <Button
            type="default"
            onClick={() => props?.setIsOpen(false)}
            style={{ width: "100%", marginTop: 20, height: 45 }}
          >
            Cancel
          </Button>
        </Col>
        <Col md={6}>
          <Button
            htmlType="submit"
            disabled={isLoading || !stripe || !elements}
            loading={isLoading}
            type="primary"
            style={{ width: "100%", marginTop: 20, height: 45 }}
          >
            Pay now
          </Button>
        </Col>
      </Row>
      <br />
      {/* {message && <Alert message={message} type="error" />} */}
    </form>
  );
};
export default StripeForm;
