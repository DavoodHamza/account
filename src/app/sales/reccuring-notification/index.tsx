import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import ReccuringNotificationTable from "./datatable";
import PageHeader from "../../../components/pageHeader";
import { useLocation } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";

const RecoveryNotification = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const { user } = useSelector((state: any) => state.User);

  useEffect(() => {
    getDetails();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    await getDetails();
  };

  const getDetails = async () => {
    try {
      const userData = API.GET_RECCURING_LIST + user?.companyInfo?.id;
      const response: any = await GET(userData, null);
      if(response?.status){
        setList(response?.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        firstPath={location?.pathname.slice(5)}
        firstPathLink={location.pathname.replace("/create", "")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Reccuring_Notification")}
        secondPathText ={t("home_page.homepage.Reccuring_Notification")}
        secondPathLink={location.pathname}
      />
        {isLoading ? (
        <LoadingBox />
      ) : (
        <ReccuringNotificationTable
          list={list}
          refreshData = {refreshData}
        />
      )}
    </div>
  );
};

export default RecoveryNotification;
