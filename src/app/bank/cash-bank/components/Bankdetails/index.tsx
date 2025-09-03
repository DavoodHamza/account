import { Button, Popover, Tabs, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiFillReconciliation } from "react-icons/ai";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { IoMdMailOpen } from "react-icons/io";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../../components/pageHeader";
import API from "../../../../../config/api";
import { BsFillInfoCircleFill } from "react-icons/bs";
import "../../styles.scss";
import { useTranslation } from "react-i18next";
import { GET, PUT } from "../../../../../utils/apiCalls";
import Details from "./Details";
import Reconcile from "./Reconcile";
import Transaction from "./Transaction";

const { TabPane } = Tabs;

const CustomTab = ({ elements }: any) => {
  const navigate = useNavigate();
  const { source } = useParams();

  return (
    <>
      <Tabs
        style={{ marginTop: window.innerWidth <= 580 ? 70 : 10 }}
        activeKey={source}
        onChange={(path) => navigate(`../${path}`)}
        tabBarGutter={30}
        tabBarStyle={{ backgroundColor: "white", paddingLeft: 10 }}>
        {elements.map((element: any) => (
          <TabPane tab={element.tabTitle} key={element.path}>
            {element.tabBody}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};

const BankDetails = () => {
  const { id, status } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const navigate = useNavigate();
  const [reconcile, setReconcile] = useState([]);
  const Dtoday = moment(new Date());
  const DoneMonthAgo = moment(new Date().setDate(1));
  const [startDate, setStartDate] = useState(DoneMonthAgo.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(Dtoday.format("YYYY-MM-DD"));
  const [bank, setBank] = useState<any>([]);
  const [balance, setBalance] = useState();

  // const fetchTransactions = async () => {
  //   try {
  //     setIsLoading(true);
  //     let URL =
  //       "bank/listBankActivity/" +
  //       `${user?.id}/${id}/${startDate}/${endDate}?order=DESC&page=${1}&take=${10}`;
  //     // const { data }: any = await GET(URL, null);
  //     // if (data) {
  //     //   if (status == "1") {
  //     //     let filterData = data?.resList.filter((item: any) => {
  //     //       return item.reconcile_status == 1;
  //     //     });
  //     //   } else {
  //     //   }
  //     //   setIsLoading(false);
  //     // } else {
  //     //   setIsLoading(false);
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // };

  const { t } = useTranslation();
  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const bank_url = API.GET_BANK_DETAILS + `${id}/${adminid}`;
      const { data }: any = await GET(bank_url, null);
      setData(data?.bankDetails);
      setBalance(data?.openingBalance);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // const loadData = async (page: Number, take: Number) => {
  //   try {
  //     let URL =
  //       API.LIST_BANK_ACTIVITY +
  //       user?.id +
  //       "/" +
  //       id +
  //       `?order=DESC&page=${page}&take=${take}`;
  //     const { data }: any = await GET(URL, null);
  //     if (data) {
  //       setReconcile(data?.resList);
  //     } else {
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
        notification.success({
          message: "Reconcile Date Updated",
          description: "Reconcile date updated successfully",
        });
        // loadData(1, 50);
        fetchBankDetails();
        // fetchTransactions()
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);
      let banklist = data?.bankList.filter((item: any) => item.list.id == id);
      setBank(banklist[0]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
    fetchBankDetails();
    // loadData(1, 50);
  }, []);

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathLink={`/usr/cashBank/${id}/details`}
        secondPathText={t("home_page.homepage.BankDetails")}
        goback={-1}
        title={t("home_page.homepage.Accountransaction")}
        children={
          <div>
            <Button
              type="primary"
              className=""
              onClick={() => navigate(`/usr/cashBank/reconcile/${id}/1`)}>
              {t("home_page.homepage.Reconciled")}
            </Button>{" "}
            <Popover
              content={
                <>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/usr/cashBank/${id}/details/salesreciept/customer`,
                        {
                          state: { type: "customer_reciept" },
                        }
                      )
                    }>
                    <IoMdMailOpen size={20} />{" "}
                    <span style={{ marginLeft: 4 }}>
                      {t("home_page.homepage.Reciepts")}
                    </span>
                  </p>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/usr/cashBank/${id}/details/purchasepayment/supplier`,
                        {
                          state: { type: "purchase-reciept" },
                        }
                      )
                    }>
                    <MdSend size={20} />
                    <span style={{ marginLeft: 4 }}>
                      {t("home_page.homepage.Payments")}
                    </span>
                  </p>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/usr/cashBank/${id}/details/banktransfer/create`
                      )
                    }>
                    <FaMoneyBillTransfer size={20} />{" "}
                    <span style={{ marginLeft: 4 }}>
                      {t("home_page.homepage.Bank_Transfer")}
                    </span>
                  </p>
                </>
              }
              placement="bottomRight"
              trigger="click">
              <Button className="">
                {t("home_page.homepage.MoreOptions")}
              </Button>
            </Popover>
          </div>
        }
      />
      <CustomTab
        elements={[
          {
            tabTitle: (
              <div className="tab-title" style={{ marginLeft: 15 }}>
                <GrTransaction size={20} />
                <span>{t("home_page.homepage.Transaction")}</span>
              </div>
            ),
            tabBody: (
              <Transaction
                details={data}
                balance={balance}
                fetchBankDetails={fetchBankDetails}
              />
            ),
            path: "transaction",
          },
          {
            tabTitle: (
              <div className="tab-title">
                <AiFillReconciliation size={20} />
                <span style={{ marginLeft: 10 }}>
                  {t("home_page.homepage.Reconcile")}
                </span>
              </div>
            ),
            tabBody: (
              <Reconcile
                onLoadData={console.log}
                onUpdateDate={(date: any, id: any) => onUpdate(date, id)}
                data={reconcile}
                startDate={startDate}
                endDate={endDate}
              />
            ),
            path: "reconcile",
          },
          {
            tabTitle: (
              <div className="tab-title">
                <BsFillInfoCircleFill size={19} />{" "}
                <span>{t("home_page.homepage.Details")}</span>
              </div>
            ),
            tabBody: <Details bankDetails={data} bank={bank} />,
            path: "bank-details",
          },
        ]}
      />
    </div>
  );
};

export default BankDetails;
