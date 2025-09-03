import { Button, DatePicker, Form, Input, Modal, Select, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { POST } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";

const StatusModal = (props: any) => {
    const [isLoading,setIsLoading] = useState(false);
    const {user} = useSelector((state:any)=>state.User);
    const defaultBank = user?.companyInfo?.bankInfo?.id;
  const onFinish = async (values: any) => {
    try {
        setIsLoading(true)
        const url = `stripe_log/paymentApproval/${props?.data?.id}`;
        let obj = {
            status:values?.status,
            bankid:defaultBank,
            paidmethod:'stripe'
        }
        const response :any = await POST(url,obj);
        if(response.status){
          props?.setIsOpen(false);
          props.fetchStripeLog()
          notification.success({
            message:'Success',
            description:"Payment aprroved successfully"
          })
        }else{
          notification.error({
            message:'Failed',
            description:"Failed to approve payment aprroved"
          })
        }
    } catch (error) {
      console.log(error);
      notification.error({
        message:'Server Error',
        description:"Failed to approve payment aprroved!! Please try again later"
      })
    }finally{
        setIsLoading(false)
    }
  };

  const initialValues = {
    invoiceNo: props?.data?.invoiceNo,
    stripeId: props?.data?.stripeId,
    date: dayjs(props?.data?.date),
    amount: props?.data?.amount,
    status: props?.data?.status,
  };
  return (
    <Container>
      <Modal
        title={
          <div className="dashboard-info-modal">
            <span>Payment Approval Form</span>
          </div>
        }
        open={props?.isOpen}
        closable={false}
        width={800}
        footer={false}
        maskClosable={false}
      >
          <hr />
        <Form onFinish={onFinish} initialValues={initialValues}>
          <Row>
            <Col md={6}>
              <label className="formLabel">Invoice No</label>
              <Form.Item
                name="invoiceNo"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Business name is required" },
                ]}
              >
                <Input placeholder="Invoice no" readOnly size="large" />
              </Form.Item>

              <label className="formLabel">Transaction ID</label>
              <Form.Item name="stripeId" style={{ marginBottom: 10 }}>
                <Input placeholder="Transaction ID" size="large" readOnly/>
              </Form.Item>
            </Col>

            <Col md={6}>
              <label className="formLabel">Date</label>
              <Form.Item name="date" style={{ marginBottom: 10 }}>
                <DatePicker
                  format={"YYYY-MM-DD"}
                  style={{ width: "100%" }}
                  size="large"
                />
              </Form.Item>

              <label className="formLabel">Amount</label>
              <Form.Item name="amount" style={{ marginBottom: 10 }}>
                <Input placeholder="amount" size="large" readOnly/>
              </Form.Item>

              <label className="formLabel">Status</label>
              <Form.Item name="status" style={{ marginBottom: 10 }}>
                <Select size="large">
                    <Select.Option  key='pending' >Pending</Select.Option>
                    <Select.Option key='approved'>Approved</Select.Option>
                    <Select.Option key='rejected'>Rejected</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <br />

          <Row>
            <Col md={6} />
            <Col md={3}>
            <Button
                size="large"
                type="default"
                style={{
                  height: 45,
                  fontWeight: "600",
                  width: "100%",
                  display: "block",
                  marginTop: 18,
                }}
                onClick={()=>props?.setIsOpen(false)}
              >
                Close
              </Button>
              </Col>
              <Col md={3}>
              <Button
                size="large"
                type="primary"
                loading={isLoading}
                style={{
                  height: 45,
                  fontWeight: "600",
                  width: "100%",
                  display: "block",
                  marginTop: 18,
                }}
                htmlType="submit"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Container>
  );
};

export default StatusModal;
