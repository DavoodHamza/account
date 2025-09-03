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
import { Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateCutomerModal from "../../../components/contactCreateModal";
import PageHeader from "../../../components/pageHeader";
import PrintModal from "../../../components/printModal/printModal";
import ProductAddModal from "../../../components/productCreateModal";
import { GET, POST } from "../../../utils/apiCalls";
import Items from "../components/items";
import {
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template8,
} from "../components/templates";
import API from "../../../config/api";

function Create(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const financialYear = user?.companyInfo?.financial_year_start;
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  const [isStateTax, setIsStateTax] = useState(false);
  const [qSuffix, setqSuffix] = useState("");
  const [pStock, setPStock] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [selectBank, setSlectedBank] = useState<any>({});
  const [isReccNotification, setIsReccNotification] = useState<any>(false);
  const [isProductImei, setIsProductImei] = useState<any>(false);

  const [selectBankBalance, setSelectBankBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [template, setTemplate] = useState();
  const [coustomerCreate, setCoustomerCreate] = useState<any>(false);
  const [productCreate, setProductCreate] = useState<any>(false);
  const [ledgerId, setLedgerId] = useState<any>();

  const [locationData, setLocationData] = useState([]);
  const [customerInfo, setCustomerInfo] = useState<any>();
  const [loyaltyPoint, setLoyaltyPoint] = useState(0);
  const [isPointClaim, setIsPointClaim] = useState<any>(false);
  const [claimedPoint, setClaimedPoint] = useState(0);
  const columnValue = Form?.useWatch("columns", form);
  useEffect(() => {
    fetchLocations();
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
      sdate: dayjs(new Date()),
    });
  }, []);

  const { Option } = Select;
  const navigate = useNavigate();
  const isLoyaltyEnabled = user?.companyInfo?.isLoyaltyEnabled;

  const onFinish = async (val: any) => {
    try {
      if (!val?.columns || !val?.columns?.length) {
        notification.error({ message: <h6>Add items to invoice</h6> });
        return;
      }
      let amountPaid = Number(val.amoutToPaid) || 0;
      let totalPayable: any = totalAmount?.toFixed(2);
      let outstanding = Number(totalPayable) - amountPaid;
      let status = "0";
      let reccObj = {};
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
          amount: val.amoutToPaid,
          date: val?.paymentDate,
          type: val.paymentMethod,
          paidmethod: val.paymentMethod,
          running_total: Number(selectBankBalance) + Number(val?.amoutToPaid),
        };
      }

      let selectedCustomer =
        props?.customers &&
        props?.customers?.length &&
        props?.customers?.find((item: any) => item.id === val.customerid);

      let ledger =
        props?.ledgers &&
        props?.ledgers?.length &&
        props?.ledgers?.find((item: any) => item.id === val.ledger);

      const transformedProductImei = val?.productImei?.map((item: any) => {
        // Extract the imei values
        const imeis = Object?.keys(item)
          ?.filter((key: any) => !isNaN(key)) // Filter numeric keys (which represent imei objects)
          ?.map((key) => item[key]?.imei); // Extract the imei value

        return {
          invoiceItemId: item?.invoiceItemId,
          invoiceItemDescription: item?.invoiceItemDescription,
          imei: imeis,
        };
      });
      let column = val.columns.map((item: any) => {
        let foundedProduct = props?.product?.find(
          (product: any) => Number(product?.id) === Number(item.id)
        );
        let productLedger = {};
        let itemId;
        let iDescription;
        let itemDetails;
        let locationRef;
        if (foundedProduct?.productDetails?.itemtype === "Stock") {
          productLedger = {
            category: "13",
            id: 1,
            laccount: "Sales-Products",
            nominalcode: "4000",
          };
          itemId = foundedProduct?.productId;
          iDescription = foundedProduct.productDetails.idescription;
          itemDetails = foundedProduct?.productDetails;
          locationRef = foundedProduct?.id;
        } else {
          if (foundedProduct?.itemtype === "Service") {
            productLedger = {
              category: "24", //"13"
              id: 2,
              laccount: "Sales-Services",
              nominalcode: "4001",
            };

            itemId = item?.id;
            iDescription = foundedProduct.idescription;
            itemDetails = foundedProduct;
            locationRef = null;
          }
        }

        if (isReccNotification) {
          let nextDate;
          if (val.period === "daily") {
            nextDate = moment(val.date).add(1, "day").format("YYYY-MM-DD");
          } else if (val.period === "weekly") {
            nextDate = moment(val.date).add(7, "day").format("YYYY-MM-DD");
          } else if (val.period === "monthly") {
            nextDate = moment(val.date).add(1, "month").format("YYYY-MM-DD");
          } else if (val.period === "yearly") {
            nextDate = moment(val.date).add(1, "year").format("YYYY-MM-DD");
          }
          reccObj = {
            invoiceNo: val.invoiceno,
            period: val.period,
            date: val.date,
            nextdate: nextDate,
          };
        }
        const valImei = transformedProductImei?.find(
          (element: any) => element?.invoiceItemId == item?.id
        );
        return {
          id: itemId,
          productLocationRef: locationRef,
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
          imei: valImei?.imei?.length ? valImei?.imei : [],
        };
      });
      let payload = {
        seriesNo: val?.seriesNo,
        cname: selectedCustomer?.bus_name,
        customerid: val.customerid,
        cusmail: selectedCustomer?.email,
        currency: user?.companyInfo?.countryInfo?.symbol,
        columns: column,
        invoiceno: val.invoiceno,
        sdate: dayjs(val?.sdate).format("YYYY-MM-DD"),
        ldate: dayjs(val?.ldate).format("YYYY-MM-DD"),
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        status: status,
        issued: "yes",
        type: "sales",
        pagetype: "1",
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        paymentInfo: paymentInfo,
        reference: val?.reference,
        salesType: "",
        ledger: ledger,
        email: user.email,
        reccObj: reccObj,
        // roundOff: roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
        loyaltyPoints: Number(loyaltyPoint),
        total: totalAmount?.toFixed(2),
        claimedPoint: claimedPoint,
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
        seriesNo: val?.seriesNo,
        user: user,
        customer: selectedCustomer,
        sale: {
          inaddress: val?.inaddress,
          deladdress: val?.deladdress,
          invoiceno: val.invoiceno,
          quotes: val?.quotes,
          terms: val?.terms,
          reference: val?.reference,
          userdate: new Date(),
          sdate: dayjs(val?.sdate).format("YYYY-MM-DD"),
          ldate: dayjs(val?.ldate).format("YYYY-MM-DD"),
          total: isLoyaltyEnabled ?
            Number(loyaltyPoint) > Number(user?.companyInfo?.loyaltyRedeemLimit)
              ? Number(totalAmount) -
                (Number(loyaltyPoint) -
                  (Number(loyaltyPoint) %
                    Number(user?.companyInfo?.loyaltyRedeemLimit)))
              : totalAmount?.toFixed(2) : totalAmount?.toFixed(2),
          outstanding: isLoyaltyEnabled ? isPaymentInfo
            ? paymentInfo.outstanding
            : Number(loyaltyPoint) >
              Number(user?.companyInfo?.loyaltyRedeemLimit)
            ? Number(totalAmount) -
              (Number(loyaltyPoint) -
                (Number(loyaltyPoint) %
                  Number(user?.companyInfo?.loyaltyRedeemLimit)))
            : totalAmount?.toFixed(2) : totalAmount?.toFixed(2),
          status: 0,
          adminid: 2856200,
        },
        productlist: column,
        bankList: {},
        vatTotal: tatalVat,
        netTotal: subTotal,
        Discount: overollDiscount,
        // round: roundOff,
        total: totalAmount?.toFixed(2),
        // round: roundOff,
        vatRate: tatalVat,
        isPaymentInfo: false,
        pagetype: "Sales Invoice",
        selectedBank: user?.companyInfo?.bankInfo,
        gstType: isStateTax,
        invoicearray: splitArray,
        path: column[0]?.ledger?.id === 1 ? "Stock" : "Service"
      };
      let templates: any = null;
      if (user.companyInfo.defaultinvoice === "1") {
        templates = template1(obj);
      } else if (user.companyInfo.defaultinvoice === "2") {
        templates = template2(obj);
      } else if (user.companyInfo.defaultinvoice === "3") {
        templates = template3(obj);
      } else if (user.companyInfo.defaultinvoice === "4") {
        templates = template4(obj);
      } else if (user.companyInfo.defaultinvoice === "5") {
        templates = template5(obj);
      } else if (user.companyInfo.defaultinvoice === "6") {
        templates = template6(obj);
      } else if (user.companyInfo.defaultinvoice === "7") {
        templates = template8(obj);
      }
      setTemplate(templates);
      let salesUrl = user?.isStaff
        ? "SaleInvoice/add/staff_create_sale"
        : "SaleInvoice/add";
      const response: any = await POST(salesUrl, payload);

      if (response.status) {
        setIsLoading(false);
        setModalOpen(true);
        notification.success({
          message: "Success",
          description: "Sales invoice created successfully",
        });
        // navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to create sales invoice",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      const firstErrorField = Object.keys(error.errorFields[0])[0];
      // Scroll to the first error field
      const errorFieldElement = document.getElementsByName(firstErrorField)[0];
      if (errorFieldElement) {
        errorFieldElement.scrollIntoView({ behavior: "smooth" });
      }

      // Display error message
      notification.error({ message: "Please fill in all required fields" });
      console.log(error);
      notification.error({ message: "Oops .. something went wrong" });
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setLocationData(data);
      form.setFieldsValue({ seriesNo: data[0]?.id });
      getInvoiceNo(data[0]?.id);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getInvoiceNo = async (locationId: number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        props.adminid +
        `/${user?.companyInfo?.id}/${locationId}/sales`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      setInvoiceNumber(invnumber);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error);
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
          props?.customers &&
          props?.customers?.length &&
          props?.customers?.find((item: any) => item?.id == column?.customerid);
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
        );

        setIsPointClaim(false);
        setCustomerInfo(selectedCustomer);
      }
      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);

        setTotalAmount(0);
      }
      if (column.seriesNo) {
        getInvoiceNo(column.seriesNo);
      }
      if (column.ledger && allarray?.seriesNo) {
        props.getProduct(
          column.ledger === 2 ? "Service" : "Stock",
          allarray?.seriesNo
        );
        form.setFieldsValue({ columns: [] });
        setLedgerId(column.ledger);
        form.setFieldsValue({ columns: [] });
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setTotalAmount(0);
      }
      if (allarray.ledger && column?.seriesNo) {
        props.getProduct(
          allarray.ledger === 2 ? "Service" : "Stock",
          column?.seriesNo
        );
        form.setFieldsValue({ columns: [] });
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        setTotalAmount(0);
      }
      if (column.paymentBank) {
        let selectedBank = props?.banks?.find(
          (item: any) => item?.list?.id === column.paymentBank
        );
        let amoutToPaid = Number(allarray.amoutToPaid) || 0;
        setSelectBankBalance(selectedBank?.amount);
        let total_amount: any = totalAmount?.toFixed(2);
        form.setFieldsValue({
          bicnum: selectedBank?.list?.bicnum,
          ibanNumber: selectedBank?.list?.ibannum,
          accountNumber: selectedBank?.list?.accnum,
          holderName: selectedBank?.list?.laccount,
          availableBalance: selectedBank?.amount,
          outStanding: (Number(total_amount) - Number(amoutToPaid)).toFixed(2),
          paymentMethod: selectedBank?.list?.laccount === "Cash" ? "cash" : "",
        });
      }
      if (column.amoutToPaid) {
        let total_amount: any = totalAmount?.toFixed(2);
        let outstanding = Number(total_amount) - Number(column.amoutToPaid);
        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0) {
          form.setFieldsValue({
            outStanding: 0,
            amoutToPaid: Number(total_amount),
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
          outStanding: totalAmount?.toFixed(2),
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
                  array[index].quantity = null;
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
                  console.log("");
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
            if (item && item.id !== null) {
              let foundProduct = props.product.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item?.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? ledgerId === 2
                    ? Number(foundProduct?.rate)
                    : Number(foundProduct?.productDetails?.rate)
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
              total = total - discountAmount;
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
              let unitDetails =
                ledgerId === 2
                  ? foundProduct?.unitDetails
                  : foundProduct?.productDetails?.unitDetails;
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

              if (
                column?.columns[index]?.discount > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price != null &&
                item.price !== 0
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = price * quantity * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = price * quantity * disRate;
                  total = price * quantity - discountAmount;
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
                  discountAmount = price * quantity * disRate;
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
                discountAmount = price * quantity * discountRate;
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
              }

              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? ledgerId === 2
                    ? Number(foundProduct?.vat)
                    : Number(foundProduct.productDetails?.vat)
                  : Number(item.vat);
              let vatAmount =
                formValue.column?.columns?.length > 1
                  ? formValue?.columns[index].vatamount
                  : ledgerId === 2
                  ? Number(foundProduct?.vatamt)
                  : Number(foundProduct.productDetails?.vatamt);
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
                (ledgerId === 2
                  ? foundProduct?.includevat === "1.00"
                  : foundProduct.productDetails?.includevat === "1.00") &&
                selectedIncludeVat === false
              ) {
                notification.error({
                  message: "VAT Inclusion Warning",
                  description: "This product is priced inclusive of VAT",
                });
              }
              if (selectedIncludeVat === undefined) {
                if (
                  ledgerId === 2
                    ? foundProduct?.includevat === "1.00"
                    : foundProduct.productDetails?.includevat === "1.00"
                ) {
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
                description:
                  ledgerId === 2
                    ? foundProduct?.idescription
                    : foundProduct?.productDetails?.idescription,
                hsn_code:
                  ledgerId === 2
                    ? foundProduct?.hsn_code
                    : foundProduct?.productDetails?.hsn_code,
                sgst: Number(vatAmount) / 2,
                cgst: Number(vatAmount) / 2,
                igst: Number(vatAmount),
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? ledgerId === 2
                      ? foundProduct?.vat
                      : foundProduct?.productDetails?.vat
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

        if (updatedColumns?.length) {
          form.setFieldsValue({ columns: updatedColumns });
          setSubTotal(_subTotal);
          setTatalVat(_tatalVat);
          setOverolDiscount(_overollDiscount);
          let _totalAmount = _subTotal + _tatalVat;
          // let roundedNumber = Math.round(_totalAmount);
          // let amountAdded = roundedNumber - _totalAmount;
          // setRoundOff(amountAdded);
          setTotalAmount(_totalAmount);

          let loyalty_points =
            Number(_totalAmount) *
            Number(user?.companyInfo?.loyaltyDiscountPercentage);

          setLoyaltyPoint(loyalty_points);
          if (
            customerInfo?.loyaltyPoints + loyaltyPoint <=
            Number(user?.companyInfo?.loyaltyRedeemLimit)
          ) {
            setClaimedPoint(0);
            setIsPointClaim(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClaimClick = () => {
    if (isPointClaim) {
      setClaimedPoint(0);
      setIsPointClaim(false);
      let _totalAmount = subTotal + tatalVat;
      // let roundedNumber = Math.round(_totalAmount);
      // let amountAdded = roundedNumber - _totalAmount;
      // setRoundOff(amountAdded);
      // setTotalAmount(roundedNumber);
      setTotalAmount(_totalAmount);
    } else {
      setIsPointClaim(true);
      let _totalAmount = subTotal + tatalVat;

      if (_totalAmount <= customerInfo?.loyaltyPoints + loyaltyPoint) {
        // setRoundOff(0.0);
        setTotalAmount(0.0);
        setClaimedPoint(Number(_totalAmount.toFixed(2)));
      } else {
        setClaimedPoint(
          (customerInfo?.loyaltyPoints + loyaltyPoint).toFixed(2)
        );
        let __totalAmount =
          _totalAmount - customerInfo?.loyaltyPoints + loyaltyPoint;
        // let roundedNumber = Math.round(__totalAmount);
        // let amountAdded = roundedNumber - __totalAmount;
        // // setRoundOff(amountAdded);
        // setTotalAmount(roundedNumber);
        setTotalAmount(_totalAmount);
      }
    }
  };
  const handleRedeemPointChange = (e: any) => {
    let inputValue = Number(e.target.value);
    const maxLimit = customerInfo?.loyaltyPoints + loyaltyPoint;
    if (inputValue > maxLimit) {
      inputValue = maxLimit;
    }
    let _totalAmount = Number(subTotal) + Number(tatalVat) - Number(inputValue);

    // let roundedNumber = Math.round(_totalAmount);
    // let amountAdded = roundedNumber - _totalAmount;
    // setRoundOff(amountAdded);
    // setTotalAmount(roundedNumber);
    setClaimedPoint(inputValue);
    setTotalAmount(_totalAmount);
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.CreateSales")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.CreateInvoice")}
        secondPathLink={"/usr/sales-invoice"}
      ></PageHeader>
      <br />
      <Container>
        <Card>
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            scrollToFirstError
          >
            <Row>
              <Col sm={1}>
                <div className="formLabel">
                  {t("home_page.homepage.Serialnumber")}
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
              <Col sm={1} xs={12}>
                <div className="formLabel">
                  {t("home_page.homepage.invoice_no")}
                </div>
                <Form.Item name={"invoiceno"} rules={[{ required: true }]}>
                  <Input size="large" readOnly style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col sm={2} xs={12}>
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
                    filterOption={false}
                    onSearch={(val: any) => props.customerName(val)}
                    onChange={(val: any) => {
                      let selectCustomers = props?.customers.find(
                        (item: any) => item.id === val
                      );

                      form.setFieldsValue({
                        inaddress: selectCustomers?.address,
                        deladdress: selectCustomers?.address,
                      });
                    }}
                    loading={!props.customers}
                  >
                    <Select.Option key="addButton" value="addButton">
                      <Button
                        type="primary"
                        block
                        onClick={() => setCoustomerCreate(true)}
                      >
                        <GoPlus /> {t("home_page.homepage.Add_New")}
                      </Button>
                    </Select.Option>
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
                  {t("home_page.homepage.Sales_Ledger")}
                </div>
                <Form.Item
                  name={"ledger"}
                  rules={[{ required: true, message: "choose ledger" }]}
                >
                  <Select size="large">
                    {props.ledgers &&
                      props.ledgers.length &&
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
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.Due_Date")}
                </div>
                <Form.Item name={"ldate"}>
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
              <Col sm={2}>
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
              products={props.product}
              taxLists={props.taxList}
              isStateTax={isStateTax}
              qSuffix={qSuffix}
              stock={pStock}
              productModal={(val: any) => setProductCreate(val)}
              ledgerId={ledgerId}
            />
            <br />
            <Row>
              <Col sm={3}>
                <div className="fo  rmLabel">
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
                <Form.Item
                  name={"deladdress"}
                  rules={[
                    { message: t("home_page.homepage.enterdeliveryaddress") },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">{t("home_page.homepage.Terms")}</div>
                <Form.Item
                  name={"terms"}
                  // rules={[{ required: true, message: "enter terms" }]}
                >
                  <Input.TextArea
                    rows={4}
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
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
            <div className="salesInvoice-SubHeader">
              <div style={{ fontSize: window.innerWidth <= 411 ? "12px" : "" }}>
                {t("home_page.homepage.Record_Payment")}
              </div>
              <div>
                <Button
                  className="customBtn"
                  type="primary"
                  onClick={() => setIsPaymentInfo(!isPaymentInfo)}
                >
                  {isPaymentInfo ? "Close" : `+ Add`}
                  {window.innerWidth <= 411 ? "" : " Payment"}
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
                        let bank = props?.banks.find(
                          (item: any) => item?.list?.id === val
                        );
                        setSlectedBank(bank);
                      }}
                    >
                      {props?.banks?.length &&
                        props?.banks?.map((item: any) => {
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
                      style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
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

                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.AvailableBalance")} :
                  </div>
                  <Form.Item name={"availableBalance"} noStyle>
                    <Input
                      style={{ width: "100%" }}
                      placeholder={t("home_page.homepage.AvailableBalance")}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.outstanding")}:
                  </div>
                  <Form.Item name={"outStanding"} noStyle>
                    <Input
                      style={{ width: "100%" }}
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
                      style={{ width: "100%" }}
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
            {/* Product IMEI  */}
            <div className="salesInvoice-SubHeader">
              <div style={{ fontSize: window.innerWidth <= 411 ? "12px" : "" }}>
                Product IMEI
              </div>
              <div>
                <Button
                  className="customBtn"
                  type="primary"
                  onClick={() => setIsProductImei(!isProductImei)}
                >
                  {isProductImei ? "Close" : "Set"}
                  {window.innerWidth <= 411 ? "" : " IMEI"}
                </Button>
              </div>
            </div>
            <br />
            {isProductImei ? (
              <>
                <Form.List name="productImei">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <Table responsive bordered>
                        {columnValue?.length > 0 && (
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>IMEI</th>
                            </tr>
                          </thead>
                        )}
                        <tbody>
                          {columnValue?.map((item: any, index: any) => (
                            <>
                              {item?.quantity &&
                                item?.quantity > 0 &&
                                Array.from({ length: item.quantity }).map(
                                  (_, imeiIndex) => (
                                    <tr key={`${index}-${imeiIndex}`}>
                                      <Form.Item
                                        name={[index, "invoiceItemId"]}
                                        initialValue={item?.id}
                                        noStyle
                                      />
                                      <td>
                                        <Form.Item
                                          name={[
                                            index,
                                            "invoiceItemDescription",
                                          ]}
                                          initialValue={item?.description}
                                          noStyle
                                        >
                                          <Input
                                            variant="borderless"
                                            style={{ width: "100%" }}
                                            readOnly
                                          />
                                        </Form.Item>
                                      </td>
                                      <td>
                                        <Form.Item
                                          name={[index, imeiIndex, "imei"]}
                                          noStyle
                                        >
                                          <Input
                                            style={{ width: "100%" }}
                                            placeholder={`IMEI  ${
                                              imeiIndex + 1
                                            }`}
                                          />
                                        </Form.Item>
                                      </td>
                                    </tr>
                                  )
                                )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                </Form.List>

                <br />
                <hr />
              </>
            ) : null}
            {/* reccurring notification  */}
            <div className="salesInvoice-SubHeader">
              <div style={{ fontSize: window.innerWidth <= 411 ? "12px" : "" }}>
                {t("home_page.homepage.Reccuring_Notification")}
              </div>
              <div>
                <Button
                  className="customBtn"
                  type="primary"
                  onClick={() => setIsReccNotification(!isReccNotification)}
                >
                  {isReccNotification ? "Close" : "Set"}
                  {window.innerWidth <= 411 ? "" : " Notification"}
                </Button>
              </div>
            </div>
            {isReccNotification ? (
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

                  {/* <Col sm={2}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      Days Before :
                    </div>
                    <Form.Item
                      noStyle
                      name="daybefore"
                      rules={[{ message: "Enter days before" }]}
                    >
                      <Input
                        placeholder="days before"
                        size="large"
                        type="number"
                      />
                    </Form.Item>
                  </Col> */}
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.SendVia")}
                    </div>
                    <Form.Item
                      name="mailto"
                      rules={[
                        { message: t("home_page.homepage.SelectNotification") },
                      ]}
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
            {/* davoodupdate */}

            {/* {customerInfo &&(  */}
            {isLoyaltyEnabled === true && customerInfo && (
              <>
                <div className="salesInvoice-SubHeader">
                  <div>
                    <div
                      style={{
                        fontSize: window.innerWidth <= 411 ? "12px" : "",
                      }}
                    >
                      {/* {t("home_page.homepage.Reccuring_Notification")} */}
                      Loylity Points
                    </div>
                    <p
                      style={{
                        fontSize: window.innerWidth <= 411 ? "8px" : "12px",
                      }}
                    >
                      (Loyalty points are deducted only if they are more than
                      {" " +
                        Number(user?.companyInfo?.loyaltyRedeemLimit) +
                        " "}
                      points)
                    </p>
                  </div>

                  <div>
                    <Button
                      className="customBtn"
                      disabled={
                        customerInfo?.loyaltyPoints + loyaltyPoint <=
                        Number(user?.companyInfo?.loyaltyRedeemLimit)
                      }
                      style={
                        isPointClaim
                          ? {
                              backgroundColor: "red",
                              border: "red",
                              color: "#fff",
                              width: 100,
                            }
                          : { width: 100 }
                      }
                      type={"primary"}
                      onClick={handleClaimClick}
                    >
                      {!isPointClaim ? "Claim" : "Cancel"}
                    </Button>
                  </div>
                </div>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>Current Loyalty Points</td>
                      <td>{Number(customerInfo?.loyaltyPoints).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Reward Points</td>
                      <td>{loyaltyPoint?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Total Reward Points</td>
                      <td>
                        {(
                          customerInfo?.loyaltyPoints +
                          loyaltyPoint -
                          Number(claimedPoint)
                        )?.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <br />
                <hr />
              </>
            )}
            <br />

            <Row>
              <Col sm={6}></Col>
              <Col sm={6}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
                      <td>{subTotal?.toFixed(2)}</td>
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
                      <td>{overollDiscount?.toFixed(2)}</td>
                    </tr>

                    {isPointClaim && (
                      <tr>
                        <td>REDEEMED POINTS</td>
                        <td className="p-1">
                          <Input
                            className="p-1"
                            type="number"
                            bordered={false}
                            defaultValue={Number(claimedPoint)}
                            onChange={handleRedeemPointChange}
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      {/* <td>ROUND OFF</td>
                      <td className="p-1">
                        <Input
                          className="p-1"
                          type="number"
                          bordered={false}
                          defaultValue={Number(roundOff?.toFixed(2)) || 0.0}
                          value={Number(roundOff?.toFixed(2)) || 0.0}
                          onChange={(e: any) => {
                            setRoundOff(e.target.value);
                            let round = Number(e.target.value); 
                            let _totalAmount =
                              subTotal + tatalVat - overollDiscount;
                            _totalAmount = _totalAmount + round;
                            setTotalAmount(_totalAmount);
                          }}
                        />
                      </td> */}
                    </tr>
                    <tr>
                      <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                      <td>{totalAmount?.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>

                <Row>
                  <Col sm={6}>
                    <Button
                      className="mb-3"
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
      {coustomerCreate ? (
        <CreateCutomerModal
          open={coustomerCreate}
          onCancel={() => setCoustomerCreate(false)}
          customerSearch={props.customerName}
          type="customer"
          customer={(val: any) => {
            form.setFieldsValue({
              customerid: Number(val?.id),
              inaddress: val?.address,
              deladdress: val?.address,
            });
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
          productRefrush={() =>
            props.getProduct(ledgerId === 2 ? "Service" : "Stock")
          }
          type={ledgerId === 2 ? "Service" : "Stock"}
        />
      ) : null}
    </div>
  );
}
export default Create;
