import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Upload,
  notification,
} from "antd";
import moment from "moment";
import LogoPicker from "../../proposal/components/LogoPicker";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CiImageOff } from "react-icons/ci";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET, POST, POST2, PUT } from "../../../utils/apiCalls";
import CreateSettings from "../../settings/components/form";

function ProductAdd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { service: path, id, type } = useParams();
  const { user } = useSelector((state: any) => state.User);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [category, setCategory] = useState([]);
  const [ledgerCategoryList, setLedgerCategoryList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [taxlist, setTaxlist] = useState([]);
  const [includeVats, setIncludeVat] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [formType, setFormType] = useState();
  const [locationdata, setLocationData] = useState<any>([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [stock, setStock] = useState<any>();
  const [stockQuantity, setStockQuantity] = useState<any>();
  const [img, setImg] = useState(null);
  const [toggle, toggleModal] = useState(false);

  let businessStartDate = user?.companyInfo?.financial_year_start
    ? user?.companyInfo?.financial_year_start
    : user?.companyInfo?.books_begining_from;

  const LoadCategory = async () => {
    let URL =
      API.PRODUCTCATEGORY_LIST_USER + `${user?.id}/${user?.companyInfo?.id}`;
    const { data }: any = await GET(URL, null);
    let filteredData;
    if (path === "Service") {
      filteredData = data.filter(
        (item: any) => item.categoryType === "service"
      );
    } else {
      filteredData = data.filter(
        (item: any) => item.categoryType === "product"
      );
    }
    setCategory(filteredData);
    form.setFieldsValue({
      product_category: "",
    });
  };

  const LoadUnit = async () => {
    let URL = API.UNIT_LIST_USER + `${user?.id}/${user?.companyInfo?.id}`;
    const { data }: any = await GET(URL, null);
    setUnit(data);
    form.setFieldsValue({
      unit: "",
    });
  };

  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(URL, null);
      setTaxlist(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getLedger = async (val: any) => {
    try {
      let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
      const response: any = await GET(url, null);
      const filteredLedgers = response.data.filter(
        (item: any) => item?.nominalcode?.toString() === val?.toString()
      );
      return filteredLedgers;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductByLocation = async (locationId: number) => {
    try {
      let url = API.GET_ONE_PRODUCT_BY_LOCATION + `${id}/${locationId}`;
      const response: any = await GET(url, null);
      if (response.status) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const loadProductById = async () => {
    setIsLoading2(true);
    let URL = API.GET_PRODUCT_MASTER_BY_ID + id;
    const { data }: any = await GET(URL, null);
    setStock(data?.stock);
    setStockQuantity(data?.stockquantity);
    let rate = Number(data?.sp_price);
    let vatPercent = Number(data?.vat);
    let totalPrice;
    if (rate && vatPercent) {
      let vatAmount: any = rate * (vatPercent / 100);
      if (data.includevat === "1.00") {
        vatAmount = (rate / (100 + vatPercent)) * 100;
        vatAmount = (rate - vatAmount).toFixed(2);
        totalPrice = Number(rate.toFixed(2));
        rate = rate - vatAmount;
      } else {
        totalPrice = Number(rate + vatAmount).toFixed(2);
      }
      form.setFieldsValue({
        vatamt: Number(vatAmount),
        total_price: Number(totalPrice),
      });
    }
    let ledgerData = await getLedger(data?.saccount);
    let locationwiseDetails: any = [];
    let locationData = data?.location?.split("|")?.map(Number) || [];

    for (let i = 0; i < locationData?.length; i++) {
      const element = locationData[i];
      const details = await fetchProductByLocation(element);
      let obj ;
      if(data?.itemtype === "Stock"){
         obj = {
          location_stock: details?.stock,
          location: JSON.stringify(details?.locationDetails),
          productLocationId: details.id,
        };
      }else if(data?.itemtype === "Nonstock"){
        obj = JSON.stringify(details?.locationDetails)
      }
      locationwiseDetails.push(obj);
    }
    form.setFieldsValue({
      includevat: data?.includevat === "1.00" ? true : false,
      icode: data?.icode,
      idescription: data?.idescription,
      product_category: data?.product_category,
      unit: data?.unit,
      barcode: data?.barcode,
      locations: locationwiseDetails,
      saccount: ledgerData[0]?.nominalcode,
      notes: data?.notes,
      sp_price: data?.sp_price,
      vat: data?.vat,
      wholesale: data?.wholesale,
      costprice: data?.c_price,
      rlevel: data?.rlevel,
      quantity: data?.quantity,
      stockquantity: data?.stockquantity,
      rquantity: data?.rquantity,
      stock: data?.quantity,
      c_price: data?.c_price,
      cost_price_with_vat: data?.cost_price_with_vat,
      rate: data?.sp_price,
      hsn_code: data?.hsn_code,
    });
    setImg(data?.pimage);
    setIsLoading2(false);
  };

  const onFinish = async (val: any) => {
    try {
      let noStockLocationData: any = [];
      let locationString : string = "";
      if (path === "Stock") {
        locationString = val?.locations
          ?.map((item: any) => JSON.parse(item?.location)?.id)
          .join("|");
      } else if (path === "Nonstock") {
        val?.locations?.map((item: any) => {
          let newObj = {
            location: item,
            location_stock: 0,
          };
          noStockLocationData.push(newObj);
        });

        locationString = val?.locations
          ?.map((item: any) => JSON.parse(item).id)
          .join("|");
      }

      setIsLoading(true);

      let reqObj = {
        itemtype: path,
        icode: val.icode || "",
        idescription: val.idescription,
        saccount: Number(val.saccount) || 4000,
        price: 0,
        sp_price: val.sp_price,
        c_price: Number(val.c_price) || 0,
        trade_price: 0,
        rate: val.sp_price,
        notes: val.notes,
        type: path,
        logintype: "user",
        paccount: 0,
        includevat: val.includevat === true ? 1 : 0,
        userid: user.id,
        adminid: user?.id,
        vat: Number(val.vat),
        vatamt: Number(val.vatamt),
        product_category: val.product_category,
        existingstock: false,
        costprice: val.c_price,
        wholesale: val.wholesale,
        rlevel: val.rlevel,
        quantity: val.quantity,
        stockquantity: val.stockquantity,
        rquantity: val.rquantity,
        stock:
          path == "Stock"
            ? id == "create"
              ? val?.stockquantity
              : stock
              ? stock - stockQuantity + val.stockquantity
              : val.stockquantity
            : val.quantity,
        date: moment(businessStartDate).format("YYYY-MM-DD"),
        unit: val.unit,
        location: locationString,
        barcode: val.barcode,
        pimage: img,
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
        hsn_code: user?.companyInfo?.tax === "gst" ? val.hsn_code : null,
        product_loctions:
          path === "Nonstock" ? noStockLocationData : val?.locations,
      };

      let URL = type === "create" || type === "duplicate"
          ? API.ADD_PRODUCT
          : API.GET_PRODUCT_UPDATE + id;
      let METHOD = type === "create" || type === "duplicate" ? POST : PUT;
      const response: any = await METHOD(URL, reqObj);
      if (response.status) {
        notification.success({
          message: "Success",
          description:
            response.data.itemtype === "Service"
              ? "Service created successfully"
              : response.message,
        });
        setIsLoading(false);
        navigate(-1);
      } else {
        notification.error({
          message:
            path === "Service"
              ? "Failed to create service"
              : "Failed to create product",
          description: response.message,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          path === "Service"
            ? "Failed to create service"
            : "Failed to create product",
      });
      setIsLoading(false);
    }
  };

  const onValuesChange = async (val: any, arr: any) => {
    let rate = Number(arr.sp_price);
    let vatPercent = Number(arr.vat);
    let cost_price = Number(arr.c_price);
    let cost_price_with_vat;
    let totalPrice;
    let vatAmount: any;

    // Sum the values in the stock fields
    const totalStock: any = arr?.locations?.reduce(
      (total: number, location: any) => {
        // Convert the location_stock string to number
        const stock = parseFloat(location?.location_stock || 0);
        return total + stock;
      },
      0
    );

    if (rate && (vatPercent || Number(vatPercent) === 0)) {
      vatAmount = rate * (vatPercent / 100);
      let c_p_vatAmount: any = cost_price * (vatPercent / 100);
      if (val?.includevat || arr?.includevat) {
        vatAmount = (rate / (100 + vatPercent)) * 100;
        c_p_vatAmount = (cost_price / (100 + vatPercent)) * 100;

        vatAmount = (rate - vatAmount).toFixed(2);
        c_p_vatAmount = (cost_price - vatAmount).toFixed(2);

        totalPrice = Number(rate.toFixed(2));
        cost_price_with_vat = Number(cost_price.toFixed(2));

        rate = rate - vatAmount;
        cost_price = cost_price - c_p_vatAmount;
      } else {
        totalPrice = Number(rate + vatAmount).toFixed(2);
        cost_price_with_vat = Number(cost_price + c_p_vatAmount).toFixed(2);
      }
    }
    form.setFieldsValue({
      vatamt: Number(vatAmount).toFixed(2),
      cgst: Number(vatAmount) / 2,
      sgst: Number(vatAmount) / 2,
      total_price: Number(totalPrice).toFixed(2),
      cost_price_with_vat: Number(cost_price_with_vat).toFixed(2),
      stockquantity: totalStock,
    });
  };

  const checkIfItemExist = async (type: any, item: any) => {
    if (item?.length > 2) {
      let url =
        API.CHECK_IF_EXIST +
        `${user?.id}/${user?.companyInfo?.id}/${type}/${item}`;
      const res: any = await GET(url, null);
      if (res.status) {
        notification.error({
          message: res.message,
          description: `Please choose different one`,
        });
      }
    }
  };

  const ledgerCategoryDetails = async () => {
    try {
      let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
      const response: any = await GET(url, null);
      setLedgerCategoryList(response.data);
    } catch(error) {
      console.log(error)
    }
  };

  const fetchHsnCodes = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.HSN_CODE_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setHsnCodes(data);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    ledgerCategoryDetails();
    LoadCategory();
    loadTaxList();
    LoadUnit();
    fetchUnits();
    fetchHsnCodes();
    if (type !== "create") {
      loadProductById();
    }
  }, []);
  const addCategory = (val: any) => {
    let type: any =
      val === "unit"
        ? "unit"
        : val === "productCategory"
        ? "productCategory"
        : val === "tax"
        ? "tax"
        : val === "location"
        ? "location"
        : "hsnCode";
    if (val?.toString() === type?.toString()) {
      setFormType(type);
      setIsForm(true);
    }
  };

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setLocationData(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // const onUpload = async (info: any) => {
  //   const { file } = info;
  //   if (file.status !== "uploading") {
  //     await uploadLogo(file.originFileObj);
  //   }
  // };

  // const uploadLogo = async (imagedata: any) => {
  //   var formdata = new FormData();
  //   setLoading(true);
  //   formdata.append("productid", "create");
  //   formdata.append("file", imagedata, imagedata.name);
  //   let graphData_url = API.PRODUCTMASTER_IMAGE_UPLOADER;
  //   try {
  //     const { data }: any = await POST2(graphData_url, formdata);

  //     if (data?.location) {
  //       setLoading(false);
  //       setImage(data.location);
  //       notification.success({
  //         message: " Image Uploaded",
  //         description: "Your image has been uploaded successfully.",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <PageHeader
        onSubmit={() => navigate("/usr/create-product/service/0")}
        goBack={"/usr/productStock"}
        title={
          type === "create" || type === "duplicate"
            ? `${t("home_page.homepage.Create")}` + path
            : `${t("home_page.homepage.Update")}` + path
        }
        secondPathLink={`/usr/product${path}`}
        secondPathText={
          type === "create" || type === "duplicate"
            ? `Add ${path} `
            : `Update ${path} `
        }
      />
      {isLoading2 ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <div className="adminTable-Box1">
            <div className="adminTable-Box2">
              <Card>
                <Form
                  {...layout}
                  form={form}
                  initialValues={{
                    date: businessStartDate ? moment(businessStartDate) : null,
                  }}
                  onFinish={onFinish}
                  onValuesChange={onValuesChange}
                >
                  <Row>
                    <Col md={4}>
                      <div className="productAdd-Txt1">
                        {path === "Service"
                          ? "SERVICE"
                          : `${t("home_page.homepage.product")}`}{" "}
                        {t("home_page.homepage.INFORMATION")}
                      </div>
                      {path?.toString() !== "Asset" ? (
                        <div className="formItem">
                          <label className="formLabel">
                            {t("home_page.homepage.Item_Code")}
                          </label>
                          <Form.Item name="icode">
                            <Input
                              style={{ width: "100%" }}
                              onChange={(val) =>
                                checkIfItemExist("icode", val.target.value)
                              }
                            />
                          </Form.Item>
                        </div>
                      ) : null}

                      <div className="formItem">
                        <label className="formLabel">
                          {t("home_page.homepage.Item_Name")}
                        </label>
                        <Form.Item
                          name="idescription"
                          rules={[
                            {
                              required: true,
                              message: `${t(
                                "home_page.homepage.Please_enter_a_Item_Name"
                              )}`,
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            onChange={(val) =>
                              checkIfItemExist("idescription", val.target.value)
                            }
                          />
                        </Form.Item>
                      </div>
                      {path?.toString() !== "Asset" ? (
                        <>
                          {user?.companyInfo?.tax === "gst" && (
                            <div className="formItem">
                              <label className="formLabel">HSN/SAC Code</label>
                              <Form.Item
                                name="hsn_code"
                                rules={[
                                  {
                                    required: true,
                                    message: "Choose HSN/SAC code",
                                  },
                                ]}
                              >
                                <Select
                                allowClear
                                 dropdownRender={(menu) => (
                                  <div>
                                    {menu}
                                    <div
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      <Button
                                        style={{
                                          display: "block",
                                          fontSize: 15,
                                          width: "100%",
                                        }}
                                        type="primary"
                                        onClick={() => addCategory("hsnCode")}
                                      >
                                          Add HSN/SAC
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                >
                                  {hsnCodes?.length &&
                                    hsnCodes?.map((item: any) => (
                                      <Select.Option
                                        value={item.hsn_code}
                                        key={item.id}
                                      >
                                        {item.hsn_code} - {item.description}
                                      </Select.Option>
                                    ))}
                                </Select>
                              </Form.Item>
                            </div>
                          )}
                          <div className="formItem">
                            <label className="formLabel">
                              {path === "Service"
                                ? t("home_page.homepage.Service_Category")
                                : t("home_page.homepage.Product_Category")}
                            </label>
                            <Form.Item
                              name="product_category"
                              rules={[
                                {
                                  required: true,
                                  message: `${
                                    path === "Service"
                                      ? t(
                                          "home_page.homepage.Please_enter_Service_Category"
                                        )
                                      : t(
                                          "home_page.homepage.Please_enter_Product_Category"
                                        )
                                  }`,
                                },
                              ]}
                            >
                              <Select
                              allowClear
                              showSearch
                               dropdownRender={(menu) => (
                                <div>
                                  {menu}
                                  <div
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    <Button
                                      style={{
                                        display: "block",
                                        fontSize: 15,
                                        width: "100%",
                                      }}
                                      type="primary"
                                      onClick={() => addCategory("productCategory")}
                                    >
                                       {t("home_page.homepage.add_category")}
                                    </Button>
                                  </div>
                                </div>
                              )}
                              >
                                {category?.length &&
                                  category?.map((item: any) => (
                                    <Select.Option
                                      value={item.id}
                                      key={item.id}
                                    >
                                      {item.category}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </div>
                        </>
                      ) : null}

                      {path === "Asset" ? (
                        <div className="formItem">
                          <label className="formLabel">
                            {t("home_page.homepage.Ledger_Category")}{" "}
                          </label>
                          <Form.Item
                            name="saccount"
                            rules={[
                              {
                                required: true,
                                message: `${t(
                                  "home_page.homepage.Please_enter_Ledger_Category"
                                )}`,
                              },
                            ]}
                          >
                            <Select onChange={addCategory} allowClear>
                              {ledgerCategoryList?.length &&
                                ledgerCategoryList?.map((item: any) => (
                                  <Select.Option key={item.nominalcode}>
                                    {item.laccount}
                                  </Select.Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </div>
                      ) : null}
                      {path?.toString() !== "Service" &&
                      path?.toString() !== "Asset" ? (
                        <>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Unit")}
                            </label>
                            <Form.Item
                              name="unit"
                              rules={[
                                {
                                  required: true,
                                  message: `${t(
                                    "home_page.homepage.Please_enter_a_Unit"
                                  )}`,
                                },
                              ]}
                            >
                              <Select
                                allowClear
                                showSearch
                                dropdownRender={(menu) => (
                                  <div>
                                    {menu}
                                    <div
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      <Button
                                        style={{
                                          display: "block",
                                          fontSize: 15,
                                          width: "100%",
                                        }}
                                        type="primary"
                                        onClick={() => addCategory("unit")}
                                      >
                                        {t("home_page.homepage.Add_Unit")}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              >
                                {unit?.length &&
                                  unit?.map((item: any) => (
                                    <Select.Option
                                      value={item.id}
                                      key={item.id}
                                    >
                                      {item.unit}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Barcode")}
                            </label>
                            <Form.Item name="barcode">
                              <Input
                                style={{ width: "100%" }}
                                // onInput={(e) => {
                                //   e.currentTarget.value =
                                //     e.currentTarget.value.replace(
                                //       /[^0-9]/g,
                                //       ""
                                //     );
                                // }}
                              />
                            </Form.Item>
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Location")}
                            </label>
                            {path === "Nonstock" ? (
                              <Form.Item
                                name="locations"
                                rules={[
                                  {
                                    required: true,
                                    message: `${t(
                                      "home_page.homepage.Please_enter_a_Location"
                                    )}`,
                                  },
                                ]}
                              >
                                <Select
                                  mode="multiple"
                                  allowClear
                                  showSearch
                                  dropdownRender={(menu) => (
                                    <div>
                                      {menu}
                                      <div style={{ textAlign: "center" }}>
                                        <Button
                                          style={{
                                            display: "block",
                                            fontSize: 15,
                                            width: "100%",
                                          }}
                                          type="primary"
                                          onClick={() =>
                                            addCategory("location")
                                          }
                                        >
                                          {t("home_page.homepage.Add_Location")}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  {locationdata?.length &&
                                    locationdata?.map((item: any) => (
                                      <Select.Option
                                        value={JSON.stringify(item)}
                                        key={item?.id}
                                      >
                                        {item.location}
                                      </Select.Option>
                                    ))}
                                </Select>
                              </Form.Item>
                            ) : (
                              <Form.List name="locations" initialValue={[{}]}>
                                {(fields, { add, remove }) => (
                                  <>
                                    {fields?.map(
                                      ({ key, name, ...restField }) => (
                                        <>
                                          <Row>
                                            <Col
                                              md={path === "Nonstock" ? 10 : 6}
                                            >
                                              <Form.Item
                                                {...restField}
                                                name={[name, "location"]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: `${t(
                                                      "home_page.homepage.Please_enter_a_Location"
                                                    )}`,
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  allowClear
                                                  showSearch
                                                  dropdownRender={(menu) => (
                                                    <div>
                                                      {menu}
                                                      <div
                                                        style={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        <Button
                                                          style={{
                                                            display: "block",
                                                            fontSize: 15,
                                                            width: "100%",
                                                          }}
                                                          type="primary"
                                                          onClick={() =>
                                                            addCategory(
                                                              "location"
                                                            )
                                                          }
                                                        >
                                                          {t(
                                                            "home_page.homepage.Add_Location"
                                                          )}
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  )}
                                                >
                                                  {locationdata?.map(
                                                    (item: any) => (
                                                      <Select.Option
                                                        value={JSON.stringify(
                                                          item
                                                        )}
                                                        key={item?.id}
                                                        disabled={item?.disable}
                                                      >
                                                        {item?.location}
                                                      </Select.Option>
                                                    )
                                                  )}
                                                </Select>
                                              </Form.Item>
                                            </Col>
                                            {path !== "Nonstock" && (
                                              <Col md={4}>
                                                <Form.Item
                                                  {...restField}
                                                  name={[
                                                    name,
                                                    "location_stock",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "stock is required",
                                                    },
                                                  ]}
                                                >
                                                  <Input placeholder="Stock" />
                                                </Form.Item>
                                              </Col>
                                            )}

                                            <Col md={2}>
                                              <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{
                                                  fontSize: 22,
                                                  color: "red",
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        </>
                                      )
                                    )}
                                    <Form.Item>
                                      <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                      >
                                        Add Location
                                      </Button>
                                    </Form.Item>
                                  </>
                                )}
                              </Form.List>
                            )}
                          </div>
                        </>
                      ) : null}
                      <div className="formItem">
                        <label className="formLabel">
                          {t("home_page.homepage.Notes")}
                        </label>
                        <Form.Item name="notes">
                          <Input.TextArea rows={3} style={{ width: "100%" }} />
                        </Form.Item>
                      </div>
                    </Col>

                    <Col md={4}>
                      {path?.toString() !== "Asset" ? (
                        <>
                          <div className="productAdd-Txt1">
                            {t("home_page.homepage.SALES_INFORMATION")}
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {path === "Service"
                                ? "Rate"
                                : `${t("home_page.homepage.Sale_Price")}`}{" "}
                            </label>
                            <Form.Item
                              name="sp_price"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Please enter a Rate",
                              //   },
                              // ]}
                            >
                              <InputNumber
                                type="number"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {user?.companyInfo?.tax === "vat"
                                ? t("home_page.homepage.Vat")
                                : "GST %"}
                            </label>
                            <Form.Item
                              name="vat"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    user?.companyInfo?.tax === "vat"
                                      ? "Please choose Vat"
                                      : "Please choose GST",
                                },
                              ]}
                            >
                              <Select
                                allowClear
                                dropdownRender={(menu) => (
                                  <div>
                                    {menu}
                                    <div style={{ textAlign: "center" }}>
                                      <Button
                                        style={{
                                          display: "block",
                                          fontSize: 15,
                                          width: "100%",
                                        }}
                                        type="primary"
                                        onClick={() => addCategory("tax")}
                                      >
                                        {user?.companyInfo?.tax === "vat"
                                          ? "Add Vat"
                                          : "Add GST"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              >
                                {taxlist?.length &&
                                  taxlist?.map((item: any) => (
                                    <Select.Option key={item?.percentage}>
                                      {`${item?.percentage} %`}
                                    </Select.Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div
                            className=""
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <label className="formLabel">
                              {user?.companyInfo?.tax === "vat"
                                ? t(
                                    "home_page.homepage.Select_if_sales_price_inc_vat"
                                  )
                                : "Select if sales price inc. tax"}
                            </label>
                            <Form.Item
                              name="includevat"
                              style={{ border: 0, margin: 0 }}
                              valuePropName="checked"
                            >
                              <Checkbox
                                onChange={(e) => {
                                  form.setFieldsValue({
                                    includevat: e.target.checked,
                                  });
                                  setIncludeVat(!includeVats);
                                }}
                                checked={includeVats}
                              />
                            </Form.Item>
                          </div>

                          <div className="formItem">
                            <label className="formLabel">
                              {user?.companyInfo?.tax === "gst"
                                ? "Total GST amount"
                                : t("home_page.homepage.Vat_Amount")}
                            </label>
                            <Form.Item name="vatamt">
                              <InputNumber
                                readOnly
                                type="number"
                                disabled={includeVats}
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Total_Price")}
                            </label>
                            <Form.Item name="total_price">
                              <InputNumber
                                readOnly
                                type="number"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </div>
                        </>
                      ) : null}

                      {path?.toString() === "Stock" ? (
                        <>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Reorder_Level")}
                            </label>
                            <Form.Item name="rlevel">
                              <InputNumber
                                type="number"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </div>
                          <div className="formItem">
                            <label className="formLabel">
                              {t("home_page.homepage.Reorder_Quantity")}
                            </label>
                            <Form.Item name="rquantity">
                              <InputNumber
                                type="number"
                                controls={false}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </div>
                        </>
                      ) : null}
                    </Col>

                    <Col md={4}>
                      {path?.toString() === "Stock" ||
                      path?.toString() === "Nonstock" ||
                      path === "Service" ? (
                        <>
                          <div className="productAdd-Txt1">
                            {path === "Stock"
                              ? `${t("home_page.homepage.OPENING_BALANCE")}`
                              : t("home_page.homepage.Upload_Image")}
                          </div>
                          {path === "Stock" ? (
                            <>
                              <div className="formItem">
                                <label className="formLabel">
                                  {t("home_page.homepage.Quantity_On_Hand")}
                                </label>
                                <Form.Item
                                  name="stockquantity"
                                  rules={[
                                    {
                                      required: true,
                                      message: `${t(
                                        "home_page.homepage.Please_enter_a_Quantity_On_Hand"
                                      )}`,
                                    },
                                    {
                                      type: "number",
                                      min: 1,
                                      message: `${t(
                                        "Quantity must be greater than 0"
                                      )}`,
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    type="number"
                                    controls={false}
                                    style={{ width: "100%" }}
                                    readOnly
                                  />
                                </Form.Item>
                              </div>
                              <div className="formItem">
                                <label className="formLabel">
                                  {t("home_page.homepage.Cost_Price")}
                                </label>
                                <Form.Item
                                  name="c_price"
                                  rules={[
                                    {
                                      required: true,
                                      message: `${t(
                                        "home_page.homepage.Please_enter_a_Cost_Price"
                                      )}`,
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    type="number"
                                    controls={false}
                                    style={{ width: "100%" }}
                                  />
                                </Form.Item>
                              </div>

                              <div className="formItem">
                                <label className="formLabel">
                                  {t(
                                    "home_page.homepage.Business_Starting_Date"
                                  )}
                                </label>
                                <Form.Item
                                  name="date"
                                  rules={[
                                    {
                                      required: true,
                                      message: `${t(
                                        "home_page.homepage.Please_add_business_starting_date"
                                      )}`,
                                    },
                                  ]}
                                >
                                  {!businessStartDate ? (
                                    <Button
                                      onClick={() =>
                                        navigate(
                                          "/usr/company-profile/accounting"
                                        )
                                      }
                                    >
                                      {t(
                                        "home_page.homepage.Add_Business_Starting_Date"
                                      )}
                                    </Button>
                                  ) : (
                                    <DatePicker
                                      style={{ width: "100%" }}
                                      format={"YYYY-MM-DD"}
                                      // disabled={businessStartDate}
                                    />
                                  )}
                                </Form.Item>
                              </div>
                            </>
                          ) : null}
                          <div className="ProductAdd-Box1">
                            <div>
                                {img ? (
                                  <div className="ProductAdd-Box2">
                                    <img
                                      className="ProductAdd-Img"
                                      src={img}
                                      alt=""
                                    />
                                  </div>
                                ) : (
                                  <div className="ProductAdd-Box2">
                                    <CiImageOff
                                      size={100}
                                      color="rgb(160 158 158)"
                                     
                                    />
                                  </div>
                                )}
                            </div>

                            <hr />

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                                <br />
                                <p>
                                  <MdOutlinePhotoCamera
                                    size="20"
                                    color="rgb(160 158 158)"
                                    onClick={() => toggleModal(true)}
                                  />
                                  &nbsp;
                                  {t(
                                    "home_page.homepage.Image_Upload_Here"
                                  )}{" "}
                                  <br />
                                </p>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </Col>
                    <Col md={path?.toString() === "Stock" ? 8 : 6}></Col>
                    <Col md={path?.toString() === "Stock" ? 2 : 3}>
                      <br />
                      <br />
                      <Button onClick={() => navigate(-1)} block size="large">
                        {t("home_page.homepage.Cancel")}
                      </Button>
                    </Col>
                    <Col md={path?.toString() === "Stock" ? 2 : 3}>
                      <br />
                      <br />
                      <Button
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                      >
                        {type === "create" || type === "duplicate"
                          ? `${t("home_page.homepage.submit")}`
                          : `${t("home_page.homepage.Update")}`}
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <LogoPicker
                  open={toggle}
                  modalClose={() => toggleModal(false)}
                  form={form}
                  setImg={setImg}
                />
              </Card>
            </div>
          </div>
        </Container>
      )}
      ;
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => setIsForm(false)}
          source={
            formType === "productCategory"
              ? path === "Service"
                ? "serviceCategory"
                : "productCategory"
              : formType
          }
          initalValue={
            formType === "productCategory"
              ? path === "Service"
                ? { categoryType: "service" }
                : { categoryType: "product" }
              : null
          }
          id={"create"}
          reload={
            formType === "unit"
              ? LoadUnit
              : formType === "productCategory" || formType === "serviceCategory"
              ? LoadCategory
              : formType === "tax"
              ? loadTaxList
              : formType === "hsnCode"
              ? fetchHsnCodes
              : fetchUnits
          }
        />
      ) : null}
    </>
  );
}
export default ProductAdd;
