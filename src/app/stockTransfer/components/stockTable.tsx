import React, { useRef, useState } from "react";
import DataGrid, {
  Column,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import ViewPopover from "../../../components/viewPopover";
import { EXPORT } from "../../../utils/exportData";

const StockTransferTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();

  const columns = [
    {
      name: "id",
      caption:  `${t("home_page.homepage.slno")}`,
      dataType: "string",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "seriesNo",
      caption: t("home_page.homepage.seriesNo"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.locationDetails?.locationCode,
    },
    {
      dataField: "voucherNo",
      name:`${t("home_page.homepage.Voucher_No")}`,
      title: `Voucher No`,
      dataType: "string",
      cellRender: ({ data }: any) => data?.voucherNo,
    },
    {
      name:`${t("home_page.homepage.transfer_Date")}`,
      title: `Date`,
      dataType: "date",
      cellRender: ({ data }: any) =>
        moment(data?.transferDate).format("DD-MM-YYYY"),
    },
    {
      name:`${t("home_page.homepage.Location_from")}`,
      title: `From`,
      dataType: "string",
      cellRender: ({ data }: any) => data?.locationFromDetails?.location,
    },
    {
      name:  `${t("home_page.homepage.Location_to")}`,
      title: `To`,
      dataType: "string",
      cellRender: ({ data }: any) => data?.locationToDetails?.location,
    },
    {
      name:   `${t("home_page.homepage.Reference_db")}`,
      title: `Notes`,
      dataType: "string",
    },
    {
      caption: t("home_page.homepage.Action"),
      cellRender: ({ data }: any) => {
        return (
          <div className="d-flex justify-content-center">
            <Popover
              content={
                <ViewPopover
                  onView={() => {
                    navigate(`/usr/stock-transfer/${data?.id}/details`);
                  }}
                  OnEdit={() => navigate(`/usr/stock-transfer/${data.id}`)}
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
      },
      fixed:true,
      fixedPosition:"right"
    },
  ];
  const exportFormats = ["pdf", "xlsx"];
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

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (
      gridCell.column.dataField === "userdate" &&
      gridCell.rowType !== "header" &&
      gridCell.rowType !== "totalFooter"
    ) {
      const userdate = moment(gridCell.data?.userdate)?.format("DD-MM-YYYY");
      if (type === "pdf") {
        cell.text = userdate ?? "";
      } else if (type === "xlsx") {
        cell.value = userdate ?? "";
      }
    }
  };
  const handleRowDoubleClick = (record: any) =>{
    navigate(`/usr/stock-transfer/${record?.data?.id}/details`);
  }
  const onRowPrepared = (e : any) => {
    if (e.rowType === 'data') {
      e.rowElement.style.cursor = 'pointer';
    }
  };
  return (
    <DataGrid
      ref={dataGridRef}
      dataSource={props.list}
      columnAutoWidth={true}
      showBorders={true}
      onExporting={(e) =>
        EXPORT(e, dataGridRef, "Stock transfer", customizeExportCell)
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
        width: 240,
        placeholder: "Search here",
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
          dataField={column.name}
          caption={column.caption}
          fixed={column?.fixed || undefined}
          fixedPosition={column?.fixedPosition || undefined}
          alignment="center"
          cellRender={column.cellRender}
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
            <div style={{ fontSize: "17px", fontWeight: 600 }}>
              {selectedRows} {t("home_page.homepage.selected")}
            </div>
          </Item>
        ) : (
          <Item location="before" visible={true}>
            <div style={{ fontSize: "17px", fontWeight: 600 }}>
              <h4>{t("home_page.homepage.Details")}</h4>
            </div>
          </Item>
        )}
        <Item name="searchPanel" />
        <Item location="after" visible={true} name="exportButton" />
      </Toolbar>
    </DataGrid>
  );
};
export default StockTransferTable;
