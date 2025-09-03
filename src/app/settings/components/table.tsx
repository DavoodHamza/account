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
import { useState } from "react";
import { Container } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";


const Table = (props: any) => {
  const [selectedRows, setSelectedRows] = useState();
  const [isForm, setIsForm] = useState(false);
  const { t } = useTranslation();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  // const handleDeleteClick = (id: any) => {
  //   if (props.onDelete) {
  //     props.onDelete(id);
  //   }
  // };

  return (
    <Container>
      <Card>
       
        <DataGrid
         
          dataSource={props?.data}
          columnAutoWidth={true}
          showBorders={true}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
       
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
          <Column
            alignment={"center"}
            type="buttons"
            caption={`${t("home_page.homepage.Action_comon")}`}
            width={110}
            cellRender={(item) => {
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => props.handleDeleteClick(item.data.id)}
                  >
                    <MdDelete size={16} cursor={"pointer"} />
                  </Popconfirm>
                  &nbsp; &nbsp;
                  <div
                    className="table-title"
                    onClick={() =>{
                       props.handleEditClick(item.data.id)}}
                  >
                    <MdEdit size={16} cursor={"pointer"} color="#2f76e0" />
                  </div>
                </div>
              );
            }}
          ></Column>

          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            allowedPageSizes={[10, 20, "all"]}
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
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {props.title}
                </div>
              </Item>
            )}
            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
            <Item location="after">
            {props.onBtnClick ? (
          // <div className="table-BtnBox">
            <Button type="primary" onClick={props.onBtnClick}>
            {t("home_page.homepage.ADD_NEW")}
            </Button>
          // </div>
        ) : null}
            </Item>
          </Toolbar>
        </DataGrid>
      </Card>
    </Container>
  );
};

export default Table;
