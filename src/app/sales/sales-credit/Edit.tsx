import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
import { GET, PUT } from "../../../utils/apiCalls";
import Items from "./components/items";
import { t } from "i18next";
function Edit(props: any) {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const adminid = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [isCheck, setIsCheck] = useState<any>(false);
  const [defaltOutStanding, setDefaltOutStanding] = useState(0);
  const [qSuffix, setqSuffix] = useState("");
  const [isStateTax, setIsStateTax] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<any>(null);
  const [customerSalesData, setCustomerSalesData] = useState<any>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>([]);
  const [columnData, setColumnsData] = useState([]);
  const [products, setProducts] = useState([]);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [details, setDetails] = useState<any>([]);
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [ledgers, setLedgers] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [isSmallForm, setIsSmallForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [paidedValue, setPaidedValue] = useState<any>({});
  const [pStock, setPStock] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [salesRef, setSalesRef] = useState("");

  useEffect(() => {
    getInvoiceDetails();
    getInvoiceData(id);
    fetchLocations();
    getCustomers();
    getLedgers();
    loadTaxList();
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
  }, []);

  const getCustomers = async () => {
    try {
      let customerapi =
        API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST +
        adminid +
        `/${user?.companyInfo?.id}?name=${customerName}`;
      const { data: customer }: any = await GET(customerapi, null);
      setCustomers(customer);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setLocationData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + adminid;
      const { data: bank }: any = await GET(url, null);
      const filterData = bank.filter((item: any) => {
        return item.id === 20704 || item.id === 2; // sales return and sales service
      });
      setLedgers(filterData);
    } catch (error) {
      console.log(error);
    }
  };

  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  //get selected invoice details
  const getInvoiceDetails = async () => {
    try {
      const getinvoicedataapi = API.VIEW_SALE_INVOICE + `${id}` + `/sales`;
      const getInvDetails: any = await GET(getinvoicedataapi, null);
      if (getInvDetails.status) {
        setDetails(getInvDetails?.data);
        console.log("getInvDetails?.data--->",getInvDetails?.data?.sales_ref)
        setSalesRef(getInvDetails?.data?.sales_ref)
        let initialValus = getInitialValues(getInvDetails?.data);
        form.setFieldsValue(initialValus);
        getCustomerInvoices(
          Number(getInvDetails?.data?.invoiceDetails?.customerid),
          getInvDetails?.data?.invoiceDetails?.seriesNo
        );
        setIsLoading(false);
      }
      if (getInvDetails.message === "Invoice Details Not Found") {
        setIsSmallForm(true);
        const intialValuesSmallForm = {
          seriesNo: getInvDetails?.data?.invoiceDetails?.seriesNo,
          invoiceNo: getInvDetails?.data?.invoiceDetails?.invoiceno,
          cname: getInvDetails?.data?.invoiceDetails?.cname,
          ledger: getInvDetails?.data?.invoiceDetails?.ledger,
          sdate: dayjs(getInvDetails?.data?.invoiceDetails?.sdate),
          amount: Number(getInvDetails?.data?.invoiceDetails?.total),
        };
        form.setFieldsValue(intialValuesSmallForm);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
    }
  };

  //get selected customer invoices
  const getCustomerInvoices = async (customer_id: number, seriesNo: number) => {
    try {
      let customersalesapi =
        API.GET_CREDIT_NOTE_SALESINVOICE +
        `${user?.companyInfo?.id}/${customer_id}/${seriesNo}/sales`;
      const { data }: any = await GET(customersalesapi, null);
      setCustomerSalesData(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //function to get selected invoice items
  const getInvoiceData = async (id: any) => {
    try {
      const getinvoicedataapi = API.VIEW_SALE_INVOICE + `${id}` + `/sales`;
      const { data: invoiceData }: any = await GET(getinvoicedataapi, null);
      const selectedItems = getInitialValues(invoiceData);
      form.setFieldsValue(selectedItems);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  //get initial values for forms
  const getInitialValues = (data: any) => {
    try {
      let productArray: any = [];
      setIsStateTax(
        data?.invoiceDetails &&
          data.invoiceDetails?.customer.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
      );
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
      let discountAmount: any = 0;
      let columns = data?.invoiceItems?.map((item: any) => {
        discountAmount = 0;
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
        if (item.discount > 0) {
          const discountRate = item.discount / 100;
          discountAmount =
            item.includevat == 1
              ? Number(item.costprice) * Number(item.quantity) * discountRate
              : (Number(item.costprice) * Number(item.quantity) + vatAmount) *
                discountRate;
        }
        let productObj = {
          ...item?.product,
          totalSaleStock: item?.quantity,
          productLocationRef: item.productLocationRef,
        };
        productArray.push(productObj);
        _tatalVat = _tatalVat + vatAmount;
        _overollDiscount = _overollDiscount + discountAmount;

        return {
          id: item.product.id,
          productLocationRef: item.productLocationRef,
          hsn_code: item.product.hsn_code,
          sgst: Number(item.incomeTaxAmount) / 2,
          cgst: Number(item.incomeTaxAmount) / 2,
          igst: Number(item.incomeTaxAmount),
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.description,
          vat: item.incomeTax,
          vatamount: item.incomeTaxAmount,
          discount: item.percentage,
          discountamt: item.discount_amount,
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });
      setSalesRef(data?.invoiceDetails?.sales_ref)
      setProducts(productArray);
      setColumnsData(columns);
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setOverolDiscount(_overollDiscount);
      let _totalAmount = _subTotal + _tatalVat;
      setTotalAmount(_totalAmount);
      setDefaltOutStanding(
        _totalAmount -
          (_totalAmount - Number(data?.invoiceDetails?.outstanding))
      );
      setRoundOff(data?.invoiceDetails?.roundOff);
      setPaidedValue(_totalAmount - Number(data?.invoiceDetails?.outstanding));
      console.log("data?.invoiceDetails==>",data?.invoiceDetails)
      const initialValue = {
        columns: columns,
        seriesNo: data?.invoiceDetails?.seriesNo,
        invoiceNo: data?.invoiceDetails?.invoiceno,
        customerid: data?.invoiceDetails?.cname,
        invoice: Number(data?.invoiceDetails?.refid),
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        reference: data?.invoiceDetails?.reference,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        ledger: data?.invoiceItems[0]?.ledger,
        sdate: dayjs(data?.invoiceDetails?.sdate),
      };

      return initialValue;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const getSalesData = async (id: any) => {
    try {
      const getinvoicedataapi = API.VIEW_SALE_INVOICE + `${id}` + `/sales`;
      const { data }: any = await GET(getinvoicedataapi, null);
      
      let productArray: any = [];
      setIsStateTax(
        data?.invoiceDetails &&
          data.invoiceDetails?.customer.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
      );
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
      let discountAmount: any = 0;
      let columns = data?.invoiceItems?.map((item: any) => {
        discountAmount = 0;
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
        if (item.discount > 0) {
          const discountRate = item.discount / 100;
          discountAmount =
            item.includevat == 1
              ? Number(item.costprice) * Number(item.quantity) * discountRate
              : (Number(item.costprice) * Number(item.quantity) + vatAmount) *
                discountRate;
        }
        let productObj = {
          ...item?.product,
          totalSaleStock: item?.quantity,
          productLocationRef: item.productLocationRef,
        };
        productArray.push(productObj);
        _tatalVat = _tatalVat + vatAmount;
        _overollDiscount = _overollDiscount + discountAmount;

        return {
          id: item.product.id,
          productLocationRef: item.productLocationRef,
          hsn_code: item.product.hsn_code,
          sgst: Number(item.incomeTaxAmount) / 2,
          cgst: Number(item.incomeTaxAmount) / 2,
          igst: Number(item.incomeTaxAmount),
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.description,
          vat: item.incomeTax,
          vatamount: item.incomeTaxAmount,
          discount: item.percentage,
          discountamt: item.discount_amount,
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });
      setSalesRef(data?.invoiceDetails?.sales_ref)
      setProducts(productArray);
      setColumnsData(columns);
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setOverolDiscount(_overollDiscount);
      let _totalAmount = _subTotal + _tatalVat;
      setTotalAmount(_totalAmount);
      setDefaltOutStanding(
        _totalAmount -
          (_totalAmount - Number(data?.invoiceDetails?.outstanding))
      );
      setRoundOff(data?.invoiceDetails?.roundOff);
      setPaidedValue(_totalAmount - Number(data?.invoiceDetails?.outstanding));


      form.setFieldsValue({
        columns:columns,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user.id +
        `/${user?.companyInfo?.id}/${locationId}/scredit`;
      const { data }: any = await GET(invoiceurl, null);
      form.setFieldValue("invoiceNo", data);
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

  const formValue = form.getFieldsValue();
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
      if(column.seriesNo){
        getInvoiceNo(column.seriesNo)
      }
      if (column.customerid && allarray?.seriesNo) {
        getCustomerInvoices(column.customerid, allarray?.seriesNo);
        form.setFieldsValue({ columns: [] ,sales_ref:"" });
      }
      if (allarray?.customerid && column.seriesNo) {
        getCustomerInvoices(allarray.customerid, column?.seriesNo);
        form.setFieldsValue({ columns: [] ,sales_ref:""});
      }

      if (column.invoice) {
        getSalesData(column.invoice);
      }

      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setRoundOff(0);
        setTotalAmount(0);
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
              if (
                !column?.columns[index]?.price ||
                !column?.columns[index]?.quantity
              ) {
                if (
                  column?.columns[index]?.discount ||
                  column.columns[index]?.discountamt
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
              let foundProduct: any = products?.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? Number(foundProduct?.rate)
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
                  : column.columns.findIndex(
                      (item: any) =>
                        item?.quantity === column?.columns[index]?.quantity
                    );
              if (curentQuntityChangingIndex >= 0) {
                setPStock(Number(foundProduct?.totalSaleStock)); // stock from sale
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
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = (price * quantity) * disRate;
                  total = price * quantity - discountAmount;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice",
                  });
                }
              } else if (
                column?.columns[index]?.discount === "" ||
                column?.columns[index]?.discount === 0
              ) {
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
              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? Number(foundProduct?.vat)
                  : Number(item?.vat);
              let vatAmount =
                formValue?.column?.columns?.length > 1
                  ? formValue?.columns[index]?.vatamount
                  : Number((foundProduct?.vat * total) / 100);

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
              if (
                foundProduct.includevat === "1.00" &&
                selectedIncludeVat === false
              ) {
                notification.warning({
                  message: "VAT Inclusion Warning",
                  description: "This product is priced inclusive of VAT",
                });
              }
              if (selectedIncludeVat === undefined) {
                if (foundProduct.includevat === "1.00") {
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
                id: item?.id,
                productLocationRef: item.productLocationRef,
                hsn_code: foundProduct.hsn_code,
                sgst: Number(vatAmount) / 2,
                cgst: Number(vatAmount) / 2,
                igst: Number(vatAmount),
                quantity:
                  column?.columns[index]?.quantity === undefined
                    ? quantity
                    : column?.columns[index]?.quantity?.length == "0"
                    ? null
                    : item?.quantity,
                price:
                  column?.columns[index]?.price === undefined
                    ? Number(price).toFixed(2)
                    : column?.columns[index]?.price?.length == "0"
                    ? null
                    : Number(item?.price).toFixed(2),
                incomeTaxAmount: vatAmount.toFixed(2),
                vatamt: vatAmount.toFixed(2),
                description: foundProduct?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? foundProduct?.vat
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
          let _totalAmount = _subTotal + _tatalVat;
          let roundedNumber = Math.round(_totalAmount);
          let amountAdded = roundedNumber - _totalAmount;
          setRoundOff(amountAdded);
          setTotalAmount(roundedNumber);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //form submit
  const onFinish = async (val: any) => {
    setLoadingForm(true);
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
    // setIsLoading(true);
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
      let selectedCustomer: any =
        customers &&
        customers.length &&
        customers.find((item: any) => item.id === val.customerid);

      let ledger =
        ledgers &&
        ledgers.length &&
        ledgers?.find((item: any) => item.id === val.ledger);

      let column = val.columns.map((item: any) => {
        let foundedProduct: any = products.find(
          (product: any) => product.id === item.id
        );
        let productLedger = {};
        if (foundedProduct.itemtype === "Stock") {
          productLedger = {
            category: "13",
            id: 1,
            laccount: "Sales-Products",
            nominalcode: "4000",
          };
        } else if (foundedProduct.itemtype === " Service") {
          productLedger = {
            category: "24",
            id: 2,
            laccount: "Sales-Services",
            nominalcode: "4001",
          };
        }
        return {
          id: item.id,
          productLocationRef: item.productLocationRef,
          discount: item.discount,
          discountamt: item.discountamt,
          productId: item.id,
          product: foundedProduct,
          idescription: foundedProduct.idescription,
          description: foundedProduct.idescription,
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
        cname: selectedCustomer?.bus_name,
        // cname: "sam",
        // customerid: val.customerid,
        columns: column,
        invoiceno: val.invoiceNo,
        sales_ref: salesRef,
        refid:val?.invoice,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        outstanding,
        // status: status,
        issued: "yes",
        type: "scredit",
        pagetype: "1",
        total: Number(totalAmount),
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: paymentInfo,
        reference: val?.reference,
        salesType: "",
        ledger: ledger,
        email: user.email,
        roundOff: roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };

      let salesUrl = `SaleInvoice/update/${id}`;
      const response: any = await PUT(salesUrl, payload);
      if (response.status) {
        setLoadingForm(false);
        notification.success({
          message: "Success",
          description: "Credit note updated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update credit note..!",
        });
        setLoadingForm(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Failed to update credit note..! Please try again later.",
      });
      setIsLoading(false);
      setLoadingForm(false);
    }
  };

  //form submit without reversal
  const onFinishWithoutReversal = async (val: any) => {
    setLoadingForm(true);
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
    // setIsLoading(true);
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

    const updatedValues = {
      ...val,
      columns: [],
    };

    try {
      let totalDifference =
        Number(val.amount) - Number(details?.invoiceDetails?.total);
      let newOutstanding =
        Number(details?.invoiceDetails?.outstanding) + Number(totalDifference);

      let selectedCustomer =
        customers &&
        customers.length &&
        customers.find((item: any) => item.id === val.customerid);

      let ledger =
        ledgers &&
        ledgers.length &&
        ledgers?.find((item: any) => item.id === val.ledger);
      let payload = {
        cname: val.cname,
        columns: [
          {
            quantity: 0,
            id: "",
          },
        ],
        invoiceno: val?.invoiceNo,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        issued: "yes",
        type: "scredit",
        pagetype: "1",
        total: Number(val.amount),
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: paymentInfo,
        reference: val?.reference,
        outstanding: newOutstanding,
        ledger: ledger,
        email: user.email,
        companyid: user?.companyInfo?.id,
        status: details?.invoiceDetails?.status,
        salesType: "WithoutStockReversal",
      };
      let salesUrl = `SaleInvoice/updateCreditnoteWithoutReversal/${id}`;

      const response: any = await PUT(salesUrl, payload);
      if (response.status) {
        setLoadingForm(false);
        notification.success({
          message: "Success",
          description: "Credit note updated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update credit note",
        });
        setLoadingForm(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update credit note",
      });
      setLoadingForm(false);
    }
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.EditCreditNotes")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Credit_Notes")}
        secondPathLink={"/usr/salesCredit"}
        thirdPathText={t("home_page.homepage.EditCreditNotes")}
        thirdPathLink={`/usr/salesCredit/edit/${id}`}
      >
        <div></div>
      </PageHeader>
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            {isSmallForm ? (
              <Form
                form={form}
                onValuesChange={onValuesChange}
                onFinish={onFinishWithoutReversal}
              >
                <Row>
                  <Col sm={3}>
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
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.CreditInvoice_No")}.
                    </div>
                    <Form.Item name={"invoiceNo"} rules={[{ required: true }]}>
                      <Input size="large" readOnly />
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.Customer_Name")}
                    </div>
                    <Form.Item
                      name={"cname"}
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
                        onChange={(val: any) => setSelectedCustomerId(val)}
                      >
                        {customers &&
                          customers.length &&
                          customers?.map((item: any) => {
                            return (
                              <Select.Option
                                key={item.id}
                                value={item.bus_name}
                              >
                                {item.bus_name}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
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
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.invoice_date")}
                    </div>
                    <Form.Item
                      name={"sdate"}
                      initialValue={dayjs(selectedInvoice.data)}
                    >
                      <DatePicker style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.Amount")}
                    </div>
                    <Form.Item
                      name={"amount"}
                      rules={[
                        {
                          type: "number",
                          required: true,
                          message: "Please enter a valid number",
                        },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <br />
                <br />
                <Row>
                  <Col sm={6}></Col>
                  <Col sm={6}>
                    <Row>
                      <Col sm={6}>
                        <Button size="large" block>
                          {t("home_page.homepage.Close")}
                        </Button>
                      </Col>
                      <Col sm={6}>
                        <Button
                          size="large"
                          block
                          type="primary"
                          htmlType="submit"
                          loading={loadingForm}
                        >
                          {t("home_page.homepage.Update")}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Form
                form={form}
                onValuesChange={onValuesChange}
                onFinish={onFinish}
              >
                <Row>
                  <Col sm={3}>
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
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.CreditInvoice_No")}
                    </div>
                    <Form.Item name={"invoiceNo"} rules={[{ required: true }]}>
                      <Input size="large" readOnly />
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
                        onSearch={(val: any) => props.customerName(val)}
                        onChange={(val: any) => setSelectedCustomerId(val)}
                      >
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
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.Sales_Invoice")}
                    </div>
                    <Form.Item
                      name={"invoice"}
                      rules={[
                        {
                          required: true,
                          message: t("home_page.homepage.chooseSalesInvoice"),
                        },
                      ]}
                    >
                      <Select size="large" showSearch>
                        {customerSalesData &&
                          customerSalesData.length &&
                          customerSalesData?.map((item: any) => {
                            return (
                              <Select.Option key={item.id} value={item.id}>
                                {item.invoiceno}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
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
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.invoice_date")}
                    </div>
                    <Form.Item
                      name={"sdate"}
                      initialValue={dayjs(selectedInvoice.data)}
                    >
                      <DatePicker style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
                    <div className="formLabel">
                      {t("home_page.homepage.Reference")}
                    </div>
                    <Form.Item name={"reference"}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                {products && (
                  <Items
                    form={form}
                    products={products}
                    taxLists={taxList}
                    isCheckChange={(val: any) => setIsCheck(val)}
                    isStateTax={isStateTax}
                    stock={pStock}
                  />
                )}

                <br />
                <Row>
                  <Col sm={6}>
                    <div className="formLabel">
                      {t("home_page.homepage.Terms")}
                    </div>
                    <Form.Item
                      name={"terms"}
                      rules={[{ message: t("home_page.homepage.enter_terms") }]}
                    >
                      <Input.TextArea rows={4} size="large" />
                    </Form.Item>
                  </Col>
                  <Col sm={6}>
                    <div className="formLabel">
                      {t("home_page.homepage.Notes")}
                    </div>
                    <Form.Item
                      name={"quotes"}
                      rules={[{ message: t("home_page.homepage.enternote") }]}
                    >
                      <Input.TextArea readOnly rows={4} size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <br />
                <br />
                <Row>
                  <Col sm={6}></Col>
                  <Col sm={6}>
                    <Table bordered>
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
                            <td>TOTAL VAT</td>
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
                              value={Number(roundOff).toFixed(2)}
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
                          block
                          onClick={() => navigate("/usr/sales-invoice")}
                        >
                          Close
                        </Button>
                      </Col>
                      <Col sm={6}>
                        <Button
                          size="large"
                          block
                          type="primary"
                          htmlType="submit"
                          loading={loadingForm}
                        >
                          {t("home_page.homepage.Update")}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>
        </Container>
      )}
    </div>
  );
}
export default Edit;
