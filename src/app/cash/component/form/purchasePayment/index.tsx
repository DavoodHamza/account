import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../../components/pageHeader";
import Payments from "./components/payments";
import OtherPayments from "./components/otherPayments";
import CustumerRefund from "./components/custumerRefund";
import API from "../../../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../../../utils/apiCalls";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const { TabPane } = Tabs;

const CustomTab = ({ elements }: any) => {
  const navigate = useNavigate();
  const { source } = useParams();

  return (
    <>
      <Tabs
        activeKey={source}
        onChange={(path) => navigate(`../${path}`)}
        tabBarGutter={30}
        tabBarStyle={{ backgroundColor: "white", paddingLeft: 10 }}
      >
        {elements.map((element: any) => (
          <TabPane
            tab={element.tabTitle}
            className="TabsBody"
            key={element.path}
            disabled={element.disabled}
          >
            {element.tabBody}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};

const PurchasePaymentForm = () => {
  const {t} = useTranslation();
  const { id, type, source } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const [balance, setBalance] = useState<any>();

  useEffect(() => {
    fetchBankDetails()
  }, [])
  const fetchBankDetails = async () => {
    try {
      const bank_url = API.GET_BANK_DETAILS + `${id}/${user?.id}`;
      const { data }: any = await GET(bank_url, null);
      setBalance(data.openingBalance);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cash"}
        firstPathText={t("home_page.homepage.Cash")}
        secondPathLink={`/usr/cash/cashTable/${id}`}
        secondPathText={t("home_page.homepage.CashTable")}
        goback={-1}
        title={t("home_page.homepage.CashManagement")}
      />
      <CustomTab
        elements={[
          {
            tabTitle: (
              <div className="tab-title">
                {t("home_page.homepage.SupplierPayment")}
              </div>
            ),
            tabBody: <Payments balance={Number(balance)} />,
            path: "supplier-payment",
            disabled:
              type == "create"
                ? false
                : source == "supplier-payment"
                  ? false
                  : true,
          },
          {
            tabTitle: (
              <div className="tab-title">{t("home_page.homepage.OtherPayment")}</div>
            ),
            tabBody: <OtherPayments balance={Number(balance)} />,
            path: "other-payment",
            disabled:
              type == "create"
                ? false
                : source == "other-payment"
                  ? false
                  : true,
          },
          {
            tabTitle: (
              <div className="tab-title">
                {t("home_page.homepage.CustomerRefund")}
              </div>
            ),
            tabBody: <CustumerRefund balance={Number(balance)} />,
            path: "customer-refund",
            disabled:
              type == "create"
                ? false
                : source == "customer-refund"
                  ? false
                  : true,
          },
        ]}
      />
    </div>
  );
};

export default PurchasePaymentForm;
