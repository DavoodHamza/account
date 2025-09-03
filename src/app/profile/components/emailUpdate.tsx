import { Button, Card, Form, Input, Space, notification } from "antd";
import { useState } from "react";
import API from "../../../config/api";
import { POST } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function UpdateEmail(props: any) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      const url = API.UPDATE_EMAIL + user?.id;
      const data = {
        email: values.email,
        userId: user?.id,
      };
      const response: any = await POST(url, data);
        notification.success({
          message: `Success`,
          description: `${t("home_page.homepage.A_mail_has_been_sent_to_your_Email")}`
        });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{t("home_page.homepage.Change_Your_Email_Address")}</strong>
            {/* <span style={{ color: "red" }}>
              {props?.details?.emailverified === 1
                ? "Email Verified"
                : "*Verify Your Email Email Verified"}
            </span> */}
          </div>
        }
      >
        <Form onFinish={onFinish} initialValues={{ email: user.email }}>
          <label className="formLabel">{t("home_page.homepage.Email_Address")}</label>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="email"
              style={{ width: "100%" }}
              rules={[
                {
                  type: "email",
                  message: `${t("home_page.homepage.The_input_is_not_valid_Email")}`,
                },
                {
                  required: true,
                  message: `${t("home_page.homepage.Please_input_your_Email")}`,
                },
              ]}
            >
              <Input placeholder={t("home_page.homepage.Email_Address")} size="large" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
            >
              {t("home_page.homepage.Update_Email")}
            </Button>
          </Space.Compact>
        </Form>
      </Card>
    </>
  );
}

export default UpdateEmail;
