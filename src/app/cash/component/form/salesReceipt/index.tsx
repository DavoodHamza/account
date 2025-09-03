import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../../components/pageHeader";
import Receipt from "./components/receipt";
import OtherReceipt from "./components/otherReceipt";
import SupplierRefund from "./components/supplierRefund";
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
        tabBarStyle={{ backgroundColor: "white" ,paddingLeft:10}}
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

const CustumerReceiptForm = () => {
  const {t} = useTranslation();
  const { id, type, source } = useParams();
  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cash"}
        firstPathText={t("home_page.homepage.Cash")}
        secondPathLink={`/usr/cash/cashTable/${id}`}
        secondPathText={t("home_page.homepage.CashTable")}
        goback={-1}
        title={t("home_page.homepage.Cash_Statement")}
      />
      <CustomTab
        elements={[
          {
            tabTitle: (
              <div className="tab-title">
                {t("home_page.homepage.CustomerReceipt")}
              </div>
            ),
            tabBody: <Receipt />,
            path: "customer-receipt",
            disabled:
              type == "create"
                ? false
                : source == "customer-receipt"
                ? false
                : true,
          },
          {
            tabTitle: (
              <div className="tab-title">{t("home_page.homepage.OtherReceipt")}</div>
            ),
            tabBody: <OtherReceipt />,
            path: "other-receipt",
            disabled:
              type == "create"
                ? false
                : source == "other-receipt"
                ? false
                : true,
          },
          {
            tabTitle: (
              <div className="tab-title">
                {t("home_page.homepage.SupplierRefund")}
              </div>
            ),
            tabBody: <SupplierRefund />,
            path: "supplire-refund",
            disabled:
              type == "create"
                ? false
                : source == "supplire-refund"
                ? false
                : true,
          },
        ]}
      />
    </div>
  );
};

export default CustumerReceiptForm;
