import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET, PUT } from "../../../utils/apiCalls";
import moment from "moment";
import { useTranslation } from "react-i18next";

function ReccuringEdit(props: any) {
  const { t } = useTranslation();
  const todaysDate = new Date()
  const { id } = useParams()
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { Option } = Select;
  const [recId,setrecId] = useState();

  useEffect(() => {
    getDetails()
  }, [])

  const onFinish = async (val: any) => {
    setIsLoading(true);
    try {
      
      let reccuringUrl = API.EDIT_RECCURING + recId;
      const response: any = await PUT(reccuringUrl, val);
      if (response.status) {
        setIsLoading(false);
        notification.success({ message: "Success", description: "Reccuring details updated successfully" });
        navigate(-1);
      } else {
        notification.error({ message: "Failed", description: "Failed to update reccuring details" });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update reccuring details!! Please try again later"
      });
      setIsLoading(false);
    }
  };

  const getDetails = async () => {
    setIsFullLoading(true);
    try {
      let url = API.GET_RECCURING + id
      const getreccDetails: any = await GET(url, null);
      setrecId(getreccDetails?.data?.id)
      if (getreccDetails.status) {
        setDetails(getreccDetails?.data);
        form.setFieldsValue({
          date: dayjs(getreccDetails?.data?.date),
          mailto: 'mail',
          period: getreccDetails?.data?.period,
          nextdate: dayjs(getreccDetails?.data?.nextdate),
          invoice_number: getreccDetails?.data?.invoice_number,
        });
        setIsFullLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsFullLoading(false);
    }
  };

  const handleValueChange = (value: any) => {
    let nextDate;
    if (value === 'daily') {
      nextDate = moment(form.getFieldValue('date')).add(1, 'day').format("YYYY-MM-DD");
    } else if (value === 'weekly') {
      nextDate = moment(form.getFieldValue('date')).add(7, 'day').format("YYYY-MM-DD");
    } else if (value === 'monthly') {
      nextDate = moment(form.getFieldValue('date')).add(1, 'month').format("YYYY-MM-DD");
    } else if (value === 'yearly') {
      nextDate = moment(form.getFieldValue('date')).add(1, 'year').format("YYYY-MM-DD");
    }
    form.setFieldValue("nextdate", dayjs(nextDate))
  }

  return (
    <div>
      <PageHeader
        title="Edit Reccuring Notification"
        goBack={"/dashboard"}
        secondPathText="Edit Reccuring Notification"
        secondPathLink={"/usr/sales-invoice"}
      />
      <br />

      <Container>
        <Card>
          {isFullLoading ? (
            <LoadingBox />
          ) : (
            <Form
              form={form}
              onFinish={onFinish}
            >
              <>
                <Row>
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.Invoice_Number")}
                    </div>
                    <Form.Item
                      noStyle
                      name="invoice_number"
                    >
                      <Input
                        style={{ width: "100%" }}
                        size="large"
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.start_date")} :
                    </div>
                    <Form.Item
                      noStyle
                      name="date"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        size="large"
                        disabledDate={(currentDate) => {
                          const financialYearStart =
                            moment(todaysDate).startOf("day");
                          return (
                            financialYearStart &&
                            currentDate &&
                            currentDate < financialYearStart
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.Period")}:
                    </div>
                    <Form.Item
                      noStyle
                      name="period"
                    >
                      <Select placeholder="Select period" size="large"
                        style={{ width: "100%" }}
                        onChange={handleValueChange}
                      >
                        <Option value="daily">{t("home_page.homepage.Daily")}</Option>
                        <Option value="weekly">{t("home_page.homepage.Weekly")}</Option>
                        <Option value="monthly">{t("home_page.homepage.Monthly")}</Option>
                        <Option value="yearly">{t("home_page.homepage.Yearly")}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {t("home_page.homepage.SendVia")}
                    </div>
                    <Form.Item
                      name="mailto"
                      rules={[{ message: "Select a method" }]}
                    >
                      <Select size="large" defaultValue="Mail">
                        <Select.Option>{t("home_page.homepage.Mail")}</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={4}>
                    <div className="formLabel" style={{ marginTop: 10 }}>
                      {("Next Date")} :
                    </div>
                    <Form.Item
                      noStyle
                      name="nextdate"
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        size="large"
                        open = {false}
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col md={8} />
                </Row>
                <br />
              </>
              <Row>
                <Col sm={6}></Col>
                <Col sm={6}>
                  <Row>
                    <Col sm={6}>
                      {/* <Button size="large" block>
                          Close
                        </Button> */}
                    </Col>
                    <Col sm={6}>
                      <Button
                        size="large"
                        block
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                      >
                        {("Update")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      </Container>
    </div>
  );
}
export default ReccuringEdit;
