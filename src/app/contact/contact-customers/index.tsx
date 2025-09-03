import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import { useNavigate } from "react-router";
import PageHeader from "../../../components/pageHeader";
import { useLocation } from "react-router-dom";
import DataTable from "./dataTable";
import LoadingBox from "../../../components/loadingBox";
import { Button, notification, Tooltip } from "antd";
import { Pagination } from 'antd';

import { useTranslation } from "react-i18next";
import { SiMicrosoftexcel } from "react-icons/si";
import { useAccessControl } from "../../../utils/accessControl";
const ContactCustomers = () => {
  const { t } = useTranslation();
  const { canCreateContacts } = useAccessControl();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metaData,setmetaData] = useState<any>({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    fetchCustomerList();
  }, [page, take]);

  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;
  const fetchCustomerList = async () => {
    try {
      setIsLoading(true);
      let customer_list_url =
        API.CONTACT_MASTER_LIST +
        `customer/${adminid}/${createdBy}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
      const { data, metadata }: any = await GET(customer_list_url, null);
      setData(data);
      setmetaData(metadata);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      setIsLoading(true);
      const delete_customer_url = API.DELETE_CONTACT + id;
      const data: any = await GET(delete_customer_url,null);
      fetchCustomerList();
      if (data.status) {
        notification.success({message: "Customer Deleted Successfully"});
      }else{
        notification.error({
          message: "Something went wrong!! Please try again later",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something went wrong!! Please try again later",
      });
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  const onPageChange = (page: any, take: any) => {
    SetPage(page);
    setTake(take);
  };
  
  return (
    <>
      <PageHeader
        firstPath={location?.pathname.slice(5)}
        firstPathLink={location.pathname.replace("/create", "")}
        // buttonTxt={t("home_page.homepage.add")}
        // onSubmit={ () => navigate("/usr/contactCustomers/create")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Customers_List")}
        secondPathLink ={location.pathname}
        secondPathText ={t("home_page.homepage.Customers_List")}
      >
        <div>
          {canCreateContacts() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/contactCustomers/create")}
            >
              + {t("home_page.homepage.add")}{''} {t("sidebar.title.customer")}
            </Button>
          )}
        </div>
        </PageHeader>
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <DataTable
            list={data}
            metaData={metaData}
            onItemSelect={() => {}}
            take={take}
            title={t("home_page.homepage.Customers_List")}
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsLoading={setIsLoading}
            handleDelete={handleDelete}
          />
        )}
        <Pagination 
        total= {metaData?.itemCount || 0}
        current={page}
        pageSize={take}
        onChange={onPageChange}
        pageSizeOptions={['10', '20', '30', '40', '50']}
        />
      </div>
    </>
  );
};

export default ContactCustomers;
