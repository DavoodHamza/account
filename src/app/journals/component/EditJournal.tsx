import { Button, DatePicker, Form, Input, notification } from "antd";
import "../styles.scss";
import { Row, Col, Container } from "react-bootstrap";
import { Select } from "antd";
import React, { useState, useEffect } from "react";
import API from "../../../config/api";
import { PUT } from "../../../utils/apiCalls";
import { GET } from "../../../utils/apiCalls";
import PageHeader from "../../../components/pageHeader";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router";
import dayjs from "dayjs";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";
function EditJournal() {
  const {t} = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const [dataEntries, setDataEntries] = useState<any>([]);
  const [journalData, setJournalData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledFeilds, setIsDisabledFeilds] = useState<any>([]);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalDebits, setTotalDebits] = useState<number>(0);
  const [searchQurey, setSearchQurey] = useState<any>("");
  const [forms] = Form.useForm();
  const navigate = useNavigate();
  const adminid = user?.id;
  const location = useLocation();
  const { id } = useParams();

  const onValuesChange = (_: any, values: any) => {
    let totalCredits = 0;
    let totalDebits = 0;
    let isDisabled: any = [];
    if (values?.column) {
      values.column.forEach((earning: any, index: any) => {
        let obj = { credit: false, debit: false };
        if (earning?.creditAmount) {
          obj["credit"] = false;
          obj["debit"] = true;
          totalCredits += parseFloat(earning?.creditAmount);
        } else if (earning?.debitAmount) {
          obj["credit"] = true;
          obj["debit"] = false;
          totalDebits += parseFloat(earning?.debitAmount);
        }
        isDisabled.push(obj);
      });
    }
    setIsDisabledFeilds(isDisabled);
    setTotalCredits(totalCredits);
    setTotalDebits(totalDebits);
  };
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const onSubmit = async (values: any) => {

    try {
      setIsLoading(true);
      const url = API.JOURNAL + `update/${id}`;
      
      const columnsWithDetails = values?.column?.map((col: any,index:number) => {
        let val;
      try {
        val = JSON.parse(col?.account);
      } catch (error) {
        val = col?.account;
      }

        return {
          debit: col.debitAmount ? col.debitAmount : 0,
          credit: col.creditAmount ? col.creditAmount : 0,
          details: col.details,
          [val?.name ? val?.name : col?.idValue?.name]: val?.id ? val?.id : col?.idValue?.id,
          id: col.id,
          includeVat: false,
          vatrate: 0,
        };
      });

      const obj = {
        userdate: values.date,
        adminid,
        // userid: user.id,
        reference: values.reference,
        description: values.description,
        total: totalCredits ? totalCredits : totalDebits,
        date: values.date,
        column: columnsWithDetails,
        type: "2",
        id: journalData.id,
        createdBy:user?.isStaff ? user?.staff?.id : adminid,
        companyid:user?.companyInfo?.id
      };
      const response: any = await PUT(url, obj);
      if (response.status) {
        navigate("/usr/Journal");
        notification.success({ message:"Success",description: "Journal updated successfully" });
      } else {
        notification.error({
          message:"Failed",description: "Failed to create journal",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      notification.error({
        message:"Server Error",description: "Failed to update journal!! Please try again later",
      });
      setIsLoading(false);
    }
  };

  const fetchAllEntries = async () => {
    try {
      const url = API.GET_ALL_ENTRIES + adminid + `/${user?.companyInfo?.id}?name=${searchQurey}`;
      const { data }: any = await GET(url, null);
      setDataEntries(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDetails = async () => {
    try {
      setIsLoading(true);

      const url = API.JOURNAL + `getJournalById/${id}`;
      const { data }: any = await GET(url, null);
      setJournalData(data);

      let totalDebits = 0;
      let totalCredits = 0;
      let isDisabled: any = [];

      const mappedColumns = data?.column?.map((item: any, index: any) => {
        const debitAmount =
          item?.debit !== "0.00" ? parseFloat(item?.debit) : null;
        const creditAmount =
          item?.credit !== "0.00" ? parseFloat(item?.credit) : null;
        let obj = { credit: false, debit: false };

        if (debitAmount !== null) {
          totalDebits += debitAmount;
          obj["credit"] = true;
          obj["debit"] = false;
        }

        if (creditAmount !== null) {
          totalCredits += creditAmount;
          obj["credit"] = false;
          obj["debit"] = true;
        }
        isDisabled.push(obj);
        setIsDisabledFeilds(isDisabled);

        const initialValue = {
          name: item.ledger ? "ledger" : item.cname ? "cname" : null,
          id: item.ledger || item.cname,
        };

        return {
          idVlaue:initialValue,
          account: item?.bus_name || item?.ledgerDetails?.laccount,
          debitAmount,
          creditAmount,
          details: item?.details,
        };
      });

      forms.setFieldsValue({
        date: dayjs(data?.userdate),
        reference: data?.reference,
        description: data?.description,
        column: mappedColumns.map((col: any) => ({
          idValue:col?.idVlaue,
          account: col.account,
          debitAmount: col.debitAmount,
          creditAmount: col.creditAmount,
          details: col.details,
        })),
        userdate: dayjs(data?.userdate),
        adminid,
        // userid: user?.id,
        total: data?.total,
      });

      setTotalCredits(totalCredits);
      setTotalDebits(totalDebits);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);
  useEffect(() => {
    setTimeout(()=>{
      fetchAllEntries();
    },500)
  }, [searchQurey]);

  return (
    <div>
      <PageHeader
        firstPathLink={location.pathname.replace(`/edit/${id}`, "")}
        firstPathText={t("home_page.homepage.Journal_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.UpdateJournal")}
        goback="/usr/journal"
        title={t("home_page.homepage.UpdateJournal")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container className="mt-2">
          <div className="adminTable-Box1">
            <div className="adminTable-Box2">
              <div className="white-card">
                <div>
                  <Form
                    {...layout}
                    onFinish={onSubmit}
                    form={forms}
                    onValuesChange={onValuesChange}
                  >
                    <div className="productAdd-Txt1">{t("home_page.homepage.Journals")}</div>
                    <Row>
                      <Col md={6}>
                        <div className="formItem">
                          <label className="formLabel">{t("home_page.homepage.JournalDate")}</label>
                          <Form.Item name="date" rules={[{ required: true }]}>
                            <DatePicker
                              style={{ width: "100%" }}
                              format="YYYY-MM-DD"
                              size="large"
                            />
                          </Form.Item>
                        </div>
                        <div className="formItem">
                          <label className="formLabel">{t("home_page.homepage.Reference")}</label>
                          <Form.Item
                            name="reference"
                            rules={[{ required: true }]}
                          >
                            <Input size="large" placeholder={t("home_page.homepage.Reference")} />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="formItem">
                          <label className="formLabel">{t("home_page.homepage.Description")}</label>
                          <Form.Item name="description">
                            <Input.TextArea
                              rows={5}
                              placeholder={t("home_page.homepage.Description")}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <div className="productAdd-Txt1">{t("home_page.homepage.JOURNALITEMS")}</div>
                    <Form.List name="column">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field: any, index) => {
                            return (
                              <Row key={field.key}>
                                <Col md={3}>
                                  <label className="formLabel">{t("home_page.homepage.Account")}</label>
                                  <Form.Item
                                    name={[field.name, "account"]}
                                    rules={[{ required: true }]}
                                    
                                  >
                                    <Select
                                      placeholder={t("home_page.homepage.Choose_an_account")}
                                      size="large"
                                      showSearch
                                      filterOption={false}
                                      onSearch={(val) => setSearchQurey(val)}
                                     
                                    >
                                      {dataEntries
                                      ?.filter(
                                        (item: any) =>
                                          item?.bus_name
                                            ?.toLowerCase()
                                            .includes(searchQurey.toLowerCase()) ||
                                          item?.laccount
                                            ?.toLowerCase()
                                            .includes(searchQurey.toLowerCase())
                                      )
                                      .map((item: any, index:any) => {
                                        let obj = {
                                          name: item?.laccount
                                            ? "ledger"
                                            : item?.name
                                            ? "cname"
                                            : null,
                                          id: item.id,
                                        };
                                        let stringObj = JSON.stringify(obj);
                                       return <Select.Option key={item.id} value={stringObj} >
                                          {item?.bus_name || item?.laccount}
                                        </Select.Option>
                                         })}
                                  </Select>
                                  </Form.Item>
                                </Col>
                                <Col md={2}>
                                  <label className="formLabel">{t("home_page.homepage.Debit")}</label>
                                  <Form.Item name={[field.name, "debitAmount"]}>
                                    <Input
                                      type="number"
                                      placeholder={t("home_page.homepage.Enteramount")}
                                      size="large"
                                      disabled={
                                        isDisabledFeilds?.length
                                          ? isDisabledFeilds[index]?.debit
                                          : false
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col md={2}>
                                  <label className="formLabel">{t("home_page.homepage.Credit")}</label>
                                  <Form.Item
                                    name={[field.name, "creditAmount"]}
                                  >
                                    <Input
                                      type="number"
                                      placeholder={t("home_page.homepage.Enteramount")}
                                      size="large"
                                      disabled={
                                        isDisabledFeilds.length
                                          ? isDisabledFeilds[index]?.credit
                                          : false
                                      }
                                    />
                                  </Form.Item>
                                </Col>

                                <Col md={4}>
                                  <label className="formLabel">{t("home_page.homepage.Details")}</label>
                                  <Form.Item name={[field.name, "details"]}>
                                    <Input placeholder={t("home_page.homepage.Details")} size="large" />
                                  </Form.Item>
                                </Col>
                                <Col
                                  md={1}
                                  className="d-flex align-items-center"
                                >
                                  <MinusCircleOutlined
                                    onClick={() => remove(field.name)}
                                    style={{ fontSize: 22, color: "red" }}
                                  />
                                </Col>
                              </Row>
                            );
                          })}
                          <Row>
                            <Col md={9} />
                            <Col md={3}>
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  {t("home_page.homepage.Addfield")}
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form.List>
                    <hr />
                    <Row>
                      <Col sm="8"></Col>
                      <Col sm="2" className="text-end">
                        <div>
                          <strong>
                          {t("home_page.homepage.TotalCredits")} : {totalCredits.toFixed(2) || 0}
                          </strong>
                        </div>
                      </Col>
                      <Col sm="2">
                        <div>
                          <strong>
                          {t("home_page.homepage.TotalDebits")} : {totalDebits.toFixed(2) || 0}
                          </strong>
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    <Row className="mt-4">
                      <Col md="6"></Col>
                      <Col md="3">
                        <Button block size="large" onClick={() => navigate(-1)}>
                        {t("home_page.homepage.Cancel")} 
                        </Button>
                      </Col>
                      <Col md="3">
                        <Button
                          block
                          size="large"
                          type="primary"
                          htmlType="submit"
                          loading={isLoading}
                          disabled={totalCredits - totalDebits !== 0}
                        >
                          {t("home_page.homepage.Update")}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
}
export default EditJournal;
