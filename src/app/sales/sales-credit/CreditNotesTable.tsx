import React, { useRef, useState } from "react";
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
import { Card, Popover, Tag } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ViewPopover from "../../../components/viewPopover";
import { EXPORT } from "../../../utils/exportData";
import moment from "moment";
import { useTranslation } from "react-i18next";

const CreditNotesTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);

  const navigate = useNavigate();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
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
      props.onPageChange(page, take);
    }
  };

  const onPageChanged = (e: any) => {
    SetPage(e.pageIndex + 1);
    setTake(e.pageSize);
  };

  //credit notes table columns
  const columns = [
    {
      name: "id",
      caption: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "sdate",
      caption: t("home_page.homepage.invoice_date"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data && data.sdate ? moment(data.sdate).format("YYYY-MM-DD") : "-"}
        </div>
      ),
    },
    {
      dataField: "seriesNo",
      caption: t("home_page.homepage.seriesNo"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.locationDetails?.locationCode,
    },
    {
      dataField: "invoiceno",
      caption: t("home_page.homepage.invoice_no"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.invoiceno}</div>
      ),
    },
    {
      dataField: "cname",
      caption: t("home_page.homepage.a/c_name"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.cname}</div>
      ),
    },
    {
      dataField: "total",
      caption: t("home_page.homepage.totals"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.total ? data?.total : "-"}
        </div>
      ),
    },
    {
      dataField: "outstanding",
      caption: t("home_page.homepage.outstanding"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.outstanding ? data?.outstanding : "-"}
        </div>
      ),
    },
    {
      dataField: "status",
      caption: t("home_page.homepage.Status_salesinvoice"),
      dataType: "number",
      cellRender: (item: any) => {
        let status = null;
        if (item.value == 0) {
          status = <Tag color="red">Pending</Tag>;
        } else if (item.value == 2) {
          status = <Tag color="green">Refunded</Tag>;
        } else if (item.value === 1) {
          status = <Tag color="orange">Part Paid</Tag>;
        }
        return status;
      },
    },
  ];

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (gridCell.rowType === "data" && gridCell.column.dataField === "status") {
      let status = gridCell.data.status;
      if (status == "0") {
        status = "Pending";
      } else if (status == "2") {
        status = "Refunded";
      } else if (status == "1") {
        status = "Part Paid";
      }
      gridCell.data.status = status;
      if (type === "pdf") {
        cell.text = status;
      } else if (type === "xlsx") {
        cell.value = status;
      }
    }
    if (gridCell.rowType === "data" && gridCell?.column?.caption === "SL No") {
      const id = gridCell?.column?.index + 1;
      if (type === "pdf") {
        cell.text = id.toString();
      } else if (type === "xlsx") {
        cell.value = id;
      }
    }
    if (
      gridCell.column.dataField === "sdate" &&
      gridCell.rowType !== "header" &&
      gridCell.rowType !== "totalFooter"
    ) {
      const sdate = moment(gridCell.data?.sdate)?.format("DD-MM-YYYY");
      if (type === "pdf") {
        cell.text = sdate ?? "";
      } else if (type === "xlsx") {
        cell.value = sdate ?? "";
      }
    }
  };
  const handleRowDoubleClick = (record: any) => {
    navigate(`/usr/salesCredit/view/${record?.data.id}`);
  };
  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      e.rowElement.style.cursor = "pointer";
    }
  };
  return (
    <Card>
      <DataGrid
        ref={dataGridRef}
        dataSource={props.list}
        columnAutoWidth={true}
        showBorders={true}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Credit Note list", customizeExportCell)
        }
        onOptionChanged={handleOptionChanged}
        onPagingChange={onPageChanged}
        showRowLines={true}
        onRowPrepared={onRowPrepared}
        onRowDblClick={handleRowDoubleClick}
        onSelectionChanged={onSelectionChanged}
        showColumnLines={true}
        style={{ textAlign: "center" }}
        searchPanel={{
          visible: true,
          width: 240,
          placeholder: "Search Credit note",
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
              fixed={column?.fixed || ""}
              fixedPosition={column?.fixedPosition || ""}
              cellRender={column.cellRender}
              alignment={"center"}
            ></Column>
          );
        })}

        {/* 3 dots popover  */}
        <Column
          alignment={"center"}
          type="buttons"
          fixed={true}
          fixedPosition="right"
          caption="Action"
          dataField="id"
          width={110}
          cellRender={({ data }) => {
            return (
              <div className="table-title">
                <Popover
                  content={
                    <ViewPopover
                      onView={() => {
                        navigate(`/usr/salesCredit/view/${data?.id}`);
                      }}
                      OnEdit={
                        props.canUpdateSales && props.canUpdateSales()
                          ? () => navigate(`/usr/salesCredit/edit/${data?.id}`)
                          : undefined
                      }
                      OnDelete={
                        props.canDeleteSales && props.canDeleteSales()
                          ? () => {
                              props?.handleDelete(data?.id);
                            }
                          : undefined
                      }
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
                {selectedRows} selected
              </div>
            </Item>
          ) : (
            <Item location="before" visible={true}>
              <div style={{ fontSize: "17px", fontWeight: 600 }}>
                {t("home_page.homepage.Total_Credit")} : {props?.list?.length}
              </div>
            </Item>
          )}
          <Item location="before" visible={true}>
            <div
              style={{ fontSize: "17px", fontWeight: 600, marginLeft: "20px" }}
            >
              {t("home_page.homepage.Net_Total")} : {props?.netTotal.toFixed(2)}
            </div>
          </Item>
          <Item name="searchPanel" />
          <Item location="after" visible={true} name="exportButton" />
        </Toolbar>
      </DataGrid>
    </Card>
  );
};
export default CreditNotesTable;
