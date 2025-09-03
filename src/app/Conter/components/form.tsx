import { Button, DatePicker, Form, Input, Select, Space, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin4Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";

function CounterForm({ onCancel, onSubmit, counter, counterId }: any) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const financialYear = user?.companyInfo?.financial_year_start;
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<any>([]);

  const onFinish = async (val: any) => {
    setIsBtnLoading(true);
    let obj = {
      ...val,
      counterid: counterId,
    };
    await onSubmit(obj);
    setIsBtnLoading(false);
  };

  useEffect(() => {
    fetchLocations()
    if (counter) {
      let shiftList = counter.shiftlist.map((data: any) => {
        return {
          time: [dayjs(data.fromtime, "hh:mm"), dayjs(data.totime, "hh:mm")],
          name: data.name,
        };
      });
      form.setFieldsValue({
        name: counter.name,
        sdate: dayjs(counter.sdate, "YYYY/MM/DD"),
        location:counter?.location,
        shift: shiftList,
      });
    }
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.LOCATION_GET_BY_USER + user?.id + '/' + user?.companyInfo?.id;
      const {data}: any = await GET(unit_url, null);
      setLocationData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <Form onFinish={onFinish} form={form}>
        <Row>
          <Col className="Table-Txt" md={12}>
            {t("home_page.homepage.AddUpdate_Counter_List")}
          </Col>
          <br />
          <br />
          <hr />
          <Col md={4}>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.Name")}
              </label>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: `${t("home_page.homepage.Name_ms")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("home_page.homepage.Name")}
                  size="large"
                />
              </Form.Item>
            </div>
          </Col>
          <Col sm={4}>
                <div className="formLabel">
                 Location
                </div>
                <Form.Item
                  name={"location"}
                  rules={[
                    {
                      required: true,
                      message: "choose location",
                    },
                  ]}
                >
                  <Select size="large">
                    {  locationData?.length &&
                      locationData?.map((item: any) => {
                        return (
                          <Select.Option key={item.id} value={item.id}>
                            {item.location}
                          </Select.Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
          <Col md={4}>
            <div className="formItem">
              <label className="formLabel">
                {t("home_page.homepage.DATE")}
              </label>
              <Form.Item
                name="sdate"
                rules={[
                  {
                    required: true,
                    message: `${t("home_page.homepage.DATE_ms")}`,
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("home_page.homepage.DATE_msg")}
                  size="large"
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
          </Col>
          <Col md={12}>
            <div className="formItem">
              <Form.List name="shift">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", margin: 0 }}
                        align="baseline"
                      >
                        <div className="formItem">
                          <label className="formLabel">
                            {t("home_page.homepage.SHIFT_NAME")}
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: `${t("home_page.homepage.SIFT_MIS")}`,
                              },
                            ]}
                          >
                            <Input
                              placeholder={t("home_page.homepage.SHIFT_NAME")}
                              size="large"
                            />
                          </Form.Item>
                        </div>
                        <div className="formItem">
                          <label className="formLabel">
                            {t("home_page.homepage.TIME")}
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, "time"]}
                            rules={[
                              {
                                required: true,
                                message: `${t("home_page.homepage.time_ms")}`,
                              },
                            ]}
                            initialValue={[
                              dayjs("09:00", "HH:mm"),
                              dayjs("14:00", "HH:mm"),
                            ]}
                          >
                            <TimePicker.RangePicker
                              format="hh:mm A"
                              size="large"
                            />
                          </Form.Item>
                        </div>
                        <RiDeleteBin4Line
                          color="red"
                          size={18}
                          onClick={() => remove(name)}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<FiPlus size={24} />}
                      >
                        {t("home_page.homepage.ADD_SHIFT")}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </Col>
          <Col md={4}></Col>
          <Col md={4}>
            <Button block size="large" onClick={() => onCancel()}>
              {t("home_page.homepage.CANCEL")}
            </Button>
          </Col>
          <Col md={4}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isBtnLoading}
            >
              {t("home_page.homepage.SUBMIT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CounterForm;
