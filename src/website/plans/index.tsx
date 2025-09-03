import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";


import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import Whatsapp from "../../components/whatsapp";

/** 
 * Make sure fetchUserLocationPricing returns
 * monthlyPrice / annualPrice 
 */
import { fetchUserLocationPricing } from "../../utils/pricing";

import "./style.scss"; // Our SCSS from above

function Plans() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [pricing, setPricing] = useState({
    country: "International",
      currencySymbol: "€",
      monthlyPrice: "9.9",
      annualPrice: "119.9",
      currencyCode: "EUR",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const data = await fetchUserLocationPricing();
      setPricing(data);
    })();
  }, []);

  return (
    <div className="bg-image">
      <WebsiteHeader />

      <div className="pricing-componentCover">

        <Container>
          <Row>
            <Col className="text-center">
              <h2 className="pricing-top-heading"> {t("home_page.homepage.needs")}</h2>
              <p className="pricing-subheading">
                {t("home_page.homepage.needsheading")}

              </p>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col xs={12}>
              <div className="planBoxParent">
                <div className="planbox-left">
                  <div className="planbox-heading">
                    {pricing.country} ({pricing.currencyCode})
                  </div>

                  <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

                  <div className="planbox-subtext">
                    {t("home_page.homepage.subheadingneeds")}
                  </div>

                 
                  <div className="planbox-price">
                    {pricing.currencySymbol}
                    {pricing.monthlyPrice}/{t("home_page.homepage.Monthly")}
                  </div>

                  
                  <div className="planbox-annual">
                    {pricing.currencySymbol}
                    {pricing.annualPrice}/{t("home_page.homepage.Yearly")}
                  </div>

                  <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

                  <div className="planbox-subtext">
                  {t("home_page.homepage.aftertext")}
                  {pricing.currencySymbol}{pricing.monthlyPrice}
                     {t("home_page.homepage.beforetext")}

                     
                  </div>
                </div>

                <div className="planbox-right">
                  <div className="planbox-heading">                      {t("home_page.homepage.fetauegot")}
                  </div>

                  
                  <div className="feature-item">
                    <BsCheckCircleFill className="icon" />
                    {t("home_page.homepage.issuess")}
                    
                  </div>
                  <div className="feature-item">
                    <BsCheckCircleFill className="icon" />
                    {t("home_page.homepage.unlimitedd")}
                    
                  </div>
                  <div className="feature-item">
                    <BsCheckCircleFill className="icon" />
                    {t("home_page.homepage.banikkigforall")}
                    
                  </div>
                  <div className="feature-item">
                    <BsCheckCircleFill className="icon" />
                    {t("home_page.homepage.automete")}

                    
                  </div>

                  <div className="planbox-subtext">
                    
                  </div>

                  <button
                    className="planbox-button"
                    onClick={() => navigate("/signup")}
                  >
                     {t("home_page.homepage.get_started")}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Whatsapp />
      <WebsiteFooter />
    </div>
  );
}

export default Plans;
