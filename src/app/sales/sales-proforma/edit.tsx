import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { Col, Container, Row, Table } from "react-bootstrap";
import PageHeader from "../../../components/pageHeader";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CreateCutomerModal from "../../../components/contactCreateModal";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import Items from "../components/items";

import { useTranslation } from "react-i18next";
import moment from "moment";
function Edit(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const adminid = user.adminid;
  const { customers, products } = props;
  const [subTotal, setSubTotal] = useState(0);
  const [totalVat, setTatalVat] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [qSuffix, setqSuffix] = useState("");
  const [isStateTax, setIsStateTax] = useState(false);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerCreate, setCustomerCreate] = useState(false);
  const [locationData, setLocationData] = useState<any>([]);
  const location = useLocation();

  useEffect(() => {
    fetchLocations()
    initialLoad();
  }, []);
  const initialLoad = async () => {
    getInvoiceDetails()
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
  };
  
  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user.id +
        `/${user?.companyInfo?.id}/${locationId}/proforma`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error)
    }
  };

  const onFinish = async (val: any) => {
    let amountPaid = Number(val.amoutToPaid) || 0;
    let totalPayable = totalAmount;
    let outstanding = totalPayable - amountPaid;
    let status = "0";
    if (outstanding <= 0) {
      status = "2"; //paid
    } else if (outstanding < totalPayable) {
      status = "1"; //part Paid
    } else if (outstanding >= totalPayable) {
      status = "0"; //unpaid
    }
    setIsLoading(true);
    try {
      let selectedCustomer =
        customers &&
        customers?.length &&
        customers?.find((item: any) => item.id === val.customerid);

      let ledger =
        props.ledgers &&
        props?.ledgers?.length &&
        props?.ledgers?.find((item: any) => item.id === val.ledger);

      let column = val.columns.map((item: any) => {
        let foundedProduct = products.find(
          (product: any) => product.id === item.id
        );
        let productLedger = {};
        if (foundedProduct?.productDetails?.itemtype === "Stock") {
          productLedger = {
            category: "13",
            id: 1,
            laccount: "Sales-Products",
            nominalcode: "4000",
          };
        } else if (foundedProduct?.productDetails?.itemtype === " Service") {
          productLedger = {
            category: "24",
            id: 2,
            laccount: "Sales-Services",
            nominalcode: "4001",
          };
        }
        return {
          id: foundedProduct?.productId,
          productLocationRef : foundedProduct?.id,
          discount: item?.discount,
          discountamt: item?.discountamt,
          productId: item?.id,
          product: foundedProduct?.productDetails,
          idescription: foundedProduct?.productDetails?.idescription,
          description: foundedProduct?.productDetails?.idescription,
          vat: item?.vat,
          incomeTax: item?.vat,
          includevat: item.includeVat,
          percentage: item?.vat,
          costprice: item?.price,
          quantity: item.quantity,
          total: item?.total,
          vatamt: item?.vat,
          vatamount: item?.vatamount,
          incomeTaxAmount: item?.vatamount,
          itemorder: 1,
        };
      });
      let payload = {
        seriesNo:val?.seriesNo,
        cname: selectedCustomer?.name,
        customerid: val?.customerid,
        columns: column,
        invoiceno: val?.invoiceno,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        issued: "yes",
        type: "proforma",
        status: "0",
        pagetype: "1",
        roundOff: roundOff,
        total: Number(totalAmount).toFixed(2),
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: false,
        reference: val?.reference,
        salesType: "",
        ledger: ledger,
        email: user.email,
        outstanding,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };

      let salesUrl =
        props?.type === "update"
          ? API.UPDATE_SALES + props?.id
          : "SaleInvoice/add";
      const response: any =
        props?.type === "update"
          ? await PUT(salesUrl, payload)
          : await POST(salesUrl, payload);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `Proforma invoice ${
            props?.type === "update" ? "updated" : "created"
          } successfully`,
        });
        form.resetFields();
        navigate("/usr/sales-proforma-invoice");
        setIsLoading(false);
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            props?.type === "update" ? "update" : "create"
          } proforma invoice!!`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          props?.type === "update" ? "update" : "create"
        } proforma invoice! Please try again later`,
      });
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.LOCATION_GET_BY_USER + user?.id + '/' + user?.companyInfo?.id;
      const {data}: any = await GET(unit_url, null);
      setLocationData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  function containsNull(arr: any) {
    let isThereNull = false;
    for (let i = 0; i < arr?.length; i++) {
      const element = arr[i];
      if (element === undefined) {
        isThereNull = true;
      }
    }
    return isThereNull;
  }

  const onValuesChange = (column: any, allarray: any) => {
    try {
      if (column.customerid) {
        let selectedCustomer =
          props.customers &&
          props.customers.length &&
          props?.customers.find((item: any) => item.id === column.customerid);
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
        );
      }
      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
      }
      if (column.seriesNo) {
        getInvoiceNo(column.seriesNo)
        props.getProduct("both",column.seriesNo);
        form.setFieldsValue({ columns: [] });
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
      }
      if (allarray?.columns && allarray?.columns?.length) {
        let _subTotal = 0;
        let _tatalVat = 0;
        let _overollDiscount = 0;
        const updatedColumns = allarray?.columns?.map(
          (item: any, index: any) => {
            if (column?.columns?.length > 1) {
              if (containsNull(column.columns)) {
                let productId = column.columns[index]?.id || null;
                if (productId) {
                  let array = allarray?.columns;
                  array[index].price = null;
                  array[index].vat = null;
                  array[index].discount = null;
                  array[index].discountamt = null;
                  array[index].quantity = 1;
                  if (array?.length - 1 === index) {
                    array[index].includeVat = null;
                  }
                  form.setFieldsValue({ columns: array });
                }
              }
            } else {
              let productId = column.columns[index]?.id || null;
              if (productId) {
                let array = allarray?.columns;
                array[index].price = null;
                array[index].vat = null;
                array[index].discount = null;
                array[index].discountamt = null;
                array[index].includeVat = null;
                array[index].quantity = 1;
                form.setFieldsValue({ columns: array });
              }
            }
            if (item && item.id) {
              let foundProduct = products.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let columnDiscountAmt = Number(
                column?.columns[index]?.discountamt
              );
              let itemDiscountAmt = Number(item?.discountamt);
              let discountAmount: any =
                Number.isNaN(columnDiscountAmt) && Number.isNaN(itemDiscountAmt)
                  ? 0
                  : columnDiscountAmt || itemDiscountAmt || 0;

              let columnDiscount = Number(column?.columns[index]?.discount);
              let itemDiscount = Number(item?.discount);
              let discount: any =
                Number.isNaN(columnDiscount) && Number.isNaN(itemDiscount)
                  ? 0
                  : columnDiscount || itemDiscount || 0;

              setqSuffix(foundProduct?.productDetails?.unitDetails);
              // setPStock(Number(foundProduct.stock));
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index].quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? Number(foundProduct?.productDetails?.rate)
                  : item?.price;
              let total = price * quantity - discountAmount;

              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? Number(foundProduct?.productDetails?.vat)
                  : Number(item.vat);
              let vatAmount = Number(foundProduct?.productDetails?.vatamt);
              if (column?.columns[index]?.discount > 0) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = (price * quantity) * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = (price * quantity) * disRate;
                  total = price * quantity - discountAmount;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice.",
                  });
                }
              } else if (
                column?.columns[index]?.discount == null ||
                column?.columns[index]?.discount == 0 ||
                column?.columns[index]?.discount == "" ||
                column?.columns[index]?.discount === undefined
              ) {
                if (item?.discountamt > 0) {
                  const discountpecentage =
                    (Number(item?.discountamt) / (price * quantity)) * 100;
                  discountAmount = Number(item?.discountamt);
                  total = price * quantity - discountAmount;
                  discount = Number(discountpecentage);
                } else {
                  discountAmount = 0;
                  total = price * quantity - discountAmount;
                }
              }
              if (0 >= column?.columns[index]?.discountamt) {
                discount = 0;
              }

              if (column?.columns[index]?.discountamt > 0) {
                const discountpecentage =
                  (Number(item?.discountamt) / (price * quantity)) * 100;
                discountAmount = Number(item?.discountamt);
                total = price * quantity - discountAmount;
                discount = Number(discountpecentage.toFixed(2));
                if (column?.columns[index]?.discountamt >= total) {
                  let disRate = 100 / 100;
                  discountAmount = (price * quantity) * disRate;
                  total = price * quantity - discountAmount;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice.",
                  });
                }
              } else if (column?.columns[index]?.discountamt === "") {
                discount = "";
              }
              if (
                column?.columns[index]?.id === undefined ||
                column?.columns[index]?.includeVat !== undefined ||
                column?.columns[index]?.vat !== undefined ||
                column?.columns[index]?.quantity !== undefined ||
                column?.columns[index]?.discount !== undefined ||
                column?.columns[index]?.discountamt !== undefined ||
                column?.columns[index]?.price !== undefined
              ) {
                vatAmount =
                  ((price * quantity - discountAmount) * vatPercent) / 100;
              }

              let includeVat;
              const selectedIncludeVat = column?.columns[index]?.includeVat;
              if (selectedIncludeVat === undefined) {
                if (foundProduct?.productDetails?.includevat === "1.00") {
                  includeVat = item.includeVat === false ? false : true || true;
                } else {
                  includeVat = item.includeVat || false;
                }
              } else {
                includeVat = selectedIncludeVat;
              }
              if (includeVat) {
                let totalItemsRate = price * quantity - discountAmount;
                let totalTaxable = totalItemsRate / (1 + vatPercent / 100);
                vatAmount = totalItemsRate - totalTaxable;
                total = price * quantity - discountAmount;
              } else {
                total = Number(
                  (price * quantity - discountAmount + vatAmount).toFixed(2)
                );
              }

              //here total calculation
              if (includeVat) {
                _subTotal =
                  price * quantity - discountAmount - vatAmount + _subTotal;
              } else {
                _subTotal = price * quantity - discountAmount + _subTotal;
              }
              _tatalVat = _tatalVat + vatAmount;
              _overollDiscount = _overollDiscount + discountAmount;

              if (selectedIncludeVat === undefined) {
                //here we check if they not select incule vat now
                if (foundProduct?.productDetails?.includevat === "1.00") {
                  includeVat = item.includeVat === false ? false : true || true;
                } else {
                  includeVat = item.includeVat || false;
                }
              } else {
                includeVat = selectedIncludeVat;
              }

              // Use 'includeVat' as needed in your code

              const updatedColumn = {
                id: item.id,
                hsn_code: foundProduct?.productDetails?.hsn_code,
                sgst: Number(vatAmount) / 2,
                cgst: Number(vatAmount) / 2,
                igst: Number(vatAmount),
                quantity:
                  column?.columns[index]?.quantity === undefined
                    ? quantity
                    : column?.columns[index]?.quantity?.length == "0"
                    ? null
                    : item.quantity,
                price:
                  column?.columns[index]?.price === undefined
                    ? price
                    : column?.columns[index]?.price.length == "0"
                    ? null
                    : column?.columns[index]?.price,
                incomeTaxAmount: foundProduct?.productDetails?.vatamt,
                vatamt: foundProduct?.productDetails?.vatamt,
                description: foundProduct?.productDetails?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? foundProduct?.productDetails?.vat
                    : item?.vat,
                vatamount: vatAmount.toFixed(2),
                discountamt: discountAmount,
                discount: discount,
                total: total,
                includeVat,
              };
              return updatedColumn;
            } else {
              let newColumn = {
                id: null,
                hsn_code: null,
                sgst: null,
                cgst: null,
                igst: null,
                quantity: null,
                price: null,
                incomeTaxAmount: null,
                vatamt: null,
                description: null,
                vat: null,
                vatamount: null,
                discountamt: null,
                discount: null,
                total: null,
                includeVat: null,
              };
              return newColumn;
            }
          }
        );
        if (updatedColumns.length) {
          form.setFieldsValue({ columns: updatedColumns });
        }
        setSubTotal(_subTotal);
        setTatalVat(_tatalVat);
        setOverolDiscount(_overollDiscount);
        let _totalAmount = _subTotal + _tatalVat;
        let roundedNumber = Math.round(_totalAmount);
        let amountAdded = roundedNumber - _totalAmount;
        setRoundOff(Number(amountAdded.toFixed(2)));
        setTotalAmount(Number(roundedNumber.toFixed(2)));
        // setTotalAmount(_totalAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_SALE_INVOICE + props?.id + "/proforma";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails.status) {
        let initialValus = getInitialValues(getInvDetails?.data);
        form.setFieldsValue(initialValus);
        setIsFullLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
    }
  };

  const getInitialValues = (data: any) => {
    try {
      setIsStateTax(
        data?.invoiceDetails &&
          data?.invoiceDetails?.customer?.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
      );
      props?.getProduct("both",data?.invoiceDetails?.seriesNo);
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = data.invoiceItems.reduce(
        (acc: any, sum: any) => acc + Number(sum.discount_amount),
        0
      );
      let columns = data.invoiceItems.map((item: any) => {
        let vatAmount = Number(item.vatamt);

        if (item.includevat == 1) {
          _subTotal =
            Number(item.costprice) * Number(item.quantity) -
            vatAmount +
            _subTotal;
        } else {
          _subTotal =
            Number(item.costprice) * Number(item.quantity) + _subTotal;
        }
       
        //here total calculation

        _tatalVat = _tatalVat + vatAmount;
        return {
          id: item?.productLocationRef,
          hsn_code: item?.product?.hsn_code,
          sgst: Number(item.vatamt) / 2,
          cgst: Number(item.vatamt) / 2,
          igst: Number(item.vatamt),
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: item.vatamt,
          discount: item.discount,
          discountamt: item.discount_amount,
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });

      const initialValue = {
        invoiceno:
          props?.type === "duplicate"
            ? ""
            : data.invoiceDetails.invoiceno,
        seriesNo: data.invoiceDetails.seriesNo,
        customerid: data.invoiceDetails.customerid,
        ledger: 1,
        sdate: dayjs(data?.invoiceDetails?.sdate),
        ldate: dayjs(data?.invoiceDetails?.ldate),
        reference: data?.invoiceDetails?.reference,
        columns: columns,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
      };
      setSubTotal(_subTotal);
      setTatalVat(Number(_tatalVat.toFixed(2)));
      setRoundOff(Number(data?.invoiceDetails?.roundOff) || 0);
      setOverolDiscount(Number(_overollDiscount.toFixed(2)));
      let _totalAmount =
        _subTotal + _tatalVat + Number(data?.invoiceDetails?.roundOff);
      // _overollDiscount;
      setTotalAmount(Number(_totalAmount.toFixed(2)));
      return initialValue;
    } catch (error) {
      console.log(error);
      return {};
    }
  };
  return (
    <div>
      <PageHeader
        title={
          props?.type === "update"
            ? t("home_page.homepage.Edit_Proforma")
            : t("home_page.homepage.CreateProformaInvoice")
        }
        goBack={"/dashboard"}
        firstPathText={"Proforma Invoice"}
        firstPathLink={"/usr/sales-proforma-invoice"}
        secondPathLink={"/usr/sales-proforma-invoice"}
        thirdPathText={
          props?.type === "update"
            ? t("home_page.homepage.Edit_Proforma")
            : t("home_page.homepage.CreateProformaInvoice")
        }
        thirdPathLink={location.pathname}
      />
      <br />
      <Container>
        <Card>
          {isFullLoading ? (
            <LoadingBox />
          ) : (
            <Form
              form={form}
              onFinish={onFinish}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col sm={1}>
                  <div className="formLabel">
                    {t("home_page.homepage.seriesNo")}
                  </div>
                  <Form.Item
                    name={"seriesNo"}
                    rules={[
                      {
                        required: true,
                        message: "choose series",
                      },
                    ]}
                  >
                    <Select size="large">
                      { locationData?.length &&
                        locationData?.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item?.locationCode}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <div className="formLabel">
                    {t("home_page.homepage.invoice_no")}
                  </div>
                  <Form.Item
                    name={"invoiceno"}
                    rules={[
                      {
                        required: true,
                        message: "Type invoice",
                      },
                    ]}
                  >
                    <Input readOnly size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Customer_Name")}
                  </div>
                  <Form.Item
                    name={"customerid"}
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.choosecustomer"),
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      onSearch={(val: any) => props?.customerName(val)}
                      onChange={(val: any) => {
                        let selectCustomers = customers?.find(
                          (item: any) => item.id === val
                        );
                        form.setFieldsValue({
                          inaddress: selectCustomers?.address,
                          deladdress: selectCustomers?.address,
                        });
                      }}
                    >
                      <Select.Option key="addButton" value="addButton">
                        <Button
                          type="primary"
                          block
                          onClick={() => setCustomerCreate(true)}
                        >
                          <GoPlus />
                          {t("home_page.homepage.Add_New")}
                        </Button>
                      </Select.Option>
                      {customers &&
                        customers?.length &&
                        customers?.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item.bus_name}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.invoice_date")}
                  </div>
                  <Form.Item name={"sdate"}>
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
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Reference")}
                  </div>
                  <Form.Item name={"reference"}>
                    <Input size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Items
                form={form}
                products={products}
                qSuffix={qSuffix}
                // stock={pStock}
                taxLists={props.taxList}
                // isCheckChange={(val: any) => setIsCheck(val)}
                isStateTax={isStateTax}
              />
              <br />
              <Row>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Invoice_Address")}
                  </div>
                  <Form.Item name={"inaddress"}>
                    <Input.TextArea
                      rows={4}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Delivery_Address")}
                  </div>
                  <Form.Item name={"deladdress"}>
                    <Input.TextArea
                      rows={4}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Terms")}
                  </div>
                  <Form.Item name={"terms"}>
                    <Input.TextArea
                      rows={4}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Notes")}
                  </div>
                  <Form.Item name={"quotes"}>
                    <Input.TextArea
                      rows={4}
                      size="large"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col sm={6}></Col>
                <Col sm={6}>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                        <td>{Number(subTotal).toFixed(2)}</td>
                      </tr>
                      {user?.companyInfo?.tax === "gst" ? (
                        <>
                          {isStateTax ? (
                            <>
                              <tr>
                                <td>{t("home_page.homepage.totel_cgst")}</td>
                                <td>{(totalVat / 2)?.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td>{t("home_page.homepage.totel_sgst")}</td>
                                <td>{(totalVat / 2)?.toFixed(2)}</td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td>{t("home_page.homepage.totel_igst")}</td>
                              <td>{totalVat?.toFixed(2)}</td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td>{t("home_page.homepage.TOTAL_VAT")}</td>
                          <td>{Number(totalVat).toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                        <td>{Number(overollDiscount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>ROUND OFF</td>
                        <Input
                          className="p-1"
                          type="number"
                          bordered={false}
                          value={roundOff}
                          onChange={(e: any) => {
                            setRoundOff(e.target.value);
                            let round = Number(e.target.value);
                            let _totalAmount =
                              subTotal + totalVat - overollDiscount;
                            _totalAmount = _totalAmount - round;
                            setTotalAmount(_totalAmount);
                          }}
                        />
                      </tr>
                      <tr>
                        <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                        <td>{Number(totalAmount).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row>
                    <Col sm={6}>
                      <Button
                        size="large"
                        className="mb-3"
                        block
                        onClick={() => navigate(-1)}
                      >
                        {t("home_page.homepage.Close")}
                      </Button>
                    </Col>
                    <Col sm={6}>
                      <Button
                        size="large"
                        block
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                      >
                        {props?.type === "update"
                          ? t("home_page.homepage.Update")
                          : t("home_page.homepage.Create")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      </Container>
      {customerCreate ? (
        <CreateCutomerModal
          open={customerCreate}
          onCancel={() => setCustomerCreate(false)}
          customerSearch={props.customerName}
          type="customer"
          customer={(val: any) => {
            form.setFieldsValue({ customerid: Number(val.id) });
            setIsStateTax(
              val?.vat_number?.substring(0, 2) ===
              user?.companyInfo?.taxno?.substring(0, 2)
            );
          }}
        />
      ) : null}
    </div>
  );
}
export default Edit;
