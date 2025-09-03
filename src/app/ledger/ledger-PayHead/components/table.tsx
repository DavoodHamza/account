import { Button, Card, Popconfirm } from "antd";
import DataGrid, {
  Column,
  HeaderFilter,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { EXPORT } from "../../../../utils/exportData";
import { useTranslation } from "react-i18next";


const Table = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [isForm, setIsForm] = useState(false);
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const {t} =useTranslation();
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
    <Container>
      <Card>
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
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
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
                cellRender={column.cellRender}
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
          <Column
            alignment={"center"}
            type="buttons"
            caption= {t("home_page.homepage.Action_comon")}
            width={110}
            cellRender={(item) => {
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {/* <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => props?.handleDeleteClick(item.data.id)}
                  >
                    <MdDelete size={16} cursor={"pointer"} />
                  </Popconfirm>
                  &nbsp; &nbsp; */}
                  <div
                    className="table-title"
                    onClick={() => props?.handleEditClick(item.data)}
                  >
                    <MdEdit size={16} cursor={"pointer"} color="#2f76e0" />
                  </div>
                </div>
              );
            }}
          ></Column>

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
      </Card>
    </Container>
  );
};

export default Table;
