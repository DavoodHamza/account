import { Button, Modal, notification } from "antd";
import { t } from "i18next";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../style.scss";

const VerificationModal = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const resendEmail = async () => {
    try {
      setIsLoading(true);
      let url = API.SEND_VERIFY_EMAIL;
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `${t(
            "home_page.homepage.A_mail_has_been_sent_to_your_Email"
          )}`,
        });
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to send email",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <Modal
        title={
          <div
            className="dashboard-info-modal"
            style={{ fontSize: "20px", padding: 15 }}
          >
            <span>Please verify your email to continue</span>
            <FaExclamationCircle size={24} color="red" />
          </div>
        }
        open={props?.openModal}
        closable={false}
        footer={false}
        maskClosable={false}
        centered
      >
        <div
          style={{
            padding: "0px 15px 15px 15px",
          }}
        >
          <div className="verificationModal-text">
            Hi {props?.user?.fullName}, Please verify your email address by
            clicking the link sent to {props?.user?.email} during registration,
            then click on verified button below.<button onClick={resendEmail} className="resend-button">Resend Email</button>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <Button
              type="primary"
              style={{ height: 50, flex: 1, marginBottom: 5 }}
              className="verificationModal-text"
              onClick={()=>props?.fetchUser()}
              loading={isLoading || (props?.dataLoading)}
            >
              Verified
            </Button>
            
          </div>
          <div style={{ textAlign: "center", fontSize: "12px" }}>
            Queries? Email us at{" "}
            <a href="mailto:info@taxgoglobal.com">info@taxgoglobal.com</a>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default VerificationModal;
