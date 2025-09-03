import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Logo2 from "../../assets/images/logo2.webp";
import Robo from "../../assets/images/robo2.gif";
import Whatsapp from "../../components/whatsapp";
import MessageBubble from "./components/messageBubble";
import "./styles.scss";
function ChatBot(props: any) {
  const { t } = props;

  const navigate = useNavigate();
  let dummyArr = [
    {
      id: 1,
      title: t("home_page.homepage.inwant_login"),
      desc: t("home_page.homepage.login_ex_account"),
      sender: "bot",
    },
    {
      id: 2,
      title: t("home_page.homepage.i_sign_up"),
      desc: t("home_page.homepage.new_account"),
      sender: "user",
    },
  ];

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [selectedCardTitle, setSelectedCardTitle] = useState<number | null>(
    null
  );
  const [conversation, setConversation] = useState<any[]>([]);
  const [messages, setMessages] = useState<any>(dummyArr);
  const [newMessage, setNewMessage] = useState("");
  const onCardHover = (index: number) => {
    setHoveredCardIndex(index);
  };

  const addMessage = (item: any) => {
    setConversation((prevConversation) => [
      ...prevConversation,
      { sender: "user", message: item?.title },
    ]);
    setTimeout(() => {
      setSelectedCardTitle(item?.id);
    }, 1300);

    setTimeout(() => {
      if (item?.id === 1) {
        navigate("/login");
      } else {
        navigate("/questionScreen");
      }
    }, 3000);
  };
  return (
    <div>
      <Container fluid>
        <Row className="g-0">
          <Col sm={8} style={{ margin: 0, padding: 0 }}>
            <div className="website-LoginBox1">
              <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
            </div>
          </Col>
          <Col sm={4} style={{ margin: 0, padding: 0 }}>
            <div className="website-LoinBack" onClick={() => navigate(-1)}>
              <BiArrowBack />
            </div>
            <div className="website-LoginBox2">
              <div className="robo-bubble-container">
                <div className="robo-bubble">
                  <img src={Robo} className="robo-gif-big" />
                  <MessageBubble
                    pointer={"right"}
                    // content={`Welcome to Tax GO Global, ${"\n"} How can i help you ?`}
                    content={t("home_page.homepage.welcome_helpyou")}
                    delay={30}
                  />
                </div>
                <div className="conversationContainer">
                  {conversation.map((message, index) => (
                    <div
                      className={message.sender === "user" ? "right" : "left"}
                    >
                      <MessageBubble
                        key={index}
                        pointer={message.sender === "user" ? "left" : "right"}
                        content={message.message}
                        delay={30}
                      />
                    </div>
                  ))}
                  {selectedCardTitle && (
                    <MessageBubble
                      pointer={"left"}
                      content={
                        selectedCardTitle === 1
                          ? `Sure, I can navigate you to login.`
                          : "Sure, Lets Begin with a few questions"
                      }
                      delay={30}
                    />
                  )}
                </div>
              </div>
              <div className="btnContainer">
                {!conversation.length && (
                  <div className="cardContainer">
                    {dummyArr.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="inputCardsInner"
                        onMouseEnter={() => onCardHover(index)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                        onClick={() => addMessage(item)}
                      >
                        <div className="inputCards">
                          <div>{item.title}</div>
                          <div className={"cardDesc"}>{item.desc}</div>
                        </div>
                        <div>
                          {hoveredCardIndex === index ? (
                            <button className="customBtnSendMsg btnSmall">
                              <IoIosArrowRoundUp />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Col>
           
        </Row>
      </Container>
      <Whatsapp />
    </div>
  );
}

export default withTranslation()(ChatBot);
