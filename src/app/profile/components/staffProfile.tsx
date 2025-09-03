import { Button, Card, Form, Input, notification } from 'antd';
import React, {useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import PrefixSelector from '../../../components/prefixSelector';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../../config/api';
import { PUT } from '../../../utils/apiCalls';
import { update } from '../../../redux/slices/userSlice';

const StaffProfile = () => {
    const [isLoading,setIsLoading] = useState(false);
    const { user } = useSelector((state: any) => state.User);
    const dispatch = useDispatch();

    let staffData = user?.staff;

    const initialValues = {
        name: staffData?.name,
        adminid: user?.id,
        reference: staffData?.reference,
        code: staffData?.mobile
          ? staffData?.mobile.split(" ")[0]
          : user?.companyInfo?.countryInfo?.phoneCode,
        mobile: staffData?.mobile && staffData?.mobile.split(" ")[1],
        email: staffData?.email,
        telephone: staffData?.telephone,
        city: staffData?.city,
        address: staffData?.address,
        postcode: staffData?.postcode,
        notes: staffData?.notes,
        ledger_category: staffData?.ledger_category,
        image: staffData?.image,
        staffId: staffData?.staffId,
      };

    const submitHandler = async(values:any) => {
        try {
            setIsLoading(true)
            let url =   API.CONTACT_MASTER + `update/${staffData?.id}`
            let mobile = `${values.code} ${values.mobileNumber}`;
            const { data,status }: any = await PUT(url, {
              ...values,
              mobile: values.mobileNumber ? mobile : "",
            });
            if (status) {
                notification.success({
                  message: "Success",
                  description:"Profile details updated successfully"
                });
                let obj = {
                    id: user?.id,
                    userid: user?.userid,
                    fullName: data?.fullName,
                    dob: data?.dob,
                    address1: data?.address1,
                    address: user?.address,
                    address2: data?.address2,
                    city: data?.city,
                    countryid: data?.countryid,
                    bname: data?.bname,
                    email: user?.email,
                    phonenumber: user?.phonenumber,
                    status: user?.status,
                    usertype: user?.usertype,
                    image:user?.image,
                    country_code:user?.country_code,
                    mobileverified:user?.mobileverified,
                    companyid:user?.companyInfo?.id,
                    adminid:user?.id,
                    tokenid:user?.tokenid,
                    token:user?.token,

                    companyInfo:user?.companyInfo,
                    countryInfo:user?.companyInfo?.countryInfo,
                    bankInfo:user?.companyInfo?.bankInfo,
                    isStaff:user?.isStaff,
                    staff:{...data},
                  }
                  dispatch(update(obj));
              }else{
                notification.success({
                  message: "Failed",
                  description:`Failed to update profile details`
                });
              }
            setIsLoading(false);
            
        } catch (error) {
            console.log(error)
            notification.error({
                message: "Server Error",
               description: "Something went wrong in server!! Please try again later",
              });
        }
    }
  return (
    <>
    <Container>
          <br />
          <Card>
            <Form onFinish={submitHandler} layout="vertical" initialValues={initialValues}>
              <Row>
                <Col md={4}>
                  <label className="formLabel">Name</label>
                  <Form.Item
                    name="name"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Staff name is required" },
                    ]}
                  >
                    <Input
                      placeholder="Staff Name"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                  <label className="formLabel">Staff ID</label>
                  <Form.Item
                    name="staffId"
                    rules={[
                      { required: true, message: "Staff id is required" },
                    ]}
                    style={{ marginBottom: 10 }}
                  >
                    <Input
                      placeholder="Staff ID"
                      size="large"
                      className="input-field"
                      disabled
                    />
                  </Form.Item>
                  <label className="formLabel">Email Address</label>
                  <Form.Item
                    name="email"
                    style={{ marginBottom: 10 }}
                    rules={[
                      { required: true, message: "Email is required" },
                      {
                        pattern:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Email"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">Mobile Number</label>
                  <Form.Item name="mobile" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder="Mobile Number"
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
                  <label className="formLabel">Telephone Number</label>
                  <Form.Item name="telephone" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder="Telephone Number"
                      size="large"
                      className="input-field"
                      type="text"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                      }}
                    />
                  </Form.Item>
                  <label className="formLabel">Town/city</label>
                  <Form.Item name="city" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder="Town/city"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <label className="formLabel">Address</label>
                  <Form.Item name="address" style={{ marginBottom: 10 }}>
                    <Input.TextArea
                      placeholder="Address"
                      size="large"
                      className="input-field"
                      rows={4}
                    />
                  </Form.Item>
                  <label className="formLabel">Postal Code</label>
                  <Form.Item name="postcode" style={{ marginBottom: 10 }}>
                    <Input
                      placeholder="Postal Code"
                      size="large"
                      className="input-field"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <hr />
              <Row>
                <Col md={10} />
                <br />
                <Col md={2}>
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    block
                  >
                 Update
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
    </>
  )
}

export default StaffProfile