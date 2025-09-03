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
} from "devextreme-react/data-grid";
import { Popconfirm, Popover, Tag } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditDocument, MdPreview, MdTextSnippet } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { EXPORT } from "../../../utils/exportData";
import { useTranslation } from "react-i18next";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";

const PurchaseOrderTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [data, setData] = useState(props.List);
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
      cellRender: (item: any) => moment(item?.value).format("DD-MM-YYYY"),
    },
    {
      dataField: "seriesNo",
      caption: t("home_page.homepage.seriesNo"),
      dataType: "string",
      cellRender: ({ data }: any) => data?.locationDetails?.locationCode,
    },
    {
      dataField: "invoiceno",
      caption: t("home_page.homepage.invoice_no"),
    },
    {
      dataField: "sname",
      caption: t("home_page.homepage.a/c_name"),
    },
    {
      dataField: "total",
      caption: t("home_page.homepage.total"),
    },
    // {
    //   dataField: "status",
    //   caption: t("home_page.homepage.Status_salesinvoice"),
    //   dataType: "number",
    //   cellRender: (item: any) => {
    //     let status = null;
    //     if (item?.value == "5" || item?.value == "0") {
    //       status = <Tag color="red">{t("home_page.homepage.pending")}</Tag>;
    //     } else if (item?.value == "4") {
    //       status = <Tag color="green">{t("home_page.homepage.generate")}</Tag>;
    //     }
    //     return status;
    //   },
    // },
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
                    onClick={() => {
                      navigate(`/usr/purchase-order-view/${data?.data?.id}`);
                    }}
                  >
                    <div>{t("home_page.homepage.View")}</div>
                    <MdPreview size={18} color="grey" />
                  </div>
                  {data?.data?.status != "4" && (
                    <>
                      {props.canUpdatePurchases &&
                        props.canUpdatePurchases() && (
                          <div
                            className="table-actionBoxItem"
                            onClick={() =>
                              navigate(
                                `/usr/purchase-order-form/update/${data?.data?.id}`
                              )
                            }
                          >
                            <div>{t("home_page.homepage.Edit")}</div>
                            <MdEditDocument size={18} color="grey" />
                          </div>
                        )}
                      {props.canDeletePurchases &&
                        props.canDeletePurchases() && (
                          <Popconfirm
                            title="Delete"
                            description="Are you sure to delete ?"
                            icon={
                              <AiOutlineQuestionCircle
                                style={{ color: "red" }}
                              />
                            }
                            onConfirm={() =>
                              props?.deleteHandler(data?.data?.id)
                            }
                            placement="topRight"
                          >
                            <div className="table-actionBoxItem">
                              <div>{t("home_page.homepage.Delete")}</div>
                              <RiDeleteBinLine size={18} color="grey" />
                            </div>
                          </Popconfirm>
                        )}
                      <div
                        className="table-actionBoxItem"
                        onClick={() =>
                          navigate(
                            `/usr/purchase-order-form/generate/${data?.data?.id}`
                          )
                        }
                      >
                        <div>{t("home_page.homepage.Generate")}</div>
                        <MdTextSnippet size={18} color="grey" />
                      </div>
                    </>
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
      if (status == "5" || status == "0") {
        status = "Pending";
      } else if (status == "4") {
        status = "Generated";
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
    navigate(`/usr/purchase-order-view/${record?.data?.id}`);
  };
  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      e.rowElement.style.cursor = "pointer";
    }
  };
  return (
    <div
      style={{
        backgroundColor: "#ffff",
        padding: "30px",
        borderEndEndRadius: "5px",
      }}
    >
      <DataGrid
        ref={dataGridRef}
        dataSource={data}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Purchase Order List", customizeExportCell)
        }
        columnAutoWidth={true}
        showBorders={true}
        showRowLines={true}
        onRowPrepared={onRowPrepared}
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
        {columns.map((column: any, index) => (
          <Column
            key={index}
            alignment={"center"}
            dataField={column?.dataField}
            caption={column?.caption}
            fixed={column?.fixed || undefined}
            fixedPosition={column?.fixedPosition || undefined}
            cellRender={column?.cellRender}
            allowExporting={column?.caption === "Action" ? false : true}
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
      </DataGrid>
    </div>
  );
};
export default PurchaseOrderTable;
