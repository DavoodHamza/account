import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LedgerTable from "../component/table";
import AddLedger from "./addLedger";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";
const LedgerMyLedger = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const location = useLocation();
  const { canCreateLedgers, canUpdateLedgers, canDeleteLedgers } = useAccessControl();
  const [edit, setEdit] = useState<any>();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addLedgerModal, setAddLedgerModal] = useState(false);

  useEffect(() => {
    fetchLedgerList();
  }, []);

  const fetchLedgerList = async () => {
    try {
      setIsLoading(true);
      let URL = API.GET_MY_LEDGERS + user?.id + '/' + user?.companyInfo?.id;
      const { data }: any = await GET(URL, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const column = [
    {
      name: "id",
      title: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
      },
    {
      name: "nominalcode",
      title: t("home_page.homepage.Nominal_Code"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "laccount",
      title: t("home_page.homepage.Ledger_Account"),
      alignment: "center",
    },
    {
      name: "categoryDetails.category",
      title:t("home_page.homepage.Category"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "groupDetails.categorygroup",
      title: t("home_page.homepage.Category_Group"),
      dataType: "string",
      alignment: "center",
    },
  ];
  const handleOnEdit = (val: any) => {
    setEdit(val?.row?.data);
    setAddLedgerModal(true);
  };

  return (
    <>
      <PageHeader
        title={t("home_page.homepage.My_Ledger")}
        firstPath={location?.pathname.slice(5)}
        secondPathLink={location.pathname}
        secondPathText={t("home_page.homepage.My_Ledger")}
        goBack={"/usr/productStock"}
      >
        <div>
          {canCreateLedgers() && (
            <Button type="primary" onClick={() => setAddLedgerModal(true)}>
            {t("home_page.homepage.Add_Ledger")}
            </Button>
          )}
        </div>
        </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <LedgerTable
          products={data}
          columns={column}
          onItemSelect={() => {}}
          onPageChange={(p: any, t: any) => {}}
          onSuccess={() => fetchLedgerList()}
          title={t("home_page.homepage.My_Ledger")}
          type = 'My Ledgers'
          myLedgerOnEdit={(item: any) => handleOnEdit(item)}
          canUpdateLedgers={canUpdateLedgers}
          canDeleteLedgers={canDeleteLedgers}
        />
      )}
      {addLedgerModal && (
        <AddLedger
          onOpen={addLedgerModal}
          onClose={() => {
            setAddLedgerModal(false);
            setEdit(null);
          }}
          onSuccess={() => fetchLedgerList()}
          edit={edit}
        />
      )}
    </>
  );
};

export default LedgerMyLedger;
