import React, {  useState } from "react";
import { Button, Form, Input } from "antd";
import { Col, Row, Table } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";


function Billings(props: any) {
  const [active, setActive] = useState<any>(-1);
  const allFieldValues = props?.form?.getFieldsValue();
  const {t} = useTranslation();


  return (
    <Form.List name={"billing"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div>{t("home_page.homepage.Billings")}</div>
            <div>
              <Button
                onClick={() => {
                  if (active == -1) {
                    add();
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
                <th> {t("home_page.homepage.Description")}</th>
                <th>{t("home_page.homepage.QTY")}</th>
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
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.billing?.length &&
                            allFieldValues?.billing[index]?.description) ||
                            "n/a"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.billing?.length &&
                            allFieldValues?.billing[index]?.qty) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.billing?.length &&
                            allFieldValues?.billing[index]?.price) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.billing?.length &&
                            allFieldValues?.billing[index]?.total) ||
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
                            <Col sm={4}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                Description{" "}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "description"]}
                                noStyle
                              >
                                <Input placeholder="description" />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                Quantity
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "qty"]}
                                noStyle
                              >
                                <Input
                                  placeholder="quantity"
                                //   defaultValue={1}
                                  suffix={props?.qSuffix}
                                  type="number"
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                Price
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "price"]}
                                noStyle
                              >
                                <Input placeholder="price" />
                              </Form.Item>
                            </Col>

                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                <strong>Total :</strong>
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
                                Remove
                              </Button>
                            </Col>
                            <Col sm={2}>
                              <div style={{ marginTop: 28 }}></div>
                              <Button
                                type="primary"
                                block
                                onClick={() => setActive(-1)}
                                // disabled={
                                //   !allFieldValues?.billings[index]?.description
                                // }
                              >
                                Save
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Form.List>
  );
}
export default Billings;
