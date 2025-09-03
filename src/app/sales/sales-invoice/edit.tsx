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
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET, PUT } from "../../../utils/apiCalls";
import Items from "../components/items";
import { GoPlus } from "react-icons/go";
import CreateCutomerModal from "../../../components/contactCreateModal";
import moment from "moment";
import { useTranslation } from "react-i18next";
function Edit(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const navigate = useNavigate();
  const adminid = user?.id;
  const [details, setDetails] = useState<any>();
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [customerInfo, setCustomerInfo] = useState<any>();
  const [locationData, setLocationData] = useState([]);
  const [prevLoyaltyPoint, setPrevLoyaltyPoint] = useState<number>(0);
  const [loyaltyPoint, setLoyaltyPoint] = useState<number>(0);
  const [isPointClaim, setIsPointClaim] = useState<any>(false);
  const [claimedPoint, setClaimedPoint] = useState(0);
  const [existingPointsOfCustomer, setExistingPointsOfCustomer] =
    useState<number>(0);
  const [ledgerId, setLedgerId] = useState<any>();
  const columnValue = Form?.useWatch("columns", form);
  const [isProductImei, setIsProductImei] = useState<any>(false);
  const { Option } = Select;
  const isLoyaltyEnabled = user?.companyInfo?.isLoyaltyEnabled;

  const onFinish = async (val: any) => {
    setIsLoading(true);
    let amountPaid = Number(val.amoutToPaid) || 0;
    let total_Amount = totalAmount?.toFixed(2);
    let totalPayable = Number(total_Amount);
    let outstanding = Number(total_Amount) - paidedValue;
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
      let selectedCustomer =
        props?.customers &&
        props?.customers?.length &&
        props?.customers.find((item: any) => item.id === val.customerid);

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

      let column = val?.columns.map((item: any) => {
        let foundedProduct = props?.product?.find(
          (product: any) => Number(product.id) === Number(item.id)
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

            itemId = item?.id || foundedProduct?.id;
            iDescription = foundedProduct.idescription;
            itemDetails = foundedProduct;
            locationRef = null;
          }
        }

        if (isReccNotification) {
          let nextDate;
          if (val.period === "daily") {
            nextDate = moment(val?.date).add(1, "day").format("YYYY-MM-DD");
          } else if (val.period === "weekly") {
            nextDate = moment(val?.date).add(7, "day").format("YYYY-MM-DD");
          } else if (val.period === "monthly") {
            nextDate = moment(val?.date).add(1, "month").format("YYYY-MM-DD");
          } else if (val.period === "yearly") {
            nextDate = moment(val?.date).add(1, "year").format("YYYY-MM-DD");
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
        cname: selectedCustomer.bus_name,
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
        total: Number(total_Amount),
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
        // roundOff: roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
        loyaltyPoints: loyaltyPoint,
        claimedPoint: claimedPoint,
      };
      let salesUrl = API.UPDATE_SALES + props.id;
      const response: any = await PUT(salesUrl, payload);
      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: "Sales invoice updated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update sales invoice",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update sales invoice",
      });
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
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();
    getInvoiceDetails();
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
  }, []);

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_SALE_INVOICE + props.id + "/sales";
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

  const getInvoiceNo = async (locationId: number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        props.adminid +
        `/${user?.companyInfo?.id}/${locationId}/sales`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error);
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
          props?.customers &&
          props?.customers?.length &&
          props?.customers.find((item: any) => item.id === column.customerid);
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
            user?.companyInfo.taxno?.substring(0, 2)
        );
        setExistingPointsOfCustomer(Number(selectedCustomer?.loyaltyPoints));
        setCustomerInfo(selectedCustomer);
      }

      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
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
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }

      if (allarray.ledger && column?.seriesNo) {
        props.getProduct(
          column.ledger === 2 ? "Service" : "Stock",
          allarray?.seriesNo
        );
        form.setFieldsValue({ columns: [] });
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }

      if (column.paymentBank) {
        let selectedBank = props?.banks?.find(
          (item: any) => item?.list?.id === column.paymentBank
        );
        setSelectBankBalance(selectedBank?.amount);
        let payingAmount = Number(allarray.amoutToPaid) || 0;
        let total_amount: any = totalAmount?.toFixed(2);

        form.setFieldsValue({
          bicnum: selectedBank?.list?.bicnum,
          ibanNumber: selectedBank?.list?.ibannum,
          accountNumber: selectedBank?.list?.accnum,
          holderName: selectedBank?.list?.laccount,
          availableBalance: selectedBank?.amount,
          outStanding: (Number(total_amount) - payingAmount).toFixed(2),
          paymentMethod: selectedBank?.list?.laccount === "Cash" ? "cash" : "",
        });
      }

      if (column.amoutToPaid) {
        let total_amount = totalAmount?.toFixed(2);
        let outstanding =
          Number(total_amount) - paidedValue - Number(column.amoutToPaid);

        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0) {
          let total_amount = totalAmount?.toFixed(2);
          form.setFieldsValue({
            outStanding: 0,
            amoutToPaid: Number(total_amount) - paidedValue,
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
        let total_amount = totalAmount?.toFixed(2);
        form.setFieldsValue({
          outStanding: Number(total_amount) - paidedValue - 0,
        });
      }

      if (allarray.columns && allarray?.columns?.length) {
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
              let foundProduct = props?.product?.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );

              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item?.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? ledgerId === 2
                    ? Number(foundProduct?.sp_price)
                    : Number(foundProduct?.productDetails?.sp_price)
                  : Number(item?.price);
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
                const orderdQuantity = details.invoiceItems.find(
                  (item: any) =>
                    item?.product?.id ===
                    (ledgerId === 2
                      ? foundProduct?.id
                      : foundProduct.productDetails?.id)
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
                item.price != null &&
                item.price !== 0
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
                column?.columns[index]?.price ||
                column?.columns[index]?.quantity
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
                ledgerId === 2
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

              // Use 'includeVat' as needed in your code
              const updatedColumn = {
                id: item.id,
                hsn_code:
                  ledgerId === 2
                    ? foundProduct?.hsn_code
                    : foundProduct.productDetails?.hsn_code,
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
                    : Number(column?.columns[index]?.price).toFixed(2),
                incomeTaxAmount:
                  ledgerId === 2
                    ? Number(foundProduct?.vatamt).toFixed(2)
                    : Number(foundProduct?.productDetails?.vatamt).toFixed(2),
                vatamt:
                  ledgerId === 2
                    ? Number(foundProduct?.vatamt).toFixed(2)
                    : Number(foundProduct?.productDetails?.vatamt).toFixed(2),
                description:
                  ledgerId === 2
                    ? foundProduct?.idescription
                    : foundProduct?.productDetails?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? ledgerId === 2
                      ? foundProduct?.vat
                      : foundProduct?.productDetails?.vat
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
        if (updatedColumns?.length) {
          form.setFieldsValue({ columns: updatedColumns });
        }

        setSubTotal(_subTotal);
        setTatalVat(_tatalVat);
        setOverolDiscount(_overollDiscount);
        let _totalAmount = _subTotal + _tatalVat;
        // let roundedNumber = Math.round(_totalAmount);
        // let amountAdded = roundedNumber - _totalAmount;
        // setRoundOff(Number(amountAdded.toFixed(2)));
        // setTotalAmount(roundedNumber);
        setTotalAmount(_totalAmount);
        let loyalty_points =
          Number(_totalAmount) *
          Number(user?.companyInfo?.loyaltyDiscountPercentage);
        loyalty_points =
          Number(loyalty_points) + Number(existingPointsOfCustomer);
        setLoyaltyPoint(Number(loyalty_points));
        if (
          customerInfo?.loyaltyPoints + loyaltyPoint <=
          Number(user?.companyInfo?.loyaltyRedeemLimit)
        ) {
          setClaimedPoint(0);
          setIsPointClaim(false);
        }
        if (column.columns) {
          setIsPaymentInfo(false);
          form.setFieldsValue({
            paymentBank: null,
            bicnum: null,
            ibanNumber: null,
            accountNumber: null,
            holderName: null,
            availableBalance: null,
            outStanding: null,
            paymentMethod: null,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getInitialValues = (data: any) => {
    try {
      if (data.invoiceItems[0].ledger) {
        props.getProduct(
          data.invoiceItems[0].ledger === 2 ? "Service" : "Stock",
          data?.invoiceItems[0]?.seriesNo
        );
      }
      setIsStateTax(
        data?.invoiceDetails &&
          data?.invoiceDetails?.customer.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
      );
      setLedgerId(data?.invoiceDetails?.ledger);
      setCustomerInfo(data?.invoiceDetails?.customer);
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
      let productImei: any = [];
      let columns = data.invoiceItems.map((item: any) => {
        let vatAmount = Number(item.vatamt);
        if (item?.imei?.length) {
          const result: any = {};
          item?.imei?.forEach((imei: any, index: number) => {
            if (imei) {
              result[index] = { imei };
            }
          });
          result.invoiceItemId = item?.productLocationRef;
          result.invoiceItemDescription = item?.product?.idescription;
          productImei?.push(result);
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
        _overollDiscount = _overollDiscount + Number(item.discount_amount);
        return {
          id: item?.productLocationRef || item?.product?.id,
          sgst: Number(item.vatamt) / 2,
          cgst: Number(item.vatamt) / 2,
          igst: Number(item.vatamt),
          hsn_code: item?.product?.hsn_code,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item?.product?.idescription,
          vat: item.vat,
          vatamount: Number(item.vatamt).toFixed(2),
          discount: item.discount,
          discountamt: Number(item.discount_amount),
          total: item.total,
          includeVat: item.includevat == 1 ? true : false,
        };
      });

      const initialValue = {
        seriesNo: data.invoiceDetails.seriesNo,
        invoiceno: data.invoiceDetails.invoiceno,
        customerid: data.invoiceDetails.customerid,
        ledger: data.invoiceDetails.ledger,
        sdate: dayjs(data?.invoiceDetails?.sdate),
        ldate: dayjs(data?.invoiceDetails?.ldate),
        reference: data?.invoiceDetails?.reference,
        columns: columns,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        productImei: productImei,
        outStanding: Number(data?.invoiceDetails?.outstanding) || "",
      };
      let previousTotal = Number(data?.invoiceDetails.total);
      let lastinvloylty =
        previousTotal * Number(user?.companyInfo?.loyaltyDiscountPercentage);
      setPrevLoyaltyPoint(lastinvloylty);
      setLoyaltyPoint(lastinvloylty);
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setCustomerInfo(data?.invoiceDetails.customer);
      if (data?.invoiceDetails.loyaltyDiscountAmount > 0) {
        setIsPointClaim(true);
        setClaimedPoint(Number(data?.invoiceDetails.loyaltyDiscountAmount));
      }
      // setRoundOff(Number(data?.invoiceDetails?.roundOff) || 0);
      setOverolDiscount(_overollDiscount);
      let _totalAmount = Number(data?.invoiceDetails.total) || 0;

      setTotalAmount(_totalAmount);
      setDefaltOutStanding(
        _totalAmount -
          (_totalAmount - Number(data?.invoiceDetails?.outstanding))
      );

      setPaidedValue(_totalAmount - Number(data?.invoiceDetails?.outstanding));
      return initialValue;
    } catch (error) {
      console.log("eror", error);
      return {};
    }
  };
  const handleClaimClick = () => {
    if (isPointClaim) {
    } else {
      setIsPointClaim(true);
      let _totalAmount =
        subTotal +
        tatalVat -
        (customerInfo?.loyaltyPoints - prevLoyaltyPoint + loyaltyPoint);
      // let roundedNumber = Math.round(_totalAmount);
      // let amountAdded = roundedNumber - _totalAmount;
      // setRoundOff(amountAdded);
      // setTotalAmount(roundedNumber);
      setTotalAmount(_totalAmount);
      setClaimedPoint(
        Number(
          (
            customerInfo?.loyaltyPoints -
            prevLoyaltyPoint +
            loyaltyPoint
          ).toFixed(2)
        )
      );
    }
  };
  const handleRedeemPointChange = (e: any) => {
    let inputValue = Number(e.target.value);
    const maxLimit =
      customerInfo?.loyaltyPoints - prevLoyaltyPoint + loyaltyPoint;
    if (inputValue > maxLimit) {
      inputValue = maxLimit;
    }
    let _totalAmount = Number(subTotal) + Number(tatalVat) - Number(inputValue);

    // let roundedNumber = Math.round(_totalAmount);
    // let amountAdded = roundedNumber - _totalAmount;
    // setRoundOff(amountAdded);
    setTotalAmount(_totalAmount);
    setClaimedPoint(inputValue);
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.EditSales_Invoice")}
        goBack={"/dashboard"}
        firstPathLink={"/usr/sales-invoice"}
        firstPathText={"Sales Invoice"}
        secondPathText={t("home_page.homepage.Edit_Invoice")}
        secondPathLink={"/usr/sales-invoice"}
      ></PageHeader>
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
                    <Input size="large" />
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
                  <Form.Item name={"sdate"} initialValue={dayjs(new Date())}>
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
                products={props.product}
                taxLists={props.taxList}
                qSuffix={qSuffix}
                stock={pStock}
                isStateTax={isStateTax}
                ledgerId={ledgerId}
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
              {/* Product IMEI  */}
              <div className="salesInvoice-SubHeader">
                <div
                  style={{ fontSize: window.innerWidth <= 411 ? "12px" : "" }}
                >
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
              <br />
              {props.reccuring ? null : (
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

              {isReccNotification && !props.reccuring ? (
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

              {/* Loyalty Points */}
              { isLoyaltyEnabled === true && customerInfo &&  (
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
                        <td>
                          {Number(
                            customerInfo?.loyaltyPoints - prevLoyaltyPoint
                          ).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>Reward Points</td>
                        <td>{loyaltyPoint?.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Total Reward Points</td>
                        <td>
                          {(
                            customerInfo?.loyaltyPoints -
                            prevLoyaltyPoint +
                            loyaltyPoint
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

                      {isPointClaim && (
                        <tr>
                          <td>REDEEMED POINTS</td>
                          <td className="p-1">
                            <Input
                              className="p-1"
                              type="number"
                              bordered={false}
                              value={Number(claimedPoint)}
                              max={
                                customerInfo?.loyaltyPoints -
                                prevLoyaltyPoint +
                                loyaltyPoint
                              }
                              onChange={handleRedeemPointChange}
                            />
                          </td>
                        </tr>
                      )}
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
                              let _totalAmount = subTotal + tatalVat;
                              _totalAmount = _totalAmount - round;
                              setTotalAmount(_totalAmount);
                            }}
                            // suffix={false}
                          />
                        </td>
                      </tr> */}

                      <tr>
                        <td>{t("home_page.homepage.TOTAL_AMOUNT")}</td>
                        <td>{totalAmount?.toFixed(2)}</td>
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
                        {t("home_page.homepage.Update")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <br />
              {/* {customerInfo && (
                <p>
                  *Loyalty points are deducted only if they are more than{" "}
                  {Number(user?.companyInfo?.loyaltyRedeemLimit)} points
                </p>
              )} */}
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
