import "../styles.scss"; // Import your custom styles
import React, { useState, useEffect, useRef } from "react";
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
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card, Popconfirm, Popover, Tag } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  MdPreview,
  MdEditDocument,
  //MdOutlineContentCopy,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { EXPORT } from "../../../utils/exportData";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";

const TablePurchaseAsset = (props: any) => {
  const { t } = useTranslation();
  const [data, setData] = useState(props.List);
  const navigate = useNavigate();
  const dataGridRef: any = useRef(null);

  useEffect(() => {
    setData(props.List);
  }, [props.List]);

  const columns = [
    {
      name: "id",
      caption: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "ldate",
      caption: t("home_page.homepage.invoice_date"),
      dataType: "date",
      format: "dd-MM-yyyy",
      alignment: "center",
    },
    {
      dataField: "seriesNo",
      caption: t("home_page.homepage.seriesNo"),
      alignment: "center",
      cellRender: ({ data }: any) => data?.locationDetails?.locationCode,
    },
    {
      dataField: "invoiceno",
      caption: t("home_page.homepage.invoice_no"),
      dataType: "string",
      alignment: "center",
    },
    {
      // dataField: "bus_name",
      dataField: "sname",
      caption: t("home_page.homepage.Supplier"),
      dataType: "string",
      alignment: "center",
    },
    {
      dataField: "total",
      caption: t("home_page.homepage.total"),
      dataType: "number",
      alignment: "center",
    },

    {
      dataField: "outstanding",
      caption: t("home_page.homepage.outstanding"),
      dataType: "number",
      alignment: "center",
    },
    {
      dataField: "status",
      caption: t("home_page.homepage.Status_salesinvoice"),
      dataType: "number",
      alignment: "center",
      cellRender: (item: any) => {
        let status = null;
        if (item.value == 0) {
          status = <Tag color="red">Unpaid</Tag>;
        } else if (item.value == 2) {
          status = <Tag color="green">Paid</Tag>;
        } else if (item.value === 1) {
          status = <Tag color="orange">Part Paid</Tag>;
        }
        return status;
      },
    },

    {
      caption: t("home_page.homepage.Action"),
      cellRender: (data: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <div className="table-actionBox">
                  <div
                    className="table-actionBoxItem"
                    onClick={() =>
                      navigate(
                        `/usr/purchase-fore-assets/view/${data?.data?.id}`
                      )
                    }
                  >
                    <div>{t("home_page.homepage.View")}</div>
                    <MdPreview size={18} color="grey" />
                  </div>
                  {props.canUpdatePurchases && props.canUpdatePurchases() && (
                    <div
                      className="table-actionBoxItem"
                      onClick={() =>
                        navigate(
                          `/usr/purchase-asset-form/edit/${data?.data?.id}`
                        )
                      }
                    >
                      <div>{t("home_page.homepage.Edit")}</div>
                      <MdEditDocument size={18} color="grey" />
                    </div>
                  )}
                  {props.canDeletePurchases && props.canDeletePurchases() && (
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
    navigate(`/usr/purchase-fore-assets/view/${record?.data?.id}`);
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
        columnAutoWidth={true}
        showBorders={true}
        showRowLines={true}
        remoteOperations={false}
        onRowPrepared={onRowPrepared}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Purchase Asset List", customizeExportCell)
        }
        onRowDblClick={handleRowDoubleClick}
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
        {columns.map((column: any) => (
          <Column
            dataField={column.dataField}
            caption={column.caption}
            cellRender={column.cellRender}
            format={column.format}
            fixed={column?.fixed || undefined}
            fixedPosition={column?.fixedPosition || undefined}
            alignment={column.alignment}
            dataType={column.dataType}
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

        <Toolbar>
          <Item name="searchPanel" />
          <Item location="after" visible={true} name="exportButton" />
        </Toolbar>
      </DataGrid>
    </Card>
  );
};
export default TablePurchaseAsset;
