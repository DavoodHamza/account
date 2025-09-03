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

const BlogMorePage = (props: any) => {
  const navigate = useNavigate();
  const { Meta } = Card;
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url =
        API.BASE_URL +
        API.TEST_BLOG +
        `?category=${props?.category}&skip=${6}&limit=${20}`;

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
      <div className="blogMorePage_txt1">More News to Keep you updated</div>
      <br />
      <Row className="g-10">
        {isLoading ? (
          <LoadingBox />
        ) : data && data?.length ? (
          data?.map((data: any, index: any) => (
            <Col md={3} xs={12} sm={6}>
              <Card
                key={index}
                className="blogMorePage_card"
                cover={
                  <img
                    alt=""
                    src={data?.image || image}
                    className="blogMorePage_img"
                  />
                }
              >
                <Meta
                  description={
                    <div>
                      <div className="blogMorePage_box2">
                        <div className="blogMorePage_txt2">{data?.title}</div>
                        <div className="blogMorePage_txt3">
                          {moment(data?.createdAt).format("YYYY-MM-DD")}
                        </div>
                      </div>
                      <div className="blogMorePage_txt3">Headline</div>
                      <br />
                      <div
                        className="blogMorePage_txt2"
                        onClick={() => navigate(`/blog-details/${data?.id}`)}
                      >
                        READ MORE &nbsp;
                        <FaCircleArrowRight />
                      </div>
                    </div>
                  }
                />
              </Card>
              <br />
            </Col>
          ))
        ) : (
          <Card>No Data</Card>
        )}
      </Row>
      <br />
    </div>
  );
};

export default BlogMorePage;
