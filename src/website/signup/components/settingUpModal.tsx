import {
  CheckCircleTwoTone,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { Modal, Progress, ProgressProps, Spin } from "antd";
import { BiDotsHorizontal } from "react-icons/bi";
import { MdError } from "react-icons/md";
import transfer from "../../../assets/images/transfer.webp";

const SettingUpModal = (props: any) => {
  const twoColors: ProgressProps["strokeColor"] = {
    "0%": "#46ab78",
    "100%": "#0b874b",
  };

  return (
    <Modal
      centered
      visible={props.open}
      onCancel={() => props.close()}
      maskClosable={false}
      footer={null}
      width={"35%"}
      closable={false}
    >
      <div style={{ textAlign: "center" }}>
        <img src={transfer} alt="Loading " style={{ height: 280 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "5px 10px 0 10px",
          }}
        >
          <div className="endmodel-txt1">
            {props.loading1 === 3
              ? `Deafult company created`
              : `Creating Default Company`}
          </div>
          {props.loading1 === 1 ? (
            <Spin
              spinning={true}
              size="large"
              tip="Uploading..."
              indicator={
                <Loading3QuartersOutlined
                  style={{ fontSize: 24, color: "green" }}
                  spin
                />
              }
            />
          ) : props.loading1 === 2 ? (
            <MdError color="red" size={24} />
          ) : props.loading1 === 3 ? (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiDotsHorizontal style={{ fontSize: 24 }} />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "5px 10px 0 10px",
          }}
        >
          <div className="endmodel-txt1">
            {props.loading2 === 3
              ? "Default staff created"
              : "Creating Default Staff"}
          </div>
          {props.loading2 === 1 ? (
            <Spin
              spinning={true}
              size="large"
              tip="Uploading..."
              indicator={
                <Loading3QuartersOutlined
                  style={{ fontSize: 24, color: "green" }}
                  spin
                />
              }
            />
          ) : props.loading2 === 2 ? (
            <MdError color="red" size={24} />
          ) : props.loading1 === 3 ? (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiDotsHorizontal style={{ fontSize: 24 }} />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "5px 10px 0 10px",
          }}
        >
          <div className="endmodel-txt1">
            {props.loading3 === 3
              ? "Default Counter and Shift created"
              : "Creating Default Counter and Shift"}
          </div>
          {props.loading3 === 1 ? (
            <Spin
              spinning={true}
              size="large"
              tip="Uploading..."
              indicator={
                <Loading3QuartersOutlined
                  style={{ fontSize: 24, color: "green" }}
                  spin
                />
              }
            />
          ) : props.loading3 === 2 ? (
            <MdError color="red" size={24} />
          ) : props.loading1 === 3 ? (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiDotsHorizontal style={{ fontSize: 24 }} />
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "5px 10px 0 10px",
          }}
        >
          <div className="endmodel-txt1">
            {props.loading4 === 3
              ? "Default Product created"
              : "Creating Default Product"}
          </div>
          {props.loading4 === 1 ? (
            <Spin
              spinning={true}
              size="large"
              tip="Uploading..."
              indicator={
                <Loading3QuartersOutlined
                  style={{ fontSize: 24, color: "green" }}
                  spin
                />
              }
            />
          ) : props.loading4 === 2 ? (
            <MdError color="red" size={24} />
          ) : props.loading1 === 3 ? (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BiDotsHorizontal style={{ fontSize: 24 }} />
            </div>
          )}
        </div>

        <Progress
          strokeColor={twoColors}
          percent={props?.progress}
          style={{
            marginTop: 15,
            fontSize: 20,
            color: "#ff9800",
            fontFamily: "Poppins-Bold",
          }}
          type="line"
          size={["100%", 15]}
        />
      </div>
    </Modal>
  );
};

export default SettingUpModal;
