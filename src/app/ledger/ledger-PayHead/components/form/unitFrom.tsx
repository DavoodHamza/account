import { Form, Input } from "antd";
import { t } from "i18next";

function UnitFrom() {
  return (
    <div>
      <label className="formLabel">{t("home_page.homepage.Formal_Name")}</label>
      <Form.Item
        name="formalName"
        rules={[
          {
            required: true,
            message: "Please enter a name",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <label className="formLabel">{t("home_page.homepage.Symbol")}</label>
      <Form.Item
        name="unit"
        rules={[
          {
            required: true,
            message: "Please enter a Unit",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <label className="formLabel">{t("home_page.homepage.Decimal_Value")}</label>
      <Form.Item name="decimalValues">
        <Input defaultValue={0} />
      </Form.Item>
    </div>
  );
}

export default UnitFrom;
