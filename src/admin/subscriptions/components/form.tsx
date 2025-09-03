import { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";

interface Subscription {
  id: number;
  userId: number;
  company: number;
  counter: number;
  period: number;
  price: number;
  retailXpressWithTaxgo: boolean;
  soleTrader: boolean;
  subscriptionExpiry: string;
  userDetails: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Props {
  initialValues: Subscription;
  onSave: (values: Subscription) => void;
  onCancel: () => void;
  loading: boolean;
}

const SubscriptionsAdminForm = ({
  initialValues,
  onSave,
  onCancel,
  loading,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      const expiryDate = initialValues.subscriptionExpiry
        ? dayjs(initialValues.subscriptionExpiry)
        : null;

      form.setFieldsValue({
        fullName: initialValues.userDetails.fullName,
        email: initialValues.userDetails.email,
        counter: initialValues.counter,
        company: initialValues.company,
        period: initialValues.period,
        price: initialValues.price,
        subscriptionExpiry: expiryDate,
        soleTrader: initialValues.soleTrader,
        retailXpressWithTaxgo: initialValues.retailXpressWithTaxgo,
      });
    }
  }, [initialValues, form]);

  const onFinish = (values: any) => {
    const updatedValues: Subscription = {
      ...initialValues,
      counter: values.counter,
      company: values.company,
      period: values.period,
      price: values.price,
      subscriptionExpiry: values.subscriptionExpiry
        ? values.subscriptionExpiry.format("YYYY-MM-DD")
        : null,
      soleTrader: values.soleTrader,
      retailXpressWithTaxgo: values.retailXpressWithTaxgo,
    };
    onSave(updatedValues);
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="p-2 ps-0"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name" name="fullName">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Counter"
              name="counter"
              rules={[
                { required: true, message: "Please enter a counter value" },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Company"
              name="company"
              rules={[
                { required: true, message: "Please enter a company name" },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Period"
              name="period"
              rules={[
                { required: true, message: "Please enter a period value" },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please enter a price value" },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Subscription Expiry"
              name="subscriptionExpiry"
              rules={[
                {
                  required: true,
                  message: "Please select a subscription expiry date",
                },
              ]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Is Sole Trader"
              name="soleTrader"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <div
          className="w-full flex justify-end space-x-6"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <Button
            disabled={loading}
            onClick={onCancel}
            style={{ width: "120px" }}
          >
            Cancel
          </Button>
          <Button
            style={{ width: "120px" }}
            loading={loading}
            disabled={loading}
            type="primary"
            htmlType="submit"
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SubscriptionsAdminForm;
