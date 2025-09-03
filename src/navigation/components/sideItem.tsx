import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import DynamicIcon from "./dynamicIcon";

function SideItem(props: any) {
  const navigation = useNavigate();

  const expandItem = (item: any) => {
    if (props?.item?.submenu?.length) {
      props.clickExpand(props.expand === item ? 0 : item);
    } else {
      navigation(props?.item?.route);
    }
  };

  return (
    <div className="Navigation-SideItem">
      <div
        className={
          props.expand === props.id
            ? "Navigation-SideBox active"
            : "Navigation-SideBox"
        }
        onClick={() => expandItem(props.id)}
      >
        {props.collapsed ? (
          <Popover
            content={
              <div className="Navigation-SideBox1">
                <div className="Navigation-SideBox5">
                  {props?.item?.submenu?.map((item: any) => (
                    <div className="Navigation-SideBox3">
                      <div>
                        <DynamicIcon name={item.icon} size={15} />
                      </div>
                      <div
                        className="Navigation-SideItemtxt2"
                        onClick={() => navigation(item.route)}
                      >
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            title={props.name}
            placement="left"
          >
            <div className="Navigation-SideItemicon" style={{ width: 70 }}>
              <DynamicIcon name={props.Icon} size={20} />
            </div>
          </Popover>
        ) : (
          <>
            <div className="Navigation-SideItemicon">
              <DynamicIcon name={props.Icon} size={20} />
            </div>
            <div className="Navigation-SideItemtxt">{props.name}</div>
            {props.item.submenu && props.item.submenu.length ? (
              <div>
                {props.expand === props.id ? (
                  <IoRemoveOutline size={20} color="grey" />
                ) : (
                  <IoAddOutline size={20} color="grey" />
                )}
              </div>
            ) : null}
          </>
        )}
        <div style={{ margin: 5 }} />
      </div>
      {props.collapsed ? null : props.expand === props.id &&
        props.item.submenu.length ? (
        <div className="Navigation-SideBox1">
          <div style={{ margin: 10 }}></div>
          <div className="Navigation-SideBox2">
            {props?.item?.submenu?.map((item: any) => (
              <div className="Navigation-SideBox3">
                <div>
                  <DynamicIcon name={item.icon} size={15} />
                </div>
                <div
                  className="Navigation-SideItemtxt2"
                  onClick={() => navigation(item.route)}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SideItem;
