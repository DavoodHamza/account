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

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET, POST } from "../../../../utils/apiCalls";
import PageHeader from "../../../../components/pageHeader";
import Items from "./items";
import API from "../../../../config/api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { GoPlus } from "react-icons/go";
import CreateCutomerModal from "../../../../components/contactCreateModal";
import ProductAddModal from "../../../../components/productCreateModal";
import { useTranslation } from "react-i18next";

function CreatePurchaseOrder(props: any) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const adminid = user?.id;
  const [subTotal, setSubTotal] = useState(0);
  const [tatalVat, setTatalVat] = useState(0);
  // const [roundOff, setRoundOff] = useState(0);
  const [overollDiscount, setOverolDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [qSuffix, setqSuffix] = useState("");
  const [pStock, setPStock] = useState(0);
  const [coustomerCreate, setCoustomerCreate] = useState<any>(false);
  const [productCreate, setProductCreate] = useState<any>(false);
  const [ledgerId, setLedgerId] = useState<any>(12);
  const [locationData, setLocationData] = useState<any>([]);
  const [isStateTax, setIsStateTax] = useState(false);

  useEffect(() => {
    fetchLocations();
    form.setFieldsValue({
      sdate: dayjs(new Date()),
      ldate: dayjs(new Date()),
      quotes: user?.companyInfo?.cusNotes,
      paymentDate: dayjs(new Date()),
    });
  }, []);

  const getInvoiceNo = async (locationId: number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user?.id +
        `/${user?.companyInfo?.id}/${locationId}/order`;
      const { data: invnumber }: any = await GET(invoiceurl, null);
      form.setFieldsValue({
        invoiceno: invnumber,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (val: any) => {
    try {
      if (Number(totalAmount) === 0) {
        notification.error({
          message: <h6>You cannot create an invoice without a price.</h6>,
        });
      } else {
        if (!val?.columns || !val?.columns?.length) {
          notification.error({ message: <h6>Add items to invoice</h6> });
          return;
        }
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

        let selectedSuplier =
          props.customers &&
          props.customers.length &&
          props?.customers?.find((item: any) => item.id === val.supplierid);

        let ledger =
          props?.ledgers &&
          props?.ledgers?.length &&
          props?.ledgers?.find((item: any) => item.id === 12);

        let totalSumQuantity = 0;
        let column = val.columns.map((item: any, index: number) => {
          let foundedProduct = props?.products?.find(
            (product: any) => product?.id === item?.id
          );

          let productLedger = {};
          let itemId;
          let iDescription;
          let itemDetails;
          let locationRef;

          if (
            foundedProduct?.productDetails?.itemtype === "Stock" ||
            foundedProduct?.productDetails?.itemtype === "Nonstock"
          ) {
            productLedger = {
              category: "6",
              id: 12,
              laccount: "Cost of Sales-goods",
              nominalcode: "5000",
            };
            itemId = foundedProduct?.productId;
            iDescription = foundedProduct.productDetails.idescription;
            itemDetails = foundedProduct?.productDetails;
            locationRef = foundedProduct?.id;
          } else {
            if (foundedProduct?.itemtype === " Service") {
              productLedger = {
                category: "14",
                id: 20835,
                laccount: "Cost of Sales-Service",
                nominalcode: "5001",
              };
              itemId = item?.id;
              iDescription = foundedProduct.idescription;
              itemDetails = foundedProduct;
              locationRef = null;
            }
          }
          totalSumQuantity = Number(totalSumQuantity) + Number(item.quantity);
          return {
            id: itemId,
            productLocationRef: locationRef,
            discount: item.discount,
            discountamt: item.discountamt,
            productId: itemId,
            product: itemDetails,
            idescription: iDescription,
            description: iDescription,
            vat: item?.vat,
            includevat: item?.includeVat,
            incomeTax: item?.vat,
            percentage: item.discount,
            costprice: item.price,
            ledgerDetails: productLedger,
            ledger: productLedger,
            quantity: item.quantity,
            total: item?.total,
            vatamt: item.vatamount,
            vatamount: item.vatamount,
            incomeTaxAmount: item.vatamount,
            itemorder: index + 1,
          };
        });

        let purchaseDeatails = {
          seriesNo: val?.seriesNo,
          sdate: val?.sdate,
          ldate: val?.ldate,
          invoiceno: val.invoiceno,
          inaddress: val?.inaddress,
          deladdress: val?.deladdress,
          total: val.total,
          quotes: val?.quotes,
          status: status,
          refid: null,
        };

        let payload = {
          seriesNo: val?.seriesNo,
          supplier: selectedSuplier,
          pList: column,
          purchase: purchaseDeatails,
          reference: val?.reference,
          invoiceno: val.invoiceno,
          sdate: val?.sdate,
          ldate: val?.ldate,
          inaddress: val?.inaddress,
          deladdress: val?.deladdress,
          terms: val?.terms,
          quotes: val?.quotes,
          adminid: adminid,
          status: status,
          issued: "yes",
          type: "order",
          pagetype: "1",
          total: Number(totalAmount?.toFixed(2)),
          userid: adminid,
          userdate: new Date(),
          attachDoc: "",
          attachImage: "",
          ledger: ledger,
          refid: null,
          quantity: totalSumQuantity,
          total_vat: tatalVat,
          overall_discount: overollDiscount,
          taxable_value: subTotal,
          createdBy: user?.isStaff ? user?.staff?.id : adminid,
          companyid: user?.companyInfo?.id,
          usertype: user?.isStaff ? "staff" : "admin",
        };
        // let purchaceUrl = user?.isStaff
        //   ? "purchaseinvoice/add/staff_create_purchase"
        //   : API.PURCHASE_INVOICE_ADD;
        let purchaceUrl = API.PURCHASE_INVOICE_ADD;
        const response: any = await POST(purchaceUrl, payload);
        if (response.status) {
          setIsLoading(false);
          notification.success({
            message: "Success",
            description: "Purchase order created successfully",
          });
          navigate(-1);
        } else {
          notification.error({
            message: "Failed",
            description: "Failed to create purchse order",
          });
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setLocationData(data);
      form.setFieldsValue({ seriesNo: data[0]?.id });
      getInvoiceNo(data[0]?.id)
      props.getProduct("both", data[0]?.id);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
          props?.customers?.find(
            (item: any) => item?.id === column?.supplierid
          );
        setIsStateTax(
          selectedCustomer?.vat_number?.substring(0, 2) ===
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

      if (column?.seriesNo) {
        getInvoiceNo(column?.seriesNo);
        props.getProduct("both", column?.seriesNo);
        form.setFieldsValue({ columns: [] });
      }

      if (allarray?.columns && allarray?.columns?.length) {
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
              let foundProduct = props?.products?.find(
                (product: any) => Number(product?.id) === Number(item.id)
              );

              let quantity =
                column?.columns[index]?.quantity === undefined
                  ? item?.quantity || 1
                  : column?.columns[index]?.quantity;
              let price =
                item?.price === undefined || item?.price === null
                  ? ledgerId === 12
                    ? Number(foundProduct?.productDetails?.rate)
                    : Number(foundProduct?.rate)
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
                ledgerId === 12
                  ? foundProduct?.productDetails?.unitDetails
                  : foundProduct?.unitDetails;
              setqSuffix(unitDetails);
              setPStock(foundProduct?.stock);
              total = price * quantity - discountAmount;
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
                  discountAmount = price * quantity * disRate;
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
                  item.price !== 0 &&
                  item.price !== null
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
                  ? ledgerId === 12
                    ? Number(foundProduct.productDetails?.vat)
                    : Number(foundProduct?.vat)
                  : Number(item?.vat);
              let vatAmount =
                formValue.column?.columns?.length > 1
                  ? formValue?.columns[index]?.vatamount
                  : Number((vatPercent * total) / 100);

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
                (ledgerId === 12
                  ? foundProduct.productDetails?.includevat === "1.00"
                  : foundProduct?.includevat === "1.00") &&
                selectedIncludeVat === false
              ) {
                notification.error({
                  message: "VAT Inclusion Warning",
                  description: "This product is priced inclusive of VAT",
                });
              }

              if (selectedIncludeVat === undefined) {
                if (
                  ledgerId === 12
                    ? foundProduct.productDetails?.includevat === "1.00"
                    : foundProduct?.includevat === "1.00"
                ) {
                  includeVat =
                    item?.includeVat === false ? false : true || true;
                } else {
                  includeVat = item?.includeVat || false;
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
                hsn_code:
                  ledgerId === 12
                    ? foundProduct?.productDetails?.hsn_code
                    : foundProduct?.hsn_code,
                gst: item.gst,
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
                description:
                  ledgerId === 12
                    ? foundProduct?.productDetails?.idescription
                    : foundProduct?.idescription,
                vat:
                  item?.vat === undefined || item?.vat === null
                    ? ledgerId === 12
                      ? Number(foundProduct?.productDetails?.vat)
                      : Number(foundProduct?.vat)
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
          //let roundedNumber = Math.round(_totalAmount);
          //let amountAdded = roundedNumber - _totalAmount;
          //setRoundOff(Number(amountAdded.toFixed(2)));
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
        title={t("home_page.homepage.CreatePurchaseOrder")}
        goBack={"/dashboard"}
        secondPathText={t("sidebar.title.purchace_order")}
        secondPathLink={"/usr/purchase-order"}
        thirdPathText={t("home_page.homepage.CreatePurchaseOrder")}
        thirdPathLink={`/usr/purchase-order-form/${0}`}
      />
      <br />
      <Container>
        <Card>
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col sm={2}>
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
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.invoice_no")}
                </div>
                <Form.Item
                  name={"invoiceno"}
                  rules={[{ required: true, message: "Type invoice" }]}
                >
                  <Input size="large" style={{ width: "100%" }} readOnly />
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
                      message: t("home_page.homepage.chooseBusiness"),
                    },
                  ]}
                >
                  <Select
                    size="large"
                    allowClear
                    onSearch={(val) => props?.customerSearch(val)}
                    showSearch
                    filterOption={false}
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
              {/* <Col sm={3}>
                <div className="formLabel">
                  {t("home_page.homepage.ledger")}
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
              </Col> */}
              <Col sm={2}>
                <div className="formLabel">
                  {t("home_page.homepage.invoice_date")}
                </div>
                <Form.Item name={"sdate"}>
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
              products={props?.products}
              taxLists={props.taxList}
              qSuffix={qSuffix}
              stock={pStock}
              productModal={(val: any) => setProductCreate(val)}
              isStateTax={isStateTax}
              ledgerId={ledgerId}
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
                      <td>{t("home_page.homepage.TAXABLE_VALUE")}</td>
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
      {coustomerCreate ? (
        <CreateCutomerModal
          open={coustomerCreate}
          onCancel={() => setCoustomerCreate(false)}
          customerSearch={props?.customerSearch}
          type="supplier"
          customer={(val: any) => {
            form.setFieldsValue({ supplierid: Number(val?.id) });
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
            props.getProduct(ledgerId === 12 ? "both" : "Service")
          }
          type={ledgerId === 12 ? "Nonstock" : "Service"}
        />
      ) : null}
    </div>
  );
}
export default CreatePurchaseOrder;
