import { Col, Container, Row } from "react-bootstrap";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import WebsiteFooter from "../../../../components/websiteFooter";
import WebsiteHeader from "../../../../components/websiteHeader";
import Whatsapp from "../../../../components/whatsapp";
import BlogDetailsMorePage from "./morePage";
import "../../styles.scss";
const BlogDetailPage = () => {
  const navigate = useNavigate();
  return (
    <div className="website-screens">
      <WebsiteHeader />
      <br />
      <Container>
        <div className="blogDetailPage_box1">
          <FaArrowLeftLong
            color="black"
            size={25}
            onClick={() => navigate(-1)}
          />
          &nbsp; &nbsp; Details Screen
        </div>
        <br />
        <Row>
          <Col md={12}>
            <BlogDetailsMorePage />
          </Col>
          {/* <Col md={3} style={{ borderLeft: "1px solid grey" }}>
            <BlogRecentNews />
          </Col> */}
        </Row>
      </Container>
      <Whatsapp />
      <br />
      <br />
      <WebsiteFooter />
    </div>
  );
};

export default BlogDetailPage;
