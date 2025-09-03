import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/checkoutForm";
import { Modal } from "antd";
const stripePromise = loadStripe(
  "pk_live_51Ouwd52LpumERmJpRj4GxzJEoszU2ejwH3EoTD1nZCnyGoanOdzNq3yamWvdntUwhb2nRskxi51I9VFUKohTPlAz00MuOOZt1g"
  // "pk_test_51JpFCRSHV8lwiYQsQVJI5CG02c4OBsM5cD3VzBNhj2cEbm3NRbXG6uqlW8JtjVObYE8Nq0FQZysceQXvYVAucTRL00Wv7kGDF5"
);
const PaymentScreenModal = (props: any) => {
  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret: props?.clientSecret,
    appearance,
  };
  return (
    <>
      <Modal
        title={
          <div className="dashboard-info-modal" style={{ fontSize: "20px" }}>
            <span>Enter your card details</span>
          </div>
        }
        onCancel={() => props?.setOpenModal(false)}
        open={props?.openModal}
        footer={false}
        maskClosable={false}
        width={550}
        centered
      >
        <hr />
        {props?.clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm closeModal={props?.setOpenModal} data={props?.data} />
          </Elements>
        )}
      </Modal>
    </>
  );
};
export default PaymentScreenModal;
