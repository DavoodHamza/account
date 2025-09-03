import { useEffect, useState } from "react";
import { GET } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/pageHeader";
import Table from "../components/table";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import ExcelImport from "../../../components/ExcelImport";
import { Button, Tooltip } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const ProductNonStock = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { canCreateProducts } = useAccessControl();

  const gdpFormat = {
    type: "percent",
    precision: 1,
  };
  const columns = [
    {
      name: "id",
      title: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
      // cellRender: (data: any) => (page - 1) * take + data?.rowIndex + 1,
    },
    {
      name: "icode",
      title: t("home_page.homepage.code"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "idescription",
      title: t("home_page.homepage.ItemName"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "itemtype",
      title: t("home_page.homepage.Type_product"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "vat",
      title: user?.companyInfo?.tax === "gst" ? "GST%" : "VAT%",
      dataType: "string",
      alignment: "center",
      format: { gdpFormat },
    },
  ];
  let template = API.SAMPLE_PRODCUT_EXCEL;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});
  const [excelModal, setExcelModal] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  const loadData = async (page: any, take: any) => {
    setIsLoading(true);
    try {
      let product_url =
        API.PRODUCT_MASTER_USER +
        `Nonstock/${user?.id}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
      const { data, meta }: any = await GET(product_url, null);
      setData(data);
      setMeta(meta);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onPageChange = (page: any, take: any) => {
    loadData(page, take);
    setPage(page);
    setTake(take);
  };
  useEffect(() => {
    loadData(page, take);
  }, [page, take]);
  return (
    <div>
      <PageHeader
        goBack={"/usr/productStock"}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.product_stock_list")}
        title={t("home_page.homepage.nonstock_item")}
      >
        <div>
          <Tooltip title={t("home_page.homepage.Import_from_Excel")}>
            <Button onClick={() => setExcelModal(true)}>
              <SiMicrosoftexcel size={20} />
            </Button>
          </Tooltip>
          &nbsp;
          {canCreateProducts() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/create-product/Nonstock/create/0")}
            >
              {t("home_page.homepage.add_nonstock")}
            </Button>
          )}
        </div>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          products={data}
          total={meta?.itemCount}   
          columns={columns}
          take={take}
          page={page}
          title={t("home_page.homepage.Nonstock")}
          onPageChange={(page: any, take: any) => onPageChange(page, take)}
          onSuccess={() => loadData(page, take)}
        />
      )}
      {excelModal ? (
        <ExcelImport
          visible={excelModal}
          onCancel={() => setExcelModal(false)}
          onSucess={() => loadData(page, take)}
          URL={API.ADD_PRODUCT_VIA_EXCEL}
          template={template}
          type={"Stock"}
        />
      ) : null}
    </div>
  );
};

export default ProductNonStock;
