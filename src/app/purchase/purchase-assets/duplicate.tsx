import { Col, Container, Row, Table } from "react-bootstrap";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  notification,
  Upload,
  Spin,
} from "antd";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET, POST, POST2 } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import Items from "./item";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { GoPlus } from "react-icons/go";
import CreateCutomerModal from "../../../components/contactCreateModal";
import FixedAssetModal from "../../product/product-asset/FixedAssetModal";
import moment from "moment";
import { useTranslation } from "react-i18next";
function DuplicatePurchaseAsset(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saccountList, setSaccountList] = useState<any>();
  const [isCheck, setIsCheck] = useState<any>(false);
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getUserData, SetGetUserData] = useState("");
  const [loading, setLoading] = useState(false);
  const [qSuffix, setqSuffix] = useState("");
  const [isStateTax, setIsStateTax] = useState(false);
  const [selectBankBalance, setSelectBankBalance] = useState(0);
  const [selectBank, setSlectedBank] = useState<any>({});
  const [customerCreate, setCustomerCreate] = useState<any>(false);
  const [locationData, setLocationData] = useState<any>([]);
  const [createAssetOpen, setCreateAssetOpen] = useState(false);

  const onFinish = async (val: any) => {
    setIsLoading(true);
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
    let paymentInfo = isPaymentInfo;
    if (isPaymentInfo) {
      paymentInfo = {
        id: val.paymentBank,
        bankid: val.paymentBank,
        outstanding: val.outStanding,
        amount: val?.amoutToPaid,
        date: val?.paymentDate,
        type: val.paymentMethod,
        paidmethod: val.paymentMethod,
        running_total: Number(selectBankBalance) - Number(val?.amoutToPaid),
      };
    }

    try {
      let selectedSuplier =
        props.customers &&
        props?.customers?.length &&
        props?.customers?.find((item: any) => item.id === val.supplierid);

      let ledgers =
        props?.ledgers &&
        props?.ledgers?.length &&
        props?.ledgers?.find((item: any) => item.nominalcode === val.ledger);

      const ledgerDetails = {
        nominalcode: ledgers.nominalcode,
        id: ledgers.id,
        laccount: ledgers.laccount,
        category: ledgers.category,
      };

      let column = val.columns.map((item: any, index: any) => {
        let foundedProduct = saccountList.find(
          (product: any) => product.id === item.id
        );
        let productLedger = {};
        if (foundedProduct?.itemtype === "Stock") {
          productLedger = {
            category: "13",
            id: 1,
            laccount: "Sales-Products",
            nominalcode: "4000",
          };
        } else if (foundedProduct?.itemtype === " Service") {
          productLedger = {
            category: "24",
            id: 2,
            laccount: "Sales-Services",
            nominalcode: "4001",
          };
        }
        return {
          id: item?.id,
          discount: item.discount,
          discountamt: item?.discountamt,
          productId: item?.id,
          product: foundedProduct,
          idescription: foundedProduct.description,
          description: foundedProduct.description,
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
          ledgerDetails: ledgerDetails,
          ledger: ledgerDetails,
          quantity: item.quantity,
          total: item.total,
          vatamt: item.vatamount,
          vatamount: item.vatamount,
          incomeTaxAmount: item.vatamount,
          itemorder: index + 1,
        };
      });

      let purchaseDeatails = {
        seriesNo:val?.seriesNo,
        sdate: val?.sdate,
        ldate: val?.ldate,
        invoiceno: val.invoiceno,
        status: val?.status,
        refid: null,
      };
      let payload = {
        seriesNo:val?.seriesNo,
        supplier: selectedSuplier,
        pList: column,
        sdate: val?.sdate,
        ldate: val?.ldate,
        invoiceno: val?.invoiceno,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        terms: val?.terms,
        quotes: val?.quotes,
        status: status,
        issued: "yes",
        type: "stockassets",
        pagetype: "1",
        total: Number(totalAmount),
        userid: adminid,
        adminid: adminid,
        userdate: new Date(),
        attachDoc: "",
        attachImage: getUserData,
        paymentInfo: paymentInfo,
        ledger: ledgers,
        purchase: purchaseDeatails,
        // roundOff:roundOff,
        total_vat: tatalVat,
        overall_discount: overollDiscount,
        taxable_value: subTotal,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
        usertype: user?.isStaff ? "staff" : "admin",
      };

      let url = API.PURCHASE_INVOICE_ADD;
      const response: any = await POST(url, payload);
      setIsLoading(true);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Purchase asset created Successfully",
        });
        navigate("/usr/purchase-fore-assets");
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: "Failed to create purchase asset",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      notification.error({
        message: "Server Error",
        description: "Failed to create purchase asset",
      });
    }
  };

  useEffect(() => {
    getInvoiceDetails();
    fetchLocations()
    form.setFieldsValue({
      sdate: dayjs(new Date()),
      ldate: dayjs(new Date()),
      paymentDate: dayjs(new Date()),
    });
  }, []);

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

  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        API.USER_SETTING_GETINVOICENO +
        props.adminid +
        `/${user?.companyInfo?.id}/${locationId}/Asset`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      setInvoiceNumber(invnumber);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error)
    }
  };

  const purchaseAssetDetails = async (val: any) => {
    let url = API.GET_AACCOUNT_BYID + adminid + `/${val}`;
    const data: any = await GET(url, null);
    if (data?.length === 0) {
      notification.warning({
        message:
          "No assets for this ledger, Please create asset for further flow",
      });
    }
    setSaccountList(data);
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
      if (column.supplierid) {
        let selectedCustomer =
          props.customers &&
          props.customers.length &&
          props?.customers.find((item: any) => item.id === column.supplierid);
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
            user?.companyInfo?.taxno?.substring(0, 2)
        );
      }
      if(column?.seriesNo){
        getInvoiceNo(column.seriesNo)
      }
      if (column?.ledger) {
        purchaseAssetDetails(column?.ledger);
      }
      if (column.paymentBank) {
        let selectedBank = props?.banks?.find(
          (item: any) => item.list.id === column.paymentBank
        );
        setSelectBankBalance(selectedBank.amount);
        form.setFieldsValue({
          bicnum: selectedBank.list.bicnum,
          ibanNumber: selectedBank.list.ibannum,
          accountNumber: selectedBank.list.accnum,
          holderName: selectedBank.list.laccount,
          availableBalance: selectedBank.amount,
          outStanding: totalAmount.toFixed(2),
          paymentMethod:
            selectedBank.list.acctype === "savings"
              ? "cash"
              : selectedBank.acctype,
        });
      }
      if (column.amoutToPaid) {
        let outstanding = totalAmount - Number(column.amoutToPaid);
        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0 && totalAmount < selectBankBalance) {
          form.setFieldsValue({ outStanding: 0, amoutToPaid: totalAmount - 0 });
          notification.error({
            message:
              "The amount cannot be greater than the outstanding balance.",
          });
        }
        if (
          Number(column.amoutToPaid) > Number(selectBankBalance) &&
          selectBankBalance < totalAmount
        ) {
          form.setFieldsValue({
            outStanding: totalAmount - Number(selectBankBalance),
            amoutToPaid: Number(selectBankBalance) - 0,
          });
          notification.error({
            message: "The amount cannot be greater than the balance.",
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
              let foundProduct = saccountList.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );
              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index].quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? Number(foundProduct?.costprice)
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

              setqSuffix(foundProduct.unit);
              //setPStock(foundProduct.stock);
              if (
                column?.columns[index]?.discount > 0 &&
                item.quantity != null &&
                item.quantity !== 0 &&
                item.price != null &&
                item.price !== 0
              ) {
                const discountRate = Number(item.discount) / 100;
                discountAmount = Number(total * discountRate);
                total = price * quantity - discountAmount;
                discount = Number(item.discount);
                if (column?.columns[index]?.discount > 100) {
                  let disRate = 100 / 100;
                  discountAmount = total * disRate;
                  total = price * quantity - discountAmount;
                  discount = 100;
                  notification.error({
                    message:
                      "Discount cannot exceed the total amount of the invoice item",
                  });
                }
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
                  total = price * quantity - discountAmount;
                }
              }
              if (0 >= column?.columns[index]?.discountamt) {
                discount = 0;
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
                  ? Number(foundProduct.vat)
                  : Number(item.vat);
              let vatAmount =
                formValue.column?.columns.length > 1
                  ? formValue?.columns[index].vatamount
                  : // : Number(foundProduct.vatamt);
                    Number((foundProduct.vat * total) / 100);

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

              let newTotal = total;
              const updatedColumn = {
                id: item.id,
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
                    ? Number(foundProduct?.vat).toFixed(2)
                    : Number(item?.vat).toFixed(2),
                vatamount: vatAmount.toFixed(2),
                discountamt: discountAmount.toFixed(2),
                discount: discount.toFixed(2),
                total: newTotal.toFixed(2),
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
          let _totalAmount = _subTotal + _tatalVat ;
          // let roundedNumber = Math.round(_totalAmount);
          // let amountAdded = roundedNumber - _totalAmount;
          // setRoundOff(Number(amountAdded.toFixed(2)));
          // setTotalAmount(roundedNumber);
          setTotalAmount(_totalAmount);
        }
      }
    } catch (error) {
      // Handle the error
      console.log(error);
    }
  };

  const uploadImage = async (imagedata: any) => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("userid", user.id);
    formdata.append("file", imagedata, imagedata.name);
    let graphData_url = API.UPDATE_LOGO;
    const { data }: any = await POST2(graphData_url, formdata);

    if (data) {
      SetGetUserData(data.location);
      notification.success({
        message: "Upload Image",
        description: "Your  Image has been created successfully.",
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const onUpload = async (info: any) => {
    const { file } = info;
    console.log("image upload link ghere it is", info.file);
    if (file.status !== "uploading") {
      await uploadImage(file.originFileObj);
    }
  };

  const getInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      form.setFieldsValue({
        sdate: dayjs(new Date()),
        ldate: dayjs(new Date()),
      });

      let url = API.VIEW_PURCHASE_INVOICE + props?.id + "/stockassets";
      const getInvDetails: any = await GET(url, null);
      if (getInvDetails.status) {
        let initialValus = getInitialValues(getInvDetails?.data);
        form.setFieldsValue(initialValus);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  const getInitialValues = (data: any) => {
    try {
      if (data?.invoiceItems[0]?.ledger) {
        props?.getProduct(data?.invoiceItems[0]?.ledger);
      }
      setIsStateTax(
        data?.invoiceDetails?.supplier?.vat_number?.substring(0, 2) ===
          user?.companyInfo?.taxno?.substring(0, 2)
      );

      let _subTotal = 0;
      let _tatalVat = 0;
      let _overollDiscount = 0;
      let discountAmount: any = 0;
      let columns = data.invoiceItems.map((item: any) => {
        discountAmount = Number(item.discount_amount);
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
        // if (item.discount > 0) {
        //   const discountRate = item.discount / 100;
        //   discountAmount =
        //     item.includevat == 1
        //       ? Number(item.costprice) * Number(item.quantity) * discountRate
        //       : (Number(item.costprice) * Number(item.quantity) + vatAmount) *
        //       discountRate;
        // }
        //here total calculation

        _tatalVat = _tatalVat + vatAmount;
        _overollDiscount = _overollDiscount + discountAmount;
        return {
          id: item?.product?.id,
          hsn_code: item?.product?.hsn_code,
          sgst: Number(item.vatamt) / 2,
          cgst: Number(item.vatamt) / 2,
          igst: Number(item.vatamt),
          quantity: Number(item.quantity),
          price: Number(item.costprice),
          vatamt: Number(item.vatamt),
          description: item.product.idescription,
          vat: Number(item.vat),
          vatamount: Number(item.vatamt).toFixed(2),
          discount: Number(item.discount).toFixed(2),
          discountamt: Number(item.discount_amount),
          total: Number(item.total),
          includeVat: item.includevat == 1 ? true : false,
        };
      });

      const initialValue = {
        // invoiceno: data.invoiceDetails.invoiceno,
        seriesNo:data.invoiceDetails?.seriesNo,
        supplierid: data.invoiceDetails.supplierid,
        ledger: data?.invoiceItems[0]?.ledgerDetails?.nominalcode,
        sdate: dayjs(data?.invoiceDetails?.sdate),
        ldate: dayjs(data?.invoiceDetails?.ldate),
        reference: data?.invoiceDetails?.reference,
        columns: columns,
        inaddress: data?.invoiceDetails?.inaddress,
        deladdress: data?.invoiceDetails?.deladdress,
        terms: data?.invoiceDetails?.terms,
        quotes: data?.invoiceDetails?.quotes,
        outStanding:"",
      };
      setSubTotal(_subTotal);
      setTatalVat(_tatalVat);
      setOverolDiscount(_overollDiscount);
      // setRoundOff(Number(data?.invoiceDetails?.roundOff) || 0);
      let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
      setTotalAmount(_totalAmount);
      // let _totalAmount =
      //   _subTotal +
      //   _tatalVat +
      //   Number(data?.invoiceDetails?.roundOff) -
      //   _overollDiscount;
      return initialValue;
    } catch (error) {
        console.log(error)
      return {};
    }
  };

  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.AddPurchaseInvoice(Asset)")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Purchase_Invoice")}
        secondPathLink={"/usr/purchase-fore-assets"}
      >
        <div>
          <Button type="primary" onClick={() => setCreateAssetOpen(true)}>
            {t("home_page.homepage.Create_Asset")}
          </Button>
        </div>
      </PageHeader>
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
                <Form.Item
                  name={"invoiceno"}
                  rules={[
                    { required: true, message: "invoice number is required" },
                  ]}
                >
                  <Input size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.Business_Name")}
                </div>
                <Form.Item name={"supplierid"}>
                  <Select
                    size="large"
                    allowClear
                    onSearch={(val) => props.customerSearch(val)}
                    showSearch
                    filterOption={false}
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
              <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.Ledger")}{" "}
                </div>
                <Form.Item name={"ledger"}>
                  <Select size="large">
                    {props?.ledgers &&
                      props?.ledgers?.length &&
                      props?.ledgers?.map((item: any) => {
                        return (
                          <Select.Option  key={item.nominalcode} value={item.nominalcode} >
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
                  <DatePicker style={{ width: "100%" }} size="large" />
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
                      const financialYear =
                        user?.companyInfo?.financial_year_start;
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
            <Items
              form={form}
              products={saccountList}
              taxLists={props.taxList}
              isCheckChange={(val: any) => setIsCheck(val)}
              qSuffix={qSuffix}
              isStateTax={isStateTax}
            />
            <br />
            <Row>
              <Col sm={4}>
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
              <div style={{fontSize: window.innerWidth <= 411 ? "12px" : "" }}>{t("home_page.homepage.Record_Payment")}</div>
              <div>
                <Button
                  style={{ backgroundColor: "#ff9800", color: "#fff" }}
                  onClick={() => setIsPaymentInfo(!isPaymentInfo)}
                >
                  {isPaymentInfo ? "Close" : "+ Add"}{" "}
                  {window.innerWidth <= 411 ? (
                    ""
                  ) : (
                    <>{t("home_page.homepage.Payment")}</>
                  )}
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
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.choosethebank"),
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      style={{ width: "100%" }}
                      placeholder={t("home_page.homepage.selectpayment_bank")}
                    >
                      {props?.banks?.length &&
                        props?.banks?.map((item: any) => {
                          return (
                            <Select.Option
                              key={item.list.id}
                              value={item.list.id}
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
                      style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
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
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                )}

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
                    {t("home_page.homepage.AvailableBalance")} :
                  </div>
                  <Form.Item name={"availableBalance"} noStyle>
                    <Input
                      placeholder={t("home_page.homepage.AvailableBalance")}
                      readOnly
                      style={{ width: "100%" }}
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
                      style={{ width: "100%" }}
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
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={8}></Col>
                <Col sm={4}>
                  <div className="formLabel" style={{ marginTop: 10 }}>
                    {t("home_page.homepage.Paid_Method")} :
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
                      {t("home_page.homepage.Create")}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
      {customerCreate && (
        <CreateCutomerModal
          open={customerCreate}
          onCancel={() => setCustomerCreate(false)}
          customerSearch={props.customerSearch}
          type="supplier"
          customer={(val: any) => {
            form.setFieldsValue({ supplierid: Number(val.id) });
            setIsStateTax(
              val?.vat_number.substring(0, 2) ===
                user?.companyInfo?.taxno.substring(0, 2)
            );
          }}
        />
      )}

      {createAssetOpen && (
        <FixedAssetModal
          edit={"create"}
          setIsOpen={setCreateAssetOpen}
          isOpen={createAssetOpen}
        />
      )}
    </div>
  );
}
export default DuplicatePurchaseAsset;
