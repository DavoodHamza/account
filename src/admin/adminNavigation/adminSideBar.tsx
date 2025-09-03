import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo2.webp";
import Menu from "./Menu.json";
import "./styles.scss";
import owner from "../../assets/images/emeka-img.webp";
import { useState } from "react";
import moment from "moment";
import { FiMinus, FiPlus } from "react-icons/fi";
import DynamicIcon from "./dynamicIcons";

function AdminSideBar() {
  const navigate = useNavigate();
  const todayDate = moment(new Date()).format("DD-MM-YYYY");
  const [collaps, setCollaps] = useState(0);

  return (
    <>
      <div className="Company_logo">
        <img src={Logo} />
      </div>

      <div className="adminContainer">
        <img src={owner} alt="admin" className="adminImage" />
        <div className="flex-column">
          <div className="adminName">Emeka Ikwukeme</div>
          <div style={{ fontSize: 12, color: "grey" }}>{todayDate}</div>
        </div>
      </div>
      <div style={{ fontSize: 15, color: "grey" }} className="px-3 py-3">
        MAIN MENU
      </div>
      {Menu?.map((item: any) => {
        return (
          <div className="sidebarBox">
            <div
              key={item?.id}
              onClick={() => {
                setCollaps(item?.id);
                navigate(item?.path);
              }}
              className={
                collaps == item?.id ? "sideBar_item active" : "sideBar_item"
              }
            >
              <DynamicIcon
                name={item.icon}
                size={20}
                className="sideItemIcon"
              />
              <div className="sideItemText">{item?.name}</div>
              {item?.submenu?.length ? (
                collaps == item?.id ? (
                  <FiMinus />
                ) : (
                  <FiPlus />
                )
              ) : null}
            </div>
            <div className="ps-3" />
            <div className="subBox">
              {collaps == item?.id
                ? item?.submenu?.map((sub: any) => {
                    return (
                      <div
                        onClick={() => navigate(sub?.route)}
                        className="subItem"
                      >
                        {" "}
                        <DynamicIcon
                          name={sub?.icon}
                          size={17}
                          className="sideItemIcon"
                        />
                        <div className="sideItemText">{sub?.name}</div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default AdminSideBar;
