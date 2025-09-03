import { Button, DatePicker, Form, Input, Radio, Select, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import API from "../../../../config/api";
import { GET, POST, PUT } from "../../../../utils/apiCalls";
import AddLedger from "../../../ledger/ledger-PayHead/components/addLedger";
import { useNavigate, useParams } from "react-router-dom";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
function PaySheetForm(props: any) {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const [employees, setEmployees] = useState([]);
  const [earningPayHead, setEarningPayHead] = useState([]);
  const [dedectionPayHead, setDedectionPayHead] = useState<any>([]);
  const [earningPercetage, setEarningPercetage] = useState<any>([]);
  const [percentageof,setPercentageOf] = useState<any>([])
  const [dedectionPercetage, setDedectionPercetage] = useState<any>([]);
  const [allFormValue, setAllFormValue] = useState<any>({});
  const [formChange, setFormChange] = useState("");
  const [toalEarnings, setTotalEarnings] = useState(0);
  const [totalDedections, setTotalDedections] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const [activeEarnings, setActiveEarnings] = useState<any>(-1);
  const [activeDedections, setActiveDedections] = useState<any>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [forms] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    loadEmployee();
    loadPayHead();
  }, []);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let url = API.GET_PAYSHEET + id;
      const data: any = await GET(url, null);

      let earnings: any = [];
      let deduction: any = [];
      for (let i = 0; i < data?.paySheetItems.length; i++) {
        const element = data?.paySheetItems[i];
        if (element.type === "earnings") {
          earnings.push({
            calculationType: element.calculationType,
            payHead: element.payHeadId,
            amount: element.amount,
            percentage:
              element.percentage == "0.00" ? null : element.percentage,
          });
        } else {
          deduction.push({
            calculationType: element.calculationType,
            payHead: element.payHeadId,
            amount: element.amount,
            percentage:
              element.percentage == "0.00" ? null : element.percentage,
          });
        }
      }
      let totalDeduction = 0;
      let totalEarning = 0;
      if (earnings?.length > 0) {
        totalEarning = earnings?.reduce(
          (acc: any, sum: any) => Number(acc) + Number(sum?.amount),
          0
        );
      }
      setTotalEarnings(totalEarning);

      if (deduction?.length > 0) {
        totalDeduction = deduction?.reduce(
          (acc: any, sum: any) => Number(acc) + Number(sum?.amount),
          0
        );
      }
      setTotalDedections(totalDeduction);

      forms.setFieldsValue({
        employee: data?.employeeId,
        id: data?.employeeId,
        firstName: data?.["employee.firstName"],
        lastName: data?.["employee.lastName"],
        phone: data?.["employee.phone"],
        email: data?.["employee.email"],
        salaryPackage: data?.["employee.salaryPackage"],
        earnings: earnings,
        deduction: deduction,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    id !=='create' && fetchDetails();
  }, []);

  const loadEmployee = async () => {
    try {
      let url = API.EMPLOYEES_LIST +`${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(url, null);
      setEmployees(data);
    } catch (error) {}
  };
  const loadPayHead = async () => {
    try {
      let url =`account_master/getPayHeadByCompany/${user?.companyInfo?.id}`;
      // `account_master/getPayHead/${user?.companyInfo?.id}`;
      const data: any = await GET(url, null);
      let earningPayheads: any = [];
      earningPayheads = data.data.filter(
        (item: any) => item?.payheadType === "Earnings"
      );
      let dedectionPayheads: any = [];
      dedectionPayheads = data.data.filter(
        (item: any) => item.payheadType === "Deductions"
      );
      setEarningPayHead(earningPayheads);
      setDedectionPayHead(dedectionPayheads);
    } catch (error) {}
  };
  const onEmpleyeeSelect = (val: any) => {
    try {
      const selectedValue: any = employees?.find(
        (item: any) => item.id === val
      );
      forms.setFieldsValue({
        id: selectedValue?.id,
        firstName: selectedValue?.firstName,
        lastName: selectedValue?.lastName,
        employeeGroup:selectedValue?.employeeGroupDetails?.emplyeeCategory,
        phone: selectedValue?.phone,
        email: selectedValue?.email,
        salaryPackage: selectedValue?.salaryPackage,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const radioOptions = [
    { label: "Flat Amount", value: "flatAmount" },
    { label: "Percentage of", value: "percentage" },
  ];

  useEffect(() => {
    const allFormValue = forms.getFieldsValue();
    setAllFormValue(allFormValue);
  }, [formChange]);

  function getLaccount(payHeadId: any, type: any) {
    let earningPayHeadItem: any = {};
    if (type === "earn") {
      earningPayHeadItem = earningPayHead.find(
        (item: any) => item.id === payHeadId
      );
    } else {
      earningPayHeadItem = dedectionPayHead.find(
        (item: any) => item.id === payHeadId
      );
    }

    return earningPayHeadItem?.laccount || "";
  }
  const onPaySheetFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url = props.id === "create" ? API.PAYSHEET_CREATE :  API.UPDATE_PAYSHEET + id;
      let obj = {
        employeeId: val?.employee,
        id: 1,
        totalDeduction: totalDedections,
        totalEarnings: toalEarnings,
        netSalary: Number(toalEarnings) - Number(totalDedections),
        adminId: user?.id,
        earnings: val?.earnings,
        deduction: val?.deduction,
        companyid:user?.companyInfo?.id,
        createdBy:user?.isStaff ? user?.staff?.id : user?.companyInfo?.id
      };
      let response: any = props.id === "create" ? await POST(url, obj) : await PUT(url,obj);
      if (response.status) {
        setIsLoading(false);

        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate('/usr/payroll/paysheet');
      } else {
        setIsLoading(false);
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const onPaySheetValueChange = (val: any, allfeild: any) => {
    try {
      let percetageOfEarnings: any = [];
      let percetageOfDedection: any = [];

      if (allfeild?.earnings?.length > 0 ) {
        let newEarnings = allfeild?.earnings?.map((item: any, index: any) => {
          let totalPercentageOfAmount = 0;
          // let amount = 0;

          let amount =
            val?.earnings &&
            val?.earnings.length &&
            val?.earnings[index]?.amount
              ? Number(val?.earnings[index]?.amount)
              : Number(item?.amount);
          let selectedPayHead = earningPayHead?.filter(
            (payHead: any) => Number(payHead?.id) === Number(item?.payHead)
          );

          if (selectedPayHead) {
            const uniquePayHeads: any = new Set([
              ...percetageOfEarnings,
              ...selectedPayHead,
            ]);
            percetageOfEarnings = [...uniquePayHeads];
          }
          if (item?.percentageof && item?.percentageof?.length) {
            for (let i = 0; i < item?.percentageof.length; i++) {
              const element = item?.percentageof[i];
              const findedPayHead: any = allfeild?.earnings.find(
                (item: any) => Number(item.payHead) === Number(element)
              );
              totalPercentageOfAmount += Number(findedPayHead?.amount);
            }
            const percentageRate = Number(item.percentage) / 100;
            amount = totalPercentageOfAmount * percentageRate;
          }

          setEarningPercetage([...percetageOfEarnings]);
          setPercentageOf([...percetageOfEarnings])

          return {
            calculationType: item?.calculationType,
            payHead: item.payHead,
            amount: amount,
            percentageof: item?.percentageof,
            percentage: item.percentage,
          };
        });

        forms.setFieldsValue({ earnings: newEarnings });
        let totalEarnings = 0;
        if (newEarnings?.length > 0) {
          totalEarnings = newEarnings?.reduce(
            (acc: any, sum: any) => Number(acc) + Number(sum?.amount),
            0
          );
        }
        setTotalEarnings(totalEarnings);
      }

      if (allfeild?.deduction?.length > 0) {
        let newDeduction = allfeild?.deduction?.map((item: any, index: any) => {
          let totalPercentageOfAmount = 0;
          let amount =
            val?.deduction &&
            val?.deduction.length &&
            val?.deduction[index]?.amount
              ? Number(val?.deduction[index]?.amount)
              : Number(item?.amount);

          let selectedPayHead = dedectionPayHead?.filter(
            (payHead: any) => Number(payHead?.id) === Number(item?.payHead)
          );
          if (selectedPayHead) {
            const uniquePayHeads: any = new Set([
              ...percetageOfDedection,
              ...selectedPayHead,
            ]);
            percetageOfDedection = [...uniquePayHeads];
          }
          if (item?.percentageof && item?.percentageof?.length) {
            for (let i = 0; i < item?.percentageof?.length; i++) {
              const element = item?.percentageof[i];
              const findedPayHead: any = allfeild?.deduction?.find(
                (item: any) => Number(item?.payHead) === Number(element)
              );
              totalPercentageOfAmount += Number(findedPayHead?.amount);
            }
            const percentageRate = Number(item.percentage) / 100;
            amount = totalPercentageOfAmount * percentageRate;
          }
          setDedectionPercetage([...percetageOfDedection]);

          return {
            calculationType: item?.calculationType,
            payHead: item?.payHead,
            amount: amount,
            percentageof: item?.percentageof,
            percentage: item.percentage,
          };
        });

        forms.setFieldsValue({ deduction: newDeduction });
        let totalDeduction = 0;
        if (newDeduction?.length > 0) {
          totalDeduction = newDeduction?.reduce(
            (acc: any, sum: any) => Number(acc) + Number(sum?.amount),
            0
          );
        }
        setTotalDedections(totalDeduction);
      }

      setFormChange(val);
    } catch (error) {
      console.log("Error:", error);
      setFormChange(val);
    }
  };

  return (
    <div>
      <Form
        {...layout}
        onFinish={onPaySheetFinish}
        form={forms}
        onValuesChange={onPaySheetValueChange}
      >
        <div className="productAdd-Txt1">Employee Infromation</div>
        <Row>
          <Col md={4}>
          <label className="formLabel">Select Month And Year</label>
            <Form.Item
            name="monthAndYear"
            rules={[
            {
              required: true,
              message: 'Please select a month and year',
            },
          ]}
        >
          <DatePicker.MonthPicker format="MMMM YYYY" style={{width:'100%'}}/>
        </Form.Item>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Employee</label>
              <Form.Item name="employee">
                <Select
                  allowClear
                  showSearch
                  placeholder="select the employee"
                  onChange={onEmpleyeeSelect}
                >
                  {employees?.length &&
                    employees?.map((item: any) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.email}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Employee Id</label>
              <Form.Item name="id">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>

          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">First Name</label>
              <Form.Item name="firstName">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">LastName</label>
              <Form.Item name="lastName">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Employee Group</label>
              <Form.Item name="employeeGroup">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Phone</label>
              <Form.Item name="phone">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Email</label>
              <Form.Item name="email">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
            <div className="formItem">
              <label className="formLabel">Salary Package</label>
              <Form.Item name="salaryPackage">
                <Input readOnly />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div>
          <Form.List name={"earnings"}>
            {(fields, { add, remove }, { errors }) => (
              <div>
                <div className="salesInvoice-SubHeader">
                  <div>Earnings</div>
                  <div>
                    <Button
                      onClick={() => {
                        if (activeEarnings === -1) {
                          add({
                            calculationType: "flatAmount",
                            payHead: null,
                            amount: null,
                            percentageof: [],
                          });
                          setActiveEarnings(fields?.length);
                          setFormChange("flatAmountdede");
                        }
                      }}
                      style={{ backgroundColor: "#ff9800", color: "#fff" }}
                      disabled={activeEarnings !== -1}
                    >
                      + Add Earnings
                    </Button>
                  </div>
                </div>
                <Table bordered>
                  <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
                    <tr>
                      <th style={{ textAlign: "center" }}>Pay Head</th>
                      <th style={{ textAlign: "center" }}>Calculation Type</th>
                      <th style={{ textAlign: "center" }}>Percentage Of</th>
                      <th style={{ textAlign: "center" }}>Percentage %</th>
                      <th style={{ textAlign: "center" }}>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map(
                      ({ key, name, ...restField }: any, index: number) => {
                        return (
                          <React.Fragment key={index.toString()}>
                            {index === activeEarnings ? null : (
                              <tr style={{ textAlign: "center" }}>
                                <td>
                                  {allFormValue?.earnings?.length &&
                                    getLaccount(
                                      allFormValue?.earnings[index]?.payHead,
                                      "earn"
                                    )}
                                </td>
                                <td>
                                  {allFormValue?.earnings?.length &&
                                    allFormValue?.earnings[index]
                                      ?.calculationType}
                                </td>
                                <td>
                                  {(allFormValue?.earnings?.length &&
                                    allFormValue?.earnings[index]?.percentageof
                                      ?.length &&
                                    allFormValue?.earnings[
                                      index
                                    ]?.percentageof?.map((percent: any) => {
                                      return (
                                        <span>
                                          {getLaccount(percent, "earn") + " ,"}
                                        </span>
                                      );
                                    })) || (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      --
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {(allFormValue?.earnings?.length &&
                                    allFormValue?.earnings[index]
                                      ?.percentage) || (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      --
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {allFormValue?.earnings?.length &&
                                    allFormValue?.earnings[index]?.amount}
                                </td>
                                <td style={{ width: 70 }}>
                                  <div className="salesInvoice-action">
                                    <div
                                      onClick={() =>
                                        activeEarnings === -1
                                          ? setActiveEarnings(index)
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
                                        if (activeEarnings === -1) {
                                          remove(name);
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

                            {index === activeEarnings ? (
                              <tr>
                                <td
                                  colSpan={10}
                                  style={{
                                    backgroundColor: "rgb(247, 247, 247)",
                                  }}
                                >
                                  <Row>
                                    <Form.Item name={[name, "calculationType"]}>
                                      <div className="formItem">
                                        <label className="formLabel">
                                          Calculation Type
                                        </label>
                                        <div>
                                          <Radio.Group
                                            size="small"
                                            style={{ marginTop: 10 }}
                                            options={radioOptions}
                                            onChange={(val: any) =>
                                              setFormChange(val)
                                            }
                                            defaultValue={"flatAmount"}
                                          />
                                        </div>
                                      </div>
                                    </Form.Item>
                                    <Col
                                      sm={
                                        allFormValue?.earnings?.length &&
                                        allFormValue?.earnings[index]
                                          ?.calculationType !== "flatAmount"
                                          ? "3"
                                          : "6"
                                      }
                                    >
                                      <label className="formLabel">
                                        Pay Head
                                      </label>
                                      <Form.Item name={[name, "payHead"]}>
                                        <Select
                                          placeholder="choose payhead"
                                          allowClear
                                          showSearch
                                          filterOption={(
                                            input: any,
                                            option: any
                                          ): any => {
                                            let isInclude = false;
                                            isInclude = option.children
                                              .toString()
                                              .toLowerCase()
                                              .includes(input.toLowerCase());

                                            if (option.value === "addButton") {
                                              isInclude = true;
                                            }
                                            return isInclude;
                                          }}
                                        >
                                          {earningPayHead?.length &&
                                            earningPayHead?.map((item: any) => (
                                              <Select.Option
                                                key={item.id}
                                                value={item.id}
                                              >
                                                {item.laccount}
                                              </Select.Option>
                                            ))}
                                          <Select.Option
                                            key="addButton"
                                            value="addButton"
                                          >
                                            <Button
                                              block
                                              type="primary"
                                              onClick={() => setIsForm(true)}
                                            >
                                              <GoPlus /> Add
                                            </Button>
                                          </Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    {allFormValue?.earnings?.length &&
                                      allFormValue?.earnings[index]
                                        ?.calculationType !== "flatAmount" && (
                                        <Col sm={"3"}>
                                          <label className="formLabel">
                                            Percentage of{" "}
                                          </label>
                                          <div className="formItem">
                                            <Form.Item
                                              name={[name, "percentageof"]}
                                            >
                                              <Select
                                                allowClear
                                                mode="multiple"
                                                placeholder="choose Percentage of"
                                              >
                                                {percentageof?.map(
                                                  (option: any, index: any) => (
                                                    <Select.Option
                                                      key={index + ""}
                                                      value={option.id}
                                                    >
                                                      {option.laccount}
                                                    </Select.Option>
                                                  )
                                                )}
                                              </Select>
                                            </Form.Item>
                                          </div>
                                        </Col>
                                      )}
                                    {allFormValue?.earnings?.length &&
                                      allFormValue?.earnings[index]
                                        ?.calculationType !== "flatAmount" && (
                                        <Col sm={"3"}>
                                          <label className="formLabel">
                                            Percentage{" "}
                                          </label>
                                          <div className="formItem">
                                            <Form.Item
                                              name={[name, "percentage"]}
                                            >
                                              <Input
                                                type="number"
                                                placeholder={"enter percentage"}
                                              />
                                            </Form.Item>
                                          </div>
                                        </Col>
                                      )}

                                    <Col
                                      sm={
                                        allFormValue?.earnings?.length &&
                                        allFormValue?.earnings[index]
                                          ?.calculationType !== "flatAmount"
                                          ? "3"
                                          : "6"
                                      }
                                    >
                                      <label className="formLabel">
                                        {"Amount"}
                                      </label>
                                      <Form.Item name={[name, "amount"]}>
                                        <Input
                                          type="number"
                                          readOnly={
                                            allFormValue?.earnings?.length &&
                                            allFormValue?.earnings[index]
                                              ?.calculationType !== "flatAmount"
                                          }
                                          placeholder={
                                            allFormValue?.earnings?.length &&
                                            allFormValue?.earnings[index]
                                              ?.calculationType !== "flatAmount"
                                              ? "enter percentage"
                                              : "enter amount"
                                          }
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col sm={8}></Col>
                                    <Col sm={2}>
                                      <div style={{ marginTop: 28 }}></div>
                                      <Button
                                        danger
                                        block
                                        onClick={() => {
                                          remove(name);
                                          setActiveEarnings(-1);
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
                                        onClick={() => setActiveEarnings(-1)}
                                      >
                                        Save
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                              </tr>
                            ) : null}
                          </React.Fragment>
                        );
                      }
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Form.List>
        </div>
        <br />

        <div>
          <Form.List name={"deduction"}>
            {(fields, { add, remove }, { errors }) => (
              <div>
                <div className="salesInvoice-SubHeader">
                  <div>Deductions</div>
                  <div>
                    <Button
                      onClick={() => {
                        if (activeDedections === -1) {
                          add({
                            calculationType: "flatAmount",
                            payHead: null,
                            amount: null,
                            percentageof: [],
                          });
                          setActiveDedections(fields?.length);
                          setFormChange("flatAmountearn");
                        }
                      }}
                      style={{ backgroundColor: "#ff9800", color: "#fff" }}
                      disabled={activeDedections !== -1}
                    >
                      + Add Deduction
                    </Button>
                  </div>
                </div>
                <Table bordered>
                  <thead style={{ backgroundColor: "rgb(247, 247, 247)" }}>
                    <tr>
                      <th style={{ textAlign: "center" }}>Pay Head</th>
                      <th style={{ textAlign: "center" }}>Calculation Type</th>
                      <th style={{ textAlign: "center" }}>Percentage Of</th>
                      <th style={{ textAlign: "center" }}>Percentage %</th>
                      <th style={{ textAlign: "center" }}>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields?.map(
                      ({ key, name, ...restField }: any, index: number) => {
                        return (
                          <React.Fragment key={index.toString()}>
                            {index === activeDedections ? null : (
                              <tr style={{ textAlign: "center" }}>
                                <td>
                                  {allFormValue?.deduction?.length &&
                                    getLaccount(
                                      allFormValue?.deduction[index]?.payHead,
                                      "ded"
                                    )}
                                </td>
                                <td>
                                  {allFormValue?.deduction?.length &&
                                    allFormValue?.deduction[index]
                                      ?.calculationType}
                                </td>
                                <td>
                                  {(allFormValue?.deduction?.length &&
                                    allFormValue?.deduction[index]?.percentageof
                                      ?.length &&
                                    allFormValue?.deduction[
                                      index
                                    ]?.percentageof?.map((percent: any) => {
                                      return (
                                        <span>
                                          {getLaccount(percent, "ded") + " ,"}
                                        </span>
                                      );
                                    })) || (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      --
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {(allFormValue?.deduction?.length &&
                                    allFormValue?.deduction[index]
                                      ?.percentage) || (
                                    <div
                                      style={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      --
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {allFormValue?.deduction?.length &&
                                    allFormValue?.deduction[index]?.amount}
                                </td>
                                <td style={{ width: 70 }}>
                                  <div className="salesInvoice-action">
                                    <div
                                      onClick={() =>
                                        activeEarnings === -1
                                          ? setActiveDedections(index)
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
                                        if (activeEarnings === -1) {
                                          remove(name);
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

                            {index === activeDedections ? (
                              <tr>
                                <td
                                  colSpan={10}
                                  style={{
                                    backgroundColor: "rgb(247, 247, 247)",
                                  }}
                                >
                                  <Row>
                                    <Form.Item name={[name, "calculationType"]}>
                                      <div className="formItem">
                                        <label className="formLabel">
                                          Calculation Type
                                        </label>
                                        <div>
                                          <Radio.Group
                                            size="small"
                                            style={{ marginTop: 10 }}
                                            options={radioOptions}
                                            onChange={(val: any) =>
                                              setFormChange(val)
                                            }
                                            defaultValue={"flatAmount"}
                                          />
                                        </div>
                                      </div>
                                    </Form.Item>
                                    <Col
                                      sm={
                                        allFormValue?.deduction?.length &&
                                        allFormValue?.deduction[index]
                                          ?.calculationType !== "flatAmount"
                                          ? "3"
                                          : "6"
                                      }
                                    >
                                      <label className="formLabel">
                                        Pay Head
                                      </label>
                                      <Form.Item name={[name, "payHead"]}>
                                        <Select
                                          placeholder="choose payhead"
                                          allowClear
                                          showSearch
                                          filterOption={(
                                            input: any,
                                            option: any
                                          ): any => {
                                            let isInclude = false;
                                            isInclude = option.children
                                              .toString()
                                              .toLowerCase()
                                              .includes(input.toLowerCase());

                                            if (option.value === "addButton") {
                                              isInclude = true;
                                            }
                                            return isInclude;
                                          }}
                                        >
                                          {dedectionPayHead?.length &&
                                            dedectionPayHead?.map(
                                              (item: any) => (
                                                <Select.Option
                                                  key={item.id}
                                                  value={item.id}
                                                >
                                                  {item.laccount}
                                                </Select.Option>
                                              )
                                            )}
                                          <Select.Option
                                            key="addButton"
                                            value="addButton"
                                          >
                                            <Button
                                              block
                                              type="primary"
                                              onClick={() => setIsForm(true)}
                                            >
                                              <GoPlus /> Add
                                            </Button>
                                          </Select.Option>
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    {allFormValue?.deduction?.length &&
                                      allFormValue?.deduction[index]
                                        ?.calculationType !== "flatAmount" && (
                                        <Col sm={"3"}>
                                          <label className="formLabel">
                                            Percentage of{" "}
                                          </label>
                                          <div className="formItem">
                                            <Form.Item
                                              name={[name, "percentageof"]}
                                            >
                                              <Select
                                                allowClear
                                                mode="multiple"
                                                placeholder="choose Percentage of"
                                              >
                                                {dedectionPayHead?.map(
                                                  (option: any, index: any) => (
                                                    <Select.Option
                                                      key={index + ""}
                                                      value={option.id}
                                                    >
                                                      {option.laccount}
                                                    </Select.Option>
                                                  )
                                                )}
                                              </Select>
                                            </Form.Item>
                                          </div>
                                        </Col>
                                      )}
                                    {allFormValue?.deduction?.length &&
                                      allFormValue?.deduction[index]
                                        ?.calculationType !== "flatAmount" && (
                                        <Col sm={"3"}>
                                          <label className="formLabel">
                                            Percentage{" "}
                                          </label>
                                          <div className="formItem">
                                            <Form.Item
                                              name={[name, "percentage"]}
                                            >
                                              <Input
                                                type="number"
                                                placeholder={"enter percentage"}
                                              />
                                            </Form.Item>
                                          </div>
                                        </Col>
                                      )}

                                    <Col
                                      sm={
                                        allFormValue?.deduction?.length &&
                                        allFormValue?.deduction[index]
                                          ?.calculationType !== "flatAmount"
                                          ? "3"
                                          : "6"
                                      }
                                    >
                                      <label className="formLabel">
                                        {"Amount"}
                                      </label>
                                      <Form.Item name={[name, "amount"]}>
                                        <Input
                                          type="number"
                                          readOnly={
                                            allFormValue?.deduction?.length &&
                                            allFormValue?.deduction[index]
                                              ?.calculationType !== "flatAmount"
                                          }
                                          placeholder={
                                            allFormValue?.deduction?.length &&
                                            allFormValue?.deduction[index]
                                              ?.calculationType !== "flatAmount"
                                              ? "enter percentage"
                                              : "enter amount"
                                          }
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col sm={8}></Col>
                                    <Col sm={2}>
                                      <div style={{ marginTop: 28 }}></div>
                                      <Button
                                        danger
                                        block
                                        onClick={() => {
                                          remove(name);
                                          setActiveDedections(-1);
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
                                        onClick={() => setActiveDedections(-1)}
                                      >
                                        Save
                                      </Button>
                                    </Col>
                                  </Row>
                                </td>
                              </tr>
                            ) : null}
                          </React.Fragment>
                        );
                      }
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Form.List>
        </div>
        <br />
        <Row>
          <Col sm="6"></Col>
          <Col sm="6">
            <Table bordered>
              <tbody>
                <tr>
                  <td className="items-head">Total Earnings</td>
                  <td className="items-head">{toalEarnings?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="items-head">Total Deduction</td>
                  <td className="items-head">{totalDedections?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="items-head">Net Salary</td>
                  <td className="items-head">
                    {(Number(toalEarnings) - Number(totalDedections))?.toFixed(
                      2
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md="6"></Col>
          <Col md="3">
            <Button block size="large" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Col>
          <Col md="3">
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {isForm && (
        <AddLedger
          open={isForm}
          onOpen={isForm}
          onClose={() => {
            setIsForm(false);
          }}
          onSuccess={() => {
            setIsForm(false);
          }}
          reload={() => {
            loadPayHead();
          }}
        />
      )}
    </div>
  );
}

export default PaySheetForm;