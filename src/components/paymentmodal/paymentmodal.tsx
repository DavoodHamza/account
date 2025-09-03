import { Button, DatePicker, Form, Input, Select, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "antd/es/form/Form";

function Paymentmodal(props: any) {
  const [form] = useForm();
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
        outStanding: props?.outstanding,
      });
      if(choosedBank?.list?.laccount?.toLowerCase() === "Cash".toLowerCase()){
        form.setFieldsValue({
          paymentMethod: 'cash'
        })
      }
    }

    if (val?.amoutToPaid) {
      let newValue = Number(props?.outstanding) - Number(val?.amoutToPaid);
      form.setFieldsValue({
        outStanding: newValue,
      });
      if (newValue < 0) {
        form.setFieldsValue({
          amoutToPaid: props?.outstanding,
          outStanding: 0,
        });
        notification.error({
          message:
            "The amount cannot be greater than the outstanding balance. ",
        });
      }
    }
    if (val?.amoutToPaid === "" || val?.amoutToPaid === null) {
      form.setFieldsValue({
        outStanding: props?.outstanding,
      });
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
              <Input placeholder="Acc.holder name" readOnly />
            </Form.Item>
          </Col>
          {selectBank?.list?.laccount?.toLowerCase() ===
          "Cash".toLowerCase() ? null : (
            <Col sm={6}>
              <div className="formLabel" style={{ marginTop: 10 }}>
                Bank Info/ Acc. No. :
              </div>
              <Form.Item noStyle name="accountNumber">
                <Input placeholder="account number" readOnly />
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
                <Input placeholder="BIC/Swift" readOnly />
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
                <Input placeholder=" IBAN number" readOnly />
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
              />
            </Form.Item>
          </Col>

          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Available Balance :
            </div>
            <Form.Item name={"availableBalance"} noStyle>
              <Input placeholder="available balance" readOnly />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <div className="formLabel" style={{ marginTop: 10 }}>
              Outstanding :
            </div>
            <Form.Item name={"outStanding"} noStyle>
              <Input placeholder="out standing amount" readOnly />
            </Form.Item>
          </Col>
          <Col sm={6}>
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
              />
            </Form.Item>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={4} />
          <Col sm={4}>
            <Button size="large" block onClick={() => props?.onCancel()}>
              Close
            </Button>
          </Col>
          <Col sm={4}>
            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingButton}
            >
              Complete Payment
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
export default Paymentmodal;
