import React, { useRef, useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";
import { Card, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { EXPORT } from "../../../utils/exportData";
import ViewPopover from "../../../components/viewPopover";
import { useTranslation } from "react-i18next";
import "../styles.scss";

const DataTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);

  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (
      gridCell.column.dataField === "sdate" &&
      gridCell.rowType !== "header" &&
      gridCell.rowType !== "totalFooter"
    ) {
      const sdate = moment(gridCell.data?.sdate)?.format("DD-MM-YYYY");
      if (type === "pdf") {
        cell.text = sdate ?? "";
      } else if (type === "xlsx") {
        cell.value = sdate ?? "";
      }
    }
  };
  const exportFormats = ["xlsx", "pdf"];

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
  const handleRowDoubleClick = (data: any) =>{
    navigate(`/usr/proposal/details/${data?.data?.id}`);
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
          dataSource={props.list}
          columnAutoWidth={true}
          showBorders={true}
          // onExporting={(e) => EXPORT(e, dataGridRef, "proposals",() =>{})}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "proposals", customizeExportCell)
          }
          onOptionChanged={handleOptionChanged}
          showRowLines={true}
          onRowPrepared={onRowPrepared}
          onRowDblClick={handleRowDoubleClick} 
          onSelectionChanged={onSelectionChanged}
          showColumnLines={true}
          style={{ textAlign: "center" }}
          searchPanel={{
            visible: true,
            width: window.innerWidth <= 411 ? 140 : 240,
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
          <SearchPanel
            visible={true}
            width={window.innerWidth <= 580 ? 140 : 240}
          />
          <HeaderFilter visible={true} />

          <HeaderFilter visible={true} />
          {props?.columns?.map((column: any, index: number) => {
            return (
              <Column
                key={index}
                dataField={column.dataField}
                caption={column.title}
                cellRender={column.cellRender}
                fixed={column?.fixed || ""}
                fixedPosition={column?.fixedPosition || ""}
                alignment="center"
              ></Column>
            );
          })}

          <Column
            alignment={"center"}
            type="buttons"
            fixed={true}
            fixedPosition="right"
            caption={ t("home_page.homepage.Action_pl")}
            dataField="id"
            width={110}
            cellRender={({ data }) => {
              return (
                <div className="table-title">
                  <Popover
                    content={
                      <ViewPopover
                        onView={() => {
                          navigate(`/usr/proposal/details/${data.id}`);
                        }}
                        OnEdit={() => navigate(`/usr/proposal/edit/${data.id}`)}
                        OnDelete={() => {
                          props?.handleDelete(data?.id);
                        }}
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
                <div
                  className="pageHdrTxt"
                  // style={{ fontSize: "17px", fontWeight: 600 }}
                >
                  {t("home_page.homepage.Total_Proposals")} :
                  {props?.list?.length ? props?.list?.length : 0}
                </div>
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
export default DataTable;
