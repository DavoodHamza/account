import React, { useEffect, useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import {
  Button,
  Card,
  ColorPicker,
  DatePicker,
  Form,
  Image,
  Input,
  Radio,
  notification,
} from "antd";
import { Col, Container, Row } from "react-bootstrap";
import PageHeader from "../../../components/pageHeader";
import temp1 from "./templates/images/sample_temp.png";
import temp2 from "./templates/images/sample_temp2.png";
import temp3 from "./templates/images/sample_temp3.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET, PUT } from "../../../utils/apiCalls";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Billings from "./billings";
import { MdCloudUpload } from "react-icons/md";
import LogoPicker from "./LogoPicker";
import { generatePDF } from "./templates";
import ProjectPlan from "./project_plan";
import { useTranslation } from "react-i18next";
import moment from "moment";
function EditProposal() {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [toggle, toggleModal] = useState(false);
  const [img, setImg] = useState(null);
  const [data, setData] = useState<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const adminid = user.adminid;
  const [form] = Form.useForm();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = API.GET_PROPOSAL + id;
      const { data }: any = await GET(url, null);
      setData(data);
      form.setFieldsValue({
        logo: data?.logo,
        primary_color: data?.primary_color,
        secondary_color: data?.secondary_color,
        from_company_name: data?.from_company_name,
        proposal_date: dayjs(data?.proposal_date),
        from_email: data?.from_email,
        from_mobile: data?.from_mobile,
        from_website: data?.from_website,
        from_address: data?.from_address,
        billing: data?.billing,

        to_company_name: data?.to_company_name,
        to_website: data?.to_website,
        to_email: data?.to_email,
        to_mobile: data?.to_mobile,
        to_address: data?.to_address,

        about__from_company: data?.about__from_company,
        proposal_title: data?.proposal_title,
        proposal_subtitle: data?.proposal_subtitle,
        proposal_details: data?.proposal_details,
        proposal_terms: data?.proposal_terms,
        conclusion: data?.conclusion,
        selectedTemplate: data?.template,
        project_plan: data?.project_plan,
        about_from_company_tag:data?.about_from_company_tag,
        about_from_services:data?.about_from_services,
        about_from_technologies:data?.about_from_technologies
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = async (values: any) => {
    try {
      setIsLoading(true);
      const url = API.UPDATE_PROPOSAL + id;
      const { data, status, message }: any = await PUT(url, {
        adminid,
        ...values,
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      });
      if (status) {
        generatePDF(data, selectedTemplate);
        navigate("/usr/proposal");
        notification.success({ message: message });
      } else {
        notification.error({ message: message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <PageHeader
            firstPathText="Proposals"
            firstPathLink={location.pathname.replace("/create", "")}
            secondPathText="Update Proposal"
            secondPathLink={location.pathname}
            title="Update Proposal"
          />
          <Container>
            <Form onFinish={submitHandler} form={form}>
              <br />
              <Card>
                <div className="productAdd-Txt1">Choose a template</div>
                <Form.Item
                  name="selectedTemplate"
                  rules={[
                    {
                      required: true,
                      message: "Please select a template!",
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
                            <Image src={temp3} alt="template-3" />
                          </Card>
                        </Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
                <Row>
                  <Col md={6}>
                    <div className="productAdd-Txt1">Choose Color</div>
                    <Row>
                      <Col
                        md={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <strong>Primary</strong>
                        <Form.Item
                          name="primary_color"
                          style={{ marginBottom: 0 }}
                        >
                          <ColorPicker
                            format={"hex"}
                            style={{ marginLeft: 10 }}
                            onChange={(val: any, data: any) => {
                              form.setFieldsValue({ primary_color: data });
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col
                        md={6}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <strong>Secondary</strong>
                        <Form.Item
                          name="secondary_color"
                          style={{ marginBottom: 0 }}
                        >
                          <ColorPicker
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
                    <div className="productAdd-Txt1">Choose Logo</div>
                    <Form.Item
                      name="logo"
                      rules={[
                        { required: true, message: "Please select a logo" },
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
                          {img || data?.logo ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={img || data?.logo}
                                  alt="Uploaded Logo"
                                  style={{ height: "100px", width: "100px" }}
                                />
                              </div>
                              <Button
                                style={{ marginTop: 10 }}
                                onClick={() => toggleModal(true)}
                              >
                                Change Logo
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
                <div className="productAdd-Txt1">Basic Details</div>

                <Row>
                  <Col md={4}>
                    <label className="formLabel">Company Name</label>
                    <Form.Item
                      name="from_company_name"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Input size="large" placeholder="" />
                    </Form.Item>

                    <label className="formLabel">Date</label>
                    <Form.Item
                      name="proposal_date"
                      style={{ marginBottom: 10 }}
                    >
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
                    <label className="formLabel">Email</label>
                    <Form.Item
                      name="from_email"
                      style={{ marginBottom: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Input size="large" placeholder="Enter Email" />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">Mobile</label>
                    <Form.Item name="from_mobile" style={{ marginBottom: 10 }}>
                      <Input size="large" placeholder="" />
                    </Form.Item>
                    <label className="formLabel">Website</label>
                    <Form.Item name="from_website" style={{ marginBottom: 10 }}>
                      <Input size="large" placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">Address</label>
                    <Form.Item name="from_address">
                      <Input.TextArea size="large" placeholder="" rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
                <br />
                <hr />
                <br />
                <div className="productAdd-Txt1">Proposal To Details</div>
                <Row>
                  <Col md={4}>
                    <label className="formLabel">Company Name</label>
                    <Form.Item
                      name="to_company_name"
                      style={{ marginBottom: 10 }}
                    >
                      <Input size="large" placeholder="" />
                    </Form.Item>
                    <label className="formLabel">Website</label>
                    <Form.Item name="to_website" style={{ marginBottom: 10 }}>
                      <Input size="large" placeholder="" />
                    </Form.Item>
                  </Col>

                  <Col md={4}>
                    <label className="formLabel">Email</label>
                    <Form.Item name="to_email" style={{ marginBottom: 10 }}>
                      <Input size="large" placeholder="Enter Email" />
                    </Form.Item>
                    <label className="formLabel">Mobile</label>
                    <Form.Item name="to_mobile" style={{ marginBottom: 10 }}>
                      <Input size="large" placeholder="" />
                    </Form.Item>
                  </Col>

                  <Col md={4}>
                    <label className="formLabel">Address</label>
                    <Form.Item name="to_address">
                      <Input.TextArea size="large" placeholder="" rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <br />
              <Card>
                <div className="productAdd-Txt1">About the Company</div>
                <Form.Item name="about__from_company">
                  <Input.TextArea size="large" placeholder="" rows={8} />
                </Form.Item>
                <label className="formLabel">About Company Tagline</label>
                <Form.Item
                  name="about_from_company_tag"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea size="large" placeholder="" rows={1} />
                </Form.Item>
                <label className="formLabel">Services</label>
                <Form.Item
                  name="about_from_services"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea size="large" placeholder="" rows={3} />
                </Form.Item>
                <label className="formLabel">Technologies</label>
                <Form.Item
                  name="about_from_technologies"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea size="large" placeholder="" rows={3} />
                </Form.Item>
              </Card>
              <br />

              <Card>
                <div className="productAdd-Txt1">About The Proposal</div>
                <Row>
                  <Col md={4}>
                    <label className="formLabel">Proposal Title</label>
                    <Form.Item
                      name="proposal_title"
                      style={{ marginBottom: 10 }}
                    >
                      <Input size="large" placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col md={4}>
                    <label className="formLabel">Sub Title</label>
                    <Form.Item
                      name="proposal_subtitle"
                      style={{ marginBottom: 10 }}
                    >
                      <Input size="large" placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
                <label className="formLabel">Details</label>
                <Form.Item name="proposal_details">
                  <Input.TextArea size="large" placeholder="" rows={8} />
                </Form.Item>

                <Billings form={form} />
                <ProjectPlan form={form} />

                <label className="formLabel">Terms & Conditions</label>
                <Form.Item name="proposal_terms">
                  <Input.TextArea size="large" placeholder="" rows={8} />
                </Form.Item>
                <label className="formLabel">Conclusion</label>
                <Form.Item name="conclusion">
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
                      Cancel
                    </Button>
                  </Col>
                  <Col md={3}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      style={{ height: 45 }}
                    >
                      Update & Download
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
      )}
    </>
  );
}

export default EditProposal;
