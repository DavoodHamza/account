import { Button, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { BiSolidUserRectangle } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../../components/pageHeader";
import DayReport from "./dayReport";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import DayTotalReport from "./dayTotalReport";
import DayReportSummary from "./summary";
// import "./styles.scss";

function DaySummary() {
  const { t } = useTranslation();
  const location = useLocation();

  const { user } = useSelector((state: any) => state.User);

  const CustomTab = ({ elements }: any) => {
    const navigate = useNavigate();
    const { source } = useParams();
    if (user.isStaff) {
      elements = [elements[0]];
    }
    return (
      <>
        <PageHeader
          firstPathText={t("home_page.homepage.Report")}
          firstPathLink="/usr/report"
          secondPathText={t("home_page.homepage.Day_Summary")}
          secondPathLink={location.pathname}
          title={t("home_page.homepage.Day_Summary")}
          //   children={
          //     <div>
          //       <Button
          //       //   onClick={() => genrateTemplate("downLoad", {})}
          //       //   loading={isDownloadLoading}
          //       >
          //         <MdFileDownload size={20} />
          //       </Button>
          //       <Button
          //       // onClick={() => setEmailModal(true)}
          //       >
          //         <MdAttachEmail size={20} />
          //       </Button>
          //     </div>
          //   }
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
    );
  };

  return (
    <>
     <PageHeader
          firstPathText={t("home_page.homepage.Report")}
          firstPathLink="/usr/report"
          secondPathText={t("home_page.homepage.Day_Summary")}
          secondPathLink={location.pathname}
          title={t("home_page.homepage.Day_Summary")}
          >
           
          </PageHeader>
          <br />
          <DayReportSummary/>

      {/* <div className="profile-tab-container">
        <CustomTab
          elements={[
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <BiSolidUserRectangle size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.Day_Summary")} Detailed
                  </span>
                </div>
              ),
              tabBody: <DayReportSummary />,
              path: "detailed",
            },
            {
              tabTitle: (
                <div className="profile-tab-title">
                  <span>
                    <BiSolidUserRectangle size={22} />{" "}
                  </span>
                  <span className="profile-tab-title-text">
                    {t("home_page.homepage.Day_Summary")}
                  </span>
                </div>
              ),
              tabBody: <DayReport />,
              path: "single",
            },
          ]}
        />
      </div> */}
    </>
  );
}
export default DaySummary;
