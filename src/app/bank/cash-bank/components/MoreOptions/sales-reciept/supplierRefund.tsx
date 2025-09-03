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
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../../../../components/loadingBox";
import PageHeader from "../../../../../../components/pageHeader";
import API from "../../../../../../config/api";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import RecieptTable from "../component/recieptTable";
import { FaInbox } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import moment from "moment";

function SupplierRefund(props: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [form] = Form.useForm();
  const { id, update } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [customer, setCustomer] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierData, setSupplierData] = useState<any>();
  const [initialData, setInitialData] = useState<any>();
  const [value, setValue] = useState("");
  const [saleId, setSaleId] = useState("");
  const [routAmount, setRoutAmount] = useState<any>();
  const [isMode, setIsMode] = useState(false);

  useEffect(() => {
    supplierList();
  }, [value]);
  useEffect(() => {
    update && legderDetails();
  }, []);
  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + Number(update);

    try {
      const data: any = await GET(url, null);
      let edit = data?.data;
      setSaleId(edit?.purchaseid);
      setInitialData(data?.data);
      handleSelect(edit?.cname);
      form.setFieldsValue({
        account_name: Number(edit?.cname),
        payment_mode: edit?.paidmethod,
        reciept_date: dayjs(edit?.sdate),
        reference: edit?.reference,
        amount_paid: edit?.debit,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const supplierList = async () => {
    try {
      let url =
        API.CONTACT_MASTER_SEARCHLIST +
        user?.id +
        `/${user?.companyInfo?.id}?name=${value}`;
      const data: any = await GET(url, null);
      setSupplierData(data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const screditColumns = [
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
      name: "rout",
      title: t("home_page.homepage.outstanding"),
      dataType: "number",
      alignment: "center",
    },
    {
      name: "total",
      title: t("home_page.homepage.total"),
      dataType: "number",
      alignment: "center",
    },
  ];
  let paymentMode = [
    { id: 1, value: "Cheque", name: "Cheque" },
    { id: 2, value: "other", name: "Electronic" },
    { id: 3, value: "card", name: "Credit Card" },
    { id: 4, value: "card", name: "Debit Card" },
    // { id: 5, value: "loan", name: "PayPal" },
  ];
  const handleSelect = async (val: any) => {
    setCustomer(val);
    try {
      let url = API.SUPPLIER_PAY_LIST + `${val}/` + user?.id;
      const data: any = await GET(url, null);
      setData(data?.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelectRow = (val: any) => {
    setLoad(true);

    if (val) {
      setSelectedRow(val);
      setLoad(false);
      const totalSum = val
        ?.map((item: any) => parseFloat(item?.rout))
        .filter((value: number) => !isNaN(value))
        .reduce((sum: number, value: number) => sum + value, 0);
      setRoutAmount(totalSum);

      form.setFieldsValue({
        amount_paid: totalSum,
      });
    }
  };
  const onFinish = async (val: any) => {
    setIsLoading(true);
    try {
      let url = update
        ? API.UPDATE_BANK_DETAILS + Number(update)
        : API.CREATE_SUPPLIER_REFUND;

      let item = [
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
          rout: Number(selectedRow[0]?.duplicateout) - Number(val?.amount_paid),
          outstanding: Number(selectedRow[0]?.rout) - Number(val?.amount_paid),
        },
      ];
      let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
      let body1 = {
        userid: user.id,
        adminid: user?.id,
        cname: customer,
        customer_name: data[0]?.sname || data[0]?.cname,
        item: item,
        amount: update ? parseInt(val?.amount_paid) : val?.amount_paid,
        reference: val?.reference,
        paidmethod: val?.payment_mode,
        paidto: id,
        logintype: "user",
        sdate: formatedDate,
        receipttype: "Supplier Refund",
        outstanding: Number(selectedRow[0]?.rout) - Number(val?.amount_paid),
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.payment_mode == "Cheque" && {
          check_no: val.check_no,
          bank_name: val.bank_name,
          exp_date: val.exp_date,
        }),
      };

      const amt = Number(initialData?.debit) - Number(val?.amount_paid);
      const out = Number(initialData?.outstanding) + Number(amt);
      const running = Number(initialData?.running_total) - amt;

      let body2 = {
        cname: customer,
        reference: val?.reference,
        debit: Number(val.amount_paid),
        receipttype: "Supplier Refund",
        userid: user.id,
        adminid: user?.id,
        outstanding: out,
        purchaseid: selectedRow[0]?.id,
        rout: selectedRow ? selectedRow[0]?.rout : null,
        customer_name: data[0]?.sname || data[0]?.cname,
        item: {
          amountpaid: val?.amount_paid,
          sname: val?.sname,
          total: selectedRow[0]?.total,
          duplicateout: selectedRow[0]?.duplicateout,
          id: selectedRow[0]?.id,
          checked: 1,
          type: selectedRow[0]?.type,
          date: selectedRow[0]?.date,
          remainout: out,
          invoiceno: selectedRow[0]?.invoiceno,
          ledgercategory: selectedRow[0]?.ledgercategory,
          ledgerid: selectedRow[0]?.ledgerid,
          rout: out,
          outstanding: out,
        },
        paidmethod: val?.payment_mode,
        paidto: id,
        logintype: "user",
        sdate: formatedDate,
        type: "Supplier Refund",
        running_total: running,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        ...(val.payment_mode == "Cheque" && {
          check_no: val.check_no,
          bank_name: val.bank_name,
          exp_date: val.exp_date,
        }),
      };

      const res: any = update ? await PUT(url, body2) : await POST(url, body1);

      if (res?.status) {
        notification.success({
          message: "Success",
          description: update
            ? "Supplier refund updated successfully"
            : "Supplier refund created successfully",
        });
        navigate(`/usr/cashBank/${id}/details/transaction`);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: update
            ? "Failed to update supplier refund"
            : "Failed to create supplier refund",
        });
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: update
          ? "Failed to update supplier refund!! Please try again later "
          : "Failed to create supplier refund!! Please try again later",
      });
    }
  };

  const onValuesChange = (val: any, values: any) => {
    if (Number(val.amount_paid) > Number(routAmount)) {
      notification.error({
        message: "You cannot pay more than the outstanding amount.",
      });
      form.setFieldsValue({
        amount: Number(routAmount),
      });
    }

    if (val?.payment_mode == "Cheque" || values?.payment_mode == "Cheque") {
      setIsMode(true);
    } else {
      setIsMode(false);
    }
  };

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
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Form onFinish={onFinish} form={form} onValuesChange={onValuesChange}>
            <Card>
              <Col className="Table-Txt" md={12}>
                {t("home_page.homepage.Add/UpdateSupplierRefund")}
              </Col>
              <Col md={12}>{t("home_page.homepage.Manageyournon")}</Col>
              <br />
              <br />
              <hr />
              <Row>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Account Name")}
                    </label>
                    <Form.Item
                      name={"account_name"}
                      rules={[{ required: true }]}
                    >
                      <Select
                        onChange={handleSelect}
                        showSearch
                        placeholder={t("home_page.homepage.chooseasupplier")}
                        onSearch={(val) => setValue(val)}
                        allowClear
                        filterOption={false}
                      >
                        {supplierData?.map((item: any) => (
                          <Select.Option value={item?.id}>
                            {item?.bus_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.PaymentMethod")}
                    </label>
                    <Form.Item
                      name={"payment_mode"}
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {paymentMode?.map((item: any) => (
                          <Select.Option key={item?.value}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.RecieptDate")}
                    </label>
                    <Form.Item
                      name={"reciept_date"}
                      rules={[
                        {
                          required: true,
                          message: "Please choose date",
                        },
                      ]}
                    >
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
                      <Form.Item
                        name={"bank_name"}
                        rules={[{ required: true }]}
                      >
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
              </Row>
              <Row className="align-items-center">
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </label>
                    <Form.Item name={"reference"}>
                      <Input />
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">
                      {t("home_page.homepage.AmountPaid")}
                    </label>
                    <Form.Item
                      name={"amount_paid"}
                      rules={[{ required: true }]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </div>
                </Col>
                {data?.length > 0 && (
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
              </Row>
              <br />
              {data?.length > 0 ? null : (
                <>
                  <br />
                  <hr />
                  <br />
                  <div className="salesReciept-Box1">
                    <div>
                      <FaInbox color="grey" size={54} />
                    </div>
                    <div className="salesReciept-Txt1">
                      Please Choose Different Supplier, No Receipts or Invoice
                      Available
                    </div>
                  </div>
                </>
              )}
              <br />
              {data?.length > 0 && (
                <RecieptTable
                  products={data}
                  columns={screditColumns}
                  saleId={saleId}
                  tableHead={"Select Supplier Refund and Invoices."}
                  type={"supplier-refund"}
                  onSelectedData={(data: any) => handleSelectRow(data)}
                />
              )}
            </Card>
          </Form>
        </Container>
      )}
    </>
  );
}

export default SupplierRefund;
