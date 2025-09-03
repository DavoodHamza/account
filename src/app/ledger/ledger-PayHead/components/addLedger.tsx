import "../../styles.scss";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../../config/api";
import { GET, POST, PUT } from "../../../../utils/apiCalls";
import { payHeadType } from "../helpers/data";
import { useTranslation } from "react-i18next";
function AddLedger(props: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [ledger, setLedger] = useState([]);
  const [form] = Form.useForm();

  const fetchLedgerList = async () => {
    try {
      let ledger_url = API.GET_LEDGER_CATEGORY + "all";
      const data: any = await GET(ledger_url, null);
      setLedger(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLedgerList();
  }, []);

  let ledgerOptions: any = [];
  ledgerOptions =
    ledger.length &&
    ledger?.map((item: any) => ({
      label: item?.category,
      value: item.id,
    }));

  const onFinish = async (val: any) => {
    setIsLoading(true);
    let url = props?.edit?.id
      ? API.UPDATE_MY_LEDGER + props?.edit?.id
      : API.LEDGER_CREATE;
    let body = {
      laccount: val?.name,
      category: parseInt(val?.ledgercategory),
      categorygroup: parseInt(val?.category_grp),
      nominalcode: val?.nominal_code?.toString(),
      userid: parseInt(user?.id),
      adminid: parseInt(user?.id),
      acctype: "payroll",
      payheadType: val?.payheadType,
      type: 5, //payroll
      logintype: "user",
      calculationPeriod: val?.calculationPeriod,
      journals: 0,
      purchase: 0,
      sales: 0,
      companyid:user?.companyInfo?.id,
      createdBy:user?.isStaff ? user?.staff?.id : user?.id
    };
    try {
      const data: any = props?.edit?.id
        ? await PUT(url, body)
        : await POST(url, body);
      if (data?.status) {
        notification.success({ message: "Success", description: data.message });
        props.onClose();
        props.reload();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: `Failed to ${
            props?.edit?.id ? "edit" : "create"
          } pay head`,
        });
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Server Error",
        description: `Failed to ${
          props?.edit?.id ? "edit" : "create"
        } pay head!! Please try again later`,
      });
    }
  };

  function onValuesChange(_: any, val: any) {
    if (_?.ledgercategory) {
      let selectedLedger: any = ledger.find(
        (item: any) => item.id === _?.ledgercategory
      );
      form.setFieldsValue({ category_grp: selectedLedger.categorygroup });
    }
  }

  const periods = [
    { label: "Weekly", value: 1 },
    { label: "Monthly", value: 2 },
    { label: "Yearly", value: 3 },
  ];

  return (
    <>
      <Modal open={props?.onOpen} onCancel={props?.onClose} footer={false}>
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            name: props?.edit?.laccount,
            nominal_code: props?.edit?.nominalcode,
            payHeadType: props?.edit?.payheadType,
            calculationPeriod: props?.edit?.calculationPeriod,
            ledgercategory: props?.edit?.categoryDetails.id,
            category_grp: props?.edit?.groupDetails.id,
            payheadType:props?.edit?.payheadType
          }}
          onValuesChange={onValuesChange}
        >
          <div className="ledger-Txt1">
            {t("home_page.homepage.CreatePayHead")}
          </div>

          <Row>
            <Col md="12">
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.NamePayHead")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>

            <Col md={12}>
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.Nominal_Code")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name={"nominal_code"}
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.Type")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="payheadType"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select size="large">
                    {payHeadType?.map((option: any) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.Period")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="calculationPeriod"
                  rules={[
                    {
                      required: true,
                      message: t("home_page.homepage.period_ms"),
                    },
                  ]}
                >
                  <Select size="large">
                    {periods?.map((option: any) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col md={12}>
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.Ledger_Category")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Form.Item
                  name="ledgercategory"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                  ]}
                >
                  <Select size="large" allowClear>
                    {ledgerOptions?.length &&
                      ledgerOptions?.map((option: any) => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="">
                <label className="formLabel">
                  {t("home_page.homepage.Category_Group")}
                  {/* {t("home_page.homepage.CategoryGroup")} */}
                </label>
                <Form.Item name={"category_grp"}>
                  <Input size="large" disabled={true} />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={3}></Col>
            <Col md={4}>
              {" "}
              <Button size="large" block onClick={props?.onClose}>
                {t("home_page.homepage.Cancel")}
              </Button>
            </Col>
            <Col md={1}></Col>
            <Col md={4}>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                block
                loading={isLoading}
              >
                {t("home_page.homepage.Create")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddLedger;
