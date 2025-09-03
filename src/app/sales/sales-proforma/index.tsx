import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import Salesproformatable from "./datatable";
import { useAccessControl } from "../../../utils/accessControl";

const SaleInvoiceProforma = () => {
  const { t } = useTranslation();
  const { canCreateSales } = useAccessControl();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState([]);
  const adminid = user?.id;

  const [isLoading, setisLoading] = useState(true);
  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;

  const fetchSalesProformaInvoice = async () => {
    const sales_proforma_invoice_url =
      API.SALES_LIST +
      `${adminid}/${createdBy}/${
        user?.companyInfo?.id
      }/proforma?order=DESC&page=${1}&take=${10}`;
    try {
      const { data }: any = await GET(sales_proforma_invoice_url, null);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesProformaInvoice();
  }, []);

  const deleteHandler = async (id: number) => {
    try {
      let url = API.DELETE_SALES_INVOICE + id + "/proforma";
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Invoice deleted successfully",
        });
        fetchSalesProformaInvoice();
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
        title={t("home_page.homepage.Proforma_Invoice")}
        goBack={"/dashboard"}
        secondPathText={t("home_page.homepage.Proforma_Invoice")}
        secondPathLink={"/usr/sales-proforma-invoice"}
      >
        <div>
          {canCreateSales() && (
            <Button
              type="primary"
              onClick={() => navigate(`/usr/proforma-invoice-form/create/0`)}
            >
              {t("home_page.homepage.add_performa_invoice")}
            </Button>
          )}
        </div>
      </PageHeader>
      <br />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Salesproformatable
            List={data}
            onItemSelect={() => {}}
            deleteHandler={deleteHandler}
          />
        )}
      </Container>
    </div>
  );
};

export default SaleInvoiceProforma;
