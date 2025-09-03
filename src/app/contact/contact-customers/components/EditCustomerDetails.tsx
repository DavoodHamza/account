import { Button, Form, Input, InputNumber, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET, PUT } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import { useNavigate, useParams } from "react-router";
import { Col, Row } from "react-bootstrap";
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import { useLocation } from "react-router-dom";
import PrefixSelector from "../../../../components/prefixSelector";
import moment from "moment";
import countries from "../../../../utils/CountriesWithStates.json";
import { useTranslation } from "react-i18next";

function EditCustomerDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const [form] = Form.useForm();
  const adminid = user?.id;
  const { id } = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const location = useLocation();
  const businessStartDate: any = user?.companyInfo?.financial_year_start;

  const fetchCustomerDetails = async () => {
    try {
      setIsLoading(true);
      const customer_details_url = API.CONTACT_MASTER + `details/${id}`;
      const { data }: any = await GET(customer_details_url, null);
      form.setFieldsValue({
        adminid,
        name: data?.name,
        reference: data?.reference,
        bus_name: data?.bus_name,
        code: data?.mobile
          ? data?.mobile.split(" ")[0]
          : user?.companyInfo?.countryInfo?.phoneCode,
        mobileNumber: data?.mobile && data?.mobile.split(" ")[1],
        vat_number: data?.vat_number,
        email: data?.email,
        telephone: data?.telephone,
        city: data?.city,
        address: data?.address,
        postcode: data?.postcode,
        notes: data?.notes,
        ledger_category: data?.ledger_category,
        opening_balance: Number(data?.opening_balance),
        country: data?.country,
        state: data?.state,
        loyaltyCardNumber:data?.loyaltyCardNumber
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const submitHandler = async (values: any) => {
    try {
      const update_customer_url = API.CONTACT_MASTER + `update/${id}`;
      setIsLoading(true);
      let mobile = `${values.code} ${values.mobileNumber}`;
      const { status, message }: any = await PUT(update_customer_url, {
        ...values,
        mobile: values.mobileNumber ? mobile : "",
        adminid,
        type: "customer",
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
      });
      setIsLoading(false);
      navigate("/usr/contactCustomers");
      if (status) {
        notification.success({
          message: "Success",
          description: "Customer details updated successfully",
        });
      } else {
        notification.success({
          message: "Failed",
          description: `Failed to update customer details(${message})`,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server!! Please try again later",
      });
    }
  };

  const isVatExists = async (value: any) => {
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

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const onValuesChange = () => {
    let countryName = form.getFieldValue("country");
    let selectedCountry: any = countries?.find(
      (country: any) => country?.name === countryName
    );
    setStates(selectedCountry?.states);
  };

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <PageHeader
            firstPathLink={location.pathname.replace(`/edit/${id}`, "")}
            firstPathText={t("home_page.homepage.Customers_List")}
            secondPathLink={location?.pathname}
            secondPathText={t("home_page.homepage.Update_Customer")}
            goback="/usr/contactCustomers"
            title={t("home_page.homepage.Update_Customer")}
          />
          <div className="adminTable-Box1 ">
            <div className="create-customer-container">
              <Form
                onFinish={submitHandler}
                layout="vertical"
                onValuesChange={onValuesChange}
                form={form}
              >
                <p>{t("home_page.homepage.the_infoo")}</p>
                <Row>
                  <Col md={4}>
                    <label className="formLabel">{t("home_page.homepage.Name")}</label>
                    <Form.Item
                      name="name"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder={t("home_page.homepage.Customer_Name")}
                        size="large"
                        className="input-field"
                      />
                    </Form.Item>
                    <label className="formLabel">{t("home_page.homepage.Reference_Code")}</label>
                    <Form.Item
                      name="reference"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
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
                      rules={[{ required: true }]}
                      style={{ marginBottom: 10 }}
                    >
                      <Input
                        placeholder={t("home_page.homepage.Business_Name")}
                        size="large"
                        className="input-field"
                      />
                    </Form.Item>
                    <label className="formLabel">{t("home_page.homepage.Business_Email_Address")}</label>
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
                  <label className="formLabel">{t("home_page.homepage.Business_Mobile_Number")}</label>
                    <Form.Item name="mobileNumber" style={{ marginBottom: 10 }}>
                      <Input
                        placeholder={t("home_page.homepage.Mobile_Number")}
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
                          message: `${t("home_page.homepage.Please_select_country")}`,
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
                    <label className="formLabel">{t("home_page.homepage.State")}</label>
                    <Form.Item
                      name="state"
                      style={{ marginBottom: 10 }}
                      rules={[
                        {
                          required: true,
                          message:`${t("home_page.homepage.Please_select_state")}`,
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
                          pattern: new RegExp("^[A-Z0-9]+$"),
                          message:
                            `${t("home_page.homepage.Vat_msg")}`,
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
                    ):(
                      <>
                      <label className="formLabel">{t("home_page.homepage.VAT_Number")}</label>
                    <Form.Item
                      name="vat_number"
                      style={{ marginBottom: 10 }}
                      rules={[
                        {
                          pattern: new RegExp("^[A-Z0-9]+$"),
                          message:
                            `${t("home_page.homepage.Vat_msg")}`,
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
                    <label className="formLabel">{t("home_page.homepage.Postal_Code")}</label>
                    <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                      <Input
                        placeholder={t("home_page.homepage.Postal_Code")}
                        size="large"
                        className="input-field"
                      />
                    </Form.Item>
                    
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={4}>
                    <label className="formLabel">
                         {t("home_page.homepage.Opening_Balance")} (As on{" "}
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
                  <Col md={4}>
                <label className="formLabel">{t("home_page.homepage.LoyaltyCard_Number")}</label>
                  <Form.Item
                    name="loyaltyCardNumber"
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Card Number"
                      readOnly
                    />
                  </Form.Item>
              </Col>
                 <Col md={4}/>
                </Row>
                <Row>
                <Col md={8}/>
                <Col md={2}>
                    <br />
                    <Button
                      size="large"
                      type="default"
                      onClick={() => navigate("/usr/contactCustomers")}
                      block
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
                      {t("home_page.homepage.Update")}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EditCustomerDetails;
