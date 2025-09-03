import { Button, Form, Input, notification, Select } from "antd";
import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const StockTransferItems = (props: any) => {
  const [active, setActive] = useState<any>(-1);
  const [isDisabled, setIsDisabled] = useState(false);
  const allFieldValues = props?.form?.getFieldsValue();
  const { t } = useTranslation();
  
  function disableDuplicates(arr1: any, arr2: any) {
    const uniqueIds = arr2?.map((item: any) => item.productId);
    const result = arr1?.map((item: any) => {
      if (uniqueIds?.includes(item.productId)) {
        return { ...item, disable: true };
      }
      return { ...item, disable: false };
    });
    return result;
  }

  const validateQuantity = (rule: any, value: any, context: any) => {
    const fieldParts = rule?.field?.split(".");
    const currentIndex = parseInt(fieldParts[1], 10);
    const productId = props?.form?.getFieldValue([
      "items",
      currentIndex,
      "productId",
    ]);
 
    const product = props?.productsData?.find(
      (item: any) => item?.productId === productId
    );
    if (Number(value) < 1) {
      notification.error({
        message: "Error",
        description: "Quantity should be atleast 1",
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Quantity should be atleast 1"));
    }
    if (value && value > product?.stock) {
      notification.error({
        message: "Error",
        description:
          "Quantity cannot be more than stock ," +
          "\n stock is " +
          product?.stock,
      });
      setIsDisabled(true);
      return Promise.reject(new Error("Quantity cannot be more than stock"));
    }
    setIsDisabled(false);
    return Promise.resolve();
  };

  return (
    <Form.List name={"items"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div>{t("home_page.homepage.Items")}</div>
            <div>
              <Button
                onClick={() => {
                  if (active == -1) {
                    add({
                      productId: null,
                      productName: null,
                      qty: null,
                      unit: null,
                      price: null,
                      total: null,
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
          <Table bordered>
            <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
              <tr>
                <th> {t("home_page.homepage.slno")}</th>
                <th> {t("home_page.homepage.Item")}</th>
                <th>{t("home_page.homepage.QTY")}</th>
                <th>{t("home_page.homepage.UNIT")}</th>
                <th>{t("home_page.homepage.PRICE")}</th>
                <th>{t("home_page.homepage.Total")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields?.map((field: any, index: number, val: any) => {
                return (
                  <>
                    {index === active ? null : (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.items?.length &&
                            allFieldValues?.items[index]?.productName) ||
                            "n/a"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.items?.length &&
                            allFieldValues?.items[index]?.qty) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.items?.length &&
                            allFieldValues?.items[index]?.unit) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.items?.length &&
                            allFieldValues?.items[index]?.price) ||
                            "0"}
                        </td>

                        <td>
                          {(allFieldValues &&
                            allFieldValues?.items?.length &&
                            allFieldValues?.items[index]?.total) ||
                            "0"}
                        </td>
                        <td style={{ width: 70 }}>
                          <div className="salesInvoice-action">
                            <div onClick={() => setActive(index)}>
                              <MdEdit size={20} />
                            </div>
                            <div
                              onClick={() => {
                                remove(field.name);
                                setActive(-1);
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
                            <Col sm={3}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Product")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "productId"]}
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
                                    props?.productsData,
                                    props?.form.getFieldsValue().items
                                  )?.map((item: any) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.productId}
                                      disabled={item?.disable}
                                    >
                                      {/* {item?.productName} */}
                                      {item?.productName +
                                        " (Qty: " +
                                        item?.stock +
                                        ")"}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Qantity")}
                                
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "qty"]}
                                noStyle
                                rules={[{ validator: validateQuantity }]}
                              >
                                <Input
                                  placeholder="quantity"
                                  suffix={props?.qSuffix}
                                  type="number"
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >     {t("home_page.homepage.Unit")}
                                
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "unit"]}
                                noStyle
                              >
                                <Input placeholder="unit" readOnly />
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
                                <Input placeholder="price" readOnly />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                    {t("home_page.homepage.AMOUNT")}
                                
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "total"]}
                                noStyle 
                              >
                                <Input placeholder="amount" readOnly />
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
                                  !allFieldValues?.items[index]?.productId ||
                                  isDisabled
                                }
                              >
                                    {t("home_page.homepage.Save")}
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
              <tr>
                <td></td>
                <td>
                  <strong> 
                  {t("home_page.homepage.Total")}
                  </strong>
                </td>
                <td>{props?.totalQuantity}</td>
                <td></td>
                <td></td>
                <td>{props?.totalPrice}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </Form.List>
  );
};

export default StockTransferItems;
