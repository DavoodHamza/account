import { useEffect, useState } from "react";
import "../styles.scss";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate, Outlet } from "react-router-dom";
import Table from "./component/table";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const PurchaceInvoice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const Dtoday = moment().endOf("month");
  const DoneMonthAgo = moment(new Date().setDate(1));
  const { user } = useSelector((state: any) => state.User);
  const {
    canCreatePurchases,
    canUpdatePurchases,
    canDeletePurchases,
    staffAccess,
  } = useAccessControl();
  const adminid: any = user?.id;

  const [isLoading, seisLoading] = useState(true);
  const [list, setList] = useState([]);
  const [sdate, setSdate] = useState(Dtoday.format("YYYY-MM-DD"));
  const [ldate, setLdate] = useState(DoneMonthAgo.format("YYYY-MM-DD"));

  useEffect(() => {
    fetchSaleInvoiceList(
      DoneMonthAgo.format("YYYY-MM-DD"),
      Dtoday.format("YYYY-MM-DD")
    );
  }, []);

  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;
  const fetchSaleInvoiceList = async (sdate: any, ldate: any) => {
    try {
      seisLoading(true);
      let url =
        API.PURCHASE_INVOICELIST_BY_DATE +
        `${adminid}/${createdBy}/${user?.companyInfo?.id}/purchase/${sdate}/${ldate}`;
      const response: any = await GET(url, "");
      if (response) {
        setList(response.res);
        setSdate(sdate);
        setLdate(ldate);
        seisLoading(false);
      }
    } catch (error) {
      console.log(error, "error-------------->");
      seisLoading(false);
    }
  };

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_PURCHASE_INVOICE + id + "/purchase";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchSaleInvoiceList(
          DoneMonthAgo.format("YYYY-MM-DD"),
          Dtoday.format("YYYY-MM-DD")
        );
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
        title={t("home_page.homepage.Purchase_Invoice")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Purchase_Invoice")}
        secondPathLink={"/usr/purchace-invoice"}
      >
        <div>
          {canCreatePurchases() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/purchace-invoice-form/create/0`)}
            >
              {t("home_page.homepage.add_saleinvoice")}
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
            fetchSaleInvoiceList={(sdate: any, ldate: any) =>
              fetchSaleInvoiceList(
                sdate.format("YYYY-MM-DD"),
                ldate.format("YYYY-MM-DD")
              )
            }
            ldate={ldate}
            sdate={sdate}
            deleteHandler={deleteHandler}
            canUpdatePurchases={canUpdatePurchases}
            canDeletePurchases={canDeletePurchases}
          />
        )}
      </Container>
      <Outlet />
    </div>
  );
};

export default PurchaceInvoice;
