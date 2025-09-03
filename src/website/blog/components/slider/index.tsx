import { Card, Carousel } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import image from "../../../../assets/images/logo2.webp";
import LoadingBox from "../../../../components/loadingBox";
import API from "../../../../config/api";
import { REGISTERGET } from "../../../../utils/apiCalls";

const BlogSlider = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // let url = API.BASE_URL + API.BLOG;
      let url =
        API.BASE_URL +
        API.TEST_BLOG +
        // `?limit=${3}&skip=${0}&category=${props?.category}`;
        `?category=${props?.category}&skip=${0}&limit=${3}`;
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
    <div className="blogSlider_box1">
      <Col className="order-1 order-sm-2">
        <div className="Detail_Box">
          <Carousel effect="fade" dotPosition="bottom" autoplay={true}>
            {isLoading ? (
              <LoadingBox />
            ) : data && data.length ? (
              data.map((slide: any, index: any) => (
                <div key={index} className="Detail_Box2">
                  <img src={slide?.image || image} alt={""} />
                  <div className="blogSlider_box3">
                    <div className="blogSlider_box4">
                      <div className="blogSlider_txt1">{slide?.title}</div>
                      <div>{moment(slide?.createdAt).format("YYYY-MM-DD")}</div>
                    </div>
                    <br />
                    <div>{slide?.content}</div>
                    <br />
                  </div>
                </div>
              ))
            ) : (
              <Card>No Data</Card>
            )}
          </Carousel>
        </div>
      </Col>
    </div>
  );
};

export default BlogSlider;
