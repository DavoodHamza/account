import { Tabs } from "antd";
import { GrTest } from "react-icons/gr";
import { MdCategory } from "react-icons/md";
import { MdLocationSearching } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/pageHeader";
import EmployeeCategory from "./screens/employeeCategory";
import ProductCategory from "./screens/productCategory";
import Unit from "./screens/unit";
import Customize from "./screens/customise";
import { TbFileInvoice } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { TbUserDollar } from "react-icons/tb";
import Locations from "./screens/locations";
import Tax from "./screens/Tax";
import { useSelector } from "react-redux";
import HsnCode from "./screens/hsn_code";

const Settings = () => {
  const { t } = useTranslation();
  const CustomTab = ({ elements }: any) => {
    const navigate = useNavigate();
    const { source } = useParams();
    const { user } = useSelector((state: any) => state.User);
    return (
      <>
        <PageHeader
          firstPathLink={"/usr/settings"}
          firstPathText={t("home_page.homepage.Settings")}
          secondPathLink={"asse"}
          goback={-1}
          title={t("home_page.homepage.Settings")}
        />
        <Tabs
          activeKey={source}
          onChange={(path) => navigate(`../${path}`)}
          tabBarStyle={{ backgroundColor: "white", paddingLeft: 10 }}
        >
          {elements.map((element: any) => (
            <Tabs.TabPane
              key={element.path}
              tab={element.tabTitle}
              className="TabsBody"
            >
              {element.tabBody}
            </Tabs.TabPane>
          ))}

          {user?.companyInfo.tax === "gst" && (
            <Tabs.TabPane
              key="hsnCode"
              tab={
                <div className="settings-tab-title">
                  <span>
                    <TbUserDollar size={22} />{" "}
                  </span>
                  <strong className="settings-tab-title-text">{t("home_page.homepage.hsn_sac")}</strong>
                </div>
              }
              className="TabsBody"
            >
              <HsnCode />
            </Tabs.TabPane>
          )}
        </Tabs>
      </>
    );
  };

  return (  
    <div className="settings-tab-container">
      <CustomTab
        elements={[
          {
            tabTitle: (
              <div className="settings-tab-title">
                <span>
                  <TbFileInvoice size={23} />
                </span>
                <strong className="settings-tab-title-text">
                  {t("home_page.homepage.CUSTOMISE")}
                </strong>
              </div>
            ),
            tabBody: <Customize />,
            path: "customize",
          },
          {
            tabTitle: (
              <div className="settings-tab-title">
                <span>
                  <GrTest size={20} />{" "}
                </span>
                <strong className="settings-tab-title-text">
                  {t("home_page.homepage.Unit")}
                </strong>
              </div>
            ),
            tabBody: <Unit />,
            path: "unit",
          },
          {
            tabTitle: (
              <div className="settings-tab-title">
                <span>
                  <MdLocationSearching size={20} />{" "}
                </span>
                <strong className="settings-tab-title-text">
                  {t("home_page.homepage.Inventory_Location")}
                </strong>
              </div>
            ),
            tabBody: <Locations />,
            path: "location",
          },
          {
            tabTitle: (
              <div className="settings-tab-title">
                <span>
                  <IoCartOutline size={22} />{" "}
                </span>
                <strong className="settings-tab-title-text">
                  {t("home_page.homepage.Product_Category_Service_category")}
                </strong>
              </div>
            ),
            tabBody: <ProductCategory />,
            path: "productCategory",
          },
          {
            tabTitle: (
              <div className="settings-tab-title">
                <span>
                  <MdCategory size={22} />{" "}
                </span>
                <strong className="settings-tab-title-text">
                  {t("home_page.homepage.Tax_Percentage")}
                </strong>
              </div>
            ),
            tabBody: <Tax />,
            path: "tax",
          },
          // {
          //   tabTitle: (
          //     <div className="settings-tab-title">
          //       <span>
          //         <MdCategory size={22} />{" "}
          //       </span>
          //       <strong className="settings-tab-title-text">
          //       {t("home_page.homepage.Employee_Group")}
              
          //       </strong>
          //     </div>
          //   ),
          //   tabBody: <EmployeeCategory />,
          //   path: "employeeCategory",
          // },

          // {
          //   tabTitle: (
          //     <div className="settings-tab-title">
          //       <span>
          //         <TbUserDollar size={22} />{" "}
          //       </span>
          //       <strong className="settings-tab-title-text">Pay Head</strong>
          //     </div>
          //   ),
          //   tabBody: <PayHead />,
          //   path: "payHead",
          // },
        ]}
      />
    </div>
  );
};

export default Settings;
