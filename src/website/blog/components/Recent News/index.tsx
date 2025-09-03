import { Card } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaCircleArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import image from "../../../../assets/images/logo2.webp";
import LoadingBox from "../../../../components/loadingBox";
import API from "../../../../config/api";
import { REGISTERGET } from "../../../../utils/apiCalls";

const BlogRecentNews = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url =
        API.BASE_URL +
        API.TEST_BLOG +
        `?category=${props?.category}&skip=${3}&limit=${3}`;
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
  }, [props?.category]);

  return (
    <div>
      <div className="blogRecentNews_txt1">Recent News</div>
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : data && data?.length ? (
        data.map((newsItem: any) => (
          <div className="blogRecentNews_box1">
            <Row>
              <Col lg={6} md={12}>
                <div className="blogRecentNews_txt2">{newsItem?.title}</div>
                <div className="blogRecentNews_txt3">Headline</div>
                <div className="blogRecentNews_txt3">{newsItem?.category}</div>
                <div
                  className="blogRecentNews_txt4"
                  onClick={() => navigate(`/blog-details/${newsItem?.id}`)}
                >
                  Read Article &nbsp;
                  <FaCircleArrowRight />
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div className="blogRecentNews_txt5">
                  {moment(newsItem?.createdAt).format("DD-MM-YY")}
                </div>
                <br />
                <div className="blogRecentNews_box2">
                  <img
                    src={newsItem?.image || image}
                    alt={""}
                    className="blogRecentNews_img"
                  />
                </div>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <Card>No Data</Card>
      )}
    </div>
  );
};

export default BlogRecentNews;
