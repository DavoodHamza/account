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
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import API from "../../../../config/api";
import { GET, PUT } from "../../../../utils/apiCalls";
import Items from "./items";
import { useTranslation } from "react-i18next";
import moment from "moment";
function DebitNoteEdit(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const navigate = useNavigate();
  const adminid = user?.id;
  const [details, setDetails] = useState<any>({});
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [outStanding, setOutStanding] = useState<any>(0);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [invoicesLoding, setInvoicesLoding] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [qSuffix, setqSuffix] = useState("");
  const [isStateTax, setIsStateTax] = useState(false);
  const [locationData, setLocationData] = useState<any>([]);
  const [pStock, setPStock] = useState(0);
  const [products,setProducts] = useState<any>([])

  const onFinish = async (val: any) => {
    let amountPaid = Number(val.amoutToPaid) || 0;
    let totalPayable = Number(outStanding) || totalAmount;
    let outstanding = totalPayable - amountPaid;
    let status = details.status;
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
      let selectedSuplier =
        props?.customers &&
        props?.customers?.length &&
        props?.customers?.find((item: any) => item.id === val.supplierid);
      let selectedPurchaseNo =
        invoices &&
        invoices?.length &&
        invoices?.find((item: any) => item.id === val.purchaceInvoice);
      let ledger =
        props?.ledgers &&
        props?.ledgers?.length &&
        props?.ledgers?.find((item: any) => item.id === val.ledger);

      let column = val?.columns?.map((item: any, index: number) => {
        let foundedProduct = products?.find(
          (product: any) => product?.id === item?.id
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
          id: item.id,
          productLocationRef:item.productLocationRef,
          discount: item.discount,
          discountamt: item.discountamt,
          productId: item.id,
          product: foundedProduct,
          idescription: item.idescription,
          description: item.idescription,
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
        sdate: val?.sdate,
        ldate: val?.ldate,
        invoiceno: val.invoiceno,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        total: val.total,
        quotes: val?.quotes,
        status: status,
        id: props.id,
      };
      let payload = {
        supplier: selectedSuplier,
        sname: selectedSuplier.name,
        supplierid: val.supplierid,
        columns: column,
        purchase: purchaseDeatails,
        invoiceno: val.invoiceno,
        sdate: val?.sdate,
        purchase_ref: selectedPurchaseNo,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        quotes: val?.quotes,
        adminid: adminid,
        outstanding,
        status: status,
        type: "pcredit",
        pagetype: "2",
        total: Number(totalAmount.toFixed(2)),
        userid: adminid,
        userdate: new Date(),
        attachDoc: "",
        attachImage: "",
        id: props.id,
        paymentInfo: paymentInfo,
        ledger: ledger,
        // roundOff:roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };
      let salesUrl = "purchaseinvoice/update/" + props.id;
      const response: any = await PUT(salesUrl, payload);
      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: "Debit note updated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update debit note",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update debit note!! Please try again later",
      });
      setIsLoading(false);
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
      let url = API.PURCHASE_SUPPLIER_LIST + props.id + "/purchase";
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
      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
      let discountAmount = 0;
      let total = 0;

      let allProducts:any = [];
      let columns = purchaceDeatails?.invoiceItems?.map((item: any) => {
        let productObj = {
          ...item?.product,
          totalPurchasedStock: item?.quantity,
          productLocationRef: item.productLocationRef,
        };
        allProducts.push(productObj)
        let vatPercent = Number(item.vat);

        let vatAmount =
          (Number(item.costprice) * Number(item.quantity) * vatPercent) / 100;

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
        if (item.discount > 0) {
          const discountRate = item.discount / 100;
          discountAmount = Number(total) * discountRate;
        }

        _tatalVat = _tatalVat + Number(item.vatamt);
        _overollDiscount = _overollDiscount + discountAmount;
        return {
          id: item.product.id,
          productLocationRef:item.productLocationRef,
          hsn_code: item.product.hsn_code,
          sgst: vatAmount / 2,
          cgst: vatAmount / 2,
          igst: vatAmount,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: item.vatamt,
          discount: Number(item.discount),
          discountamt: Number(discountAmount),
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
      let _totalAmount = _subTotal + _tatalVat ;
      setTotalAmount(_totalAmount);
      form.setFieldsValue(initialValue);
    } catch (error) {
      console.log(error)
      return {};
    }
  };


  const getInvoices = async (supplierId: number,locationId:number) => {
    try {
      setInvoicesLoding(true);
      let invoiceurl =
        "purchaseinvoice/getByLocationAndSupplier" +
        `?supplierId=${supplierId}&companyId=${props?.companyid}&locationId=${locationId}&type=debit`;
      const { data: Invoices }: any = await GET(invoiceurl, null);
      let invoiceData = Invoices.filter((item: any) => item?.id);
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
              let foundProduct = products?.find(
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

              setqSuffix(foundProduct?.unitDetails);
              setPStock(foundProduct?.totalPurchasedStock);
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index].quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? Number(foundProduct?.rate)
                  : item?.price;
              let total = price * quantity - discountAmount;

              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? Number(foundProduct?.vat)
                  : Number(item.vat);
              let vatAmount =
                formValue?.column?.columns?.length > 1
                  ? formValue?.columns[index]?.vatamount
                  : Number(foundProduct?.vatamt);

              if (column?.columns[index]?.discount > 0) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = (price * quantity) * discountRate;
                total = price * quantity - discountAmount
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = (price * quantity) * disRate;
                  total = price * quantity - discountAmount
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
                if (item?.discountamt > 0) {
                  const discountpecentage =
                    (Number(item?.discountamt) / (price * quantity)) * 100;
                  discountAmount = Number(item?.discountamt);
                  total = price * quantity - discountAmount
                  discount = Number(discountpecentage);
                } else {
                  discountAmount = 0;
                  total = price * quantity - discountAmount
                }
              }
              if (0 >= column?.columns[index]?.discountamt) {
                discount = 0;
              }

              if (column?.columns[index]?.discountamt > 0) {
                const discountpecentage =
                  (Number(item?.discountamt) / (price * quantity)) * 100;
                discountAmount = Number(item?.discountamt);
                total = price * quantity - discountAmount
                discount = Number(discountpecentage);
                if (column?.columns[index]?.discountamt >= total) {
                  let disRate = 100 / 100;
                  discountAmount = (price * quantity) * disRate;
                  total = price * quantity - discountAmount
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
                total = price * quantity - discountAmount
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
                vatAmount = ((price * quantity - discountAmount) * vatPercent) / 100;
              }
              ///////////////////////includeVat//////////////
              let includeVat;
              const selectedIncludeVat = column?.columns[index]?.includeVat;
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
                total = price * quantity - discountAmount
              } else {
                total = Number(price * quantity - discountAmount + vatAmount);
              }
              ///////////////////////includeVat//////////////

              //here total calculation
              if (includeVat) {
                _subTotal = price * quantity - discountAmount - vatAmount + _subTotal;
              } else {
                _subTotal = price * quantity - discountAmount + _subTotal;
              }

              _tatalVat = _tatalVat + vatAmount;
              _overollDiscount = _overollDiscount + discountAmount;
              let newTotal = total;
              const updatedColumn = {
                id: item.id,
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
                vatamount: vatAmount.toFixed(2),
                discountamt: discountAmount.toFixed(2),
                discount: discount,
                total: newTotal,
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
          let _totalAmount = _subTotal + _tatalVat ;
          // let roundedNumber = Math.round(_totalAmount);
          // let amountAdded = roundedNumber - _totalAmount;
          // setRoundOff(Number(amountAdded.toFixed(2)));
          // setTotalAmount(roundedNumber);
          setTotalAmount(_totalAmount);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getInitialProducts = async(id:number)=>{
    try {
      let invoiceurl = API.PURCHASE_SUPPLIER_LIST + id + "/purchase";
      const { data: purchaceDeatails }: any = await GET(invoiceurl, null);
      let allProducts:any = [];
      let columns = purchaceDeatails?.invoiceItems?.map((item: any) => {
        let productObj = {
          ...item?.product,
          totalPurchasedStock: item?.quantity,
          productLocationRef: item.productLocationRef,
        };
        allProducts.push(productObj)
      })
      setProducts(allProducts);
    } catch (error) {
      console.log(error)
    }
  }

  const getInitialValues = (data: any) => {
    try {
      getInvoices(data.invoiceDetails.supplierid,data.invoiceDetails?.seriesNo);
      if (data.invoiceItems[0]["purchase.id"]) {
        getInitialProducts(data.invoiceItems[0]["purchase.id"])
      }

      setIsStateTax(
        data?.invoiceDetails?.supplier?.vat_number?.substring(0, 2) ===
          user?.companyInfo?.taxno?.substring(0, 2)
      );
      let _subTotal = 0;
      let _tatalVat = 0;
      let total = 0;
      let _overollDiscount = data?.invoiceItems?.reduce(
        (acc: any, sum: any) => acc + Number(sum.discount_amount),
        0
      );
      let columns = data.invoiceItems.map((item: any) => {
        let vatAmount = Number(item?.vatamt);

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
          hsn_code: item.product.hsn_code,
          sgst: vatAmount / 2,
          cgst: vatAmount / 2,
          igst: vatAmount,
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: item.vatamt,
          description: item.product.idescription,
          vat: item.vat,
          vatamount: item.vatamt,
          discount: Number(item.discount),
          discountamt: item?.discount_amount,
          total: Number(item.total),
          includeVat: item.includevat == 1 ? true : false,
        };
      });
      const initialValue = {
        seriesNo:data.invoiceDetails.seriesNo,
        invoiceno: data.invoiceDetails.invoiceno,
        supplierid: data.invoiceDetails.supplierid,
        ledger: data.invoiceItems[0].ledger,
        sdate: dayjs(data?.invoiceDetails?.sdate),
        ldate: dayjs(data?.invoiceDetails?.ldate),
        reference: data?.invoiceDetails?.reference,
        columns: columns,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        refid: data?.invoiceDetails?.refid,
        purchase_ref: data?.invoiceDetails?.purchase_ref,
      };
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setOverolDiscount(_overollDiscount);
      let _totalAmount = _subTotal + _tatalVat ;
      // let roundedNumber = Math.round(_totalAmount);
      // let amountAdded = roundedNumber - _totalAmount;
      // setRoundOff(Number(amountAdded.toFixed(2)));
      //setTotalAmount(roundedNumber);
      setTotalAmount(_totalAmount);
      return initialValue;
    } catch (error) {
      console.log(error)
      return {};
    }
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.UpdateDebitNotes")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.UpdateDebitNotes")}
        secondPathLink={`/usr/purchace-debitnote-form/${props.id}`}
        firstPathText={t("home_page.homepage.Debit_Notes")}
        firstPathLink={"/usr/purchase-debit-note"}
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
                  <Form.Item name={"invoiceno"} rules={[{ required: true }]}>
                    <Input size="large" readOnly/>
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Supplier_Name")}
                  </div>
                  <Form.Item
                    name={"supplierid"}
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
                      onSearch={(val: any) => props.customerSearch(val)}
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
                    name={"purchase_ref"}
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.choosePurchaseInvoice"),
                      },
                    ]}
                  >
                    <Select size="large" showSearch loading={invoicesLoding}>
                      {invoices &&
                        invoices?.length &&
                        invoices?.map((item: any, index: number) => {
                          return (
                            <Select.Option
                              key={item.invoiceno}
                              value={item.invoiceno}
                            >
                              {item?.invoiceno}
                            </Select.Option>
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
                  <Form.Item name={"sdate"} initialValue={dayjs(new Date())}>
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
                taxLists={props.taxList}
                qSuffix={qSuffix}
                stock={pStock}
                products={products}
                isStateTax={isStateTax}
              />
              <br />
              <Row>
                <Col sm={9}></Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Notes")}
                  </div>
                  <Form.Item name={"quotes"}>
                    <Input.TextArea rows={4} size="large" />
                  </Form.Item>
                </Col>
              </Row>
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
                                <td>{t("home_page.homepage.TOTAL_CGST")}</td>
                                <td>{(tatalVat / 2)?.toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td>{t("home_page.homepage.TOTAL SGST")}</td>
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
                        <td>{overollDiscount?.toFixed(2)}</td>
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
                      <Button size="large" block onClick={() => navigate(-1)}>
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
            </Form>
          )}
        </Card>
      </Container>
    </div>
  );
}
export default DebitNoteEdit;
