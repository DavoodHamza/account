import { Form, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";


function EmployeeCategoryForm() {
  const { t } = useTranslation();
  return (
    <div>
      <Row>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.EmployeeCategory")}</label>
            <Form.Item
              name="category"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.Pleascategory"),
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

export default EmployeeCategoryForm;
