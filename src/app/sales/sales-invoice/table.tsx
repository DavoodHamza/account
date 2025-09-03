import "../styles.scss";
import { useState, useEffect, useRef } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Item,
  Toolbar,
  TotalItem,
  Summary,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useTranslation } from "react-i18next";
import { Card, Popconfirm, Popover, Tag, notification } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPreview, MdEditDocument } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { EXPORT } from "../../../utils/exportData";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import { useAccessControl } from "../../../utils/accessControl";

const Table = (props: any) => {
  const { t } = useTranslation();
  const {
    canViewSales,
    canUpdateSales,
    canDeleteSales,
    hasAnySalesPermission,
  } = useAccessControl();
  const dataGridRef: any = useRef(null);
  const [data, setData] = useState(props.List);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    setData(props.List);
  }, [props.List]);

  const columns = [
    {
      name: "id",
      caption: t("home_page.homepage.sl_no"),
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "sdate",
      caption: t("home_page.homepage.invoice_date"),
      dataType: "date",
      cellRender: (item: any) => moment(item.value).format("DD-MM-YYYY"),
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
      dataType: "string",
    },
    {
      dataField: "cname",
      caption: t("home_page.homepage.a/c_name"),
    },
    {
      dataField: "total",
      caption: t("home_page.homepage.total"),
    },
    {
      dataField: "outstanding",
      caption: t("home_page.homepage.outstanding"),
    },

    {
      dataField: "status",
      caption: t("home_page.homepage.Status_salesinvoice"),
      dataType: "number",
      cellRender: (item: any) => {
        if (item.data?.outstanding == 0) {
          return <Tag color="green">{t("home_page.homepage.paid")}</Tag>;
        }
        let status = null;
        if (item.value === 0) {
          status = <Tag color="red">{t("home_page.homepage.unpaid")}</Tag>;
        } else if (item.value === 2) {
          status = <Tag color="green">{t("home_page.homepage.paid")}</Tag>;
        } else if (item.value === 1) {
          status = (
            <Tag color="orange">{t("home_page.homepage.part_paid")}</Tag>
          );
        }
        return status;
      },
    },
    {
      dataField: "reference",
      caption: t("home_page.homepage.Reference"),
      dataType: "string",
    },

    {
      caption: t("home_page.homepage.Action"),
      cellRender: (data: any) => {
        // Check if user has any permissions to show the action menu
        const hasAnyPermission = hasAnySalesPermission();

        if (!hasAnyPermission) {
          return null; // Don't show any action menu if no permissions
        }

        return (
          <div className="table-title">
            <Popover
              content={
                <div className="table-actionBox">
                  {canViewSales() && (
                    <div
                      className="table-actionBoxItem"
                      onClick={() => {
                        navigate(`/usr/sale-invoice-view/${data?.data?.id}`);
                      }}
                    >
                      <div>{t("home_page.homepage.View")}</div>
                      <MdPreview size={18} color="grey" />
                    </div>
                  )}
                  {canUpdateSales() && (
                    <div
                      className="table-actionBoxItem"
                      onClick={() =>
                        navigate(`/usr/sale-invoice-form/${data?.data?.id}`)
                      }
                    >
                      <div>{t("home_page.homepage.Edit")}</div>
                      <MdEditDocument size={18} color="grey" />
                    </div>
                  )}
                  {canDeleteSales() && (
                    <Popconfirm
                      title="Delete"
                      description="Are you sure to delete ?"
                      icon={
                        <AiOutlineQuestionCircle style={{ color: "red" }} />
                      }
                      onConfirm={() => props?.deleteHandler(data?.data?.id)}
                      placement="topRight"
                    >
                      <div className="table-actionBoxItem">
                        <div>{t("home_page.homepage.Delete")}</div>
                        <RiDeleteBinLine size={18} color="grey" />
                      </div>
                    </Popconfirm>
                  )}
                </div>
              }
              placement="leftTop"
              trigger={"click"}
            >
              <BsThreeDotsVertical size={16} cursor={"pointer"} />
            </Popover>
          </div>
        );
      },
      fixed: true,
      fixedPosition: "right",
    },
  ];
  const exportFormats = ["pdf", "xlsx"];
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (gridCell.rowType === "data" && gridCell.column.dataField === "status") {
      let status = gridCell.data.status;
      if (status == "0") {
        status = "Unpaid";
      } else if (status == "2") {
        status = "Paid";
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
  const handleRowDoubleClick = (record: any) => {
    navigate(`/usr/sale-invoice-view/${record?.data?.id}`);
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
        dataSource={data}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Sales-invoice-Report", customizeExportCell)
        }
        columnAutoWidth={true}
        showBorders={true}
        onRowPrepared={onRowPrepared}
        showRowLines={true}
        remoteOperations={false}
        onRowDblClick={handleRowDoubleClick}
        onSelectionChanged={onSelectionChanged}
        onOptionChanged={handleOptionChanged}
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
        {columns.map((column: any, index) => (
          <Column
            key={index}
            dataField={column.dataField}
            caption={column.caption}
            fixed={column?.fixed || undefined}
            fixedPosition={column?.fixedPosition || undefined}
            alignment="center"
            cellRender={column?.cellRender}
            allowExporting={column.caption === "Action" ? false : true}
          />
        ))}
        <Paging defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={[10, 20, "all"]}
          showInfo={true}
        />
        <Export
          enabled={true}
          allowExportSelectedData={true}
          formats={exportFormats}
        />

        <Summary>
          <TotalItem
            column="total"
            summaryType="sum"
            displayFormat={t("home_page.homepage.total") + ":{0}"}
            alignment={"left"}
            valueFormat={{ precision: 2 }}
          />

          <TotalItem
            column="outstanding"
            summaryType="sum"
            displayFormat={t("home_page.homepage.outstanding") + ":{0}"}
            alignment={"left"}
            valueFormat={{ precision: 2 }}
          />
        </Summary>

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
                {t("home_page.homepage.Total_Invoice")}: {data?.length}
              </div>
            </Item>
          )}
          <Item name="searchPanel" />
          <Item location="after" visible={true} name="exportButton" />
        </Toolbar>
      </DataGrid>
    </Card>
  );
};
export default Table;
