import { Typography, Button } from "antd";
import "../styles.scss";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const PaymentSuccess = () => {
  const navigation = useNavigate();
  return (
    <div className="payment-success-container">
      <div className="payment-circle">
        <FaCheck color="#FFFFFF" size={45} />
      </div>
      <Typography.Title level={2} className="success-text">
        Payment Successful!
      </Typography.Title>
      <Typography.Paragraph className="success-paragraph">
        Thank you for your purchase. Enjoy using Tax GO and its services 
      </Typography.Paragraph>
      <Button type="primary" onClick={() => navigation("/company")}>
        Back to Home
      </Button>
    </div>
  )
};
export default PaymentSuccess;
