import { Form, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
function LocationForm() {
  const { t } = useTranslation();
  return (
    <div>
      <Row>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.Location")}</label>
            <Form.Item
              name="location"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.locationRequired"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </Col>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.code")}</label>
            <Form.Item
              name="locationCode"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.locationCodeRequired"),
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default LocationForm;