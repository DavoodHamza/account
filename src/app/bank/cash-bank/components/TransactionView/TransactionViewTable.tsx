import React, { useState } from "react";
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
import { Card,} from "antd";
import LoadingBox from "../../../../../components/loadingBox";
import { useTranslation } from "react-i18next";
const TransactionViewTable = (props: any) => {
  const {t} = useTranslation();
  const [selectedRows, setSelectedRows] = useState();
  const onExporting = (e: any) => {};
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["pdf", "xlsx"];

  return (
    <>
      <br />
      <Card>
        {props?.isLoading ? (
          <LoadingBox />
        ) : (
          <DataGrid
            dataSource={props.data}
            columnAutoWidth={true}
            showBorders={true}
            onExporting={onExporting}
            showRowLines={true}
            onSelectionChanged={onSelectionChanged}
            showColumnLines={true}
            style={{ textAlign: "center" }}
            searchPanel={{
              visible: true,
              width: window.innerWidth <= 580 ? 140 : 240,
              placeholder: "Search Sales",
              searchVisibleColumnsOnly: true,
              highlightCaseSensitive: false,
            }}
          >
            <Selection
              mode="multiple"
              selectAllMode="allPages"
              showCheckBoxesMode="always"
            />
            <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
 />
            <HeaderFilter visible={true} />

            <HeaderFilter visible={true} />
            {props.columns.map((column: any, index: number) => {
              return (
                <Column
                  dataField={column.name}
                  caption={column.title}
                  dataType={column.dataType}
                  format={column.format}
                  alignment={column.alignment}
                ></Column>
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
                    {selectedRows} {t("home_page.homepage.selected")}
                  </div>
                </Item>
              ) : (
                <Item location="before" visible={true}>
                  <div style={{ fontSize: "17px", fontWeight: 600 }}>
                    {t("home_page.homepage.TotalItems")} : {props?.data?.length}
                  </div>
                </Item>
              )}
              <Item name="searchPanel" />
              <Item location="after" visible={true} name="exportButton" />
            </Toolbar>
          </DataGrid>
        )}
      </Card>
    </>
  );
};
export default TransactionViewTable;
