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
import { useLocation, useNavigate } from "react-router-dom";
import { GET, PUT } from "../../../utils/apiCalls";
import API from "../../../config/api";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import Items from "./item";
import moment from "moment";
import FixedAssetModal from "../../product/product-asset/FixedAssetModal";
import { useTranslation } from "react-i18next";
function Edit(props: any) {
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
  const [isPaymentInfo, setIsPaymentInfo] = useState<any>(false);
  const [isCheck, setIsCheck] = useState<any>(false);
  const [qSuffix, setqSuffix] = useState("");
  const [selectBankBalance, setSelectBankBalance] = useState(0);
  const [isStateTax, setIsStateTax] = useState(false);
  const [selectBank, setSlectedBank] = useState<any>({});
  const [paidedValue, setPaidedValue] = useState<any>({});
  const [defaltOutStanding, setDefaltOutStanding] = useState(0);
  const [locationData, setLocationData] = useState<any>([]);
  const [createAssetOpen, setCreateAssetOpen] = useState(false);
  const [pStock, setPStock] = useState(0);
  const location = useLocation();

  
  useEffect(() => {
    getInvoiceDetails();
    fetchLocations()
    form.setFieldsValue({
      terms: user?.companyInfo?.defaultTerms,
      quotes: user?.companyInfo?.cusNotes,
    });
  }, []);

  const onFinish = async (val: any) => {
    let amountPaid = Number(val.amoutToPaid) || 0;
    let totalPayable = Number(totalAmount);
    let outstanding = totalAmount - paidedValue;
    let status = details.status;
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

    setIsLoading(true);
    let paymentInfo = isPaymentInfo;
    if (isPaymentInfo) {
      paymentInfo = {
        id: val.paymentBank,
        bankid: val.paymentBank,
        outstanding: val.outStanding,
        amount: Number(val?.amoutToPaid) || 0,
        date: val?.paymentDate,
        type: val.paymentMethod,
        paidmethod: val.paymentMethod,
        running_total: Number(selectBankBalance) - Number(val?.amoutToPaid),
      };
    }

    try {
      let selectedSuplier =
        props?.customers &&
        props?.customers.length &&
        props?.customers?.find((item: any) => item.id === val.supplierid);

      let ledger =
        props?.ledgers &&
        props?.ledgers.length &&
        props?.ledgers?.find((item: any) => item.id === val.ledger);

      let totalSumQuantity = 0;
      let column = val?.columns?.map((item: any, index: number) => {
        let foundedProduct = props.product.find(
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
            category: "13",
            id: 2,
            laccount: "Sales-Services",
            nominalcode: "4001",
          };
        }
        totalSumQuantity = Number(totalSumQuantity) + Number(item.quantity);

        return {
          id: item.id,
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
        seriesNo:val?.seriesNo,
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
        seriesNo:val?.seriesNo,
        supplier: selectedSuplier,
        sname: selectedSuplier.name,
        supplierid: val.supplierid,
        columns: column,
        purchase: purchaseDeatails,
        invoiceno: val.invoiceno,
        sdate: val?.sdate,
        ldate: val?.ldate,
        inaddress: val?.inaddress,
        deladdress: val?.deladdress,
        quotes: val?.quotes,
        adminid: adminid,
        status: status,
        type: "stockassets",
        pagetype: "2",
        total: Number(totalAmount.toFixed(2)),
        userid: adminid,
        userdate: new Date(),
        attachDoc: "",
        attachImage: "",
        id: props.id,
        paymentInfo: paymentInfo,
        ledger: ledger,
        quantity: totalSumQuantity,
        outstanding,
        // roundOff: roundOff,
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
          description: "Purchase asset invoice updated successfully",
        });
        navigate(-1);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update purchase asset invoice",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update purchase asset invoice ",
      });
      setIsLoading(false);
    }
  };

  const getInvoiceNo = async (locationId:number) => {
    try {
      let invoiceurl =
        API.USER_SETTING_GETINVOICENO +
        props.adminid +
        `/${user?.companyInfo?.id}/${locationId}/Asset`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
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

  const getInvoiceDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.VIEW_PURCHASE_INVOICE + props?.id + "/stockassets";
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

  const onValuesChange = async (column: any, allarray: any) => {
    try {
      if (column.supplierid) {
        let selectedCustomer =
          props?.customers &&
          props?.customers?.length &&
          props?.customers?.find((item: any) => item.id === column.supplierid);
        setIsStateTax(selectedCustomer.state === user.companyInfo.state);
      }
      if (column?.columns?.length < 1) {
        setSubTotal(0);
        setTatalVat(0);
        setOverolDiscount(0);
        // setRoundOff(0);
        setTotalAmount(0);
      }
      if(column?.seriesNo){
        getInvoiceNo(column.seriesNo)
      }
      if (column.ledger) {
        await props.getProduct(column.ledger);
        form.setFieldsValue({ columns:[]});
      }
      let bankAvailableBalance = 0;
      let payingAmount = 0;
      if (column.paymentBank) {
        let selectedBank = props?.banks?.find(
          (item: any) => item.list.id === column.paymentBank
        );
        setSelectBankBalance(selectedBank.amount);
        payingAmount = Number(allarray.amoutToPaid) || 0;
        form.setFieldsValue({
          bicnum: selectedBank?.list?.bicnum,
          ibanNumber: selectedBank?.list?.ibannum,
          accountNumber: selectedBank?.list?.accnum,
          holderName: selectedBank?.list?.laccount,
          availableBalance: selectedBank?.amount,
          outStanding: Number(totalAmount) - payingAmount,
          paymentMethod: selectedBank?.list?.laccount === "Cash" ? "cash" : "",
        });
        bankAvailableBalance = selectedBank?.amount;
      }

      if (column.amoutToPaid) {
        let outstanding =
          totalAmount - paidedValue - Number(column.amoutToPaid);
        let unPaidOutstanding = Number(totalAmount) - Number(paidedValue);
        form.setFieldsValue({ outStanding: outstanding });
        if (outstanding < 0 && unPaidOutstanding < Number(selectBankBalance)) {
          form.setFieldsValue({
            outStanding: 0,
            amoutToPaid: totalAmount - paidedValue,
          });
          notification.error({
            message:
              "The amount cannot be greater than the outstanding balance.",
          });
        }
        if (
          Number(column.amoutToPaid) > Number(selectBankBalance) &&
          Number(selectBankBalance) < unPaidOutstanding
        ) {
          form.setFieldsValue({
            outStanding:
              Number(totalAmount) - Number(paidedValue) - selectBankBalance,
            amoutToPaid: selectBankBalance - 0,
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
          outStanding: totalAmount - paidedValue - 0,
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
              setPStock(foundProduct.stock);

              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item.quantity || 1
                  : column?.columns[index].quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? Number(foundProduct?.costprice)
                  : item?.price;
              let total = price * quantity - discountAmount;

              let vatPercent =
                item?.vat === undefined ||
                item?.vat === null ||
                item?.vat === ""
                  ? Number(foundProduct.vat)
                  : Number(item.vat);
              let vatAmount = Number(foundProduct.vatamt);
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
                if (foundProduct.includevat === "1.00") {
                  includeVat = item.includeVat === false ? false : true || true;
                } else {
                  includeVat = item.includeVat || false;
                }
              } else {
                includeVat = selectedIncludeVat;
              }
              const updatedColumn = {
                id: item.id,
                hsn_code: foundProduct.hsn_code,
                sgst: Number(vatAmount)/2,
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
                incomeTaxAmount: foundProduct?.vatamt,
                vatamt: foundProduct?.vatamt,
                description: foundProduct?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? foundProduct?.vat
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
        let _totalAmount = _subTotal + _tatalVat 
        // let roundedNumber = Math.round(_totalAmount);
        // let amountAdded = roundedNumber - _totalAmount;
        // setRoundOff(Number(amountAdded.toFixed(2)));
        // setTotalAmount(roundedNumber);
        setTotalAmount(_totalAmount);
        if (column.columns) {
          setIsPaymentInfo(false);
          form.setFieldsValue({
            bicnum: null,
            ibanNumber: null,
            accountNumber: null,
            holderName: null,
            availableBalance: null,
            outStanding: Number(_totalAmount) - Number(paidedValue),
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
      let columns = data?.invoiceItems?.map((item: any) => {
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
        seriesNo:data?.invoiceDetails?.seriesNo,
        invoiceno: data.invoiceDetails.invoiceno,
        supplierid: data.invoiceDetails.supplierid,
        ledger: data?.invoiceItems[0]?.ledger,
        sdate: dayjs(data?.invoiceDetails?.sdate),
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
      setOverolDiscount(_overollDiscount);
      // setRoundOff(Number(data?.invoiceDetails?.roundOff) || 0);
      let _totalAmount = _subTotal + _tatalVat - _overollDiscount;
      // let _totalAmount =
      //   _subTotal +
      //   _tatalVat +
      //   Number(data?.invoiceDetails?.roundOff) -
      //   _overollDiscount;
      setTotalAmount(_totalAmount);
      setDefaltOutStanding(
        _totalAmount -
          (_totalAmount - Number(data?.invoiceDetails?.outstanding))
      );
      setPaidedValue(_totalAmount - Number(data?.invoiceDetails?.outstanding));
      return initialValue;
    } catch (error) {
      console.log(error)
      return {};
    }
  };
  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.UpdatePurchase_Asset")}
        goBack={"/dashboard"}
        firstPathText={t("home_page.homepage.Purchase_Asset")}
        firstPathLink={"/usr/purchase-fore-assets"}
        secondPathText={t("home_page.homepage.UpdatePurchase_Asset")}
        secondPathLink={location.pathname}
      >
        <div>
          <Button
            type="primary"
            // onClick={() => navigate(`/usr/create-product/Asset/create`)}
            onClick={() => setCreateAssetOpen(true)}
          >
            {t("home_page.homepage.Create_Asset")}
          </Button>
        </div>
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
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col sm={3}>
                  <div className="formLabel">
                    {t("home_page.homepage.Business_Name")}
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
                              {item?.nominalcode + "-" + item?.laccount}
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
              </Row>
              <Items
                form={form}
                products={props.product}
                taxLists={props.taxList}
                isCheckChange={(val: any) => setIsCheck(val)}
                qSuffix={qSuffix}
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
              <div className="salesInvoice-SubHeader">
                <div>{t("home_page.homepage.Record_Payment")}</div>
                <div>
                  <Button
                    style={{ backgroundColor: "#ff9800", color: "#fff" }}
                    onClick={() => setIsPaymentInfo(!isPaymentInfo)}
                  >
                    {isPaymentInfo ? "Close" : "+ Add"}{" "}
                    {t("home_page.homepage.Payment")}
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
                            (item: any) => item.list.id === val
                          );
                          setSlectedBank(bank);
                        }}
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
                  )}{" "}
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
                          message: t("home_page.homepage.AmountToBePaid"),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder={t("home_page.homepage.AmountToBePaid")}
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
                          {user?.companyInfo?.isOtherTerritory ? (
                            <tr>
                              <td>{t("home_page.homepage.TOTAL_IGST")}</td>
                              <td>{tatalVat?.toFixed(2)}</td>
                            </tr>
                          ) : (
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
                              _totalAmount = _totalAmount - round;
                              setTotalAmount(_totalAmount);
                            }}
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
export default Edit;
