import { Button, Card, Form, Input, Radio, Select, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "../../../components/imagePicker";
import LoadingBox from "../../../components/loadingBox";
import PrefixSelector from "../../../components/prefixSelector";
import API from "../../../config/api";
import { setToken, update } from "../../../redux/slices/userSlice";
import countries from "../../../utils/CountriesWithStates.json";
import { GET, PUT } from "../../../utils/apiCalls";
import CreateSettings from "../../settings/components/form";
import { log } from "console";
import { useAccessControl } from "../../../utils/accessControl";


const { Option } = Select;
function Business(props: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { canUpdateSettings } = useAccessControl();
  const [states, setStates] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [businessCategory, setBusinessCategory] = useState([]);
  const [toggle, toggleModal] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [isForm, setIsForm] = useState(false);
  let countryCode
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [enabledTax, setEnabledTax] = useState(user?.companyInfo?.tax);
  const [selectedCountry, setSelectedCountry] = useState(105)



  useEffect(() => {
    GetBusinessCategory();
    fetchBankList();
    let selectedCountry: any = countries?.find(
      (country: any) => country?.id == user?.companyInfo?.country
    );
    setStates(selectedCountry?.states);
  }, []);
  const fetchBankList = async () => {
    try {
      setIsInitialLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + user.id + `/${user?.companyInfo?.id}`;
      const { data }: any = await GET(bank_list_url, null);
      const filteredBank = data.bankList.filter(
        (item: any) =>
          item?.list?.acctype === "savings" ||
          item?.list?.acctype === "current" ||
          item?.list?.laccount === "Current" ||
          item?.list?.acctype === "card"
      );
      setBankList(filteredBank);
      setIsInitialLoading(false);
    } catch (error) {
      console.log(error);
      setIsInitialLoading(false);
    }
  };

  const addCategory = (val: any) => {
    if (val === "category") {
      setIsForm(true);
    }
  };

  const onFinish = async (data: any) => {
    try {
      setIsLoading(true);
      let mobile = `${data.code} ${data.mobileNumber}`;
      let obj = {
        ...data,
        id: user?.id,
        userid: user?.userid,
        bname: data?.bname,
        bcategory: data?.bcategory,
        website: data?.website,
        cemail: data?.cemail,
        cperson: data?.cperson,
        fulladdress: data?.fulladdress,
        registerno: data?.registerno,
        btype: data?.btype,
        cphoneno: mobile,
        taxno: data?.taxno,
        defaultBank: data?.defaultBank,
        companyid: user?.companyInfo?.id,
        country: data?.country,
        state: data?.state,
        isLoyaltyEnabled:data?.isLoyaltyEnabled
        // workingTimeFrom: dayjs(data?.workingTime[0]).format('HH:mm A'),
        // workingTimeTo: dayjs(data?.workingTime[1]).format('HH:mm A'),
      };
      console.log(obj, "obj=============");
      let url = API.UPDATE_PROFILE + user?.id + "/" + user?.companyInfo?.id;
      const response: any = await PUT(url, obj);
      console.log("response============", response);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `${t("home_page.homepage.updated_successfully")}`,
        });
        let obj = {
          ...user,
          ...response?.data,
          isStaff: user?.isStaff,
          staff: user?.staff,
          token: response?.data?.token,
        };
        dispatch(update(obj));
        dispatch(setToken(response?.data?.token));
        // props.onChange();
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
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
 
  const getInitialValues = () => {
    
    try {
      return {
        code: user?.companyInfo?.cphoneno
        ? user?.companyInfo?.cphoneno.split(" ")[0]
        : user?.companyInfo?.countryInfo?.phoneCode,
        bname: user?.companyInfo?.bname,
        bcategory: user?.companyInfo?.bcategory,
        website: user?.companyInfo?.website,
        cemail: user?.companyInfo?.cemail,
        cperson: user?.companyInfo?.cperson,
        fulladdress: user?.companyInfo?.fulladdress,
        registerno: user?.companyInfo?.registerno,
        btype: user?.companyInfo?.btype,
        mobileNumber: user?.companyInfo?.cphoneno && user?.companyInfo?.cphoneno.split(" ")[1],
        taxno: user?.companyInfo?.taxno,
        tax: user?.companyInfo?.tax,
        defaultBank: user?.companyInfo?.defaultBank,
        country: user?.companyInfo?.country,
        state: user?.companyInfo?.state,
        isLoyaltyEnabled:user?.companyInfo?.isLoyaltyEnabled,
        workingTime: [
          
          dayjs(user?.companyInfo?.workingTimeFrom, "HH:mm"),
          dayjs(user?.companyInfo?.workingTimeTo, "HH:mm"),
          
          
        ],
      };
     
      
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues?.tax) {
      setEnabledTax(changedValues?.tax);
    }
    const countryId = allValues.country;
    let selectedCountry: any = countries?.find(
      (country: any) => country?.id == countryId
    );
    setStates(selectedCountry?.states);
    // form.setFieldValue('state', '');
  };

  const handleSelectCountry = (val: number) => {
    try {
      form.setFieldValue('state', null)
      setSelectedCountry(val);
      const states: any = countries?.find((item: any) => item.id === val)
      setStates(states?.states)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {props?.isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Form
              onFinish={onFinish}
              form={form}
              initialValues={getInitialValues()}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col md={6}>
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Name")}
                  </label>
                  <Form.Item
                    name="bname"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          "home_page.homepage.Business_name_is_required"
                        )}`,
                      },
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
                        message: "Business category is required",
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("home_page.homepage.choose")}
                      size="large"
                      showSearch={true}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={addCategory}
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
                      {businessCategory?.length &&
                        businessCategory?.map((category: any) => (
                          <Option
                            key={category?.id}
                            value={category?.btitle}
                          >
                            {category?.btitle}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  {/* <label className="formLabel">Working Time</label>
              <Form.Item
                name="worktime"
                style={{ marginBottom: 10 }}
                rules={[
                  { required: true, message: `${t("home_page.homepage.Working_time_is_required")}` },
                ]}
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
                <label> {t("home_page.homepage.StandardizeShifts")}</label>
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
                    {t("home_page.homepage.Website")}
                  </label>
                  <Form.Item name="website" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder={t("home_page.homepage.Website")}
                      size="large"
                    />
                  </Form.Item>
                  {user?.companyInfo?.tax === "gst" ? (
                    <>
                      <label className="formLabel">
                        {t("home_page.homepage.GSTIN_UIN")}
                      </label>
                      <Form.Item name="taxno" style={{ marginBottom: 10 }}>
                        <Input
                          placeholder={t("home_page.homepage.GSTIN_UIN")}
                          size="large"
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <label className="formLabel">{t("home_page.homepage.vat_number")}</label>
                      <Form.Item name="taxno" style={{ marginBottom: 10 }}>
                        <Input placeholder="Vat Number" size="large" />
                      </Form.Item>
                    </>
                  )}
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Address")}
                  </label>
                  <Form.Item name="fulladdress" style={{ marginBottom: 10 }}>
                    <Input.TextArea
                      placeholder={t("home_page.homepage.Business_Address")}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>
               
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label className="profile-business-radioLableText">{t("home_page.homepage.Taxation_Type")} :</label>
                    <Form.Item name="tax" style={{ marginBottom: 10 }}>
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
                          <label className="profile-business-radioLableText">
                          {t("home_page.homepage.Assessee_of_other_Territory")} :
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
                          <label className="profile-business-radioLableText">
                          {t("home_page.homepage.EInvoice_applicable")} :
                          </label>
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
                          <label className="profile-business-radioLableText">
                          {t("home_page.homepage.Eway_bill_applicable")} :
                          </label>
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
                </Col>
                <Col md={6}>
                  <label className="formLabel">
                    {t("home_page.homepage.Business_Phone")}
                  </label>
                  <Form.Item name="mobileNumber" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder="Phone Number"
                      size="large"
                      className="input-field"
                      addonBefore={<PrefixSelector countryCode = {countryCode}/>}
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
                    {t("home_page.homepage.Business_Email")}
                  </label>
                  <Form.Item
                    name="cemail"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: `${t(
                          "home_page.homepage.Please_enter_a_valid_email_address"
                        )}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("home_page.homepage.Business_Email")}
                      size="large"
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Bank_For_Sales_Invoice")}
                  </label>
                  <Form.Item
                    name="defaultBank"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `${t("home_page.homepage.Bank_ms")}`,
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("home_page.homepage.Add_New_Bank")}
                      size="large"
                    >
                      {bankList.length &&
                        bankList.map((item: any) => (
                          <Select.Option
                            key={item.list.id}
                            value={item.list.id}
                          >
                            {item.list.laccount}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
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
                          "home_page.homepage.Please_elect_your_Country"
                        )}`,
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("home_page.homepage.Choose_your_country")}
                      showSearch={true}
                      onChange={(val) => handleSelectCountry(val)
                      }
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      size="large"
                    >
                      {countries &&
                        countries?.map((country: any) => (
                          <Select.Option key={country?.id} value={country?.id}>
                            {country?.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.state")}
                  </label>
                  <Form.Item
                    name={'state'}
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          "home_page.homepage.Please_select_your_state"
                        )}`,
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("home_page.homepage.Choose_your_state")}
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

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <label className="profile-business-radioLableText" >{t("home_page.homepage.Enable_Loyalty_Program")} : </label>
                    <Form.Item name="isLoyaltyEnabled" style={{ marginBottom: 10 }}>
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 5,
                        }}
                      >
                          <Radio value={true}>{t("home_page.homepage.Enable")} </Radio>
                          <Radio value={false}> {t("home_page.homepage.Disable")} </Radio>
                      
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <Row>
                    <br />
                    <Col md={6}></Col>
                    <Col md={6}>
                      {canUpdateSettings() && (
                        <Button
                          size="large"
                          type="primary"
                          loading={isLoading}
                          disabled={props?.isLoading || isInitialLoading}
                          style={{
                            height: 45,
                            fontWeight: "600",
                            width: "100%",
                            display: "block",
                            marginTop: 18,
                          }}
                          htmlType="submit"
                        >
                          {t("home_page.homepage.Update")}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
          <ImagePicker
            open={toggle}
            modalClose={() => toggleModal(false)}
            data={user}
            refreshData={props.onChange}
          />
          <br />

          {isForm && (
            <CreateSettings
              open={isForm}
              close={() => setIsForm(false)}
              source={"category"}
              id={"create"}
              reload={GetBusinessCategory}
            />
          )}
        </Container>
      )}
    </>
  );
}

export default Business;
