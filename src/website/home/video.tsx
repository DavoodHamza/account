// import React, { useState } from "react";
// import { Container, Card } from "react-bootstrap";
// import { Row, Col } from "react-bootstrap";
// import "./styles.scss";
// import { FaPlay } from "react-icons/fa";
// import { FaPause } from "react-icons/fa";
// import { t } from "i18next";

// const Video = (props: any) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const handlePlayClick = () => {
//     const video: any = document.getElementById("myVideo");
//     if (video.paused) {
//       video.play();
//       setIsPlaying(true);
//     } else {
//       video.pause();
//       setIsPlaying(false);
//     }
//   };
//   const handleRegularButtonClick = () => { };
//   return (
//     <div style={{ backgroundColor: "#f4f6f8" }}>
//       <Container>
//         <Row className="g-0">
//           <Col md={6}>
//             <div className="video-box1">
//               <div className="video-text1">
//                 <b>
//                   {t("home_page.homepage.reatailexpress")}
//                 </b>
//               </div>
//               <br />
//               <div className="video-text2">
//                 {t("home_page.homepage.participate")}
//               </div>
//               <br />
//               <br />
//               <div className="video-button" onClick={handlePlayClick}>
//                 <button
//                   className="learn-more"
//                   onClick={handleRegularButtonClick}
//                 >
//                   <span className="circle" aria-hidden="true">
//                     {isPlaying == true ? (
//                       <FaPause
//                         style={{ marginLeft: 14 }}
//                         color="#fff"
//                         size={22}
//                       />
//                     ) : (
//                       <FaPlay
//                         style={{ marginLeft: 15 }}
//                         color="#fff"
//                         size={22}
//                       />
//                     )}
//                   </span>
//                   <span className="button-text">
//                     {isPlaying == true ? t("home_page.homepage.pause") : t("home_page.homepage.play_now")}
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </Col>
//           <Col
//             md={6}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Card>
//               <video
//                 id="myVideo"
//                 style={{ maxWidth: "100%", maxHeight: "100%" }}
//                 onEnded={() => setIsPlaying(false)}
//               >
//                 <source
//                   src="https://bairuha-bucket.s3.ap-south-1.amazonaws.com/retailXpress/retailXpressDemo.mp4"
//                   type="video/mp4"
//                 />
//               </video>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };
// export default Video;


import React from 'react'

function video() {
  return (
<>

</>
  )
}

export default video