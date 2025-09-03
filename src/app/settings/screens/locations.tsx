import { useEffect, useState } from "react";
import Table from "../components/table";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import CreateSettings from "../components/form";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

function Locations() {
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [id, setId] = useState("create");
  const [initalValue, setInitalValue] = useState({});

  const [data, setData] = useState([]);
  const adminid = user?.adminid;
  const { t } = useTranslation();

  const columns = [
    {
      title:`${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "location",
      title: `${t("home_page.homepage.Location")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "locationCode",
      title: `${t("home_page.homepage.code")}`,
      dataType: "string",
      alignment: "center",
    },
  ];
  useEffect(() => {
    fetchLocationGet();
  }, []);
  const fetchLocationGet = async () => {
    try {
      setIsLoading(true);
      let unit_url =
        API.LOCATION_GET_BY_USER + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLocationDelete = async (id: any) => {
    try {
      let url = API.LOCATION_DELETE + id;
      const data: any = await GET(url,null);
      if (data) {
        notification.success({
          message: "Deleted Succesfully",
          description: "Your location has been deleted successfully.",
        });
        fetchLocationGet();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const locationGet = async (id: any) => {
    try {
      let url = API.LOCATION_GETBY_ID + id;
      let data: any = await GET(url, {});
      let inital = {
        location: data?.location,
        locationCode: data?.locationCode,
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
          title={
            window.innerWidth <= 480
              ? ""
              : `${t("home_page.homepage.Location")}`
          }
          onBtnClick={() => {
            setIsForm(true);
            setId("create");
          }}
          handleEditClick={locationGet}
          handleDeleteClick={fetchLocationDelete}
        />
      )}

      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => {
            setInitalValue({});
            setIsForm(false);
          }}
          source={"location"}
          tittle={t("home_page.homepage.Location")}
          id={id}
          reload={() => fetchLocationGet()}
          initalValue={initalValue}
        />
      ) : null}
    </div>
  );
}

export default Locations;
