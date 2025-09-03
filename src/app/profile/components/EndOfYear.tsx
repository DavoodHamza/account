import { Button, Card, Popconfirm, notification } from "antd";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../config/api";
import {
  clearendofyear,
  completeprogress,
  setNewAdminId,
  setResponse,
  updateprogress1,
  updateprogress2,
  updateprogress3,
  updateprogress4,
  updateprogress5,
} from "../../../redux/slices/endofyearSlice";
import { logout } from "../../../redux/slices/userSlice";
import { CREATEBASEURL, GET } from "../../../utils/apiCalls";
import EndofLoadingModel from "./endofloadingModel";
import { t } from "i18next";
import { Store } from "../../../redux/store";

function EndOfYear() {
  const endofProgress = useSelector((state: any) => state.endofyear);

  const [ismodel, setModel] = useState(false);
  const [newAdminId, setnewAdminId] = useState(endofProgress.newAdminId);
  const [isLoading1, setisLoading1] = useState(false);
  const [isLoading2, setisLoading2] = useState(false);
  const [isLoading3, setisLoading3] = useState(false);
  const [isLoading4, setisLoading4] = useState(false);
  const [isLoading5, setisLoading5] = useState(false);
  const [isError, setisError] = useState(-1);
  const [pendingProcess, setPendingProcess] = useState(5);

  const { user } = useSelector((state: any) => state.User);

  const dispatch = useDispatch();

  const handleEndOfYear = async () => {
    try {
      setModel(true);
      if (endofProgress.process1) {
        await syncProcess1();
      } else if (endofProgress.process2) {
        await syncProcess2(endofProgress.data);
      } else if (endofProgress.process3) {
        await syncProcess3(endofProgress.data);
      } else if (endofProgress.process4) {
        await syncProcess4(endofProgress.data);
      } else if (endofProgress.process5) {
        await syncProcess5(endofProgress.data);
      } else {
        setPendingProcess(6);
        notification.error({
          message: "Alert: You have already completed all processes.",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          "Failed to set the end-of-year for the current fiscal year ",
      });
    }
  };
  const syncProcess1 = async () => {
    try {
      setisLoading1(true);
      const enspoint = API.END_OF_YEAR_USER + user.id;
      const resposnse: any = await GET(enspoint, {});
      if (resposnse.status) {
        dispatch(updateprogress1(false));
        setnewAdminId(resposnse?.data?.adminId);
        dispatch(setNewAdminId(resposnse.data.adminId));
        dispatch(setResponse(resposnse.data));
        setisLoading1(false);
        setPendingProcess(4);
        await syncProcess2(resposnse?.data);
      } else {
        setisLoading1(false);
        setisError(1);
        console.log("error1");
      }
    } catch (error) {
      setisLoading1(false);
      setisError(1);
      console.log("error1");
    }
  };
  const syncProcess2 = async (newdata: any) => {
    try {
      setisLoading2(true);
      const enspoint =
        API.END_OF_YEAR_SETTINGS +
        user.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        newdata.adminId +
        "/" +
        newdata.companyId;
      const resposnse: any = await GET(enspoint, {});
      if (resposnse.status) {
        dispatch(updateprogress2(false));
        setisLoading2(false);
        const {data}: any = Store.getState().endofyear;
        await syncProcess3(data);
        setPendingProcess(3);
      } else {
        setisError(2);
        setisLoading2(false);
        console.log("error2");
      }
    } catch (error) {
      setisLoading2(false);
      setisError(2);
      console.log("2");
    }
  };
  const syncProcess3 = async (newdata: any) => {
    try {
      setisLoading3(true);
      const enspoint =
        API.END_OF_YEAR_ACCOUNTS +
        user.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        newdata.adminId +
        "/" +
        newdata.companyId;
      const resposnse: any = await GET(enspoint, {});
      if (resposnse.status) {
        dispatch(updateprogress3(false));
        setisLoading3(false);
        const {data}: any = Store.getState().endofyear;
        await syncProcess4(data);
        setPendingProcess(2);
      } else {
        console.log("erroro3");
        setisError(3);
      }
    } catch (error) {
      console.log("erroro3");
      setisLoading3(false);
      setisError(3);
    }
  };
  const syncProcess4 = async (newdata: any) => {
    try {
      setisLoading4(true);
      const enspoint =
        API.END_OF_YEAR_PRODUCTS +
        user.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        newdata.adminId +
        "/" +
        newdata.companyId;
      const resposnse: any = await GET(enspoint, {});
      if (resposnse.status) {
        dispatch(updateprogress4(false));
        setisLoading4(false);
        const {data}: any = Store.getState().endofyear;
        await syncProcess5(data);
        setPendingProcess(1);
      } else {
        setisLoading4(false);
        console.log("erroro4");
        setisError(4);
      }
    } catch (error) {
      console.log("erroro4");
      setisLoading4(false);
      setisError(4);
    }
  };
  const syncProcess5 = async (newdata: any) => {
    try {
      setisLoading5(true);
      const enspoint =
        API.END_OF_YEAR_CONTACTS +
        user.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        newdata.adminId +
        "/" +
        newdata.companyId;
      const resposnse: any = await GET(enspoint, {});
      if (resposnse.status) {
        dispatch(updateprogress5(false));
        setisLoading5(false);
        syncProcess6();
        setPendingProcess(0);
      } else {
        console.log("erroro5");
        setisError(5);
      }
    } catch (error) {
      console.log("erroro5");
      setisLoading5(false);
      setisError(5);
    }
  };
  const syncProcess6 = async () => {
    try {
      const enspoint = API.END_OF_YEAR_BASEURL;
      var date = new Date();
      var year = date.getFullYear();
      let urlName = `${year}-${year + 1}`;
      const {data}: any = Store.getState().endofyear;
      let body = {
        adminId: data.adminId,
        email: user.email,
        phoneNumber: user.phonenumber,
        baseUrl: endofProgress.data.url,
        urlName: urlName,
        type: "email",
      };
      const resposnse: any = await CREATEBASEURL(enspoint, body);
      if (resposnse.status) {
        dispatch(completeprogress({}));
        dispatch(logout({}));
        dispatch(clearendofyear({}));
        setPendingProcess(0);
        setModel(false);
      } else {
        console.log("erroro5");
        setisError(5);
      }
    } catch (error) {
      console.log("erroro5");
      setisLoading5(false);
      setisError(5);
    }
  };

  return (
    <Container>
      <Card>
        <div className="subscription-Txt2">
          {t("home_page.homepage.endof_account")}
        </div>
        <br />
        
        {t("home_page.homepage.The_End_of_Year")}<br/>
        <br/>
        <p>
        <strong> {t("home_page.homepage.Set_End_of_Year")}:</strong>{t("home_page.homepage.End_of_the_Year")}
        </p>
       
       
        <Popconfirm
          title={t("home_page.homepage.btn_ms")}
          onConfirm={handleEndOfYear}                   
        >
          <Button size="large" type="primary">
          {t("home_page.homepage.Set_End_of_Year")}
            
          </Button>
        </Popconfirm>
      </Card>
      {ismodel ? (
        <EndofLoadingModel
          open={ismodel}
          close={() => setModel(false)}
          loading1={isLoading1}
          loading2={isLoading2}
          loading3={isLoading3}
          loading4={isLoading4}
          loading5={isLoading5}
          progress={endofProgress.progress}
          error={isError}
          pending={pendingProcess}
        />
      ) : null}
    </Container>
  );
}

export default EndOfYear;
