import { Button, Form, Input, notification, Select } from 'antd';
import React, { useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

const ExtraCharges = (props:any) => {
    const [active, setActive] = useState<any>(-1);
    const { t } = useTranslation();
    const [isDisabled, setIsDisabled] = useState(false);
    const allFieldValues = props?.form?.getFieldsValue();

    function disableDuplicates(arr1: any, arr2: any) {
      const uniqueIds = arr2?.map((item: any) => item.id);
      const result = arr1?.map((item: any) => {
        if (uniqueIds?.includes(item.id)) {
          return { ...item, disable: true };
        }
        return { ...item, disable: false };
      });
      return result;
    }

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

  return (
    <Form.List name={"charges"}>
      {(fields, { add, remove }, { errors }) => (
        <div>
          <div className="salesInvoice-SubHeader">
            <div>
            {t("home_page.homepage.Extra_Charges")}
            </div>
            <div>
              <Button
                onClick={() => {
                  if (active == -1) {
                    add({
                      ledger: null,
                      paidFrom: null,
                      amount: null,
                      notes: null,
                    });
                    setActive(fields?.length);
                  }
                }}
                style={{ backgroundColor: "#ff9800", color: "#fff" }}
              >
                {t("home_page.homepage.Add_Charge")}
              </Button>
            </div>
          </div>
          <Table bordered>
            <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
              <tr>
                <th>{t("home_page.homepage.slno")}</th>
                <th>{t("home_page.homepage.Ledger")}</th>
                <th>{t("home_page.homepage.Bank_Cash")}</th>
                <th>{t("home_page.homepage.Amount")}</th>
                <th>{t("home_page.homepage.Notes")}</th>
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
                          {index+1}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.charges?.length &&
                            allFieldValues?.charges[index]?.ledgerName) ||
                            "n/a"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.charges?.length &&
                            allFieldValues?.charges[index]?.paidBank) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.charges?.length &&
                            allFieldValues?.charges[index]?.amount) ||
                            "0"}
                        </td>
                        <td>
                          {(allFieldValues &&
                            allFieldValues?.charges?.length &&
                            allFieldValues?.charges[index]?.notes) ||
                            ""}
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
                                {t("home_page.homepage.Account_Ledger")}
                               
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "ledgerId"]}
                                noStyle
                                required
                                rules={[{ required: true, message: "" }]}
                              >
                                <Select
                                  allowClear
                                  placeholder="Choose Ledger"
                                  style={{ width: "100%" }}
                                  onSearch={(value) =>props?.setSearchQuery(value)}
                                  showSearch
                                  filterOption={(input: any, option: any) =>
                                    option?.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {disableDuplicates(
                                    props?.ledgersData,
                                    props?.form.getFieldsValue().charges
                                  )?.map((item: any) => (
                                    <Select.Option
                                      key={item.id}
                                      value={item.id}
                                      disabled={item?.disable}
                                    >
                                      {item.laccount}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col sm={3}>
                            <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >{t("home_page.homepage.Ledger_PaidFrom")}
                                
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "paidFrom"]}
                                noStyle
                                rules={[{ required: true, message: "Please choose Bank/Cash" }]}
                              >
                                <Select
                                  allowClear
                                  placeholder="Choose Ledger"
                                  style={{ width: "100%" }}
                                  showSearch
                                  filterOption={(input: any, option: any) =>
                                    option?.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {props?.bankData?.map((item: any) => (
                                    <Select.Option
                                    key={item?.list?.id}
                                    value={item?.list?.id}
                                    >
                                    {item?.list?.laccount}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col sm={3}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Amount")}
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "amount"]}
                                noStyle
                                rules={[{ validator: validatePrice }]}
                              >
                                <Input
                                  placeholder="amount"
                                  suffix={props?.qSuffix}
                                  type="number"
                                />
                              </Form.Item>
                            </Col>
                            <Col sm={3}>
                              <div
                                className="formLabel"
                                style={{ marginTop: 10 }}
                              >
                                {t("home_page.homepage.Notes")}
                                
                              </div>
                              <Form.Item
                                {...field}
                                name={[field.name, "notes"]}
                                noStyle
                              >
                                <Input placeholder="Notes"/>
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
                              >{t("home_page.homepage.Remove")}
                                
                              </Button>
                            </Col>
                            <Col sm={2}>
                              <div style={{ marginTop: 28 }}></div>
                              <Button
                                type="primary"
                                block
                                onClick={() => setActive(-1)}
                                disabled={
                                  !allFieldValues?.charges[index]?.ledgerId || isDisabled
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
            </tbody>
          </Table>
        </div>
      )}
    </Form.List>
  )
}

export default ExtraCharges