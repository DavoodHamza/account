import "../../styles.scss";
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
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card, DatePicker, Popconfirm, Popover, Tag } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPreview, MdEditDocument } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { EXPORT } from "../../../../utils/exportData";
import { useRef, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const Table = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);

  const navigate = useNavigate();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const handleDateRangeChange = (dates: any) => {
    props.fetchSaleInvoiceList(
      dates ? dates[0] : new Date(),
      dates ? dates[1] : new Date()
    );
  };

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
      dataType: "date",
      format: "dd-MM-yyyy",
      alignment: "center",
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
      alignment: "center",
    },
    {
      dataField: "bus_name",
      caption: t("home_page.homepage.Supplier"),
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) =>
        data?.supplier?.bus_name || data?.supplier?.name,
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
      alignment: "center",
      cellRender: (data: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <div className="table-actionBox">
                  <div
                    className="table-actionBoxItem"
                    onClick={() => {
                      navigate(`/usr/purchase-invoice-view/${data?.data?.id}`);
                    }}
                  >
                    <div>{t("home_page.homepage.View")}</div>
                    <MdPreview size={18} color="grey" />
                  </div>
                  {props.canUpdatePurchases && props.canUpdatePurchases() && (
                    <div
                      className="table-actionBoxItem"
                      onClick={() =>
                        navigate(
                          `/usr/purchace-invoice-form/update/${data.data.id}`
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
                  {/* <div className="table-actionBoxItem">
                    <div>Copy</div>
                    <MdOutlineContentCopy size={18} color="grey" />
                  </div> */}
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
      if (status === 0) {
        status = "Unpaid";
      } else if (status == 2) {
        status = "Paid";
      } else if (status == 1) {
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
      gridCell.rowType === "data" &&
      gridCell.column.dataField === "bus_name"
    ) {
      let bus_name =
        gridCell.data.supplier?.bus_name || gridCell.data.supplier?.name || "";
      if (type === "pdf") {
        cell.text = bus_name;
      } else if (type === "xlsx") {
        cell.value = bus_name;
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

  const onPageChangee = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };
  const onPageChange = (type: any, e: any) => {
    if (type === "page") {
      onPageChangee(e, take);
    } else if (type === "take") {
      setTake(e);
      onPageChangee(page, e);
    }
  };
  const handleRowDoubleClick = (record: any) => {
    navigate(`/usr/purchase-invoice-view/${record?.data?.id}`);
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
        dataSource={props.List}
        columnAutoWidth={true}
        showBorders={true}
        showRowLines={true}
        onRowPrepared={onRowPrepared}
        remoteOperations={false}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Purchase Report", customizeExportCell)
        }
        onSelectionChanged={onSelectionChanged}
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
            fixed={column?.fixed || undefined}
            fixedPosition={column?.fixedPosition || undefined}
            cellRender={column.cellRender}
            format={column.format}
            alignment={column.alignment}
            dataType={column.dataType}
            allowExporting={column.caption === "Action" ? false : true}
          />
        ))}
        <Paging
          defaultPageSize={take}
          pageSize={take}
          onPageIndexChange={(e) => onPageChange("page", e)}
          onPageSizeChange={(e) => onPageChange("take", e)}
        />
        <Pager
          visible={true}
          allowedPageSizes={[10, 20, 30, 50, 100]}
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
              <div className="Table-Txt">{selectedRows} selectede</div>
            </Item>
          ) : (
            <Item location="before" visible={true}>
              <div className="Table-Txt"></div>
            </Item>
          )}
          <Item name="searchPanel" />
          <Item location="after" visible={true} name="exportButton" />
          <Item location="before">
            <DatePicker.RangePicker
              defaultValue={[
                dayjs(props?.sdate, "YYYY-MM-DD"),
                dayjs(props?.ldate, "YYYY-MM-DD"),
              ]}
              onChange={handleDateRangeChange}
            />
          </Item>
        </Toolbar>
        <Summary>
          <TotalItem
            column="total"
            summaryType="sum"
            displayFormat={t("home_page.homepage.total") + ":{0}"}
            alignment={"center"}
            valueFormat={{ precision: 2 }}
          />
          <TotalItem
            column="outstanding"
            summaryType="sum"
            displayFormat={t("home_page.homepage.outstanding") + ":{0}"}
            alignment={"center"}
            valueFormat={{ precision: 2 }}
          />
        </Summary>
      </DataGrid>
    </Card>
  );
};
export default Table;
