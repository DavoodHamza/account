import React from "react";
import { Button, Card } from "antd";
import { TfiBarChart } from "react-icons/tfi";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { CardItems } from "./components/cardItems";
import PageHeader from "../../components/pageHeader";
import { useSelector } from "react-redux";
import { useAccessControl } from "../../utils/accessControl";

const Report = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.User);
  const { canViewReports } = useAccessControl();

  return (
    <>
      <div>
        <PageHeader
          firstPathText={t("home_page.homepage.Report")}
          firstPathLink={location?.pathname}
          title={t("home_page.homepage.taxgo_report")}
        />
        <br />
        <Container>
          <Row>
            {canViewReports() && CardItems()?.filter((card: any) => {
              if (user?.companyInfo?.tax === "vat") {
                return card.id !== '8' && card.id !== '11';
              } else {
                return card.id !== '1';
              }
            }).map((item: any) => {
              
              return (
                <>
                  <Col md={"4"}>
                    <Card>
                      <div className="Report-cardIcon-view-box">
                        <TfiBarChart className="Report-Icon" />
                        <Button onClick={() => navigate(item?.link)}>
                        {t("home_page.homepage.View")}
                        </Button>
                      </div>
                      <br />
                      <div className="width100">
                        <span className="Report-cardSubheader">
                          {item?.name}
                        </span>
                        <br />
                        <span className="Report-cardName">
                          {item?.subheader}
                        </span>
                      </div>
                    </Card>
                    <br />
                  </Col>
                </>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Report;
