import API from "../../../../../../config/api";
import RecieptTable from "../component/recieptTable";
import { paymentMode } from "../component/paymentMode";
import { GET, POST, PUT } from "../../../../../../utils/apiCalls";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
import { FaInbox } from "react-icons/fa";
import LoadingBox from "../../../../../../components/loadingBox";
import PageHeader from "../../../../../../components/pageHeader";

import { useTranslation } from "react-i18next";
import moment from "moment";
function CustomerRefund(props: any) {
  const { t } = useTranslation();
  const { id, update } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  let type = location?.state?.type;
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [data, setData] = useState([]);
  const [paidData, setPaidData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [purchaseid, setPurchaseId] = useState("");
  const [initialData, setInitialData] = useState<any>();
  const [customerSerch, setCustomerSerch] = useState("");
  const [saleId, setSaleId] = useState("");
  const [routAmount, setRoutAmount] = useState<any>();

  useEffect(() => {
    update && legderDetails();
  }, []);

  useEffect(() => {
    purchaseList();
  }, [customerSerch]);

  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + update;
    try {
      setIsLoading(true);
      const data: any = await GET(url, null);
      let edit = data?.data;
      setSaleId(edit?.saleid);

      supplierPaidData(edit?.cname);
      setPurchaseId(data?.data?.saleid);
      setInitialData(data?.data);

      form.setFieldsValue({
        account_name: Number(edit?.cname),
        reciept_date: dayjs(edit?.sdate),
        reference: edit?.reference,
        amount_paid: edit?.credit,
        payment_mode: edit?.paidmethod,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseList = async () => {
    let URL =
      "contactMaster/searchList/both/" +
      user?.id +
      `/${user?.companyInfo?.id}?name=${customerSerch}`;
    try {
      const customerData: any = await GET(URL, null);
      setData(customerData?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const supplierPaidData = async (val: any) => {
    setCustomerId(val);
    let url = API.GET_SALE_ID_BY_PAY_LIST + val + `/${user?.id}`;
    try {
      const data: any = await GET(url, null);
      if (data.status) {
        setPaidData(data?.data);
        window.scrollTo(0, 200);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleSelectedData = async (val: any) => {
    if (val) {
      setSelectedRow(val);
      setRoutAmount(val[0]?.rout);

      form.setFieldsValue({
        amount_paid: val[0]?.rout,
      });
    }
    try {
    } catch (err) {
      console.log(err);
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
        ? `ledger_details/updateCashDeatails/` + Number(update)
        : API.ADD_CUSTOMER_REFUND;

      let rowData;
      if (selectedRow) {
        rowData = selectedRow?.map((row: any) => {
          let remainout = row.duplicateout - val.amount_paid;
          return {
            ...row,
            amountpaid: row?.duplicateout,
            remainout: remainout,
            outstanding: 0,
          };
        });
      }

      let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
      let body1 = {
        userid: user.id,
        adminid: user?.id,
        cname: customerId.toString(),
        customer_name: paidData[0]?.sname || paidData[0]?.cname,
        item: rowData,
        amount: Number(val?.amount_paid),
        reference: val?.reference,
        sdate: formatedDate,
        paidmethod: val?.payment_mode,
        paidto: id,
        logintype: "user",
        userdate: formatedDate,
        receipttype: "Customer Refund",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };

      let body2 = {
        cname: val?.account_name || paidData[0]?.sname || paidData[0]?.cname,
        reference: val?.reference,
        amount: Number(val.amount_paid),
        credit: Number(val?.amount_paid),
        total: val?.amount_paid.toString(),
        type: "Customer Refund",
        userid: user.id,
        adminid: user?.id,
        customer_name: paidData[0]?.sname || paidData[0]?.cname,
        item: rowData,
        sdate: formatedDate,
        paidmethod: val?.payment_mode,
        paidto: id,
        logintype: "user",
        userdate: formatedDate,
        receipttype: "Customer Refund",
        outstanding:
          Number(initialData?.amount) +
          Number(initialData?.debit) -
          Number(val?.amount_paid),
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      const data: any = update ? await PUT(url, body2) : await POST(url, body1);
      if (data?.status) {
        notification.success({
          message: "Success",
          description: update
            ? "Customer refund updated successfully"
            : "Customer refund created successfully",
        });
        navigate(`/usr/cashBank/${id}/details/transaction`);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: update
            ? "Failed to update customer refund"
            : "Failed to create customer refund",
        });
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: update
          ? "Failed to update customer refund!! Please try again later "
          : "Failed to create customer refund!! Please try again later",
      });
    }
  };

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
      dataType: "string",
      alignment: "center",
    },
    {
      name: "invoiceno",
      title: t("home_page.homepage.invoice_no"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "rout",
      title: t("home_page.homepage.outstanding"),
      alignment: "center",
    },
    {
      name: "total",
      title: t("home_page.homepage.total"),
      dataType: "number",
      alignment: "center",
    },
  ];
  const onValuesChange = (val: any) => {
    if (Number(val.amount_paid) > Number(routAmount)) {
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
                {t("home_page.homepage.Add/UpdateCustomerRefund")}
              </Col>
              <Col md={12}>{t("home_page.homepage.Manageyournon")}</Col>
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
                        onChange={supplierPaidData}
                        onSearch={(val) => setCustomerSerch(val)}
                        size="large"
                        placeholder={t("home_page.homepage.Choose_an_account")}
                        showSearch
                        allowClear
                        filterOption={false}
                      >
                        {data?.map((item: any) => (
                          <Select.Option key={item?.id} value={item?.id}>
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
                      <Select size="large" placeholder="Choose a method">
                        {paymentMode?.map((item: any) => (
                          <Select.Option value={item?.value} key={item?.id}>
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
                      {t("home_page.homepage.Payment_Date")}
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
                  </div>
                </Col>
              </Row>
              <Row className="align-items-center">
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
                        size="large"
                        placeholder={t("home_page.homepage.Enteramount")}
                      />
                    </Form.Item>
                  </div>
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

              {paidData?.length > 0 ? null : (
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
            {paidData?.length > 0 && (
              <Card>
                <RecieptTable
                  products={paidData}
                  columns={columns}
                  type={"supplier-refund"}
                  onSelectedData={(data: any) => handleSelectedData(data)}
                  title="CUSTOMER RECEIPTS AND INVOICES"
                  id={purchaseid}
                  saleId={saleId}
                />
              </Card>
            )}
            <br />
          </Form>
        </Container>
      )}
    </>
  );
}

export default CustomerRefund;
