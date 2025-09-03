import { useEffect, useState } from "react";
import "../styles.scss";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import Table from "./table";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import { Container } from "react-bootstrap";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const PurchaseAsset = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const { canCreatePurchases, canUpdatePurchases, canDeletePurchases } =
    useAccessControl();
  const adminid = user?.id;
  const [isLoading, seisLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchProductStockList();
  }, []);

  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;

  const fetchProductStockList = async () => {
    try {
      const url =
        API.PURCHASE_INVOICE_LIST +
        `${adminid}/${createdBy}/${user?.companyInfo?.id}/stockassets`;
      const { data }: any = await GET(url, null);
      if (data) {
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
  const location = useLocation();

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_PURCHASE_INVOICE + id + "/stockassets";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchProductStockList();
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
        title={t("home_page.homepage.Purchase_Asset")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Purchase_Asset")}
        secondPathLink={location.pathname}
      >
        <div>
          {canCreatePurchases() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/purchase-asset-form/create/${0}`)}
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

export default PurchaseAsset;
