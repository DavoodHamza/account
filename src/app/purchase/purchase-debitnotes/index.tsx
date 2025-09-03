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
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const PurchaceDebitnotes = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const { canCreatePurchases, canUpdatePurchases, canDeletePurchases } =
    useAccessControl();
  const adminid = user?.id;
  const [isLoading, seisLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchSaleInvoiceList();
  }, []);
  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;

  const fetchSaleInvoiceList = async () => {
    try {
      const url =
        API.PURCHASE_INVOICE_LIST +
        `${adminid}/${createdBy}/${user?.companyInfo?.id}/pcredit`;
      const { data }: any = await GET(url, null);
      if (data.length) {
        setList(data);
      } else {
        setList([]);
      }
      seisLoading(false);
    } catch (error) {
      console.log(error);
      seisLoading(false);
    }
  };

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_PURCHASE_INVOICE + id + "/pcredit";
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
        title={t("home_page.homepage.Debit_Notes")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Purchase_Debitnotes")}
        secondPathLink={"/usr/purchase-debit-note"}
      >
        <div>
          {canCreatePurchases() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/purchace-debitnote-form/create`)}
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
            onItemSelect={() => {}}
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

export default PurchaceDebitnotes;
