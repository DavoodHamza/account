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
import { Col, Container, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import { GET, POST } from "../../../utils/apiCalls";
import Items from "../components/items";
import API from "../../../config/api";
import { useTranslation } from "react-i18next";
function Generate(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const adminid = user?.id;
  const { id, products, customers, ledgers, banks } = props;
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [isStateTax, setIsStateTax] = useState(false);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [proformaInvNo, setProformaInvNo] = useState();
  const [oldProformaId, setOldProformaId] = useState();
  const [qSuffix, setqSuffix] = useState("");
  const [pStock, setPStock] = useState(0);
  const [ledgerId, setLedgerId] = useState<any>();
  const [locationData, setLocationData] = useState<any>([]);
  const [nonProductProducts, setNonStockProducts] = useState<any>();

  useEffect(() => {
    getInvoiceDetails();
    fetchLocations()
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
  }, []);

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_SALE_INVOICE + id + "/proforma";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails.status) {
        setDetails(getInvDetails?.data);
        setOldProformaId(getInvDetails?.data?.invoiceDetails?.id);
        setProformaInvNo(getInvDetails?.data?.invoiceDetails?.invoiceno);
        setLedgerId(getInvDetails?.data?.invoiceDetails?.ledger)
        let initialValus = getInitialValues(getInvDetails?.data);
        form.setFieldsValue({
          ...initialValus,
          ldate: dayjs(new Date()),
        });
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
        data.invoiceDetails["customer.state"] === user.companyInfo.state
      );
     props.getProduct("non-assets",data?.invoiceItems[0]?.seriesNo);
     getInvoiceNo(data?.invoiceItems[0]?.seriesNo);
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = data.invoiceItems.reduce(
        (acc: any, sum: any) => acc + Number(sum.discount_amount),
        0
      );
      let ledger;
      let nonStockItem: any = [];
      let columns = data.invoiceItems.map((item: any) => {
        let vatAmount = Number(item.vatamt);
        ledger =
          item?.product?.itemtype === "Service"
            ? 2
            : item?.product?.itemtype === "Stock"
            ? 1
            : "";
        if (item.product.itemtype === "Nonstock") {
          notification.error({
            message: "Alert",
            description:
              "Your order have non stock items!! Please purchase products for generate invoice",
          });
          nonStockItem.push(item.product);
        }
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
          hsn_code: item?.hsn_code,
          sgst: item?.vatamt / 2,
          cgst: item?.vatamt / 2,
          igst: item?.vatamt,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: item.vatamt,
          discount: item.discount,
          discountamt: Number(item.discount_amount),
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });

      setNonStockProducts(nonStockItem);

      const initialValue = {
        seriesNo: data.invoiceDetails.seriesNo,
        invoiceno: data.invoiceDetails.invoiceno,
        customerid: data.invoiceDetails.customerid,
        ledger: ledger, //1,
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
        _subTotal +
        _tatalVat +
        Number(data?.invoiceDetails?.roundOff) 
        // _overollDiscount;
      setTotalAmount(Number(_totalAmount.toFixed(2)));
      return initialValue;
    } catch (error) {
      return {};
    }
  };

  const onFinish = async (val: any) => {
    let amountPaid = Number(val.amoutToPaid) || 0;
    let totalPayable = Number(val.availableBalance) || totalAmount;
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
    let paymentInfo = isPaymentInfo;
    if (isPaymentInfo) {
      paymentInfo = {
        id: val.paymentBank,
        bankid: val.paymentBank,
        outstanding: val.outStanding,
        amount: val?.availableBalance,
        date: val?.paymentDate,
        type: val.paymentMethod,
        paidmethod: val.paymentMethod,
      };
    }

    try {
      let selectedCustomer =
        customers &&
        customers?.length &&
        customers.find((item: any) => item.id === val.customerid);

      let ledger =
        ledgers &&
        ledgers?.length &&
        ledgers?.find((item: any) => item.id === val.ledger);

      let column = val.columns.map((item: any) => {
        let foundedProduct = products?.find(
          (product: any) => product.id === item.id
        );

        let productLedger = {};
        let itemId ;
        let iDescription ;
        let itemDetails ;
        let locationRef;

        if (foundedProduct?.productDetails?.itemtype === "Stock") {
          productLedger = {
            category: "13",
            id: 1,
            laccount: "Sales-Products",
            nominalcode: "4000",
          };

          itemId = foundedProduct?.productId
          iDescription = foundedProduct.productDetails.idescription
          itemDetails = foundedProduct?.productDetails
          locationRef = foundedProduct?.id

        } else{
          if (foundedProduct?.itemtype === " Service") {
            productLedger = {
              category: "24", //"13"
              id: 2,
              laccount: "Sales-Services",
              nominalcode: "4001",
            };

            itemId = item?.id
            iDescription = foundedProduct.idescription
            itemDetails = foundedProduct
            locationRef = null
          }
        }
        return {
          id: itemId,
          productLocationRef : locationRef,
          discount: item.discount,
          discountamt: item.discountamt,
          productId: itemId,
          product: itemDetails,
          idescription: iDescription,
          description: iDescription,
          vat: item?.vat,
          includevat: item?.includeVat,
          incomeTax: item?.vat,
          percentage: item?.vat,
          costprice: item?.price,
          ledgerDetails: productLedger,
          ledger: productLedger,
          quantity: item?.quantity,
          total: item?.total,
          vatamt: item?.vat,
          vatamount: item?.vatamt,
          incomeTaxAmount: item?.vatamt,
          itemorder: 1,
        };
      });
      let payload = {
        seriesNo:val?.seriesNo,
        cname: selectedCustomer?.bus_name,
        customerid: val?.customerid,
        columns: column,
        invoiceno: val?.invoiceno,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        status: status,
        issued: "yes",
        type: "sales",
        pagetype: "4",
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: paymentInfo,
        reference: val?.reference,
        roundOff: roundOff,
        salesType: "",
        ledger: ledger,
        email: user.email,
        proformaInvNo,
        oldProformaId,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
        total: Number(totalAmount).toFixed(2),
        taxable_value: Number(subTotal).toFixed(2),
        total_vat: Number(tatalVat).toFixed(2),
        overall_discount: Number(overollDiscount),
      };
      let salesUrl = "SaleInvoice/add";
      const response: any = await POST(salesUrl, payload);
      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: "Sales invoice generated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to generate sales invoice",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          "Failed to generate sales invoice!! Please try again later",
      });
      setIsLoading(false);
    }
  };

  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user.id +
        `/${user?.companyInfo?.id}/${locationId}/sales`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      setInvoiceNumber(invnumber);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error)
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
    for (let i = 0; i < arr.length; i++) {
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
          props?.customers &&
          props?.customers?.length &&
          props?.customers?.find((item: any) => item.id === column.customerid);
        setIsStateTax(selectedCustomer.state === user.companyInfo.state);
      }

      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
      }

      if(column.seriesNo){
        getInvoiceNo(column.seriesNo)
      }
      
      if (column.ledger && allarray?.seriesNo) {
        props.getProduct(column.ledger === 2 ? "Service" : "Stock",allarray?.seriesNo);
        setLedgerId(column.ledger)
        form.setFieldsValue({ columns: [] }); 
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
      }
      if (allarray.ledger && column?.seriesNo) {
        props.getProduct(allarray.ledger === 2 ? "Service" : "Stock",column?.seriesNo);
        form.setFieldsValue({ columns: [] }); 
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
      }
      if (column.paymentBank) {
        let selectedBank = props?.banks?.find(
          (item: any) => item.id === column.paymentBank
        );
        form.setFieldsValue({
          bicnum: selectedBank.bicnum,
          ibanNumber: selectedBank.ibannum,
          accountNumber: selectedBank.accnum,
          holderName: selectedBank.laccount,
          availableBalance: selectedBank.total,
          outStanding: totalAmount.toFixed(2),
          paymentMethod:
            selectedBank.acctype === "savings" ? "cash" : selectedBank.acctype,
        });
      }
      if (column.amoutToPaid) {
        let outstanding = totalAmount - Number(column.amoutToPaid);
        form.setFieldsValue({ outStanding: outstanding });
      } else if (
        allarray.amoutToPaid === null ||
        allarray.amoutToPaid === undefined ||
        allarray.amoutToPaid === ""
      ) {
        form.setFieldsValue({
          outStanding: totalAmount - 0,
        });
      }

      if (allarray?.columns && allarray?.columns?.length) {
        let _subTotal = 0;
        let _tatalVat = 0;
        let _overollDiscount = 0;
        const updatedColumns = allarray?.columns?.map(
          (item: any, index: any) => {
            if (column?.columns?.length > 1) {
              if (containsNull(column?.columns)) {
                let productId = column?.columns[index]?.id || null;
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
              let productId = column?.columns[index]?.id || null;
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
                (product: any) => Number(product?.id) === Number(item?.id)
              );

              let quantity =
              column?.columns[index]?.quantity === undefined
                ? item?.quantity || 1
                : column?.columns[index]?.quantity;
            let price =
             ( item?.price === undefined || item?.price === null)
                ? (ledgerId === 2 ? Number(foundProduct?.sp_price):  Number(foundProduct?.productDetails?.sp_price))
                : Number(item?.price);
            let total = price * quantity;

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

                  let unitDetails = ledgerId === 2 ? foundProduct?.unitDetails : foundProduct?.productDetails?.unitDetails
                  setqSuffix(unitDetails);

              const curentQuntityChangingIndex =
                column?.columns[index]?.quantity === undefined
                  ? -1
                  : column.columns.findIndex(
                      (item: any) =>
                        item?.quantity === column?.columns[index]?.quantity
                    );
              if (curentQuntityChangingIndex >= 0) {
                setPStock(Number(foundProduct?.stock));
              }

              // remove non stock item fro nonstock array state
              if (
                column?.columns[index]?.length &&
                column?.columns[index]?.itemtype === "Nonstock"
              ) {
                // notification.error({
                //   message: "Alert",
                //   description:
                //     "Your order have non stock items!! Please purchase products for generate invoice",
                // });
                setNonStockProducts([...nonProductProducts, foundProduct?.productDetails]);
              } else {
                let filteredNonStockItems = nonProductProducts?.filter(
                  (item: any) => {
                    return !column?.columns.some(
                      (col: any) => col.id !== item.id
                    );
                  }
                );
                setNonStockProducts(filteredNonStockItems);
              }

                  let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? (ledgerId === 2 ? Number(foundProduct?.vat) : Number(foundProduct.productDetails?.vat) )
                  : Number(item.vat);
              let vatAmount = ledgerId === 2 ? Number(foundProduct?.vatamt) : Number(foundProduct.productDetails?.vatamt);

              total = price * quantity - discountAmount;
              if (
                column?.columns[index]?.discount > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price != null &&
                item.price !== 0
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = total * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = total * disRate;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice",
                  });
                }
              } else if (
                column?.columns[index]?.discount == null ||
                column?.columns[index]?.discount == 0 ||
                column?.columns[index]?.discount == "" ||
                column?.columns[index]?.discount === undefined
              ) {
                if (
                  item?.discountamt > 0 &&
                  item.quantity != null &&
                  item.quantity !== 0 &&
                  item.price != null &&
                  item.price !== 0
                ) {
                  const discountpecentage =
                    (Number(item?.discountamt) / total) * 100;
                  discountAmount = Number(item?.discountamt);
                  total = price * quantity - discountAmount;
                  discount = Number(discountpecentage);
                } else {
                  discountAmount = 0;
                }
              }
              if (0 >= column?.columns[index]?.discountamt) {
                discount = 0;
              }
              if (
                column?.columns[index]?.discountamt > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price !== 0 &&
                item.price !== null
              ) {
                const discountpecentage =
                  (Number(item?.discountamt) / total) * 100;
                discountAmount = Number(item?.discountamt);
                total = price * quantity - discountAmount;
                discount = Number(discountpecentage);
                if (column?.columns[index]?.discountamt >= total) {
                  let disRate = 100 / 100;
                  discountAmount = total * disRate;
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
                column.columns[index]?.price ||
                column.columns[index]?.quantity
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = total * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
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
                if (ledgerId === 2 ? foundProduct?.includevat === "1.00" : foundProduct.productDetails?.includevat === "1.00") {
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

              const updatedColumn = {
                id: item.id,
                hsn_code: ledgerId === 2 ? foundProduct?.hsn_code : foundProduct.productDetails?.hsn_code,
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
                    ? Number(price).toFixed(2)
                    : column?.columns[index]?.price?.length == "0"
                    ? null
                    : Number(item.price).toFixed(2),
                incomeTaxAmount: vatAmount.toFixed(2),
                vatamt: vatAmount.toFixed(2),
                description: ledgerId === 2 ?  foundProduct?.idescription : foundProduct?.productDetails?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? (ledgerId === 2 ? foundProduct?.vat : foundProduct?.productDetails?.vat)
                    : item?.vat,
                vatamount: vatAmount.toFixed(2),
                discountamt: Number(discountAmount).toFixed(2),
                discount: Number(discount).toFixed(2),
                total: Number(total).toFixed(2),
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
          setSubTotal(_subTotal);
          setTatalVat(_tatalVat);
          setOverolDiscount(_overollDiscount);
          let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
          let roundedNumber = Math.round(_totalAmount);
          let amountAdded = roundedNumber - _totalAmount;
          setRoundOff(Number(amountAdded.toFixed(2)));
          //setTotalAmount(roundedNumber);
          setTotalAmount(_totalAmount);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.GenerateSales")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.GenerateInvoice")}
        secondPathLink={"/usr/sales-invoice"}
      ></PageHeader>
      <br />
      <Container>
        <Card>
          <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
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
                      {locationData &&
                        locationData?.length &&
                        locationData?.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item.locationCode}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              <Col sm={1}>
                <div className="formLabel">
                  {t("home_page.homepage.invoice_no")}
                </div>
                <Form.Item name={"invoiceno"} rules={[{ required: true }]}>
                  <Input size="large" readOnly />
                </Form.Item>
              </Col>
              <Col sm={2}>
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
                        inaddress: selectCustomers.address,
                        deladdress: selectCustomers.address,
                      });
                    }}
                  >
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
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.Sales_Ledger")}
                </div>
                <Form.Item
                  name={"ledger"}
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.chooseledger"),
                    },
                  ]}
                >
                  <Select size="large">
                    {ledgers &&
                      ledgers.length &&
                      ledgers?.map((item: any) => {
                        return (
                          <Select.Option key={item.id} value={item.id}>
                            {item.nominalcode + "-" + item.laccount}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.invoice_date")}
                </div>
                <Form.Item
                  name={"sdate"}
                  initialValue={dayjs(new Date())}
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.chooseinvoicedate"),
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.Due_Date")}
                </div>
                <Form.Item
                  name={"ldate"}
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.chooseduedate"),
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.Reference")}
                </div>
                <Form.Item
                  name={"reference"}
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.choosereference"),
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Items
              form={form}
              products={props?.products}
              taxLists={props?.taxList}
              qSuffix={qSuffix}
              stock={pStock}
              isStateTax={isStateTax}
              ledgerId ={ledgerId}
            />
            <br />
            <Row>
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.Invoice_Address")}
                </div>
                <Form.Item
                  name={"inaddress"}
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.Enterinvoice_address"),
                    },
                  ]}
                >
                  <Input.TextArea rows={4} size="large" />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.Delivery_Address")}
                </div>
                <Form.Item
                  name={"deladdress"}
                  // rules={[
                  //   { required: true, message: "enter delivery address" },
                  // ]}
                >
                  <Input.TextArea rows={4} size="large" />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">{t("home_page.homepage.Terms")}</div>
                <Form.Item name={"terms"}>
                  <Input.TextArea rows={4} size="large" />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">{t("home_page.homepage.Notes")}</div>
                <Form.Item name={"quotes"}>
                  <Input.TextArea rows={4} size="large" />
                </Form.Item>
              </Col>
            </Row>
            <div className="salesInvoice-SubHeader">
              <div>{t("home_page.homepage.Record_Payment")}</div>
              <div>
                <Button
                  style={{ backgroundColor: "#ff9800", color: "#fff" }}
                  onClick={() => setIsPaymentInfo(!isPaymentInfo)}
                >
                  {isPaymentInfo ? "Close" : "+ Add"} Payment
                </Button>
              </div>
            </div>
            {isPaymentInfo ? (
              <Row>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Choose_PaymentBank")} :
                  </div>
                  <Form.Item
                    noStyle
                    name="paymentBank"
                    rules={[{ required: true, message: "" }]}
                  >
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      placeholder={t("home_page.homepage.selectpayment_bank")}
                    >
                      {banks?.length &&
                        banks?.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item?.laccount}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Accholdername")}
                  </div>
                  <Form.Item
                    noStyle
                    name="holderName"
                    rules={[{ required: true, message: "" }]}
                  >
                    <Input
                      placeholder={t("home_page.homepage.Accholdername")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Bank Info")} :
                  </div>
                  <Form.Item noStyle name="accountNumber">
                    <Input
                      placeholder={t("home_page.homepage.account_number")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.BIC/Swift")}
                  </div>
                  <Form.Item noStyle name="bicnum">
                    <Input
                      placeholder={t("home_page.homepage.BIC/Swift")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.IBAN_Number")} :
                  </div>
                  <Form.Item noStyle name="ibanNumber">
                    <Input
                      placeholder={t("home_page.homepage.IBAN_Number")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Payment_Date")}:
                  </div>
                  <Form.Item
                    noStyle
                    name="paymentDate"
                    initialValue={dayjs(new Date())}
                  >
                    <DatePicker
                      defaultValue={dayjs(new Date(), "YYYY-MM-DD")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.AvailableBalance")}:
                  </div>
                  <Form.Item name={"availableBalance"} noStyle>
                    <Input
                      placeholder={t("home_page.homepage.AvailableBalance")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.outstanding")} :
                  </div>
                  <Form.Item name={"outStanding"} noStyle>
                    <Input
                      placeholder={t("home_page.homepage.outstandingamount")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.AmountToBePaid")} :
                  </div>
                  <Form.Item
                    noStyle
                    name="amoutToPaid"
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.enteramount"),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder={t("home_page.homepage.enteramount")}
                    />
                  </Form.Item>
                </Col>
                <Col sm={8}></Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Paid_Method")}:
                  </div>
                  <Form.Item
                    noStyle
                    name="paymentMethod"
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.choosepayment"),
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      placeholder={t("home_page.homepage.choosepayment")}
                      options={[
                        { label: "Cash", value: "cash" },
                        { label: "Current", value: "current" },
                        { label: "Cheque", value: "cheque" },
                        { label: "Electronic", value: "other" },
                        { label: "Credit/Debit Card", value: "card" },
                        // { label: "PayPal", value: "loan" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <br />
            <br />
            <Row>
              <Col sm={6}></Col>
              <Col sm={6}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                      <td>{subTotal.toFixed(2)}</td>
                    </tr>
                    {user?.companyInfo?.tax === "gst" ? (
                      <>
                        {isStateTax ? (
                          <>
                            <tr>
                              <td>{t("home_page.homepage.totel_cgst")}</td>
                              <td>{(tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>{t("home_page.homepage.totel_sgst")}</td>
                              <td>{(tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td>{t("home_page.homepage.totel_igst")}</td>
                            <td>{tatalVat?.toFixed(2)}</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td>{t("home_page.homepage.totel_vat")}</td>
                        <td>{tatalVat?.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                      <td>{overollDiscount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>ROUND OFF</td>
                      <td className="p-1">
                        <Input
                          className="p-1"
                          type="number"
                          bordered={false}
                          value={roundOff}
                          onChange={(e: any) => {
                            setRoundOff(e.target.value);
                            let round = Number(e.target.value);
                            let _totalAmount =
                              subTotal + tatalVat - overollDiscount;
                            _totalAmount = _totalAmount - round;
                            setTotalAmount(_totalAmount);
                          }}
                          // suffix={false}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                      <td>{totalAmount.toFixed(2)}</td>
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
                      disabled={nonProductProducts?.length}
                    >
                      {t("home_page.homepage.Generate")}
                    </Button>
                  </Col>
                </Row>
                {nonProductProducts?.length ? (
                  <Row>
                    <span style={{ color: "red" }}>
                      *Your product list contains non stock items(
                      {nonProductProducts
                        .map((item: any) => item.idescription)
                        .join(", ")}
                      )
                    </span>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
export default Generate;
