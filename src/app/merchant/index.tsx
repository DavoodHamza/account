import { Table } from "antd";
import React from "react";

const Merchant = () => {
  const columns = [
    {
      name: "name",
      title: "S.NO",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "bname",
      title: "Account Name",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "reference",
      title: "Payment Type",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "email",
      title: "Action",
      dataType: "string",
      alignment: "center",
    },
  ];
  return (
    <div style={{ padding: "25px" }}>
      Merchant
      <Table columns={columns} />
    </div>
  );
};

export default Merchant;
