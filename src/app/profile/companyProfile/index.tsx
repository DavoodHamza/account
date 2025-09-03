import { Tabs } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { IoMdBusiness } from "react-icons/io";
import { LuCalendarCheck } from "react-icons/lu";
import { MdMenuBook } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { update } from "../../../redux/slices/userSlice";
import { GET } from "../../../utils/apiCalls";
import AccountData from "../components/AccountData";
import Accounting from "../components/Accounting";
import Business from "../components/Business";
import EndOfYear from "../components/EndOfYear";
import "../styles.scss";
import Customize from "../../settings/screens/customise";
import { TbFileInvoice } from "react-icons/tb";
import { GrTest } from "react-icons/gr";
import Unit from "../../settings/screens/unit";
import { MdLocationSearching } from "react-icons/md";
import Locations from "../../settings/screens/locations";
import { MdCategory } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import ProductCategory from "../../settings/screens/productCategory";
import Tax from "../../settings/screens/Tax";
import EmployeeCategory from "../../settings/screens/employeeCategory";
import HsnCode from "../../settings/screens/hsn_code";
import { TbUserDollar } from "react-icons/tb";
import LoyaltyCard from "../components/LoyaltyCard";
import { useAccessControl } from "../../../utils/accessControl";

function CompanyProfile() {
  const { t } = useTranslation();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.User);
  const { canViewSettings, canUpdateSettings } = useAccessControl();

  // useEffect(() => {
  //   getDetails();
  // }, []);

  const getDetails = async () => {
    try {
      setIsLoading(true);
      const userData = API.GET_USER_DETAILS + user.id;
      const response: any = await GET(userData, null);
      if (response.status) {
        let obj = {
          ...response?.data,
          ...user,
          isStaff: user?.isStaff,
          staff: user?.staff,
          token: user.token,
        };
        dispatch(update(obj));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    getDetails();
  };

  const CustomTab = ({ elements }: any) => {
    const navigate = useNavigate();
    const { source } = useParams();
    if (user.isStaff) {
      elements = [elements[0]];
    }
    // Apply settings access control
    if (!canViewSettings()) {
      return null; // Don't render settings if user doesn't have view permission
    }
    return (
      <>
        {isLoading ? (  
          <LoadingBox />
        ) : (
          <>
            <PageHeader
              firstPathLink={location?.pathname}
              title={t("home_page.homepage.Company_Settings")}
              firstPathText={t("home_page.homepage.Company_Settings")}
              goBack={"/dashboard"} 
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
                  <strong className="settings-tab-title-text">HSN/SAC</strong>
                </div>
              }
              className="TabsBody"
            >
              <HsnCode />
            </Tabs.TabPane>
          )}
            </Tabs>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="profile-tab-container">
        <CustomTab
          elements={[
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <IoMdBusiness size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.business")}
                  </span>
                </div>
              ),
              tabBody: <Business onChange={() => refreshData()} />,
              path: "business",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <MdMenuBook size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.ACCOUNTING")} 
                  </span>
                </div>
              ),
              tabBody: <Accounting onChange={() => refreshData()} />,
              path: "accounting",
            },
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
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <FaRegCreditCard size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.loyaltyCard")}
                  </span>
                </div>
              ),
              tabBody: <LoyaltyCard />,
              path: "loyaltyCard",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <LuCalendarCheck size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">{t("home_page.homepage.End_of_Year")}</span>
                </div>
              ),
              tabBody: <EndOfYear />,
              path: "end-of-year",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <FaRegFloppyDisk size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.Account_Data")}
                  </span>
                </div>
              ),
              tabBody: <AccountData />,
              path: "account",
            },
          ]}
        />
      </div>
    </div>
  );
}
export default CompanyProfile;
