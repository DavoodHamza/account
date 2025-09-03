import { Card, Col, Row } from "antd";
import { Container } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import employee from "../../assets/images/payrollimg1.webp";
import timekeeping from "../../assets/images/payrollimg2.webp";
import calculation from "../../assets/images/payrollimg3.webp";
import deduction from "../../assets/images/payrollimg4.webp";
import record from "../../assets/images/payrollimg5.webp";
import taxes from "../../assets/images/payrollimg6.webp";
import distribution from "../../assets/images/payrollimg7.webp";
import netpaycalculation from "../../assets/images/payrollimg8.webp";
import reporting from "../../assets/images/payrollimg9.webp";
import payrollimg from "../../assets/images/payrollpayroll.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import ConsultingForm from "../consulting/component/ConsultingForm";
import "./styles.scss";
function Payroll(props: any) {
  const { t } = props;
  const { Meta } = Card;
  const data = [
    {
      image: employee,
      text: `${t("home_page.homepage.EMPLOYEE_INFORMATION_head")}`,
      description: `${t("home_page.homepage.EMPLOYEE_INFORMATION_body")}`,
      backgroundColor: "#F4F6F8",
    },
    {
      image: timekeeping,
      text: `${t("home_page.homepage.TIME_KEEPING_head")}`,
      description: `${t("home_page.homepage.TIME_KEEPING_body")}`,
      border: "solid 1px #D3D3D3",
    },
    {
      image: calculation,
      text: `${t("home_page.homepage.GROSS_PAY_CALCULATION_head")}`,
      description: `${t("home_page.homepage.GROSS_PAY_CALCULATION_body")}`,
      backgroundColor: "#F4F6F8",
    },
    {
      image: deduction,
      text: `${t("home_page.homepage.DEDUCTIONS_head")}`,
      description: `${t("home_page.homepage.DEDUCTIONS_body")}`,
      border: "solid 1px #D3D3D3",
    },
    {
      image: record,
      text: `${t("home_page.homepage.PAY_ROLL_RECORD_head")}`,
      description: `${t("home_page.homepage.PAY_ROLL_RECORD_body")}`,
      backgroundColor: "#F4F6F8",
    },
    {
      image: taxes,
      text: `${t("home_page.homepage.EMPLOYEE_INFORMATION_head")}`,
      description: `${t("home_page.homepage.PAY_ROLL_TAXES_body")}`,
      border: "solid 1px #D3D3D3",
    },
    {
      image: distribution,
      text: `${t("home_page.homepage.PAYMENT_DISTRIBUTION_head")}`,
      description: `${t("home_page.homepage.PAYMENT_DISTRIBUTION_body")}`,
      backgroundColor: "#F4F6F8",
    },
    {
      image: netpaycalculation,
      text: `${t("home_page.homepage.NET_PAY_CALCULATION_head")}`,
      description: `${t("home_page.homepage.NET_PAY_CALCULATION_body")}`,
      border: "solid 1px #D3D3D3",
    },
    {
      image: reporting,
      text: `${t("home_page.homepage.REPORTING_head")}`,
      description: `${t("home_page.homepage.REPORTING_body")}`,
      backgroundColor: "#F4F6F8",
    },
  ];
  return (
    <div className="website-screens">
      <WebsiteHeader />
      <div className="payrollBox1">{t("home_page.homepage.Payroll_head2")}</div>
      <div className="payrollBox2">
        <br />
        <br />
        <div className="payrollBox3">
          {t("home_page.homepage.Payroll_is_the_process")}
          <br />
          {t("home_page.homepage.wages_bonuses")}
          <br />
          {t("home_page.homepage.while_also")}
        </div>
        <div className="payrollBox4">
          {t("home_page.homepage.Here_are_some")}
        </div>
      </div>
      <Container>
        <div className="payroll-Box5">
          <div className="payroll-Box6">
            <Row className="m-0" gutter={[32, 32]}>
              {data.map((item, index) => (
                <Col lg={8} md={12} key={index}>
                  <Card
                    className="Payroll-Card"
                    style={{
                      height: "100%",
                      width: "100%",
                      padding: "0px",
                      backgroundColor: `${item.backgroundColor}`,
                      border: `${item.border}`,
                      borderRadius: "8px",
                    }}
                    hoverable
                    cover={<img className="payroll-img" src={item.image} />}
                  >
                    <br />
                    <div className="payroll-cardtext">{item.text}</div>
                    <div className="payroll-CardDescription">
                      {item.description}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            <br />
            <br />
            <Row>
              <Col md={12}>
                <img className="payroll-img1" src={payrollimg} />
              </Col>
              <Col md={12}>
                <div className="payroll-imgText">
                  {t("home_page.homepage.Effective_payroll")}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
      <ConsultingForm />
      <Whatsapp />
      {/* <ChatBot/> */}
      <WebsiteFooter />
    </div>
  );
}

export default withTranslation()(Payroll);
