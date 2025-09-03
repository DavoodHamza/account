import React from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../../../config/api";
import { GET, PUT, POST } from "../../../../../../utils/apiCalls";
import { paymentMode } from "../component/paymentMode";
import PageHeader from "../../../../../../components/pageHeader";
import LoadingBox from "../../../../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import moment from "moment";
function OtherPayment(props: any) {
  const {t} = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const { id, update } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [detail, setDetail] = useState<any>();
  const [searchQurey, setSearchQurey] = useState("");
  const [initialData, setInitialData] = useState<any>();

  useEffect(() => {
    update && legderDetails();
  }, []);
  const legderDetails = async () => {
    let url = API.LEDGER_DEATAILS + update;
    try {
      const data: any = await GET(url, null);
      let edit = data?.data;
      setInitialData(edit);

      form.setFieldsValue({
        account_name: edit?.name,
        reciept_date: dayjs(edit?.sdate),
        reference: edit?.reference,
        amount_paid: Number(edit?.credit),
        payment_mode: edit?.paidmethod,
        Details: edit?.details,
      });
    } catch (err) {
      console.log(err);
    }
  };

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

  useEffect(() => {
    setTimeout(()=>{
      fetchAllEntries();
    },500)
  }, [searchQurey]);


  // const handleSelect = async (val: any) => {
  //   let url = API.GET_CONTACT_MASTER_LIST + user?.id + `/${val}`;
  //   try {
  //     const data: any = await GET(url, null);
  //     setDetail(data?.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url = update
        ? API.UPDATE_BANK_DETAILS + Number(update)
        : API.GET_PURCHASE_ID_BY_LIST;
      let cnamValue;
      try {
        cnamValue = JSON.parse(val.account_name);
      } catch (error) {
        cnamValue = val.account_name;
      }
      const columnsData = [
        {
          id: {},
          ledger: detail?.data && detail?.data,
          laccount: "",
          details: val.details,
          amount: val.amount_paid.toString(),
          vatamt: 0,
          total: val.amount_paid.toString(),
          vat: 0,
        },
      ];
      let formatedDate = dayjs(val?.reciept_date).format("YYYY-MM-DD");
      let reqObjPost = {
        sdate: formatedDate,
        reference: val.reference,
        paidmethod: val?.payment_mode,
        paidto: Number(id),
        [cnamValue.name]: cnamValue.id,
        userid: user?.id,
        amount: val.amount_paid.toString(),
        adminid: user?.id,
        columns: columnsData,
        supplier: { ...detail },
        userdate: formatedDate,
        booleantype: cnamValue.name === "cname" ? "8" : "97",
        details: val?.Details,
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      };
      const amt = Number(initialData?.debit) - Number(val?.amount_paid);
      const running = Number(initialData?.running_total) - Math.abs(amt);
      let reqObjPut = {
        [cnamValue.name ? cnamValue.name : null]: cnamValue?.id
          ? cnamValue?.id
          : null,
        reference: val.reference,
        credit: Number(val.amount_paid),
        sdate: formatedDate,
        total: val.amount_paid.toString(),
        booleantype: cnamValue?.id
          ? cnamValue.name === "sname"
            ? "8"
            : "97"
          : null,
        details: val?.Details,
        amount: Number(val.amount_paid),
        running_total: running,
        type:'Other Payment',
        createdBy:user?.isStaff ? user?.staff?.id : user?.id,
        companyid:user?.companyInfo?.id
      };
      const data: any = update
        ? await PUT(url, reqObjPut)
        : await POST(url, reqObjPost);

      if (data.status) {
        notification.success({message:"Success", description:`Other Payment ${update ? 'updated' : 'added'} successfully` });
        navigate(`/usr/cashBank/${id}/details/transaction`);
        setIsLoading(false);
      } else {
        notification.error({message:"Failed", description:`Failed to ${update ? 'update' : 'add'} other Payment` });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      notification.error({message:"Server Error", description:`Failed to ${update ? 'update' : 'add'} other Payment!! Please try again later` });
    }
  };
  return (
    <>
      {update && (
        <>
          <PageHeader
            title={t("home_page.homepage.Payment")}
            firstPathLink={"/usr/cashBank"}
            firstPathText={t("home_page.homepage.Bank")}
            secondPathLink={`/usr/cashBank/${id}/details`}
            secondPathText={t("home_page.homepage.BankDetails")}
            thirdPathLink={`/usr/cashBank/${id}/details/reciept/customer`}
            thirdPathText={t("home_page.homepage.Payment")}
          />
          <br />
        </>
      )}
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Col className="Table-Txt" md={12}>
            {t("home_page.homepage.Add/UpdateOtherPayment")}
            </Col>
            <Col md={12}>
            {t("home_page.homepage.Managepayments")}
            </Col>
            <br />
            <hr />
            <Form onFinish={onFinish} form={form}>
              <Row>
                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.Account Name")}</label>
                    <Form.Item
                      name={"account_name"}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        // onChange={handleSelect}
                        size="large"
                        placeholder={t("home_page.homepage.Choose_an_account")}
                        onSearch={(val) => setSearchQurey(val)}
                        filterOption={false}
                      >
                        {data
                          ?.filter(
                            (item: any) =>
                              item?.name
                                ?.toLowerCase()
                                .includes(searchQurey.toLowerCase()) ||
                              item?.laccount
                                ?.toLowerCase()
                                .includes(searchQurey.toLowerCase())
                          )
                          .map((item: any) => {
                            let obj = {
                              name: item?.laccount
                                ? "ledger"
                                : item?.name
                                ? "cname"
                                : null,
                              id: item.id,
                            };
                            let stringObj = JSON.stringify(obj);
                            return (
                              <Select.Option value={stringObj} key={item.id}>
                                {item.bus_name || item?.laccount}
                              </Select.Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.PaymentMethod")}</label>
                    <Form.Item
                      name={"payment_mode"}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select size="large" placeholder={t("home_page.homepage.Choosemethod")}>
                        {paymentMode?.map((item: any) => {
                          return (
                            <Select.Option key={item?.value}>
                              {item?.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.RecieptDate")}</label>
                    <Form.Item
                      name={"reciept_date"}
                      rules={[
                        {
                          required: true,
                          message: "Please choose date",
                        },
                      ]}
                    >
                      <DatePicker style={{ width: "100%" }} size="large" 
                      disabledDate={(currentDate) => {
                        const financialYearStart =
                          moment(financialYear).startOf("day");
                        return (
                          financialYearStart &&
                          currentDate &&
                          currentDate < financialYearStart
                        );
                      }}/>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.Reference")}</label>
                    <Form.Item name={"reference"}>
                      <Input size="large" placeholder={t("home_page.homepage.Reference")}/>
                    </Form.Item>
                  </div>
                </Col>

                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.Details")}</label>
                    <Form.Item name={"Details"}>
                      <Input size="large" placeholder={t("home_page.homepage.Details")} />
                    </Form.Item>
                  </div>
                </Col>

                <Col md={4}>
                  <div>
                    <label className="formLabel">{t("home_page.homepage.AmountPaid")}</label>
                    <Form.Item
                      name={"amount_paid"}
                      rules={[
                        { required: true, message: t("home_page.homepage.Pleaseentertheamount") },
                        {
                          validator: (_, value) => {
                            if (value > props?.balance) {
                              notification.error({message:`Insufficient balance ( Balance : ${props?.balance} )`});
                             return Promise.reject()
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        size="large"
                        placeholder={t("home_page.homepage.Enteramount")}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={8} />
                <Col md={4}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ height: 40 }}
                  >
                    {t("home_page.homepage.submit")}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      )}
    </>
  );
}

export default OtherPayment;
