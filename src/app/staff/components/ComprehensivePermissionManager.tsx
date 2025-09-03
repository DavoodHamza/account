import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, Button, message, Space, Tag, Typography, Modal, Collapse, Row, Col, Divider } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SaveOutlined, UserOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GET, PUT } from '../../../utils/apiCalls';
import API from '../../../config/api';
import { useAccessControl } from '../../../utils/accessControl';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  email: string;
  isStaff?: boolean;
  staff?: {
    access?: string;
  };
}

interface ModulePermission {
  id: string;
  name: string;
  description: string;
  icon: string;
  permissions: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

const ComprehensivePermissionManager: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { isAdmin } = useAccessControl();
  
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<{[key: string]: string}>({});

  // Define all modules with their permissions
  const modules: ModulePermission[] = [
    {
      id: "1",
      name: "Dashboard",
      description: "Access to dashboard and overview",
      icon: "📊",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "2",
      name: "Product & Service",
      description: "Manage products, services, and inventory",
      icon: "📦",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "3",
      name: "Stock Transfer",
      description: "Manage stock transfers between locations",
      icon: "🔄",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "4",
      name: "Sales",
      description: "Manage sales invoices and transactions",
      icon: "💰",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "5",
      name: "Purchase",
      description: "Manage purchases and expenses",
      icon: "🛒",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "6",
      name: "Contacts",
      description: "Manage customers and suppliers",
      icon: "👥",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "7",
      name: "Journals",
      description: "Manage accounting journals",
      icon: "📝",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "8",
      name: "Payments",
      description: "Manage payment transactions",
      icon: "💳",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "9",
      name: "Receipts",
      description: "Manage receipt transactions",
      icon: "🧾",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "10",
      name: "Contra Voucher",
      description: "Manage contra vouchers",
      icon: "↔️",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "11",
      name: "Bank",
      description: "Manage bank accounts and transactions",
      icon: "🏦",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "12",
      name: "Cash",
      description: "Manage cash transactions",
      icon: "💵",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "13",
      name: "Reports",
      description: "Access to reports and analytics",
      icon: "📈",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "14",
      name: "Ledger",
      description: "Manage ledgers and accounts",
      icon: "📋",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "18",
      name: "Proposal",
      description: "Manage proposals and quotes",
      icon: "📄",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "19",
      name: "Staff Management",
      description: "Manage staff members and permissions",
      icon: "👨‍💼",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "20",
      name: "Counter",
      description: "Manage counter operations",
      icon: "🔢",
      permissions: { view: false, create: false, update: false, delete: false }
    },
    {
      id: "21",
      name: "Settings",
      description: "Access to system settings",
      icon: "⚙️",
      permissions: { view: false, create: false, update: false, delete: false }
    }
  ];

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const url = `${API.CONTACT_MASTER_LIST}staff/${user?.id}/${user?.id}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(url, null);
      
      // Filter only staff members (not admins)
      const staffMembers = data?.filter((staff: any) => staff.isStaff) || [];
      setStaffList(staffMembers);
      
      // Initialize permissions state
      const initialPermissions: {[key: string]: string} = {};
      staffMembers.forEach((staff: StaffMember) => {
        initialPermissions[staff.id] = staff.staff?.access || "";
      });
      setPermissions(initialPermissions);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      message.error('Failed to fetch staff list');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (staffId: string, permissionId: string, checked: boolean) => {
    const currentAccess = permissions[staffId] || "";
    const accessArray = currentAccess ? currentAccess.split("|") : [];
    
    if (checked) {
      // Add permission if not already present
      if (!accessArray.includes(permissionId)) {
        accessArray.push(permissionId);
      }
    } else {
      // Remove permission
      const index = accessArray.indexOf(permissionId);
      if (index > -1) {
        accessArray.splice(index, 1);
      }
    }
    
    setPermissions(prev => ({
      ...prev,
      [staffId]: accessArray.join("|")
    }));
  };

  const hasPermission = (staffId: string, permissionId: string): boolean => {
    const access = permissions[staffId] || "";
    const accessArray = access ? access.split("|") : [];
    return accessArray.includes(permissionId);
  };

  const getModulePermissions = (staffId: string, moduleId: string) => {
    return {
      view: hasPermission(staffId, moduleId),
      create: hasPermission(staffId, `${moduleId}_create`),
      update: hasPermission(staffId, `${moduleId}_update`),
      delete: hasPermission(staffId, `${moduleId}_delete`)
    };
  };

  const handleSavePermissions = async (staffId: string) => {
    try {
      setSaving(true);
      const url = `${API.CONTACT_MASTER}${staffId}/staff-access`;
      const response: any = await PUT(url, {
        staffId,
        access: permissions[staffId]
      });

      if (response.status) {
        message.success('Permissions saved successfully');
        fetchStaffList(); // Refresh the list
      } else {
        message.error('Failed to save permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      message.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllPermissions = async () => {
    Modal.confirm({
      title: 'Save All Permissions',
      content: 'Are you sure you want to save all permission changes?',
      onOk: async () => {
        try {
          setSaving(true);
          const promises = Object.keys(permissions).map(staffId => 
            handleSavePermissions(staffId)
          );
          await Promise.all(promises);
          message.success('All permissions saved successfully');
        } catch (error) {
          message.error('Failed to save some permissions');
        } finally {
          setSaving(false);
        }
      }
    });
  };

  const renderModulePermissions = (staffId: string, module: ModulePermission) => {
    const modulePerms = getModulePermissions(staffId, module.id);
    
    return (
      <Card size="small" style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <Space>
            <span style={{ fontSize: '16px' }}>{module.icon}</span>
            <Text strong>{module.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{module.description}</Text>
          </Space>
        </div>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Switch
              size="small"
              checked={modulePerms.view}
              onChange={(checked) => handlePermissionChange(staffId, module.id, checked)}
              checkedChildren="View"
              unCheckedChildren="No View"
            />
          </Col>
          <Col span={6}>
            <Switch
              size="small"
              checked={modulePerms.create}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_create`, checked)}
              checkedChildren="Create"
              unCheckedChildren="No Create"
            />
          </Col>
          <Col span={6}>
            <Switch
              size="small"
              checked={modulePerms.update}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_update`, checked)}
              checkedChildren="Update"
              unCheckedChildren="No Update"
            />
          </Col>
          <Col span={6}>
            <Switch
              size="small"
              checked={modulePerms.delete}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_delete`, checked)}
              checkedChildren="Delete"
              unCheckedChildren="No Delete"
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const columns = [
    {
      title: 'Staff Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StaffMember) => (
        <Space>
          <UserOutlined />
          <Text strong>{text}</Text>
          <Tag color="blue">Staff</Tag>
        </Space>
      ),
    },
    {
      title: 'Staff ID',
      dataIndex: 'staffId',
      key: 'staffId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Permissions',
      key: 'permissions',
      render: (record: StaffMember) => (
        <Collapse size="small" ghost>
          <Panel header={
            <Space>
              <SettingOutlined />
              <Text strong>Manage Permissions</Text>
            </Space>
          } key="1">
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {modules.map(module => (
                <div key={module.id}>
                  {renderModulePermissions(record.id, module)}
                </div>
              ))}
            </div>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: StaffMember) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => handleSavePermissions(record.id)}
          >
            Save
          </Button>
        </Space>
      ),
    },
  ];

  const getPermissionSummary = () => {
    const totalStaff = staffList.length;
    const staffWithAnyAccess = Object.values(permissions).filter(access => 
      access && access.length > 0
    ).length;

    return {
      total: totalStaff,
      withAccess: staffWithAnyAccess,
      withoutAccess: totalStaff - staffWithAnyAccess
    };
  };

  const summary = getPermissionSummary();

  // Only show this component to admins
  if (!isAdmin) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={4}>Access Denied</Title>
          <Text>Only administrators can access this page.</Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}>Comprehensive Permission Management</Title>
          <Text type="secondary">
            Manage granular permissions for staff members. Each module has View, Create, Update, and Delete permissions.
          </Text>
        </div>

        {/* Permission Summary */}
        <div style={{ marginBottom: 24 }}>
          <Space wrap>
            <Text strong>Summary:</Text>
            <Text>Total Staff: {summary.total}</Text>
            <Text type="success">With Access: {summary.withAccess}</Text>
            <Text type="warning">Without Access: {summary.withoutAccess}</Text>
          </Space>
        </div>

        {/* Save All Button */}
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSaveAllPermissions}
          >
            Save All Permissions
          </Button>
        </div>

        {/* Staff Table */}
        <Table
          columns={columns}
          dataSource={staffList}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
    </div>
  );
};

export default ComprehensivePermissionManager; 