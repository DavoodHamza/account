import { Button, Form, Input, Modal, Select, notification } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import API from "../../config/api";
import { POST } from "../../utils/apiCalls";
import PrefixSelector from "../prefixSelector";
import countries from "../../utils/CountriesWithStates.json";
import { useTranslation } from "react-i18next";

function CreateCutomerModal({
  open,
  onCancel,
  customerSearch,
  type,
  customer,
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const submitHandler = async (values: any) => {
    try {
      const add_customer_url = API.CONTACT_MASTER + "add";
      setIsLoading(true);
      let mobile = `${values.code} ${values.mobile}`;
      const { data, status, message }: any = await POST(add_customer_url, {
        ...values,
        adminid,
        mobile: values.mobile ? mobile : "",
        type: type,
        ledger_category: 3,
        companyid: user?.companyInfo?.id,
        country:values.country,
        state:values.state,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
      });
      if (status) {
        notification.success({
          message: "Success",
          description:
            type === "customer"
              ? "Customer created successfully"
              : "Supplier created successfully",
        });
        await customerSearch(" ");
        customer(data);
        onCancel();
      } else {
        notification.error({
          message: "Failed",
          description:
            type === "customer"
              ? `Failed to create customer(${message})`
              : `Failed to create supplier(${message})`,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server, Please try again later",
      });
    }
  };

  const initialValues = {
    code: user?.companyInfo?.countryInfo?.phoneCode,
  };

  const onValuesChange = () => {
    let countryName = form.getFieldValue("country");
    let selectedCountry: any = countries?.find(
      (country: any) => country?.name === countryName
    );
    setStates(selectedCountry?.states);
  };

  return (
    <Modal open={open} onCancel={onCancel} width="50%" footer={false}>
      <div>
        <h5>{type == "customer" ? "Create Customer" : "Create Supplier"}</h5>
        <hr />
        <Form
          onFinish={submitHandler}
          layout="vertical"
          initialValues={initialValues}
          form={form}
          onValuesChange={onValuesChange}
        >
          <Row>
            <Col md={4}>
              <label className="formLabel">{t("home_page.homepage.Name")}</label>
              <Form.Item
                name="name"
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message:t("home_page.homepage.name_required")}]}
              >
                <Input
                  placeholder={t("home_page.homepage.Name")}
                  size="large"
                  className="input-field"
                />
              </Form.Item>
              <label className="formLabel">{t("home_page.homepage.Reference_Code")}</label>
              <Form.Item
                name="reference"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: t("home_page.homepage.referencecodeisrequired") },
                ]}
              >
                <Input
                  placeholder={t("home_page.homepage.Reference_Code")}
                  size="large"
                  className="input-field"
                />
              </Form.Item>
              <label className="formLabel">{t("home_page.homepage.Business_Name_dt")}</label>
              <Form.Item
                name="bus_name"
                rules={[
                  { required: true, message: t("home_page.homepage.Business_nreq") },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input
                  placeholder={t("home_page.homepage.Business_Name")}
                  size="large"
                  className="input-field"
                />
              </Form.Item>
              <label className="formLabel">{t("home_page.homepage.Business_Email_Address")}</label>
              <Form.Item name="email" style={{ marginBottom: 10 }}
             rules={[
              {
                required:true,
                pattern:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: `${t("home_page.homepage.Business_msg")}`
              },
            ]}
              >
                <Input
                  placeholder={t("home_page.homepage.email_")}
                  size="large"
                  className="input-field"
                />
              </Form.Item>
            </Col>
            <Col md={4}>
            <label className="formLabel">{t("home_page.homepage.Business_Mobile_Number")}</label>
              <Form.Item name="mobile" style={{ marginBottom: 10 }}>
                <Input
                  placeholder={t("home_page.homepage.Business_Mobile")}
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
              <label className="formLabel">{t("home_page.homepage.Address")}</label>
              <Form.Item name="address" style={{ marginBottom: 10 }}>
                <Input.TextArea
                  placeholder={t("home_page.homepage.Address")}
                  size="large"
                  className="input-field"
                  rows={3}
                />
              </Form.Item>
              <label className="formLabel">{t("home_page.homepage.Notes")}</label>
              <Form.Item name="notes" style={{ marginBottom: 10 }}>
                <Input.TextArea
                  placeholder={t("home_page.homepage.Notes")}
                  size="large"
                  className="input-field"
                />
              </Form.Item>
              
              {/* <label className="formLabel">Telephone Number</label>
                            <Form.Item name="telephone" style={{ marginBottom: 10 }}>
                                <Input
                                    placeholder="Telephone Number"
                                    size="large"
                                    className="input-field"
                                    type="text"
                                    onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(
                                    /[^0-9]/g,
                                    ""
                                    );
                                }}      
                                />
                            </Form.Item>
                            <label className="formLabel">Town/city</label>
                            <Form.Item name="city" style={{ marginBottom: 10 }}>
                                <Input
                                    placeholder="Town/city"
                                    size="large"
                                    className="input-field"
                                />
                            </Form.Item> */}
                    </Col>
                    <Col md={4}>
                    <label className="formLabel">{t("home_page.homepage.Country")}</label>
                      <Form.Item
                        name="country"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message: t("home_page.homepage.Please_select_country"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("home_page.homepage.Choose_Country")}
                          showSearch={true}
                          filterOption={(input: any, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          size="large"
                        >
                          {countries &&
                            countries?.map((country: any) => (
                              <Select.Option key={country.name} value={country.name}>
                                {country?.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <label className="formLabel">{t("home_page.homepage.State")}</label>
                      <Form.Item
                        name="state"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message: t("home_page.homepage.Please_select_state"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("home_page.homepage.Choose_state")}
                          showSearch={true}
                          size="large"
                          filterOption={(input: any, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {states &&
                            states?.map((state: any) => (
                              <Select.Option key={state.name} value={state.name}>
                                {state.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                      {form.getFieldValue("country") === "India" ? (
                        <>
                        <label className="formLabel">{t("home_page.homepage.GSTIN_UIN")}</label>
                      <Form.Item
                        name="vat_number"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message: t("home_page.homepage.Gst_req"),
                          },
                          {
                            pattern: new RegExp("^[A-Z0-9]+$"),
                            message: t("home_page.homepage.Pleaselettersnumbers"),
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("home_page.homepage.GSTIN_UIN")}
                          size="large"
                          className="input-field"
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(
                              /[^A-Z0-9]/g,
                              ""
                            );
                            e.target.value = filteredValue;
                          }}
                        />
                      </Form.Item>
                        </>
                      ):(
                        <>
                      <label className="formLabel">{t("home_page.homepage.VATNumber")}</label>
                      <Form.Item
                        name="vat_number"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message: t("home_page.homepage.VATnumberisrequired"),
                          },
                          {
                            pattern: new RegExp("^[A-Z0-9]+$"),
                            message: t("home_page.homepage.Pleaselettersnumbers"),
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("home_page.homepage.VATNumber")}
                          size="large"
                          className="input-field"
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(
                              /[^A-Z0-9]/g,
                              ""
                            );
                            e.target.value = filteredValue;
                          }}
                        />
                      </Form.Item>
                      </>
                      )}
                      <label className="formLabel">{t("home_page.homepage.PostalCode")}</label>
                      <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                        <Input
                          placeholder={t("home_page.homepage.PostalCode")}
                          size="large"
                          className="input-field"
                        />
                      </Form.Item>
                    </Col>
          </Row>
          {/* <hr /> */}
          <Row>
            <Col md={4} />
            <Col md={4} />
            <Col md={4}>
              <br />
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={isLoading}
                block
              >
                {t("home_page.homepage.Save")}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}

export default CreateCutomerModal;
