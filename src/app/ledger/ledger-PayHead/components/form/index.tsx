import { useState } from "react";
import { Button, Form, Modal, notification } from "antd";
import { useSelector } from "react-redux";
import EmployeeCategoryForm from "./employeeCatagoryForm";
import ProductCatagoryForm from "./productCatagoryForm";
import UnitFrom from "./unitFrom";
import { Row, Col, Container } from "react-bootstrap";
import LocationForm from "./locationForm";
import API from "../../../../../config/api";
import { POST, PUT } from "../../../../../utils/apiCalls";
import { useTranslation } from "react-i18next";
function CreateSettings(props: any) {
  const {t} = useTranslation();
  const { source, open, close, id, initalValue } = props;
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [forms] = Form.useForm();
  const adminid = user?.id;

  const onFinished = async (val: any) => {
    if (source === "unit") {
      await unitFormFinish(val);
    } else if (source === "location") {
      await loactionFormFinish(val);
    } else if (source === "productCategory") {
      await productCategoryFormFinish(val);
    } else if (source === "employeeCategory") {
      await employeeCategoryFormFinish(val);
    } else if (source === "payHead") {
      await payHeadFormFinish(val);
    }
    props.reload();
  };

  //this function for payHeadFormFinish
  const payHeadFormFinish = async (val: any) => {
    let url =
      id === "create"
        ? API.PAYROLLPAYHEAD_CREATE
        : API.PAYROLLPAYHEAD_UPDATE + id;
    try {
      let obj = {
        name: val?.name,
        type: val?.type,
        calculationPeriods: val?.calculationPeriods,
        ledgercategory: val?.ledgercategory,
        userid: adminid,
      };
      let response: any = null;
      if (id == "create") {
        response = await POST(url, obj);
      } else {
        response = await PUT(url, obj);
      }

      if (response.status) {
        setIsLoading(false);

        notification.success({
          message: "Success",
          description: response.message,
        });
        close();
      } else {
        setIsLoading(false);

        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const loactionFormFinish = async (val: any) => {
    let url = id === "create" ? API.LOCATION_POST : API.LOCATION_PUT + id;
    try {
      setIsLoading(true);

      let obj = {
        location: val?.location,
        userid: adminid,
      };
      let response: any = null;
      if (id == "create") {
        response = await POST(url, obj);
      } else {
        response = await PUT(url, obj);
      }

      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: response.message,
        });
        close();
      } else {
        setIsLoading(false);
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  //this function for EMPLOYEECATEGORY
  const employeeCategoryFormFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url =
        id == "create"
          ? API.EMPLOYEECATEGORY_CREATE
          : API.EMPLOYEECATEGORY_UPDATE + id;
      let obj = {
        category: val?.category,
        userid: adminid,
      };
      let response: any = null;
      if (id == "create") {
        response = await POST(url, obj);
      } else {
        response = await PUT(url, obj);
      }
      if (response.status) {
        setIsLoading(false);

        notification.success({
          message: "Success",
          description: response.message,
        });
        close();
      } else {
        setIsLoading(false);

        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //this function for productCategory
  const productCategoryFormFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url =
        id == "create"
          ? API.PRODUCTCATEGORY_CREATE
          : API.PRODUCTCATEGORY_UPDATE + id;
      let obj = {
        category: val?.category,
        userid: adminid,
      };
      let response: any = null;
      if (id == "create") {
        response = await POST(url, obj);
      } else {
        response = await PUT(url, obj);
      }
      if (response.status) {
        setIsLoading(false);

        notification.success({
          message: "Success",
          description: response.message,
        });
        close();
      } else {
        setIsLoading(false);

        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //this function for unit
  const unitFormFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let url = id == "create" ? API.UNIT_CREATE : API.UNIT_UPDATE + id;
      let obj = {
        unit: val?.unit,
        decimalValues: Number(val?.decimalValues) || 0,
        formalName: val?.formalName,
        userid: adminid,
      };
      let response: any = null;
      if (id === "create") {
        response = await POST(url, obj);
      } else {
        response = await PUT(url, obj);
      }
      if (response.status) {
        setIsLoading(false);
        notification.success({
          message: "Success",
          description: response.message,
        });
        close();
      } else {
        setIsLoading(false);
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  function camelToPascalWithSpace(inputString: string) {
    let result = "";
    for (let i = 0; i < inputString?.length; i++) {
      const char = inputString[i];
      if (char === char.toUpperCase()) {
        result += " " + char;
      } else {
        result += char;
      }
    }
    return result.trim().charAt(0).toUpperCase() + result.slice(1);
  }

  let pageTitle =
    id == "create"
      ? `${camelToPascalWithSpace(source)} - Create  ${camelToPascalWithSpace(
          source
        )}`
      : `${camelToPascalWithSpace(source)} - Update  ${camelToPascalWithSpace(
          source
        )}`;
  return (
    <Container className="mt-2">
      <Modal
        title={pageTitle}
        open={open}
        centered
        onCancel={() => close()}
        footer={false}
      >
        <Form
          onFinish={(val) => onFinished(val)}
          initialValues={initalValue}
          form={forms}
        >
          <div className="adminTable-Box1">
            <div className="adminTable-Box2">
              <div className="white-card">
                <div>
                  {/* this condition for diffrent settings */}
                  {source === "unit" ? (
                    <UnitFrom />
                  ) : source === "location" ? (
                    <LocationForm />
                  ) : source === "productCategory" ? (
                    <ProductCatagoryForm />
                  ) : source === "employeeCategory" ? (
                    <EmployeeCategoryForm />
                  ) :''}
                </div>

                <Row>
                  <Col sm={6}></Col>
                  <Col sm={3}>
                    <Button
                      block
                      onClick={() => close()}
                      style={{ marginRight: 10 }}
                      size="large"
                    >
                      {t("home_page.homepage.Cancel")}
                    </Button>
                  </Col>
                  <Col sm={3}>
                    <Button
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      block
                      size="large"
                    >
                      {t("home_page.homepage.submit")}
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </Container>
  );
}

export default CreateSettings;
