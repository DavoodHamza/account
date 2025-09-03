import { Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import moment from "moment";
import API from "../../../../../config/api";
import { REGISTERGET } from "../../../../../utils/apiCalls";
import LoadingBox from "../../../../../components/loadingBox";
import { useParams } from "react-router-dom";

const BlogDetailsMorePage = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const id = useParams();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = API.BASE_URL + API.BLOG + "/" + Number(id?.id);
      const response: any = await REGISTERGET(url, null);
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
    <div className="blogSlider_box1">
      <Col className="order-1 order-sm-2">
        <div className="Detail_Box">
          {isLoading ? (
            <LoadingBox />
          ) : (
            <div className="blogDetailsMorePage_box1">
              <img src={data?.image} alt={""} />
              <div className="blogSlider_box3">
                <div className="blogSlider_box4">
                  <div className="blogSlider_txt1">{data?.title}</div>
                  <div>{moment(data?.createdAt).format("YYYY-MM-DD")}</div>
                </div>
                <br />
                <div>{data?.content}</div>
                <br />
              </div>
            </div>
          )}
        </div>
      </Col>
    </div>
  );
};

export default BlogDetailsMorePage;
