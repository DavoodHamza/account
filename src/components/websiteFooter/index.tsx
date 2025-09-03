import { Col, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { FiYoutube } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { LiaFacebookSquare } from "react-icons/lia";
import { SlSocialTwitter } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import call from "../../assets/images/call.webp";
import mail from "../../assets/images/mail.webp";
import TAXGOLOGO from "../../assets/images/TAXGO LOGO WHOTE 1.webp";
import "./styles.scss";

function WebsiteFooter(props: any) {
  const { t } = props;
  const navigate = useNavigate();
  const company = () => {
    navigate("/login", { state: { type: "company" } });
  };
  const accounting = () => {
    navigate("/login", { state: { type: "accounting" } });
  };
  return (
    <div className="WebsiteFooter-bg">
      <div className="WebsiteFooter-coveringDiv">
        <Row>
          <Col lg={3} md={5} sm={7} className="order-1">
            <div className="WebsiteFooter-div1">
              <img
                src={TAXGOLOGO}
                className="WebsiteFooter-taxgoLogo"
                alt="taxgo"
              />
              <div className="WebsiteFooter-miniText d-none d-sm-block">
                <img style={{ paddingRight: "10px" }} src={call} />
                <span>+1-929-999-4465</span>
                <div style={{ marginLeft: 33 }}>
                  <div> +353-1-906-9643</div>
                  <div>+353-1-554-9629</div>
                </div>
              </div>
              <div className="WebsiteFooter-miniText d-none d-sm-block">
                <img style={{ paddingRight: "10px" }} src={mail} />
                info@taxgoglobal.com
              </div>
            </div>
          </Col>
          <Col lg={3} md={3} sm={5} xs={6} className="order-3 order-sm-2">
            <div className="WebsieFooter-textMainDiv">
              <div className="WebsiteFooter-miniText">
                <div className="WebsiteFooter-taitil">
                  {t("home_page.homepage.product")}
                </div>
                <Link
                  to="/taxCalculator"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.tax_calculator")}</div>
                </Link>
                <div onClick={accounting} style={{ cursor: "pointer" }}>
                  {t("home_page.homepage.accounting")}
                </div>
                <Link
                  to="https://www.retailxpress.net"
                  target="_blank"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.Retail_Express")}</div>
                </Link>
                <Link
                  to="/consulting"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.consulting")}</div>
                </Link>
                <Link
                  to="/payroll"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.payroll")}</div>
                </Link>
                <div className="WebsiteFooter-taitil">AFFILIATION</div>
                <Link
                  to="/affiliate-login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>Affiliate Login</div>
                </Link>

                <Link
                  to={"/terms"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="pt-3 d-sm-none d-xs-block websiteFooter-textLast">
                    {t("home_page.homepage.terms")}
                  </div>
                </Link>
              </div>
            </div>
          </Col>
          <Col lg={3} md={4} sm={5} xs={6} className="order-4 order-sm-3">
            <div className="WebsieFooter-textMainDiv">
              <div className="WebsiteFooter-miniText">
                <div className="WebsiteFooter-taitil">
                  {t("home_page.homepage.about")}
                </div>
                <div onClick={company} style={{ cursor: "pointer" }}>
                  {t("home_page.homepage.Company_footer")}
                </div>
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="d-none d-sm-block">
                    {t("home_page.homepage.newspage")}
                  </div>
                </Link>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.Sign_Up")}</div>
                </Link>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.login")}</div>
                </Link>
                <Link
                  to="/plans"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>{t("home_page.homepage.plans")}</div>
                </Link>
                <Link
                  to="/terms"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="d-none d-sm-block">
                    {t("home_page.homepage.Terms")}
                  </div>
                </Link>
                <Link
                  to="/privacy"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="d-none d-sm-block">
                    {t("home_page.homepage.Privacy_policy_footer")}
                  </div>
                </Link>
                <Link
                  to="/privacy"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="pt-5 d-sm-none d-xs-block websiteFooter-textLast">
                    {t("home_page.homepage.privacy")}
                  </div>
                </Link>
              </div>
            </div>
          </Col>
          <Col lg={3} md={12} sm={7} className="order-2 order-sm-4">
            <div className="WebsiteFooter-div3">
              <div className="WebsiteFooter-socialMedia">
                <div className="WebsiteFooter-taitil d-none d-sm-block">
                  {t("home_page.homepage.find_us")}
                </div>
                <br className="d-none d-sm-block" />
                <div className="d-flex justify-content-between">
                  <a
                    href="https://www.facebook.com/taxgoglobal/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LiaFacebookSquare size={30} color="#D3D3D3" />
                  </a>
                  <a
                    href="https://www.instagram.com/tax_go/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoLogoInstagram size={30} color="#D3D3D3" />
                  </a>
                  <a
                    href="https://www.twitter.com/taxgoglobal/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SlSocialTwitter size={30} color="#D3D3D3" />
                  </a>
                  <a
                    href="https://www.youtube.com/@taxgoglobal9871"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiYoutube size={30} color="#D3D3D3" />
                  </a>
                </div>
                <br className="d-none d-sm-block" />
                <br />
                {/* <div className="WebsiteFooter-taitil d-none d-sm-block">
                  {t("home_page.homepage.Download-Apps")}
                </div>
                <br className="d-none d-sm-block" />
                <div>
                  <img src={image1} />
                  &nbsp; &nbsp;
                  <img src={image2} />
                </div> */}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="WebsiteFooter-final">
        <a className="WebsiteFooter-final">© www.taxgoglobal.com</a> 2024 .
        {"    "} {t("home_page.homepage.Privacy")}
        {"    "}
        {t("home_page.homepage.Terms_and_Conditions")}
        {"   "}
        {t("home_page.homepage.All_rights_reserved")}
      </div>
    </div>
  );
}

export default withTranslation()(WebsiteFooter);
