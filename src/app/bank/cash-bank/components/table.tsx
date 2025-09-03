import { DatePicker, notification } from "antd";
import dayjs from "dayjs";
import DataGrid, {
  Column,
  Export,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBox from "../../../../components/loadingBox";
import API from "../../../../config/api";
import { GET, PUT } from "../../../../utils/apiCalls";
import { EXPORT } from "../../../../utils/exportData";

const BankTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [cashList, setCashList] = useState([]);
  const Dtoday = moment(new Date());
  const DoneMonthAgo = moment(new Date().setDate(1));
  const [sdate, setSdate] = useState(Dtoday.format("YYYY-MM-DD"));
  const [ldate, setLdate] = useState(DoneMonthAgo.format("YYYY-MM-DD"));
  const { user } = useSelector((state: any) => state.User);
  const { id, status } = useParams();
  const [reconciledDate, setReconciledDate] = useState<any>();

  let type = props?.type;
  const exportFormats = ["xlsx", "pdf"];
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  useEffect(() => {
    fetchTransactions(page, take, ldate, sdate);
  }, [page, take, ldate, sdate]);

  const fetchTransactions = async (
    page: Number,
    take: Number,
    ldate: any,
    sdate: any
  ) => {
    try {
      setIsLoading(true);
      let URL =
        "bank/listBankActivity/" +
        `${user?.id}/${id}/${ldate}/${sdate}?order=DESC&page=${page}&take=${take}${props?.status && `&bank=1`}`;
      const { data }: any = await GET(URL, null);
      if (data) {
        if (status == "1") {
          let filterData = data?.resList.filter((item: any) => {
            return item.reconcile_status == 1;
          });
          setCashList(filterData);
        } else {
          setCashList(data?.resList);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUpdate = async (date: any, id: any) => {
    let url = API.UPDATE_RECONCILE + id;
    let body;

    if (status == "1") {
      body = {
        reconcile_date: date,
        reconcile_status: date ? 0 : 1,
      };
    } else {
      body = {
        reconcile_date: date,
        reconcile_status: date ? 1 : 0,
      };
    }

    try {
      const data: any = await PUT(url, body);
      if (data?.status === true) {
        setReconciledDate(data?.data?.reconcile_date);
        notification.success({
          message: "Reconcile Date Updated",
          description: "Reconcile date updated successfully",
        });
        fetchTransactions(page, take, ldate, sdate);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateChange = (dateString: any, item: any) => {
    onUpdate(dateString, item?.row?.data?.id);
    fetchTransactions(page, take, ldate, sdate);
  };

  const handleDateRangeChange = (dates: any) => {
    fetchTransactions(
      page,
      take,
      dates ? dates[0].format("YYYY-MM-DD") : new Date(),
      dates ? dates[1].format("YYYY-MM-DD") : new Date()
    );
    setSdate(dates[1].format("YYYY-MM-DD"));
    setLdate(dates[0].format("YYYY-MM-DD"));
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

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <DataGrid
          ref={dataGridRef}
          dataSource={cashList}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "ledgers", customizeExportCell)
          }
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          remoteOperations={false}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
 />
          {props.columns.map((column: any, index: number) => {
            return (
              <Column
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={column.alignment}
              ></Column>
            );
          })}

          {type == "reconcile" && (
            <Column
              dataField="reconcile_date"
              caption="Reconcile Date"
              alignment="center"
              format="string"
              cellRender={(item) => {
                const currentDate = item?.data?.reconcile_date;
                const isDateValid = dayjs(currentDate).isValid();
                const momentDate = isDateValid ? dayjs(currentDate) : null;

                return (
                  <div className="table-title">
                    <DatePicker
                      // value={dayjs(momentDate)}
                      value={
                        momentDate && dayjs(momentDate).isValid()
                          ? dayjs(momentDate)
                          : null
                      }
                      format={"YYYY-MM-DD"}
                      onChange={(date, dateString) => {
                        handleDateChange(dateString, item);
                      }}
                    />
                  </div>
                );
              }}
            />
          )}

          {type === "reconcile" && (
            <Column
              dataField="reconcile_status"
              caption="Status"
              alignment="center"
              cellRender={(item) => {
                const status =
                  item?.row?.data?.reconcile_status === 1
                    ? "Reconciled"
                    : "--------";
                return <div className="table-title">{status}</div>;
              }}
            />
          )}

          {/* {type === "reconcile" && (
            <Column
              dataField="reconcile_status"
              caption="Reconcile"
              alignment="center"
              cellRender={(item) => {
                const status =
                  item?.row?.data?.reconcile_status === 1 ? (
                    <TiTick color="green" size={24} />
                  ) : (
                    <BsX color="red" size={24} />
                  );
                return <div className="table-title">{status}</div>;
              }}
            />
          )} */}
          <Paging defaultPageSize={take} />

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
                  {props.title}
                </div>
              </Item>
            )}
            {type === "reconiled"  && (
                <Item>
                  <DatePicker.RangePicker
                    defaultValue={[
                      dayjs(ldate, "YYYY-MM-DD"),
                      dayjs(sdate, "YYYY-MM-DD"),
                    ]}
                    onChange={handleDateRangeChange}
                  />
                </Item>
              )}

            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
          </Toolbar>
        </DataGrid>
      )}
    </>
  );
};

export default BankTable;
