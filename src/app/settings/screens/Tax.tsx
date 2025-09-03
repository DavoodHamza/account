import React, { useEffect, useState } from "react";
import Table from "../components/table";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import CreateSettings from "../components/form";
import { useTranslation } from "react-i18next";
import { notification } from "antd";

function Tax() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [initalValue, setInitalValue] = useState({});
  const [id, setId] = useState("create");
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const adminid = user?.id;

  const columns = [
    {
      title:`${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
    },
    {
      name: "type",
      title: `${t("home_page.homepage.Tax_Type")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "percentage",
      title:`${t("home_page.homepage.Percentage")}`,
      dataType: "string",
      alignment: "center",
    },
  ];
  useEffect(() => {
    fetchTaxList();
  }, []);
  const fetchTaxList = async () => {
    try {
      setIsLoading(true);
      let url = API.TAX_MASTER  + `list/${adminid}/${user?.companyInfo?.id}`;
      const {data}: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false);
    }
  };

  const deleteTaxPercentage = async (id: any) => {

    try {
      let url = API.TAX_MASTER + id;
      const data: any = await DELETE(url);
      if (data) {
        notification.success({
          message: "Deleted Succesfully",
          description: "Tax percentage deleted successfully.",
        });
        fetchTaxList();
      }
    } catch(error) {
      console.log(error);
      notification.error({message:"something went wrong"});
    }
  };
  const fetchTaxById = async (id: any) => {
    try {
      let url = API.TAX_MASTER + id;
      let data: any = await GET(url, {});

      let inital = {
        type: data?.type,
        percentage: data?.percentage,
        countryid:data?.countryid,
        cgst:Number(data?.percentage)/2,
        sgst:Number(data?.percentage)/2,
      };

      setInitalValue(inital);
      setId(id);
      setTimeout(() => {
        setIsForm(true);
      }, 100);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          data={data}
          columns={columns}
          title={window.innerWidth <= 480 ? "" : `${t("home_page.homepage.Tax_List")}`}
          onBtnClick={() => {
            setId("create");
            setIsForm(true);
          }}
          handleDeleteClick={deleteTaxPercentage}
          handleEditClick={fetchTaxById}
        />
      )}
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            setInitalValue({});
          }}
          source={"tax"}
          tittle={t("home_page.homepage.taxx")}
          id={id}
          reload={fetchTaxList}
          initalValue={initalValue}
        />
      ) : null}
    </div>
  );
}

export default Tax;
