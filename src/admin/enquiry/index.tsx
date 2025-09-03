import { useEffect, useState } from "react";
import columns from "./columns.json";
import API from "../../config/api";
import { GET } from "../../utils/apiCalls";
import LoadingBox from "../../components/loadingBox";
import Table from "./components/table";
import SubHeader from "../adminNavigation/subHeader";

const Enquiry = () => {
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const onPageChange = (page: any, take: any) => {
    loadContactuslist(page, take);
    setPage(page);
    setTake(take);
  };

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    loadContactuslist(page, take);
  }, []);

  const loadContactuslist = async (page: any, take: any) => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_ENURIES_LIST + `?order=DESC&page=${page}&take=${take}`;
      const { data }: any = await GET(bank_list_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <SubHeader
            firstPathLink={"/admin/enquiry"}
            firstPathText="Enquiry"
            goback={-1}
            title="Enquiry"
          />
          <Table
            products={data}
            columns={columns}
            title="Enquiry List"
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
          />
        </>
      )}
    </>
  );
};

export default Enquiry;
