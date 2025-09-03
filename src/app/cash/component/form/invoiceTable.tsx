import { Card } from "antd";
import DataGrid, {
  Column,
  Item,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useState } from "react";
import { Container } from "react-bootstrap";
import "../../styles.scss";
const InvoiceTable = ({
  tableData,
  columns,
  tableHead,
  rowData,
  saleId,
}: any) => {
  const [selectedRows, setSelectedRows] = useState();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
    rowData(e.selectedRowsData);
  };

  return (
    <>
      <Container>
        <br />
        <Card className="invoiceTable">
          <DataGrid
            dataSource={tableData}
            columnAutoWidth={true}
            showBorders={false}
            showRowLines={false}
            onSelectionChanged={onSelectionChanged}
            remoteOperations={false}
            onCellPrepared={(ev) => {
              if (ev.rowType !== "data") return;
              if (ev.data?.id == saleId) {
                ev.cellElement.style.backgroundColor = "#FFA500";
              } else {
                ev.cellElement.className = "";
              }
            }}
          >
            <Selection mode="single" />
            {columns?.map((column: any, index: number) => {
              return (
                <Column
                  dataField={column.name}
                  caption={column.title}
                  dataType={column.dataType}
                  format={column.format}
                  alignment={column.alignment}
                  key={index}
                />
              );
            })}
            <Toolbar>
              {selectedRows ? (
                <Item location="before" visible={true}>
                  <div className="Table-Txt">{selectedRows} selected</div>
                </Item>
              ) : (
                <Item location="before" visible={true}>
                  <div className="Table-Txt">{tableHead}</div>
                </Item>
              )}
            </Toolbar>
          </DataGrid>
        </Card>
      </Container>
    </>
  );
};

export default InvoiceTable;
