import { Button, Card, DatePicker, Popover, notification } from "antd";
import dayjs from "dayjs";
import DataGrid, {
  Column,
  Export,
  HeaderFilter,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { bankTemplate } from "../../bank/cash-bank/components/template";
import LoadingBox from "../../../components/loadingBox";
import { EXPORT } from "../../../utils/exportData";
import ViewPopover from "../../../components/viewPopover";
import { MdFileDownload } from "react-icons/md";
import { t } from "i18next";
const PaymentTable = (props: any) => {
  const [selectedRows, setSelectedRows] = useState();
  const { id } = useParams();
  const Dtoday = moment(new Date()).startOf("month");
  const DoneMonthAgo = moment(new Date()).endOf("month");
  const [sdate, setSdate] = useState(Dtoday.format("YYYY-MM-DD"));
  const [ldate, setLdate] = useState(DoneMonthAgo.format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [data, setData] = useState([]);
  const [cashList, setCashList] = useState([]);
  const dataGridRef: any = useRef(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openingBalanceTotal, SetOpeningBalance] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["pdf", "xlsx"];

  useEffect(() => {
    fetchTransactions(sdate, ldate);
  }, [ldate, sdate]);

  const fetchTransactions = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      let url =
        API.GET_TRANSACTION +
        `?companyid=${user?.companyInfo?.id}&type=${props?.type}&sdate=${sdate}&ldate=${ldate}`;
      const response: any = await GET(url, null);
      if (response.status) {
        let transactions = response.data;
        if (props?.type === "Bank Transfer") {
          transactions = transactions.filter(
            (item: any) => item?.baseid !== null
          );
        }
        setData(transactions);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to fetch transaction details",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setSdate(dates[0]?.format("YYYY-MM-DD"));
      setLdate(dates[1].format("YYYY-MM-DD"));
    } else {
      setSdate("");
      setSdate("");
    }
    if (sdate && ldate) {
      fetchTransactions(
        dates?.length ? dates[0].format("YYYY-MM-DD") : new Date(),
        dates?.length ? dates[1].format("YYYY-MM-DD") : new Date()
      );
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

  const handleOnDelete = async (val: any) => {
    try {
      setIsLoading(true);
      let url = API.DELETE_BANK_TRANSACTION + val;
      const response: any = await DELETE(url);
      if (response?.status) {
        notification.success({
          message: "Success",
          description: "Transaction Deleted Successfully",
        });
        setIsLoading(false);
        fetchTransactions(sdate, ldate);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to delete the transaction",
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Failed",
        description: "Failed to delete the transaction",
      });
      setIsLoading(false);
    }
  };

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (
      gridCell.rowType === "data" &&
      gridCell.column.dataField === "reconcile_status"
    ) {
      let status = gridCell.data.reconcile_status;
      if (status === 1) {
        status = "Reconsiled";
      } else if (status === 0) {
        status = "-------";
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
  const handleRowDoubleClick = (data: any) => {
    if (data.data.type === "Bank Transfer") {
      navigate(`/usr/cashBank/viewtransfer/${data.data.id}`);
    } else if (data.data.type === "Customer Receipt") {
      navigate(`/usr/cashBank/customer-receipt/${data.data.id}/details`);
    } else if (data.data.type === "Other Receipt") {
      navigate(`/usr/cashBank/other-receipt/${data.data.id}/details`);
    } else if (data.data.type === "Supplier Refund") {
      navigate(`/usr/cashBank/supplier-refund/${data.data.id}/details`);
    } else if (data.data.type === "Supplier Payment") {
      navigate(`/usr/cashBank/supplier-payment/${data.data.id}/details`);
    } else if (data.data.type === "Other Payment") {
      navigate(`/usr/cashBank/other-payment/${data.data.id}/details`);
    } else if (data.data.type === "Customer Refund") {
      navigate(`/usr/cashBank/customer-refund/${data.data.id}/details`);
    } else if (data.data.type === "payroll") {
      console.log(data);
    }
  };
  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      e.rowElement.style.cursor = "pointer";
    }
  };
  return (
    <>
      <br />
      <Card>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <DataGrid
            ref={dataGridRef}
            dataSource={data}
            columnAutoWidth={true}
            onRowDblClick={handleRowDoubleClick}
            showBorders={true}
            onExporting={(e) =>
              EXPORT(e, dataGridRef, "Bank Statement", customizeExportCell)
            }
            showRowLines={true}
            onRowPrepared={onRowPrepared}
            onSelectionChanged={onSelectionChanged}
            showColumnLines={true}
            style={{ textAlign: "center" }}
            searchPanel={{
              visible: true,
              width: window.innerWidth <= 580 ? 140 : 240,
              placeholder: "Search",
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
            {props.columns.map((column: any, index: number) => {
              return (
                <Column
                  dataField={column.name}
                  caption={column.title}
                  dataType={column.dataType}
                  format={column.format}
                  alignment={column.alignment}
                  cellRender={column.cellRender}
                  allowExporting={column?.caption === "Action" ? false : true}
                ></Column>
              );
            })}
            <Paging
              defaultPageSize={take}
              pageSize={take}
              onPageIndexChange={(e) => onPageChange("page", e)}
              onPageSizeChange={(e) => onPageChange("take", e)}
            />

            <Pager
              visible={true}
              allowedPageSizes={[10, 20, 30]}
              displayMode={"compact"}
              showPageSizeSelector={true}
              showInfo={true}
              showNavigationButtons={true}
            />
            <Column
              dataField="reconcile_status"
              caption={`${t("home_page.homepage.status")}`}
              alignment="center"
              cellRender={(item) => {
                const status =
                  item?.row?.data?.reconcile_status === 1 ? (
                    <span>Reconciled</span>
                  ) : (
                    <span>--------</span>
                  );
                return <div className="table-title">{status}</div>;
              }}
            />
            <Column
              alignment={"center"}
              type="buttons"
              caption={`${t("home_page.homepage.Action")}`}
              dataField="id"
              width={110}
              cellRender={({ data }) => {
                return (
                  <div className="table-title">
                    <Popover
                      content={
                        <ViewPopover
                          onView={
                            data.type === "Bank Transfer"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/viewtransfer/${data.id}`
                                  )
                              : data.type === "Customer Receipt" ||
                                data?.type === "Customer Reciept"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/customer-receipt/${data.id}/details`
                                  )
                              : data.type === "Other Receipt"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/other-receipt/${data.id}/details`
                                  )
                              : data.type === "Supplier Refund"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/supplier-refund/${data.id}/details`
                                  )
                              : data.type === "Supplier Payment"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/supplier-payment/${data.id}/details`
                                  )
                              : data.type === "Other Payment"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/other-payment/${data.id}/details`
                                  )
                              : data.type === "Customer Refund"
                              ? () =>
                                  navigate(
                                    `/usr/cashBank/customer-refund/${data.id}/details`
                                  )
                              : data.type === "payroll"
                              ? () => console.log(data)
                              : // navigate(
                                //   `/usr/payroll/paysheet/${data.payrollid}`
                                // )
                                ""
                          }
                          OnEdit={
                            props.canUpdatePayments && props.canUpdatePayments()
                              ? () => props?.onEdit(data)
                              : undefined
                          }
                          OnDelete={
                            props.canDeletePayments && props.canDeletePayments()
                              ? () => handleOnDelete(data?.id)
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
            <Export
              enabled={true}
              allowExportSelectedData={true}
              formats={exportFormats}
            />
            <Toolbar>
              {selectedRows ? (
                <Item location="before" visible={true}>
                  <div className="pageHdrTxt">{selectedRows} selected</div>
                </Item>
              ) : (
                <Item location="before" visible={true}>
                  <div className="pageHdrTxt">
                    {t("home_page.homepage.Total_Transactions")} :{data?.length}
                  </div>
                </Item>
              )}
              <Item>
                <DatePicker.RangePicker
                  defaultValue={[
                    sdate ? dayjs(sdate, "YYYY-MM-DD") : null,
                    ldate ? dayjs(ldate, "YYYY-MM-DD") : null,
                  ]}
                  value={
                    sdate && ldate?.length
                      ? [
                          sdate ? dayjs(sdate, "YYYY-MM-DD") : null,
                          ldate ? dayjs(ldate, "YYYY-MM-DD") : null,
                        ]
                      : [dayjs(), dayjs()]
                  }
                  onChange={handleDateRangeChange}
                />
              </Item>
              <Item name="searchPanel" />
              <Item location="after" visible={true} name="exportButton" />
            </Toolbar>
          </DataGrid>
        )}
      </Card>
    </>
  );
};
export default PaymentTable;
