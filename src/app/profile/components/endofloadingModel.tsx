import {
  CheckCircleTwoTone,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { Modal, Progress, ProgressProps, Spin } from "antd";
import transfer from "../../../assets/images/transfer.webp";
import { FaClock } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { useSelector } from "react-redux";

function EndofLoadingModel(props: any) {
  const twoColors: ProgressProps["strokeColor"] = {
    "0%": "#46ab78",
    "100%": "#0b874b",
  };
  const endofProgress = useSelector((state: any) => state.endofyear);

  console.log(props);
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
          <div className="endmodel-txt1">Sync user data</div>
          {props.loading1 ? (
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
          ) : props.pending === 5 ? (
            endofProgress.process1 === false ? (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            ) : (
              <FaClock color="green" size={24} />
            )
          ) : props.error === 1 ? (
            <MdError color="red" size={24} />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
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
          <div className="endmodel-txt1">Sync settings</div>
          {props.loading2 ? (
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
          ) : [5, 4].includes(props.pending) ? (
            endofProgress.process2 === false ? (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            ) : (
              <FaClock color="green" size={24} />
            )
          ) : props.error === 2 ? (
            <MdError color="red" size={24} />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
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
          <div className="endmodel-txt1">Sync accounts</div>
          {props.loading3 ? (
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
          ) : [5, 4, 3].includes(props.pending) ? (
            endofProgress.process3 === false ? (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            ) : (
              <FaClock color="green" size={24} />
            )
          ) : props.error === 3 ? (
            <MdError color="red" size={24} />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
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
          <div className="endmodel-txt1">Sync products</div>
          {props.loading4 ? (
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
          ) : [5, 4, 3, 2].includes(props.pending) ? (
            endofProgress.process4 === false ? (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            ) : (
              <FaClock color="green" size={24} />
            )
          ) : props.error === 2 ? (
            <MdError color="red" size={24} />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
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
          <div className="endmodel-txt1">Sync contacts</div>
          {props.loading5 ? (
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
          ) : [5, 4, 3, 2, 1].includes(props.pending) ? (
            endofProgress.process5 === false ? (
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 24 }}
              />
            ) : (
              <FaClock color="green" size={24} />
            )
          ) : props.error === 5 ? (
            <MdError color="red" size={24} />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 24 }}
            />
          )}
        </div>

        <Progress
          strokeColor={twoColors}
          percent={props.progress}
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
}

export default EndofLoadingModel;
