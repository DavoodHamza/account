import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Col, Row, Table } from "react-bootstrap";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/pageHeader";
import StockTransferItems from "./items";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import dayjs from "dayjs";
import ExtraCharges from "./extraCharges";
import { useTranslation } from "react-i18next";
const StockTransferForm = (props: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>();
  const [productsData, setProductsData] = useState<any>();
  const [ledgersData, setLedgersData] = useState<any>();
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [bankData, setBankData] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLocations();
    fetchBankList();
    id !== "create" && fetchInitialData();
  }, []);

  const getInvoiceNo = async (locationId: number) => {
    try {
      let invoiceurl =
        "user_settings/getInvoiceNo/" +
        user?.id +
        `/${user?.companyInfo?.id}/${locationId}/stockTransfer`;
      const { data: voucherNo }: any = await GET(invoiceurl, null);
      form.setFieldsValue({
        voucherNo: voucherNo,
      });
    } catch (error) {
      console.log(error)
    }
  };

  const fetchLocations = async () => {
    try {
      setIsDataLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setLocationData(data);
      if(id === "create"){
        form.setFieldsValue({locationFrom:data[0]?.id})
        fetchProductsByLocation(data[0]?.id);
        getInvoiceNo(data[0]?.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchProductsByLocation = async (id: number) => {
    try {
      let url = API.GET_PRODUCTS_BY_LOCATION + id;
      const response: any = await GET(url, null);
      if (response.status) {
        setProductsData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);
      setBankData(data?.bankList);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      let url = API.VIEW_STOCK_TRANSFER + id;
      const response: any = await GET(url, null);
      if (response.status) {
        let initialData = response.data;
        form.setFieldsValue({
          seriesNo: initialData?.seriesNo,
          voucherNo: initialData?.voucherNo,
          transferDate: dayjs(initialData?.transferDate),
          locationFrom: initialData?.locationFrom,
          locationTo: initialData?.locationTo,
          reference: initialData?.reference,
          items: initialData?.itemDetails,
          charges: initialData?.charges,
        });
        fetchProductsByLocation(initialData?.locationFrom);
        setTotalQuantity(initialData?.totalQuantity);
        setTotalAmount(initialData?.totalAmount);
        let totalPrice =
          Number(initialData?.totalAmount) - Number(initialData?.totalCharge);
        setTotalPrice(totalPrice);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onValuesChange = (column: any, allValues: any) => {
    const { items, charges } = allValues;
    let totalItemsPrice = 0;
    let totalQty = 0;
    let totalAmt = 0;

    if (column.locationFrom) {
      fetchProductsByLocation(column.locationFrom);
    }
    if (column.seriesNo) {
      getInvoiceNo(column.seriesNo);
    }

    if (items && Array.isArray(items)) {
      const updatedItems = items.map((item: any, index: number) => {
        if (item && item.id !== null) {
          let totalPrice = 0;
          let qty = 1;
          let price = 0;
          let unit = "";
          let productId: any;
          let productName = "";
          let foundProduct = productsData?.find(
            (product: any) =>
              Number(product?.productId) === Number(item.productId)
          );
          productId = foundProduct?.productId;
          productName = foundProduct?.productName;
          qty = Number(item?.qty) || 0;
          unit = foundProduct?.productDetails?.unitDetails?.unit; 
          price = Number(foundProduct?.productDetails?.costprice) || 0;
          const itemTotal = Number(qty) * Number(price);
          totalPrice += itemTotal;
          totalItemsPrice += itemTotal;
          totalQty += qty;
          totalAmt += itemTotal;

          setTotalQuantity(Number(qty));

          return {
            productId: productId,
            productName: productName,
            unit: unit,
            qty: Number(qty),
            price: Number(price),
            total: Number(totalPrice),
          };
        } else {
          return {};
        }
      });
      form.setFieldsValue({ items: updatedItems });
    }

    if (charges && Array.isArray(charges)) {
      const updatedCharges = charges.map((charge: any, index: number) => {
        if (charge && charge.id !== null) {
          let totalCharge = 0;
          let ledgerId: any;
          let ledgerName = "";
          let paidFrom: any;
          let paidBank = "";

          let foundedLedger = ledgersData?.find(
            (ledger: any) => Number(ledger?.id) === Number(charge.ledgerId)
          );
          let foundedBank = bankData?.find(
            (item: any) => Number(item?.list?.id) === Number(charge.paidFrom)
          );
          ledgerId = foundedLedger?.id;
          ledgerName = foundedLedger?.laccount;
          paidFrom = foundedBank?.list?.id;
          paidBank = foundedBank?.list?.laccount;
          totalCharge = Number(charge?.amount) || 0;
          totalAmt += totalCharge;

          return {
            ledgerId: ledgerId,
            paidFrom:paidFrom,
            paidBank:paidBank,
            ledgerName: ledgerName,
            amount: Number(totalCharge),
            notes: charge?.notes,
          };
        } else {
          return {};
        }
      });
      form.setFieldsValue({ charges: updatedCharges });
    }

    setTotalPrice(totalItemsPrice);
    setTotalQuantity(totalQty);
    setTotalAmount(totalAmt);
  };

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const obj = {
        seriesNo: values?.locationFrom,
        voucherNo: values?.voucherNo,
        transferDate: values?.transferDate,
        reference: values?.reference,
        locationTo: values?.locationTo,
        locationFrom: values?.locationFrom,
        itemDetails: values?.items,
        companyId: user?.companyInfo?.id,
        charges: values?.charges,
        totalQuantity: Number(totalQuantity),
        totalCharge: Number(totalAmount) - Number(totalPrice),
        totalAmount: Number(totalAmount),
      };
      let url = id === "create"
          ? API.CREATE_STOCK_TRANSFER
          : API.VIEW_STOCK_TRANSFER + id;
      const response: any =
        id === "create" ? await POST(url, obj) : await PUT(url, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `Stock transfer ${
            id === "create" ? "created" : "updated"
          } successfully`,
        });
        navigate("/usr/stock-transfer");
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            id === "create" ? "create" : "update"
          } stock transfer `,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed",
        description: `Failed to ${
          id === "create" ? "create" : "update"
        } stock transfer `,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLedgers = async () => {
    try {
      const url = API.EXPENSE_LEDGER_LIST + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setLedgersData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  return (
    <>
      <PageHeader
        firstPathLink={"/usr/stock-transfer"}
        firstPathText={t("home_page.homepage.stock_transfer")}
        secondPathLink={location?.pathname}
        secondPathText={ id === "create" ? t("home_page.homepage.create_stock_transfer") : t("home_page.homepage.update_stock_transfer")}
        title= { id === "create" ? t("home_page.homepage.create_stock_transfer") : t("home_page.homepage.update_stock_transfer")}
      />
      {isDataLoading ? (
        <LoadingBox />
      ) : (
        <div className="adminTable-Box1">
          <Card>
            <Form
              onFinish={submitHandler}
              layout="vertical"
              form={form}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Col md={4}>
                  <div className="formLabel">
                    {t("home_page.homepage.seriesNo")}
                  </div>
                  <Form.Item
                    name={"locationFrom"}
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
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Voucher_No")}</label>
                  <Form.Item
                    name="voucherNo"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Voucher No"
                      size="large"
                      className="input-field"
                      style={{ width: "100%" }}
                      readOnly
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel"> {t("home_page.homepage.date")}</label>
                  <Form.Item
                    name="transferDate"
                    style={{ marginBottom: 10 }}
                    rules={[{ required: true }]}
                  >
                    <DatePicker
                      placeholder="Date"
                      size="large"
                      style={{ width: "100%" }}
                      // defaultValue={dayjs(new Date())}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Location_from")}</label>
                  <Form.Item
                    name="locationFrom"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: "from",
                      },
                    ]}
                  >
                    <Select
                      placeholder="from"
                      showSearch={true}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      size="large"
                    >
                      {locationData &&
                        locationData?.map((location: any) => (
                          <Select.Option key={location.id} value={location.id}>
                            {location?.location}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">{t("home_page.homepage.Location_to")}</label>
                  <Form.Item
                    name="locationTo"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: `to`,
                      },
                    ]}
                  >
                    <Select
                      placeholder="to"
                      showSearch={true}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      size="large"
                    >
                      {locationData &&
                        locationData?.map((location: any) => (
                          <Select.Option key={location.id} value={location.id}>
                            {location?.location}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel"> {t("home_page.homepage.Reference_db")}</label>
                  <Form.Item name="reference" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder={t("home_page.homepage.Reference_db")}
                      size="large"
                      className="input-field"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <StockTransferItems
                form={form}
                productsData={productsData} 
                totalQuantity={totalQuantity}
                totalPrice={totalPrice}
              />
              <br />
              <ExtraCharges
                form={form}
                ledgersData={ledgersData}
                bankData={bankData}
                setSearchQuery={setSearchQuery}
              />
              <br />

              <Row>
                <Col sm={6}></Col>
                <Col sm={6}>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <td>
                          <strong>
                            {t("home_page.homepage.TOTAL_COST")}
                          </strong>
                        </td>
                        <td>
                          <strong>{totalAmount - totalPrice}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row>
                <Col md={6} />
                <Col md={3}>
                  <br />
                  <Button
                    size="large"
                    type="default"
                    onClick={() => navigate(-1)}
                    block
                  >
                    {t("home_page.homepage.Close")}
                  </Button>
                </Col>
                <Col md={3}>
                  <br />
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    block
                  >
                    {id === "create" ? t("home_page.homepage.submit") : "Update"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
          <br />
        </div>
      )}
    </>
  );
};

export default StockTransferForm;
