import { Select } from "antd";
import { useState } from "react";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import Robo from "../../../assets/images/robo2.gif";
import countryCode from "../../../config/countryCode.json";
import { addSignUpDetails } from "../../../redux/slices/userSlice";
import MessageBubble from "./messageBubble";

function SecoundPage({ item, nextPage }: any) {
  const dispatch = useDispatch();
  const [seletedCountry, setSelectedCountry] = useState<any>({});
  const [errorQuesion, setErrorQuestion] = useState([]);
  


  const handleSecoundClick = () => {
    if (seletedCountry.id) {
      dispatch(addSignUpDetails({ seletedCountry: seletedCountry }));
      setErrorQuestion([]);
      nextPage();
    } else {
      let newArray: any = [
        ...errorQuesion,
        { qst: "The input you provided is wrong!" },
      ];
      setErrorQuestion(newArray);
    }
  };

  return (
    <>
      <div className="robo-bubble">
        <img src={Robo} className="robo-gif" alt=''/>
        <MessageBubble pointer={"right"} content={item.qst || ""} delay={30} />
      </div>
      <div className="chatInputConatiner">
        <Select
          placeholder="Choose Country"
          showSearch
          style={{ width: "90%" }}
          bordered={false}
          allowClear
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSecoundClick();
            }
          }}
          onChange={(val) => {
            let foundedCountry: any = countryCode.find(
              (county: any) =>
                val?.toLowerCase() === county?.name?.toLowerCase()
            );

            setSelectedCountry(foundedCountry);
          }}
        >
          {countryCode.map((item: any, index: any) => (
            <Select.Option key={index.toString()} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <button
          className="customBtnSendMsg"
          onClick={() => handleSecoundClick()}
        >
          <IoIosArrowRoundUp />
        </button>
      </div>
    </>
  );
}

export default SecoundPage;
