import { LoadingOutlined } from "@ant-design/icons";
import { Button, Spin, message, notification } from "antd";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BiArrowBack } from "react-icons/bi";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { animated } from "react-spring";
import Logo2 from "../../../assets/images/logo2.webp";
import Robo from "../../../assets/images/robo2.gif";
import Whatsapp from "../../../components/whatsapp";
import API from "../../../config/api";
import { addSignUpDetails, setBaseUrl } from "../../../redux/slices/userSlice";
import {
  CREATEBASEURL,
  GETWITHBASE,
  REGISTERPOST,
} from "../../../utils/apiCalls";
import MessageBubble from "./messageBubble";

function Otpverification() {
  const user = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorQuesion, setErrorQuestion] = useState([]);

  function cleanPhoneNumber(phoneNumber: string) {
    let cleanedPhoneNumber = phoneNumber.replace(/^0+(?=[1-9])/, "");
    return cleanedPhoneNumber;
  }
  const handleThirdClick = async () => {
    setIsLoading(true);
    if (phoneNumber.length > 0) {
      const exists = await checkExist(cleanPhoneNumber(phoneNumber));
      if (exists) {
        dispatch(addSignUpDetails({ phonenumber: phoneNumber }));
        setErrorQuestion([]);
        signUp();
        setIsLoading(false);
      } else {
        let newArray: any = [
          ...errorQuesion,
          {
            qst: "This phone number has already been registered in our system. Please use a different phone number.",
          },
        ];

        setErrorQuestion(newArray);
        setIsLoading(false);
      }
    } else {
      let newArray: any = [
        ...errorQuesion,
        { qst: "The input you provided is wrong!" },
      ];
      setErrorQuestion(newArray);
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    let obj = {
      firstname: user.signUpDetails.firstname,
      lastname: user.signUpDetails.lastname,
      password: user.signUpDetails.password,
      country_code: user.signUpDetails.seletedCountry.dial_code,
      bname: user.signUpDetails?.bname,
      countryid: user.signUpDetails?.seletedCountry?.id,
      remember: user.signUpDetails?.remember,
      email: user.signUpDetails?.email,
      phonenumber: user.signUpDetails?.phonenumber,
      mobileverified: 0,
      status: 1,
    };
    let url = API.BASE_URL + API.LOGIN_REGISTRATION;
    try {
      const response: any = await REGISTERPOST(url, obj);
      if (response.status) {
        createBaseUrl(response.data);
      } else {
        let newArray: any = [...errorQuesion, { qst: response?.message }];
        setErrorQuestion(newArray);
      }
    } catch (err) {
      console.log(err);
      message.error("something went wrong");
    }
  };

  const createBaseUrl = async (data: any) => {
    var url = API.BASE_URL;
    var date = new Date();
    var year = date.getFullYear();
    let lastparms = `${year}-${year + 1}`;
    let body = {
      adminid: data.id,
      email: data.email,
      phoneNumber: data.phonenumber,
      isActive: true,
      urlName: lastparms,
      baseUrl: url,
    };
    let endpoint = "base";
    const response: any = await CREATEBASEURL(endpoint, body);
    if (response.status) {
      setIsLoading(false);
      setQuestion(2);
      // notification.success({ message:'Success',description:"User registered successfully" });
      dispatch(setBaseUrl(response?.data?.baseUrl));
    } else {
      setIsLoading(false);
      let newArray: any = [...errorQuesion, { qst: response.message }];
      setErrorQuestion(newArray);
      notification.error({ message: response.message });
      // notification.error({
      //   message:"Failed",
      //     description:"Oops! Something went wrong with your sign-up. Please try again later or contact support for help.",
      // });
    }
  };

  async function checkExist(phone: any) {
    try {
      let endpoint = "user/checkPhone/";
      const response = await GETWITHBASE(endpoint + phone, {});
      return response;
    } catch (error) {
      return true;
    }
  }

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
            <animated.div className="onboarding-page">
              <div className="website-LoginBox22">
                {question === 1 ? (
                  <>
                    <div className="robo-bubble">
                      <img src={Robo} className="robo-gif" alt="" />
                      <MessageBubble
                        pointer={"right"}
                        content={"What is your Phone Number?" || ""}
                        delay={30}
                      />
                    </div>
                    {errorQuesion.length
                      ? errorQuesion.map((item: any) => (
                          <div className="robo-bubble">
                            <img src={Robo} className="robo-gif" alt="" />
                            <MessageBubble
                              pointer={"right"}
                              content={
                                item.qst ||
                                "The input you provided is wrong!" ||
                                ""
                              }
                              delay={30}
                            />
                          </div>
                        ))
                      : null}
                    <div className="chatInputConatiner">
                      <span style={{ marginRight: "5px" }}>
                        {user.signUpDetails.seletedCountry.dial_code}
                      </span>
                      <input
                        autoFocus
                        type="number"
                        className="chatInput"
                        placeholder={"enter phone number"}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleThirdClick();
                          }
                        }}
                      />
                      <button
                        className="customBtnSendMsg"
                        onClick={() => handleThirdClick()}
                      >
                        {isLoading ? (
                          <Spin
                            indicator={
                              <LoadingOutlined
                                style={{ fontSize: 24, color: "#000" }}
                                spin
                              />
                            }
                          />
                        ) : (
                          <IoIosArrowRoundUp />
                        )}
                      </button>
                    </div>
                  </>
                ) : null}
                {question === 2 ? (
                  <>
                    <div className="robo-bubble">
                      <img src={Robo} className="robo-gif" alt="" />
                      <MessageBubble
                        pointer={"right"}
                        content={
                          "Your signup is complete. A verification email has been sent to your inbox. Please verify your email address.Once verified, you can proceed with logging in using your credentials" ||
                          ""
                        }
                        delay={30}
                      />
                    </div>
                    <Button
                      className="inputCards"
                      onClick={() => navigate("/login")}
                      type="primary"
                    >
                      Go to the login page.
                    </Button>
                  </>
                ) : null}
              </div>
            </animated.div>
          </Col>
           <div id="recaptcha"></div>
        </Row>
      </Container>
      <Whatsapp />
    </div>
  );
}

export default Otpverification;
