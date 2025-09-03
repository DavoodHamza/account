import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "../../config/api";
import { REGISTERPOST } from "../../utils/apiCalls";
import { Button, notification } from "antd";
import { VscVerifiedFilled } from "react-icons/vsc";
import { TbXboxX } from "react-icons/tb";
import "./styles.scss";
import LoadingBox from "../../components/loadingBox";
import { useNavigate } from "react-router-dom";
const UpdateEmail = (props: any) => {
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { verifyData } = useParams();

  const updateEmalAddress = async() =>{

      let url = API.BASE_URL + 'user/updateEmailAddress';
      try {
        setIsLoading(true);
        const response: any = await REGISTERPOST(url, {verifyData});
        if (response.status) {
          setStatus(true)
          notification.success({
            message: "Success",
            description: "Your email has been updated successfully.",
          });
        }else{
          setStatus(false)
          notification.error({
            message: "Failed",
            description: "Failed to update email..",
          });
        }
      } catch (error) {
        setStatus(false)
        notification.error({
          message: "Server Error",
          description: "Failed to update email. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
  }

  const verfyEmail = async () => {
    try {
      setIsLoading(true);
      let url = API.BASE_URL + "user/verifyEmailAddress";
      let obj = {
        verifyData,
      };
     const response :any =  await REGISTERPOST(url, obj);
      if (response.status) {
        setStatus(true)
        notification.success({
          message: "Success",
          description: "Email verified successfully",
        });
      } else {
        setStatus(false)
        notification.error({
          message: "Failed",
          description: "Failed to verify email",
        });
      }
    } catch (error) {
      setStatus(false)
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to verify email!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    props?.type === "verify" && verfyEmail();
    props?.type === "update" && updateEmalAddress();
  }, []);

  return (
    <div className="updateEmail-Box1">
      {isLoading ? (
        <LoadingBox />
      ) : status  ? (
        <div className="updateEmail-Box2">
          <VscVerifiedFilled color="#18a762" size={50} />
          Your email has been Verified
          <br />
          <br />
          <Button className="inputCards" type="primary" onClick={() => navigate("/login")}>
            Go to Login Page
          </Button>
        </div>
      ) :  (
        <div className="updateEmail-Box2">
          <TbXboxX color="red" size={50} />
          Email Not Verified
        </div>
      )
    }
    </div>
  );
};

export default UpdateEmail;
