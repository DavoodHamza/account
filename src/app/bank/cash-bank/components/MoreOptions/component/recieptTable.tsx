import DataGrid, {
  Column,
  Item,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import { EXPORT } from "../../../../../../utils/exportData";

const RecieptTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e?.selectedRowsData?.length);
    props.onSelectedData(e?.selectedRowsData);
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
      dataSource={props.products}
      columnAutoWidth={true}
      showBorders={true}
      onExporting={(e) => EXPORT(e, dataGridRef, "ledgers", () => {})}
      showRowLines={true}
      onSelectionChanged={onSelectionChanged}
      onOptionChanged={handleOptionChanged}
      remoteOperations={false}
      // onCellPrepared={(e) => {
      //   if (e.rowType !== "data") return;
      //   if (e?.data?.id == props?.saleId) {
      //     e.cellElement.style.backgroundColor = "#ff9800";
      //     // props.onSelectedData(e?.data);
      //   } else {
      //     e.cellElement.className = "";
      //   }
      // }}
      onCellPrepared={(e) => {
        if (e.rowType !== "data") return;

        if (props?.saleId?.length && props?.saleId?.length > 0) {
          const saleIds = Array.isArray(props?.saleId)
            ? props?.saleId.map((item: any) => item.id)
            : [];

          if (saleIds.includes(e?.data?.id)) {
            e.cellElement.style.backgroundColor = "#ff9800";
          } else {
            e.cellElement.style.backgroundColor = "";
          }
        } else {
          if (e?.data?.id == props?.saleId) {
            e.cellElement.style.backgroundColor = "#ff9800";
            // props.onSelectedData(e?.data);
          } else {
            e.cellElement.className = "";
          }
        }
      }}
    >
      {props?.type !== "sales_reciept_amount" && (
        <Selection
          mode="single"
          selectAllMode="page"
          showCheckBoxesMode="always"
        />
      )}

      {props.columns.map((column: any, index: number) => {
        return (
          <Column
            dataField={column?.name}
            caption={column?.title}
            dataType={column?.dataType}
            format={column?.format}
            alignment={column?.alignment}
            key={index}
            // cellRender={column?.cellRender ? column.cellRender : column?.name}
            cellRender={column.cellRender}
          ></Column>
        );
      })}

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
              {props?.tableHead}
            </div>
          </Item>
        )}

        <Item name="searchPanel" />
        <Item location="after" visible={true} name="exportButton" />
      </Toolbar>
    </DataGrid>
  );
};

export default RecieptTable;
