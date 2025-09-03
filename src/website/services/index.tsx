import { CaretRightOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Card, Collapse, theme } from "antd";
import type { CSSProperties } from "react";
import { Col, Row } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import setupImage2 from "../../assets/images/3 setup pics (1).webp";
import setupImage1 from "../../assets/images/3 setup pics.webp";
import Banking from "../../assets/images/banking.webp";
import financial from "../../assets/images/financialservice.webp";
import supportimg from "../../assets/images/getSupport.webp";
import globalimg from "../../assets/images/global.webp";
import growth from "../../assets/images/growth.webp";
import invoiceimg from "../../assets/images/invoice.webp";
import taximg from "../../assets/images/taximg.webp";
import vector from "../../assets/images/Vector 1.webp";
import heading from "../../assets/images/Vector45.webp";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import "./styles.scss";

function Services(props: any) {
  const { t } = props;
  const text1 = `${t("home_page.homepage.Tax_GO_global_is_Free")}`;
  const text2 = `${t("home_page.homepage.taxgo_service2")}`;
  const text3 = `${t("home_page.homepage.taxgo_service3")}`;
  const text4 = `${t("home_page.homepage.taxgo_service4")}`;

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => [
    {
      key: "1",
      label: <b>{t("home_page.homepage.01 How Deos the Pricing Work")}</b>,
      children: <p>{text1}</p>,
      style: panelStyle,
    },
    {
      key: "2",
      label: (
        <b>
          {t("home_page.homepage.02 What device Can i Use Tax Go Global ?")}
        </b>
      ),
      children: <p>{text2}</p>,
      style: panelStyle,
    },
    {
      key: "3",
      label: (
        <b>
          {t("home_page.homepage.03 How Can I Contact Tax Go 24/7 Support ?")}
        </b>
      ),
      children: <p>{text3}</p>,
      style: panelStyle,
    },
    {
      key: "4",
      label: <b>{t("home_page.homepage.04 How Wil this help my Bussiness")}</b>,
      children: <p>{text4}</p>,
      style: panelStyle,
    },
  ];
  const card = [
    {
      image: invoiceimg,
      title: <div>{t("home_page.homepage.invoice_head")}</div>,
      desc: `${t("home_page.homepage.invoice_txt1")}`,
    },
    {
      image: globalimg,
      title: <div>{t("home_page.homepage.Global_head")}</div>,
      desc: `${t("home_page.homepage.Global_txt1")}`,
    },
    {
      image: taximg,
      title: <div>{t("home_page.homepage.Reports_head")}</div>,
      desc: `${t("home_page.homepage.Reports_txt1")}`,
    },
    {
      image: supportimg,
      title: <div>{t("home_page.homepage.support_head")}</div>,
      desc: `${t("home_page.homepage.Support_txt1")}`,
    },
  ];

  const data = [
    {
      image: Banking,
      title: (
        <div>
          {t("home_page.homepage.accounting_head1")}
          <br />
          {t("home_page.homepage.solution")}.
        </div>
      ),
      desc: `${t("home_page.homepage.accounting_txt1")}`,
    },
    // {
    //   image: payroll,
    //   title: (
    //     <div>
    //       {t("home_page.homepage.Tax_head1")}
    //       <br /> {t("home_page.homepage.payroll")}.
    //     </div>
    //   ),
    //   desc: `${t("home_page.homepage.Tax_txt1")}`,
    // },
    {
      image: financial,
      title: (
        <div>
          {t("home_page.homepage.Financial_head1")}
          <br /> {t("home_page.homepage.Services_head2")}.
        </div>
      ),
      desc: `${t("home_page.homepage.Financial_txt_1")}`,
    },
    {
      image: growth,
      title: (
        <div>
          {t("home_page.homepage.Growth_head1")}
          <br /> {t("home_page.homepage.Access_head2")}.
        </div>
      ),
      desc: `${t("home_page.homepage.Growth_txt1")}`,
    },
  ];

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <div className="website-screens">
      <WebsiteHeader />
      <>
        <div>
          <div className="Services-BoxMain">
            <div className="Services-BoxCover">
              <div className="Services-Box1">
                <div className="Services-Text1">
                  {t("home_page.homepage.provide")}
                </div>

                <div className="Services-Text2">
                  {t("home_page.homepage.account")}
                  <br />
                  {t("home_page.homepage.for Small Business")}
                  <br />
                  {/* {t("home_page.homepage.in Ireland")}  */}
                </div>
                <br />
                <div>
                  <Link to="/signup">
                    <button
                      style={{
                        width: "240px",
                        height: "40px",
                        backgroundColor: "#0ea000",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    >
                      {t("home_page.homepage.Get_started")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="Services-Box1Mobile">
            <div className="Services-Text1">
              {t("home_page.homepage.provide")}
            </div>
            <div className="Services-Text2">
              {t("home_page.homepage.account")}
              <br />
              {t("home_page.homepage.for Small Business")}
              <br />
              {t("home_page.homepage.in Ireland")}
            </div>
            <br />
            <div className="Services-btnDiv">
              <Link to="/signup">
                <button className="Services-btn">
                  {t("home_page.homepage.Get_started")}
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="Services-Box2 dark-bg">
          <Row className="gy-3">
            {data.map((item) => (
              <Col xl={4} lg={6} md={6}>
                <Card
                  style={{
                    border: "none",
                  }}
                >
                  <div className="first-content">{item.title}</div>
                  <div className="card-body">
                    <img
                      src={item.image}
                      className="Services-cardImg"
                      alt="img"
                    />
                    <div className="second-content">{item.desc}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className="AccountEasily-coverDiv">
          <div className="Services-imgDiv">
            <img className="AccountEasily-img" src={vector} alt="img" />
            <div className="AccountEasily-Text3">
              {t("home_page.homepage.save_upto")}
            </div>
          </div>
          <div className="Services-Text4">
            {t("home_page.homepage.setup_and")}
          </div>
          <Row>
            <Col className="order-1" style={{ padding: "0px" }} lg={6} md={12}>
              <div className="AccountEasily-cardImgDiv">
                <img
                  className="AccountEasily-cardImg"
                  src={setupImage1}
                  alt="img"
                />
              </div>
            </Col>
            <Col className="order-2" style={{ padding: "0px" }} lg={6} md={12}>
              <div className="AccountEasily-TextCoverDiv1">
                <div className="AccountEasily-cardTaitil">
                  {t("home_page.homepage.inventory")}
                </div>
                <div className="AccountEasily-cardDescription">
                  {t("home_page.homepage.adding_products")}
                </div>
                <div className="AccountEasily-cardTaitil pt-3">
                  {t("home_page.homepage.contacts")}
                </div>
                <div className="AccountEasily-cardDescription">
                  {t("home_page.homepage.contacts_text1")}
                </div>
              </div>
            </Col>
            <Col
              className="order-4 order-lg-3"
              style={{ padding: "0px" }}
              lg={6}
              md={12}
            >
              <div className="AccountEasily-TextCoverDiv">
                <div className="AccountEasily-cardTaitil">
                  {t("home_page.homepage.sale_heading")}
                </div>
                <div className="AccountEasily-cardDescription">
                  {t("home_page.homepage.sale_txt1")}
                </div>
                <div className="AccountEasily-cardTaitil pt-3">
                  {t("home_page.homepage.purchase_heading")}
                </div>
                <div className="AccountEasily-cardDescription">
                  {t("home_page.homepage.purchase_txt1")}
                </div>
              </div>
            </Col>
            <Col
              className="order-3 order-lg-4"
              style={{ padding: "0px" }}
              lg={6}
              md={12}
            >
              <div className="AccountEasily-cardImgDiv">
                <img
                  className="AccountEasily-cardImg"
                  src={setupImage2}
                  alt="img"
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="Services-Box2">
          {/* <div className="Services-imgDiv">
            <img src={taxcalculator} alt="img" />
            <div className="Services-Text3">
              <b>{t("home_page.homepage.Tax_calculator")}</b>
            </div>
          </div> */}
          {/* <div className="Services-Text4">
            {t("home_page.homepage.calculator_txt1")}
          </div> */}
          <Row gutter={[24, 16]}>
            {card.map((item) => (
              <Col xl={3} lg={6} md={6}>
                <Card style={{ border: "none" }}>
                  <div className="first-content">{item.title}</div>
                  <div className="card-body">
                    <img
                      src={item.image}
                      className="Services-cardImg"
                      alt="img"
                    />
                    <div className="second-content">{item.desc}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className="Services-imgDiv">
          <img src={heading} alt="img" />
          <div className="Services-Text3">
            <b>{t("home_page.homepage.frequently_txt_1")}</b>
          </div>
        </div>
        <div className="Services-Text4">
          {t("home_page.homepage.frequently_head")}
        </div>
        <div className="Services-Box3">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ background: token.colorBgContainer, width: "80%" }}
            items={getItems(panelStyle)}
          />
        </div>
      </>
      <Whatsapp />
      {/* <ChatBot/> */}
      <WebsiteFooter />
    </div>
  );
}
export default withTranslation()(Services);
