import "../styles.scss"; // Import your custom styles
import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Popover } from "antd";
import ViewPopover from "../../../components/viewPopover";
import { BsThreeDotsVertical } from "react-icons/bs";
const NewCreditNotesTable = (props: any) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState(props.List);

  useEffect(() => {
    setData(props.List);
  }, [props.List]);

  const onExporting = (e: any) => {};
  const columns = [
    {
      dataField: "customerName",
      caption: "Supplier",
    },
    {
      dataField: "creditInvNo",
      caption: "Invoice No.",
    },
    {
      dataField: "reference",
      caption: "reference",
    },
    {
      dataField: "discription",
      caption: "discription",
    },
    {
      dataField: "amount",
      caption: "Total",
    },
    {
      dataField: "invoiceDate",
      caption: "Invoice Date",
      dataType: "date",
    },

    {
      caption: "Action",
      cellRender: (data: any) => {
        return (
          <div className="table-title">
            <Popover
              content={<ViewPopover />}
              placement="bottom"
              trigger={"click"}
            >
              <BsThreeDotsVertical size={16} cursor={"pointer"} />
            </Popover>
          </div>
        );
      },
    },
  ];
  const handleSelectionChange = (selectedRowKeys: any) => {
    setSelectedRows(selectedRowKeys);
  };
  const exportFormats = ["pdf", "xlsx"];
  return (
    <div style={{ padding: "30px" }}>
      <DataGrid
        dataSource={data}
        columnAutoWidth={true}
        showBorders={true}
        onExporting={onExporting}
      >
        <Selection
          mode="multiple"
          selectAllMode="allPages"
          showCheckBoxesMode="always"
          // onSelectionChanged={handleSelectionChange}
        />
        <SearchPanel
          visible={true}
          width={window.innerWidth <= 580 ? 140 : 240}
        />
        <HeaderFilter visible={true} />
        {columns.map((column, index) => (
          <Column
            key={index}
            dataField={column.dataField}
            caption={column.caption}
            cellRender={column.cellRender}
          />
        ))}
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[10, 20, "all"]}
          showInfo={true}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
          formats={exportFormats}
        />
      </DataGrid>
    </div>
  );
};
export default NewCreditNotesTable;
