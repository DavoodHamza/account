import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
function OtherReceiptForm() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [customerst, setCustomer] = useState([]);
  const [isBtLoading, setIsBtLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>(0);
  const [searchQurey, setSearchQurey] = useState<any>("");
  const [initialLedgerData, setInitialLedgerData] = useState<any>();
  const [bankData, setBankData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCash, seIsCash] = useState(false);
  const location = useLocation();

  const fetchEntries = async () => {
    try {
      const url =
        API.GET_ALL_ENTRIES +
        user?.id +
        `/${user?.companyInfo?.id}?name=${searchQurey}`;
      const { data }: any = await GET(url, null);
      setCustomer(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLedgerDetails = async () => {
    try {
      let URL = API.LEDGER_DEATAILS + id;

      const data: any = await GET(URL, null);
      setInitialLedgerData(data?.data);
      form.setFieldsValue({
        cname: data?.data?.name,
        sdate: dayjs(data?.data?.sdate),
        reference: data?.data?.reference,
        paidto: data?.data?.ledger.toString(),
        payment_mode: data?.data?.paidmethod,
        amount: data?.data?.debit,
        Details: data?.data?.details,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchEntries();
    }, 500);
  }, [searchQurey]);

  useEffect(() => {
    if (type === "edit") {
      fetchLedgerDetails();
    }else{
      form.setFieldValue("sdate", dayjs(new Date()))
    }
  }, []);

  const onFinish = async (val: any) => {
    try {
      let cnamValue;
      try {
        cnamValue = JSON.parse(val.cname);
      } catch (error) {
        cnamValue = val.cname;
      }
      const data = [
        {
          id: {},
          ledger: {},
          laccount: "",
          details: "",
          amount: 0,
          vatamt: 0,
          total: 0,
          vat: 0,
        },
      ];

      setIsBtLoading(true);
      let formatedDate = dayjs(val?.sdate).format("YYYY-MM-DD");
      let reqObjPost = {
        userid: user?.id,
        item: data,
        amount: parseInt(val?.amount),
        [cnamValue.name]: cnamValue.id,
        paidmethod: val?.payment_mode,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Other Receipt",
        adminid: user?.id,
        logintype: "user",
        paidto: val?.paidto,
        userdate: formatedDate,
        booleantype: cnamValue.name === "cname" ? "7" : "97",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };

      const amt = Number(initialLedgerData?.credit) - Number(val?.amount);
      const running = Number(initialLedgerData?.running_total) - Number(amt);

      let reqObjPut = {
        [cnamValue.name ? cnamValue.name : null]: cnamValue?.id
          ? cnamValue?.id
          : null,
        debit: Number(val.amount),
        running_total: running,
        reference: val?.reference,
        sdate: formatedDate,
        paidto: val?.paidto,
        amount: parseInt(val?.amount),
        booleantype: cnamValue?.id
          ? cnamValue.name === "cname"
            ? "7"
            : "97"
          : null,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      let obj = type === "edit" ? reqObjPut : reqObjPost;
      let URL =
        type === "edit" ? API.UPDATE_BANK_DETAILS + id : API.ADD_OTHER_RECEIPT;
      let METHOD = type === "edit" ? PUT : POST;
      const response: any = await METHOD(URL, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description:
            type === "edit"
              ? "Other receipt updated successfully"
              : "Other receipt created successfully",
        });
        setIsBtLoading(false);
        navigate(`/usr/receipts/other-receipt`);
      } else {
        setIsBtLoading(false);
        notification.error({
          message: "Failed",
          description:
            type === "edit"
              ? "Failed to update other receipt"
              : "Failed to create other receipt",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          type === "edit"
            ? "Failed to update other receipt!! Please try again later "
            : "Failed to create other receipt!! Please try again later",
      });
    }
  };
  let paymentMode = [
    { id: 1, name: "Cheque", value: "Cheque" },
    { id: 2, name: "Electronic", value: "Electronic" },
    { id: 3, name: "Credit Card", value: "Credit Card" },
    { id: 4, name: "Debit Card", value: "Debit Card" },
    // { id: 5, name: "PayPal", value: "Paypal" },
  ];

  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);
      setBankData(data?.bankList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);
  const onValuesChange = (val: any) => {
    if (val.paidto) {
      let isCash =
        bankData
          ?.find((item: any) => item?.list?.id === Number(val?.paidto))
          ?.list.laccount.toUpperCase() === "Cash".toUpperCase();
      seIsCash(isCash);
    }
  };
  return (
    <>
      <PageHeader
        title={t("home_page.homepage.OtherReceipt")}
        firstPathLink={`usr/receipts/other-receipt`}
        firstPathText="Other Receipt"
        secondPathLink={location.pathname}
        secondPathText={
          type === "edit" ? "Update Other Receipt" : "Create Other Receipt"
        }
      />
      <br />
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {type === "edit" ? "Update" : "Add"} Other Receipt
              </Col>
              <Col md={12}>
                {t("home_page.homepage.Manage-paymentwithledgers")}
              </Col>
              <br />
              <br />
              <hr />
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.AccountName")}
                  </label>
                  <Form.Item
                    name="cname"
                    rules={[
                      {
                        required: true,
                        message: "Please choose a ledger",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      // onChange={handleSelect}
                      onSearch={(val) => setSearchQurey(val)}
                      showSearch
                      filterOption={false}
                    >
                      {customerst
                        ?.filter(
                          (item: any) =>
                            item?.name
                              ?.toLowerCase()
                              .includes(searchQurey.toLowerCase()) ||
                            item?.laccount
                              ?.toLowerCase()
                              .includes(searchQurey.toLowerCase())
                        )
                        .map((item: any) => {
                          let obj = {
                            name: item?.laccount
                              ? "ledger"
                              : item?.name
                              ? "cname"
                              : null,
                            id: item.id,
                          };
                          let stringObj = JSON.stringify(obj);
                          return (
                            <Select.Option value={stringObj} key={item.id}>
                              {item.bus_name || item?.laccount}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <br />
              <Col md={isCash ? 8 : 4}>
                <label className="formLabel">Ledger</label>
                <Form.Item
                  name="paidto"
                  rules={[
                    { required: true, message: "Please select a ledger" },
                  ]}
                >
                  <Select
                    //   onSearch={(val) => setCustomerSerch(val)}
                    size="large"
                    // placeholder="Ledger"
                    //   showSearch
                    //   allowClear
                    //   filterOption={false}
                  >
                    {bankData?.map((item: any) => (
                      <Select.Option key={item?.list?.id}>
                        {item?.list?.laccount}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {isCash === true ? null : (
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.PaymentMethod")}
                    </label>
                    <Form.Item
                      name={"payment_mode"}
                      rules={[
                        {
                          required: true,
                          message: "Please select payment mode",
                        },
                      ]}
                    >
                      <Select size="large">
                        {paymentMode?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value}>
                              {item?.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              )}
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.REFERENCE")}
                  </label>
                  <Form.Item name="reference">
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.RECEIPTDATE")}
                  </label>
                  <Form.Item
                    name="sdate"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a Refund Date",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} size="large" 
                    disabledDate={(currentDate) => {
                      const financialYearStart =
                        moment(financialYear).startOf("day");
                      return (
                        financialYearStart &&
                        currentDate &&
                        currentDate < financialYearStart
                      );
                    }}/>
                  </Form.Item>
                </div>
              </Col>{" "}
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.AMOUNTPAID")}*
                  </label>
                  <Form.Item
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter amount",
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={(val: any) => setAmount(val)}
                      type="number"
                      controls={false}
                      style={{ width: "100%" }}
                      size="large"
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col md={8}></Col>
              <Col md={4}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isBtLoading}
                >
                  {type === "edit" ? "UPDATE" : "SAVE"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default OtherReceiptForm;
