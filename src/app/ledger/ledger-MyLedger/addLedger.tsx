import "../styles.scss";
import { Button, Form, Input, Modal, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { Col,Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
function AddLedger(props: any) {
  const {t} = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const [dataa, setDataa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerSerch, setCustomerSerch] = useState("");
  const [form] = Form.useForm();
  const adminid = user?.id;
  const [category, setcategory] = useState<any>();
  let value = props.data?.val?.row?.data;

  useEffect(() => {
    handleSelect([props?.edit?.categoryDetails?.id]);
  }, []);

  useEffect(() => {
    getCategoryListAll();
  }, [customerSerch]);


  const getCategoryListAll = async () => {
    try {
      let url = `ledgercategory/searchList/${adminid}?name=${customerSerch}`;
      const data: any = await GET(url, null);
      setDataa(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSelect = async (val: any) => {
    try {
      let url =
        API.GET_LEDGER_CATEGORY + val || props?.edit?.categoryDetails?.id;
      const data: any = await GET(url, null);
      setcategory(data);
      form.setFieldsValue({
        category_grp: data?.categorygroup,
        category: data?.category,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onFinish = async (val: any) => {
    setIsLoading(true);
    let url = props?.edit?.id
      ? API.UPDATE_MY_LEDGER + props?.edit?.id
      : API.LEDGER_CREATE;
    let body = {
      laccount: val?.ledger_accnt,
      category: parseInt(category?.id),
      categorygroup: parseInt(category?.categorygroup),
      // nominalcode: val?.nominal_code?.toString(),
      nominalcode: val?.nominal_code ? val.nominal_code:"",
      userid: parseInt(user?.id),
      adminid: parseInt(user?.id),
      type: 0,
      logintype: "user",
      journals: 0,
      purchase: 0,
      sales: 0,
      createdBy:user?.isStaff ? user?.staff?.id : user?.id,
      companyid:user?.companyInfo?.id
    };
    try {
      const data: any = props?.edit?.id
        ? await PUT(url, body)
        : await POST(url, body);
      if (data?.status) {
        notification.success({message:"Success",description:data.message});
        props.onClose();
        props.onSuccess();
        setIsLoading(false);
      } else {
        notification.error({message:"Failed",description:data.message});
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({message:"Server Error",description: `Failed to ${props?.edit?.id ? "update" : "create"} ledger!! Please try again later` });
    }
  };

  return (
    <>
      <Modal
        open={props?.onOpen}
        onCancel={props?.onClose}
        footer={false}
        width={500}
        title={t("home_page.homepage.CreateLedger")}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            ledger_accnt: props?.edit?.laccount,
            nominal_code: props?.edit?.nominalcode,
            category: value?.categoryDetails?.category,
            category_grp: value?.categoryDetails?.categorygroup,
          }}
        >
          <Row>
            <Col md={12}>
              <div className="">
                <label className="formLabel">{t("home_page.homepage.Ledger_Account")}</label>
                <Form.Item name={"ledger_accnt"}>
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
            <Col md={12}>
              <div className="">
                <label className="formLabel">{t("home_page.homepage.Nominal_Code")}</label>
                <Form.Item name={"nominal_code"}>
                  <Input size="large" />
                </Form.Item>
              </div>
            </Col>
          <Col md={12}>
            <div className="">
              <label className="formLabel">{t("home_page.homepage.Category")}</label>
              <Form.Item name={"category"}>
                <Select size="large" 
                showSearch
                allowClear
                onSearch={(val) => setCustomerSerch(val)}
                onChange={handleSelect}
                filterOption={false}
                >
                  {dataa?.map((item: any, index: any) => {
                    return (
                      <Select.Option value={item?.id}>
                        {item?.category}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col md={12}>
            <div className="">
              <label className="formLabel">{t("home_page.homepage.Category_Group")}</label>
              <Form.Item name={"category_grp"}>
                <Input size="large" disabled={true} />
              </Form.Item>
            </div>
          </Col>
          <Col sm={6}>
          <Button block onClick={() => props.onClose()} size="large">
          {t("home_page.homepage.Cancel")}
                </Button>
            </Col>
          <Col sm={6}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={isLoading}
              block
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
