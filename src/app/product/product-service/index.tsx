import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
// import columns from "./columns.json";
import Table from "../components/table";
import LoadingBox from "../../../components/loadingBox";
import ExcelImport from "../../../components/ExcelImport";
import { Button, Tooltip } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const ProductService = () => {
  const { user } = useSelector((state: any) => state.User);
  const { canCreateProducts } = useAccessControl();
  const columns = [
    {
      name: "icode",
      title: "Code",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "idescription",
      title: "Item",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "itemtype",
      title: "Type",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "vat",
      title: user?.companyInfo?.tax === "gst" ? "GST%" : "VAT%",
      dataType: "string",
      alignment: "center",
    },
  ];

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  let template = API.SAMPLE_PRODCUT_EXCEL;

  const adminid = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [excelModal, setExcelModal] = useState(false);

  const loadData = async (page: any, take: any) => {
    setIsLoading(true);
    let URL =
      API.PRODUCT_MASTER_USER +
      `Service/${adminid}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
    const { data, meta }: any = await GET(URL, null);
    setData(data);
    setMeta(meta);
    setIsLoading(false);
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
    <>
      <PageHeader
        goBack={"/usr/productStock"}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.Product_Service_List")}
        title={t("home_page.homepage.list_service")}
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
              onClick={() => navigate("/usr/create-product/Service/create/0")}
            >
              {t("home_page.homepage.add_service")}
            </Button>
          )}
        </div>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          title={t("home_page.homepage.Service")}
          products={data}
          total={meta?.itemCount}
          columns={columns}
          take={take}
          page={page}
          onItemSelect={() => {}}
          onPageChange={(p: any, t: any) => onPageChange(p, t)}
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
          type={"Service"}
        />
      ) : null}
    </>
  );
};

export default ProductService;
