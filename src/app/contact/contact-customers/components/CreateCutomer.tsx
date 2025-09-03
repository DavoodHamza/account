import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/pageHeader";
import PrefixSelector from "../../../../components/prefixSelector";
import API from "../../../../config/api";
import countries from "../../../../utils/CountriesWithStates.json";
import { GET, POST, REGISTERGET } from "../../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
import { MdQrCodeScanner } from "react-icons/md";
import { Html5QrcodeScanner } from "html5-qrcode";

function CreateCutomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [states, setStates] = useState<any>();
  const [cardData, setCardData] = useState<any>([]);
  const { user } = useSelector((state: any) => state.User);
  const [form] = Form.useForm();
  const adminid = user?.id;
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(()=>{
    fetchCardData()
  },[])

  const businessStartDate: any = user?.companyInfo?.financial_year_start;





  const submitHandler = async (values: any) => {
    try {
      const add_customer_url = API.CONTACT_MASTER + "add";
      setIsLoading(true);
      let mobile = `${values.code} ${values.mobile}`;
      const { status, message }: any = await POST(add_customer_url, {
        ...values,
        adminid,
        mobile: values.mobile ? mobile : "",
        type: "customer",
        ledger_category: 3,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
      });
      if (status) {
        notification.success({
          message: "Success",
          description: "New customer created successfully",
        });
        navigate("/usr/contactCustomers");
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to create new customer(${message})`,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server!! Please try again later",
      });
    }
  };

  const fetchCardData = async () => {
    try {
      setIsLoading(true);
      let url =
        API.MASTER_BASE_URL +
        `loyalyCardMaster?userId=${user?.id}&companyId=${user?.companyInfo?.id}&assignedStatus=${false}`;
      const {data}: any = await REGISTERGET(url, null);
      form.setFieldsValue({loyaltyCardNumber:data[0]?.cardNumber})
      setCardData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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

  const qrCodeSuccessCallback = (decodedText: any) => {
    console.log("Scanned QR Code:", decodedText);
    form.setFieldsValue({ loyaltyCardNumber: decodedText });
    setVisible(false);
  };
  const qrCodeErrorCallback = (errorMessage: any) => {
    // console.error("Error scanning QR code:", errorMessage);
  };

  useEffect(() => {
    if (visible) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "html5qr-code-full-region",
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1,
          disableFlip: false,
        },
        true
      );
      html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
      return () => {
        html5QrcodeScanner.clear().catch((error: any) => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      };
    }
  }, [visible]);

  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace("/create", "")}
        firstPathText={t("home_page.homepage.Customers_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.CreateCustomer")}
        goback="/usr/contactCustomers"
        title={t("home_page.homepage.CreateCustomer")}
      />

      <div className="adminTable-Box1">
        <Card>
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
                  rules={[
                    {
                      required: true,
                      message: `${t("home_page.homepage.Customer_req")}`,
                    },
                  ]}
                >
                  <Input
                    placeholder={t("home_page.homepage.Customer_Name")}
                    size="large"
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Reference_Code")}
                </label>
                <Form.Item
                  name="reference"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: true,
                      message: `${t("home_page.homepage.Reference_rq")}`,
                    },
                  ]}
                >
                  <Input
                    placeholder={t("home_page.homepage.Reference_Code")}
                    size="large"
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Business_Name_dt")}
                </label>
                <Form.Item
                  name="bus_name"
                  rules={[
                    {
                      required: true,
                      message: `${t("home_page.homepage.Business_nreq")} `,
                    },
                  ]}
                  style={{ marginBottom: 10 }}
                >
                  <Input
                    placeholder={t("home_page.homepage.Business_Name")}
                    size="large"
                    className="input-field"
                    style={{ width: "100%" }}
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
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Business_Mobile_Number")}
                </label>
                <Form.Item name="mobile" style={{ marginBottom: 10 }}>
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
                <label className="formLabel">
                  {t("home_page.homepage.Address")}
                </label>
                <Form.Item name="address" style={{ marginBottom: 10 }}>
                  <Input.TextArea
                    placeholder={t("home_page.homepage.Address")}
                    size="large"
                    className="input-field"
                    rows={3}
                    style={{ width: "100%" }}
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
                    style={{ width: "100%" }}
                  />
                </Form.Item>
               
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
                        <Select.Option key={country.name} value={country.name}>
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
                      message: `${t("home_page.homepage.Please_select_state")}`,
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
                          message: `${t("home_page.homepage.Gst_req")}`,
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
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /[^A-Z0-9]/g,
                            ""
                          );
                          isVatExists(filteredValue);
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
                          message: `${t("home_page.homepage.Vat_req")}`,
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
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /[^A-Z0-9]/g,
                            ""
                          );
                          isVatExists(filteredValue);
                        }}
                      />
                    </Form.Item>
                  </>
                )}
                <label className="formLabel">
                  {" "}
                  {t("home_page.homepage.PinCode")}
                </label>
                <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                  <Input
                    placeholder={t("home_page.homepage.PinCode")}
                    size="large"
                    className="input-field"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Opening_Balance")}(As on{" "}
                  {moment(businessStartDate).format("YYYY-MM-DD")})
                </label>
                <Form.Item name="opening_balance" style={{ marginBottom: 10 }}>
                  <InputNumber
                    placeholder="Enter Amount"
                    size="large"
                    className="input-field"
                    style={{ width: "100%" }}
                    controls={false}
                  />
                </Form.Item>
              </Col>
   {user?.companyInfo?.isLoyaltyEnabled === true && (
  <>
    <Col md={4}>
      <label className="formLabel">{t("home_page.homepage.LoyaltyCard_Number")}</label>
      <Row style={{ display: "flex" }}>
        <Col md={10}>
          <Form.Item name="loyaltyCardNumber" style={{ marginBottom: 10 }}>
            <Select
              size="large"
              showSearch
              placeholder="Card Number"
              optionFilterProp="children"
            >
              {cardData?.map((item:any) => (
                <Select.Option key={item.cardNumber} value={item.cardNumber}>
                  {item.cardNumber}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={2}>
          <MdQrCodeScanner
            size={35}
            color="#188A8A"
            onClick={() => setVisible(true)}
          />
        </Col>
      </Row>
    </Col>
    <Col md={4}>
      <label className="formLabel">Referral Code</label>
      <Form.Item name="referredCode" style={{ marginBottom: 10 }}>
        <Input size="large" style={{ width: "100%" }} placeholder="Referral Code" />
      </Form.Item>
    </Col>
  </>
)}

            </Row>
            <Row>
              <Col md={8} />
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
                  {t("home_page.homepage.Save")}
               
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <Modal
        title="Scan QR Code"
        open={visible}
        // onOk={handleOk}
        footer={false}
        onCancel={() => setVisible(false)}
      >
        <div id="html5qr-code-full-region" style={{ width: "100%" }} />
      </Modal>
    </>
  );
}

export default CreateCutomer;
