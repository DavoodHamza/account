import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

import Logo2 from "../../assets/images/logo2.webp";
import "./styles.scss";

import { useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { GrMailOption } from "react-icons/gr";

import EmailLogin from "./emailLogin";
import GmailLogin from "./gmailLogin";
import OldLogin from "./oldLogin";
import PhoneLogin from "./phoneLogin";

import Whatsapp from "../../components/whatsapp";

function Login(props: any) {
  const { t } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const [useEmail, setUseEmail] = useState(true);

  return (
    <div>
      <Container fluid>
        <Row>
          <Col sm={6} xs={12} md={8} className="p-0">
            <div className="website-LoginBox1">
              <img src={Logo2} width={300} alt="TaxGo logo" />
            </div>
          </Col>
          <Col sm={6} xs={12} md={4} className="p-0">
            <div className="website-LoginBack" onClick={() => navigate(-1)}>
              <BiArrowBack size={24} />
            </div>
            <div className="website-LoginBox2">
              <h2 className="website-Logintxt1">
                {t("home_page.homepage.Sign_In")} <small>v2</small>
              </h2>

              <p className="website-Logintxt2">
                {t("home_page.homepage.First_time_on_Tax_")}
                <br />
                {t(
                  "home_page.homepage.Please reset your password to continue accounting."
                )}
              </p>

              <OldLogin />

              <div className="website-LoginLine" />

              <div className="website-Logintxt6">
                <span className="website-Logintxt5">or</span>
              </div>

              {useEmail ? (
                <>
                  <EmailLogin type={location.state?.type} />
                  <div
                    className="website-LoginBtn1"
                    onClick={() => setUseEmail(false)}
                  >
                    <FaMobileAlt size={20} className="me-2" />
                    {t("home_page.homepage.Login_with_Phone")}
                  </div>
                </>
              ) : (
                <>
                  <PhoneLogin />
                  <div
                    className="website-LoginBtn1"
                    onClick={() => setUseEmail(true)}
                  >
                    <GrMailOption size={20} className="me-2" />
                    {t("home_page.homepage.Login_with_Email")}
                  </div>
                </>
              )}

              <GmailLogin />

              <p className="website-Logintxt4">
                {t("home_page.homepage.Notayet")}{" "}
                <span
                  className="website-Logintxt3"
                  onClick={() => navigate("/signup")}
                >
                  {t("home_page.homepage.Sign_Up")}
                </span>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <Whatsapp />
      {/* <ChatBot /> */}
    </div>
  );
}

export default withTranslation()(Login);
