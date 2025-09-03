import { Button, Form, Input, InputNumber, Select, notification } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GET, POST } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import PageHeader from "../../../../components/pageHeader";
import PrefixSelector from "../../../../components/prefixSelector";
import moment from "moment";
import countries from "../../../../utils/CountriesWithStates.json";
import { useTranslation } from "react-i18next";

function CreateSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any>();
  // const [countries, setCountries] = useState<any>([]);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const businessStartDate: any = user?.companyInfo?.financial_year_start;

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const add_supplier_url = API.CONTACT_MASTER + `add`;
      let mobile = `${values.code} ${values.mobileNumber}`;
      const { status, message }: any = await POST(add_supplier_url, {
        ...values,
        adminid,
        mobile: values.mobileNumber ? mobile : "",
        type: "supplier",
        ledger_category: 4,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
      });
      if (status) {
        navigate("/usr/contactSuppliers");

        notification.success({
          message: "Success",
          description: "New supplier created successfully",
        });
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to create new supplier(${message})`,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    name: "",
    reference: "",
    bus_name: "",
    vat_number: "",
    email: "",
    code: user?.companyInfo?.countryInfo?.phoneCode,
    mobileNumber: null,
    telephone: null,
    town: "",
    address: "",
    postcode: "",
    notes: "",
    opening_balance: 0,
  };

  const isVatExists = async (value: any) => {
    console.log(value);
    try {
      let url = API.VAT_EXISTS + adminid + `/${value}`;
      const response: any = await GET(url, null);
      if (response.status) {
        notification.warning({
          message: "Duplicate VAT Number",
          description:
            "The VAT number you entered already exists. Please choose a unique VAT number.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onValuesChange = () => {
    let countryName = form.getFieldValue("country");
    let selectedCountry: any = countries?.find(
      (country: any) => country?.name === countryName
    );
    setStates(selectedCountry?.states);
  };

  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace("/create", "")}
        firstPathText={t("home_page.homepage.Suppliers_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.Create_Supplier")}
        goback="/usr/contactSuppliers"
        title={t("home_page.homepage.Create_Supplier")}
      />

      <div className="adminTable-Box1">
        <div className="create-customer-container">
          <div>
            <Form
              onFinish={submitHandler}
              layout="vertical"
              initialValues={initialValues}
              form={form}
              onValuesChange={onValuesChange}
            >
              <p>{t("home_page.homepage.the_infoo")}</p>
              <Row>
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Name")}
                  </label>
                  <Form.Item
                    name="name"
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true,
                         message:`${t("home_page.homepage.supplier_ms")}`
                     }]}
                  >
                    <Input
                      placeholder={t("home_page.homepage.Supplier_Name")}
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Reference_Code")}
                  </label>
                  <Form.Item
                    name="reference"
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true,
                       message:`${t("home_page.homepage.Reference_rq")}`
                     }]}
                  >
                    <Input
                      placeholder={t("home_page.homepage.Reference_Code")}
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Name_dt")}
                  </label>
                  <Form.Item
                    name="bus_name"
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true,
                    message:`${t("home_page.homepage.Business_nreq")}`
                    }]}
                    
                  >
                    <Input
                      placeholder={t("home_page.homepage.Business_Name")}
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Email")}
                  </label>
                  <Form.Item
                    name="email"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: `${t("home_page.homepage.Business_msg")}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("home_page.homepage.Email")}
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Mobile_Number")}
                  </label>
                  <Form.Item name="mobileNumber" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder={t("home_page.homepage.Mobile_Number")}
                      size="large"
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
                  <label className="formLabel">
                    {t("home_page.homepage.Address")}
                  </label>
                  <Form.Item name="address" style={{ marginBottom: 10 }}>
                    <Input.TextArea
                      placeholder={t("home_page.homepage.Address")}
                      size="large"
                      className="input-field"
                      rows={3}
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Notes")}
                  </label>
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
                  <label className="formLabel">
                    {t("home_page.homepage.Country")}
                  </label>
                  <Form.Item
                    name="country"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          "home_page.homepage.Please_select_country"
                        )}`,
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
                          <Select.Option
                            key={country.name}
                            value={country.name}
                          >
                            {country?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.State")}
                  </label>
                  <Form.Item
                    name="state"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          "home_page.homepage.Please_select_state"
                        )}`,
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
                      <label className="formLabel">
                        {t("home_page.homepage.GSTIN_UIN")}
                      </label>
                      <Form.Item
                        name="vat_number"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message:`${t("home_page.homepage.Gst_req")}`
                          },
                          {
                            pattern: new RegExp("^[A-Z0-9]+$"),
                            message: `${t("home_page.homepage.Vat_msg")}`,
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
                            isVatExists(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <label className="formLabel">
                        {t("home_page.homepage.VAT_Number")}
                      </label>
                      <Form.Item
                        name="vat_number"
                        style={{ marginBottom: 10 }}
                        rules={[
                          {
                            required: true,
                            message:`${t("home_page.homepage.Vat_req")}`
                          },
                          {
                            pattern: new RegExp("^[A-Z0-9]+$"),
                            message: `${t("home_page.homepage.Vat_msg")}`,
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("home_page.homepage.VAT_Number")}
                          size="large"
                          className="input-field"
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(
                              /[^A-Z0-9]/g,
                              ""
                            );
                            e.target.value = filteredValue;
                            isVatExists(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </>
                  )}
                  {user?.companyInfo?.tax === "gst" ? (
                    <>
                      <label className="formLabel">
                        {""}
                        {t("home_page.homepage.PinCode")}
                      </label>
                      <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                        <Input
                          placeholder={t("home_page.homepage.PinCode")}
                          size="large"
                          className="input-field"
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <label className="formLabel">
                          {t("home_page.homepage.Postal_Code")}
                      </label>
                      <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                        <Input
                          placeholder={t("home_page.homepage.Postal_Code")}
                          size="large"
                          className="input-field"
                          onChange={(e) => {
                            const filteredValue = e.target.value.replace(
                              /[^A-Z0-9]/g,
                              ""
                            );
                            e.target.value = filteredValue;
                            isVatExists(e.target.value);
                          }}
                        />
                      </Form.Item>
                    </>
                  )}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={4}>
                  <label className="formLabel">
                     {t("home_page.homepage.Opening_Balance")}(As on{" "}
                    {moment(businessStartDate).format("YYYY-MM-DD")})
                  </label>
                  <Form.Item
                    name="opening_balance"
                    style={{ marginBottom: 10 }}
                  >
                    <InputNumber
                      placeholder="Enter Amount"
                      size="large"
                      className="input-field"
                      style={{ width: "100%" }}
                      controls={false}
                    />
                  </Form.Item>
                </Col>
                <Col md={4} />
                <Col md={2}>
                  <br />
                  <Button
                    size="large"
                    type="default"
                    block
                    onClick={() => navigate("/usr/contactSuppliers")}
                  >
                     {t("home_page.homepage.Close")}
                  </Button>
                </Col>
                <Col md={2}>
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
        </div>
      </div>
    </>
  );
}

export default CreateSupplier;
