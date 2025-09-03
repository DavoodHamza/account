import React, { useEffect } from "react";
import "./styles.scss";
import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import image1 from "../../assets/images/support/product-support.svg";
import image2 from "../../assets/images/support/reset psw.svg";
import image3 from "../../assets/images/support/remote-session.svg";
import image4 from "../../assets/images/support/chatbot.png";
import image5 from "../../assets/images/support/tickets.svg";
import image6 from "../../assets/images/support/chat.svg";
import image7 from "../../assets/images/support/support-contact.svg";
import image8 from "../../assets/images/support/escalate.svg";
import support from "../../assets/images/support/contact.jpg";
import { Col, Container, Row } from "react-bootstrap";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Whatsapp from "../../components/whatsapp";
import ChatBot from "../../components/bot";

const Support = (props: any) => {
  const { t } = props;
  const navigate = useNavigate();
  const openWhatsappChat = () => {
    const phoneNumber = "3530874449489";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  const handleChange = (val: any) => {
    navigate(val?.path);
    if (val?.head === "Chat") {
      openWhatsappChat();
    }
  };
  const supportcards = [
    {
      id: 1,
      icon: image1,
      head: `${t("home_page.homepage.Product_Support_head")}`,
      subhead: `${t("home_page.homepage.Product_Support_body")}`,
      path: "/contact",
    },
    {
      id: 2,
      icon: image2,
      head: `${t("home_page.homepage.Reset_Password_head")}`,
      subhead: `${t("home_page.homepage.Reset_Password_body")}`,
      path: "/forgot",
    },
    {
      id: 3,
      icon: image3,
      head: `${t("home_page.homepage.Remote_Sesssion_head")}`,
      subhead: `${t("home_page.homepage.Remote_Sesssion_body")}`,
      path: "/contact",
    },
    {
      id: 4,
      icon: image4,
      head: `${t("home_page.homepage.Data_Exchange_head")}`,
      subhead: `${t("home_page.homepage.Data_Exchange_body")}`,
      path: "/getstart",
    },
    {
      id: 5,
      icon: image5,
      head: `${t("home_page.homepage.Tickets_head")}`,
      subhead: `${t("home_page.homepage.Tickets_body")}`,
      path: "/contact",
    },
    {
      id: 6,
      icon: image6,
      head: `${t("home_page.homepage.Chat_head")}`,
      subhead: `${t("home_page.homepage.Chat_body")}`,
    },
    {
      id: 7,
      icon: image7,
      head: `${t("home_page.homepage.Support_Contact_head")}`,
      subhead: `${t("home_page.homepage.Support_Contact_body")}`,
      path: "/contact",
    },
    {
      id: 8,
      icon: image8,
      head: `${t("home_page.homepage.Escalate_head")}`,
      subhead: `${t("home_page.homepage.Escalate_body")}`,
      path: "/contact",
    },
  ];
  const supportcards2 = [
    {
      id: 1,
      head: `${t("home_page.homepage.Knowledge_Base_head")}`,
      subhead: `${t("home_page.homepage.Knowledge_Base_body")}`,
      path: "/usermanual/:web",
    },
    {
      id: 2,
      head: `${t("home_page.homepage.Documentation_head")}`,
      subhead: `${t("home_page.homepage.Documentation_body")}`,
      path: "/usermanual/:web",
    },
    {
      id: 3,
      head: `${t("home_page.homepage.FAQS_head")}`,
      subhead: `${t("home_page.homepage.FAQS_body")}`,
      path: "/services",
    },
    {
      id: 4,
      head: `${t("home_page.homepage.Newsletters_head")}`,
      subhead: `${t("home_page.homepage.Newsletters_body")}`,
      path: "/news",
    },
  ];
  return (
    <div className="website-screens">
      <WebsiteHeader />
      <Container>
        <Row>
          <Col className="support-box1" md={6} sm={12}>
            <div>
              <div className="support-head1">
                {t("home_page.homepage.LEARN_SOLVE")}
              </div>
              <div className="support-head2">
                {t("home_page.homepage.Get_Help")}
              </div>
              <div className="support-head3">
                {t("home_page.homepage.Get_answers")}
                <br />
                {t("home_page.homepage.efficiently_with")}{" "}
              </div>
              <Button
                type={"primary"}
                className="support-button"
                onClick={openWhatsappChat}
              >
                {t("home_page.homepage.send_message")}
              </Button>
            </div>
          </Col>
          <Col md={6} sm={12}>
            <img src={support} className="support-image1" />
          </Col>
        </Row>
      </Container>
      <div style={{ backgroundColor: "#f5f5f5", padding: "50px 0px 50px" }}>
        <div className="secondsec-head1">
          {t("home_page.homepage.Support_Services")}
        </div>
        <div className="secondsec-head2">
          {t("home_page.homepage.Access_of_variety")}
          <br />
          {t("home_page.homepage.The_following_Services")}
        </div>
        <Container>
          <Row className="supportcards-parent">
            {supportcards?.map((item: any) => (
              <Col
                md={3}
                sm={6}
                xs={6}
                className="supportcards"
                onClick={() => handleChange(item)}
              >
                <img
                  src={item?.icon}
                  style={{ cursor: "pointer" }}
                  width={"35px"}
                />
                <div className="supportcards-head1">{item?.head}</div>
                <div className="supportcards-head2">{item?.subhead}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <div style={{ padding: "20px 0px 20px" }}>
        <div className="secondsec-head1">
          {t("home_page.homepage.Support_Library")}
        </div>
        <div className="secondsec-head2">
          {t("home_page.homepage.Support_Library_body1")}
          <br />
          {t("home_page.homepage.Support_Library_body2")}
        </div>
        <Container>
          <Row className="supportcards-parent">
            {supportcards2?.map((item: any) => (
              <Col
                md={3}
                sm={6}
                xs={6}
                className="supportcards"
                onClick={() => handleChange(item)}
              >
                <div className="supportcards-head1">{item?.head}</div>
                <div className="supportcards-head2">{item?.subhead}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <Whatsapp />
      {/* <ChatBot /> */}
      <WebsiteFooter />
    </div>
  );
};

export default withTranslation()(Support);
