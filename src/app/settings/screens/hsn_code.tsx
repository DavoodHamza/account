import { useEffect, useState } from "react";
import Table from "../components/table";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import CreateSettings from "../components/form";
import { notification } from "antd";

function HsnCode() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [id, setId] = useState("create");
  const [initalValue, setInitalValue] = useState({});

  const [data, setData] = useState([]);
  const adminid = user?.id;

  const columns = [
    {
      name:"id",
      title: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "hsn_code",
      title: "HSN/SAC",
      dataType: "string",
      alignment: "center",
    },
    {
        name: "description",
        title: "Description",
        dataType: "string",
        alignment: "center",
      },
  ];
  useEffect(() => {
    fetchHsnCodes();
  }, []);

  const fetchHsnCodes = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.HSN_CODE_LIST + adminid + '/' + user?.companyInfo?.id;
      const {data}: any = await GET(unit_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  const deleteHsnCode = async (id: any) => {
    try {
      let url = `hsn_code/` + id;
      const {status}: any = await DELETE(url);
      if (status) {
        notification.success({
          message: "Success",
          description: "HSN/SAC code has been deleted successfully.",
        });
        fetchHsnCodes();
      }else{
        notification.error({
            message: "Failed",
            description: "Failed to delete HSN/SAC code",
          });
      }
    } catch(error) {
      console.log(error);
    }
  };

  
  const fetchOneHsnCode = async (id: any) => {
    try {
      let url = `hsn_code/` + id;
      let {data}: any = await GET(url, {});
      let inital = {
        hsn_code: data?.hsn_code,
        description: data?.description,
      };

      setInitalValue(inital);
      setId(id);
      setTimeout(() => {
        setIsForm(true);
      }, 100);
    } catch (error) {}
  };

  return (
    <div>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          data={data}
          columns={columns}
          title={window.innerWidth <= 480 ? "" : "HSN/SAC"}
          onBtnClick={() => {
            setIsForm(true);
            setId("create");
          }}
          handleEditClick={fetchOneHsnCode}
          handleDeleteClick={deleteHsnCode}
        />
      )}

      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setInitalValue({});
            setIsForm(false);
          }}
          source={"hsnCode"}
          id={id}
          reload={() => fetchHsnCodes()}
          initalValue={initalValue}
        />
      ) : null}
    </div>
  );
}

export default HsnCode;
