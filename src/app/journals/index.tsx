import React, { useEffect, useState } from "react";
import JournalListTable from "./JournalTable";
import { useSelector } from "react-redux";
import API from "../../config/api";
import { DELETE, GET } from "../../utils/apiCalls";
import PageHeader from "../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import { Button, notification } from "antd";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../utils/accessControl";

const Journal = () => {
  const { t } = useTranslation();
  const { canCreateJournals, canUpdateJournals, canDeleteJournals } =
    useAccessControl();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  useEffect(() => {
    fetchJournalList();
  }, [page, take]);
  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;
  const fetchJournalList = async () => {
    try {
      setIsLoading(true);
      let journal_url =
        API.JOURNAL_LIST +
        `${adminid}/${createdBy}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
      const { data }: any = await GET(journal_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchJournalList();
  }, []);
  const navigate = useNavigate();
  const handleDelete = async (id: any) => {
    try {
      setIsLoading(true);
      const url = API.DELETE_JOURNAL + id;
      const response = await DELETE(url);
      fetchJournalList();
      notification.success({
        message: "Success",
        description: "Journal Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to delete journal, Please try aganin later !!!",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const columns = [
    {
      name: "userdate",
      title: t("home_page.homepage.Date"),
      dataType: "date",
      alignment: "center",
      format: "dd-MM-yyyy",
    },
    {
      name: "id",
      title: t("home_page.homepage.Voucher_No"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "reference",
      title: t("home_page.homepage.Particulars"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "total",
      title: t("home_page.homepage.total"),
      alignment: "center",
    },
  ];
  return (
    <div>
      <PageHeader
        firstPathLink={location?.pathname}
        firstPathText={t("home_page.homepage.Journals")}
        // buttonTxt={t("home_page.homepage.add")}
        // onSubmit={() => navigate("/usr/CreateJournal")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Journal_List")}
      >
        <div>
          {canCreateJournals() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/CreateJournal")}
            >
              + {t("home_page.homepage.add")} {t("home_page.homepage.Journals")}
            </Button>
          )}
        </div>
      </PageHeader>

      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <JournalListTable
            journals={data}
            columns={columns}
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
            handleDelete={handleDelete}
            canUpdateJournals={canUpdateJournals}
            canDeleteJournals={canDeleteJournals}
          />
          <br />
        </>
      )}
    </div>
  );
};
export default Journal;
