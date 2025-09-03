import React, { useEffect, useState } from "react";
import Table from "../components/table";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import { useNavigate } from "react-router-dom";
import CreateSettings from "../components/form";
import { notification } from "antd";

function PayHead() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [initalValue, setInitalValue] = useState({});
  const [id, setId] = useState("create");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const adminid = user?.id;

  const columns = [
    {
      name: "laccount",//"name",
      title: "Pay Head Name",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "type",
      title: "Pay Head Type",
      dataType: "string",
      alignment: "center",
    },
    {
      name: "ledgerCategory",
      title: "Ledger",
      dataType: "string",
      alignment: "center",
    },
  ];
  useEffect(() => {
    fetcEmployeeCategory();
  }, []);
  const fetcEmployeeCategory = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.PAYROLLPAYHEAD_LIST_USER + `${adminid}`;
      const data: any = await GET(unit_url, null);
      let modifiedData = data?.data?.map((item: any) => ({
        ...item,
        ledgerCategory: item?.categoryDetails?.category,
      }));
      setData(modifiedData);
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false);
    }
  };

  const fetchEmplyeeCategoryDelete = async (id: any) => {

    try {
      let url = API.PAYROLLPAYMENT_DELETE + id;
      const data: any = await DELETE(url);
      if (data) {
        notification.success({
          message: "Deleted Succesfully",
          description: "Your pay head has been deleted successfully.",
        });
        fetcEmployeeCategory();
      }
    } catch(error) {
      console.log(error);
      notification.error({message:"something went wrong"});
    }
  };
  const payHeadGetById = async (id: any) => {
    try {
      let url = API.PAYROLLPAYMENT_GET_BYID + id;
      let data: any = await GET(url, {});

      let inital = {
        name: data?.name,
        type: data?.ledgercategory,
        ledgercategory: data?.type,
        calculationPeriods: data?.calculationPeriods,
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
          title={window.innerWidth <= 480 ? "" : "Pay Head"}
          onBtnClick={() => {
            setId("create");
            setIsForm(true);
          }}
          handleDeleteClick={fetchEmplyeeCategoryDelete}
          handleEditClick={payHeadGetById}
        />
      )}
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setIsForm(false);
            setInitalValue({});
          }}
          source={"payHead"}
          id={id}
          reload={fetcEmployeeCategory}
          initalValue={initalValue}
        />
      ) : null}
    </div>
  );
}

export default PayHead;
