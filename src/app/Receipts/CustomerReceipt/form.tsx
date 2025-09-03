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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import RecieptTable from "../../bank/cash-bank/components/MoreOptions/component/recieptTable";
import { CiTrash } from "react-icons/ci";

function CustomerRecieptForm() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [customerId, setCustomerId] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCash, seIsCash] = useState(false);
  const [isMode, setIsMode] = useState(false);
  const [load, setLoad] = useState(false);
  const [edit, setEdit] = useState<any>();
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");
  const [ledgerDeatails, setLedgerDeatails] = useState<any>({});
  const [routAmount, setRoutAmount] = useState<any>();
  const [bankData, setBankData] = useState<any>();
  const location = useLocation();

  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + id;
    try {
      const res: any = await GET(url, null);
      let data = res?.data;
      setEdit(data?.id);
      setSaleId(data?.saleid);
      handleSelectCustomer(data?.cname);
      setLedgerDeatails(res?.data);
      form.setFieldsValue({
        custmore_name: data?.cname,
        reciept_date: dayjs(data?.sdate),
        paidto: data?.ledger.toString(),
        reference: data?.reference,
        amount_paid: Number(data?.debit),
        payment_mode: data?.paidmethod,
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
    { id: 5, value: "Cash", name: "Cash" },
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

  useEffect(() => {
    if (type === "edit") {
      legderDetails();
    } else {
      form.setFieldValue("reciept_date", dayjs(new Date()));
    }
  }, []);

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
      setSelectedRow((prevRows: any) => {
        const newRows = val.filter(
          (item: any) => !prevRows.some((row: any) => row.id === item.id)
        );
        newRows[0].amountpaid = newRows[0].rout;
        newRows[0].remainout = 0;
        newRows[0].outstanding = 0;
        return [...prevRows, ...newRows];
      });
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
    if (val.paidto) {
      let isCash =
        bankData
          ?.find((item: any) => item?.list?.id === Number(val?.paidto))
          ?.list.laccount.toUpperCase() === "Cash".toUpperCase();
      seIsCash(isCash);
    }
    if (val?.mode == "Cheque" || data?.mode == "Cheque") {
      setIsMode(true);
    } else {
      setIsMode(false);
    }
    if (Number(val.amount_paid) > Number(routAmount)) {
      notification.error({
        message: "You cannot pay more than the outstanding amount.",
      });
      form.setFieldsValue({
        amount: Number(routAmount),
      });
    }
  };

  // const onFinish = async (val: any) => {
  //   console.log("------val", val);
  //   const amountPaidArray = Object.entries(val)
  //     .filter(([key]) => key.startsWith("amountpaid"))
  //     .map(([key, value]) => ({
  //       amountpaid: Number(value),
  //       id: key.replace("amountpaid", ""),
  //     }));
  //   console.log("--------amountPaidArray", amountPaidArray);
  //   setIsLoading(true);
  //   let url =
  //     type === "edit"
  //       ? API.UPDATE_BANK_DETAILS + edit
  //       : "SaleInvoice/addCustReceiptCash";
  //   let rowData: any;
  //   let outstandingss: any;
  //   const array = amountPaidArray.map((item: any) => {
  //     if (selectedRow.length) {
  //       rowData = selectedRow?.map((row: any) => {

  //         let remainout = Number(row.rout) - Number(val.amount_paid);
  //         outstandingss = Number(row.total) - Number(val.amount_paid);
  //         return {
  //           ...row,
  //           amountpaid: row?.duplicateout,
  //           remainout: remainout,
  //           outstanding: 0,
  //         };
  //       });
  //     } else {
  //       outstandingss = Number(ledgerDeatails?.amount) - Number(val.amount_paid);
  //     }
  //     let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
  //     let reqObjPost = {
  //       userid: user?.id,
  //       item: rowData,
  //       amount: val?.amount_paid?.toString(),
  //       cname: val.custmore_name,
  //       paidto: val?.paidto,
  //       paidmethod: val?.payment_mode,
  //       sdate: formatedDate,
  //       reference: val?.reference,
  //       receipttype: "Customer Receipt",
  //       adminid: user?.id,
  //       logintype: "user",
  //       userdate: formatedDate,
  //       customer_name: selectedRow[0]?.cname || selectedRow[0]?.sname,
  //       createdBy: user?.isStaff ? user?.staff?.id : user?.id,
  //       companyid: user?.companyInfo?.id,
  //     };
  //     const amt = Number(ledgerDeatails?.credit) - Number(val?.amount_paid);
  //     let running = ledgerDeatails?.running_total - amt;
  //     let reqObjPut = {
  //       cname: val?.custmore_name?.toString(),
  //       reference: val?.reference,
  //       debit: Number(val?.amount_paid),
  //       sdate: formatedDate,
  //       paidto: val?.paidto,
  //       outstanding: outstandingss,
  //       saleid: rowData ? rowData[0]?.id : null,
  //       rout: rowData ? rowData[0]?.rout : null,
  //       paidmethod: val?.payment_mode,
  //       running_total: running,
  //       createdBy: user?.isStaff ? user?.staff?.id : user?.id,
  //       companyid: user?.companyInfo?.id,
  //     };
  //     if (type === "edit") {
  //       return reqObjPut;
  //     } else {
  //       return reqObjPost;
  //     }
  //   })
  //   try {
  //     let data: any;
  //     // if (type === "edit") {
  //     //   data = await PUT(url, array);
  //     // } else {
  //     //   data = await POST(url, array);
  //     // }
  //     if (data?.status) {
  //       notification.success({
  //         message: "Success",
  //         description:
  //           type === "edit"
  //             ? "Customer receipt updated successfully"
  //             : "Customer receipt created successfully",
  //       });
  //       navigate(`/usr/receipts/customer-receipt`);
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);
  //       notification.error({
  //         message: "Failed",
  //         description:
  //           type === "edit"
  //             ? "Failed to update customer receipt"
  //             : "Failed to create customer receipt",
  //       });
  //     }
  //   } catch (err) {
  //     setIsLoading(false);
  //     console.log(err);
  //     notification.error({
  //       message: "Server Error",
  //       description:
  //         type === "edit"
  //           ? "Failed to update customer receipt!! Please try again later"
  //           : "Failed to create customer receipt!! Please try again later",
  //     });
  //   }
  // };

  const onFinish = async (val: any) => {
    const amountPaidArray = Object.entries(val)
      .filter(([key]) => key.startsWith("amountpaid"))
      .map(([key, value]) => ({
        amountpaid: Number(value),
        id: key.replace("amountpaid", ""),
      }));

    setIsLoading(true);
    let url =
      type === "edit"
        ? API.UPDATE_BANK_DETAILS + edit
        : "SaleInvoice/addCustReceiptCash";

    let array: any[] = [];

    amountPaidArray.forEach((item: any) => {
      let rowData: any;
      let outstandingss: any;

      if (selectedRow.length) {
        rowData = selectedRow
          .filter((row: any) => row.id == item.id)
          .map((row: any) => {
            let remainout = Number(row.rout) - Number(item?.amountpaid);
            outstandingss = Number(row.total) - Number(item?.amountpaid);
            return {
              ...row,
              amountpaid: row?.duplicateout,
              remainout: remainout,
              outstanding: 0,
            };
          });
      } else {
        outstandingss =
          Number(ledgerDeatails?.amount) - Number(val.amount_paid);
      }

      let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");

      const ppp = selectedRow.find((row: any) => {
        return row.id == item.id;
      });

      let reqObjPost = {
        userid: user?.id,
        item: rowData,
        amount: item?.amountpaid?.toString(),
        cname: val.custmore_name,
        paidto: val?.paidto,
        paidmethod: val?.mode,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Customer Receipt",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        customer_name:
          selectedRow.find((row: any) => row.id == item.id)?.cname ||
          selectedRow.find((row: any) => row.id == item.id)?.sname,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.mode == "Cheque" && {
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
        paidto: val?.paidto,
        outstanding: outstandingss,
        saleid: rowData.length ? rowData[0]?.id : null,
        rout: rowData.length ? rowData[0]?.rout : null,
        paidmethod: val?.payment_mode,
        running_total: running,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.mode == "Cheque" && {
          check_no: val.check_no,
          bank_name: val.bank_name,
          exp_date: val.exp_date,
        }),
      };

      if (type === "edit") {
        array.push(reqObjPut);
      } else {
        array.push(reqObjPost);
      }
    });

    try {
      let data: any;
      if (type === "edit") {
        data = await PUT(url, array);
      } else {
        data = await POST(url, array);
      }

      if (data?.status) {
        notification.success({
          message: "Success",
          description:
            type === "edit"
              ? "Customer receipt updated successfully"
              : "Customer receipt created successfully",
        });
        navigate(`/usr/receipts/customer-receipt`);
      } else {
        notification.error({
          message: "Failed",
          description:
            type === "edit"
              ? "Failed to update customer receipt"
              : "Failed to create customer receipt",
        });
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Server Error",
        description:
          type === "edit"
            ? "Failed to update customer receipt!! Please try again later"
            : "Failed to create customer receipt!! Please try again later",
      });
    } finally {
      setIsLoading(false);
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
      // cellRender: "Reference",
    },
    {
      name: "reference",
      title: t("home_page.homepage.Reference"),
      dataType: "string",
      alignment: "center",
      // cellRender: "Reference",
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
      // cellRender: "Reference",
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
    {
      name: "amountpaid",
      title: t("home_page.homepage.AmountPaid"),
      alignment: "center",
      cellRender: ({ data }: any) => (
        <Form.Item
          name={`amountpaid${data.id}`}
          rules={[{ required: true }]}
          noStyle
        >
          <Input type="number" />
        </Form.Item>
      ),
    },
    {
      title: "",
      alignment: "center",
      cellRender: ({ data }: any) => (
        <CiTrash
          onClick={() =>
            setSelectedRow((prevRows: any) =>
              prevRows.filter((row: any) => row.id !== data.id)
            )
          }
          color="red"
          size={24}
          style={{ cursor: "pointer" }}
        />
      ),
    },
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

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.CustomerReceipt")}
        firstPathLink={`usr/receipts/customer-receipt`}
        firstPathText="Customer Receipt"
        secondPathLink={location.pathname}
        secondPathText={
          type === "edit"
            ? "Update Customer Receipt"
            : "Create Customer Receipt"
        }
      />
      <br />
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
                        size="large"
                      >
                        {customer?.map((item: any) => (
                          <Select.Option key={item.id}>
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
                      <Form.Item name={"mode"} rules={[{ required: true }]}>
                        <Select size="large">
                          {paymentMode?.map((item: any) => (
                            <Option key={item.value}>{item.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {isCash === false && isMode === true ? (
                    <>
                      <Col md={4}>
                        <label className="formLabel">Check No</label>
                        <Form.Item
                          name={"check_no"}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <label className="formLabel">Bank Name</label>
                        <Form.Item
                          name={"bank_name"}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" />
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <label className="formLabel">Exp Date</label>
                        <Form.Item
                          name={"exp_date"}
                          rules={[{ required: true }]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            format={"YYYY-MM-DD"}
                            size="large"
                            inputReadOnly // Prevents manual input
                            disabledDate={(currentDate) => {
                              const today = moment().startOf("day");
                              return currentDate && currentDate < today;
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                </Row>
                <Row className="align-items-center">
                  <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.RecieptDate")}
                    </label>
                    <Form.Item name={"reciept_date"}>
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
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
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </label>
                    <Form.Item name={"reference"}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  {/* <Col md={4}>
                    <label className="formLabel">
                      {t("home_page.homepage.AmountPaid")}
                    </label>
                    <Form.Item
                      name={"amount_paid"}
                      rules={[{ required: true }]}
                    >
                      <Input type="number" size="large" />
                    </Form.Item>
                  </Col> */}
                </Row>
                {selectedRow &&
                  selectedRow?.length > 0 &&
                  !(type === "edit") && (
                    <>
                      {load ? (
                        <LoadingBox />
                      ) : (
                        <>
                          <RecieptTable
                            tableHead={
                              "Select Customer Receipts and Invoices-----"
                            }
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
                {type === "edit" ? (
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
                  saleId={selectedRow}
                />
              </Card>
            ) : null}
          </>
        )}
      </Container>
      <br />
    </>
  );
}

export default CustomerRecieptForm;
