import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import "./styles.scss";
import { useSelector } from "react-redux";
import { GET, POST } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import LoadingBox from "../../../../components/loadingBox";
import useDebounce from "../../../../utils/useDebounce";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { PlusOutlined } from "@ant-design/icons";
export default function CreateProductionScreen() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const [notificationApi, contextHolder] = notification.useNotification();

  //state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBomLoading, setIsBomLoading] = useState<boolean>(false);
  const [bomListSelector, setBomListSelector] = useState<any>([]);
  const [metaBomList, seMetaBomList] = useState<any>({});
  const [bomBatches, setBomBatches] = useState<any>([]);
  const [bomDetails, setBomDetails] = useState<any>({});
  const [bomSearch, setBomSearch] = useState<any>("");
  const [pageSizeBomSelector, setPageSizeBomSelector] = useState<any>(10);
  const [pageNoBomSelector, setPageNoBomSelector] = useState<any>(1);
  const [location, setLocation] = useState<any>([]);
  const [locationMeta, setLocationMeta] = useState<any>({});
  const [locationPageSize, setLocationPageSize] = useState<number>(10);
  const [locationPageNo, setLocationPageNo] = useState<number>(1);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [totalCompositeUnitPrice, setTotalCompositeUnitPrice] =
    useState<number>(0);
  const [unSelectedProduct, setUnSelectedProduct] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [meta, setMeta] = useState<any>({});
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [wastageFormOpen, setWastageFormOpen] = useState<boolean>(false);
  const [wastageFormCrntName, setWastageFormCrntName] = useState<number>(-1);
  const [ledgersData, setLedgersData] = useState<any>();
  const [expenseFormOpen, setExpenseFormOpen] = useState<boolean>(false);
  const [expenseFormCrntName, setExpenseFormCrntName] = useState<number>(-1);
  //useWatch of Antd
  const formWatchData = Form.useWatch((values) => values, {
    form,
    preserve: true,
  });

  //useEffect
  useEffect(() => {
    getBomListForSelector();
  }, [pageNoBomSelector, pageSizeBomSelector, useDebounce(bomSearch, 1000)]);

  useEffect(() => {
    getLocation();
  }, [locationPageSize, locationPageNo, useDebounce(searchLocation, 1000)]);

  useEffect(() => {
    getProduct();
  }, [pageNo, pageSize, useDebounce(searchProduct, 1000)]);

  useEffect(() => {
    fetchLedgers();
  }, []);
  //function
  const getBomListForSelector = async () => {
    try {
      let url =
        API.BOM_LIST_PRODUCTION +
        `?companyId=${user?.companyInfo?.id}&searchProduct=${bomSearch}&order=DESC&page=${pageNoBomSelector}&take=${pageSizeBomSelector}`;
      const response: any = await GET(url, null);
      if (response) {
        seMetaBomList(response?.data?.meta);
        setBomListSelector(response?.data?.data);
      } else {
        notificationApi.error({
          message: "Failed",
          description: response?.message || "Something Went Wrong in Our End",
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Failed",
        description: error?.message || "Something Went Wrong in Our End",
      });
    } finally {
      // setIsLoading(false);
    }
  };
  const getBomDetails = async (id: any) => {
    try {
      setIsBomLoading(true);
      let url = API.BOM_BY_ID + `${id}?companyId=${user?.companyInfo?.id}`;
      const response: any = await GET(url, null);
      if (response?.status) {
        setBomDetails(response?.data);
        setTotalCompositeUnitPrice(
          FindItemTotalPrice(response?.data?.compositeBomItems)
        );
        form.setFieldsValue(mapBomDataToFormData(response?.data));
      } else {
        notificationApi.error({
          message: "Failed",
          description: response?.message || "Something Went Wrong in Our End",
        });
        // navigate(-1);
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Failed",
        description: error?.message || "Something Went Wrong in Our End",
      });
    } finally {
      setIsBomLoading(false);
    }
  };
  const getLocation = async () => {
    try {
      const response: any = await GET(
        API.LOCATION_GET_BY_COMPANY +
          `${user?.companyInfo?.id}?order=ASC&page=${locationPageNo}&take=${locationPageSize}&searchLocaton=${searchLocation}`,
        null
      );
      if (response?.status) {
        setLocation(response?.data?.data);
        setLocationMeta(response?.data?.meta);
      }
    } catch (error) {}
  };
  const getProduct = async () => {
    try {
      let body = {
        id: user.adminid,
        companyid: user?.companyInfo?.id,
        category: 0,
        name: searchProduct,
        type: "both",
      };
      const response: any = await POST(
        API.LIST_PRODUCTS + `?order=DESC&page=${pageNo}&take=${pageSize}`,
        body
      );
      if (response?.data && response?.meta) {
        setProduct(response?.data);
        setMeta(response?.meta);
        setUnSelectedProduct(getUnchosenProducts(response?.data));
      }
    } catch (error) {}
  };
  const fetchLedgers = async () => {
    try {
      const url = API.EXPENSE_LEDGER_LIST_IN_BOM + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setLedgersData(data);
    } catch (error) {}
  };

  function mapBomDataToFormData(bomData: any) {
    let formData: any = {
      batchQuantity: bomData?.quantity,
      productionQuantity: 1,
      totalQuantity: bomData?.quantity * 1,
      generatedItems: [
        {
          id: bomData?.id,
          productId: bomData?.productId,
          unitPrice: Number(
            (
              (FindItemTotalPrice(bomData?.compositeBomItems) * 1) /
              bomData?.quantity
            ).toFixed(2)
          ),
          unitSalePrice: Number(
            (
              (FindItemTotalPrice(bomData?.compositeBomItems) * 1) /
              bomData?.quantity
            ).toFixed(2)
          ),
          unitQuantity: bomData?.quantity,
          type: "mainProduct",
        },
      ],
    };
    formData["generatedProductUnitTotal"] =
      Number(formData?.generatedItems[0]?.unitPrice) *
      Number(formData?.generatedItems[0]?.unitQuantity);
    if (bomData?.byProductBomItems?.length) {
      bomData?.byProductBomItems?.map((item: any) => {
        let generatedbyProduct = {
          id: item?.id,
          productId: item?.productId,
          unitPrice: 0,
          unitSalePrice: 0,
          type: "byProduct",
          unitQuantity: item?.quantity,
        };
        formData?.generatedItems?.push(generatedbyProduct);
      });
    }
    //calucation of the unit price for generated products
    // const totalCompositePrice = FindItemTotalPrice(bomData?.compositeBomItems);
    // const unitPrice = Number(totalCompositePrice) / Number(bomData?.quantity);
    // formData[`unitPrice.${bomData?.id}.mainProduct`] = unitPrice;
    // let formData: any = {
    //   mainProduct: {
    //     label: bomData?.Product?.idescription,
    //     value: bomData?.Product?.id,
    //     key: bomData?.Product?.id,
    //     disabled: false,
    //   },
    //   quantity: bomData?.quantity,
    //   compositeItems: bomData?.compositeBomItems?.map((item: any) => ({
    //     id: item?.id,
    //     product: {
    //       label: item?.Product?.idescription,
    //       value: item?.Product?.id,
    //       key: item?.Product?.id,
    //       disabled: false,
    //     },
    //     quantity: item?.quantity,
    //   })),
    // };
    // if (bomData?.byProductBomItems?.length) {
    //   formData["byProductItems"] = bomData?.byProductBomItems?.map(
    //     (item: any) => ({
    //       id: item?.id,
    //       product: {
    //         label: item?.Product?.idescription,
    //         value: item?.Product?.id,
    //         key: item?.Product?.id,
    //         disabled: false,
    //       },
    //       quantity: item?.quantity,
    //     })
    //   );
    // }
    if (bomData?.ProductionLocation?.id) {
      formData["production_location"] = {
        label: bomData?.ProductionLocation?.location,
        value: bomData?.ProductionLocation?.id,
        key: bomData?.ProductionLocation?.id,
      };
    }
    if (bomData?.ConsumptionLocation?.id) {
      formData["consumption_location"] = {
        label: bomData?.ConsumptionLocation?.location,
        value: bomData?.ConsumptionLocation?.id,
        key: bomData?.ConsumptionLocation?.id,
      };
    }

    return formData;
  }
  function getUnchosenProducts(products: any) {
    // Collect all chosen product IDs from formdata

    const chosenProductIds = new Set();

    // Add wastageItems product IDs to the set
    if (formWatchData.wastageItems) {
      formWatchData?.wastageItems?.forEach((item: any) =>
        chosenProductIds?.add(item?.product?.value)
      );
    }
    // Iterate through the products list and add a 'disabled' property to the chosen products
    const updatedProducts = products?.map((product: any) => ({
      ...product,
      disabled: chosenProductIds?.has(product.id),
    }));

    return updatedProducts;
  }
  const onPopupScroll = (
    e: React.UIEvent<HTMLDivElement>,
    type: "BomSelector" | "location" | "product"
  ) => {
    e.persist();
    let target = e.target as HTMLDivElement;
    if (
      Math.round(target.scrollTop + target.offsetHeight) === target.scrollHeight
    ) {
      if (type === "BomSelector") {
        if (metaBomList?.hasNextPage) {
          setPageSizeBomSelector((prev: number) => prev + 10);
        }
      } else if (type === "location") {
        if (locationMeta?.hasNextPage) {
          setLocationPageSize((prev: number) => prev + 10);
        }
      } else if (type === "product") {
        if (meta?.hasNextPage) {
          setPageSize((prev: number) => prev + 10);
        }
      }
    }
  };
  const productQueryReset = (open: boolean) => {
    if (open) {
      setPageNoBomSelector(1);
      setPageSizeBomSelector(10);
    }
  };
  const wastageProductQueryReset = (open: boolean) => {
    setSearchProduct("");
    setPageNo(1);
    setPageSize(10);
  };
  const onSearchProduct = (val: any) => {
    setSearchProduct(val);
    setPageNo(1);
    setPageSize(10);
  };
  const onSearchBomProduct = (val: any) => {
    setBomSearch(val);
    setPageNoBomSelector(1);
    setPageSizeBomSelector(10);
  };
  const locationQueryReset = (open: boolean) => {
    setSearchLocation("");
    setLocationPageNo(1);
    setLocationPageSize(10);
  };

  const onSearchLocation = (val: any) => {
    setSearchLocation(val);
    setLocationPageNo(1);
    setLocationPageSize(10);
  };
  function onFormValueChange(changedValues: any, allValues: any) {
    //to change batches of the product when changing Bom product
    if (changedValues?.bomProduct) {
      form?.setFieldValue("batch", "");
      setBomDetails({});
      const bomData = bomListSelector?.find(
        (product: any) => product?.productId == changedValues?.bomProduct
      );
      setBomBatches(bomData?.batches);
    }

    //to call the data of selected BOM
    else if (changedValues?.batch) {
      getBomDetails(changedValues?.batch);
    }

    //to change total quantity
    else if (changedValues?.productionQuantity) {
      const totalQuantity =
        Number(changedValues?.productionQuantity) *
        Number(bomDetails?.quantity);
      form.setFieldValue("totalQuantity", totalQuantity.toFixed(2));
    } else if (changedValues?.wastageItems || changedValues?.generatedItems) {
      let wastageItemsTotal = 0;
      //to find all wastage cost price,unit,unitPrice,total in the table
      if (changedValues?.wastageItems) {
        //to find the selected prodcut and disable them
        setUnSelectedProduct(getUnchosenProducts(product));

        //calcuation to find total price of the wastageItems
        allValues?.wastageItems?.forEach((item: any, index: number) => {
          //change the product
          if (item?.product) {
            const productData = product?.find(
              (element: any) => element?.id == item?.product?.value
            );
            form.setFieldValue(
              ["wastageItems", index, "costPrice"],
              productData?.costprice
            );
            form.setFieldValue(
              ["wastageItems", index, "unit"],
              productData?.unitDetails?.unit
            );
            if (item?.quantity) {
              wastageItemsTotal =
                wastageItemsTotal +
                Number(productData?.costprice) * Number(item?.quantity);
            }
          }
        });
        form.setFieldValue("wastageItemsTotalPrice", wastageItemsTotal);
      } else {
        wastageItemsTotal = formWatchData?.wastageItemsTotalPrice || 0;
      }

      //to change the main product unit cost price and generated Product Total Unit when byproduct's unit price changes or wastage price increase
      let totalByproductUnitPrice = 0;
      let mainProductIndex: number = 0;
      allValues?.generatedItems?.map((item: any, index: any) => {
        if (item.type === "byProduct") {
          //calculating the total unit Price of the byProduct
          const totalUnitCost =
            Number(item?.unitPrice) * Number(item?.unitQuantity);
          totalByproductUnitPrice = totalByproductUnitPrice + totalUnitCost;

          //(byProduct) change the sale price if its below cost price
          if (Number(item?.unitPrice) > Number(item?.unitSalePrice)) {
            if (
              changedValues?.generatedItems &&
              (changedValues?.generatedItems[index]?.unitSalePrice ||
                changedValues?.generatedItems[index]?.unitSalePrice === "")
            ) {
              notificationApi.error({
                message: "Sales Price Shouldn't be Less Than Cost Price",
              });
            } else {
              form.setFieldValue(
                ["generatedItems", index, "unitSalePrice"],
                item?.unitPrice
              );
            }
          }
        } else if (item.type === "mainProduct") {
          mainProductIndex = index;
        }
      });
      const newPriceMainProduct =
        totalCompositeUnitPrice +
        wastageItemsTotal / Number(formWatchData?.productionQuantity) -
        totalByproductUnitPrice;
      if (newPriceMainProduct < totalByproductUnitPrice) {
        notificationApi.error({
          message: "total Byproduct price cannot be greater than BOM product",
        });
      }
      const totalUnitMainCostPrice =
        newPriceMainProduct / Number(bomDetails?.quantity);
      form.setFieldValue(
        ["generatedItems", mainProductIndex, "unitPrice"],
        totalUnitMainCostPrice
      );
      form.setFieldValue(
        ["generatedProductUnitTotal"],
        newPriceMainProduct + totalByproductUnitPrice
      );

      //(mainProduct) change the sale price if its below cost price
      if (
        Number(totalUnitMainCostPrice) >
        Number(allValues?.generatedItems[mainProductIndex]?.unitSalePrice)
      ) {
        if (
          changedValues?.generatedItems &&
          (changedValues?.generatedItems[mainProductIndex]?.unitSalePrice ||
            changedValues?.generatedItems[mainProductIndex]?.unitSalePrice ===
              "")
        ) {
          notificationApi.error({
            message: "Sales Price Shouldn't be Less Than Cost Price",
          });
        } else {
          form.setFieldValue(
            ["generatedItems", mainProductIndex, "unitSalePrice"],
            totalUnitMainCostPrice
          );
        }
      }
    }
  }
  const findProductUnit = (type: "bomProduct" | "wastage", index?: number) => {
    if (type === "bomProduct") {
      const bomProduct = form.getFieldValue("bomProduct");
      const bomData = bomListSelector?.find(
        (product: any) => product?.productId == bomProduct
      );
      if (bomData) {
        return bomData?.unit;
      } else {
        return null;
      }
    } else if (type === "wastage" && index !== undefined) {
      const formData = formWatchData?.wastageItems;
      if (formData[index]?.product) {
        const productData = product?.find(
          (item: any) => item?.id == formData[index]?.product?.value
        );
        if (productData) {
          return <div>{productData?.unitDetails?.unit}</div>;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  };
  const findByProductDetails = (formListFieldName: number) => {
    const byProductFormData = formWatchData?.generatedItems[formListFieldName];
    if (byProductFormData?.id) {
      const data = bomDetails?.byProductBomItems?.find(
        (item: any) => item?.id == byProductFormData?.id
      );
      if (data) {
        return data;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const FindItemTotalPrice = (itemArray: any) => {
    let totalItemPrice = 0;
    if (itemArray?.length) {
      itemArray?.map((item: any) => {
        const productTotal =
          Number(item?.quantity) * Number(item?.Product?.costprice);
        totalItemPrice = totalItemPrice + productTotal;
      });
      return totalItemPrice;
    } else {
      return totalItemPrice;
    }
  };
  const addNewItemWastage = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    index: number
  ) => {
    add();
    setWastageFormOpen(true);
    setWastageFormCrntName(index);
  };
  const addNewItemExpense = (
    add: (defaultValue?: any, insertIndex?: number | undefined) => void,
    index: number
  ) => {
    add();
    setExpenseFormOpen(true);
    setExpenseFormCrntName(index);
  };
  const deleteWastageItems = () => {
    form.setFieldValue("wastageItems", []);
    setWastageFormOpen(false);
    setWastageFormCrntName(-1);
  };
  const deleteExpenseItems = () => {
    form.setFieldValue("expenseItems", []);
    setExpenseFormOpen(false);
    setExpenseFormCrntName(-1);
  };
  const QuantityDisplayBox = (props: any) => {
    return (
      <div className="createProductionScreenBox2">
        <div className="createProductionScreen-txt1">
          {props?.value ? `${props?.value} ${props?.suffix}` : 0}
        </div>
      </div>
    );
  };
  function disableDuplicatesLedger(arr1: any, arr2: any) {
    const uniqueIds = arr2?.map((item: any) => item?.ledger?.value);
    const result = arr1?.map((item: any) => {
      if (uniqueIds?.includes(item?.id)) {
        return { ...item, disable: true };
      }
      return { ...item, disable: false };
    });
    return result;
  }

  const validateWastageForm = async () => {
    if (wastageFormCrntName >= 0) {
      try {
        await form.validateFields([
          ["wastageItems", wastageFormCrntName, "product"],
          ["wastageItems", wastageFormCrntName, "quantity"],
        ]);
        setWastageFormCrntName(-1);
      } catch (error) {
        console.error("Validation failed:", error);
      }
    }
  };
  const validateExpenseForm = async () => {
    if (expenseFormCrntName >= 0) {
      try {
        await form.validateFields([
          ["expenseItems", expenseFormCrntName, "amount"],
          ["expenseItems", expenseFormCrntName, "ledger"],
        ]);
        setExpenseFormCrntName(-1);
      } catch (error) {
        console.error("Validation failed:", error);
      }
    }
  };
  const onFinish = async (val: any) => {
    let obj = {
      companyId: user?.companyInfo?.id,
      staffId: user?.isStaff ? user?.staff?.id : null,
      createdBy: user?.isStaff ? "staff" : "admin",
      bomId: bomDetails?.id,
      productId: bomDetails?.productId,
      batchQuantity: Number(val?.batchQuantity),
      productionQuantity: Number(val?.productionQuantity),
      consumptionLocationId: Number(val?.consumption_location?.value),
      productionLocationId: Number(val?.production_location?.value),

      compositeProductionItems: bomDetails?.compositeBomItems?.map(
        (item: any) => ({
          productId: item?.productId,
          batchQuantity: item?.quantity,
          unitCostPrice: Number(item?.Product?.costprice),
          unitSalesPrice: 0, // Assuming default value, update as needed
        })
      ),
      wastageProductionItems: val?.wastageItems?.map((item: any) => ({
        productId: Number(item?.product?.value),
        batchQuantity: Number(item?.quantity),
        unitCostPrice: Number(item?.costPrice),
        unitSalesPrice: 0, // Assuming default value, update as needed
      })),
      expenseLedgerItems: val?.expenseItems?.map((item: any) => ({
        ledgerId: Number(item?.ledger?.value),
        amount: Number(item?.amount),
        notes: item?.notes || "",
      })),
      productProductionItems: val?.generatedItems?.map((item: any) => ({
        productId: Number(item?.productId),
        batchQuantity: Number(item?.unitQuantity),
        unitCostPrice: Number(item?.unitPrice),
        unitSalesPrice: Number(item?.unitSalePrice), // Assuming default value, update as needed
      })),
    };
    try {
      setIsLoading(true);
      const response: any = await POST(API.CREATE_PRODUCTION, obj);
      if (response?.status) {
        notificationApi.success({
          message: "Success",
          description: "Production has been successfully created.",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        notificationApi.error({
          message: "Failed",
          description: response?.message || "Something Went Wrong in Our End",
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Failed",
        description: error?.message || "Something Went Wrong in Our End",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <PageHeader
        // onSubmit={() => navigate("/usr/create-product/service")}
        goBack={() => navigate(-1)}
        firstPathLink={urlLocation.pathname.replace("/create", "")}
        title= {t("home_page.homepage.CreateProduction")}
        secondPathLink={urlLocation?.pathname}
        secondPathText={t("home_page.homepage.CreateProduction")}
      ></PageHeader>

      <Container fluid>
        <br />
        <div className="adminTable-Box1">
          <div className="adminTable-Box2">
            <Card>
              <Form
                form={form}
                layout={"vertical"}
                onFinish={onFinish}
                onValuesChange={onFormValueChange}
                scrollToFirstError
              >
                <Row>
                  <Col md={3}>
                    <Form.Item
                      label={t("home_page.homepage.BOMproduct")}
                      name="bomProduct"
                      colon={false}
                    >
                      <Select
                        showSearch
                        placeholder={t("home_page.homepage.BOMproduct")}
                        options={bomListSelector}
                        fieldNames={{
                          label: "productName",
                          value: "productId",
                        }}
                        onDropdownVisibleChange={productQueryReset}
                        onSearch={onSearchBomProduct}
                        filterOption={false}
                        onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                          onPopupScroll(e, "BomSelector")
                        }
                        dropdownRender={(menu) => (
                          <>
                            <Button
                              icon={<PlusOutlined />}
                              style={{ width: "100%", marginBottom: 10 }}
                              onClick={() =>
                                navigate("/usr/create-composition")
                              }
                            >
                              Add BOM
                            </Button>
                            {menu}
                          </>
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={3}>
                    <Form.Item
                    label={`${t("home_page.homepage.ProductBatch")} ${
                      findProductUnit("bomProduct")
                        ? `(unit: ${findProductUnit("bomProduct")})`
                        : ""
                    }`}
                    name="batch"
                    colon={false}
                    >
                      <Select
                        // showSearch
                        disabled={bomBatches?.length ? false : true}
                        placeholder={t("home_page.homepage.ProductBatch")}
                        options={bomBatches}
                        fieldNames={{
                          label: "quantity",
                          value: "id",
                        }}
                        // onSearch={onSearchProduct}
                        // filterOption={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={3}>
                    {bomDetails && Object.keys(bomDetails).length > 0 ? (
                      <Form.Item
                        label={"Production Location"}
                        name="production_location"
                        className="createCompositeFormItem2"
                        rules={[
                          {
                            required: true,
                            message: "Select a Production Location",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Location"
                          // optionFilterProp="label"
                          fieldNames={{
                            label: "location",
                            value: "id",
                          }}
                          onDropdownVisibleChange={locationQueryReset}
                          className="createCompositeSelector"
                          onSearch={onSearchLocation}
                          filterOption={false}
                          labelInValue
                          options={location}
                          onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                            onPopupScroll(e, "location")
                          }
                          listHeight={200}
                        />
                      </Form.Item>
                    ) : null}
                  </Col>
                  <Col md={3}>
                    {bomDetails && Object.keys(bomDetails).length > 0 ? (
                      <Form.Item
                        label={"Consumption Location"}
                        name="consumption_location"
                        className="createCompositeFormItem2"
                        rules={[
                          {
                            required: true,
                            message: "Select a Consumption Location",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Location"
                          // optionFilterProp="label"
                          fieldNames={{
                            label: "location",
                            value: "id",
                          }}
                          onDropdownVisibleChange={locationQueryReset}
                          className="createCompositeSelector"
                          onSearch={onSearchLocation}
                          filterOption={false}
                          labelInValue
                          options={location}
                          onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                            onPopupScroll(e, "location")
                          }
                          listHeight={200}
                        />
                      </Form.Item>
                    ) : null}
                  </Col>
                </Row>
                {isBomLoading ? (
                  <LoadingBox />
                ) : bomDetails && Object.keys(bomDetails).length > 0 ? (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Item
                          label={"Production Quantity"}
                          name={"productionQuantity"}
                          rules={[
                            {
                              required: true,
                              message: "Please Enter a Quantity",
                            },
                            {
                              validator: (_, value) =>
                                value > 0
                                  ? Promise.resolve()
                                  : Promise.reject(
                                      new Error("Quantity should be above Zero")
                                    ),
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="Quantity"
                            controls={false}
                            type="number"
                            addonAfter={findProductUnit("bomProduct")}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={6} className="createProductionScreenBox1">
                        <div>
                          <div className="createProductionScreen-txt4">
                            Batch
                          </div>
                          <Form.Item name={"batchQuantity"} noStyle>
                            <QuantityDisplayBox
                              suffix={findProductUnit("bomProduct")}
                            />
                          </Form.Item>
                        </div>
                        <div className="createProductionScreen-txt2"> X </div>
                        <div>
                          <div className="createProductionScreen-txt4">
                            quantity
                          </div>
                          <Form.Item name={"productionQuantity"} noStyle>
                            <QuantityDisplayBox
                              suffix={findProductUnit("bomProduct")}
                            />
                          </Form.Item>
                        </div>
                        <div className="createProductionScreen-txt2"> = </div>
                        <div>
                          <div className="createProductionScreen-txt4">
                            total
                          </div>
                          <Form.Item name={"totalQuantity"} noStyle>
                            <QuantityDisplayBox
                              suffix={findProductUnit("bomProduct")}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Table
                      responsive
                      bordered
                      className={"createProductionScreenTable-2"}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={6}
                            className={"createProductionScreenTableHeader1"}
                          >
                            <div className="createProductionScreen-txt5">
                              Raw Materials
                            </div>
                          </th>
                        </tr>
                        <tr className={"createProductionScreenTable-header1"}>
                          <th>sl no</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                        </tr> 
                      </thead>
                      <tbody>
                        {bomDetails?.compositeBomItems?.map(
                          (item: any, index: number) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.Product?.idescription}</td>
                              <td>
                                {item?.quantity *
                                  Number(formWatchData?.productionQuantity)}
                              </td>
                              <td>{item?.Product?.units}</td>
                              <td>{item?.Product?.costprice}</td>
                              <td>
                                {(
                                  Number(item?.Product?.costprice) *
                                  (Number(item?.quantity) *
                                    Number(formWatchData?.productionQuantity))
                                ).toFixed(2)}
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td colSpan={5} align="right">
                            Total
                          </td>
                          <td>
                            {(
                              totalCompositeUnitPrice *
                              formWatchData?.productionQuantity
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <br />
                    <Form.List name="wastageItems">
                      {(fields, { add, remove }) => (
                        <>
                          <Table
                            responsive
                            bordered
                            className={"createProductionScreenTable-1"}
                          >
                            <thead>
                              <tr>
                                <th
                                  colSpan={6}
                                  className={
                                    "createProductionScreenTableHeader1"
                                  }
                                >
                                  <div className={"createProductionScreenBox3"}>
                                    <div className="createProductionScreen-txt5">
                                      Wastage Product
                                    </div>
                                    {wastageFormOpen ? (
                                      <Button
                                        icon={<MdDelete />}
                                        danger
                                        onClick={deleteWastageItems}
                                      >
                                        Delete
                                      </Button>
                                    ) : (
                                      <Button
                                        className="createProductionScreen-btn1"
                                        icon={<IoMdAdd />}
                                        onClick={() =>
                                          addNewItemWastage(add, fields?.length)
                                        }
                                      >
                                        Create
                                      </Button>
                                    )}
                                  </div>
                                </th>
                              </tr>
                              {wastageFormOpen ? (
                                <tr
                                  className={
                                    "createProductionScreenTable-header1"
                                  }
                                >
                                  <th>sl no</th>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Unit Price</th>
                                  <th>Total Price</th>
                                  <th>Action</th>
                                </tr>
                              ) : null}
                            </thead>
                            <tbody>
                              {fields.map(
                                ({ key, name, ...restField }, index) =>
                                  name === wastageFormCrntName ? null : (
                                    <tr key={key}>
                                      <td width={50}>{index + 1}</td>
                                      <td>
                                        {
                                          formWatchData?.wastageItems[name]
                                            ?.product?.label
                                        }
                                      </td>
                                      <td>
                                        {
                                          formWatchData?.wastageItems[name]
                                            ?.quantity
                                        }
                                        &nbsp;
                                        {
                                          formWatchData?.wastageItems[name]
                                            ?.unit
                                        }
                                      </td>
                                      <td>
                                        {
                                          formWatchData?.wastageItems[name]
                                            ?.costPrice
                                        }
                                      </td>
                                      <td>
                                        {(
                                          Number(
                                            formWatchData?.wastageItems[name]
                                              ?.costPrice
                                          ) *
                                          Number(
                                            formWatchData?.wastageItems[name]
                                              ?.quantity
                                          )
                                        ).toFixed(2)}
                                      </td>
                                      <td width={90}>
                                        <div className="d-flex justify-content-around">
                                          <div
                                            onClick={() => {
                                              remove(index);
                                              setWastageFormCrntName(
                                                (prev: number) => prev - 1
                                              );
                                            }}
                                          >
                                            <ImCross color="red" size={18} />
                                          </div>
                                          <div
                                            onClick={() => {
                                              wastageFormCrntName >= 0 &&
                                                remove(wastageFormCrntName);
                                              setWastageFormCrntName(name);
                                            }}
                                          >
                                            <FaEdit color="blue" size={20} />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                              )}
                              {wastageFormOpen ? (
                                <tr>
                                  <td colSpan={4} align="right">
                                    Total
                                  </td>
                                  <td>
                                    {formWatchData?.wastageItemsTotalPrice?.toFixed(
                                      2
                                    )}
                                  </td>
                                  <td></td>
                                </tr>
                              ) : null}
                            </tbody>
                          </Table>
                          {wastageFormCrntName >= 0 ? (
                            <div className="createProductionScreenBox4">
                              <Row>
                                <Col md={6}>
                                  <Form.Item
                                    label={"Wastage Product"}
                                    // {...restField}
                                    isListField={true}
                                    className="createProductionScreenFormItem3"
                                    name={[wastageFormCrntName, "product"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Select a product",
                                      },
                                    ]}
                                  >
                                    <Select
                                      showSearch
                                      placeholder="product"
                                      //   onSearch={onSearch}
                                      options={unSelectedProduct}
                                      fieldNames={{
                                        label: "idescription",
                                        value: "id",
                                      }}
                                      onDropdownVisibleChange={
                                        wastageProductQueryReset
                                      }
                                      labelInValue
                                      onSearch={onSearchProduct}
                                      filterOption={false}
                                      onPopupScroll={(
                                        e: React.UIEvent<HTMLDivElement>
                                      ) => onPopupScroll(e, "product")}
                                      listHeight={200}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col md={6}>
                                  <Form.Item
                                    label={"Quantity"}
                                    isListField={true}
                                    className="createProductionScreenFormItem3"
                                    name={[wastageFormCrntName, "quantity"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please Enter a Quantity",
                                      },
                                      {
                                        validator: (_, value) =>
                                          value > 0
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error(
                                                  "Quantity should be above Zero"
                                                )
                                              ),
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="Quantity"
                                      type="number"
                                      addonAfter={findProductUnit(
                                        "wastage",
                                        wastageFormCrntName
                                      )}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row>
                                <Col sm={6}></Col>
                                <Col sm={3}>
                                  <Button
                                    icon={<MdDelete />}
                                    style={{ width: "100%" }}
                                    danger
                                    onClick={() => {
                                      remove(wastageFormCrntName);
                                      setWastageFormCrntName(-1);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                                <Col sm={3}>
                                  <Button
                                    icon={<IoMdAdd />}
                                    style={{ width: "100%" }}
                                    className="createProductionScreen-btn1"
                                    onClick={() => validateWastageForm()}
                                  >
                                    ADD
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            wastageFormOpen && (
                              <Button
                                icon={<IoMdAdd />}
                                type="dashed"
                                style={{ width: "100%" }}
                                className="createProductionScreen-btn2"
                                onClick={() =>
                                  addNewItemWastage(add, fields?.length)
                                }
                              >
                                Add Wastage Product
                              </Button>
                            )
                          )}
                        </>
                      )}
                    </Form.List>
                    <br />
                    <br />
                    <br />
                    <Form.List name="expenseItems">
                      {(fields, { add, remove }) => (
                        <>
                          <Table
                            responsive
                            bordered
                            className={"createProductionScreenTable-1"}
                          >
                            <thead>
                              <tr>
                                <th
                                  colSpan={6}
                                  className={
                                    "createProductionScreenTableHeader1"
                                  }
                                >
                                  <div className={"createProductionScreenBox3"}>
                                    <div className="createProductionScreen-txt5">
                                      Extra Expense
                                    </div>
                                    {expenseFormOpen ? (
                                      <Button
                                        icon={<MdDelete />}
                                        danger
                                        onClick={deleteExpenseItems}
                                      >
                                        Delete
                                      </Button>
                                    ) : (
                                      <Button
                                        className="createProductionScreen-btn1"
                                        icon={<IoMdAdd />}
                                        onClick={() =>
                                          addNewItemExpense(add, fields?.length)
                                        }
                                      >
                                        Create
                                      </Button>
                                    )}
                                  </div>
                                </th>
                              </tr>
                              {expenseFormOpen ? (
                                <tr
                                  className={
                                    "createProductionScreenTable-header1"
                                  }
                                >
                                  <th>SL No</th>
                                  <th>Ledger</th>
                                  <th>Amount</th>
                                  <th>Notes</th>
                                  <th>Action</th>
                                </tr>
                              ) : null}
                            </thead>
                            <tbody>
                              {fields.map(
                                ({ key, name, ...restField }, index) =>
                                  name === expenseFormCrntName ? null : (
                                    <tr key={key}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {(formWatchData &&
                                          formWatchData?.expenseItems?.length &&
                                          formWatchData?.expenseItems[index]
                                            ?.ledger?.label) ||
                                          "n/a"}
                                      </td>
                                      <td>
                                        {(formWatchData &&
                                          formWatchData?.expenseItems?.length &&
                                          formWatchData?.expenseItems[index]
                                            ?.amount) ||
                                          "0"}
                                      </td>
                                      <td>
                                        {(formWatchData &&
                                          formWatchData?.expenseItems?.length &&
                                          formWatchData?.expenseItems[index]
                                            ?.notes) ||
                                          ""}
                                      </td>

                                      <td width={90}>
                                        <div className="d-flex justify-content-around">
                                          <div
                                            onClick={() => {
                                              remove(index);
                                              setExpenseFormCrntName(
                                                (prev: number) => prev - 1
                                              );
                                            }}
                                          >
                                            <ImCross color="red" size={18} />
                                          </div>
                                          <div
                                            onClick={() => {
                                              expenseFormCrntName >= 0 &&
                                                remove(expenseFormCrntName);
                                              setExpenseFormCrntName(name);
                                            }}
                                          >
                                            <FaEdit color="blue" size={20} />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                              )}
                            </tbody>
                          </Table>
                          {expenseFormCrntName >= 0 ? (
                            <div className="createProductionScreenBox4">
                              <Row>
                                <Col md={4}>
                                  <Form.Item
                                    label={"Account Ledger"}
                                    // {...restField}
                                    isListField={true}
                                    className="createProductionScreenFormItem3"
                                    name={[expenseFormCrntName, "ledger"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Select a Ledger",
                                      },
                                    ]}
                                  >
                                    <Select
                                      allowClear
                                      placeholder="Choose Ledger"
                                      style={{ width: "100%" }}
                                      showSearch
                                      labelInValue
                                      filterOption={(input: any, option: any) =>
                                        option?.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                    >
                                      {disableDuplicatesLedger(
                                        ledgersData,
                                        formWatchData?.expenseItems
                                      )?.map((item: any) => (
                                        <Select.Option
                                          key={item?.id}
                                          value={item?.id}
                                          disabled={item?.disable}
                                        >
                                          {item.laccount}
                                        </Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col md={4}>
                                  <Form.Item
                                    label={"Amount"}
                                    isListField={true}
                                    className="createProductionScreenFormItem3"
                                    name={[expenseFormCrntName, "amount"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please Enter a Amount",
                                      },
                                      {
                                        validator: (_, value) =>
                                          value > 0
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error(
                                                  "Amount should be above Zero"
                                                )
                                              ),
                                      },
                                    ]}
                                  >
                                    <Input
                                      placeholder="amount"
                                      // suffix={props?.qSuffix}
                                      type="number"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col md={4}>
                                  <Form.Item
                                    label={"Notes"}
                                    isListField={true}
                                    className="createProductionScreenFormItem3"
                                    name={[expenseFormCrntName, "notes"]}
                                  >
                                    <Input placeholder="Notes" />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row>
                                <Col sm={6}></Col>
                                <Col sm={3}>
                                  <Button
                                    icon={<MdDelete />}
                                    style={{ width: "100%" }}
                                    danger
                                    onClick={() => {
                                      remove(expenseFormCrntName);
                                      setExpenseFormCrntName(-1);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                                <Col sm={3}>
                                  <Button
                                    icon={<IoMdAdd />}
                                    style={{ width: "100%" }}
                                    className="createProductionScreen-btn1"
                                    onClick={() => validateExpenseForm()}
                                  >
                                    ADD
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          ) : (
                            expenseFormOpen && (
                              <Button
                                icon={<IoMdAdd />}
                                type="dashed"
                                style={{ width: "100%" }}
                                className="createProductionScreen-btn2"
                                onClick={() =>
                                  addNewItemExpense(add, fields?.length)
                                }
                              >
                                ADD Extra Expense
                              </Button>
                            )
                          )}
                        </>
                      )}
                    </Form.List>
                    <br />
                    <br />
                    <br />
                    <Table
                      responsive
                      bordered
                      className={"createProductionScreenTable-2"}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={6}
                            className={"createProductionScreenTableHeader1"}
                          >
                            <div className="createProductionScreen-txt5">
                              Generated Products
                            </div>
                          </th>
                        </tr>
                        <tr className={"createProductionScreenTable-header1"}>
                          <th>sl no</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Cost Price</th>
                          <th>Unit Sales Price</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <Form.List name="generatedItems">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(
                                ({ key, name, ...restField }, index) =>
                                  formWatchData?.generatedItems[name]?.type ===
                                  "mainProduct" ? (
                                    <tr key={key}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {bomDetails?.Product?.idescription}
                                      </td>
                                      <td>
                                        {bomDetails?.quantity *
                                          Number(
                                            formWatchData?.productionQuantity
                                          )}
                                        &nbsp;
                                        {bomDetails?.Product?.units}
                                      </td>
                                      {/* <td>{formWatchData?.generatedItems[name]?.unitPrice}</td> */}
                                      <td>
                                        <Form.Item
                                          {...restField}
                                          className="createProductionScreenFormItem"
                                          name={[name, "unitPrice"]}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please Enter a unitPrice",
                                            },
                                            {
                                              validator: (_, value) =>
                                                value >= 0
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "unitPrice should be Equal to or Above Zero"
                                                      )
                                                    ),
                                            },
                                          ]}
                                        >
                                          <Input
                                            disabled
                                            //controls={false}
                                            type="number"
                                          />
                                        </Form.Item>
                                      </td>
                                      <td>
                                        <Form.Item
                                          {...restField}
                                          className="createProductionScreenFormItem"
                                          name={[name, "unitSalePrice"]}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please Enter a Unit Sale Price",
                                            },
                                            {
                                              validator: (_, value) =>
                                                value >= 0
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "Unit Sale Price should be Equal to or Above Zero"
                                                      )
                                                    ),
                                            },
                                            {
                                              validator: (test, value) =>
                                                value >=
                                                formWatchData?.generatedItems[
                                                  name
                                                ]?.unitPrice
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "Sales Price Shouldn't be Less Than Cost Price"
                                                      )
                                                    ),
                                            },
                                          ]}
                                        >
                                          <Input type="number" />
                                        </Form.Item>
                                      </td>
                                      <td>
                                        {(
                                          Number(
                                            formWatchData?.generatedItems[name]
                                              ?.unitPrice
                                          ) *
                                          (Number(bomDetails?.quantity) *
                                            Number(
                                              formWatchData?.productionQuantity
                                            ))
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {
                                          findByProductDetails(name)?.Product
                                            ?.idescription
                                        }
                                      </td>
                                      <td>
                                        {findByProductDetails(name)?.quantity *
                                          Number(
                                            formWatchData?.productionQuantity
                                          )}
                                        &nbsp;
                                        {
                                          findByProductDetails(name)?.Product
                                            ?.units
                                        }
                                      </td>
                                      <td>
                                        <Form.Item
                                          {...restField}
                                          className="createProductionScreenFormItem"
                                          name={[name, "unitPrice"]}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please Enter a unitPrice",
                                            },
                                            {
                                              validator: (_, value) =>
                                                value >= 0
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "unitPrice should be Equal to or Above  Zero"
                                                      )
                                                    ),
                                            },
                                          ]}
                                        >
                                          <Input type="number" />
                                        </Form.Item>
                                      </td>
                                      <td>
                                        <Form.Item
                                          {...restField}
                                          className="createProductionScreenFormItem"
                                          name={[name, "unitSalePrice"]}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please Enter a Unit Sale Price",
                                            },
                                            {
                                              validator: (_, value) =>
                                                value >= 0
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "Unit Sale Price should be Equal to or Above Zero"
                                                      )
                                                    ),
                                            },
                                            {
                                              validator: (test, value) =>
                                                value >=
                                                formWatchData?.generatedItems[
                                                  name
                                                ]?.unitPrice
                                                  ? Promise.resolve()
                                                  : Promise.reject(
                                                      new Error(
                                                        "Sales Price Shouldn't be Less Than Cost Price"
                                                      )
                                                    ),
                                            },
                                          ]}
                                        >
                                          <Input type="number" />
                                        </Form.Item>
                                      </td>
                                      <td>
                                        {(
                                          Number(
                                            formWatchData?.generatedItems[name]
                                              ?.unitPrice
                                          ) *
                                          (Number(
                                            findByProductDetails(name)?.quantity
                                          ) *
                                            Number(
                                              formWatchData?.productionQuantity
                                            ))
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  )
                              )}
                            </>
                          )}
                        </Form.List>
                        <tr>
                          <td colSpan={5} align="right">
                            Total
                          </td>
                          <td>
                            {(
                              formWatchData?.generatedProductUnitTotal *
                              formWatchData?.productionQuantity
                            )?.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <Row>
                      <Col></Col>
                      <Col className="createProductionScreenBox5">
                        <Button
                          type="primary"
                          onClick={form.submit}
                          style={{ marginTop: 20 }}
                          loading={isLoading}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Empty
                    description={"No BOM Combination Selected"}
                    style={{ paddingTop: 30 }}
                  />
                )}
              </Form>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
