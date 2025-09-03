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
import API from "../../../../../../config/api";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import moment from "moment";
function OtherReceipt() {
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {t} = useTranslation();
  const [customerst, setCustomer] = useState([]);
  const [isBtLoading, setIsBtLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>();
  const [searchQurey, setSearchQurey] = useState<any>("");

  const fetchAllEntries = async () => {
    try {
      if (type == "create") {
        form.setFieldsValue({
          sdate: dayjs(new Date()),
        });
      }
      const url =  API.GET_ALL_ENTRIES + user?.id + `/${user?.companyInfo?.id}?name=${searchQurey}`;
      const { data }: any = await GET(url, null);
      setCustomer(data);
    } catch (error) {
      console.log(error);
    }
  };

  const LoadLedgerDeatails = async () => {
    try {
      let URL = API.LEDGER_DEATAILS + type + '/' + user?.id + '/' + id;
      const data: any = await GET(URL, null);
      setAmount(data?.data?.total);
      form.setFieldsValue({
        cname: data?.data?.name || '',
        amount: data?.data?.debit,
        sdate: dayjs(data?.data?.sdate),
        reference: data?.data?.reference,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      fetchAllEntries();
    },500)
  }, [searchQurey]);

  useEffect(() => {
    if (type !== "create") {
      LoadLedgerDeatails();
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
        amount: val.amount.toString(),
        [cnamValue.name]: cnamValue.id,
        paidto: Number(id),
        paidmethod: "cash",
        sdate: formatedDate,
        reference: val.reference,
        receipttype: "Other Receipt",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        booleantype: cnamValue.name === "cname" ? "7" : "97",
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      };

      let reqObjPut = {
        [cnamValue.name ? cnamValue.name : null]: cnamValue?.id
          ? cnamValue?.id
          : null,
        reference: val.reference,
        debit: Number(val.amount),
        sdate:formatedDate,
        total: val.amount.toString(),
        booleantype: cnamValue?.id
          ? cnamValue.name === "cname"
            ? "7"
            : "97"
          : null,
          createdBy:user?.isStaff ? user?.staff?.id : user?.id,
          companyid:user?.companyInfo?.id
      };
      let obj = type === "create" ? reqObjPost : reqObjPut;
      let URL =
        type === "create"
          ? API.ADD_OTHER_RECEIPT
          : "ledger_details/updateCashDeatails/" + type;
      let METHOD = type === "create" ? POST : PUT;
      const response: any = await METHOD(URL, obj);
      if (response.status) {
        notification.success({message:"Success",description:`Other receipt ${type === "create" ? 'created' : 'updated'} successfully`});
        setIsBtLoading(false);
        navigate(`/usr/cash/cashTable/${id}`);
      } else {
        notification.error({message:"Failed", description:`Failed to ${type === "create" ? 'create' : 'update'} other receipt`});
        setIsBtLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({message:"Server Error", description:`Failed to ${type === "create" ? 'create' : 'update'} other receipt!! Please try again later`});
    }
  };

  return (
    <>
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {t("home_page.homepage.Add/UpdateOtherReceipt")}
              </Col>
              <Col md={12}>
              {t("home_page.homepage.Manage-paymentwithledgers")} 
              </Col>
              <br />
              <br />
              <hr />
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">{t("home_page.homepage.AccountName")}</label>
                  <Form.Item
                    name="cname"
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.SelectSuplierName"),
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
                <br />
                <div className="formItem">
                  <label className="formLabel">{t("home_page.homepage.AMOUNTPAID")}*</label>
                  <Form.Item
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message:t("home_page.homepage.PleaseAmountPaid") ,
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={(val: any) => setAmount(val)}
                      style={{ width: "100%" }}
                      size="large"
                      min='0'
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">{t("home_page.homepage.RECEIPTDATE")}</label>
                  <Form.Item
                    name="sdate"
                    rules={[
                      {
                        required: true,
                        message:t("home_page.homepage.PleaseRefundDate") ,
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
              </Col>
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">{t("home_page.homepage.REFERENCE")}</label>
                  <Form.Item name="reference">
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={8}></Col>
              {amount && (
                <Col md={4}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={isBtLoading}
                  >
                    {type === "create" ? "SAVE" : "UPDATE"}
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
