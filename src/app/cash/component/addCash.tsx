import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Form, Input, message, notification } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET, POST } from "../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
function AddCashDetails() {
  const {t} = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [cashList, setCashList] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const onFinish = async (val: any) => {
    setIsLoading(true);
    let url = API.UPDATE_BANK;
    let body = {
      adminid: user?.id,
      userid: user?.id,
      logintype: "user",
      opening: val?.opening || 0.0,
      userdate: new Date(),
      date: new Date(),
      laccount: cashList?.laccount,
      nominalcode: cashList?.nominalcode,
      type: 1,
      id:id,
      sdate:user?.companyInfo?.financial_year_start,
      createdBy:user?.isStaff ? user?.staff?.id : user?.id,
      companyid:user?.companyInfo?.id
    };
    try {
      const data: any = await POST(url, body);

      if (data?.status) {
        notification.success({message:"Success",description: "Default cash details updated successfully"});
        navigate("/usr/cash");
        setIsLoading(false);
      } else {
        notification.error({message:"Failed",description:"Failed to update default cash details"});
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({message:"Server Error",description:"Failed to update default cash details"});
      setIsLoading(false);
    }
  };

  const loadCash: any = async () => {
    setIsLoading(true);
    let URL = API.GET_CASH_DETAILS + id;
    const { data }: any = await GET(URL, null);
    setCashList(data);
    if (data) {
      form.setFieldsValue({
        opening: Number(data.opening),
        laccount: data.laccount,
        nominalcode: data.nominalcode,
      });

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const location = useLocation()

  useEffect(() => {
    loadCash();
  }, []);

  return (
    <>
      <PageHeader title={t("home_page.homepage.UpdateDefaultCash")}
      firstPathLink={"/usr/cash"}
      firstPathText={t("home_page.homepage.Cash")}
      secondPathLink={location.pathname}
      secondPathText={t("home_page.homepage.UpdateCash")}
       />
      <br />
      <Container>
        <Card>
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col md={6}>
                <div>
                  <label className="formLabel">{t("home_page.homepage.Type")}</label>
                  <Form.Item name="laccount" style={{ marginBottom: 10 }} >
                    <Input disabled size="large"/>
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <label className="formLabel">{t("home_page.homepage.Name")} </label>
                  <Form.Item name="laccount" style={{ marginBottom: 10 }}>
                    <Input disabled size="large"/>
                  </Form.Item>
                </div>
              </Col>
              
              <Col md={6}>
                <div>
                  <label className="formLabel">{t("home_page.homepage.Opening_Balance")}</label>
                  <Form.Item name="opening"  style={{ marginBottom: 10 }}>
                    <Input type="number" size="large"/>
                  </Form.Item>
                </div>
              </Col>

              <Col md={6}>
                <div>
                  <label className="formLabel">{t("home_page.homepage.Nominal_Code")}</label>
                  <Form.Item name="nominalcode" style={{ marginBottom: 10 }}>
                    <Input disabled size="large"/>
                  </Form.Item>
                </div>
              </Col>
              <br />
              <br />
              <Col md={{ span: 3, offset: 6 }}>
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={() => navigate("/usr/cash")}
                >
                  {t("home_page.homepage.Cancel")}
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                >
                  {t("home_page.homepage.submit")}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default AddCashDetails;
