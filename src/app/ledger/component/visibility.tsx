import { Button, Checkbox, Form, Modal, message } from "antd";
import API from "../../../config/api";
import { POST } from "../../../utils/apiCalls";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FiTag } from "react-icons/fi";
import { FiShoppingCart,FiBook } from "react-icons/fi";
import { useTranslation } from "react-i18next";
function LedgerVisibility(props: any) {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  let data = props.data?.row?.data;
  const onFinish = async (val: any) => {
    setIsLoading(true);

    let body = {
      id: data.id,
      journals: val?.journals ? "journals" : false,
      purchase: val?.purchase ? "purchase" : false,
      sales: val?.sales ? "sales" : false,
    };

    let url = API.CHANGE_LEDGER_VISIBILITY;
    try {
      const data: any = await POST(url, body);
      if (data?.status) {
        message.success(data?.message);
        setIsLoading(false);
        props.onClose();
        props.onSuccess();
      } else {
        message.error(data?.message);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        title={t("home_page.homepage.UpdateVisibility")}
        open={props.open}
        onCancel={props.onClose}
        footer={false}
        width={400}
        centered
      >
        <br/>
          <Form
            initialValues={{
              journals: data?.journals ? true : false,
              purchase: data?.Purchase ? true : false,
              sales: data?.Sales ? true : false,
            }}
            onFinish={onFinish}
          >
            <div className="formBox">
              <div>
              <Form.Item  noStyle name="journals" valuePropName="checked">
                <Checkbox value={"journals"}>{t("home_page.homepage.Journals")}</Checkbox>
              </Form.Item>
              </div>
              <div style={{flex:1}}/>
              <div>
                <FiTag size={20}/>
              </div>
            </div>

            <div className="formBox">
              <div>
            <Form.Item noStyle name="purchase" valuePropName="checked">
              <Checkbox value={"purchase"}>{t("home_page.homepage.Purchase")}</Checkbox>
            </Form.Item>
            </div>
            <div style={{flex:1}}/>
              <div>
                <FiShoppingCart size={20}/>
              </div>
            </div>
            <div className="formBox">
              <div>
            <Form.Item noStyle name="sales" valuePropName="checked">
              <Checkbox value={"sales"}>{t("home_page.homepage.Sales")}</Checkbox>
            </Form.Item>
            </div>
            <div style={{flex:1}}/>
              <div>
                <FiBook size={20}/>
              </div>
            </div>
            <br/>
            <Row>
              <Col sm="6">
                <Button block onClick={() => props.onClose()} size="large">
                {t("home_page.homepage.Cancel")}
                </Button>
              </Col>
              <Col sm="6">
                <Button
                size="large"
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  {t("home_page.homepage.Update")}
                </Button>
              </Col>
            </Row>
          </Form>
      </Modal>
    </>
  );
}

export default LedgerVisibility;
