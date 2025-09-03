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
  const allFieldValues = props.form.getFieldsValue();
  const [isDisabled, setIsDisabled] = useState(false);

  const { user } = useSelector((state: any) => state?.User);
  function disableDuplicates(arr1: any, arr2: any) {
    const uniqueIds = arr2.map((item: any) => item.id);
    const result = arr1.map((item: any) => {
      if (uniqueIds.includes(item.id)) {
        return { ...item, disable: true };
      }
      return { ...item, disable: false };
    });
    return result;
  }
  const addProduct = (val: any) => {
    if (val == "addProduct") {
      props.productModal(true);
    }
  };

  const validateDecimals = (_:any, value:any) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      return Promise.resolve();
    }else{
      notification.error({message:"Please enter a number with no more than two decimal places"})
      return Promise.reject();
    }
  };

  console.log("ledgerId==>",props?.ledgerId)

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
                  if (fields?.length=== 0 || active == -1) {
                    add({
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
                    });
                    setActive(fields?.length);
                  }
                }}
                style={{ backgroundColor: "#ff9800", color: "#fff" }}
              >
                {t("home_page.homepage.AddItem")}
              </Button>
            </div>
          </div>
          <Table bordered responsive>
            <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
              <tr>
                <th>{t("home_page.homepage.PRODUCT")}</th>
                {allFieldValues?.ledger !== 20835 && <th>{t("home_page.homepage.QTY")}</th>}
                <th>{t("home_page.homepage.PRICE")}</th>
                {user?.companyInfo?.tax === "gst" ? (
                  <>
                    <th>{t("home_page.homepage.GST")}%</th>
                    {props.isStateTax ? (
                      <>
                        <th>{t("home_page.homepage.CGST_Amt")}</th>
                        <th>{t("home_page.homepage.SGST_AMT")}</th>
                      </>
                    ) : (
                      <th>{t("home_page.homepage.IGST_AMT")}</th>
                    )}
                  </>
                ) : (
                  <>
                    <th>{t("home_page.homepage.TAX_%")}</th>
                    <th>{t("home_page.homepage.TAX_AMT")}</th>
                  </>
                )}
                <th>{t("home_page.homepage.INC_TAX")}</th>
                <th>{t("home_page.homepage.DISC_%")}</th>
                <th>{t("home_page.homepage.DISC_AMT")}</th>
                <th>{t("home_page.homepage.TOTAL")}</th>
                <th></th>
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

                        {allFieldValues &&
                          allFieldValues?.columns?.length &&
                          allFieldValues?.ledger !== 20835 && (
                            <td>
                              {allFieldValues?.columns[index]?.quantity || "0"}
                            </td>
                          )}

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
                            // disabled
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
                              }
                            >
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
                              }}
                            >
                              <IoClose size={23} color="red" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {index === active ? (
                      <tr>
                        <td
                          colSpan={10}
                          style={{ backgroundColor: "rgb(247, 247, 247)" }}
                        >
                          <Row>
                            <Col sm={4}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Product")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "id"]}
                                noStyle
                                required
                                rules={[{ required: true, message: "" }]}
                              >
                                <Select
                                  onChange={addProduct}
                                  allowClear
                                  placeholder={t(
                                    "home_page.homepage.chooseproduct"
                                  )}
                                  style={{
                                    color: "gray",
                                    fontSize: 15,
                                    fontWeight: "bold",
                                    width: "100%",
                                  }}
                                  showSearch
                                  filterOption={(input: any, option: any) =>
                                    option?.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  <Select.Option
                                    value={"addProduct"}
                                    style={{
                                      color: "gray",
                                      fontSize: 15,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {t("home_page.homepage.AddNewProduct")}
                                  </Select.Option>
                                  {disableDuplicates(
                                    props.products,
                                    props.form.getFieldsValue().columns
                                  )?.map((item: any) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.id}
                                      disabled={item?.disable}
                                    >
                                      {props?.ledgerId === 12 ? item?.productName : item?.idescription}
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
                                    style={{ marginTop: 10 }}
                                  >
                                    {t("home_page.homepage.HSN_Code")}{" "}
                                  </div>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "hsn_code"]}
                                    noStyle
                                  >
                                    <Input placeholder={t("home_page.homepage.Input")} readOnly />
                                  </Form.Item>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="formLabel"
                                    style={{ marginTop: 10 }}
                                  >
                                    {t("home_page.homepage.Description")}{" "}
                                  </div>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, "description"]}
                                    noStyle
                                  >
                                    <Input placeholder={t("home_page.homepage.Input")} />
                                  </Form.Item>
                                </>
                              )}
                            </Col>

                            {allFieldValues?.ledger !== 20835 && (
                              <Col sm={2}>
                                <div
                                  className="formLabel"
                                  style={{ marginTop: 10 }}
                                >
                                  {t("home_page.homepage.Qantity")}
                                </div>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "quantity"]}
                                  noStyle
                                  rules={[
                                    { validator: validateDecimals }
                                  ]}
                                >
                                  <InputNumber
                                    placeholder={t(
                                      "home_page.homepage.Qantity"
                                    )}
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
                            )}
                            <Col sm={allFieldValues?.ledger !== 20835 ? 2 : 4}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Price")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "price"]}
                                noStyle
                              >
                                <InputNumber
                                  placeholder={t("home_page.homepage.Price")}
                                  type="number"
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>
                            {user?.companyInfo?.tax === "gst" ? (
                              <Col sm={2}>
                                <div
                                  className="formLabel"
                                  style={{ marginTop: 10 }}
                                >
                                  {t("home_page.homepage.GST")}%
                                </div>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "vat"]}
                                  noStyle
                                >
                                  <Select style={{ width: "100%" }}>
                                    {props?.taxLists?.length &&
                                      props?.taxLists?.map((item: any) => {
                                        return (
                                          <Select.Option
                                            key={item.id}
                                            value={item.percentage}
                                          >
                                            {`${item.percentage} %`}
                                          </Select.Option>
                                        );
                                      })}
                                  </Select>
                                </Form.Item>
                              </Col>
                            ) : (
                              <Col sm={2}>
                                <div
                                  className="formLabel"
                                  style={{ marginTop: 10 }}
                                >
                                  {t("home_page.homepage.Tax*")}
                                </div>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "vat"]}
                                  noStyle
                                >
                                  <Select style={{ width: "100%" }}>
                                    {props?.taxLists?.length &&
                                      props?.taxLists?.map((item: any) => {
                                        return (
                                          <Select.Option
                                            key={item.id}
                                            value={item.percentage}
                                          >
                                            {`${item.percentage} %`}
                                          </Select.Option>
                                        );
                                      })}
                                  </Select>
                                </Form.Item>
                              </Col>
                            )}
                            {user?.companyInfo?.tax === "gst" ? (
                              <>
                                {props.isStateTax ? (
                                  <>
                                    {" "}
                                    <Col sm={1}>
                                      <div
                                        className="formLabel"
                                        style={{ marginTop: 10 }}
                                      >
                                        {t("home_page.homepage.IGST_AMT")}
                                      </div>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "cgst"]}
                                        noStyle
                                      >
                                        <Input
                                          placeholder="CGST"
                                          readOnly
                                        // suffix={"%"}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col sm={1}>
                                      <div
                                        className="formLabel"
                                        style={{ marginTop: 10 }}
                                      >
                                        {t("home_page.homepage.SGST_AMT")}
                                      </div>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "sgst"]}
                                        noStyle
                                      >
                                        <Input
                                          placeholder="SGST"
                                          readOnly
                                        // suffix={"%"}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </>
                                ) : (
                                  <Col sm={2}>
                                    <div
                                      className="formLabel"
                                      style={{ marginTop: 10 }}
                                    >
                                      {t("home_page.homepage.IGST")}%
                                    </div>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, "igst"]}
                                      noStyle
                                    >
                                      <Input
                                        placeholder={t("home_page.homepage.IGST")}
                                        readOnly
                                        suffix={"%"}
                                      />
                                    </Form.Item>
                                  </Col>
                                )}
                              </>
                            ) : (
                              <Col sm={2}>
                                <div
                                  className="formLabel"
                                  style={{ marginTop: 10 }}
                                >
                                  {t("home_page.homepage.TaxAmt")}:
                                </div>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "vatamount"]}
                                  noStyle
                                >
                                  <Input placeholder={t("home_page.homepage.TaxAmt")} readOnly />
                                </Form.Item>
                              </Col>
                            )}

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Dis%")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discount"]}
                                noStyle
                              // rules={[{ validator: validateDiscount }]}
                              >
                                <InputNumber
                                  placeholder={t("home_page.homepage.discount")}
                                  type="number"
                                  defaultValue={0}
                                  controls={false}
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
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Disamt")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discountamt"]}
                                noStyle
                              >
                                <InputNumber
                                  controls={false}
                                  placeholder="Input"
                                  type="number"
                                  defaultValue={0}
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
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.IncludeTax")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "includeVat"]}
                                noStyle
                                valuePropName="checked"
                              >
                                <Checkbox
                                  // onChange={(e) => {
                                  //   props.form.setFieldsValue({
                                  //     includeVat: e.target.checked,
                                  //   });
                                  // }}
                                  checked={
                                    allFieldValues?.columns[index]?.includeVat
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                <strong>
                                  {t("home_page.homepage.total")} :
                                </strong>
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "total"]}
                                noStyle
                              >
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
                                }}
                              >
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
                                }
                              >
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
