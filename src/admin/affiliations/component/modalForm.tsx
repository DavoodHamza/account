import { Button, Form, Input, Modal, Select, Upload, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import API from "../../../config/api";
import { BASE_PUT, GETWITHBASE, REGISTERPOST } from "../../../utils/apiCalls";
import "../styles.scss";
import { useDispatch } from "react-redux";
import { salesPersonLogin } from "../../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import PrefixSelector from "../../../components/prefixSelector";
import { IoIosCamera } from "react-icons/io";
import Avatar from "../../../assets/images/user.webp";
import LogoPicker from "../../../app/proposal/components/LogoPicker";
import countries from "../../../utils/CountriesWithStates.json";

const AffiliationFormModal = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggle, toggleModal] = useState(false);
  const [img, setImg] = useState(null);
  const { v4: uuidv4 } = require("uuid");
  const fetchAffiliation = async () => {
    try {
      setIsLoading(true);
      let url = API.AFFILIATION + props?.id;
      const { data, status }: any = await GETWITHBASE(url, null);
      if (status) {
        setImg(data?.image);
        form.setFieldsValue({
          name: data?.name,
          email: data?.email,
          countryid: data?.countryid,
          code: data?.phone ? data?.phone.split(" ")[0] : "",
          mobile: data?.phone ? data?.phone.split(" ")[1] : "",
          affiliationCode: data?.affiliationCode,
          rewardPercentage: data?.rewardPercentage * 100,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Something went Wrong",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Error",
        description: "Internal Error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    props?.type === "edit" && fetchAffiliation();
  }, []);

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let mobile = `${val.code} ${val.mobile}`;
      const url =
        props?.type === "create"
          ? API.BASE_URL + API.ADD_AFFILIATION
          : API.BASE_URL + API.EDIT_AFFILIATION + props?.id;
      let obj: any = {
        name: val?.name,
        email: val?.email,
        countryid: val?.countryid,
        affiliationCode: val?.affiliationCode,
        affiliationLink: val?.affiliationCode,
        phone: val?.mobile ? mobile : "",
        rewardPercentage:
          props?.mode === "admin" ? Number(val?.rewardPercentage) / 100 : 0.1,
        image: img,
      };

      const response: any =
        props?.type === "create"
          ? await REGISTERPOST(url, obj)
          : await BASE_PUT(url, obj);

      if (response.status) {
        if (props?.mode === "salesPerson") {
          dispatch(salesPersonLogin(response.data));
          navigate(`/affiliate-details`);
          notification.success({
            message: "Success",
            description:
              props?.type === "create"
                ? "You are a affiliator now!"
                : "Details updated Successfully",
          });
          props?.setIsOpen(false);
        } else {
          notification.success({
            message: "Success",
            description:
              props?.type === "create"
                ? "Affiliation Created successfully"
                : "Affiliation updated successfully",
          });
          props?.reload();
          props?.setIsOpen(false);
        }
      } else {
        notification.error({
          message: "Failed",
          description:
            props?.type === "create"
              ? "Failed To Create Affiliation"
              : "Failed To Update Affiliation",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          props?.type === "create"
            ? "Failed To Create Affiliation"
            : "Failed To Update Affiliation",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onValuesChange = (val: any, obj: any) => {
    if (!obj.affiliationCode) {
      let code =
        "TGC" + uuidv4().replace(/-/g, "").toUpperCase().substring(0, 12);
      form.setFieldsValue({
        affiliationCode: code,
        code: "+91",
        rewardPercentage: 10,
      });
    }
  };
  return (
    <>
      <Modal
        open={props?.openModal}
        closable={true}
        centered
        width={700}
        footer={false}
        maskClosable={false}
        onCancel={() => props?.setIsOpen(false)}
      >
        <h4 className="affiliation_title">
          {props?.type === "create" ? "BE AN AFFILIATE" : "UPDATE DETAILS"}
        </h4>
        <br />
        <Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
          <Row>
            <Col md={4} xs={12}>
              <div className="profile-picture-container">
                <div className="profile-picture">
                  <img
                    src={!img ? Avatar : img}
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
              </div>
            </Col>

            <Col md={4} xs={12}>
              <div>
                <label className="formLabel">Name</label>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </div>

              <div>
                <label className="formLabel">Email</label>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input size="large" type="email" />
                </Form.Item>
              </div>
              {props?.type === "create" && (
                <div>
                  <label className="formLabel">Country</label>
                  <Form.Item
                    name="countryid"
                    rules={[
                      { required: true, message: "Please select a country" },
                    ]}
                  >
                    <Select
                      placeholder={"Select Country"}
                      showSearch={true}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      size="large"
                    >
                      {countries?.map((country: any) => (
                        <Select.Option key={country.id} value={country.id}>
                          {country?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </Col>

            <Col md={4} xs={12}>
              <div>
                <label className="formLabel">Phone</label>
                <Form.Item name="mobile">
                  <Input
                    size="large"
                    className="input-field"
                    addonBefore={<PrefixSelector />}
                    type="text"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                  />
                </Form.Item>
              </div>

              <div>
                <label className="formLabel">Affiliate Code</label>
                <Form.Item name="affiliationCode" rules={[{ required: true }]}>
                  <Input size="large" readOnly />
                </Form.Item>
              </div>
              {props?.mode === "admin" && (
                <div>
                  <label className="formLabel">Reward Percentage</label>
                  <Form.Item name="rewardPercentage" style={{ width: "100px" }}>
                    <Input
                      size="large"
                      width={"30px"}
                      suffix={"%"}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                    />
                  </Form.Item>
                </div>
              )}
            </Col>

            <Col xs={12} md={{ offset: 8, span: 4 }}>
              <div className="d-flex gap-3">
                <Button
                  block
                  size="large"
                  onClick={() => props?.setIsOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={isLoading}
                  block
                >
                  {props?.type === "create" ? "Submit" : "Update"}
                </Button>
              </div>
            </Col>
            <LogoPicker
              open={toggle}
              modalClose={() => toggleModal(false)}
              form={form}
              setImg={setImg}
              mode="affiliation"
            />
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AffiliationFormModal;
