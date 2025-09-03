import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";


function UnitFrom() { 
   const { t } = useTranslation();

  return (
    <div>
      <label className="formLabel">{t("home_page.homepage.Formal_Name")}</label>
      <Form.Item
        name="formalName"
        rules={[
          {
            required: true,
            message: t("home_page.homepage.Name_ms"),
          },
        ]}
      >
        <Input size="large"/>
      </Form.Item>

      <label className="formLabel">{t("home_page.homepage.Symbol")}</label>
      <Form.Item
        name="unit"
        rules={[
          {
            required: true,
            message: t("home_page.homepage.unit_ms"),
          },
        ]}
      >
        <Input size="large"/>
      </Form.Item>

      <label className="formLabel">{t("home_page.homepage.DecimalValue")}</label>
      <Form.Item name="decimalValues">
        <Input defaultValue={0} />
      </Form.Item>
    </div>
  );
}

export default UnitFrom;
