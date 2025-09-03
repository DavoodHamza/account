import { Col, Container, Row, Table } from "react-bootstrap";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  notification,
} from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET, POST } from "../../../../utils/apiCalls";
import PageHeader from "../../../../components/pageHeader";
import Items from "./items";
import API from "../../../../config/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PrintModal from "../../../../components/printModal/printModal";
import dayjs from "dayjs";
import {
  template1,
  template2,
  template3,
  template4,
  template5
} from "../../../sales/components/templates";
import { useTranslation } from "react-i18next";
function Create(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const navigate = useNavigate();
  const adminid = user?.id;
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invoicesLoding, setInvoicesLoding] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [qSuffix, setqSuffix] = useState("");
  const [pStock, setPStock] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [template, setTemplate] = useState();
  const [purchaceInvoice, setPurchaceInvoice] = useState();
  const [invNumber, setInvNumber] = useState();
  const [products,setProducts] = useState<any>([])
  const [locationData, setLocationData] = useState<any>([]);
  const [isStateTax, setIsStateTax] = useState(false);


  const onFinish = async (val: any) => {
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
      let selectedSuplier =
        props?.customers &&
        props?.customers?.length &&
        props?.customers?.find((item: any) => item.id === val.supplierid);

      let ledger =
        props?.ledgers &&
        props?.ledgers?.length &&
        props?.ledgers?.find((item: any) => item?.id === val?.ledger);

      let column = val?.columns?.map((item: any, index: number) => {
        let foundedProduct = products?.find(
          (product: any) => product.id == item.id
        );

        let productLedger = {};
        if (foundedProduct?.itemtype === "Stock") {
          productLedger = {
            category: "6",
            id: 20703,
            laccount: "Purchase Return",
            nominalcode: "5002",
          };
        }

        return {
          id: item?.id,
          productLocationRef : item.productLocationRef, //fk;
          discount: item.discount,
          discountamt: item.discountamt,
          productId: item?.id, 
          product: foundedProduct,
          idescription: item.description,
          description: item.description,
          vat: item.vat,
          includevat:
            item.includeVat === null
              ? foundedProduct.includevat === "0.00"
                ? false
                : true
              : item.includeVat,
          incomeTax: item.vat,
          percentage: item.discount,
          costprice: item.price,
          ledgerDetails: productLedger,
          ledger: productLedger,
          quantity: item.quantity,
          total: item.total,
          vatamt: item.vatamount,
          vatamount: item.vatamount,
          incomeTaxAmount: item.vatamount,
          itemorder: index + 1,
        };
      });

      let purchaseDeatails = {
        seriesNo:val?.seriesNo ,
        sdate: val?.sdate,
        ldate: val?.ldate,
        invoiceno: val.invoiceno,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        total: val.total,
        quotes: val?.quotes,
        status: 10,
        refid: null,
      };

      let payload = {
        seriesNo: val?.seriesNo,
        supplier: selectedSuplier,
        pList: column,
        purchase: purchaseDeatails,
        invoiceno: val.invoiceno,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        adminid: adminid,
        status: 0,
        issued: "yes",
        type: "pcredit",
        pagetype: "1",
        total: Number(totalAmount.toFixed(2)),
        userid: adminid,
        userdate: new Date(),
        attachDoc: "",
        attachImage: "",
        paymentInfo: paymentInfo,
        ledger: ledger,
        refid: null,
        purchase_ref: invNumber,
        // roundOff: roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        invoiceid: purchaceInvoice,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };
      const chunkSize = 8;
        const splitArray = [];
        const invoiceItems = column;

        for (let i = 0; i < invoiceItems.length; i += chunkSize) {
            splitArray.push(invoiceItems.slice(i, i + chunkSize));
        }

        if (invoiceItems.length > 6) {
        }
      let obj = {
        user: user,
        customer: selectedSuplier,
        sale: {
          inaddress: val?.inaddress,
          deladdress: val?.deladdress,
          invoiceno: val.invoiceno,
          seriesNo: val?.seriesNo,
          quotes: val?.quotes,
          terms: val?.terms,
          reference: val?.reference,
          userdate: new Date(),
          sdate: dayjs(val?.sdate).format("YYYY-MM-DD"),
          ldate: dayjs(val?.ldate).format("YYYY-MM-DD"),
          total: totalAmount,
          outstanding: isPaymentInfo ? paymentInfo.outstanding : totalAmount,
          status: 0,
          adminid: 2856200,
        },
        productlist: column,
        bankList: {},
        vatTotal: tatalVat,
        netTotal: subTotal,
        Discount: overollDiscount,
        // round: roundOff,
        total: totalAmount,
        vatRate: tatalVat,
        isPaymentInfo: false,
        invoicearray:splitArray,
        pagetype: "Debit Note",
        selectedBank: user?.companyInfo?.bankInfo,
      };
      let templates: any = null;
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      }else if (user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      }else if (user.companyInfo.defaultinvoice === "5") {
        templates = template5(obj);
      }
      setTemplate(templates);
      let salesUrl = API.PURCHASE_INVOICE_ADD;
      const response: any = await POST(salesUrl, payload);
      if (response.status) {
        setIsLoading(false);
        setModalOpen(true);
        notification.success({
          message: "Success",
          description: "Debit Note created successfully",
        });
        // navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to create debit note",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error)
      notification.error({
        message: "Server Error",
        description: "Failed to create debit note,please try again later",
      });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLocations()
    form.setFieldsValue({
      sdate: moment(new Date()),
      ldate: moment(new Date()),
      paymentDate: moment(new Date()),
    });
  }, []);

  const getInvoices = async (supplierId: number,locationId:number) => {
    try {
      setInvoicesLoding(true);
      let invoiceurl =
        "purchaseinvoice/getByLocationAndSupplier" +
        `?supplierId=${supplierId}&companyId=${props?.companyid}&locationId=${locationId}&type=debit`;
      const { data: Invoices }: any = await GET(invoiceurl, null);
      let invoiceData = Invoices?.filter((item: any) => item?.id);
      setInvoices(invoiceData);
      setInvoicesLoding(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.LOCATION_GET_BY_USER + user?.id + '/' + user?.companyInfo?.id;
      const {data}: any = await GET(unit_url, null);
      setLocationData(data);
      form.setFieldsValue({ seriesNo: data[0]?.id });
      getInvoiceNo(data[0]?.id)
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };


  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user.id +
        `/${user?.companyInfo?.id}/${locationId}/pcredit`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error)
    }
  };

  const getColumnData = async (val: any) => {
    try {
      let invoiceurl = API.PURCHASE_SUPPLIER_LIST + val + "/purchase";
      const { data: purchaceDeatails }: any = await GET(invoiceurl, null);
      setPurchaceInvoice(purchaceDeatails.invoiceDetails.id);
      setInvNumber(purchaceDeatails?.invoiceDetails?.invoiceno);
      let _subTotal = 0;
      let _tatalVat = 0;
      let total = 0;
      let _overollDiscount = purchaceDeatails.invoiceItems.reduce(
        (acc: any, sum: any) => acc + Number(sum.discount_amount),
        0
      );
      let allProducts:any = [];
      let columns = purchaceDeatails.invoiceItems.map((item: any) => {
        let productObj = {
          ...item?.product,
          totalPurchasedStock: item?.quantity,
          productLocationRef: item.productLocationRef,
        };
        allProducts.push(productObj)
        let vatAmount = Number(item.vatamt);

        if (item.includevat === 0) {
          total = Number(item.costprice) * Number(item.quantity) + vatAmount;
          _subTotal =
            Number(item.costprice) * Number(item.quantity) + _subTotal;
        } else {
          total = Number(item.costprice) * Number(item.quantity);
          _subTotal =
            Number(item.costprice) * Number(item.quantity) -
            item.vatamt +
            _subTotal;
        }

        _tatalVat = _tatalVat + Number(item.vatamt);
        return {
          id: item.product.id,
          productLocationRef:item.productLocationRef,
          seriesNo: item?.seriesNo,
          hsn_code: item.product.hsn_code,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          igst: item.vatamt,
          cgst: Number(item.vatamt) / 2,
          sgst: Number(item.vatamt) / 2,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: item.vatamt,
          discount: Number(item.discount),
          discountamt: item?.discount_amount,
          total: Number(item.total),
          includeVat: item.includevat == 1 ? true : false,
        };
      });
      setProducts(allProducts)

      const initialValue = {
        columns: columns,
      };
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setOverolDiscount(_overollDiscount);
      // let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
      let _totalAmount =
        _subTotal +
        _tatalVat 
      //  - Number(purchaceDeatails?.invoiceDetails?.roundOff);
      // _overollDiscount;
      // setRoundOff(Number(purchaceDeatails?.invoiceDetails?.roundOff) || 0);
      setTotalAmount(_totalAmount);
      // setTotalAmount(_totalAmount);
      form.setFieldsValue(initialValue);
    } catch (error) {
      console.log(error)
      return {};
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

  const formValue = form.getFieldsValue();
  const onValuesChange = (column: any, allarray: any) => {
    try {
      if (column.supplierid) {
        let selectedCustomer =
          props?.customers &&
          props?.customers?.length &&
          props?.customers?.find((item: any) => item.id === column.supplierid);
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
        );
      }

      if(column.seriesNo){
        getInvoiceNo(column.seriesNo);
        form.setFieldsValue({ columns: [] });
      }

      if (column.supplierid && allarray?.seriesNo) {
        getInvoices(column.supplierid,allarray?.seriesNo);
      }
      if (column.purchaceInvoice) {
        getColumnData(column.purchaceInvoice);
      }

      if (column.amoutToPaid) {
        let outstanding = totalAmount - Number(column.amoutToPaid);
        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0) {
          form.setFieldsValue({ outStanding: 0, amoutToPaid: totalAmount - 0 });
          notification.error({
            message:
              "The amount cannot be greater than the outstanding balance.",
          });
        }
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
              if (
                !column?.columns[index]?.price ||
                !column?.columns[index]?.quantity
              ) {
                if (
                  column?.columns[index]?.discount ||
                  column?.columns[index]?.discountamt
                ) {
                  console.log("");
                } else {
                  if (column?.columns[index]?.id) {
                    let array = allarray?.columns;
                    array[index].price = null;
                    array[index].vat = null;
                    array[index].discount = null;
                    array[index].discountamt = null;
                    array[index].quantity = null;
                    if (array?.length - 1 === index) {
                      array[index].includeVat = null;
                    }
                    form.setFieldsValue({ columns: array });
                  }
                }
              }
            }

            if (item && item.id !== null) {
              let foundProduct = products?.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ?  Number(foundProduct?.costprice)
                  : item?.price;
              let total = price * quantity;

              let columnDiscountAmt = Number(
                column?.columns[index]?.discountamt
              );
              let itemDiscountAmt = Number(item?.discountamt);
              let discountAmount: any =
                Number.isNaN(columnDiscountAmt) && Number.isNaN(itemDiscountAmt)
                  ? 0
                  : columnDiscountAmt ||
                    item?.quantity === null ||
                    item?.quantity === 0 ||
                    item?.price === null ||
                    Number(item?.price) === 0
                  ? 0
                  : itemDiscountAmt || 0;
              total = price * quantity - discountAmount;
              let columnDiscount = Number(column?.columns[index]?.discount);
              let itemDiscount = Number(item?.discount);
              let discount: any =
                Number.isNaN(columnDiscount) && Number.isNaN(itemDiscount)
                  ? 0
                  : columnDiscount ||
                    item?.quantity === null ||
                    item?.price === null ||
                    item?.quantity === 0 ||
                    Number(item?.price) === 0
                  ? 0
                  : itemDiscount || 0;

              setqSuffix(foundProduct?.unitDetails);
              const curentQuntityChangingIndex =
                column?.columns[index]?.quantity === undefined
                  ? -1
                  : column?.columns?.findIndex(
                      (item: any) =>
                        item?.quantity === column?.columns[index]?.quantity
                    );
              if (curentQuntityChangingIndex >= 0) {
                setPStock(Number(foundProduct.totalPurchasedStock));
              }

              if (
                column?.columns[index]?.discount > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price != null &&
                item.price !== 0
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = (price * quantity) * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = total * disRate;
                  total = price * quantity - discountAmount;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice",
                  });
                }
              } else if (column?.columns[index]?.discount === "") {
                discountAmount = 0;
                total = price * quantity - discountAmount;
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
              if (
                column?.columns[index]?.discountamt > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price !== 0 &&
                item.price !== null
              ) {
                const discountpecentage =
                  (Number(item?.discountamt) / (price * quantity)) * 100;
                discountAmount = Number(item?.discountamt);
                total = price * quantity - discountAmount;
                discount = Number(discountpecentage);
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
                column.columns[index]?.price ||
                column.columns[index]?.quantity
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = (price * quantity) * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
              }
              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? Number(foundProduct?.vat)
                  : Number(item.vat);
              let vatAmount =
                formValue?.column?.columns?.length > 1
                  ? formValue?.columns[index].vatamount
                  :  Number((foundProduct?.vat * total) / 100);

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
              ///////////////////////includeVat//////////////
              let includeVat;
              const selectedIncludeVat = column?.columns[index]?.includeVat;
              if (selectedIncludeVat === undefined) {
                if (foundProduct?.includevat === "1.00") {
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
                total = Number(price * quantity - discountAmount + vatAmount);
              }
              ///////////////////////includeVat//////////////

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
                productLocationRef:item.productLocationRef,
                igst: Number(vatAmount).toFixed(2),
                sgst: Number(vatAmount) / 2,
                cgst: Number(vatAmount) / 2,
                hsn_code: foundProduct?.hsn_code,
                quantity:
                  column?.columns[index]?.quantity === undefined
                    ? quantity
                    : column?.columns[index]?.quantity?.length == "0"
                    ? null
                    : item.quantity,
                price:
                  column?.columns[index]?.price === undefined
                    ? price
                    : column?.columns[index]?.price?.length == "0"
                    ? null
                    : item.price,
                incomeTaxAmount: Number(vatAmount).toFixed(2),
                vatamt: Number(vatAmount).toFixed(2),
                description: foundProduct?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? foundProduct?.vat
                    : item?.vat,
                vatamount: Number(vatAmount).toFixed(2),
                discountamt: Number(discountAmount),
                discount: Number(discount),
                total: Number(total),
                includeVat,
              };
              return updatedColumn;
            } else {
              let newColumn = {
                id: null,
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
        if (updatedColumns?.length) {
          form.setFieldsValue({ columns: updatedColumns });
          setSubTotal(_subTotal);
          setTatalVat(_tatalVat);
          setOverolDiscount(_overollDiscount);
          let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
          // let roundedNumber = Math.round(_totalAmount);
          // let amountAdded = roundedNumber - _totalAmount;
          // setRoundOff(Number(amountAdded.toFixed(2)));
          // setTotalAmount(roundedNumber);
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
        title={t("home_page.homepage.CreateDebitNotes")}
        goBack={"/dashboard"}
        firstPathText={t("home_page.homepage.Debit_Notes")}
        firstPathLink={"/usr/purchase-debit-note"}
        secondPathText={t("home_page.homepage.CreateDebitNotes")}
        secondPathLink={`/usr/purchace-debitnote-form/create`}
      />
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
                    {locationData?.length &&
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
                <Form.Item name={"invoiceno"}>
                  <Input size="large" readOnly style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.Supplier_Name")}
                </div>
                <Form.Item name={"supplierid"}>
                  <Select
                    size="large"
                    allowClear
                    onSearch={(val) => props.customerSearch(val)}
                    showSearch
                    filterOption={false}
                  >
                    {props?.customers &&
                      props?.customers?.length &&
                      props?.customers?.map((item: any) => {
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
                  {t("home_page.homepage.Purchase_Invoice")}
                </div>
                <Form.Item
                  name={"purchaceInvoice"}
                  rules={[{ required: true, message: "choose Invoice" }]}
                >
                  <Select size="large" loading={invoicesLoding}>
                    {invoices &&
                      invoices?.length &&
                      invoices?.map((item: any, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <Select.Option key={item?.id} value={item?.id}>
                              {item?.invoiceno}
                            </Select.Option>
                          </React.Fragment>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.PurchaseLedger")}
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
                    {props?.ledgers &&
                      props?.ledgers?.length &&
                      props?.ledgers?.map((item: any) => {
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
                <Form.Item name={"sdate"}>
                  <DatePicker style={{ width: "100%" }} size="large" 
                  disabledDate={(currentDate) => {
                    const financialYearStart =
                      moment(financialYear).startOf("day");
                    return (
                      financialYearStart &&
                      currentDate &&
                      currentDate < financialYearStart
                    );
                  }}/>
                </Form.Item>
              </Col>
            </Row>
            <Items
              form={form}
              products={products}
              taxLists={props.taxList}
              qSuffix={qSuffix}
              stock={pStock}
              isStateTax={isStateTax}
            />
            <br />
            <Row>
              <Col sm={9}></Col>
              <Col sm={3}>
                <div className="formLabel">{t("home_page.homepage.Notes")}</div>
                <Form.Item name={"quotes"}>
                  <Input.TextArea
                    rows={4}
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6}></Col>
              <Col sm={6}>
                <Table bordered responsive>
                  <tbody>
                    <tr>
                      <td>{t("home_page.homepage.TAXABLE_VALUE")} </td>
                      <td>{subTotal.toFixed(2)}</td>
                    </tr>
                    {user?.companyInfo?.tax === "gst" ? (
                      <>
                        {isStateTax ? (
                          <>
                            <tr>
                              <td>{t("home_page.homepage.TOTAL_CGST")}</td>
                              <td>{(tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td>{t("home_page.homepage.TOTAL_SGST")}</td>
                              <td>{(tatalVat / 2)?.toFixed(2)}</td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td>{t("home_page.homepage.TOTAL_IGST")}</td>
                            <td>{tatalVat?.toFixed(2)}</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <tr>
                        <td>{t("home_page.homepage.TOTAL_VAT")}</td>
                        <td>{tatalVat?.toFixed(2)}</td>
                      </tr>
                    )}

                    <tr>
                      <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                      <td>{overollDiscount.toFixed(2)}</td>
                    </tr>
                    {/* <tr>
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
                            _totalAmount = _totalAmount + round;
                            setTotalAmount(_totalAmount);
                          }}
                        />
                      </td>
                    </tr> */}
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
                      loading={isLoading}
                      size="large"
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      {t("home_page.homepage.Create")}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
      {modalOpen ? (
        <PrintModal
          open={modalOpen}
          modalClose={(val: any) => setModalOpen(val)}
          template={template}
        />
      ) : null}
    </div>
  );
}
export default Create;
