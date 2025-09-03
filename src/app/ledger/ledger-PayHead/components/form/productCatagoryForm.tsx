import React from "react";
import { Form, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
function ProductCatagoryForm() {
  const {t} = useTranslation();
  return (
    <div>
      <Row>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.Category")}</label>
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

export default ProductCatagoryForm;
