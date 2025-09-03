import { Button, Card, Popover, Tag, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { GET, POST } from "../../utils/apiCalls";
import ViewPopover from "../../components/viewPopover";
import { BsThreeDotsVertical } from "react-icons/bs";
import PageHeader from "../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { IoMdMailOpen } from "react-icons/io";
import ReceiptModal from "./components/ReceiptModal";
import moment from "moment";
import { useSelector } from "react-redux";
import StatementTable from "../staff/components/statementTable";
import LoadingBox from "../../components/loadingBox";
import ClosePayment from "./components/closePayment";
import dayjs from "dayjs";
import API from "../../config/api";

const StaffTransaction = () => {
  const columns = [
    // {
    //   name: "invoiceno",
    //   title: "Invoice No.",
    //   dataType: "string",
    //   alignment: "center",
    // },
    {
      name: "created_at",
      title: "Date",
      dataType: "date",
      alignment: "center",
      cellRender: ({ data }: any) => moment(data?.created_at).format("YYYY-MM-DD"),
    },
    {
      name: "type",
      title: "Voucher Type",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "",
      title: "Amount",
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.paid_amount,
    },
    // {
    //   name: "outstanding",
    //   title: "Outstanding",
    //   dataType: "string",
    //   alignment: "center",
    // },
    {
      name: "paid_status",
      title: "Paid Status",
      alignment: "center",
      cellRender: ({ data }: any) => (
        <Tag
          color={
            data?.paid_status === 0
              ? "#B71C1C"
              : data?.paid_status === 1
                ? "#E65100"
                : "#1B5E20"
          }
        >
          {data?.paid_status === 0
            ? "Unpaid"
            : data?.paid_status === 1
              ? "Part paid"
              : "Paid"}
        </Tag>
      ),
    },
    {
      name: "status",
      title: "Status",
      alignment: "center",
      cellRender: ({ data }: any) => (
        <Tag color={data?.status === "open" ? "red" : "lightGreen"}>
          {data?.status}
        </Tag>
      ),
    },
    {
      name: "id",
      title: "Action",
      dataType: "string",
      cellRender: ({ data }: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <ViewPopover
                  onView={() => {
                    navigate(`/usr/staff-transaction/details/${data?.id}`);
                  }}
                  OnEdit={
                    () => {
                      data?.type === "Other Receipt" ? setReceiptUpdateModal(true) : setPaymentUpdateModal(true)
                      setId(data?.id)
                    }
                  }
                // OnDelete={() => {
                //   // handleDelete(data?.data?.id);
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
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [receiptUpdateModal, setReceiptUpdateModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentUpdateModal, setPaymentUpdateModal] = useState(false);
  const [closePaymentModal, setClosePaymentModal] = useState(false);
  const [onFilter, setOnFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState<any>([])
  const [list, setList] = useState<any>();
  const [id, setId] = useState<any>();
  const today = new Date();
  const startDay = moment(new Date(today.setDate(1))).format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [firstDate, setFirstDate] = useState(startDay);
  const [ledgerList, setLedgerList] = useState<any>([]);
  const [bankList, setBankList] = useState<any>()

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);

  const fetchStaffTransactionList = async () => {
    try {
      setIsLoading(true);
      let obj = {
        status: onFilter,
        query: query,
        sDate: firstDate,
        lDate: currentDate,
        adminId: user?.id,
        companyid: user?.companyInfo?.id,
        staffid:user?.staff?.id,
        page: 1,
        take: 10
      }
      let url = `StaffTransactions/list`;
      const response: any = await POST(url, obj);
      if (response?.status) {
        setList(response.datas);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchStaffTransactionList();
  }, [firstDate, currentDate, onFilter, query]);


  const handleSelectedData = (val: any) => {
    const closedData = val.filter((item: any) => item.status === 'closed')
    if (closedData.length) {
      notification.error({
        message: "Please select open transactions only"
      })
    } else {
      setSelectedRow(val);
    }
  }

  const fetchLedgers = async () => {
    try {
      const url = API.GET_MY_LEDGERS + user?.id + '/' + user?.companyInfo?.id
      const { data }: any = await GET(url, null);
      setLedgerList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url = API.GET_BANK_LIST + user?.id + '/' + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);

      setBankList(data?.list);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers()
    fetchBankList()
  }, [])

  const onValuesChange = (val: any) => {
    if (val.dateRange) {
      let d1: any = dayjs(val.dateRange[0], "YYYY-MM-DD");
      let d2: any = dayjs(val.dateRange[1], "YYYY-MM-DD");
      setFirstDate(d1);
      setCurrentDate(d2);
    }
    if (val.status) {
      setOnFilter(val.status)
    }
    setQuery(val.search)
  }
  let datasObj = {
    firstDate,
    currentDate,
    onFilter,
    query
  }
  return (
    <>
      <PageHeader
        firstPathText="Transactions"
        firstPathLink={location.pathname}
        goback="/usr/dashboard"
        title="Staff Transactions"
      >
        <Popover
          content={
            <>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setReceiptModal(true)}
              >
                <IoMdMailOpen size={20} />{" "}
                <span style={{ marginLeft: 4 }}>Reciepts</span>
              </p>
              <p
                style={{ cursor: "pointer", marginBottom: 5 }}
                onClick={() => {
                  setPaymentModal(true);
                }}
              >
                <MdSend size={20} />
                <span style={{ marginLeft: 4 }}>Payments</span>
              </p>
            </>
          }
          placement="bottomRight"
          trigger="click"
        >
          <Button type="primary">More Options</Button>
        </Popover>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <>
              <StatementTable
                list={list}
                columns={columns}
                title={"Transactions"}
                onFilterData={datasObj}
                trancection={true}
                onValuesChange={onValuesChange}
                onSelectedData={(data: any) => handleSelectedData(data)}
              />
            </>
            <div style={{ display: 'flex', justifyContent: "space-between", marginTop: '15px' }}>
              <div />
              *Please select the rows you want to close today from the above table
              <div>
                <Button type="primary" onClick={() => setClosePaymentModal(true)}
                  disabled={selectedRow?.length === 0}
                >Close Transactions</Button>
              </div>
            </div>
          </Card>
        </Container>
      )}

      {receiptModal && (
        <ReceiptModal
          refresh={() => fetchStaffTransactionList()}
          isOpen={receiptModal}
          setModalOpen={setReceiptModal}
          type={"receipt"}
          formType={'create'}
          ledgerList={ledgerList}
        />
      )}

      {receiptUpdateModal && (
        <ReceiptModal
          refresh={() => fetchStaffTransactionList()}
          isOpen={receiptUpdateModal}
          setModalOpen={setReceiptUpdateModal}
          type={"receipt"}
          formType={'edit'}
          id={id}
          ledgerList={ledgerList}
        />
      )}

      {paymentModal && (
        <ReceiptModal
          refresh={() => fetchStaffTransactionList()}
          isOpen={paymentModal}
          setModalOpen={setPaymentModal}
          type={"payment"}
          formType={"create"}
          ledgerList={ledgerList}
        />
      )}

      {paymentUpdateModal && (
        <ReceiptModal
          refresh={() => fetchStaffTransactionList()}
          isOpen={paymentUpdateModal}
          setModalOpen={setPaymentUpdateModal}
          type={"payment"}
          formType={"edit"}
          id={id}
          ledgerList={ledgerList}
        />
      )}

      {
        closePaymentModal &&
        <ClosePayment
          isOpen={closePaymentModal}
          setModalOpen={setClosePaymentModal}
          selectedRow={selectedRow}
          bankList={bankList}
          refresh={fetchStaffTransactionList}
        />
      }
    </>
  );
};

export default StaffTransaction;
