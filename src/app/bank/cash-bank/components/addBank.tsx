import { Button, Card, Form, Input, Select, notification } from "antd";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/pageHeader";
import API from "../../../../config/api";
import { update } from "../../../../redux/slices/userSlice";
import { POST } from "../../../../utils/apiCalls";
function AddBankDetails() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  let type = location?.state?.type;
  const bankList: any = location?.state?.data?.list;
  const [bankType, setBankType] = useState(bankList?.acctype);
  const [isLoading, setIsLoading] = useState(false);
  let bank = [
    { id: 1, value: "current", bank: "current" },
    { id: 2, value: "savings", bank: "savings" },
    { id: 3, value: "card", bank: "credit" },
    { id: 4, value: "loan", bank: "loan" },
    { id: 5, value: "other", bank: "other" },
  ];

  const onFinish = async (val: any) => {
    setIsLoading(true);
    let url =
      type === "2" ? API.UPDATE_BANK : type === "1" ? API.ADD_BANK : null;
    let body = {
      adminid: user?.id,
      userid: user?.id,
      logintype: "user",
      acctype: val?.account_type,
      accnum: val?.account_no || "",
      bicnum: val?.bic_bank_swift || "",
      accountname: val?.account_name || "",
      cardnum: val?.last_digit_of_card,
      ibannum: val?.i_ban || "",
      laccount: val?.bank_name,
      nominalcode: val?.nominal_code,
      opening: val?.opening_balance || 0.0,
      paidmethod: "",
      id: bankList?.id,
      type: type,
      sortcode1: val?.sort_code_1 || "",
      sortcode2: val?.sort_code_2 || "",
      sortcode3: val?.sort_code_3 || "",
      userdate: new Date(),
      date: new Date(),
      sdate: user?.companyInfo?.financial_year_start,
      branch: val?.branch,
      ifsc: val?.ifsc,
      createdBy: user?.isStaff ? user?.staff?.id : user?.id,
      companyid: user?.companyInfo?.id,
    };
    try {
      const data: any =
        type === "2"
          ? //? await PUT(url, body)
            await POST(url, body)
          : type === "1"
          ? await POST(url, body)
          : null;

      if (data?.status) {
        if (user?.companyInfo?.defaultBank === data?.data?.ledger) {
          const obj = {
            isStaff: user?.isStaff,
            staff: user?.staff,
            id: user?.id,
            email: user?.email,
            tokenid: user?.tokenid,
            fullName: user?.fullName,
            password: user?.password,
            phonenumber: user?.phonenumber,
            status: user?.status,
            adminid: user?.id,
            companyid: user?.companyInfo?.id,
            countryid: user?.countryid,
            usertype: user?.usertype,
            active: user?.active,
            dob: user.dob,
            country_code: user?.country_code,
            mobileverified: user.mobileverified,
            token: user?.token,
            countryInfo: user?.companyInfo?.countryInfo,
            companyInfo: user?.companyInfo,
            bankInfo: {
              id: body.id,
              nominalcode: body.nominalcode,
              laccount: body.laccount,
              accnum: body.accnum,
              cardnum: body.cardnum,
              paidmethod: body.paidmethod,
              ibannum: body.ibannum,
              bicnum: body.bicnum,
              // total:body.total,
              branch: body.branch,
              ifsc: body.ifsc,
            },
          };
          dispatch(update(obj));
        }

        notification.success({
          message: "Success",
          description:
            type === "1"
              ? "New bank added successfully"
              : "Bank details updated successfully",
        });
        navigate("/usr/cashBank");
        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description:
            type === "1" ? data.message : "Failed to update bank details",
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description:
          type === "1"
            ? "Failed to create new bank"
            : "Failed to update bank details",
      });
    }
  };
  const handleSelect = (val: any) => {
    setBankType(val);
  };
  return (
    <>
      <PageHeader
        title={type === "2" ? "Update Bank" : "Add Bank"}
        firstPathLink={"/usr/bank"}
        firstPathText={"Bank"}
        secondPathLink={location.pathname}
        secondPathText={type === "2" ? "Update Bank" : "Add Bank"}
      />
      <br />
      <Container>
        <Card>
          <Form
            onFinish={onFinish}
            initialValues={{
              account_type: bankList?.acctype,
              bank_name: bankList?.laccount,
              account_no: bankList?.accnum,
              sort_code_1: bankList?.sortcode1,
              sort_code_2: bankList?.sortcode2,
              sort_code_3: bankList?.sortcode3,
              i_ban: bankList?.ibannum,
              opening_balance: bankList?.opening,
              bic_bank_swift: bankList?.bicnum,
              account_name: bankList?.accountname,
              nominal_code: bankList?.nominalcode,
              last_digit_of_card: bankList?.cardnum,
              branch: bankList?.branch,
              ifsc: bankList?.ifsc,
            }}
          >
            <Row>
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.AccountType")}
                  </label>
                  <Form.Item
                    name="account_type"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Account type is required" },
                    ]}
                  >
                    <Select onChange={handleSelect}>
                      {bank?.map((item: any) => {
                        return (
                          <Select.Option key={item?.id} value={item?.value}>
                            {item?.bank}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.BankName")}
                  </label>
                  <Form.Item
                    name="bank_name"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Bank name is required" },
                    ]}
                  >
                    <Input size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </Col>

              {bankType === "current" ||
              bankType === "loan" ||
              bankType === "savings" ? (
                <Col md={6}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Accountnumber")}
                    </label>
                    <Form.Item
                      name="account_no"
                      style={{ marginBottom: 10 }}
                      rules={[
                        {
                          required: true,
                          message: "Account number is required",
                        },
                      ]}
                    >
                      <Input
                        style={{ width: "100%" }}
                        type="number"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
              {bankType === "current" ||
              bankType === "loan" ||
              bankType === "savings" ? (
                <Col md={6}>
                  <Row>
                    <Col md={4}>
                      <div>
                        <label className="formLabel">
                          {t("home_page.homepage.SortCode(00)")}
                        </label>
                        <Form.Item
                          name="sort_code_1"
                          style={{ marginBottom: 10 }}
                        >
                          <Input
                            style={{ width: "100%" }}
                            type="number"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <label className="formLabel">
                          {t("home_page.homepage.SortCode(00)")}
                        </label>
                        <Form.Item
                          name="sort_code_2"
                          style={{ marginBottom: 10 }}
                        >
                          <Input
                            style={{ width: "100%" }}
                            type="number"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div>
                        <label className="formLabel">
                          {t("home_page.homepage.SortCode(00)")}
                        </label>
                        <Form.Item
                          name="sort_code_3"
                          style={{ marginBottom: 10 }}
                        >
                          <Input
                            style={{ width: "100%" }}
                            type="number"
                            size="large"
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </Col>
              ) : null}
              <Col md={6}>
                <div>
                  <label className="formLabel">Account Name</label>
                  <Form.Item name="account_name" style={{ marginBottom: 10 }}>
                    <Input style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </div>
              </Col>
              {bankType === "current" ||
              bankType === "loan" ||
              bankType === "savings" ? (
                <Col md={6}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.BIC_BankSwift")}
                    </label>
                    <Form.Item
                      name="bic_bank_swift"
                      style={{ marginBottom: 10 }}
                    >
                      <Input style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.Branch")}
                  </label>
                  <Form.Item name="branch" style={{ marginBottom: 10 }}>
                    <Input style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.Nominal_Code")}
                  </label>
                  <Form.Item
                    name="nominal_code"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "nominal code is required" },
                    ]}
                  >
                    <Input style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.IFSCCode")}
                  </label>
                  <Form.Item
                    name="ifsc"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required:
                          user?.companyInfo?.tax === "gst" ? true : false,
                        message: "ifsc code is required",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </div>
              </Col>

              {bankType === "card" && (
                <Col md={6}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Last4Card")}
                    </label>
                    <Form.Item
                      name="last_digit_of_card"
                      style={{ marginBottom: 10 }}
                    >
                      <Input style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </div>
                </Col>
              )}
              {bankType === "current" ||
              bankType === "loan" ||
              bankType === "savings" ? (
                <Col md={6}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.IBan")}
                    </label>
                    <Form.Item name="i_ban" style={{ marginBottom: 10 }}>
                      <Input style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </div>
                </Col>
              ) : null}
              <br />
              <Col md={6}>
                <div>
                  <label className="formLabel">
                    {t("home_page.homepage.Opening_Balance")}
                  </label>
                  <Form.Item
                    name="opening_balance"
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      style={{ width: "100%" }}
                      type="number"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col md={3}>
                <div></div>
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={() => navigate("/usr/cashBank")}
                >
                  {t("home_page.homepage.Cancel")}
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                >
                  {t("home_page.homepage.submit")}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default AddBankDetails;
