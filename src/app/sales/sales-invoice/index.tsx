import React, { useEffect, useState } from "react";
import "../styles.scss";
import { useSelector } from "react-redux";

import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";

import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";

import Table from "./table";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAccessControl } from "../../../utils/accessControl";

const SalesInvoice = () => {
  const { t } = useTranslation();
  const {
    canViewSales,
    canCreateSales,
    canUpdateSales,
    canDeleteSales,
    hasAnySalesPermission,
  } = useAccessControl();
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [isLoading, seisLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchSaleInvoiceList();
  }, []);

  const fetchSaleInvoiceList = async () => {
    try {
      const url =
        API.PROFORMA_INVOICE_LIST + `${adminid}/${user?.companyInfo?.id}/sales`;
      const { data }: any = await GET(url, null);
      if (data.length) {
        setList(data);
      } else {
        setList([]);
      }
      seisLoading(false);
    } catch (error) {
      notification.error({ message: "Oops,Somthing Went Wrong... " });
      console.log(error);
      seisLoading(false);
    }
  };

  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_SALES_INVOICE + id + "/sales";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchSaleInvoiceList();
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed",
        description: "Something went wrong!! Please try again later",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title={t("home_page.homepage.sales_invoice")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.sales_invoice")}
        secondPathLink={"/usr/sales-invoice"}
      >
        <div>
          {canCreateSales() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/sale-invoice-form/${0}`)}
            >
              {t("home_page.homepage.add_new_saleinvoice")}
            </Button>
          )}
        </div>
      </PageHeader>
      <br />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Table
            List={list}
            onItemSelect={() => {}}
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
            deleteHandler={deleteHandler}
          />
        )}
      </Container>
    </div>
  );
};

export default SalesInvoice;
