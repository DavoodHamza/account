import {
  Button,
  Card,
  ColorPicker,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  notification,
} from "antd";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import temp1 from "./templates/images/sample_temp.png";
import temp2 from "./templates/images/sample_temp2.png";
import API from "../../../config/api";
import { POST } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import Billings from "./billings";
import { MdCloudUpload } from "react-icons/md";
import LogoPicker from "./LogoPicker";
import { generatePDF } from "./templates";
import ProjectPlan from "./project_plan";
import moment from "moment";
import { useTranslation } from "react-i18next";
function ProposalForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [toggle, toggleModal] = useState(false);
  const [img, setImg] = useState(null);
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const adminid = user?.companyInfo?.adminid;
  const companyname = user.companyInfo.bname;
  const email = user.companyInfo.cemail;
  const phone = user.companyInfo.cphoneno;
  const fulladdress = user.companyInfo.fulladdress;
  const website = user.companyInfo.website;
  const currentDate = moment().format("DD-MM-YYYY");
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const initialValues = {
    from_company_name: companyname,
    from_mobile: phone,
    from_email: email,
    from_website: website,
    from_address: fulladdress,
    proposal_date: moment(currentDate, "DD-MM-YYYY"),
  };

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      let url = API.CREATE_PROPOSAL;
      const { data, status, message }: any = await POST(url, {
        adminid: Number(adminid),
        template: selectedTemplate,
        ...values,
        to_mobile: values.mobile.toString(),
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      });
      if (status) {
        generatePDF(data, selectedTemplate);
        notification.success({ message: message });
        navigate("/usr/proposal");
      } else {
        notification.error({ message: message });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "something went wrong!! , Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  function containsNull(arr: any[]) {
    let isThereNull = false;
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (element === null || element === undefined) {
        isThereNull = true;
        break;
      }
    }
    return isThereNull;
  }

  const onValuesChange = (column: any, allValues: any) => {
    if (!column || !allValues) {
      console.error("Invalid column or allValues");
      return;
    }
    const { billing } = allValues;
    let total = 0;
    if (billing && Array.isArray(billing)) {
      const updatedBilling = billing.map((item: any, index: number) => {
        if (column?.columns?.length > 1) {
          if (containsNull(column.columns)) {
            const array = [...allValues.columns[index]];
            array[index].price = null;
            array[index].qty = null;
            form.setFieldsValue({ columns: array });
          }
        }
        const qty = parseFloat(item?.qty) || 0;
        const price = parseFloat(item?.price) || 0;
        const itemTotal = qty * price;
        total += itemTotal;
        return {
          description: item?.description,
          qty: item?.qty,
          price: item?.price,
          total: Number(itemTotal),
        };
      });
      form.setFieldsValue({ billing: updatedBilling });
    } else {
      console.error("Invalid billing array");
    }
  };
  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.Proposal")}
        firstPathLink={location.pathname.replace("/create", "")}
        secondPathText={t("home_page.homepage.Create")}
        secondPathLink={location.pathname}
        title={t("home_page.homepage.CreateProposal")}
      />
      <Container>
        <Form
          form={form}
          onFinish={submitHandler}
          onValuesChange={onValuesChange}
          initialValues={initialValues}
        >
          <br />
          <Card>
            <div className="productAdd-Txt1">
              {t("home_page.homepage.Choosetemplate")}
            </div>
            <Form.Item
              name="selectedTemplate"
              rules={[
                {
                  required: true,
                  message: t("home_page.homepage.selecttemplate"),
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => setSelectedTemplate(e.target.value)}
                value={selectedTemplate}
              >
                <Row gutter={[16, 16]}>
                  <Col md={4}>
                    <Radio value="template1">
                      <Card>
                        <Image src={temp1} alt="template-1" />
                      </Card>
                    </Radio>
                  </Col>
                  <Col md={4}>
                    <Radio value="template2">
                      <Card>
                        <Image src={temp2} alt="template-2" />
                      </Card>
                    </Radio>
                  </Col>

                  <Col md={4}>
                    <Radio value="template3">
                      <Card>
                        <Image src={temp2} alt="template-3" />
                      </Card>
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
            <Row>
              <Col md={6}>
                <div className="productAdd-Txt1">
                  {t("home_page.homepage.ChooseColor")}
                </div>
                <Row>
                  <Col md={6} style={{ display: "flex", alignItems: "center" }}>
                    <strong>{t("home_page.homepage.Primary")}</strong>
                    <Form.Item
                      name="primary_color"
                      style={{ marginBottom: 0 }}
                      rules={[
                        {
                          required: true,
                          message: t("home_page.homepage.selectprimarycolor"),
                        },
                      ]}
                    >
                      <ColorPicker
                        defaultValue="#fd7e14"
                        format={"hex"}
                        style={{ marginLeft: 10 }}
                        onChange={(val: any, data: any) => {
                          form.setFieldsValue({ primary_color: data });
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={6} style={{ display: "flex", alignItems: "center" }}>
                    <strong>{t("home_page.homepage.Secondary")}</strong>
                    <Form.Item
                      name="secondary_color"
                      style={{ marginBottom: 0 }}
                      rules={[
                        {
                          required: true,
                          message: t("home_page.homepage.selectsecondarycolor"),
                        },
                      ]}
                    >
                      <ColorPicker
                        defaultValue="#efbc91"
                        format={"hex"}
                        style={{ marginLeft: 10 }}
                        onChange={(val: any, data: any) => {
                          form.setFieldsValue({ secondary_color: data });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <div className="productAdd-Txt1">
                  {t("home_page.homepage.ChooseLogo")}
                </div>
                <Form.Item
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.ChooseLogo"),
                    },
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ marginTop: 20 }}>
                      {img ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={img}
                              alt="Uploaded Logo"
                              style={{ height: "100px", width: "100px" }}
                            />
                          </div>
                          <Button
                            style={{ marginTop: 10 }}
                            onClick={() => toggleModal(true)}
                          >
                            {t("home_page.homepage.ChangeLogo")}
                          </Button>
                        </>
                      ) : (
                        <MdCloudUpload
                          className="profile-edit"
                          color="#fff"
                          size={25}
                          onClick={() => toggleModal(true)}
                        />
                      )}
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <br />

          <Card>
            <div className="productAdd-Txt1">
              {t("home_page.homepage.BasicDetails")}
            </div>

            <Row>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.CompanyName")}
                </label>
                <Form.Item
                  name="from_company_name"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>

                <label className="formLabel">
                  {t("home_page.homepage.Date")}
                </label>
                <Form.Item name="proposal_date" style={{ marginBottom: 10 }}>
                  <DatePicker
                    placeholder=""
                    size="large"
                    style={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    disabledDate={(currentDate) => {
                      const financialYearStart =
                        moment(financialYear).startOf("day");
                      return (
                        financialYearStart &&
                        currentDate &&
                        currentDate < financialYearStart
                      );
                    }}
                  />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Email")}
                </label>
                <Form.Item
                  name="from_email"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Mobile_Number")}
                </label>
                <Form.Item
                  name="from_mobile"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input type="number" size="large" placeholder="" />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Website")}
                </label>
                <Form.Item
                  name="from_website"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Address")}
                </label>
                <Form.Item name="from_address" rules={[{ required: true }]}>
                  <Input.TextArea size="large" placeholder="" rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <hr />
            <br />
            <div className="productAdd-Txt1">
              {t("home_page.homepage.ProposalDetails")}
            </div>
            <Row>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.CompanyName")}
                </label>
                <Form.Item
                  name="to_company_name"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Website")}
                </label>
                <Form.Item
                  name="to_website"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>

              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Email")}
                </label>
                <Form.Item
                  name="to_email"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
                <label className="formLabel">
                  {t("home_page.homepage.Mobile_Number")}
                </label>
                <Form.Item
                  name="mobile"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    placeholder=""
                    controls={false}
                    type="number"
                  />
                </Form.Item>
              </Col>

              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.Address")}
                </label>
                <Form.Item name="to_address" rules={[{ required: true }]}>
                  <Input.TextArea size="large" placeholder="" rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <br />
          <Card>
            <div className="productAdd-Txt1">
              {t("home_page.homepage.AboutCompany")}
            </div>
            <Form.Item name="about__from_company" rules={[{ required: true }]}>
              <Input.TextArea size="large" placeholder="" rows={8} />
            </Form.Item>
            <label className="formLabel">
              {t("home_page.homepage.AboutTagline")}
            </label>
            <Form.Item
              name="about_from_company_tag"
              rules={[{ required: false }]}
            >
              <Input.TextArea size="large" placeholder="" rows={1} />
            </Form.Item>
            <label className="formLabel">
              {t("home_page.homepage.Services_head2")}
            </label>
            <Form.Item name="about_from_services" rules={[{ required: false }]}>
              <Input.TextArea size="large" placeholder="" rows={3} />
            </Form.Item>
            <label className="formLabel">
              {t("home_page.homepage.Technologies")}
            </label>
            <Form.Item
              name="about_from_technologies"
              rules={[{ required: false }]}
            >
              <Input.TextArea size="large" placeholder="" rows={3} />
            </Form.Item>
          </Card>
          <br />

          <Card>
            <div className="productAdd-Txt1">
              {t("home_page.homepage.AboutProposal")}
            </div>
            <Row>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.ProposalTitle")}
                </label>
                <Form.Item
                  name="proposal_title"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>
              <Col md={4}>
                <label className="formLabel">
                  {t("home_page.homepage.SubTitle")}
                </label>
                <Form.Item
                  name="proposal_subtitle"
                  style={{ marginBottom: 10 }}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            <label className="formLabel">
              {t("home_page.homepage.Details")}
            </label>
            <Form.Item name="proposal_details" rules={[{ required: true }]}>
              <Input.TextArea size="large" placeholder="" rows={8} />
            </Form.Item>

            <Billings form={form} />
            <ProjectPlan form={form} />

            <label className="formLabel">{t("home_page.homepage.Terms")}</label>
            <Form.Item name="proposal_terms" rules={[{ required: true }]}>
              <Input.TextArea size="large" placeholder="" rows={8} />
            </Form.Item>
            <label className="formLabel">
              {t("home_page.homepage.Conclusion")}
            </label>
            <Form.Item name="conclusion" rules={[{ required: true }]}>
              <Input.TextArea size="large" placeholder="" rows={8} />
            </Form.Item>

            <Row>
              <Col md={6} />
              <Col md={3}>
                <Button
                  block
                  style={{ height: 45 }}
                  onClick={() => navigate("/usr/proposal")}
                >
                  {t("home_page.homepage.Cancel")}
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ height: 45 }}
                >
                  {t("home_page.homepage.SaveDownload")}
                </Button>
              </Col>
            </Row>
          </Card>
          <br />
          <LogoPicker
            open={toggle}
            modalClose={() => toggleModal(false)}
            form={form}
            setImg={setImg}
          />
        </Form>
      </Container>
    </>
  );
}

export default ProposalForm;
