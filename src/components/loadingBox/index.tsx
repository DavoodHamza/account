import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd/es";

const LoadingBox = () => {
  const customIcon = (
    <LoadingOutlined type="loading" style={{ fontSize: 44 }} spin />
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "80vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin indicator={customIcon} />
      <br />
      <div style={{ color: "grey" }}>Loading . . . </div>
    </div>
  );
};

export default LoadingBox;
