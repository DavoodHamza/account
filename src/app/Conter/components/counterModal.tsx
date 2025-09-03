import { Button, DatePicker, Form, Select, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { POST } from "../../../utils/apiCalls";

function CounterModal({
  counterList,
  counterSearch,
  onClose,
  customerSerch,
  customerList,
  counterId,
  relode,
}: any) {
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const [btLoding, setBtLoding] = useState(false);
  const [shiftList, setShiftList] = useState([]);

  useEffect(() => {
    if (counterList.length) {
      const shift = counterList.find((find: any) => find.id == counterId);
      setShiftList(shift.shiftlist);
    }
  });

  const onFinish = async (val: any) => {
    try {
      setBtLoding(true);
      let openObj = {
        ...val,
        adminid: user?.id,
        balance: 0,
        companyid: user?.companyInfo?.id,
      };

      let url = `counter_details/add/openshift`;
      let obj = openObj;
      const response: any = await POST(url, obj);
      if (response.status) {
        setBtLoding(false);
        notification.success({
          message: "success",
          description: response.message,
        });
        onClose();
        relode();
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to create counter",
        });
        setBtLoding(false);
      }
    } catch (error) {
      setBtLoding(false);
      console.log(error, "错误信)");
    }
  };



  return (
    <div>
      <Form onFinish={onFinish} form={form}>
        <Row>
          <Col className="Table-Txt" md={12}>
            {t("home_page.homepage.Fill_the_Open_Details")}
          </Col>
          <br />
          <br />
          <hr />
          <Col md={6}>
            <label className="formLabel">{t("home_page.homepage.STAFF")}</label>
            <Form.Item
              name="staffid"
              rules={[
                {
                  required: true,
                  message: `${t("home_page.homepage.staff_ms")}`,
                },
              ]}
            >
              <Select
                allowClear
                onSearch={(val) => customerSerch(val)}
                showSearch
                filterOption={false}
                placeholder={t("home_page.homepage.STAFF")}
                size="large"
              >
                {customerList?.map((item: any) => (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6}>
            <label className="formLabel">
              {t("home_page.homepage.COUNTER")}
            </label>
            <Form.Item
              name="counter_id"
              rules={[
                {
                  required: true,
                  message: `${t("home_page.homepage.COUNTER_ms")}`,
                },
              ]}
              initialValue={counterId}
            >
              <Select
                allowClear
                onSearch={(val) => counterSearch(val)}
                showSearch
                filterOption={false}
                placeholder={t("home_page.homepage.COUNTER")}
                size="large"
                disabled
              >
                {counterList?.map((item: any) => (
                  <Select.Option key={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6}>
            <label className="formLabel">{t("home_page.homepage.SHIFT")}</label>
            <Form.Item
              name="shift_type"
              rules={[
                {
                  required: true,
                  message: `${t("home_page.homepage.shift_ms")}`,
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                filterOption={false}
                placeholder={t("home_page.homepage.SHIFT")}
                size="large"
              >
                {shiftList?.map((item: any) => (
                  <Select.Option key={item.name}>{item.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={6}>
            <label className="formLabel">{t("home_page.homepage.DATE")}</label>
            <Form.Item
              name="sdate"
              rules={[
                {
                  required: true,
                  message: `${t("home_page.homepage.DATE_ms")}`,
                },
              ]}
              initialValue={dayjs(new Date())}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                placeholder={t("home_page.homepage.DATE")}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col md={4}></Col>
          <Col md={4}>
            <Button block size="large" onClick={onClose}>
              {t("home_page.homepage.CANCEL")}
            </Button>
          </Col>
          <Col md={4}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={btLoding}
            >
              {t("home_page.homepage.SUBMIT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CounterModal;
