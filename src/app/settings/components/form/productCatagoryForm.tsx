import { Form, Input, Select } from "antd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";


function ProductCatagoryForm() {
  const { t } = useTranslation();

  const options = [
    {label:"Product",value:"product"},
    {label:"Service",value:"service"},
  ]

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
              <Input size="large" placeholder={t("home_page.homepage.Category")}/>
            </Form.Item>
          </div>
        </Col>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.categoryType")}</label>
            <Form.Item name="categoryType">
                  <Select
                    size="large"
                    placeholder="Select a Category Type"
                  >
                    {options?.map((item:any) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ProductCatagoryForm;
