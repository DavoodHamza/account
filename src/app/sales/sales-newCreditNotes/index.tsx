import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import NewCreditNotesTable from "./NewCreditNoteTable";
import { useTranslation } from "react-i18next";

const SaleNewCreditNotes = () => {
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const adminid = user?.id;
  const { t } = useTranslation();

  const fetchCreditNotes = async () => {
    try {
      setIsLoading(true);
      const credit_note_url = API.ALL_CREDIT_NOTES + adminid;
      const { data }: any = await GET(credit_note_url, null);

      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCreditNotes();
  }, []);

  return (
    <div>
      {t("home_page.homepage.sales_credit_note")}
      <div style={{ backgroundColor: "#Ffff", padding: "10px" }}>
        <NewCreditNotesTable List={data} onItemSelect={() => { }} />
      </div>
    </div>
  );
};

export default SaleNewCreditNotes;
