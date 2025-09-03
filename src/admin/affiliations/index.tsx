import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LoadingBox from "../../components/loadingBox";
import { GET, POST } from "../../utils/apiCalls";
import AddAffiliationTable from "./component/table";
import { Pagination } from "antd";
import API from "../../config/api";
import SubHeader from "../adminNavigation/subHeader";

const Affiliations = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
  const [meta, setMeta] = useState<any>();
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);

  const getAffiliations = async () => {
    try {
      let obj = {
        query: search,
        page: page,
        take: take,
      };
      let url = API.LIST_AFFILIATION;
      const response: any = await POST(url, obj);
      if (response?.status) {
        setData(response?.datas);
        setMeta(response.meta);
      } else {
      }
    } catch (error) {
      console.log("------- error -", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAffiliations();
  }, [page, take, search]);

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <SubHeader
            firstPathLink={"/admin/affiliations"}
            firstPathText="Affiliates"
            goback={-1}
            title="Affiliates"
          />
          <br />
          <Container>
            <AddAffiliationTable
              data={data}
              reload={getAffiliations}
              search={(val: any) => setSearch(val)}
              searchData={search}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Pagination
                total={meta?.totalCount}
                showSizeChanger={true}
                showTotal={(total) => `Total ${meta?.totalCount} Affiliates`}
                onChange={(page, pageSize) => {
                  setPage(page);
                  setTake(pageSize);
                }}
              />
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export default Affiliations;
