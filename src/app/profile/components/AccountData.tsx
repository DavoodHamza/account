import { Button, Card, notification, Popconfirm } from "antd";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AccountData(props: any) {
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const clearUserData = async () => {
    try {
      let url = API.CLEAR_USER_DATA + user?.companyInfo?.id;
      const response: any = await GET(url, null);
      if (response.status) {
        notification.success({
          message: `${t("home_page.homepage.success")}`,
          description: response.message,
        });
      } else {
        notification.error({
          message: `${t("home_page.homepage.failed")}`,
          description: `${t("home_page.homepage.Failed_to_Clear_User_Data")}`,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: `${t("home_page.homepage.server_error")}`,
        description: `${t("home_page.homepage.Failed_to_Clear_User_Data")}`,
      });
    }
  };

  const deleteHandler = async (id: number) => {
    try {
      let url = `company_master/${id}`;
      const response: any = await DELETE(url);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Company deleted successfully",
        });
        navigate('/company')
      }else{
        notification.error({
          message:"Failed",
          description:"Failed to delete this company!!"
        })
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to delete this company!! Please try again later",
      });
    } 
  };

  return (
    <Container>
      <Card>
        <div className="subscription-Txt2">
          {t("home_page.homepage.Clear_Data")}
        </div>
        <br />
        <div style={{ color: "red" }}>
          {t("home_page.homepage.Once_you_delete")}
        </div>
        <br />
        <div>{t("home_page.homepage.This_will_permanently")}</div>
        <br />
        <Popconfirm
          title={t("home_page.homepage.Do_you_want_to")}
          onConfirm={clearUserData}
          okText={t("home_page.homepage.OK")}cancelText= {t("home_page.homepage.Cancel")}
        >
          <Button danger size="large">
            {t("home_page.homepage.Delete_My_Accouting_Data")}
          </Button>
        </Popconfirm>
      </Card>
      <br />
      <Card>
        <div className="subscription-Txt2"> {t("home_page.homepage.Delete_Company")}</div>
        <br />
        <div style={{ color: "red" }}>
          {t("home_page.homepage.Once_you_delete")}
        </div>
        <br />
        {t("home_page.homepage.Warning")}
        <br />
        <Popconfirm 
          title={t("home_page.homepage.del_ms")}
          onConfirm={() => deleteHandler(user?.companyInfo?.id)}
          okText={t("home_page.homepage.OK")}cancelText= {t("home_page.homepage.Cancel")}

        >
          <Button danger size="large">
          {t("home_page.homepage.DELETE")}

          </Button>
        </Popconfirm>
      </Card>
    </Container>
  );
}

export default AccountData;
