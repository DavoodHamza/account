import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SupplierPayment from "./supplierPayment";
import OtherPayment from "./otherPayment";
import PageHeader from "../../../../../../components/pageHeader";
import CustomerRefund from "./customerRefund";
import { useSelector } from "react-redux";
import API from "../../../../../../config/api";
import { GET } from "../../../../../../utils/apiCalls";

import { useTranslation } from "react-i18next";
function BankPurchasePayment() {
  const {t} = useTranslation();
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("1");
  const { user } = useSelector((state: any) => state.User);
  const [balance, setBalance] = useState<any>();
  useEffect(() => {
    fetchBankDetails();
  }, []);
  const fetchBankDetails = async () => {
    try {
      const bank_url = API.GET_BANK_DETAILS + `${id}/${user?.id}`;
      const { data }: any = await GET(bank_url, null);
      setBalance(data.bankDetails);
    } catch (error) {
      console.log(error);
    }
  };

  let type = location?.state?.type;
  const items = [
    {
      key: "1",
      tab: "supplier",
      label: <div className="tab-title">{t("home_page.homepage.SUPPLIERPAYMENT")}</div>,
      children: (
        <SupplierPayment
          balance={Number(balance?.total) + Number(balance?.opening)}
        />
      ),
    },
    {
      key: "2",
      tab: "other",
      label: <div className="tab-title">{t("home_page.homepage.OTHERPAYMENT")}</div>,
      children: (
        <OtherPayment
          balance={Number(balance?.total) + Number(balance?.opening)}
        />
      ),
    },
    {
      key: "3",
      tab: "customer",
      label: <div className="tab-title">{t("home_page.homepage.CUSTOMERREFUND")}</div>,
      children: (
        <CustomerRefund
          balance={Number(balance?.total) + Number(balance?.opening)}
        />
      ),
    },
  ];

  const onChange = (key: any) => {
    var tab = "";
    if (key === "1") tab = "supplier";
    else if (key === "2") tab = "other";
    else tab = "customer";

    if (tab === "supplier") setActiveTab("1");
    else if (tab === "other") setActiveTab("2");
    else setActiveTab("3");

    window.history.replaceState(
      {},
      "",
      `/usr/cashBank/${id}/details/purchasepayment/${tab}`
    );
    setActiveTab(key);
  };

  useEffect(() => {
    if (tab === "supplier") {
      setActiveTab("1");
    } else if (tab === "other") {
      setActiveTab("2");
    } else {
      setActiveTab("3");
    }
    const defaultTabKey = type || items[0].key;
    onChange(defaultTabKey);
  }, []);

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.Payment")}
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathLink={`/usr/cashBank/${id}/details`}
        secondPathText={t("home_page.homepage.BankDetails")}
        thirdPathLink={`/usr/cashBank/${id}/details/reciept/customer`}
        thirdPathText={t("home_page.homepage.Payment")}
        goback={() => navigate(`/usr/cashBank/${id}/details/transaction`)}
      />
      <Tabs
        defaultActiveKey={
          tab === "supplier" ? "1" : tab === "other" ? "2" : "3"
        }
        onChange={onChange}
        tabBarStyle={{ backgroundColor: "white", paddingLeft: 10 }}
      >
        {items.map((item: any) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
}

export default BankPurchasePayment;
