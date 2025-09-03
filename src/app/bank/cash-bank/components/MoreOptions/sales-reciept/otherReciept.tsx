import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../../../../config/api";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import PageHeader from "../../../../../../components/pageHeader";
import { useTranslation } from "react-i18next";
function OtherReceipt() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, update } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [customerst, setCustomer] = useState([]);
  const [isBtLoading, setIsBtLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>();
  const [searchQurey, setSearchQurey] = useState<any>("");
  const [initialLedgerData, setInitialLedgerData] = useState<any>();
  const [isMode, setIsMode] = useState(false);

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
      form.setFieldsValue({
        sdate: moment(new Date()),
      });
      let URL = API.LEDGER_DEATAILS + update;

      const data: any = await GET(URL, null);
      setInitialLedgerData(data?.data);
      form.setFieldsValue({
        cname: data?.data?.name,
        sdate: dayjs(data?.data?.sdate),
        reference: data?.data?.reference,
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
    fetchLedgerDetails();
  }, []);

  const onValuesChange = (val: any, data: any) => {
    if (val?.payment_mode == "Cheque" || data?.payment_mode == "Cheque") {
      setIsMode(true);
    } else {
      setIsMode(false);
    }
  };

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
        paidto: Number(id),
        paidmethod: val?.payment_mode,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Other Receipt",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        booleantype: cnamValue.name === "cname" ? "7" : "97",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.payment_mode == "Cheque" && {
          check_no: val.check_no,
          bank_name: val.bank_name,
          exp_date: val.exp_date,
        }),
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
        amount: parseInt(val?.amount),
        booleantype: cnamValue?.id
          ? cnamValue.name === "cname"
            ? "7"
            : "97"
          : null,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.payment_mode == "Cheque" && {
          check_no: val.check_no,
          bank_name: val.bank_name,
          exp_date: val.exp_date,
        }),
      };
      let obj = update ? reqObjPut : reqObjPost;
      let URL = update
        ? API.UPDATE_BANK_DETAILS + update
        : API.ADD_OTHER_RECEIPT;
      let METHOD = update ? PUT : POST;
      const response: any = await METHOD(URL, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description: update
            ? "Other receipt updated successfully"
            : "Other receipt created successfully",
        });
        setIsBtLoading(false);
        navigate(`/usr/cashBank/${id}/details/transaction`);
      } else {
        setIsBtLoading(false);
        notification.error({
          message: "Failed",
          description: update
            ? "Failed to update other receipt"
            : "Failed to create other receipt",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: update
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

  return (
    <>
      {update && (
        <>
          <PageHeader
            title={t("home_page.homepage.Payment")}
            firstPathLink={"/usr/cashBank"}
            firstPathText={t("home_page.homepage.Bank")}
            secondPathLink={`/usr/cashBank/${id}/details`}
            secondPathText={t("home_page.homepage.BankDetails")}
            thirdPathLink={`/usr/cashBank/${id}/details/reciept/customer`}
            thirdPathText={t("home_page.homepage.paYment")}
          />
          <br />
        </>
      )}
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {update ? "Update" : "Add"} Other Receipt
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
              {isMode === true ? (
                <>
                  <Col md={4}>
                    <label className="formLabel">cheque No</label>
                    <Form.Item name={"check_no"} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">Bank Name</label>
                    <Form.Item name={"bank_name"} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">Cheque Exp Date</label>
                    <Form.Item name={"exp_date"} rules={[{ required: true }]}>
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
                        inputReadOnly
                        disabledDate={(currentDate) => {
                          const today = moment().startOf("day");
                          return currentDate && currentDate < today;
                        }}
                      />
                    </Form.Item>
                  </Col>
                </>
              ) : null}
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
                    <DatePicker
                      style={{ width: "100%" }}
                      size="large"
                      disabledDate={(currentDate) => {
                        const financialYearStart =
                          moment(financialYear).startOf("day");
                        return (
                          financialYearStart &&
                          currentDate &&
                          currentDate < financialYearStart
                        );
                      }}
                    />
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
                        message: "Please enter a Amount Paid",
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
              {(update || amount) && (
                <Col md={4}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={isBtLoading}
                  >
                    {update ? "UPDATE" : "SAVE"}
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default OtherReceipt;
