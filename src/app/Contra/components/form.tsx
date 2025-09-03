import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import API from "../../../config/api";
import { GET, POST } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import moment from "moment";

function ContraForm() {
  const { Option } = Select;
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const adminid = user?.id;
  const [bank, setBank] = useState<any>([]);
  const [form] = Form.useForm();

  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);
      setBank(data.bankList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBankList();
  }, []);

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const url =
        type == "create"
          ? API.BANK_TRANSFER
          : `ledger_details/updateContraVoucher/${id}`;

      const data: any = await POST(url, {
        ...values,
        sdate: dayjs(values?.sdate).format("YYYY-MM-DD"),
        adminid,
        userid: user.id,
        type: "1",
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
      });
      if (data.status) {
        notification.success({
          message: "Success",
          description: "Transfer completed successfully",
        });
        navigate(`/usr/contra`);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to transfer the amount",
        });
      }
    } catch (error) {
      notification.error({
        message: "Server Error",
        description: "Failed to transfer amount!! Please try again later",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadLedgerDeatails = async () => {
    await fetchBankList();
    let URL = API.LEDGER_DEATAILS + id;
    const data: any = await GET(URL, null);
    form.setFieldsValue({
      paidfrom: data?.data?.baseid
        ? Number(data?.data?.paidfrom)
        : Number(data?.data?.ledger),
      paidto: data?.data?.baseid
        ? Number(data?.data?.ledger)
        : Number(data?.data?.paidfrom).toString(),
      sdate: dayjs(data.data.sdate),
      reference: data.data.reference,
      amount: Math.abs(data.data.total),
      paidmethod: data.data.paidmethod,
      description: data.data.description,
    });
  };

  useEffect(() => {
    if (type === "edit") {
      LoadLedgerDeatails();
    }else{
      form.setFieldValue("sdate", dayjs(new Date()))
    }
  }, []);
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.contra_voucher")}
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.contra_voucher")}
        secondPathLink={location.pathname}
        secondPathText={type === "edit" ? "Update Contra" :t("home_page.homepage.Create_Contra")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <Form onFinish={submitHandler} form={form}>
              <Row>
                <Col md="6">
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.PaidFrom")}
                    </label>
                    <Form.Item
                      name="paidfrom"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="From" size="large">
                        {bank.map((item: any) => (
                          <>
                            <Select.Option
                              key={item.list.id}
                              value={item.list.id}
                            >
                              {item.list.laccount}
                            </Select.Option>
                          </>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.Paid_Method")}
                    </label>
                    <Form.Item
                      name="paidmethod"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="choose one" size="large">
                        <Option value="cash">
                          {t("home_page.homepage.Cash")}
                        </Option>
                        <Option value="current">
                          {t("home_page.homepage.Current")}
                        </Option>
                        <Option value="cheque">
                          {t("home_page.homepage.Cheque")}
                        </Option>
                        <Option value="other">
                          {t("home_page.homepage.Electronic")}
                        </Option>
                        <Option value="card">
                          {t("home_page.homepage.Credit/DebitCard")}
                        </Option>
                        <Option value="loan">
                          {t("home_page.homepage.PayPal")}
                        </Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.AmountTransferred")}
                    </label>
                    <Form.Item
                      name="amount"
                      style={{ marginBottom: 10 }}
                      rules={[
                        {
                          type: "number",
                          min: 1,
                          message: "Please enter a number greater than zero",
                          transform: (value) => parseFloat(value),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder={t("home_page.homepage.Amount")}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.Description")}
                    </label>
                    <Form.Item name="description" style={{ marginBottom: 10 }}>
                      <Input
                        placeholder={t("home_page.homepage.Description")}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col md="6">
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.PaidTo")}
                    </label>
                    <Form.Item
                      name="paidto"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="To" size="large">
                        {bank.map((item: any) => (
                          <>
                            <Select.Option
                              key={item.list.id}
                              value={item.list.id}
                            >
                              {item.list.laccount}
                            </Select.Option>
                          </>
                        ))}
                      </Select>
                    </Form.Item>
                    </div>
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.Payment_Date")}
                    </label>
                    <Form.Item name={"sdate"} rules={[{required:true}]}>
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
                  <div className="formItem">
                    <label className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </label>
                    <Form.Item
                      name="reference"
                      style={{ marginBottom: 10 }}
                    >
                      <Input
                        placeholder={t("home_page.homepage.Reference")}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                  <br />
                  <Row>
                    <Col md="6">
                      <Button size="large" block onClick={() => navigate(-1)}>
                        {t("home_page.homepage.Cancel")}
                      </Button>
                    </Col>
                    <Col md="6">
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        // loading={isLoading}
                        block
                      >
                        {type === "edit" ? "Update" : "Sumbit"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      )}
    </div>
  );
}
export default ContraForm;
