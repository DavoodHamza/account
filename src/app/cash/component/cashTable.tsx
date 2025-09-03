import { useEffect, useRef, useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Button, Card, DatePicker, Popover, notification } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import columns from "./columns.json";
import { GET } from "../../../utils/apiCalls";
import moment from "moment";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import { IoMdMailOpen, IoMdSend } from "react-icons/io";
import { CiBank } from "react-icons/ci";
import LoadingBox from "../../../components/loadingBox";
import BankTransfer from "./form/contraVoucher";
import ActionPopover from "./actionPopover";
import { EXPORT } from "../../../utils/exportData";
import dayjs from "dayjs";
import API from "../../../config/api";
import ".././styles.scss";
import { MdFileDownload } from "react-icons/md";
import { CashTemplate } from "./template";
import { useTranslation } from "react-i18next";
const CashTable = () => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const { user } = useSelector((state: any) => state.User);
  const { id } = useParams();
  const navigate = useNavigate();
  const Dtoday = moment().endOf("month");
  const DoneMonthAgo = moment(new Date().setDate(1));
  const [selectedRows, setSelectedRows] = useState();
  const [cashList, setCashList] = useState<any>([]);
  const [openingBalanceDebit, setOpeningBalanceDebit] = useState(0);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sdate, setSdate] = useState(Dtoday.format("YYYY-MM-DD"));
  const [ldate, setLdate] = useState(DoneMonthAgo.format("YYYY-MM-DD"));
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [balance, setBalance] = useState<any>();
  const currency = user?.companyInfo?.countryInfo?.symbol;
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [closingBalance, setClosingBalance] = useState();
  const [openingBalance, setOpeningBalance] = useState<any>();
  const location = useLocation();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];

  const reLoadApis = async () => {
    setIsLoading(true);
    setCashList([]);
    await fetchBankDetails();
    await loadCashPage(page, take, ldate, sdate);
  };

  const loadCashPage = async (
    page: Number,
    take: Number,
    ldate: any,
    sdate: any
  ) => {
    try {
      setIsLoading(true);
      let URL =
        "bank/cashList/" +
        `${user?.id}/${id}/${ldate}/${sdate}?order=DESC&page=${page}&take=${take}`;
      const { data, status }: any = await GET(URL, null);
      if (status) {
        setCashList(data?.resList);
        let balances = await fetchBankDetails();
        let totalOpening =
          Number(data?.openingBalance) + Number(balances.opening);
        setOpeningBalance(Number(data?.openingBalance));
        setOpeningBalanceDebit(totalOpening);
      } else {
        setOpeningBalance(data?.openingBalance);
        setCashList([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCashPage(page, take, ldate, sdate);
  }, [page, take, ldate, sdate]);

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

  const handleDateRangeChange = (dates: any) => {
    loadCashPage(
      page,
      take,
      dates ? dates[0].format("YYYY-MM-DD") : new Date(),
      dates ? dates[1].format("YYYY-MM-DD") : new Date()
    );
    setSdate(dates[1].format("YYYY-MM-DD"));
    setLdate(dates[0].format("YYYY-MM-DD"));
  };

  const handleOk = () => {
    setModalVisible(false);
    reLoadApis();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const showModal = () => {
    setModalVisible(true);
  };
  const popoverContent = (
    <Row>
      <Col
        xs={12}
        className="Normal-Font"
        onClick={() => navigate(`/usr/cash/salesreceipt/${id}/create`)}
        style={{cursor:"pointer"}}
      >
        <IoMdMailOpen size={20} color={"#6c757d"} />
        <span style={{ marginLeft: 4 }}>
        {t("home_page.homepage.Reciepts")}
        </span>
      </Col>
      <Col
        xs={12}
        className="Normal-Font"
        onClick={() => navigate(`/usr/cash/purchacepayment/${id}/create`)}
        style={{cursor:"pointer"}}
      >
        <IoMdSend size={20} color={"#6c757d"} />
        <span style={{ marginLeft: 4 }}>
        {t("home_page.homepage.Receipts")}
        </span>
      </Col>
      <Col xs={12} className="Normal-Font" onClick={showModal} style={{cursor:"pointer"}}>
      <CiBank size={20} color={"#6c757d"} />
      <span style={{ marginLeft: 4 }}>
      {t("home_page.homepage.Bank_Transfer")}
      </span> 
      </Col>
    </Row>
  );

  function calculateCredit() {
    const total = cashList?.reduce((acc: any, obj: any) => {
      return acc + Number(obj?.credit);
    }, 0);
    return total?.toFixed(2);
  }
  function calculateDebit() {
    const total = cashList?.reduce((acc: any, obj: any) => {
      return acc + Number(obj?.debit);
    }, 0);
    return total?.toFixed(2);
  }
  function totalClosing() {
    let calcDebitTotal = calculateDebit();
    let calcCreditTotal = calculateCredit();
    let total = calcDebitTotal - calcCreditTotal;
    return Number(total) + openingBalance;
  }

  const customizeExportCell = () => {
    return "Cash Statement";
  };
  const fetchBankDetails = async () => {
    try {
      const bank_url = API.GET_BANK_DETAILS + `${id}/${user?.id}`;
      const { data }: any = await GET(bank_url, null);
      setClosingBalance(data.openingBalance);
      setBalance(data.bankDetails);
      setOpeningBalanceDebit(Number(data.bankDetails.opening));
      return data.bankDetails;
    } catch (error) {
      console.log(error);
    }
  };

  const adjustDateWithOffset = (dateString:any) => {
    const originalDate = moment(dateString);
    const adjustedDate = originalDate.add(5, 'hours').add(30, 'minutes');
    return adjustedDate.format('DD-MM-yyyy');
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        data: cashList,
        totalDebit: calculateDebit(),
        totalCredit: calculateCredit(),
        totalClosing: totalClosing(),
        openingBalanceDebit: openingBalanceDebit,
        currentDate: sdate,
        oneMonthAgoDate: ldate,
      };
      let templates = CashTemplate(obj);
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
      a.download = `Cashdetails${moment(new Date()).format("DD-MM-YYYY")}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <>
      <PageHeader
        firstPathLink={"/usr/cash"}
        firstPathText={t("home_page.homepage.Cash")}
        secondPathText={t("home_page.homepage.CashTable")}
        goback={-1}
        title={t("home_page.homepage.CashTransaction")}
        thirdPathText={t("home_page.homepage.CashTransaction")}
        thirdPathLink={location.pathname}
        children={
          <div className="table-BtnBox">
            <Popover
              content={popoverContent}
              trigger="click"
              overlayStyle={{ width: "220px" }}
              placement="bottom"
              arrow={false}
            >
              <Button type="primary">
                +{t("home_page.homepage.MoreOptions")}
              </Button>
            </Popover>
          </div>
        }
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Row>
            <Col md="6">
              <Card>
                <h5
                  className=""
                  style={{
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    color: "gray",
                  }}
                >
                  {t("home_page.homepage.AvailableBalance")}
                  <span>
                    {Number(closingBalance) || 0} {currency}
                  </span>
                </h5>
              </Card>
            </Col>
            <Col md="6" />
          </Row>
          <br />
          <Card>
            <DataGrid
              ref={dataGridRef}
              dataSource={cashList}
              columnAutoWidth={true}
              showBorders={true}
              showRowLines={true}
              remoteOperations={false}
              onExporting={(e) =>
                EXPORT(e, dataGridRef, "Cash Statement", () =>
                  customizeExportCell()
                )
              }
              onSelectionChanged={onSelectionChanged}
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
              {columns.map((column: any, index: number) => {
                return (
                  <Column
                    dataField={column.name}
                    caption={column.title}
                    dataType={column.dataType}
                    format={column.format}
                    alignment={column.alignment}
                    cellRender={column.name === 'sdate' ? 
                      ({ value }) => adjustDateWithOffset(value) :
                      undefined
                    }
                  ></Column>
                );
              })}

              <Paging
                defaultPageSize={take}
                pageSize={take}
                // onPageIndexChange={(e) => onPageChange("page", e)}
                // onPageSizeChange={(e) => onPageChange("take", e)}
              />
              <Pager
                visible={true}
                allowedPageSizes={[10, 20, 30, 50, 100]}
                displayMode={"compact"}
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
              />
              <Column
                alignment={"center"}
                type="buttons"
                caption="Action"
                width={110}
                cellRender={(item) => {
                  return (
                    <div className="table-title">
                      <ActionPopover
                        reLoadaApis={reLoadApis}
                        data={item}
                        id={id}
                      />
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
                    <div style={{ fontSize: "17px", fontWeight: 600 }}>
                      {selectedRows}
                      {t("home_page.homepage.selected")}
                    </div>
                  </Item>
                ) : (
                  <Item location="before" visible={true}>
                    <div style={{ fontSize: "17px", fontWeight: 600 }}>
                      {t("home_page.homepage.TotalTransactions")} :{" "}
                      {cashList?.length}
                    </div>
                  </Item>
                )}
                <Item location="after">
                  <DatePicker.RangePicker
                    defaultValue={[
                      dayjs(ldate, "YYYY-MM-DD"),
                      dayjs(sdate, "YYYY-MM-DD"),
                    ]}
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
                  column="debit"
                  summaryType="sum"
                  alignment={"center"}
                  displayFormat={"."}
                />

                <TotalItem
                  column="credit"
                  summaryType="sum"
                  alignment={"center"}
                  cssClass={openingBalanceDebit >= 1 ? "green" : "red"}
                  displayFormat={
                    openingBalance ? currency + " " + openingBalance : "0.00"
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
                  displayFormat={"."}
                  alignment={"center"}
                  valueFormat="currency"
                />
                <TotalItem
                  column="credit"
                  displayFormat={currency + " " + totalClosing()?.toFixed(2)}
                  alignment={"center"}
                  valueFormat="currency"
                  cssClass={totalClosing() >= 1 ? "green" : "red"}
                />
              </Summary>
            </DataGrid>
          </Card>
          <BankTransfer
            modalVisible={modalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
            id={id}
            type={"create"}
          />
        </Container>
      )}
    </>
  );
};

export default CashTable;
