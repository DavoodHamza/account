import React from "react";
import PageHeader from "../../../components/pageHeader";
import StocksummaryTable from "../StockSummary/stocksummarytable";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StockSummary = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader firstPathText="Report" title={t("home_page.homepage.STOCKSUMMARY")}
      firstPathLink="/usr/report"
      secondPathText={t("home_page.homepage.stocksummary")}
      secondPathLink={location.pathname} 
      />

      <>
        <Container>
          <StocksummaryTable />
        </Container>
      </>
    </>
  );
};

export default StockSummary;
