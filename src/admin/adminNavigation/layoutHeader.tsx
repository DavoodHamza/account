import { Button, Popconfirm } from "antd";
import { useState } from "react";
import Clock from "react-live-clock";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

function LayoutHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="LayoutHeader">
      <div style={{ flex: 1, display: "flex" }}>&nbsp; &nbsp;</div>
      <div className="LayoutHeader-timer">
        <Clock format={"h:mm:ss A"} ticking={true} />
      </div>
      <div>
        <Popconfirm
          title="Logout"
          description="Are you sure you want to log out?"
          onConfirm={() => dispatch(logout({}))}
        >
          <Button danger>Logout</Button>
        </Popconfirm>
      </div>
      &nbsp;&nbsp;
    </div>
  );
}

export default LayoutHeader;
