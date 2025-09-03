import { Alert, Button, Checkbox, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { RiAttachment2 } from "react-icons/ri";

function SendMailModal(props: any) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (val: any) => {
    setLoading(true);
    let obj = {
      ...val,
      to: val?.to?.length ? val.to.split(",") : [],
      cc: val?.cc?.length ? val.cc.split(",") : [],
      bcc: [],
      attachementName: props.fileName,
    };
    if (val.isOwn) {
      obj.cc.push(props.ownMail);
    }
    props.onFinish(obj);
  };

  form.setFieldsValue(props.defaultValue);

  const emailValidationRule = {
    validator(rule: any, value: any) {
      if (rule.required) {
        const emails = value.split(",");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const email of emails) {
          if (email?.trim() !== "" && !emailRegex?.test(email.trim())) {
            return Promise.reject(
              "Please enter valid email addresses separated by commas"
            );
          }
        }
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    },
  };

  return (
    <Modal
      open={props.open}
      onCancel={() => props.close()}
      maskClosable={false}
      footer={false}
      title={"E-Mail"}
    >
      <Form onFinish={handleFinish} form={form}>
        <div className="formLabel">To Address :</div>
        <Form.Item
          name="to"
          rules={[
            {
              ...emailValidationRule,
              required: true,
              message: "",
            },
          ]}
        >
          <Input.TextArea
            placeholder={` Enter multiple emails with commas ","`}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.to !== currentValues.to
          }
        >
          {({ getFieldValue }) => {
            const ccValue = getFieldValue("to");
            if (ccValue) {
              const emails = ccValue.split(",");
              const hasInvalidEmail = emails.some(
                (email: any) =>
                  email.trim() !== "" &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
              );
              if (hasInvalidEmail) {
                return (
                  <Alert
                    style={{ margin: 0 }}
                    type="error"
                    message="Please enter valid email addresses separated by commas"
                    showIcon
                  />
                );
              }
            }
            return null;
          }}
        </Form.Item>
        {/* Display a generic error message */}
        <div className="formLabel">CC Address :</div>
        <Form.Item
          name={"cc"}
          rules={[{ ...emailValidationRule, required: false }]}
        >
          <Input.TextArea
            placeholder={` Enter multiple emails with commas ","`}
          />
        </Form.Item>
        {/* Display a generic error message */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.cc !== currentValues.cc
          }
        >
          {({ getFieldValue }) => {
            const ccValue = getFieldValue("cc");
            if (ccValue) {
              const emails = ccValue.split(",");
              const hasInvalidEmail = emails.some(
                (email: any) =>
                  email.trim() !== "" &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
              );
              if (hasInvalidEmail) {
                return (
                  <Alert
                    type="error"
                    message="Please enter valid email addresses separated by commas"
                    showIcon
                  />
                );
              }
            }
            return null;
          }}
        </Form.Item>
        <div style={{ margin: 4 }} className="heading-txt4">
          Enter multiple emails with commas ","
        </div>
        <div className="formLabel">Subject :</div>
        <Form.Item name={"subject"}>
          <Input placeholder={``} />
        </Form.Item>
        <div className="formLabel">Message :</div>
        <Form.Item name={"content"}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={"isOwn"} valuePropName="checked">
          <Checkbox>
            send a copy to myself at <strong>{props.ownMail}</strong>
          </Checkbox>
        </Form.Item>
        <div className="formLabel">Attachment :</div>

        <div
          style={{
            margin: 5,
            display: "flex",
            gap: 20,
            color: "grey",
            border: "1px solid #dedede",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <RiAttachment2 size={20} color="green" />
          <span>{props.Attachment}</span>
        </div>
        <br />

        <Row>
          <Col sm={6}>
            <Button size="large" block onClick={() => props.close()}>
              Close
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              size="large"
              block
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Send E-mail
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default SendMailModal;
