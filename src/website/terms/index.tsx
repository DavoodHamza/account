import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ChatBot from "../../components/bot";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import { withTranslation } from "react-i18next";

import "./style.scss";
function Terms(props: any) {
  const { t } = props;
  return (
    <>
      <WebsiteHeader />
      <div className="website-screens">
        <Container>
          <div className="Terms-mainTaitil">
            {t("home_page.homepage.product_service").toUpperCase()}
          </div>
          <p className="Terms-desc">{t("home_page.homepage.below")}</p>

          <h2 className="Terms_taitil">
            {" "}
            {t("home_page.homepage.Introduction")}
          </h2>
          <p className="Terms-desc">{t("home_page.homepage.welcomes")}</p>
          <p className="Terms-desc">{t("home_page.homepage.section")}</p>
          <p className="Terms-desc">. {t("home_page.homepage.legal")}</p>
          <p className="Terms-desc">
            {t("home_page.homepage.still")}{" "}
            <a href="https://www.taxgoglobal.com/support">
              https://www.taxgoglobal.com/support
            </a>{" "}
            {t("home_page.homepage.help")}
          </p>
          <p className="Terms-desc">{t("home_page.homepage.joining")}</p>

          <h2 className="Terms_taitil"></h2>
          <p className="Terms-desc">{t("home_page.homepage.sections")}</p>

          <ol className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.yous")}</strong>{" "}
              {t("home_page.homepage.both")}
            </li>
            <li>
              <strong>{t("home_page.homepage.our")}:</strong>.
              {t("home_page.homepage.future")}
            </li>
            <li>
              <strong>{t("home_page.homepage.creating")}:</strong>.
              {t("home_page.homepage.paying")}
            </li>
            <li>
              <strong>{t("home_page.homepage.invited")}:</strong> .
              {t("home_page.homepage.term")}
            </li>
            <li>
              <strong>{t("home_page.homepage.user")}:</strong> , you can
              subscribe on{" "}
              <a href="https://www.taxgoglobal.com/">
                https://www.taxgoglobal.com/
              </a>
              .
            </li>
            <li>
              <strong>{t("home_page.homepage.partner")}:</strong> .
              {t("home_page.homepage.websites")}
            </li>
            <li>
              <strong>{t("home_page.homepage.online")}:</strong> .
              {t("home_page.homepage.Retail")}
            </li>
            <li>
              <strong>{t("home_page.homepage.our")}:</strong> .
              {t("home_page.homepage.grant")}
            </li>
            <li>
              <strong>{t("home_page.homepage.role")}:</strong>:
              {t("home_page.homepage.managed")}
              <ul>
                <li>{t("home_page.homepage.transfer")}</li>
                <li>{t("home_page.homepage.transfer")}</li>
                <li>{t("home_page.homepage.access")}</li>
                <li> {t("home_page.homepage.any")}</li>
              </ul>
            </li>
            <li>
              <strong> {t("home_page.homepage.rules")}:</strong> .
              {t("home_page.homepage.please")}
            </li>
            <li>
              <strong>{t("home_page.homepage.responsibilities")}:</strong> .
              {t("home_page.homepage.belows")}
            </li>
            <li>
              <strong>{t("home_page.homepage.revised")}:</strong>.
              {t("home_page.homepage.updates")}
            </li>
            <li>
              <strong>{t("home_page.homepage.own")}:</strong>.
              {t("home_page.homepage.contents")}
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.pricing")}</h2>
          <p className="Terms-desc">.{t("home_page.homepage.unless")}</p>
          <ol start={14} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.trial")}:</strong>
              {t("home_page.homepage.billing")}{" "}
              <a href="https://www.taxgoglobal.com/plans">
                https://www.taxgoglobal.com/plans
              </a>
              .{t("home_page.homepage.chooses")} .
            </li>
            <li>
              <strong>{t("home_page.homepage.plan")}:</strong>.
              {t("home_page.homepage.set")}
            </li>
            <li>
              <strong>{t("home_page.homepage.taxes")}:</strong> .
              {t("home_page.homepage.location")}
            </li>
            <li>
              <strong>{t("home_page.homepage.additional")}:</strong> .
              {t("home_page.homepage.projects")}
            </li>
            <li>
              <strong>{t("home_page.homepage.timely")}:</strong>.
              {t("home_page.homepage.order")}
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.data")}</h2>
          <p className="Terms-desc">
            {t("home_page.homepage.policy")}{" "}
            <a href="https://www.taxgoglobal.com/privacy">
              https://www.taxgoglobal.com/privacy
            </a>{" "}
            {t("home_page.homepage.email")}.
          </p>

          <ol start={19} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.useof")}:</strong> :
              {t("home_page.homepage.self")}
              <ul>
                <li>{t("home_page.homepage.enable")};</li>
                <li>{t("home_page.homepage.protect")};</li>
                <li>{t("home_page.homepage.create")};</li>
                <li>{t("home_page.homepage.with")};</li>
                <li>{t("home_page.homepage.intrest")}</li>
                <li>{t("home_page.homepage.third")} .</li>
              </ul>
            </li>
            <li>
              <strong>{t("home_page.homepage.owns")}:</strong>
              {t("home_page.homepage.visit")}{" "}
              <a href="https://www.taxgoglobal.com/privacy">
                https://www.taxgoglobal.com/privacy
              </a>{" "}
              {t("home_page.homepage.sets")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.enter")}:</strong>{" "}
              {t("home_page.homepage.based")} .
            </li>
            <li>
              <strong>{t("home_page.homepage.Anonymized")}:</strong>
              {t("home_page.homepage.purposes")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.breach")}:</strong>.
              {t("home_page.homepage.assess")}
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.breach")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.Confidential")}.</p>
          <ol start={24} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.keeping")}:</strong>
              {t("home_page.homepage.boths")}.
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.Security")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.seriously")} .</p>

          <ol start={25} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.safeguards")}:</strong>.
              {t("home_page.homepage.authorization")}
            </li>
            <li>
              <strong>{t("home_page.homepage.features")}:</strong> .
              {t("home_page.homepage.responsible")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Playing")}:</strong>
              {t("home_page.homepage.secure")}{" "}
              <a href="https://www.taxgoglobal.com/">
                https://www.taxgoglobal.com/
              </a>
              .
            </li>
          </ol>
          <h2 className="Terms_taitil">{t("home_page.homepage.products")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.beautiful")} .</p>

          <ol start={28} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.Otherservices")}:</strong> .
              {t("home_page.homepage.available")}
            </li>
            <li>
              <strong>{t("home_page.homepage.thirdparty")}:</strong>.
              {t("home_page.homepage.providing")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Marketplace")}:</strong> .
              {t("home_page.homepage.through")}
            </li>
            <li>
              <strong>{t("home_page.homepage.descriptions")}:</strong> .
              {t("home_page.homepage.publish")}
            </li>
            <li>
              <strong>{t("home_page.homepage.connect")}:</strong>{" "}
              {t("home_page.homepage.Gmail")} .
            </li>
            <li>
              <strong>{t("home_page.homepage.totax")}:</strong>.
              {t("home_page.homepage.revenue")}
            </li>
          </ol>

          <h2 className="Terms_taitil">
            {t("home_page.homepage.Maintenance")}
          </h2>
          <p className="Terms-desc">{t("home_page.homepage.minimize")}.</p>

          <ol start={34} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.Availability")}:</strong> .
              {t("home_page.homepage.strive")}
            </li>
            <li>
              <strong>{t("home_page.homepage.issues")}:</strong> .
              {t("home_page.homepage.internet")}
            </li>
            <li>
              <strong>{t("home_page.homepage.loss")}:</strong> .
              {t("home_page.homepage.maintaining")}
            </li>
            <li>
              <strong>{t("home_page.homepage.compensation")}:</strong>
              {t("home_page.homepage.Whatever")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.support")}:</strong>
              {t("home_page.homepage.articles")}{" "}
              <a href="https://www.taxgoglobal.com/support">
                https://www.taxgoglobal.com/support
              </a>{" "}
              .
            </li>
            <li>
              <strong>{t("home_page.homepage.Modifications")}:</strong> .
              {t("home_page.homepage.enhancements")}
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.Allowable")}</h2>
          <p className="Terms-desc">.{t("home_page.homepage.common")}</p>

          <ol start={40} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.Feedback")}:</strong> .
              {t("home_page.homepage.restriction")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Help")}:</strong> .
              {t("home_page.homepage.lawful")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Discussions")}:</strong>.
              {t("home_page.homepage.anything")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Limitations")}:</strong>.
              {t("home_page.homepage.monthly")}
            </li>
            <li>
              <strong>{t("home_page.homepage.beta")}:</strong>{" "}
              {t("home_page.homepage.Occasionally")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.Things")}:</strong>
              <ul>
                <li>.{t("home_page.homepage.computing")}</li>
                <li>.{t("home_page.homepage.interfere")}</li>
                <li>.{t("home_page.homepage.system")}</li>
                <li>.{t("home_page.homepage.Introduce")}</li>
                <li>.{t("home_page.homepage.offensive")}</li>
                <li>.{t("home_page.homepage.extract")}</li>
                <li>.{t("home_page.homepage.permitted")}</li>
                <li>.{t("home_page.homepage.Repackage")}</li>
                <li>.{t("home_page.homepage.Commit")}</li>
                <li>.{t("home_page.homepage.interaction")}</li>
              </ul>
            </li>
          </ol>

          <h2 className="Terms_taitil">
            {t("home_page.homepage.Termination")}
          </h2>
          <p className="Terms-desc">.{t("home_page.homepage.subscription")}</p>

          <ol start={46} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.periods")}:</strong> .
              {t("home_page.homepage.duration")}
            </li>
            <li>
              <strong>{t("home_page.homepage.by")}:</strong>{" "}
              {t("home_page.homepage.providings")}:
              <ul>
                <li>,{t("home_page.homepage.breachs")}</li>
                <li>{t("home_page.homepage.remedieds")},</li>
                <li>{t("home_page.homepage.fail")}</li>
                <li>{t("home_page.homepage.insolvency")}.</li>
              </ul>
            </li>
            <li>
              <strong>{t("home_page.homepage.No")}:</strong>{" "}
              {t("home_page.homepage.due")}.
            </li>
            <li>
              <strong>:{t("home_page.homepage.Retentions")}</strong>{" "}
              {t("home_page.homepage.subscriber")}.
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.Liability")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.urge")}.</p>

          <ol start={50} className="Terms-desc">
            <li>
              <strong> {t("home_page.homepage.urge")}:</strong>
              {t("home_page.homepage.against")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.warranties")}:</strong>{" "}
              {t("home_page.homepage.merchantabilitys")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.Limitation")}:</strong>
              {t("home_page.homepage.follows")}:
              <ul>
                <li>{t("home_page.homepage.expense")}.</li>
                <li>{t("home_page.homepage.backups")}.</li>
                <li>{t("home_page.homepage.arose")}.</li>
              </ul>
            </li>
          </ol>

          <h2 className="Terms_taitil">{t("home_page.homepage.Disputes")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.outlines")} </p>
          <ol start={53} className="Terms-desc">
            <li>
              <strong>{t("home_page.homepage.Dispute")}:</strong>{" "}
              {t("home_page.homepage.purported")}.
            </li>
          </ol>
          <h2 className="Terms_taitil">{t("home_page.homepage.Important")}</h2>
          <p className="Terms-desc">{t("home_page.homepage.cover")}.</p>

          <ol start={54} className="Terms-desc">
            <li>
              <strong> {t("home_page.homepage.Professional")}:</strong> .
              {t("home_page.homepage.liable")}
            </li>
            <li>
              <strong>{t("home_page.homepage.outside")}:</strong> .
              {t("home_page.homepage.beyond")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Notices")}:</strong> .
              {t("home_page.homepage.notices")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Exclusion")}:</strong>.
              {t("home_page.homepage.non_excludable")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Export")}:</strong>.
              {t("home_page.homepage.embargo")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Excluded")}:</strong>{" "}
              {t("home_page.homepage.Computer")}.
            </li>
            <li>
              <strong>{t("home_page.homepage.Blocking")}:</strong>{" "}
              {t("home_page.homepage.relationship")}.
            </li>
            <li>
              <strong> {t("home_page.homepage.parties")}:</strong>{" "}
              {t("home_page.homepage.constituting")}.
            </li>
            <li>
              <strong> {t("home_page.homepage.these")}:</strong> .
              {t("home_page.homepage.retrospectively")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Enforcement")}:</strong> .
              {t("home_page.homepage.enforceable")}
            </li>
            <li>
              <strong>{t("home_page.homepage.Interpretation")}:</strong> .
              {t("home_page.homepage.limitation")}
            </li>
            <li>
              <strong>{t("home_page.homepage.contracting")}:</strong>.
              {t("home_page.homepage.regulations")}
            </li>
          </ol>
        </Container>
        <br />
        <br />
      </div>
      <Whatsapp />
      {/* <ChatBot /> */}
      <WebsiteFooter />
    </>
  );
}

export default withTranslation()(Terms);
