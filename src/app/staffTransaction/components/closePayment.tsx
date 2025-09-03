import { Button, Card, DatePicker, Form, Input, Modal, Select, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { GET, POST } from '../../../utils/apiCalls'
import { useSelector } from 'react-redux'
import API from '../../../config/api'

const ClosePayment = (props: any) => {
  const [isCloseLoading, setIsCloseLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state: any) => state.User)

  const onFinish = async (values: any) => {
    try {
      setIsCloseLoading(true)
      let url = "StaffTransactions/add/pymentcreatetoledeger";
      let obj = {
        staffTransactions: props?.selectedRow,
        bankid: values?.ledger,
        paidmethod: values?.paidmethod,
        date: values?.sdate,
        reference: values?.reference,
        companyid:user?.companyInfo?.id
      }
      const response: any = await POST(url, obj)
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Payment closed successfully"
        })
        props?.setModalOpen(false)
        props.refresh()
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to close payment"
        })
      }
    } catch (error) {
      console.log(error)
      notification.error({
        message: "Server Error",
        description: "Failed to close payment! Please try again later"
      })
    } finally {
      setIsCloseLoading(false)
    }
  }

  return (
    <>
      <Modal
        open={props?.isOpen}
        onCancel={() => props?.setModalOpen(false)}
        width='50%'
        footer={false}
      >
        <Card>
          <Form onFinish={onFinish}>
            <Row>
              <Col className="Table-Txt" md={12}>
                Close Today's Transactions
              </Col>
              <br />
              <br />
              <hr />
              <Col md={6}>
                <div className="formItem">
                  <label className="formLabel">Bank</label>
                  <Form.Item
                    name="ledger"
                    rules={[
                      {
                        required: true,
                        message: "Please Select a bank",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder='choose a bank'
                      //onSearch={(val) => setSearchQurey(val)}
                      //showSearch
                      filterOption={false}
                    >
                      {props.bankList?.map((item: any) =>
                        <Select.Option value={item?.id} key={item?.id}>
                          {item?.laccount}
                        </Select.Option>
                      )
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">Paid Method</label>
                  <Form.Item
                    name="paidmethod"
                    rules={[
                      {
                        required: true,
                        message: "Please Select The Paid Method",
                      },
                    ]}
                  >
                    <Select size="large" placeholder='choose payment method'>
                      <Select.Option key={"cash"}>Cash</Select.Option>
                      <Select.Option key={"cheque"}>Cheque</Select.Option>
                      <Select.Option key={"electronic"}>Electronic</Select.Option>
                      <Select.Option key={"card"}>Credit/Debit Card</Select.Option>
                      <Select.Option key={"paypal"}>PayPal</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div className="formItem">
                  <label className="formLabel">Date</label>
                  <Form.Item
                    name="sdate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </div>

                <div className="formItem">
                  <label className="formLabel">Reference</label>
                  <Form.Item name="reference">
                    <Input size="large" placeholder='enter reference' />
                  </Form.Item>
                </div>
              </Col>
              <Col md={7}></Col>
              <Col md={5}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isCloseLoading}
                >
                  Close Transactions
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

      </Modal>
    </>
  )
}

export default ClosePayment