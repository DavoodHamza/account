import { useNavigate } from "react-router-dom";
import robo from "../../assets/images/rob.gif";
import "./ChatBot.css"; 

function ChatBot() {
  const navigation = useNavigate();

  return (
    <div className="chatbot" onClick={() => navigation("/getstart")}>
      <img className="chatbot-icon" src={robo} alt="" />
    </div>
  );
}

export default ChatBot;
