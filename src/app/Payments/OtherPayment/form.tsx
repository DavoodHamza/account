import React from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import { paymentMode } from "../../bank/cash-bank/components/MoreOptions/component/paymentMode";
import moment from "moment";

function OtherPaymentForm(props: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState<any>();
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<any>();
  const [searchQurey, setSearchQurey] = useState("");
  const [initialData, setInitialData] = useState<any>();
  const [isCash, seIsCash] = useState(false);
  const location = useLocation();
  const [balance, setBalance] = useState<any>();

  useEffect(() => {
    if(type === "edit") {
      legderDetails();
    }else{
      form.setFieldValue("reciept_date", dayjs(new Date()));//set default reciept_date
    }
  }, []);
  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + id;
    try {
      const response: any = await GET(url, null);
      let data = response?.data;
      setInitialData(data);

      form.setFieldsValue({
        account_name: data?.name,
        reciept_date: dayjs(data?.sdate),
        paidto: (data?.ledger).toString(),
        reference: data?.reference,
        amount_paid: Number(data?.credit),
        payment_mode: data?.paidmethod,
        Details: data?.details,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (value: any) => {
    const selected = bankData.find(
      (item: any) => item.list.id === Number(value)
    );
    setBalance(selected?.openingBalance);
  };

  const fetchAllEntries = async () => {
    try {
      const url =
        API.GET_ALL_ENTRIES +
        user?.id +
        `/${user?.companyInfo?.id}?name=${searchQurey}`;
      const { data }: any = await GET(url, null);
      setData(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchAllEntries();
    }, 500);
  }, [searchQurey]);

  const onFinish = async (val: any) => {
    try {
      if (balance < val.amount_paid) {
        notification.error({
          message: `There is an insufficient balance in the available cash. The balance is ${balance}.`,
        });
        return;
      }
      setIsLoading(true);
      let url =
        type === "edit"
          ? API.UPDATE_BANK_DETAILS + Number(id)
          : API.GET_PURCHASE_ID_BY_LIST;
      let cnamValue;
      try {
        cnamValue = JSON.parse(val.account_name);
      } catch (error) {
        cnamValue = val.account_name;
      }
      const columnsData = [
        {
          id: {},
          ledger: detail?.data && detail?.data,
          laccount: "",
          details: val.details,
          amount: val.amount_paid.toString(),
          vatamt: 0,
          total: val.amount_paid.toString(),
          vat: 0,
        },
      ];
      let formattedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
      let reqObjPost = {
        sdate: formattedDate,
        reference: val.reference,
        paidmethod: val?.payment_mode,
        paidto: val?.paidto,
        [cnamValue.name]: cnamValue.id,
        userid: user?.id,
        amount: val.amount_paid.toString(),
        adminid: user?.id,
        columns: columnsData,
        supplier: { ...detail },
        userdate: formattedDate,
        booleantype: cnamValue.name === "cname" ? "8" : "97",
        details: val?.Details,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      const amt = Number(initialData?.debit) - Number(val?.amount_paid);
      const out = Number(initialData?.outstanding) + Number(amt);
      const running = Number(initialData?.running_total) - Math.abs(amt);
      let reqObjPut = {
        [cnamValue.name ? cnamValue.name : null]: cnamValue?.id
          ? cnamValue?.id
          : null,
        reference: val.reference,
        credit: Number(val.amount_paid),
        sdate: formattedDate,
        total: val.amount_paid.toString(),
        booleantype: cnamValue?.id
          ? cnamValue.name === "sname"
            ? "8"
            : "97"
          : null,
        details: val?.Details,
        paidto: val?.paidto,
        amount: Number(val.amount_paid),
        running_total: running,
        type: "Other Payment",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      const data: any =
        type === "edit"
          ? await PUT(url, reqObjPut)
          : await POST(url, reqObjPost);

      if (data.status) {
        notification.success({
          message: "Success",
          description: `Other Payment ${
            type === "edit" ? "updated" : "added"
          } successfully`,
        });
        navigate(`/usr/payments/other-payment`);
        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            type === "edit" ? "update" : "add"
          } other Payment`,
        });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          type === "edit" ? "update" : "add"
        } other Payment!! Please try again later`,
      });
    }
  };

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
        title={t("home_page.homepage.OtherPayment")}
        firstPathLink={`usr/payments/other-payment`}
        firstPathText="Other Payment"
        secondPathLink={location.pathname}
        secondPathText={
          type === "edit" ? "Update Other Payment" : "Create Other Payment"
        }
      />
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Col className="Table-Txt" md={12}>
              {t("home_page.homepage.Add/UpdateOtherPayment")}
            </Col>
            <Col md={12}>{t("home_page.homepage.Managepayments")}</Col>
            <br />
            <hr />
            <Form
              onFinish={onFinish}
              form={form}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Account Name")}
                    </label>
                    <Form.Item
                      name={"account_name"}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        // onChange={handleSelect}
                        size="large"
                        placeholder={t("home_page.homepage.Choose_an_account")}
                        onSearch={(val) => setSearchQurey(val)}
                        filterOption={false}
                      >
                        {data
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
                <Col md={isCash ? 8 : 4}>
                  <label className="formLabel">Ledger(Paid From)</label>
                  <Form.Item
                    name="paidto"
                    rules={[
                      { required: true, message: "Please select a ledger" },
                    ]}
                  >
                    <Select
                      //   onSearch={(val) => setCustomerSerch(val)}
                      size="large"
                      placeholder="Ledger"
                      onChange={handleChange}
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
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          placeholder={t("home_page.homepage.Choosemethod")}
                        >
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
              </Row>
              <Row className="align-items-center">
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.RecieptDate")}
                    </label>
                    <Form.Item
                      name={"reciept_date"}
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
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </label>
                    <Form.Item name={"reference"}>
                      <Input
                        size="large"
                        placeholder={t("home_page.homepage.Reference")}
                      />
                    </Form.Item>
                  </div>
                </Col>

                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Details")}
                    </label>
                    <Form.Item name={"Details"}>
                      <Input
                        size="large"
                        placeholder={t("home_page.homepage.Details")}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.AmountPaid")}
                    </label>
                    <Form.Item
                      name={"amount_paid"}
                      rules={[
                        {
                          required: true,
                          message: t("home_page.homepage.Pleaseentertheamount"),
                        },
                        {
                          validator: (_, value) => {
                            if (value > props?.balance) {
                              notification.error({
                                message: `Insufficient balance ( Balance : ${props?.balance} )`,
                              });
                              return Promise.reject();
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        size="large"
                        placeholder={t("home_page.homepage.Enteramount")}
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4} />
                <Col md={4}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ height: 40, marginTop: 20 }}
                  >
                    {t("home_page.homepage.submit")}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      )}
    </>
  );
}

export default OtherPaymentForm;
