import { Button, DatePicker, Form, Input, Radio, Select, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";

function RetailExpressPaymentmodal(props: any) {
  const { user } = useSelector((state: any) => state.User);
  const [form] = useForm();

  const [isLoading, setIsLoading] = useState(false);

  let choosedBank: any = {}

  useEffect(() => {
    if (props?.amount) {
      choosedBank = props?.bankList?.find(
        (item: any) => item?.list?.nominalcode === "1200"
      );
      if (choosedBank) {
        form.setFieldsValue({
          paymentBank: 'cash',
          amoutToPaid: Number(props?.amount) || 0,
          payReturn: 0,
          amout: props?.amount || 0,
        });
      }
    }
  }, []);


  function handleValuesChange(val: any) {
    if (val?.paymentBank) {
      choosedBank = props?.bankList?.find(
        (item: any) => item?.list?.nominalcode == (val?.paymentBank == 'cash' ? "1200" : user?.companyInfo?.bankInfo.nominalcode)
      );
      form.setFieldsValue({
        amoutToPaid: props?.amount || 0,
        payReturn: props?.amount - props?.outstanding,
      });
    }

    if (val?.amoutToPaid) {
      let newValue = Number(props?.outstanding) - Number(val?.amoutToPaid);
      form.setFieldsValue({
        payReturn: val?.amoutToPaid - props?.outstanding,
      });
    }
  }

  const onFinish = async (val: any) => {
    setIsLoading(true);
    console.log({ ...val })
    const valData = {
      paymentBank: choosedBank?.list?.id,
      outStanding: 0,
      amoutToPaid: Number(val.amoutToPaid) - Number(val.payReturn),
      paymentMethod: val.paymentBank,
      payReturn: val.payReturn,
      toPaidAmount: val.amoutToPaid,
    }
    let responce = await props.onFinish(valData);
    if (responce) {
      form.setFieldsValue({
        holderName: null,
        accountNumber: null,
        bicnum: null,
        ibanNumber: null,
        availableBalance: null,
        outStanding: null,
        amoutToPaid: null,
        paymentBank: null,
      });
    }
    setIsLoading(false);
  }
  return (
    <div>
      <Form
        onFinish={(val: any) => onFinish(val)}
        onValuesChange={handleValuesChange}
        form={form}
      >
        <Row>
          <Col sm={12}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Choose Paid Method:
            </div>
            <Form.Item
              noStyle
              name="paymentBank"
              rules={[{ required: true, message: "choose payment method" }]}
            >
              <Select
                style={{ width: "100%" }}
                allowClear
                placeholder="choose payment method"
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Cheque", value: "cheque" },
                  { label: "Electronic", value: "other" },
                  { label: "Credit/Debit Card", value: "card" },
                  { label: "PayPal", value: "loan" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Amount :
            </div>
            <Form.Item
              noStyle
              name="amout"
            >
              <Input readOnly type="number" placeholder="amount" />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Amount To Be Paid :
            </div>
            <Form.Item
              noStyle
              name="amoutToPaid"
              rules={[{ required: true, message: "enter amount to be paid" }]}
            >
              <Input type="number" placeholder="amount to be paid" />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Pay Return :
            </div>
            <Form.Item
              noStyle
              name="payReturn"
              rules={[{ required: true, message: "enter amount to be paid" }]}
            >
              <Input readOnly type="number" placeholder="Pay Return" />
            </Form.Item>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={6}>
            <Button size="large" block onClick={() => {
              props?.onCancel()
              form.setFieldsValue({
                holderName: null,
                accountNumber: null,
                bicnum: null,
                ibanNumber: null,
                availableBalance: null,
                outStanding: null,
                amoutToPaid: null,
                paymentBank: null,
              });
            }}>
              Close
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Complete
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
export default RetailExpressPaymentmodal;
