import { Form, Input } from 'antd'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

const BusinessCategoryForm = () => {
  return (
    <div>
    <Row>
      <Col md={12}>
        <div className="formItem">
          <label className="formLabel">Business Category</label>
          <Form.Item
            name="category"
            rules={[
              {
                required: true,
                message: "Please enter your category",
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

export default BusinessCategoryForm