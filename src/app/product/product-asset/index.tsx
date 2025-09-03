import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET} from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import { useLocation } from "react-router-dom";
import Table from "../components/table";
import LoadingBox from "../../../components/loadingBox";
import ExcelImport from "../../../components/ExcelImport";
import { Button,Tooltip } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import FixedAssetModal from "./FixedAssetModal";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const PurchaseFixedAsset = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { canCreateProducts } = useAccessControl();
  const location = useLocation();
  let template =
    "https://taxgo.s3.eu-west-1.amazonaws.com/excelTemplates/Product-ServiceSampleTemplate.xlsx";

  const adminid = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [excelModal, setExcelModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState('create');
 
  const loadData = async (page: any, take: any) => {
    setIsLoading(true);
    let URL =
      API.PRODUCT_MASTER_USER +
      `Asset/${adminid}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
    const { data }: any = await GET(URL, null);
    setData(data);
    setIsLoading(false);
  };
  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };


  useEffect(() => {
    loadData(page, take);
  }, [page, take]);
  


  const columns = [
      {
    name: "id",
    title: t("home_page.homepage.slno"),
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "idescription",
      title: t("home_page.homepage.Item"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "itemtype",
      title: t("home_page.homepage.Type"),
      dataType: "string",
      alignment: "center",
    },
  ];


  return (
    <>
      <PageHeader
        goBack={"/usr/productStock"}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.FixedAsset_List")}
        title={t("home_page.homepage.FixedAsset_List")}
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
              onClick={() => setIsOpen(true)}
            >
             {t("home_page.homepage.add_asset")}
            </Button>
          )}
        </div>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          title={t("home_page.homepage.Asset")}
          products={data}
          columns={columns}
          take={take}
          onItemSelect={() => {}}
          onPageChange={(p: any, t: any) => onPageChange(p, t)}
          onSuccess={() => loadData(page, take)}
          handleEditClick={(val: any) => {
            setIsOpen(true);
            setEdit(val);
          }}
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

      {isOpen &&  <FixedAssetModal
       edit={edit}
       setEdit={setEdit}
       setIsOpen={setIsOpen}
       isOpen={isOpen}
       loadData={loadData}
       page={page}
       take={take}
      />}
    </>
  );
};

export default PurchaseFixedAsset;
