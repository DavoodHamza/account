import { Button, DatePicker, Form, Input, Modal, Select, notification } from "antd";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { REGISTERPOST } from "../../../utils/apiCalls";
import API from "../../../config/api";
import PrefixSelector from "../../../components/prefixSelector";
import timeZones from '../../../utils/TimeZones.json'
import { withTranslation } from "react-i18next";

const ScheduleDemo = (props: any) => {
  const { t } = props;

  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      let url = API.BASE_URL + "contactus/add";
      let mobile = `${values.code} ${values.mobile}`;
      let obj = {
        ...values,
        ContactOption: "schedule",
        phone: values.mobile ? mobile : "",
      };
      const response: any = await REGISTERPOST(url, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description:
            t("home_page.homepage.demo_successfully."),
        });
        props?.setIsOpen(false)
      } else {
        notification.error({
          message: "Failed",
          description:
            t("home_page.homepage.failed_schedule_demo"),
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          t("home_page.homepage.failed_schedule"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Modal
        title={
          <div className="productAdd-Txt1" style={{ fontSize: 18 }}>{t("home_page.homepage.schedule_demo")}</div>
        }
        open={props?.isOpen}
        closable={false}
        width={800}
        footer={false}
      >
        <Form onFinish={onFinish}>

          <Row>
            <Col md={6}>
              <label className="formLabel">{t("home_page.homepage.name_")}</label>
              <Form.Item
                name="name"
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: " name is required" }]}
              >
                <Input placeholder={t("home_page.homepage.enter_name")} size="large" />
              </Form.Item>

              <label className="formLabel">{t("home_page.homepage.email_")}</label>
              <Form.Item
                name="email"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: t('home_page.homepage.enter_name') },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: t("home_page.homepage.enter_valid_email"),
                  },
                ]}
              >
                <Input placeholder={t("home_page.homepage.email_enter")} size="large" />
              </Form.Item>

              <label className="formLabel">{t("home_page.homepage.date_time")}</label>
              <Form.Item
                name="sdate"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: t("home_page.homepage.date_time_reequired"),
                  },
                ]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  // placeholder={t("home_page.homepage.mobile_number_")}
                  size="large"
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY HH:mm"
                  inputReadOnly={true}
                />
              </Form.Item>

              <label className="formLabel">
                {t("home_page.homepage.time_zone")}
              </label>
              <Form.Item
                name="timeZone"
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: t('home_page.homepage.time_zone_required') }]}
              >
                <Select placeholder={t('home_page.homepage.time_zone')}
                  size="large"
                >
                  {
                    timeZones.map((zone) => (
                      <Select.Option key={`${zone.zone}-${zone.gmt}`} value={`${zone.zone}-${zone.gmt}`} >
                        {zone.zone} - {zone.gmt}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={6}>
              <label className="formLabel">{t('home_page.homepage.mobile_number')}</label>
              <Form.Item name="mobile" style={{ marginBottom: 10 }}>
                <Input
                  placeholder={t('home_page.homepage.mobile_number')}
                  size="large"
                  className="input-field"
                  addonBefore={<PrefixSelector />}
                  type="text"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                  }}
                />
              </Form.Item>
              <label className="formLabel">{t('home_page.homepage.Message')}</label>
              <Form.Item name="message" style={{ marginBottom: 10 }}>
                <Input.TextArea rows={4} placeholder={t("home_page.homepage.Message")} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={8} />
            <Col md={2}>
              <Button
                size="large"
                style={{
                  height: 45,
                  fontWeight: "600",
                  // marginTop: 18,
                  width: "100%",
                }}
                onClick={() => props?.setIsOpen(false)}
              >
                {t("home_page.homepage.close")}
              </Button>
            </Col>
            <Col md={2}>
              <Button
                size="large"
                type="primary"
                loading={isLoading}
                style={{
                  height: 45,
                  fontWeight: "600",
                  // marginTop: 18,
                  width: "100%",
                }}
                htmlType="submit"
              >
                {t("home_page.homepage.submit")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Container>
  );
};

export default withTranslation()(ScheduleDemo);
