import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../../../components/pageHeader";
import CustomerReciept from "./customerReciept";
import OtherReciept from "./otherReciept";
import SupplierRefund from "./supplierRefund";
import { useTranslation } from "react-i18next";
function BankSalesReciept() {
  const {t} = useTranslation();
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("1");

  let type = location?.state?.type;
  const items = [
    {
      key: "1",
      tab: "customer",
      label: <div className="tab-title">{t("home_page.homepage.CUSTOMERRECEIPT")}</div>,
      children: <CustomerReciept />,
    },
    {
      key: "2",
      tab: "other",
      label: <div className="tab-title">{t("home_page.homepage.OTHERRECEIPT")}</div>,
      children: <OtherReciept />,
    },
    {
      key: "3",
      tab: "supplier",
      label: <div className="tab-title">{t("home_page.homepage.SUPPLIERREFUND")} </div>,
      children: <SupplierRefund />,
    },
  ];

  const onChange = (key: any) => {
    var tab = "";
    if (key === "1") {
      tab = "customer";
    } else if (key === "2") {
      tab = "other";
    } else {
      tab = "supplier";
    }

    if (tab === "customer") {
      setActiveTab("1");
    } else if (tab === "other") {
      setActiveTab("2");
    } else {
      setActiveTab("3");
    }

    window.history.replaceState(
      {},
      "",
      `/usr/cashBank/${id}/details/salesreciept/${tab}`
    );
    setActiveTab(key);
  };

  useEffect(() => {
    if (tab === "customer") {
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
        title={t("home_page.homepage.SalesReceipt")}
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathLink={`/usr/cashBank/${id}/details`}
        secondPathText={t("home_page.homepage.BankDetails")}
        thirdPathLink={`/usr/cashBank/${id}/details/salesreciept/customer`}
        thirdPathText={t("home_page.homepage.SalesReceipt")}
        goback={() => navigate(`/usr/cashBank/${id}/details/transaction`)}
      />
      <Tabs
        defaultActiveKey={
          tab === "customer" ? "1" : tab === "other" ? "2" : "3"
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

export default BankSalesReciept;
