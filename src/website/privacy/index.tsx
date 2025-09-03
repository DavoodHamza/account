import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
import Whatsapp from "../../components/whatsapp";
import ChatBot from "../../components/bot";
function Privacy() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const { t } = useTranslation();
  return (
    <>
      <WebsiteHeader />
      <div className="website-screens">
        <Container>
          <div className="Privacy-Policy">
            {t("home_page.homepage.Privacy_Policy")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.Thank_you_for_visiting_our")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.Note_the_privacy_practices")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Collection_of_Information")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.We_collect_personally")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Cookie_Tracking_Technology")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.The_Site_may_use_cookie")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Collection")}
          </div>
          <div className="Privacy-Policy-desc">
            . {t("home_page.homepage.transparency")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Strings")}
          </div>
          <div className="Privacy-Policy-desc">
            .{t("home_page.homepage.utilized")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Consent")}
          </div>
          <div className="Privacy-Policy-desc">
            .{t("home_page.homepage.identifiable")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Distribution_of_Information")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.We_may_share_information_with")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Commitment_to_Data_Security")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.Your_personally")}
          </div>
          <div className="Privacy-Policy-taitil">
            {t("home_page.homepage.Privacy_Contact_Information")}
          </div>
          <div className="Privacy-Policy-desc">
            {t("home_page.homepage.If_you_have_any")}
          </div>
          <div>
            {" "}
            <b> {t("home_page.homepage.global_limited")} </b>
          </div>
          <div>
            {" "}
            <b>{t("home_page.homepage.Damastown")}</b>
          </div>
          {/* <div>{t("home_page.homepage.LEGAL_INFORMATION")}</div>
          <div>{t("home_page.homepage.LEGAL_INFORMATION")}</div> */}
        </Container>
      </div>
      <br />
      <br />
      <Whatsapp />
      {/* <ChatBot /> */}
      <WebsiteFooter />
    </>
  );
}

export default Privacy;
