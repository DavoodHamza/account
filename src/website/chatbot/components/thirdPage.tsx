import React, { useRef, useState } from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import MessageBubble from "./messageBubble";
import Robo from "../../../assets/images/robo2.gif";
import { useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";

import { addSignUpDetails } from "../../../redux/slices/userSlice";
import { Input } from "antd";
function ThirdPage({ item, nextPage, props }: any) {
  const secondInputRef: any = useRef(null);
  const { t } = props;

  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");
  const [question, setQuestion] = useState(1);
  const [errorQuesion, setErrorQuestion] = useState([]);
  const handleFirstClick = () => {
    validatePassword(password);
  };
  const validatePassword = (value: any) => {
    // Your password validation logic
    const minLength = 8;
    const specialCharacterRegex = /[.*@!#%&()^~]/;
    const digitRegex = /\d/;

    if (value.length < minLength) {
      let newArray: any = [
        ...errorQuesion,
        {
          qsty: "Password must be at least 8 characters long.",
        },
      ];
      setErrorQuestion(newArray);
    } else if (!specialCharacterRegex.test(value)) {
      let newArray: any = [
        ...errorQuesion,
        {
          qsty: t("home_page.homepage.Password_special."),
        },
      ];
      setErrorQuestion(newArray);
    } else if (!digitRegex.test(value)) {
      let newArray: any = [
        ...errorQuesion,
        {
          qsty: t("home_page.homepage.Password_contain."),
        },
      ];
      setErrorQuestion(newArray);
    } else {
      secondInputRef.current.focus();
      compareToFirstPassword(value, confrimPassword);
    }
  };
  const compareToFirstPassword = (item: any, value: any) => {
    if (item === value) {
      dispatch(addSignUpDetails({ password: value }));
      nextPage();
    } else {
      let newArray: any = [
        ...errorQuesion,
        {
          qsty: "Please confrim the password ",
        },
      ];
      setErrorQuestion(newArray);
    }
  };
  const handleFirstInputKeyPress = (e: any) => {
    if (e.key === "Enter") {
      validatePassword(password);
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
          <div className="robo-bubble">
            <img src={Robo} className="robo-gif" />
            <MessageBubble
              pointer={"right"}
              content={item.qst1 || ""}
              delay={10}
            />
          </div>

          {errorQuesion.length
            ? errorQuesion.map((items: any) => (
              <div className="robo-bubble">
                <img src={Robo} className="robo-gif" />
                <MessageBubble
                  pointer={"right"}
                  content={items.qsty}
                  delay={30}
                />
              </div>
            ))
            : null}
          <div className="chatInputConatiner">
            <Input.Password
              autoFocus={true}
              bordered={false}
              className="chatInput"
              placeholder={item.placeHolder}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleFirstInputKeyPress}
            />
          </div>
          <div className="chatInputConatiner">
            <Input.Password
              ref={secondInputRef}
              bordered={false}
              className="chatInput"
              placeholder={item.placeHolder2}
              onChange={(e) => setConfrimPassword(e.target.value)}
              onKeyDown={(e: any) => {
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
    </>
  );
}

export default withTranslation()(ThirdPage);
