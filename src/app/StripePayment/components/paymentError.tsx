import { Button } from 'antd'
import { TbXboxX } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const PaymentError = () => {
    const navigate = useNavigate();
  return (
    <div className="updateEmail-Box1">
    <div className="updateEmail-Box2">
          <TbXboxX color="red" size={50} />
          <p>Payment successfull but failed update plan.!</p>
          <Button type="primary" onClick={() => navigate("/company")}>
        Back to Home
      </Button>
    </div>
      <br />
  
  </div>
  )
}

export default PaymentError