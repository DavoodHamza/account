import { useState } from "react";
import { Modal, Button, Form, Input, notification } from "antd";
import API from "../../../config/api";
import { PUT } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

const UpdateStock = ({ modalVisible, handleOk, handleCancel, stock,loadProductById }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockValue, setStockValue] = useState(0);
  const { user } = useSelector((state: any) => state.User);

  const [form] = Form.useForm();

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);

      let reqObj = {
        quantity: Number(val.stock),
        stockquantity: Number(stock.stockquantity) + Number(val.stock),
        userid: user?.id,
        id: stock.id,
        stock:Number(stock.stock) + Number(val.stock)
      };
  
      let URL = API.PRODUCT_STOCK_UPDATE + stock.id;
      const response: any = await PUT(URL, reqObj);
      if (response.status) {
        notification.success({message:"Success",description:"Stock updated successfully"});
        setIsLoading(false);
        handleCancel();
        loadProductById()
        form.setFieldsValue({
          stock:0,
        })
        setStockValue(0)

      } else {
        notification.success({message:"Failed",description:"Failed to update stock"});
        setIsLoading(false);
      }
  } catch (error) {
    console.log(error)
    notification.success({message:"Server Error",description:"Failed to update stock!! Please try again later"});
    setIsLoading(false);
  }  
    
  };

  return (
    <Modal
      title="UPDATE STOCK"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
      width={500}
      centered
    >
      <Form onFinish={onFinish} initialValues={{ stock: 0 }} form={form}>
        <Row>
          <Col sm={6}>
            <div className="formLabel">Current Stock</div>
            <Form.Item>
              <Input type="number" value={Number(stock.stock)} size="large" />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <div className="formLabel">New Stock</div>
            <Form.Item name="stock">
              <Input
                onChange={(e: any) => setStockValue(e.target.value)}
                type="number"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <hr />
        <div className="formLabel">
          Stock after Update :{" "}
          <strong style={{ fontSize: 20 }}>
            {Number(stock?.stock) + Number(stockValue)}  &nbsp;
          </strong>{stock?.unit}
        </div>
        <br />
        <Row>
          <Col sm={6}>
            <Button onClick={handleCancel} block size="large">
              Cancel
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              loading={isLoading}
              size="large"
              block
              type="primary"
              htmlType="submit"
            >
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateStock;
