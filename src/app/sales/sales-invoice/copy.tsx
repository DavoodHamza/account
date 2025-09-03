import React from 'react'
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
  import { useNavigate, useParams } from "react-router-dom";
  import LoadingBox from "../../../components/loadingBox";
  import PageHeader from "../../../components/pageHeader";
  import API from "../../../config/api";
  import { GET, POST} from "../../../utils/apiCalls";
  import ProductAddModal from "../../../components/productCreateModal";
  import Items from "../components/items";
  import { GoPlus } from "react-icons/go";
  import CreateCutomerModal from "../../../components/contactCreateModal";
  import moment from "moment";
  import { useTranslation } from "react-i18next";
const InvoiceCopy = () => {
    const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const adminid = user?.id;
  const [details, setDetails] = useState<any>();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [defaltOutStanding, setDefaltOutStanding] = useState(0);
  const [isStateTax, setIsStateTax] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [qSuffix, setqSuffix] = useState("");
  const [pStock, setPStock] = useState(0);
  const [selectBank, setSlectedBank] = useState<any>({});
  const [selectBankBalance, setSelectBankBalance] = useState(0);
  const [paidedValue, setPaidedValue] = useState<any>({});
  const [isReccNotification, setIsReccNotification] = useState<any>(false);
  const [customerCreate, setCustomerCreate] = useState<any>(false);
  const [ledgers, setLedgers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [banks, setBanks] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [reccuring,setReccuring] = useState([])
  const [productCreate, setProductCreate] = useState<any>(false);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const todayy = dayjs().format("YYYY/MM/DD");
  const [ledgerId, setLedgerId] = useState<any>();
  const [locationData, setLocationData] = useState([]);

  const { Option } = Select;
  const { id }: any = useParams();
  const onFinish = async (val: any) => {
    setIsLoading(true);
    let amountPaid = Number(val.amoutToPaid) || 0;
    let totalPayable = totalAmount;
    let outstanding = totalAmount - paidedValue;
    let status = "0";
    let reccObj = {};
    if (amountPaid > 0) {
      outstanding = totalPayable - paidedValue - amountPaid;

      if (outstanding <= 0) {
        status = "2"; //paid
      } else if (outstanding < totalPayable) {
        status = "1"; //part Paid
      } else if (outstanding >= totalPayable) {
        status = "0"; //unpaid
      }
    }
    let paymentInfo = isPaymentInfo;
    if (isPaymentInfo) {
      paymentInfo = {
        id: val.paymentBank,
        bankid: val.paymentBank,
        outstanding: val.outStanding,
        amount: amountPaid,
        date: val?.paymentDate,
        type: val.paymentMethod,
        paidmethod: val.paymentMethod,
        running_total: Number(selectBankBalance) + Number(val?.amoutToPaid),
      };
    }
    try {
      let selectedCustomer:any =
        customers &&
        customers?.length &&
        customers.find((item: any) => item.id === val.customerid);

      let ledger =
        ledgers &&
        ledgers?.length &&
        ledgers?.find((item: any) => item.id === val.ledger);

      let column = val.columns.map((item: any) => {
        let foundedProduct:any = product?.find(
          (product: any) => Number(product.id) === Number(item.id)
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
        } else {
          if(foundedProduct?.itemtype === " Service"){
            productLedger = {
              category: "24",
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
        if (isReccNotification) {
          reccObj = {
            invoiceNo: val.invoiceno,
            period: val.period,
            date: val.date,
            daybefore: val?.daybefore,
          };
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
          vat: item.vat,
          includevat: item.includeVat,
          incomeTax: item.vat,
          percentage: item.vat,
          costprice: item.price,
          ledgerDetails: productLedger,
          ledger: productLedger,
          quantity: item.quantity,
          total: item.total,
          vatamt: item.vat,
          vatamount: item.vatamount,
          incomeTaxAmount: item.vatamount,
          itemorder: 1,
        };
      });
      let payload = {
        seriesNo:val?.seriesNo,
        cname: selectedCustomer?.bus_name,
        customerid: val.customerid,
        columns: column,
        invoiceno: val.invoiceno,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        status: status,
        issued: "yes",
        type: "sales",
        pagetype: "1",
        total: Number(totalAmount),
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: paymentInfo,
        reference: val?.reference,
        salesType: "",
        ledger: ledger,
        reccuring: reccObj,
        email: user.email,
        outstanding,
        // roundOff: roundOff + "",
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };
      let salesUrl = 'SaleInvoice/add';
      const response: any = await POST(salesUrl, payload);
      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: "Sales invoice created",
        });
        navigate(-2);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to create sales invoice",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to create sales invoice",
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

  const getBankList = async () => {
    try {
      let url = "account_master/getBankList/" + adminid + '/' + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.bankList);
    } catch (error) {}
  };
  const getReccuring = async ()=>{
    try{
      let URL = API.GET_RECCURING + id
      const {data}: any = await GET(URL,null)
      setReccuring(data)
    } catch(error){}
  }
  useEffect(() => {
    getInvoiceDetails();
    fetchLocations();
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
    getLedgers();
    loadTaxList();
    getBankList();
    getReccuring();
  }, []);
  useEffect(() => {
      getCustomers();
  }, [customerName]);

  const getCustomers = async () => {
    try {
      let customerapi = API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST + adminid + `/${user?.companyInfo?.id}?name=${customerName}` ;
      const { data: customer }: any = await GET(customerapi, null);
      setCustomers(customer);
    } catch (error) {
      console.log(error)
    }
  };
  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_SALE_INVOICE + id + "/sales";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails.status) {
        setDetails(getInvDetails?.data);
        let initialValus = getInitialValues(getInvDetails?.data);
        form.setFieldsValue(initialValus);
        setIsFullLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
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
        let selectedCustomer:any =
          customers &&
          customers.length &&
          customers.find((item: any) => item.id === column.customerid);
        setIsStateTax(
          selectedCustomer?.vat_number.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
        );
      }
      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }

      if(column.seriesNo){
        getInvoiceNo(column.seriesNo)
      }

      if (column.ledger && allarray?.seriesNo) {
       getProduct(column.ledger === 2 ? "Service" : "Stock",allarray?.seriesNo);
       form.setFieldsValue({ columns: [] });
        setLedgerId(column.ledger)
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }

      if (allarray.ledger && column?.seriesNo) {
       getProduct(column.ledger === 2 ? "Service" : "Stock",allarray?.seriesNo);
       form.setFieldsValue({ columns: [] });
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }

      if (column.paymentBank) {
        let selectedBank :any= banks?.find(
          (item: any) => item?.list?.id === column.paymentBank
        );
        setSelectBankBalance(selectedBank?.amount);
        let payingAmount = Number(allarray.amoutToPaid) || 0;
        form.setFieldsValue({
          bicnum: selectedBank?.list?.bicnum,
          ibanNumber: selectedBank?.list?.ibannum,
          accountNumber: selectedBank?.list?.accnum,
          holderName: selectedBank?.list?.laccount,
          availableBalance: selectedBank?.amount,
          outStanding: (Number(totalAmount) - payingAmount).toFixed(2),
          paymentMethod: selectedBank?.list?.laccount === "Cash" ? "cash" : "",
        });
      }

      if (column.amoutToPaid) {
        let outstanding =
          totalAmount - paidedValue - Number(column.amoutToPaid);
        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0) {
          form.setFieldsValue({
            outStanding: 0,
            amoutToPaid: totalAmount - paidedValue,
          });
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
          outStanding: totalAmount - paidedValue - 0,
        });
      }

      if (allarray.columns && allarray.columns.length) {
        let _subTotal = 0;
        let _tatalVat = 0;
        let _overollDiscount = 0;
        const updatedColumns = allarray?.columns?.map(
          (item: any, index: any) => {
            if (column.columns.length > 1) {
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
                !column.columns[index]?.price ||
                !column.columns[index]?.quantity
              ) {
                if (
                  column.columns[index]?.discount ||
                  column.columns[index]?.discountamt
                ) {
                } else {
                  if (column.columns[index]?.id) {
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
            if (item && item.id) {
              let foundProduct:any= product.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item?.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? (ledgerId === 2 ? Number(foundProduct?.sp_price):  Number(foundProduct?.productDetails?.sp_price))
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
                const orderdQuantity = details.invoiceItems.find(
                  (item: any) => item?.product?.id === (ledgerId === 2 ? foundProduct?.id : foundProduct.productDetails?.id)
                );
                setPStock(
                  Number(foundProduct.stock) + Number(orderdQuantity.quantity)
                );
              }
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
                item.price != null &&
                item.price !== 0
              ) {
                const discountpecentage =
                  (Number(item?.discountamt) / total) * 100;
                discountAmount = Number(item?.discountamt);
                total = price * quantity - discountAmount;
                discount = Number(discountpecentage);
                if (column?.columns[index]?.discountamt >= total) {
                  let disRate = 100 / 100;
                  discountAmount = total * disRate;
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
                column?.columns[index]?.price ||
                column?.columns[index]?.quantity
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = total * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
              }
              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? (ledgerId === 2 ? Number(foundProduct?.vat) : Number(foundProduct.productDetails?.vat) )
                  : Number(item.vat);
                  let vatAmount = ledgerId === 2 ? Number(foundProduct?.vatamt) : Number(foundProduct.productDetails?.vatamt);

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
              if (
                (ledgerId === 2 ? foundProduct?.includevat === "1.00" : foundProduct.productDetails?.includevat === "1.00")  &&
                selectedIncludeVat === false
              ) {
                notification.error({
                  message: "VAT Inclusion Warning",
                  description: "This product is priced inclusive of VAT",
                });
              }
              if (selectedIncludeVat === undefined) {
                if(ledgerId === 2 ? foundProduct?.includevat === "1.00" : foundProduct.productDetails?.includevat === "1.00") {
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
                if (ledgerId === 2 ? foundProduct?.includevat === "1.00" : foundProduct.productDetails?.includevat === "1.00")  {
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
                hsn_code: ledgerId === 2 ? foundProduct?.hsn_code : foundProduct.productDetails?.hsn_code,
                sgst:Number(vatAmount) / 2,
                cgst:Number(vatAmount)/ 2,
                igst: Number(vatAmount),
                quantity:
                  column?.columns[index]?.quantity === undefined
                    ? quantity
                    : column?.columns[index]?.quantity.length == "0"
                    ? null
                    : item.quantity,
                price:
                  column?.columns[index]?.price === undefined
                    ? Number(price).toFixed(2)
                    : column?.columns[index]?.price.length == "0"
                    ? null
                    : Number(column?.columns[index]?.price).toFixed(2),
                incomeTaxAmount: ledgerId === 2 ?  Number(foundProduct?.vatamt).toFixed(2) : Number(foundProduct?.productDetails?.vatamt).toFixed(2),
                vatamt: ledgerId === 2 ?  Number(foundProduct?.vatamt).toFixed(2) : Number(foundProduct?.productDetails?.vatamt).toFixed(2),
                description: ledgerId === 2 ?  foundProduct?.idescription : foundProduct?.productDetails?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? (ledgerId === 2 ? foundProduct?.vat : foundProduct?.productDetails?.vat)
                    : item?.vat,
                vatamount: Number(vatAmount).toFixed(2),
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
        }

        setSubTotal(_subTotal);
        setTatalVat(_tatalVat);
        setOverolDiscount(_overollDiscount);
        let _totalAmount = _subTotal + _tatalVat;
        // let roundedNumber = Math.round(_totalAmount);
        // let amountAdded = roundedNumber - _totalAmount;
        // setRoundOff(Number(amountAdded.toFixed(2)));
        //setTotalAmount(roundedNumber);
        setTotalAmount(_totalAmount);
        if (column.columns) {
          setIsPaymentInfo(false);
          form.setFieldsValue({
            bicnum: null,
            ibanNumber: null,
            accountNumber: null,
            holderName: null,
            availableBalance: null,
            outStanding: _totalAmount - paidedValue,
            paymentMethod: null,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + adminid;
      const { data }: any = await GET(url, null);
      const filterData = data?.filter((item: any) => {
        return (
          item.nominalcode === "4000" ||
          item.nominalcode === "4001"
         //  || item.nominalcode === "4002"
        );
      });
      setLedgers(filterData);
    } catch (error) {}
  };

  const getProduct = async (itemType: any,locationId:any) => {
    try {
      if(itemType === "Stock"){
        let url = API.GET_PRODUCTS_BY_LOCATION + locationId;
        const response: any = await GET(url, null);
      if (response.status) {
        setProduct(response.data);
      }
      }else{
        let productuul =
        "ProductMaster/user/" +
        itemType +
        "/" +
        adminid +
        "/" +
        user?.companyInfo?.id;
      const { data: products }: any = await GET(productuul, null);
      let productList = products?.filter(
        (item: any) => item.itemtype !== "fixed assets"
      );
      setProduct(productList);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.LOCATION_GET_BY_USER + adminid + '/' + user?.companyInfo?.id;
      const {data}: any = await GET(unit_url, null);
      setLocationData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  const getInitialValues = (data: any) => {
    try {
      getProduct(data.invoiceItems[0].ledger === 2 ? "Service" : "Stock",data.invoiceItems[0].seriesNo);
      setIsStateTax(
        data?.invoiceDetails &&
          data?.invoiceDetails?.customer.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
      );
      setLedgerId( data?.invoiceDetails?.ledger)
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
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
        _overollDiscount = _overollDiscount + Number(item.discount_amount);
        return {
          id: item?.productLocationRef,
          sgst: Number(item.vatamt) / 2,
          cgst: Number(item.vatamt) / 2,
          igst: Number(item.vatamt),
          hsn_code: item?.product?.hsn_code,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: Number(item.vatamt).toFixed(2),
          discount: item.discount,
          discountamt: Number(item.discount_amount),
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });

      const initialValue = {
        // invoiceno: data.invoiceDetails.invoiceno,
        seriesNo: data.invoiceDetails.seriesNo,
        customerid: data.invoiceDetails.customerid,
        ledger: data.invoiceDetails.ledger,
        sdate: dayjs(new Date()),
        ldate: dayjs(data?.invoiceDetails?.ldate),
        reference: data?.invoiceDetails?.reference,
        columns: columns,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        outStanding: Number(data?.invoiceDetails?.outstanding) || "",
      };

      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      // setRoundOff(Number(data?.invoiceDetails?.roundOff) || 0);
      setOverolDiscount(_overollDiscount);
      let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
      // +
      //Number(data?.invoiceDetails?.roundOff) -
      setTotalAmount(_totalAmount);
      setDefaltOutStanding(
        _totalAmount -
          (_totalAmount - Number(data?.invoiceDetails?.outstanding))
      );
      setPaidedValue(_totalAmount - Number(data?.invoiceDetails?.outstanding));
      return initialValue;
    } catch (error) {
      return {};
    }
  };
  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data :any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div>
      <PageHeader
        title="Duplicate SalesInvoice"
        goBack={"/dashboard"}
        firstPathLink={"/usr/sales-invoice"}
        firstPathText={"Sales Invoice"}
        secondPathText="Duplicate SalesInvoice"
        secondPathLink={"/usr/sales-invoice"}
      >
      </PageHeader>
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
                  <Input size="large" readOnly style={{ width: "100%" }} />
                </Form.Item>
                </Col>
                <Col sm={2}>
                  <div className="formLabel">
                    {t("home_page.homepage.Customer_Name")}
                  </div>
                  <Form.Item
                    name={"customerid"}
                    rules={[{ required: true, message: "choose customer" }]}
                  >
                    <Select
                      size="large"
                      showSearch
                      onSearch={(val: any) => getCustomers()}
                      onChange={(val: any) => {
                        let selectCustomers: any = customers.find(
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
                          <GoPlus /> {t("home_page.homepage.Add_New")}
                        </Button>
                      </Select.Option>
                      {customers &&
                        customers.length &&
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
                    rules={[{ required: true, message: "choose ledger" }]}
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
                  <Form.Item name={"sdate"} initialValue={dayjs(new Date())}>
                    <DatePicker 
                    defaultValue={[
                        dayjs(todayy),
                      ]}
                    style={{ width: "100%" }} size="large" />
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <div className="formLabel">
                    {t("home_page.homepage.Due_Date")}
                  </div>
                  <Form.Item name={"ldate"}>
                    <DatePicker
                      style={{ width: "100%" }}
                      size="large"
                      disabledDate={(current) => {
                        return (
                          current &&
                          current <
                            moment(form.getFieldValue("ldate")).startOf("day")
                        );
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={2}>
                  <div className="formLabel">
                    {t("home_page.homepage.Reference")}
                  </div>
                  <Form.Item name={"reference"}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Items
                form={form}
                products={product}
                taxLists={taxList}
                qSuffix={qSuffix}
                stock={pStock}
                isStateTax={isStateTax}
                productModal={(val: any) => setProductCreate(val)}
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
                  <div className="formLabel">
                    {t("home_page.homepage.Terms")}
                  </div>
                  <Form.Item name={"terms"}>
                    <Input.TextArea rows={4} size="large" />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Notes")}
                  </div>
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
                        onChange={(val: any) => {
                          let bank = banks.find(
                            (item: any) => item?.list?.id === val
                          );
                          setSlectedBank(bank);
                        }}
                      >
                        {banks?.length &&
                          banks?.map((item: any) => {
                            return (
                              <Select.Option
                                key={item?.list?.id}
                                value={item?.list?.id}
                              >
                                {item?.list?.laccount}
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
                  {selectBank?.list?.laccount?.toLowerCase() ===
                  "Cash".toLowerCase() ? null : (
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
                  )}
                  {selectBank?.list?.laccount?.toLowerCase() ===
                  "Cash".toLowerCase() ? null : (
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
                  )}
                  {selectBank?.list?.laccount?.toLowerCase() ===
                  "Cash".toLowerCase() ? null : (
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
                  )}
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.Payment_Date")} :
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
                      {t("home_page.homepage.AvailableBalance")} :
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
                          { label: "Cheque", value: "cheque" },
                          { label: "Electronic", value: "other" },
                          { label: "Credit/Debit Card", value: "card" },
                          { label: "PayPal", value: "loan" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}

              <br />
              {reccuring ? null : (
                <div className="salesInvoice-SubHeader">
                  <div>{t("home_page.homepage.Reccuring_Notification")}</div>
                  <div>
                    <Button
                      type="primary"
                      onClick={() => setIsReccNotification(!isReccNotification)}
                    >
                      {isReccNotification ? "Close" : "Set"}{" "}
                      {t("home_page.homepage.Notification")}
                    </Button>
                  </div>
                </div>
              )}

              {isReccNotification && reccuring ? (
                <>
                  <Row>
                    <Col sm={4}>
                      <div className="formLabel" style={{ marginTop: 10 }}>
                        {t("home_page.homepage.Start_Date")} :
                      </div>
                      <Form.Item
                        noStyle
                        name="date"
                        initialValue={dayjs(new Date())}
                      >
                        <DatePicker
                          defaultValue={dayjs(new Date(), "YYYY-MM-DD")}
                          style={{ width: "100%" }}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col sm={4}>
                      <div className="formLabel" style={{ marginTop: 10 }}>
                        {t("home_page.homepage.Period")}:
                      </div>
                      <Form.Item
                        noStyle
                        name="period"
                        rules={[
                          {
                            required: true,
                            message: t("home_page.homepage.selectperiod"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("home_page.homepage.selectperiod")}
                          size="large"
                          style={{ width: "100%" }}
                        >
                          <Option value="daily">
                            {t("home_page.homepage.Daily")}
                          </Option>
                          <Option value="weekly">
                            {t("home_page.homepage.Weekly")}
                          </Option>
                          <Option value="monthly">
                            {t("home_page.homepage.Monthly")}
                          </Option>
                          <Option value="yearly">
                            {t("home_page.homepage.Yearly")}
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col sm={4}>
                      <div className="formLabel" style={{ marginTop: 10 }}>
                        {t("home_page.homepage.SendVia")}
                      </div>
                      <Form.Item
                        name="mailto"
                        rules={[{ message: "Select Notification" }]}
                      >
                        <Select size="large">
                          <Select.Option>
                            {t("home_page.homepage.Email")}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <br />
                  <hr />
                </>
              ) : null}
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
                                <td>TOTAL CGST</td>
                                <td>{(tatalVat / 2)?.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td>TOTAL SGST</td>
                                <td>{(tatalVat / 2)?.toFixed(2)}</td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td>TOTAL IGST</td>
                              <td>{tatalVat?.toFixed(2)}</td>
                            </tr>
                          )}
                        </>
                      ) : (
                        <tr>
                          <td>{t("home_page.homepage.TOTAL_VAT")}</td>
                          <td>{tatalVat.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr>
                        <td>{t("home_page.homepage.OVERALL_DISCOUNT")}</td>
                        <td>{overollDiscount.toFixed(2)}</td>
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
                        block
                        onClick={() => navigate("/usr/sales-invoice")}
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
                        Create
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
          customerSearch={(val: any) => val}
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
      {productCreate ? (
        <ProductAddModal
          open={productCreate}
          onCancel={() => setProductCreate(false)}
          // productRefrush={() =>
          // getProduct(ledgerId === 2 ? "Service" : "Stock",data?.invoiceItems[0]?.seriesNo)
          // }
          type={ledgerId === 2 ? "Service" : "Stock"}
        />
      ) : null}
    </div>
  )
}
export default InvoiceCopy