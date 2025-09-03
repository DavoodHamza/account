import { Card, Pagination } from "antd";
import DataGrid, {
  Column,
  Export,
  Item,
  SearchPanel,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import { EXPORT } from "../../../utils/exportData";

const UserTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];

  const handleOptionChanged = (e: any) => {
    if (e.fullName === "searchPanel.text") {
      props?.setUserName(e.value);
    }
  };

  return (
    <Card>
      <DataGrid
        ref={dataGridRef}
        dataSource={props?.list?.data}
        columnAutoWidth={true}
        showBorders={true}
        onExporting={(e) => EXPORT(e, dataGridRef, "users", {})}
        showRowLines={true}
        onOptionChanged={handleOptionChanged}
        onSelectionChanged={onSelectionChanged}
        remoteOperations={false}
      >
        {/* <Selection
          mode="multiple"
          selectAllMode="allPages"
          // showCheckBoxesMode="always"
        /> */}
        <SearchPanel
          visible={true}
          width={window.innerWidth <= 580 ? 140 : 240}
        />
        {props.columns.map((column: any, index: number) => {
          return (
            <Column
              key={index}
              dataField={column.name}
              caption={column.title}
              dataType={column.dataType}
              format={column.format}
              alignment={"center"}
              cellRender={column?.cellRender}
            ></Column>
          );
        })}

        <Export
          enabled={true}
          allowExportSelectedData={true}
          formats={exportFormats}
        />
        <Toolbar>
          <Item location="before" visible={true}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              {props.title}
            </div>
          </Item>
          <Item name="searchPanel" />
          {/* <Item><Input placeholder="Search" onChange={(e)=>  props?.setUserName(e.target.value)}/></Item> */}
          {/* <Item location="after" visible={true} name="exportButton" /> */}
        </Toolbar>
      </DataGrid>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Pagination
          total={props?.list?.meta?.itemCount}
          showSizeChanger={true}
          onChange={(page, pageSize) => props.onPageChange(page, pageSize)}
          showTotal={(total) => `Total ${props?.list?.meta?.itemCount} users`}
          current={props?.list?.meta?.page}
        />
      </div>
    </Card>
  );
};

export default UserTable;
