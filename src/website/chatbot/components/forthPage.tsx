import { useState } from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Robo from "../../../assets/images/robo2.gif";
import { addSignUpDetails } from "../../../redux/slices/userSlice";
import { GETWITHBASE } from "../../../utils/apiCalls";
import MessageBubble from "./messageBubble";

function FourthPage({ item, nextPage }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorQuesion, setErrorQuestion] = useState([]);

  const handleFirstClick = async () => {
    if (email.length > 0) {
      if (isValidEmail(email)) {
        const exists = await checkExist(email);
        if (exists) {
          dispatch(addSignUpDetails({ email: email }));
          setErrorQuestion([]);
          navigate("/chatbot/otpverification");
        } else {
          let newArray: any = [
            ...errorQuesion,
            {
              qst: `The email address is already registered in our system. Please attempt to log in instead. Click on the Login to proceed.`,
            },
          ];
          // setShowLogin(true);
          setErrorQuestion(newArray);
        }
      } else {
        let newArray: any = [
          ...errorQuesion,
          { qst: "you have entered is wrong email" },
        ];
        setErrorQuestion(newArray);
      }
    } else {
      let newArray: any = [...errorQuesion, 1];
      setErrorQuestion(newArray);
    }
  };
  function isValidEmail(email: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  async function checkExist(email: any) {
    try {
      let endpoint = "user/checkEmail/";
      const response = await GETWITHBASE(endpoint + email, {});
      return response;
    } catch (error) {
      return true;
    }
  }

  return (
    <>
      <div className="robo-bubble">
        <img src={Robo} className="robo-gif" alt="" />
        <MessageBubble pointer={"right"} content={item.qst || ""} delay={30} />
      </div>
      {errorQuesion.length
        ? errorQuesion.map(() => (
            <div className="robo-bubble">
              <img src={Robo} className="robo-gif" alt="" />
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
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFirstClick();
            }
          }}
        />
        <button className="customBtnSendMsg" onClick={() => handleFirstClick()}>
          <IoIosArrowRoundUp />
        </button>
      </div>
    </>
  );
}

export default FourthPage;
