import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function Items(props: any) {
  const { t } = useTranslation();
  const [active, setActive] = useState<any>(-1);
  const allFieldValues = props.form?.getFieldsValue() || {};
  const [isDisabled, setIsDisabled] = useState(false);
  console.log("allFieldValues", allFieldValues);

  const { user } = useSelector((state: any) => state.User);

  const addProduct = (val: any) => {
    if (val == "addProduct") {
      props.productModal(true);
    }
  };

  function disableDuplicates(arr1: any, arr2: any) {
    if (!arr1 || !arr2) return [];
    
    const uniqueIds = arr2?.map((item: any) => item?.id) || [];
    return arr1?.map((item: any) => {
      if (uniqueIds.includes(item?.id)) {
        return { ...item, disable: true };
      }
      return { ...item, disable: false };
    }) || [];
  }

  const validateQuantity = (_: any, value: any) => {
    if (Number(value) < 1) {
      notification.error({
        message: "Error",
        description: "Quantity should be atleast 1",
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Quantity should be atleast 1"));
    }
    
    // Only check stock if ledger is product (ledgerId !== 2)
    if (props?.ledgerId !== 2 && value && value > props?.stock) {
      notification.error({
        message: "Error",
        description:
          "Quantity cannot be more than stock ," +
          "\n stock is " +
          props?.stock,
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Quantity cannot be more than stock"));
    }
    
    setIsDisabled(false);
    return Promise.resolve();
  };

  const validatePrice = (_: any, value: any) => {
    if (Number(value) <= 0) {
      notification.error({
        message: "Error",
        description: "Price amount can't be less than 1 ",
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Price amount can't be less than 1 "));
    }
    setIsDisabled(false);
    return Promise.resolve();
  };

  const validateDiscount = (_: any, value: any) => {
    if (Number(value) < 0) {
      notification.error({
        message: "Error",
        description: "Discount can't be less than 0",
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Discount can't be less than 0"));
    }
    setIsDisabled(false);
    return Promise.resolve();
  };

  return (
    <Form.List name={"columns"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div style={{ fontSize: window.innerWidth <= 411 ? "12px" : "" }}>
              {t("home_page.homepage.Invoice_Items")}
            </div>
            <div>
              <Button
                onClick={() => {
                  if (fields?.length === 0 || active == -1) {
                    add({
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
                    });
                    setActive(fields?.length);
                  }
                }}
                style={{ backgroundColor: "#ff9800", color: "#fff" }}>
                {t("home_page.homepage.AddItem")}
              </Button>
            </div>
          </div>
          <Table bordered responsive>
            <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
              <tr>
                <th>PRODUCT</th>
                <th>QTY</th>
                <th>PRICE</th>
                {user?.companyInfo?.tax === "gst" ? (
                  <>
                    <th>GST %</th>
                    {props.isStateTax ? (
                      <>
                        <th>CGST AMT</th>
                        <th>SGST AMT</th>
                      </>
                    ) : (
                      <th>IGST AMT</th>
                    )}
                  </>
                ) : (
                  <>
                    <th>TAX %</th>
                    <th>TAX AMT</th>
                  </>
                )}

                <th>INC TAX</th>
                <th>DISC %</th>
                <th>DISC AMT</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {fields?.map((field: any, index: number, val: any) => {
                return (
                  <React.Fragment key={index.toString()}>
                    {index === active ? null : (
                      <tr>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            allFieldValues?.columns[index]?.description) ||
                            "n/a"}
                        </td>

                        <td>
                          {allFieldValues?.columns?.[index]?.quantity || 0}
                        </td>

                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            Number(
                              allFieldValues?.columns[index]?.price
                            ).toFixed(2)) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            Number(allFieldValues?.columns[index]?.vat).toFixed(
                              2
                            )) ||
                            "0"}
                        </td>
                        {user?.companyInfo?.tax === "gst" ? (
                          <>
                            {props.isStateTax ? (
                              <>
                                <td>
                                  {(allFieldValues &&
                                    allFieldValues?.columns?.length &&
                                    Number(
                                      allFieldValues?.columns[index]?.vatamount
                                    ).toFixed(2)) / 2 || "0"}
                                </td>
                                <td>
                                  {(allFieldValues &&
                                    allFieldValues?.columns?.length &&
                                    Number(
                                      allFieldValues?.columns[index]?.vatamount
                                    ).toFixed(2)) / 2 || "0"}
                                </td>
                              </>
                            ) : (
                              <td>
                                {(allFieldValues &&
                                  allFieldValues?.columns?.length &&
                                  Number(
                                    allFieldValues?.columns[index]?.vatamount
                                  ).toFixed(2)) ||
                                  "0"}
                              </td>
                            )}
                          </>
                        ) : (
                          <td>
                            {(allFieldValues &&
                              allFieldValues?.columns?.length &&
                              Number(
                                allFieldValues?.columns[index]?.vatamount
                              ).toFixed(2)) ||
                              "0"}
                          </td>
                        )}

                        <td className="d-flex justify-content-center">
                          <Checkbox
                            checked={
                              (allFieldValues &&
                                allFieldValues?.columns?.length &&
                                allFieldValues?.columns[index]?.includeVat) ||
                              false
                            }
                          />
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            Number(
                              allFieldValues?.columns[index]?.discount
                            ).toFixed(2)) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            Number(
                              allFieldValues?.columns[index]?.discountamt
                            ).toFixed(2)) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            Number(
                              allFieldValues?.columns[index]?.total
                            ).toFixed(2)) ||
                            "0"}
                        </td>
                        <td style={{ width: 70 }}>
                          <div className="salesInvoice-action">
                            <div
                              onClick={() =>
                                active == -1
                                  ? setActive(index)
                                  : notification.error({
                                      message:
                                        "Kindly save the currently active form.",
                                    })
                              }>
                              <MdEdit size={20} />
                            </div>
                            <div
                              onClick={() => {
                                if (active == -1) {
                                  remove(field.name);
                                } else {
                                  notification.error({
                                    message:
                                      "Kindly save the currently active form.",
                                  });
                                }
                              }}>
                              <IoClose size={23} color="red" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {index === active ? (
                      <tr>
                        <td
                          colSpan={11}
                          style={{ backgroundColor: "rgb(247, 247, 247)" }}>
                          <Row>
                            <Col sm={4}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {t("home_page.homepage.Product")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "id"]}
                                noStyle
                                required
                                rules={[{ required: true, message: "" }]}>
                                <Select
                                  onChange={addProduct}
                                  allowClear
                                  placeholder={t(
                                    "home_page.homepage.chooseproduct"
                                  )}
                                  style={{ width: "100%" }}
                                  showSearch
                                  filterOption={(input: any, option: any) =>
                                    option?.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }>
                                  <Select.Option
                                    value={"addProduct"}
                                    style={{
                                      color: "gray",
                                      fontSize: 15,
                                      fontWeight: "bold",
                                    }}>
                                    {t("home_page.homepage.AddNewProduct")}
                                  </Select.Option>
                                  {disableDuplicates(
                                    props?.products || [],
                                    props?.form?.getFieldsValue()?.columns || []
                                  )?.map((item: any) => (
                                    <Select.Option
                                      key={item?.id}
                                      value={item?.id}
                                      disabled={item?.disable}>
                                      {props?.ledgerId === 2
                                        ? item?.idescription
                                        : item?.productName}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col sm={4}>
                              {user?.companyInfo?.tax === "gst" ? (
                                <>
                                  <div
                                    className="formLabel"
                                    style={{ marginTop: 10 }}>
                                    HSN Code{" "}
                                  </div>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "hsn_code"]}
                                    noStyle>
                                    <Input placeholder="Input" readOnly />
                                  </Form.Item>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="formLabel"
                                    style={{ marginTop: 10 }}>
                                    Description{" "}
                                  </div>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "description"]}
                                    noStyle>
                                    <Input placeholder="Input" />
                                  </Form.Item>
                                </>
                              )}
                            </Col>
                            
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                Quantity
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "quantity"]}
                                noStyle
                                rules={[{ validator: validateQuantity }]}>
                                <InputNumber
                                  controls={false}
                                  placeholder="quantity"
                                  defaultValue={1}
                                  suffix={props?.qSuffix?.unit}
                                  type="number"
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>
                           

                            <Col >
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {t("home_page.homepage.Price")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "price"]}
                                noStyle
                                rules={[{ validator: validatePrice }]}>
                                <InputNumber
                                  type="number"
                                  style={{ width: "100%" }}
                                  controls={false}
                                  placeholder="price"
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {user?.companyInfo?.tax === "gst"
                                  ? "GST%"
                                  : t("home_page.homepage.Tax*")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "vat"]}
                                noStyle>
                                <Select style={{ width: "100%" }}>
                                  {props?.taxLists?.length &&
                                    props?.taxLists?.map((item: any) => {
                                      return (
                                        <Select.Option
                                          key={item.id}
                                          value={item.percentage}>
                                          {`${item.percentage} %`}
                                        </Select.Option>
                                      );
                                    })}
                                </Select>
                              </Form.Item>
                            </Col>
                            {user?.companyInfo?.tax === "gst" ? (
                              <>
                                {props.isStateTax ? (
                                  <>
                                    <Col sm={1}>
                                      <div
                                        className="formLabel"
                                        style={{ marginTop: 10 }}>
                                        CGST AMT
                                      </div>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "cgst"]}
                                        noStyle>
                                        <Input
                                          placeholder="CGST"
                                          readOnly
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col sm={1}>
                                      <div
                                        className="formLabel"
                                        style={{ marginTop: 10 }}>
                                        SGST AMT
                                      </div>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "sgst"]}
                                        noStyle>
                                        <Input
                                          placeholder="SGST"
                                          readOnly
                                        />
                                      </Form.Item>
                                    </Col>
                                  </>
                                ) : (
                                  <Col sm={2}>
                                    <div
                                      className="formLabel"
                                      style={{ marginTop: 10 }}>
                                      IGST AMT
                                    </div>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, "igst"]}
                                      noStyle>
                                      <Input
                                        placeholder="IGST"
                                        readOnly
                                      />
                                    </Form.Item>
                                  </Col>
                                )}
                              </>
                            ) : (
                              <Col sm={2}>
                                <div
                                  className="formLabel"
                                  style={{ marginTop: 10 }}>
                                  Tax Amt:
                                </div>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "vatamount"]}
                                  noStyle>
                                  <Input placeholder="tax amount" readOnly />
                                </Form.Item>
                              </Col>
                            )}

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {t("home_page.homepage.Dis%")}:
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discount"]}
                                noStyle
                                rules={[{ validator: validateDiscount }]}>
                                <InputNumber
                                  placeholder={t("home_page.homepage.discount")}
                                  style={{ width: "100%" }}
                                  controls={false}
                                  defaultValue={0}
                                  suffix={"%"}
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {t("home_page.homepage.Disamt")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discountamt"]}
                                noStyle>
                                <InputNumber
                                  placeholder="discount"
                                  controls={false}
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                {t("home_page.homepage.IncludeTax")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "includeVat"]}
                                noStyle
                                valuePropName="checked">
                                <Checkbox
                                  onChange={(e) => {
                                    props.form.setFieldsValue({
                                      includeVat: e.target.checked,
                                    });
                                  }}
                                  checked={
                                    allFieldValues?.columns[index]?.includeVat
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}>
                                <strong>
                                  {t("home_page.homepage.total")}:
                                </strong>
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "total"]}
                                noStyle>
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col sm={8}></Col>
                            <Col sm={2}>
                              <div style={{ marginTop: 28 }}></div>
                              <Button
                                danger
                                block
                                onClick={() => {
                                  remove(field.name);
                                  setActive(-1);
                                }}>
                                {t("home_page.homepage.Remove")}
                              </Button>
                            </Col>
                            <Col sm={2}>
                              <div style={{ marginTop: 28 }}></div>
                              <Button
                                type="primary"
                                block
                                onClick={() => setActive(-1)}
                                disabled={
                                  !allFieldValues?.columns[index]
                                    ?.description || isDisabled
                                }>
                                {t("home_page.homepage.Save")}
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Form.List>
  );
}
export default Items;