import { Card, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import DataGrid, {
  Column,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useTranslation } from "react-i18next";
import LoadingBox from "../../../components/loadingBox";


const TrialTable = ({ trialbalance, setFirstDate, setCurrentDate,
  firstDate, currentDate, isLoading
}: any) => {
  const dataGridRef: any = useRef(null);
  const { user } = useSelector((state: any) => state.User);
  const currency = user?.companyInfo?.countryInfo?.symbol;
  const [selectedPeriod, setSelectedPeriod] = useState( );
  const { t } = useTranslation();

  const year = moment(new Date()).format("YYYY");
  const FirstQuater: any = [
    moment(user?.companyInfo?.tax === "gst" ?`${year}-04-01`:`${year}-01-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(user?.companyInfo?.tax === "gst" ? `${year}-06-30`:`${year}-03-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const SecondQuater: any = [
    moment(user?.companyInfo?.tax === "gst" ?`${year}-07-01`:`${year}-04-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(user?.companyInfo?.tax === "gst" ?`${year}-9-30`:`${year}-06-30`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const ThirdQuater: any = [
    moment(user?.companyInfo?.tax === "gst" ?`${year}-10-01`:`${year}-07-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(user?.companyInfo?.tax === "gst" ?`${year}-12-31`:`${year}-09-30`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];
  const FourthQuater: any = [
    moment(user?.companyInfo?.tax === "gst" ?`${year}-01-01`:`${year}-10-01`, "YYYY-MM-DD").format("YYYY-MM-DD"),
    moment(user?.companyInfo?.tax === "gst" ? `${year}-03-31`:`${year}-12-31`, "YYYY-MM-DD").format("YYYY-MM-DD"),
  ];


  const handleDateRangeChange = (dates: any) => {
    setFirstDate(dates[0]);
    setCurrentDate(dates[1]);
  };

  const columns = [
    {
      dataField: "nominalcode",
      title: t("home_page.homepage.Nominal_Code"),
    },
    {
      dataField: "laccount",
      title: t("home_page.homepage.Name"),
    },
    {
      dataField: "debit",
      title: t("home_page.homepage.Debit"),
      cellRender: ({ data }: any) => Math.abs(data.debit),
    },
  
    {
      dataField: "credit",
      title: t("home_page.homepage.Credit"),
      cellRender: ({ data }: any) => Math.abs(data.credit),
    },
  ];
  

  const calculateTotalDebit = () => {
    if (!trialbalance?.ledgers) return 0;
    const totalDebit = trialbalance.ledgers.reduce((total: any, ledger: any) => {
      return total + Math.abs(ledger.debit);
    }, 0);
    return totalDebit.toFixed(2)
  };
  const calculateTotalCredit = () => {
    if (!trialbalance?.ledgers) return 0;

    const totalCredit = trialbalance.ledgers.reduce(
      (total: any, ledger: any) => {
        return total + Math.abs(ledger.credit);
      },
      0
    );
    return totalCredit.toFixed(2);
  };


  const OnPeriodChange = (period: any) => {
    if (period?.children === "First Quarter") {
      setFirstDate(FirstQuater[0])
      setCurrentDate(FirstQuater[1])
    } else if (period?.children === "Second Quarter") {
      setFirstDate(SecondQuater[0])
      setCurrentDate(SecondQuater[1])
    } else if (period?.children === "Third Quarter") {
      setFirstDate(ThirdQuater[0])
      setCurrentDate(ThirdQuater[1])
    } else if (period?.children === "Fourth Quarter") {
      setFirstDate(FourthQuater[0])
      setCurrentDate(FourthQuater[1])
    }
  };
  return (
    <>

      <br />
      { isLoading ? <LoadingBox/> :
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={trialbalance?.ledgers}
          columnAutoWidth={true}
          showBorders={true}
          showRowLines={true}
          showColumnLines={true}
          searchPanel={{
            visible: true,
            width: 280,
            placeholder: "Search Here..",
          }}
        >
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
 />
          {columns?.map((column: any, index: number) => {
            return (
              <Column
                key={index}
                dataField={column.dataField}
                caption={column.title}
                cellRender={column.cellRender}
                alignment="center"
              ></Column>
            );
          })}
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            allowedPageSizes={[10, 20, 30]}
            displayMode={"compact"}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />

          <Toolbar>

            <Item location="before" visible={true} >
              {/* <div className="formLabel">Period</div> */}
              <Select
                size="large"
                allowClear
                style={{ width: "150px" }}
                value={selectedPeriod}
                defaultValue={"Custom"}
                onChange={(val: any, data: any) => {
                  setSelectedPeriod(val);
                  OnPeriodChange(data)
                }
                }
              >
                {[
                  "Custom",
                  "First Quarter",
                  "Second Quarter",
                  "Third Quarter",
                  "Fourth Quarter",

                ].map((item: any, i: any) => (
                  <Select.Option value={item} key={i}>{item}</Select.Option>
                ))}
              </Select>
            </Item>
            <Item location="before" visible={true}>
              {/* <div className="formLabel">From - To</div> */}
              <DatePicker.RangePicker
                allowClear
                defaultValue={[
                  dayjs(firstDate, "YYYY-MM-DD"),
                  dayjs(currentDate, "YYYY-MM-DD"),
                ]}
                format={"YYYY-MM-DD"}
                onCalendarChange={(val: any) => {
                  handleDateRangeChange(val);
                }}
                size="large"
              />

            </Item>

            <Item name="searchPanel" location="after" />

          </Toolbar>
          <Summary>
            <TotalItem
              column="laccount"
              displayFormat="Total : "
              valueFormat="currency"
              alignment="center"
            />
            <TotalItem
              column="debit"
              summaryType="sum"
              valueFormat="currency"
              displayFormat={currency + " " + calculateTotalDebit()}
              alignment="center"
            />
            <TotalItem
              column="credit"
              summaryType="sum"
              valueFormat="currency"
              displayFormat={currency + " " + calculateTotalCredit()}
              alignment="center"
            />
          </Summary>
        </DataGrid>
      </Card>

              }
    </>
  );
};

export default TrialTable;
