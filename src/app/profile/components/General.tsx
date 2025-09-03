import { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Card,
  Input,
  Select,
  notification,
} from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import API from "../../../config/api";
import { PUT } from "../../../utils/apiCalls";
import ImagePicker from "../../../components/imagePicker";
import Avatar from "../../../assets/images/user.webp";
import { IoIosCamera } from "react-icons/io";
import { update } from "../../../redux/slices/userSlice";
import moment from "moment";
import { useTranslation } from "react-i18next";
import StaffProfile from "./staffProfile";
import countries from "../../../utils/CountriesWithStates.json";

function General() {
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, toggleModal] = useState(false);

  const initialValues = {
    firstname: user?.fullName,
    dob: user?.dob ? dayjs(user?.dob) : null,
    address: user?.address,
    city: user?.city,
    countryid: user?.countryid,
  };

  const onFinish = async (data: any) => {
    try {
      setIsLoading(true);
      let obj = {
        firstname: data?.fullName,
        dob: data?.dob,
        address: data?.address,
        city: data?.city,
        countryid: data?.countryid,
      };
      let url = API.UPDATE_PROFILE_INFO;
      const response: any = await PUT(url, obj);
      setIsLoading(false);
      if (response.status) {
        notification.success({
          message: `${t("home_page.homepage.success")}`,
          description: `${t("home_page.homepage.Profile_Updated_Succesfully")}`,
        });
        let obj = {
          ...response?.data,
          token: user.token,
          isStaff: user?.isStaff,
          staff: user?.staff,
          companyInfo: user?.companyInfo,
        };
        dispatch(update(obj));
      } else {
        notification.error({
          message: `${t("home_page.homepage.failed")}`,
          description: `${t("home_page.homepage.profile_update_failed")}`,
        });
      }
    } catch (err) {
      notification.error({
        message: `${t("home_page.homepage.server_error")}`,
        description: `${t("home_page.homepage.profile_update_failed")}`,
      });
      setIsLoading(false);
    }
  };

  function disabledDate(current: any) {
    return current && current > moment().endOf("day");
  }

  return (
    <Container>
      {user.isStaff ? (
        <>
          <StaffProfile />
        </>
      ) : (
        <>
          <Row>
            <Col md="2">
              <div className="profile-picture-container">
                <div className="profile-picture">
                  <img
                    src={
                      user?.image == null || user?.image == ""
                        ? Avatar
                        : user?.image
                    }
                    className="profile-img"
                    onClick={() => toggleModal(true)}
                    alt=""
                  />
                  <IoIosCamera
                    className="profile-edit"
                    color="#fff"
                    size={25}
                    onClick={() => toggleModal(true)}
                  />
                </div>
                <br />
                {user?.fullName && (
                  <div className="profile-text-box">
                    <div className="profile-txt1">{user?.fullName}</div>
                  </div>
                )}
              </div>
            </Col>

            <Col md="10">
              <Card>
                <div className="profile-txt2">User Details</div>
                <hr />
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={initialValues}
                >
                  <Row>
                    <Col md="6">
                      <label className="formLabel">
                        {t("home_page.homepage.name")}
                      </label>
                      <Form.Item
                        name="firstname"
                        style={{ marginBottom: 10 }}
                        rules={[
                          { required: true, message: "Name is required" },
                        ]}
                      >
                        <Input
                          placeholder={t("home_page.homepage.name")}
                          size="large"
                        />
                      </Form.Item>

                      <label className="formLabel">
                        {t("home_page.homepage.City")}
                      </label>
                      <Form.Item name="city" style={{ marginBottom: 10 }}>
                        <Input placeholder="City" size="large" />
                      </Form.Item>

                      <label className="formLabel">
                        {t("home_page.homepage.Country")}
                      </label>
                      <Form.Item
                        name="countryid"
                        style={{ marginBottom: 10 }}
                        rules={[
                          { required: true, message: "Country is required" },
                        ]}
                      >
                        <Select
                          placeholder={t("home_page.homepage.Select_Country")}
                          showSearch={true}
                          filterOption={(input: any, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          size="large"
                        >
                          {countries &&
                            countries?.map((country: any) => (
                              <Select.Option
                                key={country.id}
                                value={country.id}
                              >
                                {country?.name}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md="6">
                      <label className="formLabel">
                        {t("home_page.homepage.Date_of_birth")}
                      </label>
                      <Form.Item name="dob" style={{ marginBottom: 10 }}>
                        <DatePicker
                          disabledDate={disabledDate}
                          placeholder={t("home_page.homepage.DOB")}
                          size="large"
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                          inputReadOnly={true}
                        />
                      </Form.Item>

                      <label className="formLabel">
                        {t("home_page.homepage.Address_Line_2")}
                      </label>
                      <Form.Item
                        name="address"
                        style={{ marginBottom: 10 }}
                        // rules={[{ required: true ,message:'Address line is required'}]}
                      >
                        <Input.TextArea
                          rows={4}
                          placeholder={t("home_page.homepage.Address_Line_2")}
                          size="large"
                        />
                      </Form.Item>

                      <Row>
                        <Col md={6} />
                        <Col md={6}>
                          <br />
                          <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            disabled={isLoading}
                            block
                          >
                            {t("home_page.homepage.Update")}
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
                <ImagePicker
                  open={toggle}
                  modalClose={() => toggleModal(false)}
                  data={user}
                  // refreshData={props.onChange}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default General;
