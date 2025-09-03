import { Button, Checkbox, Form, Input, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import API from "../../../config/api";
import { BASE_PUT, GETWITHBASE, REGISTERPOST } from "../../../utils/apiCalls";
import "../styles.scss";
import { useDispatch } from "react-redux";
import { salesPersonLogin } from "../../../redux/slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import PrefixSelector from "../../../components/prefixSelector";
import { IoIosCamera } from "react-icons/io";
import Avatar from "../../../assets/images/user.webp";
import LogoPicker from "../../../app/proposal/components/LogoPicker";
import countries from "../../../utils/CountriesWithStates.json";
import Logo2 from "../../../assets/images/logo2.webp";
import { BiArrowBack } from "react-icons/bi";
import Agreement from "./agreement";

const AffiliationForm = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, toggleModal] = useState(false);
  const [img, setImg] = useState(null);
  const { v4: uuidv4 } = require("uuid");
  const { type, id } = useParams();
  const [agreement, setAgreement] = useState(false);
  const fetchAffiliation = async () => {
    try {
      setIsLoading(true);
      let url = API.AFFILIATION + id;
      const { data, status }: any = await GETWITHBASE(url, null);
      if (status) {
        setImg(data?.image);
        form.setFieldsValue({
          name: data?.name,
          email: data?.email,
          countryid: data?.countryid,
          code: data?.phone ? data?.phone.split(" ")[0] : "",
          mobile: data?.phone ? data?.phone.split(" ")[1] : "",
          affiliationCode: data?.affiliationCode,
          rewardPercentage: data?.rewardPercentage * 100,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Something went Wrong",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Internal Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    type === "edit" && fetchAffiliation();
  }, []);

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let mobile = `${val.code} ${val.mobile}`;
      const url =
        type === "create"
          ? API.BASE_URL + API.ADD_AFFILIATION
          : API.BASE_URL + API.EDIT_AFFILIATION + id;
      let obj: any = {
        name: val?.name,
        email: val?.email,
        countryid: val?.countryid,
        affiliationCode: val?.affiliationCode,
        affiliationLink: val?.affiliationCode,
        phone: val?.mobile ? mobile : "",
        rewardPercentage: 0.1,
        image: img,
      };

      const response: any =
        type === "create"
          ? await REGISTERPOST(url, obj)
          : await BASE_PUT(url, obj);

      if (response.status) {
        dispatch(salesPersonLogin(response.data));
        navigate(`/affiliate-details`);
        notification.success({
          message: "Success",
          description:
            type === "create"
              ? "You are an affiliator now!"
              : "Details updated Successfully",
        });
      } else {
        notification.error({
          message: "Failed",
          description:
            type === "create"
              ? "Failed To Create Affiliation"
              : "Failed To Update Affiliation",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          type === "create"
            ? "Failed To Create Affiliation"
            : "Failed To Update Affiliation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onValuesChange = (val: any, obj: any) => {
    if (!obj.affiliationCode) {
      let code =
        "TGC" + uuidv4().replace(/-/g, "").toUpperCase().substring(0, 12);
      form.setFieldsValue({
        affiliationCode: code,
        code: "+91",
        rewardPercentage: 10,
      });
    }
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <div className="col-md-8 col-12 affiliation_section p-5">
            {type === "create" ? (
              <>
                <div className="affiliation_title">
                  Earn with the Tax GO Affiliate Program!
                </div>
                <p className="affiliation_description">
                  Join the Tax GO Affiliate Program today and start earning
                  commissions on every sale you generate! As a valued affiliate,
                  you will receive monthly payouts for all sales made in that
                  month.
                  <div className="affiliation_sub">Here’s how it works:</div>
                  <span className="step_number">1. Track Your Sales:</span>{" "}
                  Every sale you make during the month is recorded in our
                  system.
                  <br />
                  <span className="step_number">2. Monthly Payouts:</span> At
                  the end of each month, we calculate your total earnings.
                  <br />
                  <span className="step_number">
                    3. Receive Your Payment:
                  </span>{" "}
                  Payments are made on the last day of the month.
                </p>
                <div className="affiliation_sub">Payment Options:</div>
                <div className="step_number">
                  You can choose your preferred method of payment:
                </div>
                <div className="affiliation_description">
                  <span className="step_number"> 1. PayPal:</span> Please
                  provide your PayPal email address for easy and secure
                  transactions.{" "}
                </div>
                <div className="affiliation_description">
                  Example: yourname@example.com
                </div>
                <div className="affiliation_description">
                  <span className="step_number">2. Bank Account:</span> Provide
                  your bank details for direct deposit.
                </div>
                <strong>Required Information:</strong>
                <div className="affiliation_description">
                  Bank Name: [Your Bank Name]
                </div>
                <div className="affiliation_description">
                  Account Holder's Name:[Your Name]
                </div>
                <div className="affiliation_description">
                  Account Number:[Your Account Number]:
                </div>
                <div className="affiliation_description">
                  Routing Number:[Your Routing Number]
                </div>
                <div className="affiliation_description">
                  SWIFT/BIC Code:[If applicable for international payments]
                </div>
                <br />
                <p className="affiliation_description">
                  Ensure your payment details are up to date in your affiliate
                  account settings to avoid any delays. Join now and maximize
                  your earnings with Tax GO! For any queries or assistance, feel
                  free to reach out to our support team. Start promoting Tax GO
                  and watch your earnings grow each month. Happy selling!
                </p>
              </>
            ) : (
              <div className="col-xs-12">
                <div className="website-SignupBox1">
                  <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
                </div>
              </div>
            )}
          </div>
          <div className="col-md-4 col-12 p-5">
            <h4 className="affiliation_title d-flex gap-3">
              <BiArrowBack
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
              />

              {type === "create" ? "Be an Affiliate" : "Update Details"}
            </h4>
            <br />
            <Form
              form={form}
              onFinish={onFinish}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col md={10} xs={12}>
                  <div className="form_profile_parent">
                    <div className="form_profile">
                      <img
                        src={!img ? Avatar : img}
                        className="form_profile_img"
                        onClick={() => toggleModal(true)}
                        alt="profile"
                      />
                      <IoIosCamera
                        className="profile-edit"
                        color="#fff"
                        size={25}
                        onClick={() => toggleModal(true)}
                      />
                    </div>
                  </div>
                </Col>

                <Col md={12} xs={12}>
                  <label className="formLabel">Name</label>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your name!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Name"
                      type="text"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <label className="formLabel">Email</label>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      type="email"
                      style={{ width: "100%" }}
                      placeholder="Email"
                    />
                  </Form.Item>

                  {type === "create" && (
                    <div>
                      <label className="formLabel">Country</label>
                      <Form.Item
                        name="countryid"
                        rules={[
                          {
                            required: true,
                            message: "Please select a country",
                          },
                        ]}
                      >
                        <Select
                          placeholder={"Select Country"}
                          showSearch={true}
                          filterOption={(input: any, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          size="large"
                        >
                          {countries?.map((country: any) => (
                            <Select.Option key={country.id} value={country.id}>
                              {country?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  )}
                </Col>

                <Col md={12} xs={12}>
                  <label className="formLabel">Phone</label>
                  <Form.Item name="mobile">
                    <Input
                      size="large"
                      className="input-field"
                      placeholder="Phone Number"
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

                  <label className="formLabel">Affiliate Code</label>
                  <Form.Item
                    name="affiliationCode"
                    rules={[{ required: true }]}
                  >
                    <Input size="large" readOnly style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

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
                  <Checkbox onClick={() => setAgreement(true)}>
                    I agree to Privacy Policy,{" "}
                    <span
                      onClick={() => setAgreement(true)}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      Terms and Condition
                    </span>
                  </Checkbox>
                </Form.Item>
                <Col xs={12}>
                  <div className="d-flex gap-3">
                    <Button
                      block
                      size="large"
                      onClick={() => form.resetFields()}
                    >
                      Clear
                    </Button>

                    <Button
                      htmlType="submit"
                      type="primary"
                      size="large"
                      loading={isLoading}
                      block
                    >
                      {type === "create" ? "Submit" : "Update"}
                    </Button>
                  </div>
                  <br />
                  <br />
                </Col>
                {toggle && (
                  <LogoPicker
                    open={toggle}
                    modalClose={() => toggleModal(false)}
                    form={form}
                    setImg={setImg}
                    mode="affiliation"
                  />
                )}
              </Row>
            </Form>
          </div>
        </Row>
      </Container>
      {agreement && (
        <Agreement
          openModal={agreement}
          closeModal={() => setAgreement(false)}
        />
      )}
    </div>
  );
};

export default AffiliationForm;
