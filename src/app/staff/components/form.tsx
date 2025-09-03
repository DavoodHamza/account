import {
  Button,
  Card,
  Form,
  Input,
  Transfer,
  notification,
  Switch,
  Space,
  Typography,
  Collapse,
  Row as AntRow,
  Col as AntCol,
} from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import PrefixSelector from "../../../components/prefixSelector";
import API from "../../../config/api";
import items from "../../../navigation/privilages.json";
import { CREATEBASEURL, GET, POST, PUT } from "../../../utils/apiCalls";
import { setBaseUrl } from "../../../redux/slices/userSlice";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const StaffForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [targetKeys, setTargetKeys] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [granularPermissions, setGranularPermissions] = useState<{
    [key: string]: any;
  }>({});
  const { user } = useSelector((state: any) => state.User);

  // Define modules for granular permissions
  const modules = [
    {
      id: "1",
      name: "Dashboard",
      icon: "📊",
      description: "Access to dashboard and overview",
    },
    {
      id: "2",
      name: "Product & Service",
      icon: "📦",
      description: "Manage products, services, and inventory",
    },
    {
      id: "3",
      name: "Stock Transfer",
      icon: "🔄",
      description: "Manage stock transfers between locations",
    },
    {
      id: "4",
      name: "Sales",
      icon: "💰",
      description: "Manage sales invoices and transactions",
    },
    {
      id: "5",
      name: "Purchase",
      icon: "🛒",
      description: "Manage purchases and expenses",
    },
    {
      id: "6",
      name: "Contacts",
      icon: "👥",
      description: "Manage customers and suppliers",
    },
    {
      id: "7",
      name: "Journals",
      icon: "📝",
      description: "Manage accounting journals",
    },
    {
      id: "8",
      name: "Payments",
      icon: "💳",
      description: "Manage payment transactions",
    },
    {
      
      id: "9",
      name: "Receipts",
      icon: "🧾",
      description: "Manage receipt transactions",
    },
    {
      id: "10",
      name: "Contra Voucher",
      icon: "↔️",
      description: "Manage contra vouchers",
    },
    {
      id: "11",
      name: "Bank",
      icon: "🏦",
      description: "Manage bank accounts and transactions",
    },
    {
      id: "12",
      name: "Cash",
      icon: "💵",
      description: "Manage cash transactions",
    },
    {
      id: "13",
      name: "Reports",
      icon: "📈",
      description: "Access to reports and analytics",
    },
    {
      id: "14",
      name: "Ledger",
      icon: "📋",
      description: "Manage ledgers and accounts",
    },
    {
      id: "18",
      name: "Proposal",
      icon: "📄",
      description: "Manage proposals and quotes",
    },
    {
      id: "19",
      name: "Staff Management",
      icon: "👨‍💼",
      description: "Manage staff members and permissions",
    },
    {
      id: "20",
      name: "Counter",
      icon: "🔢",
      description: "Manage counter operations",
    },
    {
      id: "21",
      name: "Settings",
      icon: "⚙️",
      description: "Access to system settings",
    },
  ];

  const { type, id } = useParams();
  const adminid = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  useEffect(() => {
    type === "edit" && fetchStaffDetails();
  }, []);

  const fetchStaffDetails = async () => {
    try {
      setIsLoadingFetch(true);
      const staff_details_url = API.CONTACT_MASTER + `details/${id}`;
      const { data }: any = await GET(staff_details_url, null);
      let access = data.access?.split("|") || [];
      setTargetKeys(access);

      // Initialize granular permissions
      const initialGranularPermissions: { [key: string]: any } = {};
      modules.forEach((module) => {
        initialGranularPermissions[module.id] = {
          view: access.includes(module.id),
          create: access.includes(`${module.id}_create`),
          update: access.includes(`${module.id}_update`),
          delete: module.id === "2" ? false : access.includes(`${module.id}_delete`), // Disable delete for Product & Service
        };
      });
      setGranularPermissions(initialGranularPermissions);

      form.setFieldsValue({
        name: data?.name,
        adminid: data?.adminid,
        reference: data?.reference,
        code: data?.mobile
          ? data?.mobile.split(" ")[0]
          : user?.companyInfo?.countryInfo?.phoneCode,
        mobile: data?.mobile && data?.mobile.split(" ")[1],
        email: data?.email,
        telephone: data?.telephone,
        city: data?.city,
        address: data?.address,
        postcode: data?.postcode,
        notes: data?.notes,
        ledger_category: data?.ledger_category,
        image: data?.image,
        staffId: data?.staffId,
        access,
        //password:data?.password
      });

      setIsLoadingFetch(false);
    } catch (error) {
      console.log(error);
      setIsLoadingFetch(false);
    }
  };

  const handleGranularPermissionChange = (
    moduleId: string,
    permissionType: "view" | "create" | "update" | "delete",
    checked: boolean
  ) => {
    setGranularPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permissionType]: checked,
      },
    }));
  };

  const getGranularAccessString = () => {
    const accessArray: string[] = [];

    Object.keys(granularPermissions).forEach((moduleId) => {
      const perms = granularPermissions[moduleId];
      if (perms.view) accessArray.push(moduleId);
      if (perms.create) accessArray.push(`${moduleId}_create`);
      if (perms.update) accessArray.push(`${moduleId}_update`);
      if (perms.delete && moduleId !== "2") accessArray.push(`${moduleId}_delete`); // Exclude delete for Product & Service
    });

    return accessArray.join("|");
  };

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      let mobile = `${values.code} ${values.mobile}`;
      // Use granular permissions if available, otherwise fall back to transfer component
      let access =
        Object.keys(granularPermissions).length > 0
          ? getGranularAccessString()
          : values.access?.join("|");
      let url =
        type === "create" ? API.ADD_STAFF : API.CONTACT_MASTER + `update/${id}`;
      let obj = {
        ...values,
        access,
        adminid,
        type: "staff",
        mobile: values.mobile ? mobile : "",
        ledger_category: 3,
        createdBy: user?.isStaff ? user?.staff?.id : adminid,
        companyid: user?.companyInfo?.id,
      };

      const response: any =
        type === "create" ? await POST(url, obj) : await PUT(url, obj);
      if (response.status) {
        type !== "create" &&
          notification.success({
            message: "Success",
            description: "Staff details updated successfully",
          });
        type === "create" && (await createBaseUrl(values));
        navigate("/usr/staffs");
      } else {
        notification.error({
          message: "Failed",
          description:
            type === "create"
              ? `Failed to create new staff(${response.message})`
              : "Failed to update staff details",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBaseUrl = async (data: any) => {
    try {
      var url = API.BASE_URL;
      var date = new Date();
      var year = date.getFullYear();
      let lastparms = `${year}-${year + 1}`;
      let body = {
        adminid: data.id,
        email: data.email,
        staffId: data.staffId,
        phoneNumber: data.mobile,
        isActive: true,
        urlName: lastparms,
        baseUrl: url,
      };
      let endpoint = "base";
      const response: any = await CREATEBASEURL(endpoint, body);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "New staff created successfully",
        });
      } else {
        notification.error({
          message:
            "Oops! Something went wrong with your sign-In. Please try again later or contact support for help.",
          description: (
            <Button type={"link"} onClick={() => navigate("/contact")}>
              Click here
            </Button>
          ),
        });
      }
    } catch (error) {}
  };
  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace("/create/0", "")}
        firstPathText="Staffs List"
        secondPathLink={location?.pathname}
        secondPathText={type === "create" ? "Create Staff" : "Update Staff"}
        goback="/usr/staffs"
        title={type === "create" ? "Create Staff" : "Update Staff"}
      />

      {isLoadingFetch ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <Form onFinish={submitHandler} layout="vertical" form={form}>
              {type === "create" ? <p>The informations can be edited</p> : null}
              <Row>
                <Col md={4}>
                  <label className="formLabel">Name</label>
                  <Form.Item
                    name="name"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Staff name is required" },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Staff Name"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">Staff ID</label>
                  <Form.Item
                    name="staffId"
                    rules={[
                      { required: true, message: "Staff id is required" },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Staff ID"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">Staff Password</label>
                  <Form.Item
                    name="password"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: type === "create" ? true : false,
                        message: "password is required",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder={type === "edit" ? "" : "Enter password"}
                      size="large"
                      className="input-field"
                      disabled={type === "edit"}
                    />
                  </Form.Item>

                  <label className="formLabel">Reference Code</label>
                  <Form.Item
                    name="reference"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "reference code is required" },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Reference Code"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">Email Address</label>
                  <Form.Item
                    name="email"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Email is required" },
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Email"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">Mobile Number</label>
                  <Form.Item name="mobile" style={{ marginBottom: 10 }}>
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
                  <label className="formLabel">Telephone Number</label>
                  <Form.Item name="telephone" style={{ marginBottom: 10 }}>
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Telephone Number"
                      size="large"
                      className="input-field"
                      type="text"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                    />
                  </Form.Item>
                  <label className="formLabel">Town/city</label>
                  <Form.Item name="city" style={{ marginBottom: 10 }}>
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Town/city"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">Address</label>
                  <Form.Item name="address" style={{ marginBottom: 10 }}>
                    <Input.TextArea
                      style={{ width: "100%" }}
                      placeholder="Address"
                      size="large"
                      className="input-field"
                      rows={3}
                    />
                  </Form.Item>
                  <label className="formLabel">Postal Code</label>
                  <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Postal Code"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">Notes</label>
                  <Form.Item name="notes" style={{ marginBottom: 10 }}>
                    <Input.TextArea
                      style={{ width: "100%" }}
                      placeholder="Notes"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <label className="formLabel">Access Permissions</label>
                <Form.Item name="access" style={{ marginBottom: 10 }}>
                  <Collapse size="small" ghost>
                    <Panel
                      header={
                        <Space>
                          <SettingOutlined />
                          <Text strong>Granular Permissions</Text>
                        </Space>
                      }
                      key="1"
                    >
                      <div style={{ maxHeight: "400px", overflow: "auto" }}>
                        {modules.map((module) => (
                          <Card
                            size="small"
                            key={module.id}
                            style={{ marginBottom: 12 }}
                          >
                            <div style={{ marginBottom: 8 }}>
                              <Space>
                                <span style={{ fontSize: "16px" }}>
                                  {module.icon}
                                </span>
                                <Text strong>{module.name}</Text>
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {module.description}
                                </Text>
                              </Space>
                            </div>
                            <AntRow gutter={[8, 8]}>
                              <AntCol span={6}>
                                <Switch
                                  size="small"
                                  checked={
                                    granularPermissions[module.id]?.view ||
                                    false
                                  }
                                  onChange={(checked) =>
                                    handleGranularPermissionChange(
                                      module.id,
                                      "view",
                                      checked
                                    )
                                  }
                                  checkedChildren="View"
                                  unCheckedChildren="No View"
                                />
                              </AntCol>
                              <AntCol span={6}>
                                <Switch
                                  size="small"
                                  checked={
                                    granularPermissions[module.id]?.create ||
                                    false
                                  }
                                  onChange={(checked) =>
                                    handleGranularPermissionChange(
                                      module.id,
                                      "create",
                                      checked
                                    )
                                  }
                                  checkedChildren="Create"
                                  unCheckedChildren="No Create"
                                />
                              </AntCol>
                              <AntCol span={6}>
                                <Switch
                                  size="small"
                                  checked={
                                    granularPermissions[module.id]?.update ||
                                    false
                                  }
                                  onChange={(checked) =>
                                    handleGranularPermissionChange(
                                      module.id,
                                      "update",
                                      checked
                                    )
                                  }
                                  checkedChildren="Update"
                                  unCheckedChildren="No Update"
                                />
                              </AntCol>
                              {module.id !== "2" && (
                                <AntCol span={6}>
                                  <Switch
                                    size="small"
                                    checked={
                                      granularPermissions[module.id]?.delete ||
                                      false
                                    }
                                    onChange={(checked) =>
                                      handleGranularPermissionChange(
                                        module.id,
                                        "delete",
                                        checked
                                      )
                                    }
                                    checkedChildren="Delete"
                                    unCheckedChildren="No Delete"
                                  />
                                </AntCol>
                              )}
                            </AntRow>
                          </Card>
                        ))}
                      </div>
                    </Panel>
                  </Collapse>
                </Form.Item>
              </Row>
              <hr />
              <Row>
                <Col md={8} />
                <br />
                <Col md={2}>
                  <Button
                    size="large"
                    type="default"
                    onClick={() => navigate("/usr/staffs")}
                    block
                  >
                    Close
                  </Button>
                </Col>
                <Col md={2}>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    block
                  >
                    {type === "create" ? "Save" : "Update"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      )}
      <br />
    </>
  );
};

export default StaffForm;
