import { Button, Checkbox, Form, Input, Select, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Logo2 from "../../assets/images/logo2.webp";
import Whatsapp from "../../components/whatsapp";
import API from "../../config/api";
import {
  login,
  setAffiliationCode,
  setBaseUrl,
  setToken,
} from "../../redux/slices/userSlice";
import { CREATEBASEURL, POST, REGISTERPOST } from "../../utils/apiCalls";
import countries from "../../utils/CountriesWithStates.json";
import SettingUpModal from "./components/settingUpModal";
import "./styles.scss";
function Signup(props: any) {
  const { t } = props;
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<any>({
    status: "",
    help: "",
  });
  const [companyLoading, setCompanyLoading] = useState(1);
  const [staffLoading, setStaffLoading] = useState(1);
  const [counterLoading, setCounterLoading] = useState(1);
  const [productLoading, setProductLoading] = useState(1);
  const User = useSelector((state: any) => state.User);
  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [affiliation_code, setAffiliation_code] = useState(code || "");
  const [form] = useForm();
  useEffect(() => {
    setCode();
  }, []);

  const delay = (executedFunction: any) => {
    setTimeout(() => {
      executedFunction();
    }, 500);
  };

  const defaultCompanyHandler = async (user: any, password: string) => {
    try {
      setCompanyLoading(1);
      let companyObj = {
        bname: "Default Company",
        bcategory: "Default Category",
        adminid: user?.id,
        userid: user?.id,
        financial_year_start: new Date(),
        books_begining_from: new Date(),
        country: user?.countryid,
        tax: user?.countryid == 101 ? "gst" : "vat",
      };
      const url = API.BASE_URL + API.CREATE_COMPANY;
      const response: any = await REGISTERPOST(url, companyObj);
      if (response.status) {
        setCompanyLoading(3);
        setProgress(45);
        delay(() =>
          defaultStaffHandler(
            user,
            response?.data?.id,
            password,
            response.data.newLocation.id
          )
        );
      } else {
        setCompanyLoading(2);
      }
    } catch (error) {
      console.log(error);
      setCompanyLoading(2);
    }
  };

  const defaultStaffHandler = async (
    user: any,
    companyId: any,
    password: string,
    locationId: number
  ) => {
    try {
      setStaffLoading(1);
      let staffObj = {
        name: user?.fullName,
        password: password,
        email: user?.email,
        adminid: user?.id,
        createdBy: user?.id,
        companyid: companyId,
        userdate: new Date(),
        is_deleted: false,
      };
      let url = API.BASE_URL + API.CREATE_DEFAULT_STAFF;
      const response: any = await REGISTERPOST(url, staffObj);
      if (response.status) {
        setStaffLoading(3);
        setProgress(75);
        delay(() =>
          defaultCounterHandler(user?.id, companyId, user?.token, locationId)
        );
      } else {
        setStaffLoading(2);
      }
    } catch (error) {
      console.log(error);
      setStaffLoading(2);
    }
  };

  const defaultCounterHandler = async (
    userId: number,
    companyId: number,
    token: string,
    locationId: number
  ) => {
    try {
      setCounterLoading(1);
      let counterData = {
        location: locationId,
        adminid: Number(userId),
        companyid: Number(companyId),
        name: "Counter 1",
        balance: 0,
        sdate: new Date(),
        shiftlist: [
          {
            fromtime: "8:00 AM",
            totime: "8:00 PM",
            name: "Day Shift",
          },
        ],
      };

      let url = API.BASE_URL + "billing_counter/addCounter";
      const response: any = await REGISTERPOST(url, counterData);
      if (response?.status) {
        setCounterLoading(3);
        setProgress(85);
        delay(() => defaultProductHandler(userId, companyId, token));
      } else {
        setCounterLoading(2);
      }
    } catch (error) {
      console.log(error);
      setCounterLoading(2);
    }
  };

  const defaultProductHandler = async (
    userId: number,
    companyId: number,
    token: string
  ) => {
    try {
      setProductLoading(1);
      let productObj = {
        itemtype: "Nonstock",
        icode: "NS001",
        idescription: "Default Product",
        price: 0,
        sp_price: 100,
        c_price: 0,
        trade_price: 0,
        type: "Nonstock",
        logintype: "user",
        includevat: 0,
        userid: userId,
        adminid: userId,
        vat: 5,
        vatamt: 5,
        product_category: null,
        existingstock: false,
        wholesale: 80,
        product_loctions: [],
        date: new Date(),
        unit: null,
        location: null,
        createdBy: userId,
        companyid: Number(companyId),
      };
      let url = API.ADD_PRODUCT;
      const response: any = await POST(url, productObj);
      if (response.status) {
        setProductLoading(3);
        setProgress(100);
        setOpenModal(false);
        notification.success({
          message: "Success",
          description: "User registered successfully",
        });
        navigate("/company");
      } else {
        setProductLoading(2);
      }
    } catch (error) {
      console.log(error);
      setProductLoading(2);
    }
  };

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url = API.BASE_URL + API.LOGIN_REGISTRATION;
      let password = val?.password;
      const user: any = await REGISTERPOST(url, {
        ...val,
        affiliationLink: affiliation_code,
        affiliationCode: affiliation_code,
        countryid: val?.countryid,
        isTaxgo: true,
      });
      if (user.status) {
        setOpenModal(true);
        setProgress(10);
        dispatch(setToken(user?.data?.token));
        dispatch(login(user?.data));
        createBaseUrl(user.data);
        delay(() => defaultCompanyHandler(user?.data, password));
      } else {
        notification.error({
          message: "Failed",
          description: user.message,
        });
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to register user!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const setCode = () => {
    if (code !== undefined && code !== null) {
      dispatch(setAffiliationCode(code));
    } else {
      setAffiliation_code(User?.affiliationCode);
    }
  };
  const createBaseUrl = async (data: any) => {
    setIsLoading(true);
    var url = API.BASE_URL;
    var date = new Date();
    var year = date.getFullYear();
    let lastparms = `${year}-${year + 1}`;
    let body = {
      adminid: data.id,
      email: data.email,
      isActive: true,
      urlName: lastparms,
      baseUrl: url,
    };
    let endpoint = "base";
    try {
      const response: any = await CREATEBASEURL(endpoint, body);
      if (response.status) {
        dispatch(setBaseUrl(response?.data?.baseUrl));
      } else {
        notification.error({
          message: "Failed",
          description:
            "Oops! Something went wrong with your sign-In. Please try again later or contact support for help.",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (value: any) => {
    // Your password validation logic
    const minLength = 8;
    const specialCharacterRegex = /[.*@!#%&()^~]/;
    const digitRegex = /\d/;
    if (value.length === 0) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Staff_pws"),
      });
    } else if (value.length < minLength) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Passwordspecial_character"),
      });
    } else if (!specialCharacterRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Passwordspecial_character"),
      });
    } else if (!digitRegex.test(value)) {
      setPasswordValidation({
        status: "error",
        help: t("home_page.homepage.Password_must_contain"),
      });
    } else {
      setPasswordValidation({
        status: "success",
        help: "",
      });
    }
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} sm={6} md={8} style={{ margin: 0, padding: 0 }}>
            <div className="website-SignupBox1">
              <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} style={{ margin: 0, padding: 0 }}>
            <div className="website-SignupBack" onClick={() => navigate(-1)}>
              <BiArrowBack />
            </div>
            <div className="website-SignupBox2">
              <div className="website-Signuptxt1">
                {t("home_page.homepage.Sign_Up")}
              </div>
              <br />

              <Form
                form={form}
                // onFinish={verification ? verifyOtp : LoginPhone}
                onFinish={onFinish}
                initialValues={{ code: "+91" }}
              >
                {/* Full Name */}
                <Form.Item name="fullName" style={{ marginBottom: 10 }}>
                  <Input
                    style={{ width: "100%" }}
                    placeholder={t("home_page.homepage.full_name")}
                    size="large"
                  />
                </Form.Item>

                {/* <label className="formLabel">{t("home_page.homepage.Country")}</label> */}
                <Form.Item
                  name="countryid"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true, message: "Country is required" }]}
                >
                  <Select
                    placeholder={t("home_page.homepage.Select_Country")}
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

                <Form.Item
                  name="email"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      type: "email",
                      message: t("home_page.homepage.enter_email_valid"),
                    },
                    {
                      required: true,
                      message: t("home_page.homepage.enter_email_valid"),
                    },
                  ]}
                >
                  <Input
                    style={{ width: "100%" }}
                    placeholder={t("home_page.homepage.Email_Address")}
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                    {
                      min: 8,
                      message: "Password must be at least 8 characters!",
                    },
                    {
                      pattern: /^(?=.*[!@#$%^&*])/,
                      message:
                        "Password must contain at least one special character!",
                    },
                  ]}
                  validateStatus={passwordValidation.status}
                  help={passwordValidation.help}
                >
                  <Input.Password
                    size="large"
                    onChange={(e) => validatePassword(e.target.value)}
                    placeholder={t("home_page.homepage.enter_password")}
                  />
                </Form.Item>

                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: "Please agree to our terms and privacy policy!",
                    },
                  ]}
                >
                  <Checkbox>{t("home_page.homepage.privacy_policy")}</Checkbox>
                </Form.Item>
                <Button
                  block
                  size="large"
                  type="primary"
                  style={{ height: 45, marginTop: 5 }}
                  htmlType="submit"
                  loading={isLoading}
                >
                  {t("home_page.homepage.Sign_up")}
                </Button>
              </Form>
              <div className="website-Signuptxt4">
                {t("home_page.homepage.Already")}{" "}
                <span
                  className="website-Signuptxt3"
                  onClick={() => navigate("/login")}
                  style={{ cursor: "pointer" }}
                >
                  {t("home_page.homepage.login")}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Whatsapp />
      {/* <ChatBot /> */}

      {openModal && (
        <SettingUpModal
          open={openModal}
          close={() => setOpenModal(false)}
          loading1={companyLoading}
          loading2={staffLoading}
          loading3={counterLoading}
          loading4={productLoading}
          progress={progress}
        />
      )}
    </div>
  );
}

export default withTranslation()(Signup);
