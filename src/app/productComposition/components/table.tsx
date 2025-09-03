import { useState, useRef } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  Selection,
  Toolbar,
  Item,
  DataGridTypes,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useNavigate } from "react-router-dom";
import { Card, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Container } from "react-bootstrap";
import ActionPopover from "./actionPopover";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import DataSource from "devextreme/data/data_source";
type Props = {
  bomStore: DataSource<any, any>;
  searchPlaceHolder: string;
  columns: any;
  onSuccess: any;
  handleEditClick: any;
  deleteBom: any;
  tableType: any;
  title: any;
  exportFileTitle: string;
  customizeExportCell: (type: any, gridCell: any, cell: any) => void;
};
const Table = (props: Props) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState();
  // const onSelectionChanged = (e: any) => {
  //   setSelectedRows(e.selectedRowsData.length);
  // };
  const exportFormats = ["xlsx", "pdf"];

  const onExporting = (
    e: DataGridTypes.ExportingEvent,
    customizeCell: any,
    fileName: string
  ) => {
    try {
      if (e.format === "pdf") {
        const doc = new jsPDF();

        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
          //indent: 5,
          customizeCell({ gridCell, pdfCell }) {
            customizeCell("pdf", gridCell, pdfCell);
          },
        }).then(() => {
          doc.save(`${fileName}.pdf`);
        });
      }
      //
      else if (e.format === "xlsx") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Main sheet");

        exportDataGrid({
          component: e.component,
          worksheet,
          // autoFilterEnabled: true,
          customizeCell: function ({ excelCell, gridCell }) {
            excelCell.font = { name: "Arial", size: 12 };
            excelCell.alignment = { horizontal: "left" };
            customizeCell("xlsx", gridCell, excelCell);
          },
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `${fileName}.xlsx`
            );
          });
        });
      }
    } catch (err) {}
  };
  const handleRowDoubleClick = (data:any) =>{
    navigate(`/usr/composition-details/${data?.data?.id}`);
  }
  const onRowPrepared = (e : any) => {
    if (e.rowType === 'data') {
      e.rowElement.style.cursor = 'pointer';
    }
  };
  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={props?.bomStore}
          columnAutoWidth={true}
          showBorders={true}
          onRowPrepared={onRowPrepared}
          onRowDblClick={handleRowDoubleClick}
          onExporting={(e: DataGridTypes.ExportingEvent) =>
            onExporting(e, props?.customizeExportCell, props?.exportFileTitle)
          }
          showRowLines={true}
          // onSelectionChanged={onSelectionChanged}
          remoteOperations={{ paging: true, filtering: true }}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel
            placeholder={props?.searchPlaceHolder || "search"}
            visible={true}
            width={window.innerWidth <= 580 ? 140 : 240}
          />
          {/* <HeaderFilter visible={true} /> */}
          {props?.columns?.map((column: any, index: number) => {
            return (
              <Column
                key={index}
                dataField={column?.name}
                caption={column?.title}
                dataType={column?.dataType}
                format={column?.format}
                alignment={column?.alignment}
                fixed={column?.fixed || ""}
                fixedPosition={column?.fixedPosition || ""}
                allowExporting={true}
                allowSearch={column?.allowSearch}
                cellRender={column?.cellRender}
              ></Column>
            );
          })}
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            visible={true}
            allowedPageSizes={[10, 20, 30, 40, 50, 70, 100]}
            displayMode={"compact"}
            showInfo={true}
            showNavigationButtons={true}
          />
          <Column
            alignment={"center"}
            type="buttons"
            caption={t("home_page.homepage.Action")}
            fixed={true} 
            fixedPosition="right"
            width={110}
            cellRender={(item) => {
              return (
                <div className="table-title">
                  <Popover
                    content={
                      <ActionPopover
                        data={item}
                        onSuccess={props?.onSuccess}
                        handleEditAsset={props.handleEditClick}
                        deleteBom={props?.deleteBom}
                        tableType={props?.tableType}
                      />
                    }
                    placement="bottom"
                    trigger={"click"}
                  >
                    <BsThreeDotsVertical size={16} cursor={"pointer"} />
                  </Popover>
                </div>
              );
            }}
          ></Column>
          <Export
            enabled={true}
            allowExportSelectedData={true}
            formats={exportFormats}
          />
          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div className="Table-Txt">{selectedRows} selected</div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div className="Table-Txt">{props.title}</div>
              </Item>
            )}
            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
          </Toolbar>
        </DataGrid>
      </Card>
    </Container>
  );
};

export default Table;
