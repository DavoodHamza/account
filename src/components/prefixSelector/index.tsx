import { Form, Select } from "antd";
import Country from "../../config/countryCode.json";
import { useTranslation } from "react-i18next";

const PrefixSelector = ({countryCode}:any) => {
  const { t } = useTranslation();

  return (
    <Form.Item name="code" noStyle rules={[{ required: true ,message:`${t("home_page.homepage.Please_choose_the")}`}]}>
      <Select
        style={{ width: 70 }}
        size="small"
        showSearch={true}
        defaultValue={countryCode||"+91"}
        placeholder={"+"}
      >
        {Country.map((item: any) => {
          return (
            <Select.Option key={item.dial_code} value={item.dial_code}>
              {item.dial_code}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};

export default PrefixSelector;
