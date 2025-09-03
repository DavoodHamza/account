import { Button, Card, DatePicker, Form, Input, Modal, Select, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GET, POST, PUT } from '../../../utils/apiCalls';

const ReceiptModal = (props: any) => {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    try {
      setIsBtnLoading(true)
      let url = props?.formType === 'create' ? "StaffTransactions/add" : `StaffTransactions/update/${props?.id}`

      const obj = {
        adminid: user?.id,
        ledger: values?.ledger,
        ledgercategory: 1,
        type: props?.type === "receipt" ? "Other Receipt" : "Other Payment",
        usertype: 'staff',
        paid_amount: Number(values?.amount),
        total: Number(values?.amount),
        outstanding: 0,
        staffid: user?.staff?.id,
        status: 'open',
        paid_status: 2,
        customerid: values?.ledger
      }

      const response: any = props?.formType === 'create' ? await POST(url, obj) : await PUT(url, obj)
      if (response.status) {
        notification.success({
          message: "Success",
          description: `${props?.type === "receipt" ? "Receipt" : "Payment"} ${props?.formType === 'create' ? "created" : "updated"} successfully`
        })
        props?.setModalOpen(false)
        props?.refresh()
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${props?.formType === 'create' ? "create" : "update"} ${props?.type === "receipt" ? "Receipt" : "Payment"} `
        })
      }


    } catch (error) {
      console.log(error)
      notification.error({
        message: "Server Error",
        description: `Failed to ${props?.formType === 'create' ? "create" : "update"} ${props?.type === "receipt" ? "Receipt" : "Payment"}!!  Please try again later `
      })
    } finally {
      setIsBtnLoading(false)
    }
  }

  const fetchInitialValues = async () => {
    try {
      setIsLoading(true)
      let url = `StaffTransactions/getStaffTransaction/${props?.id}`;
      const { data }: any = await GET(url, null);
      form.setFieldsValue({
        ledger: data?.ledger,
        amount: data?.paid_amount,
        reference: data?.reference

      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    props?.formType === "edit" && fetchInitialValues()
  }, [])


  return (
    <>
      <Modal
        open={props?.isOpen}
        onCancel={()=>props?.setModalOpen(false)}
        width='50%'
        footer={false}
      >
        <Card>
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {props?.type === "receipt" ? "Add/Update Receipt" : "Add/Update Payment"}
              </Col>
              <Col md={12}>
                Manage your non invoice receipts
                - payment with
                ledgers
              </Col>
              <br />
              <br />
              <hr />
              <Col md={6}>
                <div className="formItem">
                  <label className="formLabel">LEDGER</label>
                  <Form.Item
                    name="ledger"
                    rules={[
                      {
                        required: true,
                        message: "Please Select a ledger",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      //onSearch={(val) => setSearchQurey(val)}
                      //showSearch
                      filterOption={false}
                    >
                      {props.ledgerList?.map((item: any) =>
                        <Select.Option value={item?.id} key={item?.id}>
                          {item?.laccount}
                        </Select.Option>
                      )
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">AMOUNT PAID *</label>
                  <Form.Item
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter amount",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: "100%" }}
                      size="large"
                      min='0'
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div className="formItem">
                  <label className="formLabel">RECEIPT DATE</label>
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
                  <label className="formLabel">REFERENCE</label>
                  <Form.Item name="reference">
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={8}></Col>
              <Col md={4}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isBtnLoading}
                >
                  SAVE
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

      </Modal>
    </>
  )
}

export default ReceiptModal