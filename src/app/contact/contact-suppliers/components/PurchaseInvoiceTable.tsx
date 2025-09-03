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
  TotalItem,
  Summary,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { DatePicker, Popover, } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import ViewPopover from "../../components/viewPopover";
import { EXPORT } from "../../../../utils/exportData";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
const PurchaseInvoiceTable = (props: any) => {
  const {t} = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const currency = user?.companyInfo?.countryInfo?.symbol;
  const location = useLocation()


  const columns = [
    {
      caption: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
      },
    {
      dataField: "date",
      caption: t("home_page.homepage.Date"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {moment(data?.date).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      dataField: "invoiceno",
      caption: "Invoice No",
    },
    {
      dataField: "type",
      caption: t("home_page.homepage.Voucher_Type"),
      cellRender: ({ data }: any) => (
        <div className="d-flex justify-content-center">
          {data.type === "Journal"
            ? "Journal"
            : data?.type === "stockassets" 
            ? "Purchase For Asset"
            : data.type}
        </div>
      ),
    },
    {
      dataField:"reference",
      caption:"Reference",
    },

    {
      dataField: "paidmethod",
      caption: t("home_page.homepage.Particulars"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
        {data?.type === "Sales Invoice"
          ? "Sales"
          : data?.type === "Purchase Invoice"
          ? "Purchase"
          : data?.type === "stockassets" 
          ? "Purchase For Asset"
          : data?.type === "Credit Notes"
          ? "Sales Credit Note"
          : data?.type === "Debit Notes"
          ? "Purchase Debit Note"
          : data?.type === "Journal"
          // ? data?.ledgerAccount.join(', ') 
          ?  data?.ledgerAccount.map((item:any)=>(<div>{item}</div>)) 
          : data?.itemDetails?.laccount}
      </div>
      ),
    },
    {
      dataField: "debit",
      caption: t("home_page.homepage.Debit"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.debit}</div>
      ),
    },
    {
      dataField: "credit",
      caption: t("home_page.homepage.Credit"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.credit}</div>
      ),
    },
    {
      dataField: "",
      caption: "Balance",
      cellRender: ({ data, rowIndex }: any) => {
        const transactions = props.list; 
        let balance = Math.abs(props?.openingBalance);
        for (let i = 0; i <= rowIndex; i++) {
          const debitValue = parseFloat(transactions[i].debit) || 0;
          const creditValue = parseFloat(transactions[i].credit) || 0;
          balance += creditValue;
          balance -= debitValue;
        }
        const formattedBalance = balance >= 0 
          ? `${balance} Cr.` 
          : `${Math.abs(balance)} Dr.`;
    
        return <div>{formattedBalance}</div>;
      }
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
                    if (data?.type == "Journal") {
                      navigate(`/usr/journal/details/${data?.journalid}`);
                    } else if (data?.type == "Sales Invoice") {
                      navigate(`/usr/sale-invoice-view/${data?.id}`);
                    } else if (data.type === "Purchase Invoice") {
                      navigate(`/usr/purchase-invoice-view/${data.id}`);
                    } else if (data.type === "Credit Notes") {
                      navigate(`/usr/salesCredit/view/${data.id}`);
                    } else if (data.type === "Debit Notes") {
                      navigate(`/usr/purchace-debitnote-view/${data.id}`);
                    } else if(data.type === "stockassets"){
                      navigate(`/usr/purchase-fore-assets`)
                    }

                    //bank
                    else if (data.type === "Supplier Payment") {
                      // && bankid != null
                      navigate(
                        `/usr/cashBank/supplier-payment/${data?.id}/details`
                      );
                    } else if (data.type === "Other Payment") {
                      navigate(
                        `/usr/cashBank/other-payment/${data?.id}/details`
                      );
                    } else if (
                      data.type === "Customer Refund" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/customer-refund/${data?.id}/details`
                      );
                    } else if (data.type === "Supplier Refund") {
                      navigate(
                        `/usr/cashBank/supplier-refund/${data.id}/details`
                      );
                    } else if (data.type === "Customer Reciept") {
                      navigate(
                        `/usr/cashBank/customer-receipt/${data.id}/details`
                      );
                    } else if (data.type === "Other Receipt") {
                      navigate(
                        `/usr/cashBank/other-receipt/${data.id}/details`
                      );
                    }

                    // cash
                    else if (data.paidmethod === "cash") {
                      navigate(`/usr/cash/view/${data.id}/${data.ledger}`);
                    } else {
                      navigate(location.pathname);
                    }
                  }}
                  OnEdit={() => {
                    if (data.type === "Journal") {
                      navigate(`/usr/journal/edit/${data?.journalid}`);
                    } else if (data.type === "Sales Invoice") {
                      navigate(`/usr/sale-invoice-form/${data.id}`);
                    } else if (data.type === "Purchase Invoice") {
                      navigate(`/usr/purchace-invoice-form/update/${data.id}`);
                    }else if(data.type === "stockassets"){
                      navigate(`/usr/purchase-asset-form/${data?.id}/${1}`);
                    } else if (data.type === "Credit Notes") {
                      navigate(`/usr/salesCredit/edit/${data.id}`);
                    } else if (data.type === "Debit Notes") {
                      navigate(
                        `/usr/salesCredit/edit/${data.id}`
                      );
                    } else if (
                      data.type === "Supplier Payment" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/purchasepayment/supplier/${data?.id}`
                      );
                    } else if (
                      data.type === "Other Payment" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/purchasepayment/other/${data?.id}`
                      );
                    } else if (
                      data.type === "Customer Refund" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/purchasepayment/customer/${data?.id}`
                      );
                    } else if (
                      data.type === "Supplier Refund" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/salesreciept/supplier-refund/${data?.id}`
                      );
                    } else if (
                      data.type === "Customer Reciept" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/salesreciept/customer/${data?.id}`
                      );
                    } else if (
                      data.type === "Other Receipt" &&
                      data.paidmethod !== "cash"
                    ) {
                      navigate(
                        `/usr/cashBank/${data?.ledger}/details/salesreciept/other/${data?.id}`
                      );
                    }

                    // cash
                    else if (
                      data.paidmethod === "cash" &&
                      data.type === "Supplier Payment"
                    ) {
                      navigate(
                        `/usr/cash/purchacepayment/${data.ledger}/${data.id}/supplier-payment`
                      );
                    } else if (
                      data.paidmethod === "cash" &&
                      data.type === "Other Payment"
                    ) {
                      navigate(
                        `/usr/cash/purchacepayment/${data.ledger}/${data.id}/other-payment`
                      );
                    } else if (
                      data.paidmethod === "cash" &&
                      data.type === "Customer Refund"
                    ) {
                      navigate(
                        `/usr/cash/purchacepayment/${data.ledger}/${data.id}/customer-refund`
                      );
                    } else if (
                      data.paidmethod === "cash" &&
                      data.type === "Customer Receipt"
                    ) {
                      navigate(
                        `/usr/cash/salesreceipt/${data.ledger}/${data.id}/customer-receipt`
                      );
                    } else if (
                      data.paidmethod === "cash" &&
                      data.type === "Other Receipt"
                    ) {
                      navigate(
                        `/usr/cash/salesreceipt/${data.ledger}/${data.id}/other-receipt`
                      );
                    } else if (
                      data.paidmethod === "cash" &&
                      data.type === "Supplier Refund"
                    ) {
                      navigate(
                        `/usr/cash/salesreceipt/${data.ledger}/${data.id}/supplire-refund`
                      );
                    } else {
                      navigate(location.pathname);
                    }
                  }}
                  // OnDelete={() => {
                  //   props.handleDelete(data?.id);
                  // }}
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

  function calculateDebit() {
    const total = props.list?.reduce((acc: any, obj: any) => {
      return acc + Number(obj.debit);
    }, 0);
    props?.setTotalDebit(total?.toFixed(2))
    return total?.toFixed(2);
  }

  function calculateCredit() {
    const total = props.list?.reduce((acc: any, obj: any) => {
      return acc + Number(obj.credit);
    }, 0);
    props?.setTotalCredit(total?.toFixed(2))
    return total?.toFixed(2);
  }

  function totalClosing(rows: any) {
    let calcDebitTotal = calculateDebit();
    let calcCreditTotal = calculateCredit();
    let total = props?.openingBalance + (calcCreditTotal - calcDebitTotal);
    props?.setTotalClosing(total?.toFixed(2))
    return total?.toFixed(2);
  }
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
   const handleRowDoubleClick =(record:any)=>{
    if (record?.data?.type == "Journal") {
      navigate(`/usr/journal/details/${record?.data?.journalid}`);
    } else if (record?.data?.type == "Sales Invoice") {
      navigate(`/usr/sale-invoice-view/${record?.data?.id}`);
    } else if (record?.data.type === "Purchase Invoice") {
      navigate(`/usr/purchase-invoice-view/${record?.data.id}`);
    } else if (record?.data.type === "Credit Notes") {
      navigate(`/usr/salesCredit/view/${record?.data.id}`);
    } else if (record?.data.type === "Debit Notes") {
      navigate(`/usr/purchace-debitnote-view/${record?.data.id}`);
    } else if(record?.data.type === "stockassets"){
      navigate(`/usr/purchase-fore-assets`)
    }

    //bank
    else if (record?.data.type === "Supplier Payment") {
      // && bankid != null
      navigate(
        `/usr/cashBank/supplier-payment/${record?.data?.id}/details`
      );
    } else if (record?.data.type === "Other Payment") {
      navigate(
        `/usr/cashBank/other-payment/${record?.data?.id}/details`
      );
    } else if (
      record?.data.type === "Customer Refund" &&
      record?.data.paidmethod !== "cash"
    ) {
      navigate(
        `/usr/cashBank/customer-refund/${record?.data?.id}/details`
      );
    } else if (record?.data.type === "Supplier Refund") {
      navigate(
        `/usr/cashBank/supplier-refund/${record?.data.id}/details`
      );
    } else if (record?.data.type === "Customer Reciept") {
      navigate(
        `/usr/cashBank/customer-receipt/${record?.data.id}/details`
      );
    } else if (record?.data.type === "Other Receipt") {
      navigate(
        `/usr/cashBank/other-receipt/${record?.data.id}/details`
      );
    }

    // cash
    else if (record?.data.paidmethod === "cash") {
      navigate(`/usr/cash/view/${record?.data.id}/${record?.data.ledger}`);
    } else {
      navigate(location.pathname);
    }
   }
   const onRowPrepared = (e : any) => {
    if (e.rowType === 'data') {
      e.rowElement.style.cursor = 'pointer';
    }
  };
  return (
    <div className="customer-table">
      <DataGrid
        ref={dataGridRef}
        dataSource={props?.list}
        columnAutoWidth={true}
        showBorders={true}
        onRowPrepared={onRowPrepared}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "Supplierdetails", customizeExportCell)
        }
        onSelectionChanged={handleOptionChanged}
        onRowDblClick={handleRowDoubleClick}
        showColumnLines={true}
        showRowLines={true}
        style={{ textAlign: "center" }}
        searchPanel={{
          visible: true,
          width: 240,
          placeholder: "Search here",
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
            fixed={column?.fixed || undefined}
            fixedPosition={column?.fixedPosition || undefined}
            cellRender={column.cellRender}
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
              <div style={{ fontSize: "17px", fontWeight: 600 }}>
                {selectedRows}{t("home_page.homepage.selected")} 
              </div>
            </Item>
          ) : (
            <Item location="before" visible={true}>
              <div style={{ fontSize: "20px", fontWeight: 600 }}>{t("home_page.homepage.Details")}</div>
            </Item>
          )}
          <Item>
            <DatePicker.RangePicker
              defaultValue={[
                dayjs(props?.currentDate, "YYYY-MM-DD"),
                dayjs(props?.oneMonthAgoDate, "YYYY-MM-DD"),
              ]}
              onChange={props?.handleDateRangeChange}
            />
          </Item>
          <Item name="searchPanel" />
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
            column="debit"
            summaryType="sum"
            alignment={"center"}
            valueFormat="currency"
            displayFormat={props?.openingBalance >= 0 ? currency + " " + (props?.openingBalance).toFixed(2) : '-'}
          />
          <TotalItem
            column="credit"
            alignment={"center"}
            displayFormat={props?.openingBalance < 0 ? currency + " " + (props?.openingBalance).toFixed(2) : '-'}
          />
          <TotalItem
            column="credit"
            summaryType="sum"
            displayFormat={currency + " " + calculateCredit()}
            alignment={"center"}
            valueFormat="currency"
          />
          <TotalItem
            column="debit"
            displayFormat={currency + " " + calculateDebit()}
            alignment={"center"}
            valueFormat="currency"
          />
          <TotalItem
            column="debit"
            summaryType="sum"
            displayFormat={totalClosing(props.list) < 0 ? currency + " " + Math.abs(totalClosing(props.list)) : '-'}
            alignment={"center"}
            valueFormat="currency"
          />
          <TotalItem
            column="credit"
            displayFormat={
              totalClosing(props.list) >= 0
                ? currency + " " + Math.abs(totalClosing(props.list))
                : "-"
            }
            alignment={"center"}
            valueFormat="currency"
          />
        </Summary>
      </DataGrid>
    </div>
  );
};
export default PurchaseInvoiceTable;
