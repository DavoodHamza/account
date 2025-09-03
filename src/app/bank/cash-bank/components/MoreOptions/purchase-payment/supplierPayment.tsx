import API from "../../../../../../config/api";
import RecieptTable from "../component/recieptTable";
import { paymentMode } from "../component/paymentMode";
import LoadingBox from "../../../../../../components/loadingBox";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import dayjs from "dayjs";
import { FaInbox } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import PageHeader from "../../../../../../components/pageHeader";
import moment from "moment";

function SupplierPayment({balance}: any) {
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id, update } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [initialData, setInitialData] = useState<any>();
  const [cName, setCName] = useState<any>();
  const [totOut, setTotOut] = useState<any>();
  const [customer, setCustomer] = useState<any>();
  const [customerId, setCustomerId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [recieptTableData, setRecieptTableData] = useState([]);
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");

  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + update;
    try {
      const data: any = await GET(url, null);
      if (data?.status) {
        let edit = data?.data;
        setInitialData(edit);
        setSaleId(edit?.purchaseid);

        handleSelectCustomer(edit?.cname);

        let cus: any = customer?.find(
          (item: any) => item?.id == data?.data?.cname
        );

        handleSelectCustomer(cus?.id);
        form.setFieldsValue({
          sname: edit?.cname,
          reciept_date: dayjs(edit?.sdate),
          reference: edit?.reference,
          amount_paid: Number(edit?.credit),
          payment_mode: edit?.paidmethod,
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
    let url = API.PURCHASE_ID_BY_LIST + `${val}/` + user?.id  + '/' + user?.companyInfo?.id;
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
        let cnamValue;
        try {
          cnamValue = JSON.parse(val.cname);
        } catch (error) {
          cnamValue = val.cname;
        }
        setIsLoading(true);
      let url = update
        ? API.UPDATE_BANK_DETAILS + Number(update)
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
        paidto: id,
        paidmethod: val?.payment_mode,
        sdate: formatedDate,
        reference: val?.reference,
        receipttype: "Supplier Payment",
        adminid: user?.id,
        logintype: "user",
        userdate: formatedDate,
        type: "Supplier Payment",
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      };

      const amt = Number(initialData?.credit) - Number(val?.amount_paid);
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
        paidto: id,
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
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      };
      const data: any = update ? await PUT(url, body2) : await POST(url, body1);
      if (data?.status) {
        notification.success({ message:"Success", description: `Supplier Payment ${update ? 'updated' : 'added'} Successfully` });
        navigate(`/usr/cashBank/${id}/details/transaction`);
        setIsLoading(false);
      } else {
        notification.error({message:"Failed", description: `Failed to ${update ? 'update' : 'add'} Supplier Payment` });
        setIsLoading(false);
      }
      
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notification.error({message:"Server Error", description: `Failed to ${update ? 'update' : 'add'} Supplier Payment!! Please try again later` });
    }
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
    update && legderDetails();
  }, [customerSerch]);

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
            thirdPathText={t("home_page.homepage.Payment")}
            // goback={() => navigate(`/usr/cashBank/${id}/details/transaction`)}
          />
          <br />
        </>
      )}
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
            <Form onFinish={onFinish} form={form}>
              <Row>
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Supplier_Name")}</label>
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
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.PaymentMethod")}</label>
                  <Form.Item name={"payment_mode"} rules={[{ required: true }]}>
                    <Select size="large" placeholder={t("home_page.homepage.ChoosePaymentMethod")}>
                      {paymentMode?.map((item: any) => (
                        <Select.Option key={item.value}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Payment_Date")}</label>
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
              </Row>
              <Row className="align-items-center">
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Reference")}</label>
                  <Form.Item name={"reference"}>
                    <Input size="large" placeholder={t("home_page.homepage.Reference")} />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Amount")}</label>
                  <Form.Item name={"amount_paid"}
                  rules={[
                    { required: true, message: "Please enter the amount." },
                    {
                      validator: (_, value) => {
                        if (value > balance) {
                          notification.error({message:`Insufficient balance ( Balance : ${balance} )`});
                          return Promise.reject()
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}>
                    <Input size="large" placeholder={t("home_page.homepage.Amount")} type="number" />
                  </Form.Item>
                </Col>
                <Col md={1} />
                <Col md={3}>
                  {(selectedRow?.length > 0 || update) && (
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
                id={update}
                tableHead="AVAILABLE INVOICES"
                saleId={saleId}
              />
            </Card>
          ) : null}
        </Container>
      )}
    </>
  );
}

export default SupplierPayment;
