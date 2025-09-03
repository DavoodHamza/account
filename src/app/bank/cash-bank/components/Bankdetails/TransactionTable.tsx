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
import LoadingBox from "../../../../../components/loadingBox";
import ViewPopover from "../../../../../components/viewPopover";
import API from "../../../../../config/api";
import { DELETE, GET } from "../../../../../utils/apiCalls";
import { EXPORT } from "../../../../../utils/exportData";
import { MdFileDownload } from "react-icons/md";
import { bankTemplate } from "../template";
const TransactionTable = (props: any) => {
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
  const [openingBankBalance, SetOpeningBankBalance] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["pdf", "xlsx"];
  const currency = user?.companyInfo?.countryInfo?.symbol;

  useEffect(() => {
    fetchTransactions(page, take, sdate, ldate);
  }, [page, take, ldate, sdate]);

  useEffect(() => {
    fetchBankDetails();
  }, []);
  const fetchTransactions = async (
    page: Number,
    take: Number,
    sdate: any,
    ldate: any
  ) => {
    try {
      setIsLoading(true);
      let URL = `${API.LIST_BANK_ACTIVITY}${user?.id}/${id}/${sdate}/${ldate}?order=DESC&page=${page}&take=${take}&bank=true`;
      const response: any = await GET(URL, null);
      if (response?.status) {
        setCashList(response?.data?.resList);
        // let openingBalace =
        //   Number(response?.data?.openingBalance) +
        //   Number(response?.data?.bankInfo?.opening);
        SetOpeningBalance(Number(response?.data?.openingBalance));
        SetOpeningBankBalance(Number(response?.data?.bankInfo?.opening));
        setData(response?.data?.resList);
        setIsLoading(false);
      } else {
        SetOpeningBalance(Number(response?.data?.openingBalance));
        setIsLoading(false);
        setCashList([]);
        setData([]);
      }
    } catch (error) {
      console.log(error);
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
        page,
        take,
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
        notification.success({ message: "Transaction Deleted Successfully" });
        setIsLoading(false);
        fetchTransactions(page, take, sdate, ldate);
        props?.fetchBankDetails();
      } else {
        notification.error({ message: "Failed to delete the transaction" });
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: "Failed to delete the transaction" });
      setIsLoading(false);
    }
  };

  function calculateCredit() {
    const total = cashList?.reduce((acc: any, obj: any) => {
      return acc + Number(obj?.credit);
    }, 0);
    return total?.toFixed(2);
  }

  function calculateDebit() {
    const total: any = cashList?.reduce((acc: any, obj: any) => {
      return acc + Number(obj?.debit);
    }, 0);
    return total?.toFixed(2);
  }

  function totalClosing() {
    let calcDebitTotal = calculateDebit();
    let calcCreditTotal = calculateCredit();
    let total = calcDebitTotal - calcCreditTotal;
    if(openingBalanceTotal != 0){
      return Number(total) + openingBalanceTotal;
    }
    else {
      return Number(total) + openingBankBalance
    }
  }

  const fetchBankDetails = async () => {
    try {
      const bank_url = API.GET_BANK_DETAILS + `${id}/${user?.id}`;
      const { data }: any = await GET(bank_url, null);
      SetOpeningBalance(Number(data.bankDetails.opening));
      return data.bankDetails;
    } catch (error) {
      console.log(error);
    }
  };
  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        personalData: data,
        openingBalan: openingBalanceTotal,
        data: cashList,
        totalDebit: calculateDebit(),
        totalCredit: calculateCredit(),
        totalClosing: totalClosing(),
        currentDate: sdate,
        oneMonthAgoDate: ldate,
      };
      let templates = bankTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  const downLoadPdf = async (templates: any) => {
    try {
      let templateContent = templates?.replace("\r\n", "");
      templateContent = templateContent?.replace('\\"', '"');
      const encodedString = btoa(templateContent);
      const pdf_url = API.PDF_GENERATE_URL;
      const pdfData = {
        filename: "Sales Invoice",
        html: encodedString,
        isDownload: true,
        sendEmail: false,
        type: "",
        userid: "",
      };
      const token = user.token;
      const response = await fetch(pdf_url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const pdfBlob = await response.arrayBuffer();
      const blob = new Blob([pdfBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bankdetails${moment(new Date()).format("DD-MM-YYYY")}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
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
    if (data.type === "Bank Transfer") {
      navigate(`/usr/cashBank/viewtransfer/${data?.data?.id}`);
    } else if (data.type === "Customer Receipt" || data?.type === "Customer Reciept") {
      navigate(`/usr/cashBank/customer-receipt/${data?.data?.id}/details`);
    } else if (data.type === "Other Receipt") {
      navigate(`/usr/cashBank/other-receipt/${data?.data?.id}/details`);
    } else if (data.type === "Supplier Refund") {
      navigate(`/usr/cashBank/supplier-refund/${data?.data?.id}/details`);
    } else if (data.type === "Supplier Payment") {
      navigate(`/usr/cashBank/supplier-payment/${data?.data?.id}/details`);
    } else if (data.type === "Other Payment") {
      navigate(`/usr/cashBank/other-payment/${data?.data?.id}/details`);
    } else if (data.type === "Customer Refund") {
      navigate(`/usr/cashBank/customer-refund/${data?.data?.id}/details`);
    } else if (data.type === "payroll") {
      console.log(data);
      // navigate(`/usr/payroll/paysheet/${data.payrollid}`)
    } else {
      
    }
  };
  const onRowPrepared = (e : any) => {
    if (e.rowType === 'data') {
      e.rowElement.style.cursor = 'pointer';
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
            showBorders={true}
            onExporting={(e) =>
              EXPORT(e, dataGridRef, "Bank Statement", customizeExportCell)
            }
            showRowLines={true}
            onRowPrepared={onRowPrepared}
            onRowDblClick={handleRowDoubleClick}
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
              // pageSize={take}
              // onPageIndexChange={(e) => onPageChange("page", e)}
              // onPageSizeChange={(e) => onPageChange("take", e)}
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
              caption="Status"
              alignment="center"
              cellRender={(item) => {
                const status =
                  item?.row?.data?.reconcile_status === 1 ? (
                    <span>
                      Reconciled
                      {/* <TiTick color="green" size={24} /> */}
                    </span>
                  ) : (
                    <span>
                      {/* <GoDash color="red" size={22} />
                      <GoDash color="red" size={22} /> */}
                      --------
                    </span>
                  );
                return <div className="table-title">{status}</div>;
              }}
            />
            <Column
              alignment={"center"}
              type="buttons"
              caption="Action"
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
                          OnEdit={() => props?.onEdit(data)}
                          OnDelete={() => handleOnDelete(data?.id)}
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
                    Total Transactions  : {data?.length}
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
              <Item>
                <Button onClick={() => generateTemplate("downLoad", {})}>
                  <MdFileDownload />
                </Button>{" "}
              </Item>

              <Item location="after" visible={true} name="exportButton" />
            </Toolbar>
            <Summary>
              <TotalItem
                column="type"
                summaryType="sum"
                alignment={"right"}
                valueFormat="currency"
                displayFormat={`Opening Balance : `}
              />
              <TotalItem
                column="type"
                displayFormat={`Current Total : `}
                alignment={"right"}
              />
              <TotalItem
                column="type"
                displayFormat={`Closing Balance : `}
                valueFormat="currency"
                alignment={"right"}
              />

              <TotalItem
                column="credit"
                summaryType="sum"
                alignment={"center"}
                displayFormat={"--"}
              />

              <TotalItem
                column="credit"
                displayFormat={currency + " " + calculateCredit()}
                alignment={"center"}
                valueFormat="currency"
              />
              <TotalItem
                column="credit"
                summaryType="sum"
                displayFormat={"--"}
                alignment={"center"}
                valueFormat="currency"
              />
              <TotalItem
                column="debit"
                summaryType="sum"
                alignment={"center"}
                cssClass={openingBalanceTotal >= 1 ? "green" : "red"}
                displayFormat={
                  openingBalanceTotal
                    ? currency + " " + openingBalanceTotal
                    : openingBankBalance
                    ? currency + " " + openingBankBalance
                    : "0.00"
                }
              />
              <TotalItem
                column="debit"
                summaryType="sum"
                displayFormat={currency + " " + calculateDebit()}
                alignment={"center"}
                valueFormat="currency"
              />
              <TotalItem
                column="debit"
                displayFormat={currency + " " + totalClosing()?.toFixed(2)}
                alignment={"center"}
                valueFormat="currency"
                cssClass={totalClosing() >= 1 ? "green" : "red"}
              />
            </Summary>
          </DataGrid>
        )}
      </Card>
    </>
  );
};
export default TransactionTable;
