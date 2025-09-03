import React from "react";
// import whatsappIcon from "../../assets/images/whatsappicon.png"
import whatsappIcon from "../../assets/images/support/output-onlinegiftools.gif";
import youtubeicon from "../../assets/images/youtubeIcon.gif";

function Whatsapp() {
  const myStyle: any = {
    position: "fixed",
    bottom: "20px",
    right: "1%",
    zIndex: "9999999px",
    borderRadius: "50%",
    transitionDelay: "1s",
  };
  const whStyle = {
    width: "50px",
    height: "50px",
  };
  const phoneNumber = "";
  const encodedPhoneNumber = encodeURIComponent(phoneNumber);
  return (
    <div style={myStyle}>
      <a
        target="blank"
        rel="noopener noreferrer"
        href={`https://api.whatsapp.com/send?phone=3530874449489`}
      >
        <div className="whatsappIcon">
          <img style={whStyle} src={whatsappIcon} alt=""></img>
        </div>
      </a>

      <a href="https://www.youtube.com/@taxgoglobal9871" target="_blank">
        <img src={youtubeicon} alt="Youtube Icon" style={whStyle} />
      </a>
    </div>
  );
}

export default Whatsapp;
