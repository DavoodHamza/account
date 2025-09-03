

import React from "react"
import { useTranslation } from "react-i18next";
export const CardItems = () => {
  const { t } = useTranslation();

  return ([
    {
      id: "1",
      name: t("home_page.homepage.vat"),
      subheader: t("home_page.homepage.Tax_Report"),
      link: '/usr/report/vatReturns'
    },
    {
      id: "11",
      name:  t("home_page.homepage.GST"),
      subheader: t("home_page.homepage.Tax_Report"),
      link: '/usr/report/vatReturns'
    },
    {
      id: "2",
      name:  t("home_page.homepage.BalanceSheet"),    
      subheader:  t("home_page.homepage.Financial_Report"),
      link: '/usr/report/BalanceSheet'
    },
    {
      id: "3",
      name: t("home_page.homepage.Profit_Loss"),  
      subheader: t("home_page.homepage.Income_Report"),    
      link: '/usr/report/profitloss'
    },
    {
      id: "4",
      name:  t("home_page.homepage.Trial_Balance"), 
      subheader:  t("home_page.homepage.Tax_Report"), 
      link: '/usr/report/TrialBalance'
    },
    {
      id: "10",
      name: t("home_page.homepage.Day_Report"), 
      subheader: t("home_page.homepage.Overview of Daily Transactions"), 
      link: '/usr/report/dayReport'
    },
    {
      id: "5",
      name:  t("home_page.homepage.Sundry_Creditors"),
      subheader:t("home_page.homepage.Financial_Report"),
      link: '/usr/report/sundryCreditors'
    },
    {
      id: "6",
      name: t("home_page.homepage.Sundry_Debtors"),
      subheader: t("home_page.homepage.Financial_Report"),   
      link: '/usr/report/sundryDebtors'
    },
    {
      id: "7",
      name:  t("home_page.homepage.STOCKSUMMARY"),
      subheader:t("home_page.homepage.Stock_Report"), 
      link: '/usr/report/stockSummary'
    },
    {
      id: "8",
      name: t("home_page.homepage.HSN/SAC_Summary"), 
      subheader: t("home_page.homepage.Financial_Report"),  
      link: '/usr/report/hsn_sac'
    },
    {
      id: "9",
      name: t("home_page.homepage.Staff Analysis"),   
      subheader:t("home_page.homepage.Financial_Report"), 
      link: '/usr/report/staff-analysis'
    },
    {
      id: "10",
      name: t("home_page.homepage.Account_Ledger"),     
      subheader: t("home_page.homepage.Ledger_Report"),   
      link:'/usr/report/account-ledger'
    },
  ])
}
