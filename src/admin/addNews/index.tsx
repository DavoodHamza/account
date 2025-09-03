import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LoadingBox from "../../components/loadingBox";
import API from "../../config/api";
import { GET, REGISTERGET } from "../../utils/apiCalls";
import AddNewsTable from "./component/table";
import "./styles.scss";
import SubHeader from "../adminNavigation/subHeader";
const AddNews = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = API.BLOG;
      const response: any = await GET(url, null);
      setData(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <SubHeader
            firstPathLink={"/admin/news"}
            firstPathText="News"
            goback={-1}
            title="News"
          />
          <br />
          <Container>
            <AddNewsTable data={data} reload={fetchData} />
          </Container>
        </>
      )}
    </>
  );
};

export default AddNews;
