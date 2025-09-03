import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/pageHeader';
import { Container } from 'react-bootstrap';
import { Card, Button, Form, DatePicker, Select,notification} from 'antd';
import { Col, Row } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import LedgerTable from "./table";
import moment from "moment";
import {AccountledgerTemplate} from "./template";
import LoadingBox from '../../../components/loadingBox';
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";

const AccountLedger = () => {
  const { user } = useSelector((state: any) => state.User);
  const navigate = useNavigate();
  const [saleList, setSaleList] = useState<any>([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);
  const [selectedLedger, setSelectedLedger] = useState<any>(null);
  const [searchQurey, setSearchQurey] = useState<any>("");
  const [ledgerEntries, setLedgerEntries] = useState<any>();
  const [customerEntri, setCustomerEntri] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [Ledger,setLedger] = useState<any>([])
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const { RangePicker } = DatePicker;
  const [isLoading, setIsLoading] = useState<any>(false); 
  const { t } = useTranslation();

  let companyid = user?.companyInfo?.id;
  const fetchAllEntries = async () => {
    try {
      const url = API.GET_ALL_ENTRIES + user?.id + `/${user?.companyInfo?.id}?name=${searchQurey}`;
      const { data }: any = await GET(url, null);
      setData(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  const fetchSaleListByCustomer = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      const sales_list_url =
        API.CONTACT_MASTER +
        `statementListByContact/${user?.companyInfo?.adminid}/${selectedLedgerId}/${sdate}/${ldate}`;
      const { data }: any = await GET(sales_list_url, null);
      setSaleList(data);
      setIsLoading(false);
      return data
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const fetchLedgerEntries = async(SDate: any, LDate:any) => {
    try {
      setIsLoading(true);
      let url = API.GET_ALL_LEDGER_DETAILS + `${selectedLedgerId}/${companyid}/${SDate}/${LDate}`;
      const response: any = await GET(url, null);
      setLedger(response?.data);
      return response?.data
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchAllEntries();
    }, 500);
  }, [searchQurey]);
  const defaultStartDate = dayjs().startOf('month');
  const defaultEndDate = dayjs();
  const onFinish = async (values:any) => {
    try {
      setIsLoading(true);
      const selectedAccount = JSON.parse(values.account_name);
      const formattedStartDate = (values.userdate[0]).format("YYYY-MM-DD");
      const formattedEndDate = (values.userdate[1]).format("YYYY-MM-DD");
      if (selectedAccount.contractors_type === "supplier" || selectedAccount.contractors_type === "customer") {
        const customerData = await fetchSaleListByCustomer(moment(formattedStartDate).format('YYYY-MM-DD'), moment(formattedEndDate).format('YYYY-MM-DD'));
        setCustomerEntri(customerData?.ledgerList || []);
        setLedgerEntries([])
      } else {
        const ledgerData = await fetchLedgerEntries(moment(formattedStartDate).format('YYYY-MM-DD'), moment(formattedEndDate).format('YYYY-MM-DD'));
        
        setLedgerEntries(ledgerData || []);
        setCustomerEntri([])
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        personalData: user.companyInfo,
        customer: customerEntri,
        ledger: ledgerEntries,
        ledgerName: selectedLedger,
      };

      let templates: any = null;
      if (!user) {
        notification.error({
          message: <div>Please select an email template</div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }
      if (!user) {
        notification.error({
          message: <div>Please select default Bank </div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/profile/business")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }
      
      if(user){
        templates = AccountledgerTemplate(obj)
      }
      if (type === "email") {
        sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }

      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  const sendMailPdf = async (templates: any, email: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      email: email,
      filename: "Sales Invoice",
      html: encodedString,
      isDownload: false,
      sendEmail: true,
      type: "",
      userid: "",
    };
    const token = user.token;

    const response = await fetch(pdf_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (response.ok) {
      notification.success({ message: "Email Successfully Sent" });
      setEmailModal(false);
    }
    if (!response.ok) {
      notification.success({
        message:
          "Apologies, there was an error when attempting to send the email.",
      });
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };
  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        personalData: user.companyInfo,
        customer: customerEntri,
        ledger: ledgerEntries,
        ledgerName: selectedLedger,
      }
      let templates = AccountledgerTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  const downLoadPdf = async (templates: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "Account Ledger",
      html: encodedString,
      isDownload: true,
      sendEmail: false,
      type: "",
      userid: "",
    };
    const token = user.token;

    const response = await fetch(pdf_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const pdfBlob = await response.arrayBuffer();
    const blob = new Blob([pdfBlob], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Account Ledger${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);

  }
  return (
    <>
      <PageHeader
        firstPathLink={'/usr/report'}
        firstPathText={t("home_page.homepage.Report")}
        secondPathText={t("home_page.homepage.Account_Ledger")}
        goback={-1}
        title={t("home_page.homepage.Account_Ledger")}
        children={
          <div>
            <Button className="Report-HeaderButton-dwnld" 
            onClick={() => generateTemplate("downLoad", {})}
            loading={downloadLoading}>
            <MdFileDownload size={20} /></Button>{" "}
            <Button className="Report-HeaderButton-print" onClick={() => setEmailModal(true)}><MdAttachEmail size={20} /></Button>
          </div>
        }
      />
      <Container>
        <br />
        <Card>
          <div>
            <h5>{t("home_page.homepage.FindAccount_Ledger")}</h5>
            <Form onFinish={onFinish}>
              <Row>
                <Col md={4}>
                  <div className="formItem">
                    <label className="formLabel">{t("home_page.homepage.Date")}</label><br />
                    <Form.Item
                      name="userdate"
                      rules={[{ required: true, message: 'Please select date range!' }]}
                      initialValue={[defaultStartDate, defaultEndDate]}
                    >
                      <RangePicker size="large" defaultValue={[defaultStartDate, defaultEndDate]} />
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="formItem">
                    <label className="formLabel">{t("home_page.homepage.LedgerName")}</label>
                    <Form.Item
                      name={"account_name"}
                      rules={[{ required: true }]}
                    >
                      <Select
                        showSearch
                        size="large"
                        placeholder="Select ledger"
                        onSearch={(val) => setSearchQurey(val)}
                        filterOption={false}
                        onSelect={(value) => {
                          const selectedLedger = JSON.parse(value);
                          setSelectedLedgerId(selectedLedger?.id);
                          setSelectedLedger(selectedLedger?.bus_name || selectedLedger?.laccount);
                        }}
                      >
                        {data
                          ?.filter(
                            (item: any) =>
                              item?.name
                                ?.toLowerCase()
                                .includes(searchQurey?.toLowerCase()) ||
                              item?.laccount
                                ?.toLowerCase()
                                .includes(searchQurey?.toLowerCase())
                          )
                          .map((item: any) => {
                            let stringObj = JSON.stringify(item);
                            return (
                              <Select.Option value={stringObj} key={item.id}>
                                {item?.bus_name || item?.laccount}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col md={2} />
                <Col
                  md={2}
                  style={{ display: "flex", textAlign: "center" }}
                >
                  <div className="formItem">
                    <br />
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                    >
                      {t("home_page.homepage.search")}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
        {emailModal ? (
          <SendMailModal
            open={emailModal}
            close={() => setEmailModal(false)}
            onFinish={(val: any) => genrateTemplate("email", val)}
            ownMail={user.email}
            fileName={`AccountLedger${new Date()}.pdf`}
            Attachment={`${user.companyInfo.bname}_accountledger_${moment(new Date()).format("DD-MM-YYYY")}`}
            defaultValue={{
              to: user.email,
              subject: t("home_page.homepage.Account_Ledger"),
              content: t("home_page.homepage.AccountLedger_Details"),
            }}
          />
        ) : null}
      </Container>
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <LoadingBox />
        </div>
      ) : (
        <LedgerTable
          customer={customerEntri}
          ledger={ledgerEntries}
          ledgerName={selectedLedger}
        />
      )}
    </>
  );
};
export default AccountLedger;