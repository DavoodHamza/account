import { Button, Card, Pagination, Select } from "antd";
import DataGrid, {
  Column,
  Export,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import { EXPORT } from "../../../utils/exportData";
import { t } from "i18next";

const LoyaltyCardTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [assignedStatus, setAssignedStatus] = useState("all");

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];

  const handleOptionChanged = (e: any) => {
    // if (e.fullName === "searchPanel.text") {
    //   props?.setUserName(e.value);
    // }
  };

  return (
    <Card>
      <DataGrid
        ref={dataGridRef}
        dataSource={props?.list?.data}
        columnAutoWidth={true}
        showBorders={true}
        onExporting={(e) => EXPORT(e, dataGridRef, "Card list", {})}
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
        {props?.columns?.map((column: any, index: number) => {
          return (
            <Column
              key={index}
              dataField={column?.name}
              caption={column?.title}
              dataType={column?.dataType}
              format={column?.format}
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
        <Paging defaultPageSize={10} />

        <Pager
          visible={true}
          allowedPageSizes={[10, 20, 30]}
          displayMode={"full"}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Toolbar>
          <Item location="before" visible={true}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
              {props?.title}
            </div>
          </Item>
          
          <Item name="searchPanel"/>
          {
            props?.onButtonClick ? (
              <Item location="after">
              <Button type="primary" onClick={props?.onButtonClick}>+ {t("home_page.homepage.Generate")}</Button>
              </Item>
            ) : null
          }
         
        </Toolbar>
      </DataGrid>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      ></div>
    </Card>
  );
};

export default LoyaltyCardTable;
