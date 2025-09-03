import { Button, Form, Input, Modal, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import "../styles.scss";
import { useTranslation } from "react-i18next";
function AddDefualtCategory(props: any) {
  const {t} = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const [data, setData] = useState([]);
  const [categoryGrp, setDataCategoryGrp] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getCategorygroupList();
  }, []);

  const getCategorygroupList = async () => {
    try {
      let url = API.GET_CATEGORY_GROUP_LIST
      const data: any = await GET(url, null);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (val: any) => {
    setDataCategoryGrp(val);
  };
  const onFinish = async (val: any) => {
    setIsLoading(true);
    let body = {
      category: val?.category,
      categorygroup: val?.category_grp,
      categorygroupid: categoryGrp,
      userid: parseInt(user?.id),
      adminid: parseInt(user?.id),
      type: 0,
      logintype: "user",
      createdBy:user?.isStaff ? user?.staff?.id : user?.id,
      companyid:user?.companyInfo?.id
    };
    let url = props?.onEdit?.id
      ? API.UPDATE_LEDGER_CATEGORY + props?.onEdit?.id
      : API.CREATE_LEDGER_CATEGORY;

    try {
      const data: any = props?.onEdit?.id
        ? await PUT(url, body)
        : await POST(url, body);
      if (data.status) {
        notification.success({message:"Success",description:data.message});
        props?.refresh();
        props?.onClose(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.success({message:"Failed",description:data.message});
      }
    } catch (err) {
      console.log(err);
      notification.success({message:"Server Error",description: props?.onEdit?.id ? "Failed to update ledger!! Please try again later" : "Failed to create ledger!! Please try again later"});
    }
  };
  return (
    <>
      <Modal
        title={t("home_page.homepage.CreateLedgerCategory")}
        open={props?.onOpen}
        onCancel={props?.onClose}
        footer={false}
        width={500}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{
            category: props?.onEdit?.category,
            category_grp: props?.onEdit?.categorygroup,
          }}
        >
          <label className="formLabel">{t("home_page.homepage.Category")}</label>
          <Form.Item name={"category"}>
            <Input size="large" />
          </Form.Item>
          <div className="">
            <label className="formLabel">{t("home_page.homepage.Category_Group")}</label>
            <Form.Item name={"category_grp"}>
              <Select size="large" onChange={handleSelect}>
                {data?.map((item: any, index: any) => {
                  return (
                    <Select.Option key={index} value={item?.id}>
                      {item?.categorygroup}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          <Row>
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
                {props?.onEdit?.id ? t("home_page.homepage.Update") : t("home_page.homepage.Create")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default AddDefualtCategory;
