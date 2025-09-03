import React, { useRef, useState } from "react";
import DataGrid, {
  Column,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Summary,
  Toolbar,
  Item,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { DatePicker} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { EXPORT } from "../../../utils/exportData";
import { useTranslation } from "react-i18next";
const StatementTable = (props: any) => {
  const {t} = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const { user } = useSelector((state: any) => state.User);
  const currency = user?.companyInfo?.countryInfo?.symbol;

  const columns = [
    {
      name: "id",
      caption:t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "userdate",
      caption: t("home_page.homepage.Date"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {moment(data?.userdate).format("DD-MM-YYYY")}
        </div>
      ),
    },
    
    {
      dataField: "paidmethod",
      caption: t("home_page.homepage.Particulars"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.oppositeLedger}
        </div>
      ),
    },
    {
      dataField: "type",
      caption: t("home_page.homepage.Voucher_Type"),
      cellRender: ({ data }: any) => (
        <div className="d-flex justify-content-center">
          {data.type === "Journal"
            ? "Journal"
            : data?.type === "stockassets" 
            ? "Purchase Invoice"
            : data.type}
        </div>
      ),
    },
    {
      dataField: "debit",
      caption: t("home_page.homepage.Debit"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data.debit}</div>
      ),
    },
    {
      dataField: "credit",
      caption: t("home_page.homepage.Credit"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data.credit}</div>
      ),
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
    // if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
    //   props.onPageChange(page, take);
    // }
  };

  const calculateDebit = () => {
    const total = props.list?.reduce((acc: any, obj: any) => {
      return acc + Number(obj.debit);
    }, 0);
    return total;
  }

  const calculateCredit = () => {
    const total = props.list?.reduce((acc: any, obj: any) => {
      return acc + Number(obj.credit);
    }, 0);
    return total;
  }

  const totalClosingBalance = () => {
    let calcDebitTotal = calculateDebit();
    let calcCreditTotal = calculateCredit();
    let total = props?.openingBalance + (calcCreditTotal - calcDebitTotal);
    return total;
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

  const handleDateRangeChange = (dates: any) => {
    props?.setFirstDate(dates[0]);
    props?.setCurrentDate(dates[1]);
    props?.fetchLedgerDetails(dates[0], dates[1]);
  };

  return (
      <DataGrid
        ref={dataGridRef}
        dataSource={props?.list}
        columnAutoWidth={true}
        showBorders={true}
        onExporting={(e) =>
          EXPORT(e, dataGridRef, "ledger-details", customizeExportCell)
        }
        // onExporting={(e) => EXPORT(e, dataGridRef, props?.name,() =>{})}
        onOptionChanged={handleOptionChanged}
        showRowLines={true}
        onSelectionChanged={onSelectionChanged}
        showColumnLines={true}
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
        {columns.map((column, index) => (
          <Column
            key={index}
            dataField={column.dataField}
            caption={column.caption}
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
                <h4>{props?.title}</h4>
              </div>
            </Item>
          )}
          <Item>
            <DatePicker.RangePicker
              format={"YYYY-MM-DD"}
              defaultValue={[
                dayjs(props?.firstDate, "YYYY-MM-DD"),
                dayjs(props?.currentDate, "YYYY-MM-DD"),
              ]}
              onChange={handleDateRangeChange}
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
            displayFormat={
              props?.openingBalance <= 0
                ? currency + " " + Math.abs((props?.openingBalance))
                : "-"
            }
          />
          <TotalItem
            column="credit"
            alignment={"center"}
            displayFormat={
              props?.openingBalance > 0
                ? currency + " " + Math.abs((props?.openingBalance))
                : "-"
            }
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
            displayFormat={
              totalClosingBalance() < 0
                ? currency + " " + Math.abs(totalClosingBalance())
                : "-"
            }
            alignment={"center"}
            valueFormat="currency"
          />
          <TotalItem
            column="credit"
            displayFormat={
              totalClosingBalance() >= 0
                ? currency + " " + Math.abs(totalClosingBalance())
                : "-"
            }
            alignment={"center"}
            valueFormat="currency"
          />
        </Summary>
      </DataGrid>
  );
};
export default StatementTable;
