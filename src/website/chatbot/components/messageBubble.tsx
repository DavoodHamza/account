import "../styles.scss";
import Typewriter from "../../../components/typeWriter";

interface Prop {
  content: string;
  delay: number;
  pointer: string;
}
const MessageBubble = ({ content, delay, pointer }: Prop) => {
  return (
    <div
      className="messageBubble-Container"
      style={{
        borderRadius:
          pointer === "left" ? `20px 20px 4px 20px` : `20px 20px 20px 4px`,
      }}
    >
      <Typewriter delay={delay} text={content} className={"typeWriteMessage"} />
    </div>
  );
};

export default MessageBubble;
