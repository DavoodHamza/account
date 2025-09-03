import React from 'react';
import { Card, Button, Space, Tag, Typography, Divider, Alert } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useAccessControl } from '../../../utils/accessControl';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const PermissionExample: React.FC = () => {
  const { t } = useTranslation();
  const { 
    isAdmin,
    // Staff permissions
    canViewStaff,
    canCreateStaff,
    canEditStaff,
    canDeleteStaff,
    // Product permissions
    canViewProducts,
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    // Sales permissions
    canViewSales,
    canCreateSales,
    canUpdateSales,
    canDeleteSales,
    // Purchase permissions
    canViewPurchases,
    canCreatePurchases,
    canUpdatePurchases,
    canDeletePurchases,
    // Contact permissions
    canViewContacts,
    canCreateContacts,
    canUpdateContacts,
    canDeleteContacts
  } = useAccessControl();

  const renderModulePermissions = (moduleName: string, permissions: any) => {
    return (
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong>{moduleName}</Text>
        </div>
        <Space wrap>
          {permissions.view && <Tag color="blue" icon={<EyeOutlined />}>View</Tag>}
          {permissions.create && <Tag color="green" icon={<PlusOutlined />}>Create</Tag>}
          {permissions.update && <Tag color="orange" icon={<EditOutlined />}>Update</Tag>}
          {permissions.delete && <Tag color="red" icon={<DeleteOutlined />}>Delete</Tag>}
          {!permissions.view && !permissions.create && !permissions.update && !permissions.delete && (
            <Tag color="default">No Access</Tag>
          )}
        </Space>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={3}>Granular Permission System Example</Title>
        <Text type="secondary">
          This demonstrates how granular permissions work for different modules.
        </Text>

        <Divider />

        {/* Admin Status */}
        <Alert
          message={isAdmin ? "Admin User" : "Staff User"}
          description={isAdmin ? "You have full access to all modules" : "Your access is controlled by permissions"}
          type={isAdmin ? "success" : "info"}
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Staff Management Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Staff Management</Title>
          {renderModulePermissions("Staff Management", {
            view: canViewStaff(),
            create: canCreateStaff(),
            update: canEditStaff(),
            delete: canDeleteStaff()
          })}
        </div>

        {/* Product & Service Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Product & Service</Title>
          {renderModulePermissions("Product & Service", {
            view: canViewProducts(),
            create: canCreateProducts(),
            update: canUpdateProducts(),
            delete: canDeleteProducts()
          })}
        </div>

        {/* Sales Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Sales</Title>
          {renderModulePermissions("Sales", {
            view: canViewSales(),
            create: canCreateSales(),
            update: canUpdateSales(),
            delete: canDeleteSales()
          })}
        </div>

        {/* Purchase Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Purchase</Title>
          {renderModulePermissions("Purchase", {
            view: canViewPurchases(),
            create: canCreatePurchases(),
            update: canUpdatePurchases(),
            delete: canDeletePurchases()
          })}
        </div>

        {/* Contact Permissions */}
        <div style={{ marginBottom: 24 }}>
          <Title level={4}>Contacts</Title>
          {renderModulePermissions("Contacts", {
            view: canViewContacts(),
            create: canCreateContacts(),
            update: canUpdateContacts(),
            delete: canDeleteContacts()
          })}
        </div>

        <Divider />

        {/* Action Buttons Example */}
        <div>
          <Title level={4}>Example Action Buttons</Title>
          <Text type="secondary">
            These buttons would only be shown if you have the corresponding permissions:
          </Text>
          
          <div style={{ marginTop: 16 }}>
            <Space wrap>
              {/* Staff Actions */}
              {canViewStaff() && (
                <Button icon={<EyeOutlined />} type="default">
                  View Staff
                </Button>
              )}
              {canCreateStaff() && (
                <Button icon={<PlusOutlined />} type="primary">
                  Add Staff
                </Button>
              )}
              {canEditStaff() && (
                <Button icon={<EditOutlined />} type="primary">
                  Edit Staff
                </Button>
              )}
              {canDeleteStaff() && (
                <Button icon={<DeleteOutlined />} type="primary" danger>
                  Delete Staff
                </Button>
              )}

              {/* Product Actions */}
              {canViewProducts() && (
                <Button icon={<EyeOutlined />} type="default">
                  View Products
                </Button>
              )}
              {canCreateProducts() && (
                <Button icon={<PlusOutlined />} type="primary">
                  Add Product
                </Button>
              )}
              {canUpdateProducts() && (
                <Button icon={<EditOutlined />} type="primary">
                  Edit Product
                </Button>
              )}
              {canDeleteProducts() && (
                <Button icon={<DeleteOutlined />} type="primary" danger>
                  Delete Product
                </Button>
              )}

              {/* Sales Actions */}
              {canViewSales() && (
                <Button icon={<EyeOutlined />} type="default">
                  View Sales
                </Button>
              )}
              {canCreateSales() && (
                <Button icon={<PlusOutlined />} type="primary">
                  Create Invoice
                </Button>
              )}
              {canUpdateSales() && (
                <Button icon={<EditOutlined />} type="primary">
                  Edit Invoice
                </Button>
              )}
              {canDeleteSales() && (
                <Button icon={<DeleteOutlined />} type="primary" danger>
                  Delete Invoice
                </Button>
              )}
            </Space>
          </div>
        </div>

        <Divider />

        {/* Permission Summary */}
        <div>
          <Title level={4}>Your Permission Summary</Title>
          <Space wrap>
            <Text>Staff Management: {canViewStaff() ? '✅' : '❌'}</Text>
            <Text>Product & Service: {canViewProducts() ? '✅' : '❌'}</Text>
            <Text>Sales: {canViewSales() ? '✅' : '❌'}</Text>
            <Text>Purchase: {canViewPurchases() ? '✅' : '❌'}</Text>
            <Text>Contacts: {canViewContacts() ? '✅' : '❌'}</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default PermissionExample; 