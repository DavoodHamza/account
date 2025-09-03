import { Button, Form, Input, Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import countries from "../../../utils/CountriesWithStates.json";
import { Col } from "react-bootstrap";
import API from "../../../config/api";
import { POST } from "../../../utils/apiCalls";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../app/StripePayment/components/checkoutForm";

const BankDetailsForm = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [clientSecret, setClientSecret] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const stripePromise = loadStripe(
    "pk_live_51Ouwd52LpumERmJpRj4GxzJEoszU2ejwH3EoTD1nZCnyGoanOdzNq3yamWvdntUwhb2nRskxi51I9VFUKohTPlAz00MuOOZt1g"
    // "pk_test_51JpFCRSHV8lwiYQsQVJI5CG02c4OBsM5cD3VzBNhj2cEbm3NRbXG6uqlW8JtjVObYE8Nq0FQZysceQXvYVAucTRL00Wv7kGDF5"
  );
  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret: clientSecret,
    appearance,
  };
  let data = {
    currency: props?.currency,
  };
  useEffect(() => {
    form.setFieldsValue({
      countryId: props?.country,
      currency: props?.currency,
      rewardamount: props?.rewardamount,
    });
  }, []);
  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      let totalPrice = Number(props?.rewardamount)?.toFixed(2);
      let totalPriceInSubcurrency = Math.round(Number(totalPrice) * 100);
      const response: any = await POST(API.PAYMENT_CREATE, {
        amount: totalPriceInSubcurrency,
        currency: props?.currency?.toLowerCase(),
      });
      setClientSecret(response?.client_secret);
      if (response?.statusCode !== 503) {
        setOpenModal(true);
        props.close();
      } else {
        notification.error({
          message: "Failed",
          description: "Payment Failed",
        });
      }
    } catch (error) {
      console.error("Failed to send money:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Modal
        open={props?.open}
        closable={true}
        width={400}
        footer={false}
        maskClosable={false}
        onCancel={props?.close}
        title={`${props?.type === "sendMoney" ? "Send" : "Recieve"} Money To`}
      >
        <Col xs={12} md={12}>
          <Form form={form} onFinish={onFinish} scrollToFirstError>
            <label>Account Number</label>
            <Form.Item
              name="accountNumber"
              rules={[{ required: true, message: "Enter Account Number" }]}
            >
              <Input placeholder={`Enter  Account Number`} size="large" />
            </Form.Item>
            <label>Account Holder Name</label>
            <Form.Item
              name="accountHolderName"
              rules={[{ required: true, message: "Enter Account Holder Name" }]}
            >
              <Input placeholder={`Enter Account Holder Name`} size="large" />
            </Form.Item>
            <label>Country</label>

            <Form.Item
              name="countryId"
              rules={[{ required: true, message: "" }]}
            >
              <Input readOnly size="large" />
            </Form.Item>
            <label>Currency</label>
            <Form.Item
              name="currency"
              rules={[{ required: true, message: "" }]}
            >
              <Input size="large" readOnly />
            </Form.Item>

            <label>Amount</label>
            <Form.Item
              name="rewardamount"
              rules={[{ required: true, message: "" }]}
            >
              <Input readOnly size="large" suffix={props?.currencyCode} />
            </Form.Item>
            <Col xs={12}>
              <div className="d-flex justify-content-between gap-3">
                <Button
                  disabled={isLoading}
                  block
                  size="large"
                  onClick={props?.close}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isLoading}
                >
                  Proceed to Payment
                </Button>
              </div>{" "}
            </Col>
          </Form>
        </Col>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm closeModal={props?.setOpenModal} data={data} />
          </Elements>
        )}
      </Modal>
    </div>
  );
};

export default BankDetailsForm;
