import React, { useState, useRef, useMemo } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card, Pagination, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { EXPORT } from "../../../utils/exportData";
import ActionPopover from "./actionPopover";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Table = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const navigate = useNavigate();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];
  const handleRowDoubleClick = (data: any) => {
    navigate(`/usr/product-view/${data?.data?.itemtype}/${data?.data?.id}`);
  };
  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      e.rowElement.style.cursor = "pointer";
    }
  };

  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => {
    return props?.columns?.map((column: any, index: number) => ({
      key: `${column.name}-${index}`,
      dataField: column.name,
      caption: column.title,
      dataType: column.dataType || "string",
      format: column.format,
      fixed: column?.fixed || undefined,
      fixedPosition: column?.fixedPosition || undefined,
      alignment: column.alignment,
      allowExporting: !(
        column?.name === "product_category" ||
        column?.name === "location" ||
        column?.name === "vat"
      ),
      cellRender: column?.cellRender,
    }));
  }, [props?.columns]);
  return (
    <Container>
      <br />
      <Card>
        <div style={{ position: "relative" }}>
          {props.isLoading || !props.products ? (
            <div
              style={{
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                border: "1px solid #d9d9d9",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                Loading...
              </div>
            </div>
          ) : props.products ? (
            <DataGrid
              ref={dataGridRef}
              dataSource={props.products || []}
              columnAutoWidth={true}
              showBorders={true}
              onExporting={(e) => EXPORT(e, dataGridRef, "products", () => {})}
              showRowLines={true}
              onRowPrepared={onRowPrepared}
              onRowDblClick={handleRowDoubleClick}
              onSelectionChanged={onSelectionChanged}
              remoteOperations={true}
              paging={{ enabled: false }}
              cacheEnabled={true}
              // Only call API search, never filter locally
              onOptionChanged={(e) => {
                if (e.fullName === "searchPanel.text") {
                  // Prevent local filtering by not updating the search panel text immediately
                  // Only trigger API search
                  props.onSearch && props.onSearch(e.value);
                  return false; // Prevent default behavior
                }
              }}
            >
              <Selection
                mode="multiple"
                selectAllMode="allPages"
                showCheckBoxesMode="always"
              />
              <SearchPanel
                visible={!props.isLoading}
                width={window.innerWidth <= 580 ? 140 : 240}
                text={props.searchValue}
                highlightSearchText={false}
              />
              <HeaderFilter visible={true} />
              {memoizedColumns?.map((column: any) => {
                return (
                  <Column
                    key={column.key}
                    dataField={column.dataField}
                    caption={column.caption}
                    dataType={column.dataType}
                    format={column.format}
                    fixed={column.fixed}
                    fixedPosition={column.fixedPosition}
                    alignment={column.alignment}
                    allowExporting={column.allowExporting}
                    cellRender={column.cellRender}
                  ></Column>
                );
              })}
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
                            onSuccess={props.onSuccess}
                            handleEditAsset={props.handleEditClick}
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
          ) : (
            <div
              style={{
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                border: "1px solid #d9d9d9",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                No Data
              </div>
            </div>
          )}
          {props.isSearching && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {props.isSearching ? "Searching..." : "Loading..."}
              </div>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end mt-3">
          <Pagination
            current={props?.page || 1}
            total={props?.total || 0}
            defaultCurrent={1}
            pageSize={props?.take || 10}
            onChange={(page: any, take: any) => props?.onPageChange(page, take)}
            pageSizeOptions={["10", "20", "50", "100", "1000"]}
          />
        </div>
      </Card>
    </Container>
  );
};

export default Table;
