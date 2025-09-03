import { Button, Modal, Pagination, Tabs, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import RetailExpressPaymentmodal from "../components/RetailExpressPaymentModal/printModal";
import LoadingBox from "../components/loadingBox";
import PrintModal from "../components/printModal/printModal";
import API from "../config/api";
import {
  addCartProducts,
  addHoldProduct,
  addProductQuantity,
  addProducts,
  clearHoldProducts,
  clearProduct,
  minusProductQuantity,
  removeHoldProduct,
  removeProducts
} from "../redux/slices/retailExpress";
import { Store } from "../redux/store";
import { GET, POST } from "../utils/apiCalls";
import CounterModal from "./components/counterModal";
import Header from "./components/header";
import HoldInvoice from "./components/hold";
import ListItem from "./components/listItem";
import ProductItem from "./components/productItem";
import QRScannerModal from "./components/scaner";
import { printTemplate } from "./components/templates";
import "./styles.scss";

function RetailExpress() {
  const { user } = useSelector((state: any) => state.User);
  const { counter } = useSelector((state: any) => state.retailExpress);
  const dispatch = useDispatch();

  let products: any = Store.getState().retailExpress.products;
  let productsStock: any = Store.getState().retailExpress.holdProducts;

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const [categories, setCategories] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [isChange, setIsChange] = useState<any>(false);
  const [product, setProduct] = useState();
  const [category, setCategory] = useState(0);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [selectBank, setSlectedBank] = useState<any>([]);
  const [loding, setLoading] = useState<any>(false);
  const [btLoding, setBtLoading] = useState<any>(false);
  const [totalQuatity, setTotalQuatity] = useState<any>(false);
  const [ledgers, setLedgers] = useState([]);
  const [counterList, setCounterList] = useState([]);
  const [template, setTemplate] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [counterSearch, setCounterSearch] = useState('');
  const [counterModal, setCounterModal] = useState(false);
  const [counterDetails, setCounterDetails] = useState({});

  const functoinCallig = async () => {
        await fetchStaffDifineCounterDetails()
    await fetchStaffCounterList()
    await getDatas();
    await getCategories();
    await getInvoiceNo()
    await getBankList()
    await calculation()
    await getLedgers()
  }

  useEffect(() => {
    functoinCallig()
  }, [category, product, page]);

  const calculation = () => {
    try {
      let taxAmount_: any = 0;
      let totalQuatity: any = 0;
      setIsChange(true);
      const sumOfProducts = products.reduce((acc: any, item: any) => {
        totalQuatity += item.quantity_no
        const total = Number(item.rate) * Number(item.quantity_no);
        const taxAmount = Number(item?.vatamt) * Number(item.quantity_no);
        let newTaxAmount: any = taxAmount
        taxAmount_ += newTaxAmount;
        const finalPrice =
          item.includevat == "1.00"
            ? Number(total) - Number(newTaxAmount)
            : Number(total);
        return acc + finalPrice;
      }, 0);
      setTotalQuatity(totalQuatity)
      setTotal(sumOfProducts);
      setTax(taxAmount_);
      setTimeout(() => {
        setIsChange(false);
      }, 1);
    } catch (error) {
      console.log(error)
    }
  };

  const getCategories = async () => {
    try {
      const url = API.PRODUCTCATEGORY_LIST_USER + user?.id + '/' + user?.companyInfo?.id;
      const response: any = await GET(url, {});
      if (response?.length) {
        var data: any = [{ key: 0, label: "All Products" }];
        response?.map((item: any) => {
          let obj = { key: item?.category, label: item?.category };
          data.push(obj);
        });
        setCategories(data);
      }
    } catch (error) { }
  };

  const getDatas = async (val?: any) => {
    try {
      if (!val) {
        setLoading(true)
      }
      let body =
      {
        id: user?.id,
        type: "Stock",
        category: category,
        name: val ? 0 : product,
        barcode: val,
      }
      const url = `retail/productlist?order=DESC&page=${page}&take=8`;
      const responce: any = await POST(url, body);
      responce.data.forEach((item: any) => {
        item["selection"] = false;
      });
      if (responce.data.length) {
        if (val) {
          return responce.data
        } else {
          setData(responce.data);
          setMeta(responce?.meta);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const handleAddToCart = (item: any) => {
    const findInd = products.findIndex((val: any) => val.id === item.id);
    if (findInd >= 0) {
      dispatch(addProductQuantity(products[findInd].id))
      products = Store.getState().retailExpress.products;
      calculation();
    } else {
      if (!item.quantity_no) {
        item["quantity_no"] = 1;
      }
      dispatch(addProducts(item));
      products = Store.getState().retailExpress.products;
      calculation();
    }
  };

  const handleClearCart = () => {
    if (products.length) {
      dispatch(clearProduct([]));
      products = Store.getState().retailExpress.products;
      notification.success({ message: "Cart cleared successfully" });
      calculation();
    } else {
      notification.error({ message: "No items in the cart." });
    }
  };

  const clearAtIndex = (id: any) => {
    dispatch(removeProducts(id));
    products = Store.getState().retailExpress.products;
    calculation();
  };

  const add = (val: any) => {
    setIsChange(true)
    dispatch(addProductQuantity(val));
    products = Store.getState().retailExpress.products;
    setTimeout(() => {
      setIsChange(false);
      calculation();
    }, 1);
  }

  const mainus = (val: any) => {
    setIsChange(true)
    dispatch(minusProductQuantity(val));
    products = Store.getState().retailExpress.products;
    setTimeout(() => {
      setIsChange(false);
      calculation();
    }, 1);
  }

  const getInvoiceNo = async () => {
    try {
      let invoiceurl = "user_settings/getInvoiceNo/" + user?.id + "/sales";
      const { data: invnumber }: any = await GET(invoiceurl, null);
      setInvoiceNumber(invnumber);
    } catch (error) { }
  };

  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + user?.id;
      const { data: bank }: any = await GET(url, null);
      const filterData = bank.find((item: any) => item.id == 1)
      setLedgers(filterData);
    } catch (error) { }
  };
  const handleSubmit = async (val?: any) => {
    try {
      setBtLoading(true)
      let paymentInfo = {
        id: val.paymentBank,
        bankid: val.paymentBank,
        outstanding: val.outStanding,
        amount: val.amoutToPaid.toString(),
        date: dayjs(new Date(), "YYYY-MM-DD"),
        type: val.paymentMethod,
        paidmethod: val.paymentMethod,
      };

      let column = products.map((item: any, index: number) => {
        let foundedProduct = data.find(
          (product: any) => product.id == item.id
        );
        let productTotal = 0
        let productVat = 0
        if (item.includevat == '1.00') {
          const total = Number(item.rate) * Number(item.quantity_no);
          const taxAmount = (Number(total) / (100 + item.vat)) * 100;
          productVat = Number(total) - Number(taxAmount);
          productTotal = total
        } else {
          const total = Number(item.rate) * Number(item.quantity_no);
          const taxAmount = (Number(total) / (100 + item.vat)) * 100;
          productVat = Number(total) - Number(taxAmount);
          productTotal = total + productVat
        }

        let productLedger = {
          category: "13",
          id: 1,
          laccount: "Sales-Products",
          nominalcode: "4000",
        };

        return {
          id: item.id,
          discount: '0.00',
          discountamt: '0.00',
          productId: item.id,
          product: foundedProduct,
          idescription: foundedProduct.idescription,
          description: foundedProduct.idescription,
          vat: item.vat,
          includevat: item.includevat == '1.00' ? true : false,
          incomeTax: item.vat,
          percentage: item.vat,
          costprice: item.rate,
          ledgerDetails: productLedger,
          ledger: productLedger,
          quantity: Number(item.quantity_no.toFixed(2)),
          total: productTotal.toFixed(2),
          vatamt: item.vat,
          vatamount: productVat.toFixed(2),
          incomeTaxAmount: productVat.toFixed(2),
          price: item.includevat == '1.00' ? (item.rate - Number(productVat)).toFixed(2) : item.rate,
          itemorder: index + 1,
        };
      });
      let amountPaid = Number(val?.amoutToPaid) || 0;
      let totalPayable: any = (total + tax).toFixed(2);
      let outstanding = totalPayable - amountPaid;
      let paidStatus: any = "0";
      if (outstanding <= 0) {
        paidStatus = "2";
      } else if (outstanding < totalPayable) {
        paidStatus = "1";
      } else if (outstanding >= totalPayable) {
        paidStatus = "0";
      }

      let obj = {
        cname: user?.staff?.name,
        customerid: user?.staff?.id,
        columns: column,
        invoiceno: invoiceNumber,
        sdate: new Date,
        ldate: new Date,
        inaddress: "__",
        deladdress: "__",
        terms: user?.companyInfo?.defaultTerms,
        quotes: user?.companyInfo?.cusNotes,
        status: paidStatus,
        issued: "yes",
        type: "sales",
        pagetype: "1",
        total: Number((total + tax).toFixed(2)),
        userid: user?.id,
        adminid: user?.id,
        userdate: new Date,
        paymentInfo: paymentInfo,
        reference: '',
        salesType: "",
        ledger: ledgers,
        email: user.email,
        reccObj: {},
        total_vat: Number(tax.toFixed(2)),
        overall_discount: 0,
        taxable_value: Number(total.toFixed(2)),
        saletype: 'retail Xpress',
        counterid: Number(counter?.counter_id),
        paymethod: val.paymentMethod == 'cash' ? 'cash' : 'bank',
        companyid: user?.companyInfo?.id,
        createdBy: user?.staff?.id
      }
      let URL = 'SaleInvoice/add/staff_create_sale'
      const { data: createRetail, status, message }: any = await POST(URL, obj);
      let templateObj = {
        ...obj,
        payReturn: val.payReturn,
        toPaidAmount: val.toPaidAmount,
        CASHIER: user?.staff?.name,
        DATE: dayjs().format("YYYY-MM-DD"),
        TIME: dayjs().format("HH:mm:ss"),
        RECEIPT: invoiceNumber,
        NO: user?.staff?.id,
        companyInfo: user?.companyInfo,
      }

      let templates: any = await printTemplate(templateObj);
      setTemplate(templates);
      if (status) {
        notification.success({
          message: "Success",
          description: "Sales invoice created successfully",
        });
        setModalOpen(true);
        dispatch(clearProduct([]));
        products = Store.getState().retailExpress.products;
        getDatas()
        getInvoiceNo()
        setPaymentModal(false)
        calculation()
        setBtLoading(false)
        return true
      } else {
        notification.error({ message: 'Error', description: message });
        setBtLoading(false)
        return false
      }
    } catch (error) {
      notification.error({ message: 'Error in Sale Creation' });
      setBtLoading(false)
      return false
    }
  }

  const getBankList = async () => {
    try {
      let url = "account_master/getBankList/" + user?.id + '/' + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setSlectedBank(data.bankList);
    } catch (error) { }
  };

  const addProductInCart = async () => {
    setIsChange(true)
    if (products.length) {
      let holdProduct = {
        date: new Date(),
        total: (total + tax).toFixed(2),
        quatity: totalQuatity,
        item: products,
      }
      await dispatch(addHoldProduct(holdProduct));
      await dispatch(clearProduct([]));
      products = Store.getState().retailExpress.products;
      productsStock = Store.getState().retailExpress.holdProducts;
    }
    setTimeout(() => {
      setIsChange(false);
      calculation();
    }, 1);
  }

  const addCartProductInCart = async (product: any, index: number) => {
    setIsChange(true)
    await dispatch(addCartProducts(product.item));
    await dispatch(removeHoldProduct(index));
    products = Store.getState().retailExpress.products;
    productsStock = Store.getState().retailExpress.holdProducts;
    setTimeout(() => {
      setIsChange(false);
      setCartModal(false)
      calculation();
    }, 1);
  }

  const clearHoldInvoice = (index?: number) => {
    setIsChange(true)
    if (index) {
      dispatch(removeHoldProduct(index))
    } else {
      dispatch(clearHoldProducts())
      setCartModal(false)
    }
    setTimeout(() => {
      setIsChange(false);
    }, 1);
  }

  const qrCodeSuccessCallback = async (decodedText: any,) => {
    if (decodedText) {
      let getScanData = await getDatas(decodedText)
      if (getScanData.length) {
        await handleAddToCart(getScanData[0])
      }
    }
  };

  const fetchStaffCounterList = async () => {
    try {
      let obj = {
        adminId: user?.id,
        companyid: user?.companyInfo?.id,
        query: counterSearch,
        page: 1,
        take: 10
      }
      let url = `billing_counter/list`;
      const response: any = await POST(url, obj);
      if (response?.status) {
        setCounterList(response.datas);
      }
    } catch (error) {
      console.log('------- error -', error)
    }
  }

  const fetchStaffDifineCounterDetails = async () => {
    try {
      let obj = {
        staffid: user?.staff?.id,
        adminId: user?.id,
        sDate: dayjs().format('YYYY-MM-DD'),
        companyid: user?.companyInfo?.id,
      }
      let url = `counter_details/counter/details`;
      const response: any = await POST(url, obj);
      if (response.status) {
        setCounterDetails(response);
      }
    } catch (error) {
      console.log('------- error -', error)
    }
  }

  return (
    <div className="RetailExpress">
      <div className="RetailExpress-box1">
        <Container fluid>
          <Row>
            <Col sm={8} xs={12} style={{ margin: 0, padding: 0 }}>
              <Header product={(val: any) => setProduct(val)} />
              <div className="RetailExpress-box2">
                <div>
                  <Tabs
                    size="small"
                    defaultActiveKey={category.toString()}
                    items={categories}
                    onChange={(val: any) => setCategory(val)}
                    tabBarStyle={{ backgroundColor: "white", paddingLeft: 10 }}
                  />
                </div>
                <Container>
                  <Row>
                    {loding ? (
                      <LoadingBox />
                    ) : (
                      data?.length ? (
                        data?.map((item: any, index: number) => {
                          return (
                            <Col
                              sm={3}
                              xs={12}
                              key={index}
                              style={{ marginBottom: 20 }}
                            >
                              <ProductItem
                                item={item}
                                onSelect={(item: any) => handleAddToCart(item)}
                                onCount={(val: any) =>
                                  dispatch(addProductQuantity(val))
                                }
                                selectedItem={products}
                                currencycode={user.countryInfo.currencycode}
                              />
                            </Col>
                          )

                        })) : (
                        <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#808080' }}>List of Non-Products</div>
                      ))}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Pagination
                        total={meta?.itemCount}
                        showSizeChanger={false}
                        showTotal={(total) =>
                          `Total ${meta?.itemCount} Products`
                        }
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  </Row>
                </Container>
              </div>
            </Col>
            <Col sm={4} xs={12} style={{ margin: 0, padding: 0 }}>
              <div className="RetailExpress-box3">
                <div className="RetailExpress-header2">
                  <div className="RetailExpress-txt1">Order Id : {invoiceNumber}</div>
                  <div>
                    <Button danger style={{ marginRight: '10px' }} size="small" onClick={() => setCounterModal(true)}>
                      Log out
                    </Button>
                    <Button type="dashed" style={{ marginRight: '10px' }} size="small">
                      <QRScannerModal qrCodeSuccessCallback={qrCodeSuccessCallback} />
                    </Button>
                    <Button style={{ marginRight: '10px' }} size="small" onClick={() => setCartModal(true)}>
                      Hold List
                    </Button>
                    <Button danger size="small" onClick={handleClearCart}>
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="RetailExpress-box4">
                  {isChange
                    ? null
                    : products?.map((item: any, index: number) => {
                      return (
                        <ListItem
                          index={index}
                          item={item}
                          isChange={(val: any) => clearAtIndex(val)}
                          add={(val: any) => add(val)}
                          minus={(val: any) => mainus(val)}
                          currencycode={user.countryInfo.currencycode}
                        />
                      );
                    })}
                </div>
                <div className="RetailExpress-box7">
                  <table className="RetailExpress-table">
                    <tr>
                      <td className="RetailExpress-txt5">Total</td>
                      <td className="RetailExpress-txt6">
                        {total.toFixed(2)} {user.countryInfo.currencycode}
                      </td>
                    </tr>
                    <tr>
                      <td className="RetailExpress-txt5">Tax</td>
                      <td className="RetailExpress-txt6">
                        {tax.toFixed(2)} {user.countryInfo.currencycode}
                      </td>
                    </tr>
                    <tr>
                      <td className="RetailExpress-txt5">Payable Amount</td>
                      <td className="RetailExpress-txt6">
                        {(total + tax).toFixed(2)} {user.countryInfo.currencycode}
                      </td>
                    </tr>
                  </table>
                  <Row>
                    <Col sm={5} xs={12} >
                      <Button
                        block
                        size="large"
                        style={{ height: 50 }}
                        onClick={() => addProductInCart()}
                      >
                        Hold
                      </Button>
                    </Col>
                    <Col sm={7} xs={12} >
                      <Button
                        block
                        type="primary"
                        size="large"
                        style={{ height: 50 }}
                        onClick={() =>
                          products?.length ?
                            setPaymentModal(true) :
                            null
                        }
                        loading={btLoding}
                      >
                        Checkout
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {cartModal && (
        !products?.length ? (
          <Modal
            open={cartModal}
            onCancel={() => setCartModal(false)}
            width={500}
            maskClosable={false}
            footer={false}
            title="Cart List"
          >
            <Row>
              {productsStock.length ? (
                <>
                  <Col lg={9} />
                  <Col lg={3}>
                    <Button danger style={{ marginBottom: '10px' }} onClick={() => clearHoldInvoice()} >Clear All</Button>
                  </Col>
                  {productsStock?.map((item: any, index: number) => {
                    return (
                      <Col lg={12}>
                        <HoldInvoice
                          item={item}
                          index={index}
                          addCartProductInCart={(item: any, index: number) => addCartProductInCart(item, index)}
                          clearHoldInvoice={(index: any) => clearHoldInvoice(index)}
                        />
                      </Col>
                    )
                  })}
                </>
              ) : (
                <div>It is not on the hold list.</div>
              )}
            </Row>
          </Modal>
        ) : (
          <Modal
            open={cartModal}
            onCancel={() => setCartModal(false)}
            width={500}
            maskClosable={false}
            okText="Yes"
            cancelText="No"
            title="Warning"
            onOk={() => handleClearCart()}
          >
            <div><IoAlertCircleOutline size={25} color={'#ffe900'} /> Would you like to clear all products and display the hold list instead?</div>
          </Modal>
        )
      )}
      {paymentModal && (
        <Modal
          open={paymentModal}
          onCancel={() => setPaymentModal(false)}
          width={500}
          maskClosable={false}
          footer={false}
          title="Add Payment"
        >
          <RetailExpressPaymentmodal
            onCancel={() => setPaymentModal(false)}
            onFinish={(val: any) => handleSubmit(val)}
            outstanding={(total + tax).toFixed(2)}
            bankList={selectBank}
            amount={(total + tax).toFixed(2)}
          />
        </Modal>
      )}
      {modalOpen ? (
        <PrintModal
          open={modalOpen}
          width={'40%'}
          navigation={true}
          modalClose={(val: any) => setModalOpen(val)}
          template={template}
        />
      ) : null}
      {counterModal || !counter?.id ? (
        <Modal
          open={counterModal || !counter?.id}
          width={'50%'}
          closable={false}
          footer={false}
        >
          <CounterModal
            counterList={counterList}
            counterSearch={(val: any) => setCounterSearch(val)}
            counterModal={counterModal}
            onClose={() => setCounterModal(false)}
            counterDetails={counterDetails}
          />
        </Modal>
      ) : null}
    </div >
  );
}

export default RetailExpress;