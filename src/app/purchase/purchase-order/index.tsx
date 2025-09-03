import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import PurchaseOrderTable from "./table";
import { useAccessControl } from "../../../utils/accessControl";

const PurchaseOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const { canCreatePurchases, canUpdatePurchases, canDeletePurchases } =
    useAccessControl();
  const [data, setData] = useState([]);
  const adminid = user?.id;

  const [isLoading, setisLoading] = useState(true);
  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;

  const fetchPurchaseOrder = async () => {
    const url =
      API.PURCHASE_INVOICE_LIST +
      `${adminid}/${createdBy}/${user?.companyInfo?.id}/order`;
    try {
      const { data, status }: any = await GET(url, null);
      if (status) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    fetchPurchaseOrder();
  }, []);

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_PURCHASE_INVOICE + id + "/order";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchPurchaseOrder();
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
        title={t("sidebar.title.purchace_order")}
        goBack={"/dashboard"}
        secondPathText={t("sidebar.title.purchace_order")}
        secondPathLink={"/usr/purchase-order"}
      >
        <div>
          {canCreatePurchases() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/purchase-order-form/create/0`)}
            >
              + {t("home_page.homepage.create_purchase_order")}
            </Button>
          )}
        </div>
      </PageHeader>
      <br />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <PurchaseOrderTable
            List={data}
            deleteHandler={deleteHandler}
            canUpdatePurchases={canUpdatePurchases}
            canDeletePurchases={canDeletePurchases}
          />
        )}
      </Container>
    </div>
  );
};

export default PurchaseOrder;
