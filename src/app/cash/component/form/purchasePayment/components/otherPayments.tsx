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
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../../../config/api";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
function OtherPayments({ balance }: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [customerst, setCustomer] = useState([]);
  const [searchQurey, setSearchQurey] = useState("");
  const [idCustomer, setIdCustomer] = useState([]);
  const [isBtLoading, setIsBtLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>();

  const fetchAllEntries = async () => {
    try {
      if (type == "create") {
        form.setFieldsValue({
          sdate: dayjs(new Date()),
        });
      }
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

  const LoadLedgerDeatails = async () => {
    try {
      let URL = API.LEDGER_DEATAILS + type + "/" + user?.id + "/" + id;
      const data: any = await GET(URL, null);
      setAmount(data?.data?.total);
      form.setFieldsValue({
        cname: data?.data?.name || "",
        amount: data?.data?.credit,
        sdate: dayjs(data?.data?.sdate),
        reference: data?.data?.reference,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (type !== "create") {
      LoadLedgerDeatails();
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      fetchAllEntries();
    }, 500);
  }, [searchQurey]);

  const onFinish = async (val: any) => {
    try {
      if (type == "create" && balance < Number(val.amount)) {
        notification.error({
          message: `There is an insufficient balance in the available cash. The balance is ${balance}.`,
        });
      } else {
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
            details: val.details,
            amount: val.amount.toString(),
            vatamt: 0,
            total: val.amount.toString(),
            vat: 0,
          },
        ];
        setIsBtLoading(true);
        let formatedDate = dayjs(val?.sdate).format("YYYY-MM-DD");
        let reqObjPost = {
          sdate: formatedDate,
          reference: val.reference,
          paidmethod: "cash",
          paidto: Number(id),
          [cnamValue.name]: cnamValue.id,
          userid: user?.id,
          amount: val.amount.toString(),
          adminid: user?.id,
          columns: data,
          supplier: idCustomer,
          userdate: formatedDate,
          booleantype: cnamValue.name == "cname" ? "8" : "97",
          createdBy: user?.isStaff ? user?.staff?.id : user?.id,
          companyid: user?.companyInfo?.id,
        };
        let reqObjPut = {
          [cnamValue.name ? cnamValue.name : null]: cnamValue?.id
            ? cnamValue?.id
            : null,
          reference: val.reference,
          credit: Number(val.amount),
          sdate: formatedDate,
          total: val.amount.toString(),
          booleantype: cnamValue?.id
            ? cnamValue.name == "cname"
              ? "8"
              : "97"
            : null,
          amount: Number(val.amount_paid),
          createdBy: user?.isStaff ? user?.staff?.id : user?.id,
          companyid: user?.companyInfo?.id,
        };
        let obj = type == "create" ? reqObjPost : reqObjPut;
        let URL =
          type == "create"
            ? "purchaseinvoice/addSupOtherPaymentCash"
            : "ledger_details/updateCashDeatails/" + type;
        let METHOD = type == "create" ? POST : PUT;
        const response: any = await METHOD(URL, obj);
        if (response.status) {
          notification.success({
            message: "Success",
            description: `Other payment ${
              type === "create" ? "created" : "updated"
            } successfully`,
          });
          setIsBtLoading(false);
          navigate(`/usr/cash/cashTable/${id}`);
        } else {
          notification.error({
            message: "Failed",
            description: `Failed to ${
              type === "create" ? "create" : "update"
            } other payment`,
          });
          setIsBtLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsBtLoading(false);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          type === "create" ? "create" : "update"
        } other payment!! Please try again later`,
      });
    }
  };

  return (
    <>
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {t("home_page.homepage.Add/UpdateOtherPayment")}
              </Col>
              <Col md={12}>{t("home_page.homepage.Manageyournon")}</Col>
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
                  <label className="formLabel">
                    {t("home_page.homepage.AMOUNTPAID")}*
                  </label>
                  <Form.Item
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.PleaseAmountPaid"),
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={(val: any) => setAmount(val)}
                      style={{ width: "100%" }}
                      size="large"
                      min="0"
                    />
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
                        message: t("home_page.homepage.PleaseRefundDate"),
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
              </Col>
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
                    {type === "create" ? "SAVE" : "UPDATE"}{" "}
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

export default OtherPayments;
