import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import CreateSettings from "../../app/settings/components/form";
import { CiImageOff } from "react-icons/ci";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useSelector } from "react-redux";
import API from "../../config/api";
import { GET, POST, POST2 } from "../../utils/apiCalls";

function ProductAddModal({ open, onCancel, productRefrush, type }: any) {
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const [isForm, setIsForm] = useState(false);

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [ledgerCategoryList, setLedgerCategoryList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [taxlist, setTaxlist] = useState([]);
  const [includeVats, setIncludeVat] = useState(false);
  const [image, setImage] = useState();
  const [locationdata, setLocationData] = useState([]);
  const [hsnCodes, setHsnCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState();

  const businessStartDate: any = user?.companyInfo?.books_begining_from
    ? user?.companyInfo?.books_begining_from
    : user?.companyInfo?.financial_year_start;

  const LoadCategory = async () => {
    let URL =
      API.PRODUCTCATEGORY_LIST_USER +
      `${user?.id}/${user?.companyInfo?.id}`;
    const data: any = await GET(URL, null);
    setCategory(data.data);
    form.setFieldsValue({
      product_category: "",
    });
  };

  const LoadUnit = async () => {
    let URL = API.UNIT_LIST_USER + `${user?.id}/${user?.companyInfo?.id}`;
    const data: any = await GET(URL, null);
    setUnit(data.data);
    form.setFieldsValue({
      unit: "",
    });
  };

  const loadTaxList = async () => {
    try {
      let URL =
        API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(URL, null);
      setTaxlist(data.data);
    } catch (error) {
      console.log(error);
    }
  };
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
    if (val == type) {
      setFormType(type);
      setIsForm(true);
    }
  };
  // const getLedger = async (val: any) => {
  //   try {
  //     let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
  //     const response: any = await GET(url, null);
  //     const filteredLedgers = response.data.filter(
  //       (item: any) => item?.nominalcode == val
  //     );
  //     return filteredLedgers;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let reqObj = {
        itemtype: type,
        icode: val.icode || "",
        idescription: val.idescription,
        saccount: Number(val.saccount) || 4000, //
        price: 0, //
        sp_price: val.sp_price,
        c_price: Number(val.c_price) || 0, //
        trade_price: 0, //
        rate: val.sp_price, //
        notes: val.notes, //
        type: type, //
        logintype: "user",
        paccount: 0,
        includevat: val.includevat === true ? 1 : 0,
        userid: user.id,
        adminid: user?.id,
        vat: Number(val.vat) || 0,
        vatamt: Number(val.vatamt),
        product_category: val.product_category,
        existingstock: false,
        costprice: val.c_price || 0,
        wholesale: val.wholesale || 0,
        rlevel: val.rlevel || 0,
        quantity: 0,
        rquantity: val.rquantity || 0,
        stock: 0,
        date: businessStartDate,
        unit: val.unit,
        location: val.location + "",
        product_loctions: [
          {
            location: JSON.stringify(
              locationdata.find((item: any) => item.id === val.location)
            ),
            location_stock: 0,
          },
        ],
        barcode: val.barcode,
        pimage: image,
        createdBy: user?.isStaff ? user?.staff.id : user?.id,
        companyid: user?.companyInfo?.id,
        hsn_code: user?.companyInfo?.tax === "gst" ? val.hsn_code : null,
      };

      let URL = API.ADD_PRODUCT;
      let METHOD = POST;
      const response: any = await METHOD(URL, reqObj);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `New ${
            type === "Service" ? "service" : "product"
          } added successfully`,
        });
        let data = response.data;
        let obj = {
          id: data.id,
          quantity: 1,
          price: data.price,
          incomeTaxAmount: data.vatamt,
          vatamt: data.vatamt,
          description: data.idescription,
          vat: data.vat,
          vatamount: data.vatamt,
          discountamt: 0,
          discount: 0,
          total: data.price,
          includeVat: data.price,
        };
        await productRefrush();
        // product(obj)
        setIsLoading(false);
        onCancel();
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to create ${
            type === "Service" ? "service" : "product"
          }`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: `Failed to create ${
          type === "Service" ? "service" : "product"
        }`,
      });
    }
  };

  const onValuesChange = async (val: any, arr: any) => {
    let rate = Number(arr.sp_price);
    let vatPercent = Number(arr.vat);
    let totalPrice;
    if (rate && (vatPercent || Number(vatPercent) === 0)) {
      let vatAmount: any = rate * (vatPercent / 100);
      if (val.includevat || arr.includevat) {
        vatAmount = (rate / (100 + vatPercent)) * 100;
        vatAmount = (rate - vatAmount).toFixed(2);
        totalPrice = Number(rate.toFixed(2));
        rate = rate - vatAmount;
      } else {
        totalPrice = Number(rate + vatAmount).toFixed(2);
      }
      form.setFieldsValue({
        vatamt: Number(vatAmount).toFixed(2),
        total_price: Number(totalPrice).toFixed(2),
      });
    }
  };

  const checkIfItemExist = async (type: any, item: any) => {
    if (item.length > 2) {
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
    } catch {}
  };

  useEffect(() => {
    ledgerCategoryDetails();
    LoadCategory();
    loadTaxList();
    LoadUnit();
    fetchUnits();
    fetchHsnCodes();
  }, []);

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + user?.id + "/" + user?.companyInfo?.id;
      const data: any = await GET(unit_url, null);
      setLocationData(data.data);
      form.setFieldsValue({
        location: "",
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHsnCodes = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.HSN_CODE_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setHsnCodes(data);
      setIsLoading(false);
    } catch (error) {}
  };

  const onUpload = async (info: any) => {
    const { file } = info;
    if (file.status !== "uploading") {
      await uploadLogo(file.originFileObj);
    }
  };

  const uploadLogo = async (imagedata: any) => {
    var formdata = new FormData();
    setLoading(true);
    formdata.append("productid", "create");
    formdata.append("file", imagedata, imagedata.name);
    let graphData_url = API.PRODUCTMASTER_IMAGE_UPLOADER;
    try {
      const { data }: any = await POST2(graphData_url, formdata);

      if (data?.location) {
        setLoading(false);
        setImage(data.location);
        notification.success({
          message: " Image Uploaded",
          description: "Your Image has been uploaded successfully.",
        });
      }
    } catch (error) {
      // Handle error if necessary
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={open} onCancel={onCancel} width="75%" footer={false}>
      <Form
        {...layout}
        form={form}
        initialValues={{
          date: dayjs(user?.companyInfo?.financial_year_start),
          location: "main",
        }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Row>
          <Col md={type == "Stock" ? 4 : 6}>
            <div className="productAdd-Txt1">
              {/* {type === "Service" ? "SERVICE" : "PRODUCT"}  */}
              PRODUCT INFORMATION
            </div>
            {type != "Asset" ? (
              <div className="formItem">
                <label className="formLabel">Item Code</label>
                <Form.Item
                  name="icode"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a Item Code",
                    },
                  ]}
                >
                  <Input
                    onChange={(val) =>
                      checkIfItemExist("icode", val.target.value)
                    }
                  />
                </Form.Item>
              </div>
            ) : null}

            <div className="formItem">
              <label className="formLabel">Item Name</label>
              <Form.Item
                name="idescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter a Item Name",
                  },
                ]}
              >
                <Input
                  onChange={(val) =>
                    checkIfItemExist("idescription", val.target.value)
                  }
                />
              </Form.Item>
            </div>
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
                  <Select onChange={addCategory} allowClear>
                    <Select.Option
                      value={"hsnCode"}
                      style={{
                        color: "gray",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      Add HSN/SAC
                    </Select.Option>
                    {hsnCodes?.length &&
                      hsnCodes.map((item: any) => (
                        <Select.Option value={item.hsn_code} key={item.id}>
                          {item.hsn_code} - {item.description}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            )}
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.Product_Category")}{" "}
              </label>
              <Form.Item
                name="product_category"
                rules={[
                  {
                    required: true,
                    message: `${t(
                      "home_page.homepage.Please_enter_Product_Category"
                    )}`,
                  },
                ]}
              >
                <Select onChange={addCategory} allowClear>
                  <Select.Option
                    value={"productCategory"}
                    style={{
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {t("home_page.homepage.Add_Product_Category")}
                  </Select.Option>
                  {category?.length &&
                    category?.map((item: any) => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.category}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            {type != "Service" ? (
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
                    <Select onChange={addCategory} allowClear>
                      <Select.Option
                        value={"unit"}
                        style={{
                          color: "gray",
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {t("home_page.homepage.Add_Unit")}
                      </Select.Option>
                      {unit?.length &&
                        unit?.map((item: any) => (
                          <Select.Option value={item.id} key={item.id}>
                            {item.unit}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">Barcode</label>
                  <Form.Item name="barcode">
                    <Input />
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">
                    {t("home_page.homepage.Location")}
                  </label>
                  <Form.Item
                    name="location"
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
                      onChange={addCategory}
                      allowClear
                      showSearch
                      filterOption={(input: any, option: any): any => {
                        let isInclude = false;
                        isInclude = option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase());

                        if (option.value === "location") {
                          isInclude = true;
                        }
                        return isInclude;
                      }}
                    >
                      <Select.Option
                        value={"location"}
                        style={{
                          color: "gray",
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {t("home_page.homepage.Add_Location")}
                      </Select.Option>
                      {locationdata?.length &&
                        locationdata?.map((item: any) => (
                          <Select.Option value={item.id} key={item.id}>
                            {item.location}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                {/* <div className="formItem">
                  <label className="formLabel">Location</label>
                  <Form.Item
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a Location",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      filterOption={(input: any, option: any): any => {
                        let isInclude = false;
                        isInclude = option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase());

                        if (option.value === "location") {
                          isInclude = true;
                        }
                        return isInclude;
                      }}
                    >
                      {locationdata.length &&
                        locationdata.map((item: any) => (
                          <Select.Option value={item.location} key={item.id}>
                            {item.location}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div> */}
              </>
            ) : null}
            <div className="formItem">
              <label className="formLabel">Notes</label>
              <Form.Item name="notes">
                <Input.TextArea rows={3} />
              </Form.Item>
            </div>
          </Col>

          <Col
            md={6}
            //  md={type == "Stock" || type == "Nonstock" ? 4 : 6}
          >
            <>
              <div className="productAdd-Txt1">SALES INFORMATION</div>
              <div className="formItem">
                <label className="formLabel">
                  {type === "Service" ? "Rate" : "Cost Price"}{" "}
                </label>
                <Form.Item name="sp_price">
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
                  <Select onChange={addCategory} allowClear>
                    <Select.Option
                      value={"tax"}
                      style={{
                        color: "gray",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {user?.companyInfo?.tax === "vat" ? "Add Vat" : "Add GST"}
                    </Select.Option>
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
                    ? t("home_page.homepage.Select_if_sales_price_inc_vat")
                    : "Select if sales price inc. gst"}
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
                    type="number"
                    disabled={includeVats}
                    controls={false}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
              {/* {type != "Service" ? (
                <div className="formItem">
                  <label className="formLabel">Wholesale Price</label>
                  <Form.Item
                    name="wholesale"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter a Wholesale Price",
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
              ) : null} */}
              <div className="formItem">
                <label className="formLabel">Total Price</label>
                <Form.Item name="total_price">
                  <InputNumber
                    type="number"
                    controls={false}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>
            </>
            {type == "Stock" ? (
              <>
                <div className="formItem">
                  <label className="formLabel">Reorder Level</label>
                  <Form.Item name="rlevel">
                    <InputNumber
                      type="number"
                      controls={false}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">Reorder Quantity</label>
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
          <Col md={6}>
            <div className="ProductAdd-Box1">
              <div>
                <Spin
                  spinning={loading}
                  size="large"
                  tip="Uploading..."
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "#ff9800" }}
                      spin
                    />
                  }
                >
                  {image ? (
                    <div className="ProductAdd-Box2">
                      <img
                        className="ProductAdd-Img"
                        src={image}
                        alt="product"
                      />
                    </div>
                  ) : (
                    <div className="ProductAdd-Box2">
                      <CiImageOff size={100} color="rgb(160 158 158)" />
                    </div>
                  )}
                </Spin>
              </div>

              <hr />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Upload
                  // accept="image/*"
                  style={{ color: "" }}
                  listType="picture"
                  showUploadList={false}
                  onChange={onUpload}
                >
                  <br />
                  <p>
                    <MdOutlinePhotoCamera size="20" color="rgb(160 158 158)" />
                    &nbsp;Image Upload Here
                  </p>
                </Upload>
              </div>
            </div>
          </Col>

          <Col md={type == "Stock" ? 8 : 6}></Col>
          <Col md={type == "Stock" ? 2 : 3}>
            <br />
            <br />
            <Button onClick={() => onCancel()} block size="large">
              Cancel
            </Button>
          </Col>
          <Col md={type == "Stock" ? 2 : 3}>
            <br />
            <br />
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => setIsForm(false)}
          source={formType}
          id={"create"}
          reload={
            formType == "unit"
              ? LoadUnit
              : formType == "productCategory"
              ? LoadCategory
              : formType == "tax"
              ? loadTaxList
              : formType == "hsnCode"
              ? fetchHsnCodes
              : fetchUnits
          }
        />
      ) : null}
    </Modal>
  );
}
export default ProductAddModal;

// {type === "Stock" ? (
//                          <>
//                              <div className="productAdd-Txt1">
//                                  {type === "Stock"
//                                      ? " OPENING BALANCE"
//                                      : "Upload Image"}
//                              </div>
//                              {type === "Stock" ? (
//                              <>
//                              <div className="formItem">
//                                  <label className="formLabel">
//                                      Quantity On Hand
//                                  </label>
//                                  <Form.Item
//                                      name="quantity"
//                                      rules={[
//                                          {
//                                              required: true,
//                                              message:
//                                                  "Please enter a Quantity On Hand",
//                                          },
//                                      ]}
//                                  >
//                                      <InputNumber
//                                          type="number"
//                                          controls={false}
//                                          style={{ width: "100%" }}
//                                      />
//                                  </Form.Item>
//                              </div>
//                              <div className="formItem">
//                                  <label className="formLabel">
//                                      Cost Price
//                                  </label>
//                                  <Form.Item
//                                      name="c_price"
//                                      rules={[
//                                          {
//                                              required: true,
//                                              message: "Please enter a Cost Price",
//                                          },
//                                      ]}
//                                  >
//                                      <InputNumber
//                                          type="number"
//                                          controls={false}
//                                          style={{ width: "100%" }}
//                                      />
//                                  </Form.Item>
//                              </div>
//                              <div className="formItem">
//                                  <label className="formLabel">
//                                      Business Starting Date
//                                  </label>
//                                  <Form.Item
//                                      name="date"
//                                      rules={[
//                                          {
//                                              required: true,
//                                              message: "Please add business starting date",
//                                          },
//                                      ]}
//                                  >
//                                      {!businessStartDate ? (
//                                          <Button onClick={() => navigate('/usr/profile/accounting')}>
//                                              Add Business Starting Date
//                                          </Button>) :
//                                          <DatePicker
//                                              style={{ width: "100%" }}
//                                              format={"YYYY-MM-DD"}
//                                              disabled={businessStartDate}
//                                          />}
//                                  </Form.Item>
//
//                              </div>
//                          </>
//                       ) : null}
//                      <div className="ProductAdd-Box1">
//                          <div>
//                              <Spin
//                                  spinning={loading}
//                                  size="large"
//                                  tip="Uploading..."
//                                  indicator={
//                                      <LoadingOutlined
//                                          style={{ fontSize: 24, color: "#ff9800" }}
//                                          spin
//                                      />
//                                  }
//                              >
//                                  {image ? (
//                                      <div className="ProductAdd-Box2">
//                                          <img
//                                              className="ProductAdd-Img"
//                                              src={image}
//                                          />
//                                      </div>
//                                  ) : (
//                                      <div className="ProductAdd-Box2">
//                                          <CiImageOff
//                                              size={100}
//                                              color="rgb(160 158 158)"
//                                          />
//                                      </div>
//                                  )}
//                              </Spin>
//                          </div>
//
//                          <hr />
//
//                          <div
//                              style={{
//                                  display: "flex",
//                                  justifyContent: "center",
//                                  alignItems: "center",
//                              }}
//                          >
//                              <Upload
//                                  // accept="image/*"
//                                  style={{ color: "" }}
//                                  listType="picture"
//                                  showUploadList={false}
//                                  onChange={onUpload}
//                              >
//                                  <br />
//                                  <p>
//                                      <MdOutlinePhotoCamera
//                                          size="20"
//                                          color="rgb(160 158 158)"
//                                      />
//                                      &nbsp;Image Upload Here
//                                  </p>
//                              </Upload>
//                          </div>
//                      </div>
//                  </>
//              ) : null}
