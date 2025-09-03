import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, Button, message, Space, Tag, Typography, Modal, Collapse } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SaveOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
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

interface ModulePermissions {
  [key: string]: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

const StaffPermissionManager: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { isAdmin } = useAccessControl();
  
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<{[key: string]: string}>({});

  // Define modules and their permissions
  const modules = [
    {
      id: "19",
      name: "Staff Management",
      description: "Manage staff members"
    },
    {
      id: "2",
      name: "Product & Service",
      description: "Manage products and services"
    },
    {
      id: "4",
      name: "Sales",
      description: "Manage sales and invoices"
    },
    {
      id: "5",
      name: "Purchase",
      description: "Manage purchases and expenses"
    },
    {
      id: "6",
      name: "Contacts",
      description: "Manage customers and suppliers"
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

  const renderModulePermissions = (staffId: string, module: any) => {
    const modulePerms = getModulePermissions(staffId, module.id);
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Text strong>{module.name}</Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>{module.description}</Text>
        <div style={{ marginTop: 8 }}>
          <Space wrap>
            <Switch
              size="small"
              checked={modulePerms.view}
              onChange={(checked) => handlePermissionChange(staffId, module.id, checked)}
              checkedChildren="View"
              unCheckedChildren="No View"
            />
            <Switch
              size="small"
              checked={modulePerms.create}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_create`, checked)}
              checkedChildren="Create"
              unCheckedChildren="No Create"
            />
            <Switch
              size="small"
              checked={modulePerms.update}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_update`, checked)}
              checkedChildren="Update"
              unCheckedChildren="No Update"
            />
            <Switch
              size="small"
              checked={modulePerms.delete}
              onChange={(checked) => handlePermissionChange(staffId, `${module.id}_delete`, checked)}
              checkedChildren="Delete"
              unCheckedChildren="No Delete"
            />
          </Space>
        </div>
      </div>
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
          <Panel header="Manage Permissions" key="1">
            {modules.map(module => (
              <div key={module.id}>
                {renderModulePermissions(record.id, module)}
              </div>
            ))}
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
          <Title level={3}>Staff Permission Management</Title>
          <Text type="secondary">
            Manage granular permissions for staff members. Expand each staff member to see detailed permissions.
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

export default StaffPermissionManager; 