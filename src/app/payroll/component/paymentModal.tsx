import { Button, DatePicker, Form, Input, Select, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "antd/es/form/Form";

function PaySheetPaymentmodal(props: any) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [selectBank, setSlectedBank] = useState<any>({});

  function handleValuesChange(val: any) {
    if (val?.paymentBank) {
      const choosedBank = props?.bankList?.find(
        (item: any) => item?.list?.id === val?.paymentBank
      );
      form.setFieldsValue({
        holderName: choosedBank?.list?.laccount,
        accountNumber: choosedBank?.list?.accnum,
        bicnum: choosedBank?.list?.bicnum,
        ibanNumber: choosedBank?.list?.ibannum,
        availableBalance: choosedBank?.amount,
      });
      if(props?.amount > choosedBank?.amount){
        notification.error({
        message:
            "The amount is greater than the available balance. Choose Another account",
        });
      }
      if(choosedBank?.list?.laccount?.toLowerCase() === "Cash".toLowerCase()){
        form.setFieldsValue({
          paymentMethod: 'cash'
        })
      }
    }

  }


  return (
    <div>
      <Form
        onFinish={(val: any) => {
          setIsLoading(true);
          props.onFinish(val);
          setIsLoading(false);
          setIsLoadingButton(true)
        }}
        onValuesChange={handleValuesChange}
        form={form}
      >
        <Row>
          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Choose Payment Bank :
            </div>
            <Form.Item
              noStyle
              name="paymentBank"
              rules={[{ required: true, message: "" }]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="select payment bank"
                onChange={(val: any) => {
                  let bank = props?.bankList.find(
                    (item: any) => item?.list?.id === val
                  );
                  setSlectedBank(bank);
                }}
                size="large"
              >
                {props.bankList?.length &&
                  props.bankList?.map((item: any) => {
                    return (
                      <Select.Option
                        key={item?.list?.id}
                        value={item?.list?.id}
                      >
                        {item?.list?.laccount}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Acc.Holder Name
            </div>
            <Form.Item
              noStyle
              name="holderName"
              rules={[{ required: true, message: "" }]}
            >
              <Input placeholder="Acc.holder name" readOnly size="large" />
            </Form.Item>
          </Col>
          {selectBank?.list?.laccount?.toLowerCase() ===
          "Cash".toLowerCase() ? null : (
            <Col sm={6}>
              <div className="formLabel" style={{ marginTop: 10 }}>
                Bank Info/ Acc. No. :
              </div>
              <Form.Item noStyle name="accountNumber">
                <Input placeholder="account number" readOnly size="large"/>
              </Form.Item>
            </Col>
          )}
          {selectBank?.list?.laccount?.toLowerCase() ===
          "Cash".toLowerCase() ? null : (
            <Col sm={6}>
              <div className="formLabel" style={{ marginTop: 10 }}>
                BIC/Swift
              </div>
              <Form.Item noStyle name="bicnum">
                <Input placeholder="BIC/Swift" readOnly size="large"/>
              </Form.Item>
            </Col>
          )}
          {selectBank?.list?.laccount?.toLowerCase() ===
          "Cash".toLowerCase() ? null : (
            <Col sm={6}>
              <div className="formLabel" style={{ marginTop: 10 }}>
                IBAN Number :
              </div>
              <Form.Item noStyle name="ibanNumber">
                <Input placeholder=" IBAN number" readOnly size="large"/>
              </Form.Item>
            </Col>
          )}
          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Payment Date :
            </div>
            <Form.Item
              noStyle
              name="paymentDate"
              initialValue={dayjs(new Date())}
            >
              <DatePicker
                defaultValue={dayjs(new Date(), "YYYY-MM-DD")}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Available Balance :
            </div>
            <Form.Item name={"availableBalance"} noStyle>
              <Input placeholder="available balance" readOnly size="large"/>
            </Form.Item>
          </Col>
          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Amount
            </div>
            <Form.Item
              noStyle
              name="amoutToPaid"
             rules={[{ required: true, message: "enter amount to be paid" }]}
             initialValue={props?.amount}
            >
              <Input type="number" placeholder="amount to be paid" disabled size="large"/>
            </Form.Item>
          </Col>

          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Paid Method:
            </div>
            <Form.Item
              noStyle
              name="paymentMethod"
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
                size="large"
              />
            </Form.Item>
          </Col>

          <Col sm={6}>
            <br />
            <Row>
          <Col sm={6}>
            <Button size="large" block onClick={() => props?.onCancel()}>
              Close
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingButton}
              disabled={form.getFieldsValue().amoutToPaid > form.getFieldsValue().availableBalance}
            >
              Pay
            </Button>
            </Col>
            </Row>
          </Col>
        </Row>
        <br />
      </Form>
    </div>
  );
}
export default PaySheetPaymentmodal;
