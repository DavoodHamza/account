import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  notification,
} from "antd";
import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
function Items(props: any) {
  const { t } = useTranslation();
  const [active, setActive] = useState<any>(-1);
  const [isDisabled, setIsDisabled] = useState(false);
  const allFieldValues = props.form.getFieldsValue();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  function disableDuplicates(arr1: any, arr2: any) {
    const uniqueIds = arr2?.map((item: any) => item.id);
    const result = arr1?.map((item: any) => {
      if (uniqueIds.includes(item.id)) {
        return { ...item, disable: true };
      }
      return { ...item, disable: false };
    });
    return result;
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
    if (value && value > props?.stock) {
      notification.error({
        message: "Error",
        description:
          "Quantity cannot be more than purchase stock ," +
          "\n stock is " +
          props?.stock,
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Quantity cannot be more than purchase stock"));
    }
    setIsDisabled(false);
    return Promise.resolve();
  };

  return (
    <Form.List name={"columns"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div>{t("home_page.homepage.Invoice_Items")}</div>
          </div>
          <Table bordered responsive>
            <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
              <tr>
                <th>{t("home_page.homepage.PRODUCT")}</th>
                <th>{t("home_page.homepage.QTY")}</th>
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
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.columns?.length &&
                            allFieldValues?.columns[index]?.quantity) ||
                            "0"}
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
                            <Popconfirm
                              title={t("home_page.homepage.RemoveRow")}
                              description={t(
                                "home_page.homepage.Areyousureremoverow?"
                              )}
                              icon={
                                <AiOutlineQuestionCircle
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => {
                                if (active == -1) {
                                  remove(field.name);
                                } else {
                                  notification.error({
                                    message:
                                      "Kindly save the currently active form.",
                                  });
                                }
                              }}
                              placement="topRight"
                            >
                              <div>
                                <IoClose size={23} color="red" />
                              </div>
                            </Popconfirm>
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
                                  }
                                >
                                  {disableDuplicates(
                                    props?.products,
                                    props?.form?.getFieldsValue().columns
                                  )?.map((item: any) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.id}
                                      disabled={item?.disable}
                                    >
                                       {item.idescription}
                                    </Select.Option>
                                  ))}
                                  <Select.Option
                                    key="addButton"
                                    value="addButton"
                                  >
                                    <Button
                                      type="primary"
                                      block
                                      onClick={() =>
                                        navigate(
                                          "/usr/create-product/Stock/create/0"
                                        )
                                      }
                                    >
                                      <GoPlus />
                                      {t("home_page.homepage.Add_New")}
                                    </Button>
                                  </Select.Option>
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
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Quantity")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "quantity"]}
                                noStyle
                                rules={[{ validator: validateQuantity }]}
                              >
                                <InputNumber
                                  controls={false}
                                  placeholder={t("home_page.homepage.Quantity")}
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
                            <Col sm={2}>
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
                                  controls={false}
                                  placeholder="price"
                                  type="number"
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                />
                              </Form.Item>
                            </Col>
                            {user?.companyInfo?.tax === "gst" ?(
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
                            ):(
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
                                        {t("home_page.homepage.CGST_Amt")}
                                      </div>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "cgst"]}
                                        noStyle
                                      >
                                        <Input placeholder={t("home_page.homepage.CGST_Amt")} readOnly 
                                        //suffix={"%"} 
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
                                        <Input placeholder={t("home_page.homepage.SGST_AMT")} readOnly 
                                        //suffix={"%"}
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
                                      {t("home_page.homepage.IGST_AMT")}
                                    </div>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, "igst"]}
                                      noStyle
                                    >
                                      <Input placeholder={t("home_page.homepage.IGST_AMT")} readOnly 
                                      //suffix={"%"} 
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
                                  <Input placeholder={t("home_page.homepage.vatamount")} readOnly />
                                </Form.Item>
                              </Col>
                            )}

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Dis%")} :
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discount"]}
                                noStyle
                              >
                                <InputNumber
                                  controls={false}
                                  placeholder={t("home_page.homepage.discount")}
                                  type="number"
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
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Disamt")}:
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "discountamt"]}
                                noStyle
                              >
                                <InputNumber
                                  controls={false}
                                  placeholder={t(
                                    "home_page.homepage.Enteramount"
                                  )}
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
                              <Popconfirm
                                title={t("home_page.homepage.RemoveRow")}
                                description={t(
                                  "home_page.homepage.Areyousureremoverow?"
                                )}
                                icon={
                                  <AiOutlineQuestionCircle
                                    style={{ color: "red" }}
                                  />
                                }
                                onConfirm={() => {
                                  remove(field.name);
                                  setActive(-1);
                                }}
                                placement="topRight"
                              >
                                <Button danger block>
                                  {t("home_page.homepage.Remove")}
                                </Button>
                              </Popconfirm>
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
