import { Button, Card, Table, Input, Space } from "antd";
import { useRef, useState } from "react";
import { MdEditDocument } from "react-icons/md";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import "./table.css";

interface Subscription {
  id: number;
  userId: number;
  company: number;
  counter: number;
  period: number;
  price: number;
  retailXpressWithTaxgo: boolean;
  soleTrader: boolean;
  subscriptionExpiry: string;
  userDetails: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface Meta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface Props {
  products: Subscription[];
  title: string;
  onPageChange: (page: number, take: number) => void;
  onSearch: (query: string) => void;
  onEdit?: (record: Subscription) => void;
  meta?: Meta;
  loading:any;
}

const SubscriptionsTable = (props: any) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: ["userDetails", "fullName"],
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: ["userDetails", "email"],
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Counter",
      dataIndex: "counter",
      key: "counter",
    },
    {
      title: "Sole Trader",
      dataIndex: "soleTrader",
      key: "soleTrader",
      render: (soleTrader: boolean) => (soleTrader ? "Yes" : "No"),
    },
    {
      title: "Subscription Expiry",
      dataIndex: "subscriptionExpiry",
      key: "subscriptionExpiry",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Subscription) => (
        <Button
          type="text"
          onClick={() => props.onEdit?.(record)}
          icon={<MdEditDocument size={18} />}
        />
      ),
    },
  ];

  const handleTableChange: TableProps<Subscription>["onChange"] = (pagination) => {
    props.onPageChange(pagination.current || 1, pagination.pageSize || 10);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    props.onSearch(value);
  };

  const handleClear = () => {
    setSearchText("");
    props.onSearch("");
  };

  return (
    <Card>
      <Space style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        {selectedRowKeys.length > 0 ? (
          <div style={{ fontSize: "17px", fontWeight: 600 }}>
            {selectedRowKeys.length} selected
          </div>
        ) : (
          <div style={{ fontSize: "20px", fontWeight: 700 }}>
            {props.title}
          </div>
        )}
        <Space>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: window.innerWidth <= 580 ? 140 : 240 }}
            value={searchText}
            allowClear
          />
        </Space>
      </Space>
      <Table
        loading={props.loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={props.products}
        rowKey="id"
        pagination={{
          current: props.meta?.page,
          pageSize: props.meta?.take,
          total: props.meta?.itemCount,
          pageSizeOptions: ["10", "20", "30"],
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
        bordered
        size="middle"
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
      />
    </Card>
  );
};

export default SubscriptionsTable;