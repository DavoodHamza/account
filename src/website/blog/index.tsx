// import { Button, Col, Popconfirm, Row, notification } from "antd";
// import { useEffect, useState } from "react";
// import { Container } from "react-bootstrap";
// import { AiOutlineQuestionCircle } from "react-icons/ai";
// import { BiEditAlt } from "react-icons/bi";
// import { RiDeleteBinLine } from "react-icons/ri";
// import LoadingBox from "../../components/loadingBox";
// import WebsiteFooter from "../../components/websiteFooter";
// import WebsiteHeader from "../../components/websiteHeader";
// import Whatsapp from "../../components/whatsapp";
// import API from "../../config/api";
// import { BASE_DELETE, REGISTERGET } from "../../utils/apiCalls";
// import BlogForm from "./components/form";

// const Blog = () => {
// const [data, setData] = useState<any>();
// const [isLoading, setIsLoading] = useState(false);
// const [isOpen, setIsOpen] = useState(false);
// const [isEditOpen, setIsEditOpen] = useState(false);
// const [id, setId] = useState();/
//   const [publishCount, setPublishCount] = useState(0);

// const fetchData = async () => {
//   try {
//     setIsLoading(true);
//     let url = API.BASE_URL + API.BLOG;
//     const response: any = await REGISTERGET(url, null);
//     setData(response?.data);
//   } catch (error) {
//     console.log(error);
//   } finally {
//     setIsLoading(false);
//   }
// };

// useEffect(() => {
//   fetchData();
// }, []);

//   const handleCount = () => {
//     setPublishCount((prevCount) => prevCount + 1);
//   };

//   const handleDelete = async (val: any) => {
//     try {
//       setIsLoading(true);
//       let url = API.BASE_URL + `blog/${val}`;
//       const response = await BASE_DELETE(url);
//       notification.success({
//         message: "Success",
//         description: "News deleted successfully",
//       });
//       fetchData();
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
// <div className="website-screens">
//   <WebsiteHeader />
//   <>
//     <Container>
//           <br />
//           {isLoading ? (
//             <LoadingBox />
//           ) : (
//             <Row gutter={16}>
//               {data?.map((item: any) => (
//                 <Col span={24}>
//                   <div className="Consolidate-news" onClick={handleCount}>
//                     {item?.title}
//                   </div>
//                   <pre
//                     className="Consolidate-news_text"
//                     style={{ whiteSpace: "pre-wrap" }}
//                   >
//                     {item?.content}
//                   </pre>
//                   {publishCount > 4 && (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "end",
//                       }}
//                     >
//                       <Button
//                         type="default"
//                         style={{ marginRight: 4 }}
//                         onClick={() => {
//                           setIsEditOpen(true);
//                           setId(item?.id);
//                         }}
//                       >
//                         <BiEditAlt />
//                       </Button>

//                       <Popconfirm
//                         title="Delete"
//                         description="Are you sure to delete this news?"
//                         icon={
//                           <AiOutlineQuestionCircle style={{ color: "red" }} />
//                         }
//                         onConfirm={() => handleDelete(item?.id)}
//                         placement="topRight"
//                       >
//                         <Button type="default">
//                           <RiDeleteBinLine />
//                         </Button>
//                       </Popconfirm>
//                     </div>
//                   )}
//                   <br />
//                 </Col>
//               ))}
//             </Row>
//           )}

//           {publishCount > 4 && (
//             <Button type="primary" onClick={() => setIsOpen(true)}>
//               Publish News
//             </Button>
//           )}
//         </Container>
// {isOpen && (
//   <BlogForm
//     openModal={isOpen}
//     setIsOpen={setIsOpen}
//     type="create"
//     refreshData={fetchData}
//   />
// )}

// {isEditOpen && (
//   <BlogForm
//     openModal={isEditOpen}
//     setIsOpen={setIsEditOpen}
//     type="edit"
//     refreshData={fetchData}
//     id={id}
//   />
// )}

//         <br />
// //       </>
//       <Whatsapp />
//       <WebsiteFooter />
//     </div>
//   );
// };

// export default Blog;

import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Whatsapp from "../../components/whatsapp";
import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import BlogRecentNews from "./components/Recent News";
import BlogSlider from "./components/slider";
import BlogTab from "./components/tab";
import BlogMorePage from "./components/more";
import "./styles.scss";
const Blog = () => {
  const [tab, setTab] = useState("all");
  const handleChange = (val: any) => {
    let value = "all";
    if (val == "2") {
      value = "business";
    } else if (val == "3") {
      value = "accounting";
    } else if (val == "4") {
      value = "finance";
    } else if (val == "5") {
      value = "Updated";
    } else if (val == "6") {
      value = "world";
    }
    setTab(value);
  };

  return (
    <div className="website-screens">
      <WebsiteHeader />
      <Container>
        <br />
        <BlogTab handleChange={handleChange} />
        <br />
        <Row className="g-10">
          <Col md={8}>
            <BlogSlider category={tab} />
          </Col>
          <Col md={4} xs={12} sm={12} style={{ borderLeft: "1px solid grey" }}>
            <BlogRecentNews category={tab} />
          </Col>
        </Row>
        <br />
      </Container>
      <div className="blogMorePage_box1">
        <Container>
          <BlogMorePage category={tab} />
        </Container>
      </div>
      <Whatsapp />
      <WebsiteFooter />
    </div>
  );
};
export default Blog;
