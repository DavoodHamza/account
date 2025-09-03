import React, { useRef, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
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
import ViewPopover from "../../../components/viewPopover";
import { useNavigate } from "react-router-dom";
import { EXPORT } from "../../../utils/exportData";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const SupplierListTable = (props: any) => {
  const { t } = useTranslation();
  const { canViewContacts, canUpdateContacts, canDeleteContacts } = useAccessControl();

  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);

  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData?.length);
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

  const handleOptionChanged = (e: any) => {
    if (e.fullName === "paging.pageIndex") {
      SetPage(e.value);
    }
    if (e.fullName === "paging.pageSize") {
      setTake(e.value);
    }
    if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
      props?.onPageChange(page, take);
    }
  };

  const columns = [
    {
      dataField: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
      },
    {
      dataField: "name",
      caption: t("home_page.homepage.Supplier_Name"),
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
    {
      caption: t("home_page.homepage.Action"),
      cellRender: ({ data }: any) => {
        return (
          <div className="d-flex justify-content-center">
            <Popover
              content={
                <ViewPopover
                  onView={canViewContacts() ? () => navigate(`details/${data?.id}`) : undefined}
                  OnEdit={canUpdateContacts() ? () => navigate(`edit/${data?.id}`) : undefined}
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
      },
      fixed:true,
      fixedPosition:"right"
    },
  ];
   const handleRowDoubleClick = (data:any)=>{
    navigate(`details/${data?.data?.id}`)
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
          dataSource={props?.list}
          columnAutoWidth={true}
          showBorders={true}
          // onExporting={(e) => EXPORT(e, dataGridRef, "suppliers", () => {})}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "Customer List", customizeExportCell)
          }
          onRowDblClick={handleRowDoubleClick}
          onOptionChanged={handleOptionChanged}
          onRowPrepared={onRowPrepared}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          showColumnLines={true}
          style={{ textAlign: "center" }}
          searchPanel={{
            visible: true,
            width: window.innerWidth <= 580 ? 140 : 240,
            placeholder: "Search Supplier",
            searchVisibleColumnsOnly: true,
            highlightCaseSensitive: false,
          }}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <HeaderFilter visible={true} />
          {columns.map((column: any, index) => (
            <Column
              key={index}
              dataField={column.dataField}
              caption={column.caption}
              cellRender={column.cellRender}
              fixed={column?.fixed || undefined}
              fixedPosition={column?.fixedPosition || undefined}
              allowExporting = {column?.caption === 'Action'?false:true}
            />
          ))}
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
                <div className="pageHdrTxt">
                  {selectedRows} {t("home_page.homepage.selected")}
                </div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div className="pageHdrTxt">
                {t("home_page.homepage.Total_Suppliers")} {props?.list?.length}
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
export default SupplierListTable;
