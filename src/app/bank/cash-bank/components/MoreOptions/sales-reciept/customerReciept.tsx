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
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaInbox } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../../../../components/loadingBox";
import PageHeader from "../../../../../../components/pageHeader";
import API from "../../../../../../config/api";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import RecieptTable from "../component/recieptTable";

function CustomerReciept() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { id, update } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [customerId, setCustomerId] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [edit, setEdit] = useState<any>();
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");
  const [ledgerDeatails, setLedgerDeatails] = useState<any>({});
  const [routAmount, setRoutAmount] = useState<any>();
  const [isMode, setIsMode] = useState(false);

  useEffect(() => {
    customerList();
    legderDetails();
  }, []);

  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + update;
    try {
      const data: any = await GET(url, null);
      let edit = data?.data;
      setEdit(edit?.id);
      setSaleId(edit?.saleid);
      handleSelectCustomer(edit?.cname);
      setLedgerDeatails(data?.data);
      form.setFieldsValue({
        custmore_name: edit?.cname,
        reciept_date: dayjs(edit?.sdate),
        reference: edit?.reference,
        amount_paid: Number(edit?.debit),
        payment_mode: edit?.paidmethod,
      });
    } catch (err) {
      console.log(err);
    }
  };

  let paymentMode = [
    { id: 1, value: "Cheque", name: "Cheque" },
    { id: 2, value: "Electronic", name: "Electronic" },
    { id: 3, value: "credit_card", name: "Credit Card" },
    { id: 4, value: "Debit_card", name: "Debit Card" },
    // { id: 5, value: "PayPal", name: "PayPal" },
  ];

  const customerList = async () => {
    try {
      form.setFieldsValue({
        sdate: moment(new Date()),
      });
      let URL =
        "contactMaster/searchList/both/" +
        user?.id +
        `/${user?.companyInfo?.id}?name=${customerSerch}`;
      const data: any = await GET(URL, null);
      setCustomer(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    customerList();
  }, [customerSerch]);

  const handleSelectCustomer = async (val: any) => {
    setCustomerId(val);
    let url = API.GET_SALE_INVOICE_BY_ID + `${val}/` + user?.id;
    try {
      const data: any = await GET(url, null);
      if (data.status === true) {
        let result = data?.data?.filter(
          (data: any) => data?.rout !== "0.00" && data?.rout !== 0
        );
        setSalesData(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectedData = (val: any) => {
    setLoad(true);
    if (val) {
      setSelectedRow(val);
      setLoad(false);

      const totalOutstanding = val
        ?.map((item: any) => parseFloat(item?.rout))
        .filter((value: number) => !isNaN(value))
        .reduce((sum: number, value: number) => sum + value, 0);
      // const roundedTotal = Math.round(totalSum);
      setRoutAmount(Number(totalOutstanding) || 0);

      form.setFieldsValue({
        amount_paid: Number(totalOutstanding) || 0,
        reference: val?.reference,
      });
    }
  };
  const onValuesChange = (val: any, data: any) => {
    if (Number(val.amount_paid) > Number(routAmount)) {
      notification.error({
        message: "You cannot pay more than the outstanding amount.",
      });
      form.setFieldsValue({
        amount: Number(routAmount),
      });
    }

    if (val?.payment_mode == "Cheque" || data?.payment_mode == "Cheque") {
      setIsMode(true);
    } else {
      setIsMode(false);
    }
  };

  const onFinish = async (val: any) => {
    setIsLoading(true);
    let url = update
      ? API.UPDATE_BANK_DETAILS + edit
      : "SaleInvoice/addCustReceiptCash";
    let rowData;
    let outstandingss;
    if (selectedRow.length) {
      rowData = selectedRow?.map((row: any) => {
        let remainout = Number(row.rout) - Number(val.amount_paid);
        outstandingss = Number(row.total) - Number(val.amount_paid);
        return {
          ...row,
          amountpaid: row?.duplicateout,
          remainout: remainout,
          outstanding: 0,
        };
      });
    } else {
      outstandingss = Number(ledgerDeatails?.amount) - Number(val.amount_paid);
    }
    const formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
    let reqObjPost = {
      userid: user?.id,
      item: rowData,
      amount: val?.amount_paid?.toString(),
      cname: val.custmore_name,
      paidto: Number(id),
      paidmethod: val?.payment_mode,
      sdate: formatedDate,
      reference: val?.reference,
      receipttype: "Customer Receipt",
      adminid: user?.id,
      logintype: "user",
      userdate: formatedDate,
      customer_name: selectedRow[0]?.cname || selectedRow[0]?.sname,
      createdBy: user?.isStaff ? user?.staff?.id : user?.id,
      companyid: user?.companyInfo?.id,
      ...(val.payment_mode == "Cheque" && {
        check_no: val.check_no,
        bank_name: val.bank_name,
        exp_date: val.exp_date,
      }),
    };
    const amt = Number(ledgerDeatails?.credit) - Number(val?.amount_paid);
    let running = ledgerDeatails?.running_total - amt;
    let reqObjPut = {
      cname: val?.custmore_name?.toString(),
      reference: val?.reference,
      debit: Number(val?.amount_paid),
      sdate: formatedDate,
      outstanding: outstandingss,
      saleid: rowData ? rowData[0]?.id : null,
      rout: rowData ? rowData[0]?.rout : null,
      paidmethod: val?.payment_mode,
      running_total: running,
      createdBy: user?.isStaff ? user?.staff?.id : user?.id,
      companyid: user?.companyInfo?.id,
      ...(val.payment_mode == "Cheque" && {
        check_no: val.check_no,
        bank_name: val.bank_name,
        exp_date: val.exp_date,
      }),
    };
    try {
      let data: any;
      if (update || edit) {
        data = await PUT(url, reqObjPut);
      } else {
        data = await POST(url, [reqObjPost]);
      }
      if (data?.status) {
        notification.success({
          message: "Success",
          description: update
            ? "Customer receipt updated successfully"
            : "Customer receipt created successfully",
        });
        navigate(`/usr/cashBank/${id}/details/transaction`);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: update
            ? "Failed to update customer receipt"
            : "Failed to create customer receipt",
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notification.error({
        message: "Server Error",
        description: update
          ? "Failed to update customer receipt!! Please try again later"
          : "Failed to create customer receipt!! Please try again later",
      });
    }
  };

  const column = [
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
  const selectedRowColumn = [
    {
      name: "data",
      title: t("home_page.homepage.Date"),
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
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
            // goback={() => navigate(`/usr/cashBank/${id}/details/transaction`)}
          />
          <br />
        </>
      )}
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <>
            <Card>
              <Col className="Table-Txt" md={12}>
                {t("home_page.homepage.Add/UpdateCustomerReceipt")}
              </Col>
              <Col md={12}>{t("home_page.homepage.Manageyournoninvoice")}</Col>
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
                      {t("home_page.homepage.Customer_Name")}
                    </label>
                    <Form.Item
                      name={"custmore_name"}
                      rules={[{ required: true }]}
                    >
                      <Select
                        onChange={handleSelectCustomer}
                        allowClear
                        onSearch={(val) => setCustomerSerch(val)}
                        showSearch
                        filterOption={false}
                      >
                        {customer?.map((item: any) => (
                          <Select.Option key={item.id}>
                            {item?.bus_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.PaymentMethod")}
                    </label>
                    <Form.Item
                      name={"payment_mode"}
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {paymentMode?.map((item: any) => (
                          <Option key={item.value}>{item.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {isMode === true ? (
                    <>
                      <Col md={4}>
                        <label className="formLabel">cheque No</label>
                        <Form.Item
                          name={"check_no"}
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <label className="formLabel">Bank Name</label>
                        <Form.Item
                          name={"bank_name"}
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <label className="formLabel">Cheque Exp Date</label>
                        <Form.Item
                          name={"exp_date"}
                          rules={[{ required: true }]}
                        >
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
                    <label className="formLabel">
                      {t("home_page.homepage.RecieptDate")}
                    </label>
                    <Form.Item name={"reciept_date"}>
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
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
                </Row>
                <Row className="align-items-center">
                  <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </label>
                    <Form.Item name={"reference"}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.AmountPaid")}
                    </label>
                    <Form.Item
                      name={"amount_paid"}
                      rules={[{ required: true }]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </Col>
                </Row>
                {selectedRow && selectedRow?.length > 0 && !update && (
                  <>
                    {load ? (
                      <LoadingBox />
                    ) : (
                      <>
                        <RecieptTable
                          tableHead={"Select Customer Receipts and Invoices"}
                          products={selectedRow}
                          columns={selectedRowColumn}
                          type="sales_reciept_amount"
                        />
                        <br />
                        {selectedRow?.length > 0 && (
                          <Col md={{ span: 3, offset: 9 }}>
                            <Button
                              block
                              type="primary"
                              htmlType="submit"
                              loading={isLoading}
                            >
                              {t("home_page.homepage.submit")}
                            </Button>
                          </Col>
                        )}
                      </>
                    )}
                  </>
                )}
                {update ? (
                  <Col md={{ span: 3, offset: 9 }}>
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                    >
                      {t("home_page.homepage.submit")}
                    </Button>
                  </Col>
                ) : null}
              </Form>
              {salesData?.length > 0 ? null : (
                <>
                  <br />
                  <hr />
                  <br />
                  <div className="salesReciept-Box1">
                    <div>
                      <FaInbox color="grey" size={54} />
                    </div>
                    <div className="salesReciept-Txt1">
                      {t("home_page.homepage.PleaseChooseDifferentCustomer")}
                    </div>
                  </div>
                </>
              )}
            </Card>

            <br />
            {salesData?.length && salesData?.length > 0 ? (
              <Card>
                <RecieptTable
                  products={salesData}
                  columns={column}
                  tableHead={"Select Customer Receipts and Invoices"}
                  onSelectedData={(data: any) => handleSelectedData(data)}
                  type={"sales-reciept"}
                  saleId={saleId}
                />
              </Card>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}

export default CustomerReciept;
