import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../config/api";
import { GET, POST, PUT } from "../../../../utils/apiCalls";
import CreateSettings from "../../../settings/components/form";
import LoadingBox from "../../../../components/loadingBox";
import dayjs from "dayjs";
import PrefixSelector from "../../../../components/prefixSelector";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
function PayrollEmployeeForm(props: any) {
  const { user } = useSelector((state: any) => state.User);
  const [isAccountInfromation, setIsAccountInfromation] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [forms] = Form.useForm();
  const [employeeGroup, setEmployeeGroup] = useState([]);
  const [isLoading1, setIsLoading1] = useState(false);

  const adminid = user?.id;
  const id = useParams();
  let edit = id.id;

  useEffect(() => {
    loadEmployeeGroup();
  }, []);

  useEffect(() => {
    edit !== "create" && GetEmployees();
  }, []);

  const loadEmployeeGroup = async () => {
    try {
      let URL = API.EMPLOYEECATEGORY_LIST_USER + user?.id;
      const data: any = await GET(URL, null);
      setEmployeeGroup(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onEmployeesFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let mobile = `${val.code} ${val.phone}`;
      let url =
        props.id === "create"
          ? API.EMPLOYEES_CREATE
          : API.EMPLOYEES_UPDATE + edit;
      let obj = {
        firstName: val?.firstName,
        lastName: val?.lastName,
        employeeNumber: val?.employeeNumber,
        eircode: val?.eircode || "",
        phone: mobile,
        email: val?.email,
        fullAddress: val?.fullAddress,
        Designation: val?.Designation,
        accountHolderName: val?.accountHolderName || "",
        accountNumber: val?.accountNumber || "",
        branch: val?.branch || "",
        IFSC: val?.IFSC || "",
        adminId: user?.id,
        employeeGroup: val?.employeeGroup,
        salaryPackage: Number(val?.salaryPackage),
        date_of_join: new Date(val?.date_of_join),
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      let response: any =
        props.id === "create" ? await POST(url, obj) : await PUT(url, obj);
      if (response.status) {
        notification.success({
          message: "Success",
          description:
            props.id === "create"
              ? "New employee created successfully"
              : "Employee details updated successfully",
        });
        navigate("/usr/payroll/employees");
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            props.id === "create" ? "create new" : "update"
          } employee`,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Sever Error",
        description: `Failed to ${
          props.id === "create" ? "create new" : "update"
        } employee!! Please try again later`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const GetEmployees = async () => {
    setIsLoading1(true);
    try {
      const url = API.EMPLOYEES_LIST_USER + `${user?.companyInfo?.id}/` + edit;
      const response: any = await GET(url, null);
      if (response.status) {
        let data = response.data;
        setIsAccountInfromation(
          data?.accountHolderName ||
            data?.accountNumber ||
            data?.branch ||
            data?.IFSC
            ? true
            : false
        );
        forms.setFieldsValue({
          firstName: data?.firstName,
          lastName: data?.lastName,
          employeeNumber: data?.employeeNumber || "",
          eircode: data?.eircode,
          Designation: data?.Designation,
          IFSC: data?.IFSC,
          accountHolderName: data?.accountHolderName,
          accountNumber: data?.accountNumber,
          branch: data?.branch,
          date_of_join: dayjs(data?.date_of_join),
          employeeGroup: data?.employeeGroup,
          email: data?.email,
          salaryPackage: data?.salaryPackage,
          phone: data?.phone && data?.phone.split(" ")[1],
          code: data?.phone
            ? data?.phone.split(" ")[0]
            : user?.companyInfo?.countryInfo?.phoneCode,
          fullAddress: data?.fullAddress,
        });
      }
      setIsLoading1(true);
    } catch (error) {
      console.log(error);
      setIsLoading1(false);
    } finally {
      setIsLoading1(false);
    }
  };

  return (
    <>
      {isLoading1 ? (
        <LoadingBox />
      ) : (
        <Form
          {...layout}
          onFinish={onEmployeesFinish}
          form={forms}
          initialValues={{ code: user?.companyInfo?.countryInfo?.phoneCode }}
        >
          <Row>
            <Col md={isAccountInfromation ? 4 : 6}>
              <div className="productAdd-Txt1">
                Employee Personal Information
              </div>
              <div className="formItem">
                <label className="formLabel">First Name</label>
                <Form.Item name="firstName">
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Last Name</label>
                <Form.Item name="lastName">
                  <Input size="large" />
                </Form.Item>
              </div>

              <div className="formItem">
                <label className="formLabel">Employee Number</label>
                <Form.Item name="employeeNumber">
                  <Input size="large" />
                </Form.Item>
              </div>
              {/* <div className="formItem">
                <label className="formLabel">Eircode</label>
                <Form.Item name="eircode">
                  <Input />
                </Form.Item>
              </div> */}

              <div className="formItem">
                <label className="formLabel">Mobile Number</label>
                <Form.Item
                  name="phone"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Mobile Number"
                    size="large"
                    className="input-field"
                    addonBefore={<PrefixSelector />}
                    type="text"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                  />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Email</label>
                <Form.Item name="email">
                  <Input size="large" type="email" />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Full Address</label>
                <Form.Item name="fullAddress" rules={[{ required: true }]}>
                  <Input.TextArea size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col md={isAccountInfromation ? 4 : 6}>
              <div className="productAdd-Txt1">General Information</div>
              <div className="formItem">
                <label className="formLabel">Date of Join</label>
                <Form.Item name="date_of_join" rules={[{ required: true }]}>
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Employee Group (Department)</label>
                <Form.Item name="employeeGroup" rules={[{ required: true }]}>
                  <Select
                    size="large"
                    allowClear
                    showSearch
                    filterOption={(input: any, option: any): any => {
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
                    {employeeGroup.map((item: any) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.emplyeeCategory}
                      </Select.Option>
                    ))}
                    <Select.Option key="addButton" value="addButton">
                      <Button
                        type="primary"
                        block
                        onClick={() => {
                          setIsForm(true);
                        }}
                      >
                        <GoPlus /> Add New
                      </Button>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Designation</label>
                <Form.Item name="Designation">
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Salary Package</label>
                <Form.Item name="salaryPackage" rules={[{ required: true }]}>
                  <InputNumber
                    controls={false}
                    type="number"
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Form.Item>
              </div>
              <div
                className="mt-3"
                style={{ display: "flex", justifyContent: "space-between" }}
                onClick={() => setIsAccountInfromation(!isAccountInfromation)}
              >
                <label className="formLabel">
                  Select if need to include bank account information
                </label>

                <Checkbox
                  checked={isAccountInfromation}
                  onChange={(e) => setIsAccountInfromation(e.target.checked)}
                />
              </div>
            </Col>
            {isAccountInfromation && (
              <Col md={4}>
                <div className="productAdd-Txt1">Bank Account Information</div>
                <div className="formItem">
                  <label className="formLabel">Account Holder Name</label>
                  <Form.Item name="accountHolderName">
                    <Input size="large" />
                  </Form.Item>
                </div>

                <div className="formItem">
                  <label className="formLabel">Account Number</label>
                  <Form.Item name="accountNumber">
                    <Input size="large" />
                  </Form.Item>
                </div>
                <div className="formItem">
                  <label className="formLabel">Branch</label>
                  <Form.Item name="branch">
                    <Input size="large" />
                  </Form.Item>
                </div>

                <div className="formItem">
                  <label className="formLabel">IFSC</label>
                  <Form.Item name="IFSC">
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
            )}

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
          </Row>
        </Form>
      )}

      {isForm && (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            forms.setFieldsValue({
              employeeGroup: null,
            });
          }}
          source={"employeeCategory"}
          id={"create"}
          reload={() => {
            forms.setFieldsValue({
              employeeGroup: null,
            });
            loadEmployeeGroup();
          }}
        />
      )}
    </>
  );
}

export default PayrollEmployeeForm;
