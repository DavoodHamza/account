import { Button, Form, FormInstance, InputNumber, Select } from "antd";
import "./styles.scss";
import { useEffect, useState } from "react";
import useDebounce from "../../../utils/useDebounce";
import { useSelector } from "react-redux";
import { GET, POST } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import ProductAddModal from "../../../components/productCreateModal";
import { t } from "i18next";
type Props = {
  onFinish: (val: any) => void;
  form: FormInstance<any>;
  isLoading: boolean;
};
export default function BomForm(props: Props) {
  //props
  const { onFinish, form, isLoading } = props;
  //state
  const { user } = useSelector((state: any) => state.User);
  const [product, setProduct] = useState<any>([]);
  const [meta, setMeta] = useState<any>({});
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [unSelectedProduct, setUnSelectedProduct] = useState<any>([]);
  const [location, setLocation] = useState<any>([]);
  const [locationMeta, setLocationMeta] = useState<any>({});
  const [locationPageSize, setLocationPageSize] = useState<number>(10);
  const [locationPageNo, setLocationPageNo] = useState<number>(1);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [productCreate, setProductCreate] = useState<any>(false);

  //data of the dynamic form list
  //   const compositeItems = Form.useWatch("compositeItems", {
  //     form,
  //   });
  //   const byProductItems = Form.useWatch("byProductItems", {
  //     form,
  //   });

  //useEffect
  useEffect(() => {
    getProduct();
  }, [pageNo, pageSize, useDebounce(searchProduct, 1000)]);

  useEffect(() => {
    getLocation();
  }, [locationPageSize, locationPageNo, useDebounce(searchLocation, 1000)]);

  //function
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

  const getFormCompositeItems = () => {
    return form.getFieldValue("compositeItems");
  };
  const getFormByProductItems = () => {
    return form.getFieldValue("byProductItems");
  };
  const onPopupScroll = (
    e: React.UIEvent<HTMLDivElement>,
    type: "product" | "location"
  ) => {
    e.persist();
    let target = e.target as HTMLDivElement;
    if (
      Math.round(target.scrollTop + target.offsetHeight) === target.scrollHeight
    ) {
      if (type === "product") {
        if (meta?.hasNextPage) {
          setPageSize((prev: number) => prev + 10);
        }
      } else if (type === "location") {
        if (locationMeta?.hasNextPage) {
          setLocationPageSize((prev: number) => prev + 10);
        }
      }
    }
  };
  const onSearchProduct = (val: any) => {
    setSearchProduct(val);
    setPageNo(1);
    setPageSize(10);
  };

  const onSearchLocation = (val: any) => {
    setSearchLocation(val);
    setLocationPageNo(1);
    setLocationPageSize(10);
  };
  const productQueryReset = (open: boolean) => {
    setSearchProduct("");
    setPageNo(1);
    setPageSize(10);
  };

  const locationQueryReset = (open: boolean) => {
    setSearchLocation("");
    setLocationPageNo(1);
    setLocationPageSize(10);
  };
  const findProductUnit = (
    index: number | "mainProduct",
    formListData: any
  ) => {
    //to find value of unit of main product
    if (index === "mainProduct") {
      const mainProduct = form?.getFieldValue("mainProduct");
      if (mainProduct) {
        const productData = product?.find(
          (item: any) => item?.id == mainProduct?.value
        );
        if (productData) {
          return <div>{productData?.unitDetails?.unit}</div>;
        }
      }
    }
    if (index !== "mainProduct" && formListData[index]?.product) {
      const productData = product?.find(
        (item: any) => item?.id == formListData[index]?.product?.value
      );
      if (productData) {
        return <div>{productData?.unitDetails?.unit}</div>;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const findCompositeLineClassName = (index: number) => {
    const compositeItemsLength = getFormCompositeItems().length || 0;
    if (index === 0 && compositeItemsLength - 1 === index) {
      return "compositeItemsBox4";
    } else if (index == 0) {
      return "compositeItemsBox2";
    } else if (compositeItemsLength - 1 === index) {
      return "compositeItemsBox3";
    } else {
      return "compositeItemsBox";
    }
  };
  function onFormValueChange(changedValues: any, allValues: any) {
    setUnSelectedProduct(getUnchosenProducts(product));
  }
  function getUnchosenProducts(products: any) {
    // Collect all chosen product IDs from formdata
    const formdata = form?.getFieldsValue();
    const chosenProductIds = new Set();

    // Add mainProduct to the set
    if (formdata.mainProduct) {
      chosenProductIds?.add(formdata.mainProduct.value);
    }

    // Add compositeItems product IDs to the set
    if (formdata.compositeItems) {
      formdata.compositeItems?.forEach((item: any) =>
        chosenProductIds?.add(item?.product?.value)
      );
    }

    // Add byProductItems product IDs to the set
    if (formdata.byProductItems) {
      formdata.byProductItems?.forEach((item: any) =>
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
  return (
    <Form
      name="compositeProducts"
      onFinish={onFinish}
      //   style={{ maxWidth: 600 }}
      autoComplete="off"
      form={form}
      onValuesChange={onFormValueChange}
    >
      <Row>
        <Col md={6} className={"createCompositeBox1"}>
          <div className="createComposite-Txt1">{t("home_page.homepage.Product")}</div>
          <div
            className={
              !getFormCompositeItems() ||
              getFormCompositeItems()?.length === 0 ||
              getFormCompositeItems()?.length === 1
                ? "createCompositeBox3"
                : "createCompositeBox5"
            }
          >
            <Form.Item
              name="mainProduct"
              className="createCompositeFormItem3"
              rules={[
                {
                  required: true,
                  message: "Please Select a Product",
                },
              ]}
            >
              <Select
                showSearch
                placeholder= {`${t("home_page.homepage.Product")}`}
                // optionFilterProp="label"
                fieldNames={{
                  label: "idescription",
                  value: "id",
                }}
                onDropdownVisibleChange={productQueryReset}
                onSearch={onSearchProduct}
                filterOption={false}
                labelInValue
                options={unSelectedProduct}
                onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                  onPopupScroll(e, "product")
                }
                listHeight={200}
                dropdownRender={(menu) => (
                  <>
                    <Button
                      icon={<PlusOutlined />}
                      style={{ width: "100%", marginBottom: 10 }}
                      onClick={() => setProductCreate(true)}
                    >
                      {t("home_page.homepage.AddProduct")}
                     
                    </Button>
                    {menu}
                    {/* <div className="createCompositeBox8">
                          <Spin
                            indicator={<LoadingOutlined spin />}
                            size="small"
                          />
                        </div> */}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              className="createCompositeFormItem3"
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
                placeholder={`${t("home_page.homepage.Qantity")}`}
                controls={false}
                type="number"
                addonAfter={findProductUnit(
                  "mainProduct",
                  getFormCompositeItems()
                )}
              />
            </Form.Item>
            {!getFormCompositeItems() ||
            getFormCompositeItems()?.length === 0 ? null : (
              <div className="createCompositeline1" />
            )}
          </div>
        </Col>
        <Col md={6} className={"createCompositeBox2"}>
          <Form.List name="compositeItems">
            {(fields, { add, remove }) => (
              <>
                <div className="createComposite-Txt2"> {t("home_page.homepage.RawMaterial")}</div>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className={findCompositeLineClassName(index)}>
                    <div className="createCompositeline2" />
                    <Form.Item
                      className="createCompositeFormItem1"
                      {...restField}
                      name={[name, "product"]}
                      rules={[
                        {
                          required: true,
                          message: "Select a product",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder={`${t("home_page.homepage.Product")}`}
                        options={unSelectedProduct}
                        fieldNames={{
                          label: "idescription",
                          value: "id",
                        }}
                        labelInValue
                        onDropdownVisibleChange={productQueryReset}
                        onSearch={onSearchProduct}
                        filterOption={false}
                        onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                          onPopupScroll(e, "product")
                        }
                        listHeight={200}
                        dropdownRender={(menu) => (
                          <>
                            <Button
                              icon={<PlusOutlined />}
                              style={{ width: "100%", marginBottom: 10 }}
                              onClick={() => setProductCreate(true)}
                            >
                              
                              {t("home_page.homepage.AddProduct")}
                            </Button>
                            {menu}
                          </>
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      className="createCompositeFormItem1"
                      {...restField}
                      name={[name, "quantity"]}
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
                        placeholder={`${t("home_page.homepage.Qantity")}`}
                        controls={false}
                        type="number"
                        addonAfter={findProductUnit(
                          index,
                          getFormCompositeItems()
                        )}
                      />
                    </Form.Item>

                    <div className="createCompositeBox9">
                      <MinusCircleOutlined
                        className="createCompositeIcon1"
                        onClick={() => remove(name)}
                      />
                    </div>
                    <div className="createCompositeBox10">
                      <Button
                        type="text"
                        onClick={() => remove(name)}
                        icon={<MdDelete style={{ marginBottom: 3 }} />}
                        danger
                      >
                           {t("home_page.homepage.Remove")}
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="createCompositeBtn1">
                  <Button
                    style={{
                      width: "100%",
                    }}
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                      {t("home_page.homepage.AddComposite")}
                  </Button>
                </div>
              </>
            )}
          </Form.List>
          {/* <Form.Item></Form.Item> */}
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col md={6} className={"createCompositeBox1"}></Col>
        <Col md={6} className={"createCompositeBox2"}>
          <Form.List name="byProductItems">
            {(fields, { add, remove }) => (
              <>
                <div className="createComposite-Txt3">{t("home_page.homepage.ByProduct")} </div>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className={"compositeItemsBox4"}>
                    <div className="createCompositeBox6">
                      <Form.Item
                        className="createCompositeFormItem1"
                        {...restField}
                        name={[name, "product"]}
                        rules={[
                          {
                            required: true,
                            message: "Select a product",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder= {`${t("home_page.homepage.Product")}`}
                          //   onSearch={onSearch}
                          options={unSelectedProduct}
                          fieldNames={{
                            label: "idescription",
                            value: "id",
                          }}
                          onDropdownVisibleChange={productQueryReset}
                          labelInValue
                          onSearch={onSearchProduct}
                          filterOption={false}
                          onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                            onPopupScroll(e, "product")
                          }
                          listHeight={200}
                          dropdownRender={(menu) => (
                            <>
                              <Button
                                icon={<PlusOutlined />}
                                style={{ width: "100%", marginBottom: 10 }}
                                onClick={() => setProductCreate(true)}
                              >
                          {t("home_page.homepage.AddProduct")}

                              </Button>
                              {menu}
                            </>
                          )}
                        />
                      </Form.Item>
                      <Form.Item
                        className="createCompositeFormItem1"
                        {...restField}
                        name={[name, "quantity"]}
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
                          placeholder= {`${t("home_page.homepage.Qantity")}`}
                          controls={false}
                          type="number"
                          addonAfter={findProductUnit(
                            index,
                            getFormByProductItems()
                          )}
                        />
                      </Form.Item>
                    </div>
                    <div className="createCompositeBox9">
                      <MinusCircleOutlined
                        className="createCompositeIcon1"
                        onClick={() => remove(name)}
                      />
                    </div>
                    <div className="createCompositeBox10">
                      <Button
                        type="text"
                        onClick={() => remove(name)}
                        icon={<MdDelete style={{ marginBottom: 3 }} />}
                        danger
                      >
                          {t("home_page.homepage.Remove")}
                      </Button>
                    </div>
                  </div>
                ))}
                <div>
                  <Button
                    style={{
                      width: "100%",
                    }}
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    {t("home_page.homepage.AddByProduct")}
                  </Button>
                </div>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
      <br />
      <br />
      <div className="detailsCompositeBox9">
        <Row>
          <Col md={6}>
            <Form.Item
              label={t("home_page.homepage.Production_Location")} 
              name="production_location"
              className="createCompositeFormItem2"
            >
              <Select
                showSearch
                placeholder={t("home_page.homepage.Location")}
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
          </Col>
          <Col md={6}>
            <Form.Item
              label={t("home_page.homepage.Consumption_Location")}
              name="consumption_location"
              className="createCompositeFormItem2"
            >
              <Select
                showSearch
                placeholder={t("home_page.homepage.Location")}
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
          </Col>
        </Row>
      </div>
      <br />
      <Row>
        <Col></Col>
        <Col className="createCompositeBox4">
          <Button
            type="primary"
            onClick={form.submit}
            style={{ marginTop: 20 }}
            loading={isLoading}
          > 
           {t("home_page.homepage.submit")}
          
          </Button>
        </Col>
      </Row>
      {productCreate ? (
        <ProductAddModal
          open={productCreate}
          onCancel={() => setProductCreate(false)}
          productRefrush={() => getProduct()}
          type={"Nonstock"}
        />
      ) : null}
    </Form>
  );
}
