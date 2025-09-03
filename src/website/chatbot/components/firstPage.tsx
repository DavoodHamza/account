import React, { useState } from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import MessageBubble from "./messageBubble";
import Robo from "../../../assets/images/robo2.gif";
import { useDispatch } from "react-redux";
import { addSignUpDetails } from "../../../redux/slices/userSlice";
function FirstPage({ item, nextPage }: any) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [question, setQuestion] = useState(1);
  const [errorQuesion, setErrorQuestion] = useState([]);
  const handleFirstClick = () => {
    if (firstName.length > 0) {
      dispatch(addSignUpDetails({ firstname: firstName }));
      setErrorQuestion([]);
      setQuestion((prev: any) => prev + 1);
    } else {
      let newArray: any = [...errorQuesion, 1];
      setErrorQuestion(newArray);
    }
  };
  const handleSecoundClick = () => {
    if (lastName.length > 0) {
      dispatch(addSignUpDetails({ lastname: lastName }));
      nextPage();
    } else {
      let newArray: any = [...errorQuesion, 1];
      setErrorQuestion(newArray);
    }
  };
  return (
    <>
      {question === 1 ? (
        <>
          <div className="robo-bubble">
            <img src={Robo} className="robo-gif" />
            <MessageBubble
              pointer={"right"}
              content={item.qst || ""}
              delay={30}
            />
          </div>
          {errorQuesion.length
            ? errorQuesion.map(() => (
                <div className="robo-bubble">
                  <img src={Robo} className="robo-gif" />
                  <MessageBubble
                    pointer={"right"}
                    content={"The input you provided is wrong!" || ""}
                    delay={30}
                  />
                </div>
              ))
            : null}
          <div className="chatInputConatiner">
            <input
              autoFocus
              className="chatInput"
              placeholder={item.placeHolder}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFirstClick();
                }
              }}
            />
            <button
              className="customBtnSendMsg"
              onClick={() => handleFirstClick()}
            >
              <IoIosArrowRoundUp />
            </button>
          </div>
        </>
      ) : null}
      {question === 2 ? (
        <>
          <div className="robo-bubble">
            <img src={Robo} className="robo-gif" />
            <MessageBubble
              pointer={"right"}
              content={item.qst2 || ""}
              delay={30}
            />
          </div>
          {errorQuesion.length
            ? errorQuesion.map(() => (
                <div className="robo-bubble">
                  <img src={Robo} className="robo-gif" />
                  <MessageBubble
                    pointer={"right"}
                    content={"The input you provided is wrong!" || ""}
                    delay={30}
                  />
                </div>
              ))
            : null}
          <div className="chatInputConatiner">
            <input
                 autoFocus
              className="chatInput"
              placeholder={item.placeHolder2}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSecoundClick();
                }
              }}
            />
            <button
              className="customBtnSendMsg"
              onClick={() => handleSecoundClick()}
            >
              <IoIosArrowRoundUp />
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}

export default FirstPage;
