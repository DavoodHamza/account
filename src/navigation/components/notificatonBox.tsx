import moment from "moment";
import { useSelector } from "react-redux";

function NotificatonBox() {
  const { user } = useSelector((state: any) => state.User);
  const options = [
    {
      name: "Email Verification ",
      message: user
        ? user.emailverified === 1
          ? "Email is verified"
          : "Email is not verified"
        : "",
      datetime: new Date(),
      avatar: "EV",
    },
    {
      name: "You can view Bank Transfer",
      message: "View new layout of bank transfer",
      datetime: new Date(),
      avatar: "BT",
    },
    {
      name: "Emailing is easy",
      message:
        "You can email your Invoice to Customer easily while creating Invoice",
      datetime: new Date(),
      avatar: "SI",
    },
    {
      name: "Record Payment",
      message: "Now you can record payments while creating Invoice(sales)",
      datetime: new Date(),
      avatar: "SI",
    },
  ];
  return (
    <div>
      {options.map((item: any) => {
        return (
          <div>
            <div className="Notificaton-Box1" key={item.avatar}>
              <div className="Notificaton-Box2">
                <div>{item.avatar}</div>
              </div>
              <div className="Notificaton-Box3">
                <b style={{ fontSize: 15 }}>{item.name}</b> <br />
                <div style={{ fontSize: 12, width: "250px", overflow: "auto" }}>
                  {item.message}
                  <br /> {moment(item.datetime).format()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NotificatonBox;
