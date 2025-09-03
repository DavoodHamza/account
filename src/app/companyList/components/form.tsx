import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  notification,
} from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateSettings from "../../../app/settings/components/form";
import countries from "../../../utils/CountriesWithStates.json";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import OuterPageHeader from "./OuterPageHeader";
import CompanyHeader from "./header";
import API from "../../../config/api";
import PrefixSelector from "../../../components/prefixSelector";

const CompanyForm = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any>();
  const [businessCategory, setBusinessCategory] = useState([]);
  const [enabledTax, setEnabledTax] = useState("vat");
  const [isForm, setIsForm] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { type, id } = useParams();
  const location = useLocation();

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      let mobile = `${values.code} ${values.mobileNumber}`;
      let obj = {
        ...values,
        cphoneno: mobile,
        workingTimeFrom: dayjs(values?.workingTime).format('HH:mm A'),
        workingTimeTo: dayjs(values?.workingTime).format('HH:mm A'),
        adminid: user?.id,
        name: user?.fullName,
        email: user?.email,
      };
       let url = type === "create" ? API.CREATE_SUBSCRIBED_COMPANY : `company_master/${id}`;
      const response: any =
        type === "create" ? await POST(url, obj) : await PUT(url, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "New company created successfully",
        });
        navigate("/company");
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to create company!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialDetails = async () => {
    try {
      setIsLoading(true);
      let url = `company_master/${id}`;
      const response = await GET(url, null);
      form.setFieldsValue({});
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const GetBusinessCategory = async () => {
    try {
      let URL = "business_category/" + user?.id;
      const { data }: any = await GET(URL, null);
      if (data) {
        setBusinessCategory(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetBusinessCategory();
    type === "update" && fetchInitialDetails();
  }, []);

  const addCategory = (val: any) => {
    if (val === "category") {
      setIsForm(true);
    }
  };

  const onValuesChange = () => {
    setEnabledTax(form.getFieldValue("tax"));
    let countryId = form.getFieldValue("country");
    let selectedCountry: any = countries?.find(
      (country: any) => country?.id === countryId
    );
    setStates(selectedCountry?.states);
  };
  return (
    <>
      <CompanyHeader />
      <Container>
        <br />
        <OuterPageHeader
          goback="/company"
          title={type === "create" ? "Create Company" : "Update Company"}
          firstPathLink={location.pathname.replace("/create/0", "")}
          firstPathText={
            type === "create" ? "Create Company" : "Update Company"
          }
        />
        <br />
        <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
          <div className="productAdd-Txt1" style={{ borderRadius: "6px" }}>
          {t("home_page.homepage.Business_Details")}
           
          </div>
          <Row>
            <Col md={6}>
              <label className="formLabel">
                {t("home_page.homepage.Business_Name")}
              </label>
              <Form.Item
                name="bname"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Business name is required" },
                ]}
              >
                <Input
                  placeholder={t("home_page.homepage.Business_Name")}
                  size="large"
                />
              </Form.Item>

              <label className="formLabel">
                {t("home_page.homepage.Business_Category")}
              </label>
              <Form.Item
                name="bcategory"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your category!",
                  },
                ]}
              >
                <Select
                  placeholder={t("home_page.homepage.choose")}
                  showSearch={true}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={addCategory}
                  size="large"
                >
                  <Select.Option
                    value={"category"}
                    style={{
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                     {t("home_page.homepage.Add_Business_Category")}
                    
                  </Select.Option>
                  {businessCategory &&
                    businessCategory?.map((category: any) => (
                      <Select.Option
                        key={category.btitle}
                        value={category?.btitle}
                      >
                        {category?.btitle}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <label className="formLabel">
                {t("home_page.homepage.Business_Email")}
              </label>
              <Form.Item
                name="cemail"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Business email is required" },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  placeholder={t("home_page.homepage.Business_Email")}
                  size="large"
                />
              </Form.Item>

              {/* <label className="formLabel">Working Time</label>
              <Form.Item
                name="workingTime"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Working time is required" },
                ]}
                initialValue={[dayjs('09:00', 'HH:mm'), dayjs('14:00', 'HH:mm')]}
              >
                <TimePicker.RangePicker
                  size="large"
                  style={{ flex: 1, width: "100%" }}
                  format="hh:mm A"
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label>Standardize Shifts</label>
                <Form.Item
                  name="isUniformShifts"
                  style={{ marginBottom: 10 }}
                  initialValue={true}
                >
                  <Radio.Group
                    //optionType="button"
                    buttonStyle="solid"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 5,
                    }}
                  >
                    <Button>
                      <Radio value={true}>Yes</Radio>
                    </Button>
                    <Button>
                      <Radio value={false}>No</Radio>
                    </Button>
                  </Radio.Group>
                </Form.Item>
              </div> */}

              <label className="formLabel">
                {t("home_page.homepage.Business_Address")}
              </label>
              <Form.Item
                name="fulladdress"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: "Business address is required" },
                ]}
              >
                <Input.TextArea
                  placeholder={t("home_page.homepage.Business_Address")}
                  size="large"
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col md={6}>
              <label className="formLabel">
                {t("home_page.homepage.Business_Phone")}
              </label>
              <Form.Item name="mobileNumber" style={{ marginBottom: 10 }}>
                      <Input
                        placeholder='Phone Number'
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

              <label className="formLabel">
              {t("home_page.homepage.country")}
                </label>
              <Form.Item
                name="country"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Please select your country!",
                  },
                ]}
              >
                <Select
                  placeholder="Choose your country"
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
                      <Select.Option key={country.id} value={country.id}>
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
                    message: "Please select your state!",
                  },
                ]}
              >
                <Select
                  placeholder="Choose your state"
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

              <label className="formLabel">{t("home_page.homepage.PostalCode")}</label>
              <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                <Input
                  placeholder="Postal Code"
                  size="large"
                  className="input-field"
                />
              </Form.Item>
            </Col>
          </Row>
          <br />

          <Row>
            <Col md={6}>
              <div className="productAdd-Txt1" style={{ borderRadius: "6px" }}>
              {t("home_page.homepage.Accounting_Details")}
               
              </div>
              <label className="formLabel">
                {t("home_page.homepage.Financial_Year_Starting_from")}
              </label>
              <Form.Item
                name="financial_year_start"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Financial year starting date is required",
                  },
                ]}
              >
                <DatePicker
                  placeholder={t(
                    "home_page.homepage.Financial_Year_Starting_from"
                  )}
                  size="large"
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  inputReadOnly={true}
                />
              </Form.Item>
              <label className="formLabel">
                {t("home_page.homepage.Books_Begining_from")}
              </label>
              <Form.Item
                name="books_begining_from"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Books beginning from date is required",
                  },
                ]}
              >
                <DatePicker
                  placeholder={t("home_page.homepage.Books_Begining_from")}
                  size="large"
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  inputReadOnly={true}
                />
              </Form.Item>
              <label className="formLabel">{t("home_page.homepage.StripeKey_Optional")}</label>
              <Form.Item name="stripKey" style={{ marginBottom: 10 }}>
                <Input placeholder="Stripe Key" size="large" />
              </Form.Item>
            </Col>
            <Col md={6}>
              <div className="productAdd-Txt1" style={{ borderRadius: "6px" }}>
              {t("home_page.homepage.Taxation_Details")}
                
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="formLabel">{t("home_page.homepage.Taxation_Type")}</label>
                <Form.Item
                  name="tax"
                  style={{ marginBottom: 10 }}
                  initialValue={"vat"}
                >
                  <Radio.Group
                    //optionType="button"
                    buttonStyle="solid"
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 5,
                    }}
                  >
                    <Button>
                      <Radio value={"vat"}>{t("home_page.homepage.vat")}</Radio>
                    </Button>
                    <Button>
                      <Radio value={"gst"}>{t("home_page.homepage.GST")}</Radio>
                    </Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              {enabledTax === "vat" && (
                <>
                  <label className="formLabel">{t("home_page.homepage.vat_number")}</label>
                  <Form.Item
                    name="taxno"
                    style={{ marginBottom: 10 }}
                    rules={[
                      // { required: true, message: "Tax/Vat is required" },
                      {
                        pattern: new RegExp("^[A-Z0-9]+$"),
                        message:
                          "Please enter only capital letters and numbers",
                      },
                    ]}
                  >
                    <Input placeholder="Vat Number" size="large" />
                  </Form.Item>
                </>
              )}

              {enabledTax === "gst" && (
                <Row>
                  <Col md={6}>
                    <label className="formLabel">{t("home_page.homepage.Registration_Type")}</label>
                    <Form.Item
                      name="regType"
                      style={{ marginBottom: 10 }}
                      initialValue={"Regular"}
                      rules={
                        [
                          //{ required: true, message: "registration type is required" }
                        ]
                      }
                    >
                      <Input
                        placeholder="Enter registration type"
                        size="large"
                      />
                    </Form.Item>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 20,
                        marginBottom: 20,
                        alignItems: "center",
                      }}
                    >
                      <label className="formLabel">
                      {t("home_page.homepage.Assessee_of_other_Territory")}
                       
                      </label>
                      <Form.Item
                        name="isOtherTerritory"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "This is required field!",
                        //   },
                        // ]}
                        noStyle
                      >
                        <Radio.Group
                          //optionType="button"
                          buttonStyle="solid"
                        >
                          <Radio value={true}>{t("home_page.homepage.Yes")}</Radio>
                          <Radio value={false}>{t("home_page.homepage.no")}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 20,
                        marginBottom: 20,
                        alignItems: "center",
                      }}
                    >
                      <label className="formLabel">{t("home_page.homepage.EInvoice_applicable")}</label>
                      <Form.Item
                        name="isEInvoice"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please choose one!",
                        //   },
                        // ]}
                        noStyle
                      >
                        <Radio.Group>
                          <Radio value={true}>{t("home_page.homepage.Yes")}</Radio>
                          <Radio value={false}>{t("home_page.homepage.no")}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col md={6}>
                    <label className="formLabel">{t("home_page.homepage.GSTIN_UIN")}</label>
                    <Form.Item
                      name="taxno"
                      style={{ marginBottom: 10 }}
                      rules={[
                        // { required: true, message: "GSTIN/UIN is required" },
                        {
                          pattern: new RegExp("^[A-Z0-9]+$"),
                          message:
                            "Please enter only capital letters and numbers",
                        },
                      ]}
                    >
                      <Input placeholder="Enter GST Number" size="large" />
                    </Form.Item>

                    {/* <label className="formLabel">
             Periodicity
            </label>
            <Form.Item name="periodicity" style={{ marginBottom: 10 }}>
              <Select
                placeholder='Choose one'
                size="large"
              >
                <Select.Option value="monthly">
                  Monthly
                </Select.Option>
                <Select.Option value="quarterly">
                 Quarterly
                </Select.Option>
              </Select>
            </Form.Item> */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 20,
                        marginBottom: 20,
                        alignItems: "center",
                      }}
                    >
                      <label className="formLabel">{t("home_page.homepage.Eway_bill_applicable")}</label>
                      <Form.Item
                        name="isEwayBill"
                        noStyle
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please choose one!",
                        //   },
                        // ]}
                      >
                        <Radio.Group>
                          <Radio value={true}>{t("home_page.homepage.Yes")}</Radio>
                          <Radio value={false}>{t("home_page.homepage.no")}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              )}
              <Row>
                <Col md={4} />
                <Col md={4}>
                  <Button
                    size="large"
                    type="default"
                    style={{
                      height: 45,
                      width: "100%",
                      display: "block",
                      marginTop: 18,
                    }}
                    onClick={() => navigate("/company")}
                  >{t("home_page.homepage.close")}
                    
                  </Button>
                </Col>
                <Col md={4}>
                  <Button
                    size="large"
                    type="primary"
                    loading={isLoading}
                    style={{
                      height: 45,
                      width: "100%",
                      display: "block",
                      marginTop: 18,
                    }}
                    htmlType="submit"
                  >{t("home_page.homepage.CREATE")}
                    
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <br />
          <br />
        </Form>
      </Container>

      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => setIsForm(false)}
          source={"category"}
          id={"create"}
          reload={GetBusinessCategory}
        />
      ) : null}
    </>
  );
};

export default CompanyForm;
