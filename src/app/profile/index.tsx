import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { BiSolidUserRectangle } from "react-icons/bi";
import {
  MdEmail,
  MdOutlineCardMembership,
  MdVpnKey
} from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/pageHeader";
import EmailMobile from "./components/EmailMobile";
import General from "./components/General";
import Security from "./components/Security";
import Subscription from "./components/Subscription";
import "./styles.scss";


function Profile() {
  const { t } = useTranslation();
  const location = useLocation();

  const { user } = useSelector((state: any) => state.User);

  const CustomTab = ({ elements }: any) => {
    const navigate = useNavigate();
    const { source } = useParams();
    if (user.isStaff) {
      elements =[ elements[0]];
    }
    return (
          <>
            <PageHeader
              firstPathLink={location?.pathname}
              title={t("home_page.homepage.Profile")}
              firstPathText ={t("home_page.homepage.Profile")}
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
            </Tabs>
          </>
    )
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
                    <BiSolidUserRectangle size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">{t("home_page.homepage.GENERAL")}</span>
                </div>
              ),
              tabBody: (
                <General 
                />
              ),

              path: "general",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <MdEmail size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">{t("home_page.homepage.EMAIL_MOBILE")}</span>
                </div>
              ),
              tabBody: <EmailMobile 
              />,
              path: "email-mobile",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <MdVpnKey size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">{t("home_page.homepage.SECURITY")}</span>
                </div>
              ),
              tabBody: <Security
               />,
              path: "security",
            },

            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <MdOutlineCardMembership size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">{t("home_page.homepage.SUBSCRIPTION")}</span>
                </div>
              ),
              tabBody: <Subscription />,
              path: "subscription",
            },
          ]}
        />
      </div>
    </div>
  );
}
export default Profile;
