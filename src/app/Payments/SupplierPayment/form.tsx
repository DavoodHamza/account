import dayjs from "dayjs";
import { FaInbox } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import RecieptTable from "../../bank/cash-bank/components/MoreOptions/component/recieptTable";
import { paymentMode } from "../../bank/cash-bank/components/MoreOptions/component/paymentMode";
import moment from "moment";

function SupplierPaymentForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { id, type } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [initialData, setInitialData] = useState<any>();
  const [bankData, setBankData] = useState<any>();
  const [cName, setCName] = useState<any>();
  const [totOut, setTotOut] = useState<any>();
  const [customer, setCustomer] = useState<any>();
  const [customerId, setCustomerId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [recieptTableData, setRecieptTableData] = useState([]);
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");
  const [isCash, seIsCash] = useState(false);
  const [balance, setBalance] = useState<any>();

  useEffect(() => {
    if (type === "edit") {
      legderDetails();
    } else {
      form.setFieldValue("reciept_date", dayjs(new Date())); //set default reciept_date
    }
  }, []);
  
  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + id;
    try {
      const response: any = await GET(url, null);
      if (response?.status) {
        let data = response?.data;
        setInitialData(data);
        setSaleId(data?.purchaseid);

        handleSelectCustomer(data?.cname);

        let cus: any = customer?.find(
          (item: any) => item?.id == response?.data?.cname
        );

        handleSelectCustomer(cus?.id);
        form.setFieldsValue({
          sname: data?.cname,
          reciept_date: dayjs(data?.sdate),
          paidto: (data?.ledger).toString(),
          reference: data?.reference,
          amount_paid: Number(data?.credit),
          payment_mode: data?.paidmethod,
        });
        setCName(cus?.name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const customerList = async () => {
    let URL =
      "contactMaster/searchList/both/" +
      user?.id +
      `/${user?.companyInfo?.id}?name=${customerSerch}`;

    try {
      const { data }: any = await GET(URL, null);
      setCustomer(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectCustomer = async (val: any) => {
    setCustomerId(val);
    let url =
      API.PURCHASE_ID_BY_LIST +
      `${val}/` +
      user?.id +
      "/" +
      user?.companyInfo?.id;
    try {
      const data: any = await GET(url, null);
      if (data.status) {
        let result = data?.data?.filter(
          (data: any) => data?.rout !== "0.00" && data?.rout !== 0
        );
        setRecieptTableData(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectedData = (val: any) => {
    setIsLoading(true);
    if (val) {
      setSelectedRow(val);
      setIsLoading(false);

      const totalOutstanding = val
        ?.map((item: any) => parseFloat(item?.rout))
        .filter((value: number) => !isNaN(value))
        .reduce((sum: number, value: number) => sum + value, 0);
      setTotOut(totalOutstanding);
      form.setFieldsValue({
        amount_paid: Number(totalOutstanding),
      });
    }
  };

  const onFinish = async (val: any) => {
    try {
      if (balance < val.amount) {
        notification.error({
          message: `There is an insufficient balance in the available cash. The balance is ${balance}.`,
        });
        return;
      }
      let cnamValue;
      try {
        cnamValue = JSON.parse(val.cname);
      } catch (error) {
        cnamValue = val.cname;
      }
      setIsLoading(true);
      let url =
        type === "edit"
          ? API.UPDATE_BANK_DETAILS + Number(id)
          : "purchaseinvoice/addSuppReceiptBankNew";

      let Total = selectedRow?.reduce(
        (tot: number, acc: any) => tot + Number(acc.total),
        0
      );

      const items = [
        {
          amountpaid: val?.amount_paid,
          sname: val?.sname,
          total: selectedRow[0]?.total,
          duplicateout: selectedRow[0]?.duplicateout,
          id: selectedRow[0]?.id,
          checked: 1,
          type: selectedRow[0]?.type,
          date: selectedRow[0]?.date,
          remainout:
            Number(selectedRow[0]?.duplicateout) - Number(val?.amount_paid),
          invoiceno: selectedRow[0]?.invoiceno,
          ledgercategory: selectedRow[0]?.ledgercategory,
          ledgerid: selectedRow[0]?.ledgerid,
        },
      ];

      let cusName = customer.filter((cus: any) => cus.id == val?.sname);
      let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
      let body1 = {
        userid: user?.id,
        customer_name: cusName?.name,
        item: items,
        amount: Number(val?.amount_paid),
        sname: val?.sname,
        paidmethod: val?.payment_mode,
        paidto: val?.paidto,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Supplier Payment",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        type: "Supplier Payment",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };

      const out = Number(initialData?.totalamt) - Number(val?.amount_paid);
      const running =
        Number(initialData?.running_total) +
        Number(initialData?.credit) -
        Number(val?.amount_paid);

      let body2 = {
        userid: user?.id,
        customer_name: cusName?.name,
        item: items,
        outstanding: out,
        amount: Number(val?.amount_paid),
        credit: Number(val?.amount_paid),
        cname: val?.sname,
        paidto: val?.paidto,
        paidmethod: val?.payment_mode,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Supplier Payment",
        purchaseid: selectedRow ? selectedRow[0]?.id : null,
        rout: selectedRow ? selectedRow[0]?.rout : null,
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        type: "Supplier Payment",
        running_total: running,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      const data: any =
        type === "edit" ? await PUT(url, body2) : await POST(url, body1);
      if (data?.status) {
        notification.success({
          message: "Success",
          description: `Supplier Payment ${
            type === "edit" ? "updated" : "added"
          } Successfully`,
        });
        navigate(`/usr/payments/supplier-payment`);
        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            type === "edit" ? "update" : "add"
          } Supplier Payment`,
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          type === "edit" ? "update" : "add"
        } Supplier Payment!! Please try again later`,
      });
      setIsLoading(false);
    }
  };

  const handleChange = (value: any) => {
    const selected = bankData.find(
      (item: any) => item.list.id === Number(value)
    );
    setBalance(selected?.openingBalance);
  };

  const selectedRowColumn = [
    {
      name: "date",
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
      name: "type",
      title: t("home_page.homepage.Type"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "total",
      title: t("home_page.homepage.total"),
      dataType: "number",
      alignment: "center",
    },
    {
      name: "rout",
      title: t("home_page.homepage.outstanding"),
      dataType: "number",
      alignment: "center",
    },
  ];

  const columns = [
    {
      name: "date",
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
      name: "type",
      title: t("home_page.homepage.Type"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "total",
      title: t("home_page.homepage.total"),
      dataType: "number",
      alignment: "center",
    },
    {
      name: "rout",
      title: t("home_page.homepage.outstanding"),
      dataType: "number",
      alignment: "center",
    },
  ];

  useEffect(() => {
    customerList();
  }, [customerSerch]);


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
        title={t("home_page.homepage.SupplierPayment")}
        firstPathLink={`usr/payments/supplier-payment`}
        firstPathText="Supplier Payment"
        secondPathLink={location.pathname}
        secondPathText={
          type === "edit"
            ? "Update Supplier Payment"
            : "Create Supplier Payment"
        }
      />
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Col className="Table-Txt" md={12}>
              {t("home_page.homepage.Add/UpdateSupplierPayment")}
            </Col>
            <Col md={12}>{t("home_page.homepage.Managesuppliers")}</Col>
            <br />
            <hr />
            <Form
              onFinish={onFinish}
              form={form}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Supplier_Name")}
                  </label>
                  <Form.Item name={"sname"} rules={[{ required: true }]}>
                    <Select
                      onChange={handleSelectCustomer}
                      onSearch={(val) => setCustomerSerch(val)}
                      size="large"
                      placeholder={t("home_page.homepage.ChooseSupplier")}
                      showSearch
                      allowClear
                      filterOption={false}
                    >
                      {customer?.map((item: any) => (
                        <Select.Option key={item?.id}>
                          {item?.bus_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
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
                    <label className="formLabel">
                      {t("home_page.homepage.PaymentMethod")}
                    </label>
                    <Form.Item
                      name={"payment_mode"}
                      rules={[{ required: true }]}
                    >
                      <Select
                        size="large"
                        placeholder={t(
                          "home_page.homepage.ChoosePaymentMethod"
                        )}
                      >
                        {paymentMode?.map((item: any) => (
                          <Select.Option key={item.value}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>

              <Row className="align-items-center">
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Payment_Date")}
                  </label>
                  <Form.Item name={"reciept_date"}>
                    <DatePicker
                      style={{ width: "100%" }}
                      size="large"
                      format="DD-MM-YYYY"
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
                </Col>
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Reference")}
                  </label>
                  <Form.Item name={"reference"}>
                    <Input
                      size="large"
                      placeholder={t("home_page.homepage.Reference")}
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">
                    {t("home_page.homepage.Amount")}
                  </label>
                  <Form.Item
                    name={"amount_paid"}
                    rules={[
                      { required: true, message: "Please enter the amount." },
                      {
                        validator: (_, value) => {
                          if (value > balance) {
                            notification.error({
                              message: `Insufficient balance ( Balance : ${balance} )`,
                            });
                            return Promise.reject();
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder={t("home_page.homepage.Amount")}
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={8} />
                <Col md={4}>
                  {(selectedRow?.length > 0 || type === "edit") && (
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      style={{ height: 40 }}
                    >
                      {t("home_page.homepage.submit")}
                    </Button>
                  )}
                </Col>
              </Row>

              {selectedRow && selectedRow?.length > 0 && (
                <>
                  <RecieptTable
                    products={selectedRow}
                    columns={selectedRowColumn}
                    type="sales_reciept_amount"
                  />
                </>
              )}
            </Form>
            {recieptTableData?.length > 0 ? null : (
              <>
                <br />
                <hr />
                <br />
                <div className="salesReciept-Box1">
                  <div>
                    <FaInbox color="grey" size={54} />
                  </div>
                  <div className="salesReciept-Txt1">
                    {t("home_page.homepage.PleaseChooseDifferent")}
                  </div>
                </div>
              </>
            )}
          </Card>

          <br />
          {recieptTableData?.length && recieptTableData?.length > 0 ? (
            <Card>
              <RecieptTable
                products={recieptTableData}
                columns={columns}
                onSelectedData={(data: any) => handleSelectedData(data)}
                type={"sales-reciept"}
                id={id}
                tableHead="AVAILABLE INVOICES"
                saleId={saleId}
              />
            </Card>
          ) : null}
        </Container>
      )}
      <br />
    </>
  );
}

export default SupplierPaymentForm;
