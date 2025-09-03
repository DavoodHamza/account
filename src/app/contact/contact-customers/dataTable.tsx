import React, { useRef, useState} from "react";
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
import { Card, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ViewPopover from "../components/viewPopover";
import { EXPORT } from "../../../utils/exportData";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const DataTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const { canViewContacts, canUpdateContacts, canDeleteContacts } = useAccessControl();

  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (gridCell.rowType === "data" && gridCell?.column?.caption === "SL No") {
      const id =gridCell?.column?.index + 1;
      if (type === "pdf") {
          cell.text = id.toString();
      } else if (type === "xlsx") {
          cell.value = id;
      }
  }
  };
  const exportFormats = ["xlsx", "pdf"];

  // const handleOptionChanged = (e: any) => {
  //   if (e.fullName === "paging.pageIndex") {
  //     SetPage(e.value);
  //   }
  //   if (e.fullName === "paging.pageSize") {
  //     setTake(e.value);
  //   }
  //   if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
  //     props.onPageChange(page, take);
  //   }
  // };
  // const onPageChange = (page: number) => {
  //   SetPage(page);
  //   props.onPageChange(page, take);
  // };
  
  const columns = [
    // {
    //   caption: t("home_page.homepage.slno"),
    //   dataType: "string",
    //   alignment: "center",
    //   cellRender: (data: any) => (page - 1) * take + data?.rowIndex + 1,
    // },
    {
      dataField: "name",
      caption: t("home_page.homepage.Customer_Name"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.name}</div>
      ),
    },
    {
      dataField: "bus_name",
      caption: t("home_page.homepage.Business_Name"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.bus_name}</div>
      ),
    },
    {
      dataField: "reference",
      caption: t("home_page.homepage.Reference"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.reference}</div>
      ),
    },
    {
      dataField: "email",
      caption: t("home_page.homepage.Email"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.email ? data?.email : "-"}
        </div>
      ),
    },
    {
      dataField: "mobile",
      caption: t("home_page.homepage.Phone"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.mobile ? data?.mobile : "-"}
        </div>
      ),
    },
  ];
  const handleRowDoubleClick=(data:any)=>{
    navigate(`/usr/contactCustomers/details/${data?.data?.id}`);
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
          onRowPrepared={onRowPrepared}
          // onExporting={(e) => EXPORT(e, dataGridRef, "customers", () => {})}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "Customer List", customizeExportCell)
          }
          onRowDblClick={handleRowDoubleClick}
          // onOptionChanged={handleOptionChanged}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          showColumnLines={true}
          style={{ textAlign: "center" }}
          searchPanel={{
            visible: true,
            width: window.innerWidth <= 580 ? 140 : 240,
            placeholder: "Search Customers",
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
          {columns.map((column: any, index: number) => {
            return (
              <Column
                key={index}
                dataField={column.dataField}
                caption={column.caption}
                cellRender={column.cellRender}
                fixed={column?.fixed || undefined}
                fixedPosition={column?.fixedPosition || undefined}
              ></Column>
            );
          })}

          <Column
            alignment={"center"}
            type="buttons"
            fixed={true}
            fixedPosition="right"
            caption= {`${t("home_page.homepage.Action")}`}
            dataField="id"
            width={110}
            cellRender={({ data }) => {
              return (
                <div className="table-title">
                  <Popover
                    content={
                      <ViewPopover
                        onView={canViewContacts() ? () => {
                          navigate(`/usr/contactCustomers/details/${data.id}`);
                        } : undefined}
                        OnEdit={canUpdateContacts() ? () =>
                          navigate(`/usr/contactCustomers/edit/${data.id}`)
                        : undefined}
                        OnDelete={canDeleteContacts() ? () => {
                          props?.handleDelete(data?.id);
                        } : undefined}
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
          {/* <Paging 
          defaultPageSize={10}
          onPageIndexChange={(e) => onPageChange("page", e)}
          onPageSizeChange={(e) => onPageChange("take", e)} />
          <Pager
            visible={true}
            allowedPageSizes={[10, 20, 30, 40, 50, 70, 100]}
            displayMode={"compact"}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          /> */}
          <Export
            enabled={true}
            allowExportSelectedData={true}
            formats={exportFormats}
          />
          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div className="pageHdrTxt">
                  {selectedRows} selected
                </div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div className="pageHdrTxt">
                  {t("home_page.homepage.Total_Customers")}:
                  {props?.metaData?.itemCount}
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
