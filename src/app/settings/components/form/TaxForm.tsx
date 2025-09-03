import { Form, Input, Row } from "antd";
import { t } from "i18next";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const TaxPercentageForm = () => {
  const { user } = useSelector((state: any) => state.User);

  return (
    <div>
      <Row>
        <Col md={12}>
          <div className="formItem">
            <label className="formLabel">{t("home_page.homepage.Type")}</label>
            <Form.Item
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please tax type",
                },
              ]}
              initialValue={user?.companyInfo?.tax === "gst" ? "GST" : "VAT"}
            >
              <Input readOnly size="large"/>
            </Form.Item>
          </div>
        </Col>
        {user?.companyInfo?.tax === "gst" ? (
          <>
            <Col md={12}>
              <div className="formItem">
                <label className="formLabel">{t("home_page.homepage.gst")}%</label>
                <Form.Item
                  name="percentage"
                  rules={[
                    {
                      required: true,
                      message: "Please enter igst percentage",
                    },
                  ]}
                >
                  <Input type="number" suffix="%" size="large"/>
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="formItem">
                <label className="formLabel">{t("home_page.homepage.CGST")}%</label>
                <Form.Item name="cgst">
                  <Input type="number" suffix="%" readOnly size="large"/>
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="formItem">
                <label className="formLabel">{t("home_page.homepage.SGST")}</label>
                <Form.Item name="sgst">
                  <Input type="number" suffix="%" readOnly size="large"/>
                </Form.Item>
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col md={12}>
              <div className="formItem">
                <label className="formLabel">{t("home_page.homepage.Percentage")}</label>
                <Form.Item
                  name="percentage"
                  rules={[
                    {
                      required: true,
                      message: "Please enter tax percentage",
                    },
                  ]}
                >
                  <Input type="number" suffix="%" size="large"/>
                </Form.Item>
              </div>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default TaxPercentageForm;
