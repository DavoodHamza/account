import { Button, Card, DatePicker, Form, Input, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { update } from "../../../redux/slices/userSlice";
import { PUT } from "../../../utils/apiCalls";

function Accounting(props: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state: any) => state.User);
  const onFinish = async (data: any) => {
    try {
      setIsLoading(true);
      let obj = {
        id: user?.id,
        userid: user?.userid,
        defaultmail: data?.defaultmail,
        cusNotes: data?.cusNotes,
        reporttype: data?.reporttype,
        defaultTerms: data?.defaultTerms,
        financial_year_start: data?.financial_year_start,
        books_begining_from: data?.books_begining_from,
        stripeKey: data?.stripeKey,
        companyid: user?.companyInfo?.id,
        stripe_offline_link: data?.stripe_offline_link,
      };
      let url = API.UPDATE_PROFILE + user?.id + "/" + user?.companyInfo?.id;
      const response: any = await PUT(url, obj);
      if (response.status) {
        notification.success({
          message: `${t("home_page.homepage.success")}`,
          description: `${t("home_page.homepage.accounting_details_success")}`,
        });
        response.data["bankInfo"] = response.bankInfo;
        let obj = {
          ...response?.data,
          isStaff: user?.isStaff,
          staff: user?.staff,
          token:user?.token
        };
        dispatch(update(obj));
        // props.onChange();
      }
      setIsLoading(false);
    } catch (err) {
      console.log("err = = = >", err);
      setIsLoading(false);
    }
  };
  const initialValues = {
    financial_year_start: user?.companyInfo?.financial_year_start
      ? dayjs(user?.companyInfo?.financial_year_start)
      : "",
    books_begining_from: user?.companyInfo?.books_begining_from
      ? dayjs(user?.companyInfo?.books_begining_from)
      : "",
    defaultmail: user?.companyInfo?.defaultmail,
    cusNotes: user?.companyInfo?.cusNotes,
    reporttype: user?.companyInfo?.reporttype,
    defaultTerms: user?.companyInfo?.defaultTerms,
    stripeKey: user?.companyInfo?.stripeKey,
    stripe_offline_link: user?.companyInfo?.stripe_offline_link,
  };

  return (
    <>
      {props?.isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Form
              onFinish={onFinish}
              layout="vertical"
              initialValues={initialValues}
            >
              <Row>
                <Col md={6}>
                  <label className="formLabel">
                    {t("home_page.homepage.Financial_Year_Starting_from")}
                  </label>
                  <Form.Item
                    name="financial_year_start"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: "Financial year starting date is required",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder={t(
                        "home_page.homepage.Financial_Year_Starting_from"
                      )}
                      size="large"
                      style={{ width: "100%" }}
                      format="DD-MM-YYYY"
                      inputReadOnly={true}
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.Default_Email_Content")}
                  </label>
                  <Form.Item
                    name="defaultmail"
                    style={{ marginBottom: 10 }}
                    //rules={[{ required: true ,message:'Default mail content is required'}]}
                  >
                    <Input.TextArea
                      placeholder={t(
                        "home_page.homepage.Default_Email_Content"
                      )}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>

                  <label className="formLabel">
                    {t("home_page.homepage.Default_Invoice_Note")}
                  </label>
                  <Form.Item
                    name="cusNotes"
                    style={{ marginBottom: 10 }}
                    //rules={[{ required: true ,message:'Default invoice note is required'}]}
                  >
                    <Input.TextArea
                      placeholder={t("home_page.homepage.Default_Invoice_Note")}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>

                  <label className="formLabel">{t("home_page.homepage.Stripe_Offline_Linkk")}
                    
                  </label>
                  <Form.Item
                    name="stripe_offline_link"
                    style={{ marginBottom: 10 }}
                  >
                    <Input.TextArea
                      placeholder={t("home_page.homepage.Stripe_Offline_Link")}
                      size="large"
                      rows={2}
                    />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <label className="formLabel">
                    {t("home_page.homepage.Books_Begining_from")}
                  </label>
                  <Form.Item
                    name="books_begining_from"
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: true,
                        message: t("home_page.homepage.book_ms"),
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder={t("home_page.homepage.Books_Begining_from")}
                      size="large"
                      style={{ width: "100%" }}
                      format="DD-MM-YYYY"
                      inputReadOnly={true}
                    />
                  </Form.Item>

                  <label className="formLabel">
                    {t(
                      "home_page.homepage.Default_Invoice_Terms_and_Conditions"
                    )}
                  </label>
                  <Form.Item
                    name="defaultTerms"
                    style={{ marginBottom: 10 }}
                    //rules={[{ required: true ,message:'Default invoice terms is required'}]}
                  >
                    <Input.TextArea
                      placeholder={t(
                        "home_page.homepage.Default_Invoice_Terms_and_Conditions"
                      )}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>
                  <label className="formLabel">
                    {t("home_page.homepage.stripe")}
                  </label>
                  <Form.Item
                    name="stripeKey"
                    style={{ marginBottom: 10 }}
                    // rules={[{ required: true ,message:t("home_page.homepage.StripeKeyrequired")}]}
                  >
                    <Input.TextArea
                      placeholder={t("home_page.homepage.stripe")}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>
                  <Row>
                    <Col md={6}></Col>
                    <Col md={6}>
                      <Button
                        size="large"
                        type="primary"
                        style={{
                          height: 45,
                          fontWeight: "600",
                          width: "100%",
                          display: "block",
                          marginTop: 18,
                        }}
                        htmlType="submit"
                        loading={isLoading}
                      >
                        {t("home_page.homepage.Update")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      )}
    </>
  );
}

export default Accounting;
