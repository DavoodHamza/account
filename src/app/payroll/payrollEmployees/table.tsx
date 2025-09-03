import React, { useRef, useState } from "react";
import DataGrid, {
  Column,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Summary,
  Toolbar,
  Item,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { DatePicker } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { EXPORT } from "../../../utils/exportData";

const PayrollEmployeeTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);

  const location = useLocation();

  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);

  const currency = user?.companyInfo?.countryInfo?.symbol;

  const columns = [
    {
      name: "id",
      title: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "id",
      title: "Employee Id",
      dataType: "number",
      alignment: "center",
    },
    {
      name: "fullName",
      title: "Full Name",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "email",
      title: "Email",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "phone",
      title: "Phone",
      alignment: "center",
    },
    {
      name: "date_of_join",
      title: "Date Of Join",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "Designation",
      title: "Designation",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "employeeGroup",
      title: "Employee Group",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "salaryPackage",
      title: "Salary Package",
      dataType: "number",
      alignment: "center",
    },
  ];
  const exportFormats = ["pdf", "xlsx"];
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const handleOptionChanged = (e: any) => {
    if (e.fullName === "paging.pageIndex") {
      SetPage(e.value);
    }
    if (e.fullName === "paging.pageSize") {
      setTake(e.value);
    }
    if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
      props.onPageChange(page, take);
    }
  };

  return (
    <DataGrid
      ref={dataGridRef}
      dataSource={props.list}
      columnAutoWidth={true}
      showBorders={true}
      onExporting={(e) => EXPORT(e, dataGridRef, props?.name, () => {})}
      onOptionChanged={handleOptionChanged}
      showRowLines={true}
      onSelectionChanged={onSelectionChanged}
      showColumnLines={true}
      style={{ textAlign: "center" }}
      searchPanel={{
        visible: true,
        width: 240,
        placeholder: "Search here",
        searchVisibleColumnsOnly: true,
        highlightCaseSensitive: false,
      }}
    >
      <Selection
        mode="multiple"
        selectAllMode="allPages"
        showCheckBoxesMode="always"
      />
      <HeaderFilter visible={true} />
      {columns.map((column, index) => {
        return (
          <Column
            key={index}
            dataField={column.name}
            // caption={column.title}
            // dataType={column.dataType}
            // format={column.format}
            // alignment={column.alignment}
          />
        );
      })}
      <Paging defaultPageSize={10} />

      <Pager
        visible={true}
        allowedPageSizes={[10, 20, 30]}
        displayMode={"compact"}
        showPageSizeSelector={true}
        showInfo={true}
        showNavigationButtons={true}
      />
      <Export
        enabled={true}
        allowExportSelectedData={true}
        formats={exportFormats}
      />

      <Toolbar>
        {selectedRows ? (
          <Item location="before" visible={true}>
            <div style={{ fontSize: "17px", fontWeight: 600 }}>
              {selectedRows} selected
            </div>
          </Item>
        ) : (
          <Item location="before" visible={true}>
            <div style={{ fontSize: "17px", fontWeight: 600 }}>
              <h4>Details</h4>
            </div>
          </Item>
        )}
        <Item>
          <DatePicker.RangePicker />
        </Item>
        <Item name="searchPanel" />
        <Item location="after" visible={true} name="exportButton" />
      </Toolbar>

      <Summary>
        <TotalItem
          column="type"
          summaryType="sum"
          alignment={"right"}
          valueFormat="currency"
          displayFormat={`Opening Balance : `}
        />

        <TotalItem
          column="type"
          displayFormat={`Current Total : `}
          alignment={"right"}
        />
        <TotalItem
          column="type"
          displayFormat={`Closing Balance : `}
          valueFormat="currency"
          alignment={"right"}
        />

        <TotalItem
          column="debit"
          summaryType="sum"
          alignment={"center"}
          valueFormat="currency"
        />
        <TotalItem column="credit" alignment={"center"} />
        <TotalItem
          column="credit"
          summaryType="sum"
          displayFormat={currency + " " + ""}
          alignment={"center"}
          valueFormat="currency"
        />
        <TotalItem
          column="debit"
          displayFormat={currency + " " + ""}
          alignment={"center"}
          valueFormat="currency"
        />
        <TotalItem
          column="debit"
          summaryType="sum"
          displayFormat={currency < 0 ? currency + " " + "" : "-"}
          alignment={"center"}
          valueFormat="currency"
        />
        <TotalItem
          column="credit"
          displayFormat={currency >= 0 ? currency + " " + "" : "-"}
          alignment={"center"}
          valueFormat="currency"
        />
      </Summary>
    </DataGrid>
  );
};
export default PayrollEmployeeTable;
