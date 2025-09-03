import { Form, Input } from 'antd'
import { Col, Row } from 'react-bootstrap'

const HsnCodeForm = () => {
  return (
    <div>
    <Row>
      <Col md={12}>
        <div className="formItem">
          <label className="formLabel">HSN/SAC</label>
          <Form.Item
            name="hsn_code"
            rules={[
              {
                required: true,
                message: "Please enter your code",
              },
            ]}
          >
            <Input type='text'/>
          </Form.Item>
        </div>
      </Col>
      <Col md={12}>
        <div className="formItem">
          <label className="formLabel">Description</label>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter your description",
              },
            ]}
          >
            <Input type='text'/>
          </Form.Item>
        </div>
      </Col>
    </Row>
  </div>
  )
}

export default HsnCodeForm