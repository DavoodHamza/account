import { Card } from 'antd';
import DataGrid, {
  Column,
  Export,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import LoadingBox from '../../../components/loadingBox';
import { EXPORT } from '../../../utils/exportData';
import { useNavigate } from "react-router-dom";
const StaffTable = (props:any) => {
    const [page, SetPage] = useState(1);
    const [take, setTake] = useState(10);
    const [selectedRows, setSelectedRows] = useState();
    const dataGridRef: any = useRef(null);
    const exportFormats = ["xlsx", "pdf"];
    const navigate = useNavigate();
    const onSelectionChanged = (e: any) => {
      setSelectedRows(e.selectedRowsData.length);
    };
    const handleRowDoubleClick = (data: any)=>{
      navigate(`/usr/staff/details/${data?.data?.id}`);
    }
    const onRowPrepared = (e : any) => {
      if (e.rowType === 'data') {
        e.rowElement.style.cursor = 'pointer';
      }
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
          onRowDblClick={handleRowDoubleClick}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          remoteOperations={false}
          onRowPrepared={onRowPrepared}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
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
          
          <Paging defaultPageSize={take} />

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
                  {props.title}
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

export default StaffTable