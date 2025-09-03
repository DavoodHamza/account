import { Card } from 'antd';
import DataGrid, {
  Column,
  Export,
  Item,
  Pager,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import LoadingBox from '../../../components/loadingBox';
import { EXPORT } from '../../../utils/exportData';

const StripeLogTable = (props:any) => {
    const [selectedRows, setSelectedRows] = useState();
    const dataGridRef: any = useRef(null);
    const onSelectionChanged = (e: any) => {
      setSelectedRows(e.selectedRowsData.length);
    };
  return (
    <Card>
        <>
      {props?.isLoading ? (
        <LoadingBox />
      ) : (
        <DataGrid
          ref={dataGridRef}
          dataSource={props?.list}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "ledgers", {})
          }
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          remoteOperations={false}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? "100%" : 240}
 />
          {props.columns.map((column: any, index: number) => {
            return (
              <Column
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={"center"}
                cellRender={column?.cellRender}
              ></Column>
            );
          })}
          
          {/* <Paging defaultPageSize={take} /> */}

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
            //formats={exportFormats}
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
                  {window.innerWidth <= 497 ? "" :props.title}
                </div>
              </Item>
            )}


            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
          </Toolbar>
        </DataGrid>
      )}
    </>
    </Card>
  )
}

export default StripeLogTable