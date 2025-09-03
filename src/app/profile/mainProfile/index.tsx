import CompanyHeader from '../../companyList/components/header'
import { Container } from 'react-bootstrap'
import OuterPageHeader from '../../companyList/components/OuterPageHeader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tabs } from 'antd'
import { MdEmail, MdOutlineCardMembership, MdVpnKey } from 'react-icons/md'
import { t } from 'i18next'
import Subscription from '../components/Subscription'
import Security from '../components/Security'
import EmailMobile from '../components/EmailMobile'
import General from '../components/General'
import { BiSolidUserRectangle } from 'react-icons/bi'

const MainProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const CustomTab = ({ elements }: any) => {
        const { source } = useParams();
        
        return (
              <>
                <Tabs
                  activeKey={source}
                  onChange={(path) => navigate(`../${path}`)}
                  tabBarStyle={{ padding: 10,borderBottom: "2px solid white"}}
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
    <>
    <CompanyHeader />
    <Container>
      <br />
      <OuterPageHeader
        goback="/company"
        title="My Profile"
        firstPathLink={location.pathname}
        firstPathText="Profile"
        isBack={()=>navigate("/company")}
      />
      <br />
      <div className="profile-tab-container" style={{backgroundColor: "#f4f6f8",padding:20}}>
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
    </Container>
    <br />
    </>
  )
}

export default MainProfilePage