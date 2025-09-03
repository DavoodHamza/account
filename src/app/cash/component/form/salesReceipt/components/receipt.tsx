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
import InvoiceTable from "../../invoiceTable";
import LoadingBox from "../../../../../../components/loadingBox";
import { useNavigate, useParams } from "react-router-dom";
import NoInvoice from "../../noInvoice";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import moment from "moment";
const columns = [
  {
    name: "data",
    title: t("home_page.homepage.Date"),
    dataType: "date",
    alignment: "center",
    format: "dd-MM-yyyy",
  },
  {
    name: "invoiceno",
    title: t("home_page.homepage.invoice_no"),
    dataType: "string",
    alignment: "center",
  },
  {
    name: "reference",
    title: t("home_page.homepage.Reference"),
    dataType: "string",
    alignment: "center",
  },
  {
    name: "type",
    title: t("home_page.homepage.Type"),
    alignment: "center",
  },
  {
    name: "total",
    title: t("home_page.homepage.total"),
    dataType: "string",
    alignment: "center",
  },
  {
    name: "rout",
    title: t("home_page.homepage.outstanding"),
    dataType: "string",
    alignment: "center",
  },
];

function Receipt() {
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [customerst, setCustomer] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isBtLoading, setIsBtLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>();
  const [routAmount, setRoutAmount] = useState<any>();
  const [rows, setRows] = useState<any>();
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");
  const [ledgerDeatails, setLedgerDeatails] = useState<any>({});

  const LoadCoutemer = async () => {
    try {
      if (type == "create") {
        form.setFieldsValue({
          sdate: dayjs(new Date()),
        });
      }
      let URL =
        "contactMaster/searchList/both/" +
        user?.id +
        `/${user?.companyInfo?.id}/?name=${customerSerch}`;
      const data: any = await GET(URL, null);
      setCustomer(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const LoadLedgerDeatails = async () => {
    try {
      let URL = API.LEDGER_DEATAILS + type + "/" + user?.id + "/" + id;
      const data: any = await GET(URL, null);
      setSaleId(data?.data?.saleid);
      setAmount(data?.data?.total);
      LodeInvice(data?.data?.cname);
      setLedgerDeatails(data?.data);
      form.setFieldsValue({
        cname: Number(data?.data?.cname) || "",
        amount: data?.data?.debit,
        sdate: dayjs(data?.data?.sdate) || "",
        reference: data?.data?.reference,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const LodeInvice = async (val: any) => {
    try {
      setIsLoading(true);
      let URL = API.GET_SALE_INVOICE_BY_ID + val + "/" + user?.id;
      const data: any = await GET(URL, null);
      if (data) {
        setInvoice(data?.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
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
    LoadCoutemer();
  }, [customerSerch]);

  const onFinish = async (val: any) => {
    try {
      let outstandingss = 0;
      let rowData;
      if (rows) {
        rowData = rows?.map((row: any) => {
          let remainout = row.duplicateout - val.amount;
          outstandingss = row.rout - val.amount;
          return {
            ...row,
            amountpaid: row?.duplicateout,
            remainout: remainout,
            outstanding: 0,
          };
        });
      } else {
        outstandingss = Number(ledgerDeatails?.amount) - val.amount;
      }

      setIsBtLoading(true);
      let formatedDate = dayjs(val?.sdate).format("YYYY-MM-DD");
      let reqObjPost = {
        userid: user?.id,
        item: rowData,
        amount: val.amount.toString(),
        cname: val.cname,
        paidto: Number(id),
        paidmethod: "cash",
        sdate: formatedDate,
        reference: val.reference,
        receipttype: "Customer Receipt",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      let reqObjPut = {
        cname: val.cname.toString(),
        reference: val.reference,
        debit: Number(val.amount),
        total: val?.total?.toString(),
        sdate: formatedDate,
        outstanding: outstandingss,
        saleid: rowData ? rowData[0]?.id : null,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      let obj = type === "create" ? reqObjPost : reqObjPut;
      let URL =
        type === "create"
          ? "SaleInvoice/addCustReceiptCash"
          : "ledger_details/updateCashDeatails/" + type;
      let METHOD = type === "create" ? POST : PUT;
      const response: any = await METHOD(URL, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `Customer receipt ${
            type === "create" ? "created" : "updated"
          } successfully`,
        });
        setIsBtLoading(false);
        navigate(`/usr/cash/cashTable/${id}`);
      } else {
        if (!rows) {
          notification.error({ message: "Please select an invoice." });
          setIsBtLoading(false);
        } else {
          notification.error({
            message: "Failed",
            description: `Failed to ${
              type === "create" ? "create" : "update"
            } customer receipt`,
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
        } customer receipt!! Please try again later`,
      });
    }
  };

  const LoadRowData = (val: any) => {
    try {
      const amount = val?.reduce((acc: any, obj: any) => {
        return acc + Number(obj.rout);
      }, 0);
      setRows(val);
      setAmount(amount);
      setRoutAmount(amount);
      form.setFieldsValue({
        amount: Number(amount),
        reference: val[0]?.reference,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onValuesChange = (val: any) => {
    if (val.amount > routAmount) {
      notification.error({
        message: "You cannot pay more than the outstanding amount.",
      });
      form.setFieldsValue({
        amount: Number(routAmount),
      });
    }
  };
  return (
    <>
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
            <Row>
              <Col className="Table-Txt" md={12}>
                {t("home_page.homepage.Add/UpdateCustomerReceipt")}
              </Col>
              <Col md={12}>{t("home_page.homepage.Managepaymenent")}</Col>
              <br />
              <br />
              <hr />
              <Col md={4}>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.CUSTOMERNAME")}
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
                      allowClear
                      onSearch={(val) => setCustomerSerch(val)}
                      showSearch
                      filterOption={false}
                      size="large"
                      onChange={(val) => {
                        if (val) {
                          LodeInvice(val);
                        }
                      }}
                    >
                      {customerst?.map((item: any) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.bus_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.AMOUNT")}*
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
                    {type === "create" ? "Save" : "Update"}
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
      </Container>
      {isLoading ? (
        <LoadingBox />
      ) : invoice?.length > 0 ? (
        <InvoiceTable
          tableData={invoice}
          columns={columns}
          saleId={saleId}
          tableHead={"Select Customer Receipts and Invoices."}
          rowData={(e: any) => LoadRowData(e)}
        />
      ) : (
        <NoInvoice />
      )}
    </>
  );
}

export default Receipt;
