import { useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card } from "antd";
import { Container } from "react-bootstrap";

const Table = (props: any) => {
  const [selectedRows, setSelectedRows] = useState();
  const [take, setTake] = useState<any>(10);
  const onExporting = (e: any) => {};
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  let pageDefualtNum = 10;
  const handleOptionChanged = (e: any) => {
    let page = 1;
    let take = 10;
    if (e.fullName === "paging.pageIndex") {
      page = e.value;
    }
    if (e.fullName === "paging.pageSize") {
      take = e.value;
    }
    if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
      props.onPageChange(page, take);

      pageDefualtNum = take;
      setTake(take);
    }
  };

  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          dataSource={props.products}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={onExporting}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          onOptionChanged={handleOptionChanged}
          remoteOperations={false}
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

          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {selectedRows} selected
                </div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 700 }}>
                  {props.title}
                </div>
              </Item>
            )}
            <Item name="searchPanel" />
          </Toolbar>
        </DataGrid>
      </Card>
    </Container>
  );
};

export default Table;
