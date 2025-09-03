import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import API from "../../../../config/api";
import { GET, POST } from "../../../../utils/apiCalls";
const ContraVoucher = ({
  modalVisible,
  handleOk,
  handleCancel,
  id,
  type,
  ledger,
}: any) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [bankList, setBankList] = useState([]);
  const [form] = Form.useForm();

  const loadBank = async () => {
    if (type === "create") {
      form.setFieldsValue({
        sdate: dayjs(new Date()),
      });
    }
    let URL = API.GET_BANK_LIST + user?.id + "/" + user?.companyInfo?.id;
    const { data }: any = await GET(URL, null);
    if (data) {
      setBankList(data.bankList);
    }
  };

  const LoadLedgerDeatails = async () => {
    let URL = API.LEDGER_DEATAILS + id;
    const data: any = await GET(URL, null);
    form.setFieldsValue({
      paidfrom: data?.data?.baseid
        ? Number(data?.data?.paidfrom)
        : Number(ledger),
      paidto: data?.data?.baseid
        ? Number(ledger)
        : Number(data?.data?.paidfrom),
      sdate: dayjs(data.data.sdate),
      reference: data.data.reference,
      amount: Math.abs(data.data.total),
      paidmethod: data.data.paidmethod,
    });
  };

  useEffect(() => {
    loadBank();
    if (type !== "create") {
      LoadLedgerDeatails();
    }
  }, []);

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let reqObjPost = {
        paidfrom: Number(val.paidfrom),
        paidto: Number(val.paidto),
        amount: val.amount.toString(),
        reference: val.reference,
        sdate: val.sdate,
        description: val.description,
        paidmethod: val.paidmethod,
        userid: user.id,
        adminid: user?.id,
        type: "1",
        ledger: Number(id),
        id: Number(id),
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        companyid: user?.companyInfo?.id,
      };
      let URL =
        type == "create"
          ? API.BANK_TRANSFER
          : `ledger_details/updateContraVoucher/${id}`;
      const response: any = await POST(URL, reqObjPost);
      if (response.status) {
        notification.success({
          message: "Success",
          description: `Contra voucher ${
            type === "create" ? "created" : "updated"
          } successfully`,
        });
        setIsLoading(false);
        handleOk();
      } else {
        notification.error({
          message: "Failed",
          description: `Failed to ${
            type === "create" ? "create" : "update"
          } contra voucher`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          type === "create" ? "create" : "update"
        } contra voucher!! Please try again later`,
      });
    }
  };
  return (
    <Modal
      title="Contra Voucher"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      width={1000}
    >
      <Form onFinish={onFinish} form={form}>
        <Row>
          <Col md={6}>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.PAIDFROM")}
              </label>
              <Form.Item
                name="paidfrom"
                rules={[
                  {
                    required: true,
                    message: t("home_page.homepage.Pleaseaccount"),
                  },
                ]}
              >
                <Select size="large">
                  {bankList.length &&
                    bankList.map((item: any) => (
                      <Select.Option key={item.list.id} value={item.list.id}>
                        {`${item.list.nominalcode}-${item.list.laccount}`}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.PAIDMETHOD")}
              </label>
              <Form.Item
                name="paidmethod"
                rules={[
                  {
                    required: true,
                    message: t("home_page.homepage.Please_SelectPaidMethod"),
                  },
                ]}
              >
                <Select size="large">
                  <Select.Option key={"cash"}>
                    {t("home_page.homepage.Cash")}
                  </Select.Option>
                  <Select.Option key={"cheque"}>
                    {t("home_page.homepage.Cheque")}
                  </Select.Option>
                  <Select.Option key={"electronic"}>
                    {t("home_page.homepage.Electronic")}
                  </Select.Option>
                  <Select.Option key={"card"}>
                    {t("home_page.homepage.Credit/DebitCard")}
                  </Select.Option>
                  <Select.Option key={"loan"}>
                    {t("home_page.homepage.PayPal")}
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.AmountTransferred")} *
              </label>
              <Form.Item
                name="amount"
                rules={[
                  {
                    required: true,
                    message: t("home_page.homepage.EnterAmount"),
                  },
                ]}
              >
                <InputNumber
                  type="number"
                  size="large"
                  controls={false}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            {/* <div className="formItem">
              <label className="formLabel">DESCRIPTION</label>
              <Form.Item name="description">
                <Input
                  type="text"
                  size="large"
                />
              </Form.Item>
            </div> */}
          </Col>
          <Col md={6}>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.PAIDTO")} *
              </label>
              <Form.Item
                name="paidto"
                rules={[
                  {
                    required: true,
                    message: t("home_page.homepage.EnterAmount"),
                  },
                ]}
              >
                <Select size="large">
                  {bankList.length &&
                    bankList.map((item: any) => (
                      <Select.Option key={item.list.id} value={item.list.id}>
                        {`${item.list.nominalcode}-${item.list.laccount}`}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.PAYMENTDATE")}
              </label>
              <Form.Item name="sdate">
                <DatePicker
                  size="large"
                  style={{ width: "100%" }}
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
            </div>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.REFERENCE")}
              </label>
              <Form.Item name="reference">
                <Input type="text" size="large" />
              </Form.Item>
            </div>
          </Col>
          <Col md={6}></Col>
          <Col md={3}>
            <br />
            <Button
              loading={isLoading}
              size="large"
              type="primary"
              htmlType="submit"
              block
            >
              {type === "create" ? "Create" : "Update"}
            </Button>
          </Col>
          <Col md={3}>
            <br />
            <Button onClick={handleCancel} size="large" block>
              {t("home_page.homepage.Cancel")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ContraVoucher;
