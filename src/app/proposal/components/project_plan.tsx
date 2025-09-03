import React, {  useState } from "react";
import { Button, Form, Input } from "antd";
import { Col, Row, Table } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";


function ProjectPlan(props: any) {
  const [active, setActive] = useState<any>(-1);
  const allFieldValues2 = props?.form?.getFieldsValue();
  const {t} = useTranslation();

  return (
    <Form.List name={"project_plan"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div>{t("home_page.homepage.Project_Plan")}</div>
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
                <th> {t("home_page.homepage.Module")}</th>
                <th> {t("home_page.homepage.Screens")}</th>
                <th> {t("home_page.homepage.Features")}</th>
                <th> {t("home_page.homepage.Details")}</th>
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
                          {(allFieldValues2 &&
                            allFieldValues2?.project_plan?.length &&
                            allFieldValues2?.project_plan[index]?.module) ||
                            "n/a"}
                        </td>
                        <td>
                          {(allFieldValues2 &&
                            allFieldValues2?.project_plan?.length &&
                            allFieldValues2?.project_plan[index]?.screens) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues2 &&
                            allFieldValues2?.project_plan?.length &&
                            allFieldValues2?.project_plan[index]?.features) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues2 &&
                            allFieldValues2?.project_plan?.length &&
                            allFieldValues2?.project_plan[index]?.details) ||
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
                                Module{" "}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "module"]}
                                noStyle
                              >
                                <Input placeholder="module" />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                Screens
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "screens"]}
                                noStyle
                              >
                                <Input
                                  placeholder="Screens"
                                //   defaultValue={1}
                                  suffix={props?.qSuffix}
                                 
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={2}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                Features
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "features"]}
                                noStyle
                              >
                                <Input placeholder="features" />
                              </Form.Item>
                            </Col>

                            <Col sm={4}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                <strong>Details :</strong>
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "details"]}
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
                                //   !allFieldValues?.project_plans[index]?.description
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
export default ProjectPlan;
