import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Arabic from "../assets/images/Arabic.webp";
import France from "../assets/images/France.webp";
import India from "../assets/images/India.webp";
import Mongoliyan from "../assets/images/mongoliyan.webp";
import UK from "../assets/images/UK.webp";
import "./style.scss";

function LanguageSwitcher(props: any) {
  const { i18n } = useTranslation();
  const [selectLan, setSelectLan] = useState(
    localStorage.getItem("value") || "en"
  ) as any;
  const [flag, setFlag] = useState(localStorage.getItem("flag") || UK);
  const handleChangeLanguage = (value: any, flag: any) => {
    const language = value ? value : props.Language.currentLanguage.language;
    setSelectLan(language);
    setFlag(flag ? flag : props.Language.currentLanguage.flag);
    i18n.changeLanguage(language);
    localStorage.setItem("flag", flag);
    localStorage.getItem(flag);
    localStorage.setItem("value", value);
    localStorage.getItem(selectLan);
    // if (localStorage === flag) {
    //   flag;
    // } else {
    //   UK;
    // }
    // if (value === "ar") {
    //   localStorage.setItem("direction", "RTL");
    // } else {
    //   localStorage.setItem("direction", "LTR");
    // }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          onClick={() => handleChangeLanguage("en", UK)}
          className="LanguageSwitcherd-div1"
        >
          {/* <img style={{ width: 20 }} src={UK} alt="flag" /> */}
          &nbsp; English
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => handleChangeLanguage("ar", Arabic)}
          className="LanguageSwitcherd-div1"
        >
          {/* <img style={{ width: 20 }} src={Arabic} alt="flag" /> */}
          &nbsp; العربية
        </div>
      ),
    },
    {
      key: "22",
      label: (
        <div
          onClick={() => handleChangeLanguage("mn", Mongoliyan)}
          className="LanguageSwitcherd-div1"
        >
          {/* <img style={{ width: 20 }} src={Mongoliyan} alt="flag" /> */}
          &nbsp; Монгол
        </div>
      ),
    },
    // {
    //   key: "3",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("bn", India)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={India} alt="flag" />
    //       &nbsp; বাংলা
    //     </div>
    //   ),
    // },

    // {
    //   key: "4",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("nl", Netherland)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Netherland} alt="flag" /> &nbsp;
    //       Nederlands
    //     </div>
    //   ),
    // },
    {
      key: "5",
      label: (
        <div
          onClick={() => handleChangeLanguage("fr", France)}
          className="LanguageSwitcherd-div1"
        >
          {/* <img style={{ width: 20 }} src={France} alt="flag" />  */}
          &nbsp; Français
        </div>
      ),
    },
    // {
    //   key: "6",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("de", Germany)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Germany} alt="flag" /> &nbsp; Deutsch
    //     </div>
    //   ),
    // },
    {
      key: "7",
      label: (
        <div
          onClick={() => handleChangeLanguage("hi", India)}
          className="LanguageSwitcherd-div1"
        >
          {/* <img style={{ width: 20 }} src={India} alt="flag" />  */}
          &nbsp; हिन्दी
        </div>
      ),
    },
    // {
    //   key: "8",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("id", Indonesia)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Indonesia} alt="flag" /> &nbsp; Bahasa
    //       Indonesia
    //     </div>
    //   ),
    // },
    // {
    //   key: "9",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("cn", China)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={China} alt="flag" /> &nbsp; 中文
    //     </div>
    //   ),
    // },
    // {
    //   key: "10",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("ga", Ireland)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Ireland} alt="flag" /> &nbsp; Gaeilge
    //     </div>
    //   ),
    // },
    // {
    //   key: "11",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("it", Italy)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Italy} alt="flag" /> &nbsp; Italiano
    //     </div>
    //   ),
    // },
    // {
    //   key: "12",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("ja", Japan)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Japan} alt="flag" /> &nbsp; 日本語
    //     </div>
    //   ),
    // },
    // {
    //   key: "13",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("kn", India)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={India} alt="flag" /> &nbsp; ಕನ್ನಡ
    //     </div>
    //   ),
    // },
    // {
    //   key: "14",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("fr", Caneda)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Caneda} alt="flag" /> &nbsp; Caneda
    //     </div>
    //   ),
    // },
    // {
    //   key: "15",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("ko", Korea)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Korea} alt="flag" /> &nbsp; 한국어
    //     </div>
    //   ),
    // },
    // {
    //   key: "16",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("ml", India)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={India} alt="flag" /> &nbsp; മലയാളം
    //     </div>
    //   ),
    // },
    // {
    //   key: "17",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("pl", Poland)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Poland} alt="flag" /> &nbsp; Polski
    //     </div>
    //   ),
    // },
    // {
    //   key: "18",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("pt", Portugal)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Portugal} alt="flag" /> &nbsp;
    //       Português
    //     </div>
    //   ),
    // },
    // {
    //   key: "19",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("pa", India)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={India} alt="flag" /> &nbsp; ਪੰਜਾਬੀ
    //     </div>
    //   ),
    // },
    // {
    //   key: "20",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("ru", Russia)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Russia} alt="flag" /> &nbsp; Русский
    //     </div>
    //   ),
    // },
    // {
    //   key: "21",
    //   label: (
    //     <div
    //       onClick={() => handleChangeLanguage("es", Spain)}
    //       className="LanguageSwitcherd-div1"
    //     >
    //       <img style={{ width: 20 }} src={Spain} alt="flag" />
    //       &nbsp; Español
    //     </div>
    //   ),
    // },
  ];
  return (
    <>
      <Dropdown
        menu={{ items }}
        placement="bottomCenter"
        trigger={["click"]}
        overlayClassName="language-scroll"
        overlayStyle={{ width: 240, height: 400, overflow: "auto" }}
      >
        <div>
          <Button style={{ padding: "10px", border: "solid 1px #18a762" }}>
            <div className="LanguageSwitcherd-div1">
              {/* <img
                style={{ width: 25, height: 15, objectFit: "cover" }}
                src={flag}
                alt="flag"
              />{" "}
              &nbsp;
              {" | "} */}
              {selectLan ? selectLan?.toUpperCase() : ""}
            </div>
          </Button>
        </div>
      </Dropdown>
    </>
  );
}

export default LanguageSwitcher;
