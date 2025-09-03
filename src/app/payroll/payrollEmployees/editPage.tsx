import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../../../config/api";
import { GET, PUT } from "../../../utils/apiCalls";

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
  useEffect(() => {
    loadEmployeeGroup();
  }, []);

  const loadEmployeeGroup = async () => {
    try {
      let URL = API.EMPLOYEECATEGORY_LIST_USER + user?.id;
      const data: any = await GET(URL, null);
      setEmployeeGroup(data);
    } catch (error) {}
  };
  const onEmployeesFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url = API.EMPLOYEES_CREATE;
      let obj = {
        firstName: val?.firstName,
        lastName: val?.lastName,
        flat: val?.flat,
        eircode: val?.eircode,
        phone: val?.phone,
        email: val?.email,
        fullAddress: val?.address,
        Designation: val?.Designation,
        accountHolderName: val?.accountHolderName || "",
        accountNumber: val?.accountNumber || "",
        branch: val?.branch || "",
        IFSC: val?.IFSC || "",
        adminId: user?.id,
        employeeGroup: val?.employeeGroup,
        salaryPackage: Number(val?.salaryPackage),
        date_of_join: new Date(val?.date_of_join),
        companyid:user?.companyInfo?.id,
        createdBy:user?.isStaff ? user?.staff?.id : user?.id
      };
      let response: any = await PUT(url, obj);
      if (response.status) {
        setIsLoading(false);

        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate(-1);
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

  return (
    <>
      <Form {...layout} onFinish={onEmployeesFinish} form={forms}>
        <Row>
          <Col md={isAccountInfromation ? 4 : 6}>
            <div className="productAdd-Txt1">Employee Personal Information</div>
            <div className="formItem">
              <label className="formLabel">First Name</label>
              <Form.Item name="firstName">
                <Input />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Last Name</label>
              <Form.Item name="lastName">
                <Input />
              </Form.Item>
            </div>

            <div className="formItem">
              <label className="formLabel">Flat/Building</label>
              <Form.Item name="flat">
                <Input />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Eircode</label>
              <Form.Item name="eircode">
                <Input />
              </Form.Item>
            </div>

            <div className="formItem">
              <label className="formLabel">Phone</label>
              <Form.Item name="phone">
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Email</label>
              <Form.Item name="email">
                <Input />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Full Address</label>
              <Form.Item name="address">
                <Input.TextArea />
              </Form.Item>
            </div>
          </Col>
          <Col md={isAccountInfromation ? 4 : 6}>
            <div className="productAdd-Txt1">General Information</div>
            <div className="formItem">
              <label className="formLabel">Date of Join</label>
              <Form.Item name="date_of_join">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Employee Group (Department)</label>
              <Form.Item name="employeeGroup">
                <Select
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
                <Input />
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">Salary Package</label>
              <Form.Item name="salaryPackage">
                <Input />
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
                  <Input />
                </Form.Item>
              </div>

              <div className="formItem">
                <label className="formLabel">Account Number</label>
                <Form.Item name="accountNumber">
                  <Input />
                </Form.Item>
              </div>
              <div className="formItem">
                <label className="formLabel">Branch</label>
                <Form.Item name="branch">
                  <Input />
                </Form.Item>
              </div>

              <div className="formItem">
                <label className="formLabel">IFSC</label>
                <Form.Item name="IFSC">
                  <Input />
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
    </>
  );
}

export default PayrollEmployeeForm;
