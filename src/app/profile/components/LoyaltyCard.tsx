import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { REGISTERGET, REGISTERPOST } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import LoyaltyCardTable from "../../../admin/loyaltyCard/components/table";
import { Button, Form, Input, Modal, Tag, notification } from "antd";
import { useTranslation } from "react-i18next";
import { t } from "i18next";







const LoyaltyCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);

  useEffect(() => {
    fetchCardData();
  }, []);

  const columns = [
    {
      name: "id",
      title:`${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "cardNumber",
      title: t("home_page.homepage.CardNumber"),
      dataType: "string",
    },
    {
      name: "assignedStatus",
      title:t("home_page.homepage.AssignedStatus"),
      dataType: "string",
      cellRender: ({ data }: any) => (data?.assignedStatus ? <Tag color="green">Assigned</Tag> : <Tag color="red">Not Assigned</Tag>),
    },
    {
      name: "status",
      title:t("home_page.homepage.status"),
      dataType: "string",
      cellRender: ({ data }: any) => (data?.status ? "Active" : "Inactive"),
    },
  ];

  const fetchCardData = async () => {
    try {
      setIsLoading(true);
      let url =
        API.MASTER_BASE_URL +
        `loyalyCardMaster?userId=${user?.id}&companyId=${user?.companyInfo?.id}`;
      const data: any = await REGISTERGET(url, null);
      setCardData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
        setIsLoading(true)
        let url = API.MASTER_BASE_URL + "loyalyCardMaster/insertAll";
        let obj = {
            userId:user?.id,
            userName:user?.fullName,
            companyId:user?.companyInfo?.id,
            companyName:user?.companyInfo?.bname,
            number:values?.number
        }
        const response:any = await REGISTERPOST(url,obj)
        if(response.status){
            setIsOpen(false)
            notification.success({message:"Success",description:"Card numbers added successfully"})
            fetchCardData()
            
        }else{
            notification.error({message:"Failed",description:"Failed to add card numbers"})
        }

    } catch (error) {
      console.log(error);
      notification.error({message:"Failed",description:"Failed to add card numbers! Please try again later"})
    }finally{
        setIsLoading(false)
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <LoyaltyCardTable
            columns={columns}
            list={cardData}
            title={t("home_page.homepage.loyaltyCard")}
            onButtonClick={() => setIsOpen(true)}
          />
        </Container>
      )}
      <Modal
        title={t("home_page.homepage.GenerateCardNumbers")}
        open={isOpen}
        centered
        onCancel={() => setIsOpen(false)}
        footer={false}
        width={500}
      >
        <Form onFinish={onFinish}
         initialValues={{
            userName: user?.fullName,
            companyName: user?.companyInfo?.bname,
            number:null
          }}
          >
          <Row>
            <Col md={12}>
              <label className="formLabel">{t("home_page.homepage.User_Name")},</label>
              <Form.Item name="userName">
                <Input size="large" readOnly />
              </Form.Item>
            </Col>
            <Col md={12}>
              <label className="formLabel">{t("home_page.homepage.Company_Name")}</label>
              <Form.Item name="companyName">
                <Input size="large" readOnly />
              </Form.Item>
            </Col>
            <Col md={12}>
              <label className="formLabel">{t("home_page.homepage.Number_of_Cards")}</label>
              <Form.Item name="number" rules={[{ required: true ,message:'Card number is required'},
                {
                    validator: (_, value) =>
                      value > 0
                        ? Promise.resolve()
                        : Promise.reject(new Error('number must be greater than 0')),
                  },

              ]}>
                <Input
                  size="large"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                  }}

                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={6}></Col>
            <Col sm={3}>
              <Button
                block
                onClick={() => setIsOpen(false)}
                style={{ marginRight: 10 }}
                size="large"
              >
                 {t("home_page.homepage.Cancel")}
              </Button>
            </Col>
            <Col sm={3}>
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                 {t("home_page.homepage.submit")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default LoyaltyCard;
