import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import Logo2 from "../../../assets/images/logo2.webp";
import "../styles.scss";

import QuestionScreen from "./questionScreen";

const OnBoardingScreen = () => {
  const { t } = useTranslation();
  const pages = [
    {
      id: 1,
      qst: "What is you first name ?",
      placeHolder: "Enter First Name",
      qst2: "What is you last name ?",
      placeHolder2: "Enter last Name",
    },
    {
      id: 2,
      qst: "Choose Your Country",
    },
    {
      id: 3,
      qst: `Enter a password`,
      qst1: "Please ensure your password is at least 8 characters long and contains at least one of the following special characters: . * @ ! # % & ( ) ^ ~.",
      placeHolder: "Enter password",
      placeHolder2: "Confirm password",
    },
    {
      id: 5,
      qst: "What is you Email ?",
      placeHolder: "Enter Email",
      qst2: "What is your Phone Number?",
      placeHolder2: t("home_page.homepage.Enter_Phone_Number"),
    },
  ];

  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setPageIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    if (pageIndex === 0) {
      navigate(-1);
    }
    setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <Container fluid>
      <Row className="g-0">
        <Col sm={8} style={{ margin: 0, padding: 0 }}>
          <div className="website-LoginBox1">
            <img src={Logo2} style={{ width: 300 }} alt="taxgo" />
          </div>
        </Col>
        <Col sm={4} style={{ margin: 0, padding: 0 }}>
          <div className="onboarding-container">
            <div className="website-LoinBack" onClick={handlePrev}>
              <BiArrowBack size={30} color="black" />
            </div>
            {pages.map((item, index) =>
              index === pageIndex ? (
                <animated.div style={{ ...props }} className="onboarding-page">
                  <div className="website-LoginBox22">
                    <QuestionScreen
                      id={index}
                      item={item}
                      nextPage={handleNext}
                    />
                  </div>
                </animated.div>
              ) : null
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OnBoardingScreen;
