import { Button } from 'antd'
import { Col, Container, Row } from 'react-bootstrap';
import rocket from "../../assets/images/Rocket.svg";
import './styles.scss'
import { useNavigate } from 'react-router-dom';

const SubscriptionExpiry = () => {
  const navigate = useNavigate()
  return (
    <Container fluid>
      <br />
      <Row  className='subscriptionExpiry-container'>
          <Col md={6} className='subscriptionExpiry-textContainer'>
        <div>
            <div className='website-HomeBoxtxt1'>Plan Has Been Expired!</div>
            <div className='FeaturesCard-text'>Your current plan has  expired. Renew the plan <br />
             to experience the features and services</div>
            <br />
            <Button type='primary' className="website-LoginBtn1" style={{height:45}} 
            onClick={()=>navigate('/subscription')}
            >Upgrade Plan</Button>
            </div>
          </Col>
          <Col md={6} className='subscriptionExpiry-textContainer' >
            <img src={rocket} alt='rocket' className='subscriptionExpiry-rocket-image'/>
          </Col>
        </Row>
     </Container>
  )
}

export default SubscriptionExpiry