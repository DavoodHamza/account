import { useState } from "react";
import { Button, Form, Modal, notification } from "antd";
import { useSelector } from "react-redux";
import API from "../../../../config/api";
import { POST, PUT } from "../../../../utils/apiCalls";
import EmployeeCategoryForm from "./employeeCatagoryForm";
import PayHeadForm from "./payHeadForm";
import ProductCatagoryForm from "./productCatagoryForm";
import UnitFrom from "./unitFrom";
import { Row, Col } from "react-bootstrap";
import LocationForm from "./locationForm";
import TaxPercentageForm from "./TaxForm";
import BusinessCategoryForm from "./businessCategoryForm";
import HsnCodeForm from "./hsnCodeForm";
import { t } from "i18next";

function CreateSettings(props: any) {
  const { source, open, close, id, initalValue } = props;
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);
  const [forms] = Form.useForm();
  const adminid = user?.id;

  const onFinished = async (val: any) => {
    console.log("source-->",source)
    if (source === "unit") {
      await unitFormFinish(val);
    } else if (source === "location") {
      await loactionFormFinish(val);
    } else if (source === "productCategory" || source === "serviceCategory" || source === "productServiceCategory") {
      await productCategoryFormFinish(val);
    } else if (source === "employeeCategory") {
      await employeeCategoryFormFinish(val);
    } else if (source === "payHead") {
      await payHeadFormFinish(val);
    }else if (source === "tax") {
      await handleVatFinish(val);
    }else if (source === "category") {
      await handleBusinessCategoryFinish(val);
    }else if (source === "hsnCode") {
      await handleHsnCodeFinish(val);
    }
    props.reload();
  };


  const handleHsnCodeFinish = async(val:any) => {
    try {
      setIsLoading(true);
      let url = id === "create" ? `hsn_code` : `hsn_code/` + id;
      let obj = {
        hsn_code: val?.hsn_code,
        description:val?.description,
        adminid: adminid,
        companyid:user?.companyInfo?.id
      };
      const data :any = id === "create" ? await POST(url, obj) :  await PUT(url, obj)
      if(data.status){
        notification.success({
          message: "Success",
          description: data.message,
        });
        close();
      }else{
        notification.error({
          message: "Failed",
          description: data.message,
        });
      }
    } catch (error) {
      console.log(error)
      notification.error({
        message:"Server Error",description:`Failed to ${id === 'create' ? "create" : "update" } HSN/SAC code!! Please try again later`
      })
    }finally{
      setIsLoading(false)
    }
  }

  const handleBusinessCategoryFinish = async(val:any) =>{
    try {
      setIsLoading(true);
      let url = id === "create" ? API.CREATE_BUSINESS_CATEGORY + '/add' : API.CREATE_BUSINESS_CATEGORY + `/${id}`;
      let obj = {
        btitle: val?.category,
        adminid: adminid,
      };
      const data :any = id === "create" ? await POST(url, obj) :  await PUT(url, obj)
      if(data.status){
        notification.success({
          message: "Success",
          description: data.message,
        });
        close();
      }else{
        notification.error({
          message: "Error",
          description: data.message,
        });
      }
    } catch (error) {
      console.log(error)
      notification.error({
        message:"Server Error",description:`Failed to ${id === 'create' ? "create" : "update" } business category!! Please try again later`
      })
    }finally{
      setIsLoading(false);
    }
  }

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
        companyid:user?.companyInfo?.id,
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

  const handleVatFinish = async(val:any) =>{
    try {
      setIsLoading(true)
      let url = id === "create" ? API.CREATE_TAX_MASTER : API.TAX_MASTER + id;
      let obj = {
        percentage: Number(val?.percentage),
        type: val.type,
        adminid:adminid,
        countryid:user.countryid,
        companyid:user?.companyInfo?.id
      };

      const data :any = id === "create" ? await POST(url, obj) :  await PUT(url, obj)
      if(data.status){
        notification.success({
          message: "Success",
          description: data.message,
        });
        close();
      }else{
        notification.error({
          message: "Error",
          description: data.message,
        });
      }
      
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  const loactionFormFinish = async (val: any) => {
    let url = id === "create" ? API.LOCATION_POST : API.LOCATION_PUT + id;
    try {
      setIsLoading(true);

      let obj = {
        location: val?.location,
        locationCode: val?.locationCode,
        userid: adminid,
        companyid:user?.companyInfo?.id
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
        companyid:user?.companyInfo?.id
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
        companyid:user?.companyInfo?.id,
        categoryType:val?.categoryType
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
        companyid:user?.companyInfo?.id
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

  const onValuesChange = () => {
    if (source === "tax") {
      const igstValue = forms.getFieldValue('percentage');
      forms.setFieldsValue({
        cgst:Number(igstValue)/2,
        sgst:Number(igstValue)/2,
      })
    }
  }

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
    <Modal
      title={pageTitle}
      open={open}
      centered
      onCancel={() => close()}
      footer={false}
      width={500}
    >
      <Form
        onFinish={(val) => onFinished(val)}
        initialValues={initalValue}
        form={forms}
        onValuesChange={onValuesChange}
      >
        <div>
         
          {source === "unit" ? (
            <UnitFrom />
          ) : source === "location" ? (
            <LocationForm />
          ) : (source === "productCategory" ||  source === "serviceCategory" || source === "productServiceCategory") ? (
            <ProductCatagoryForm/>
          ) : source === "employeeCategory" ? (
            <EmployeeCategoryForm />
          ) : source === "tax" ? (
            <TaxPercentageForm />
          ): source === "payHead" ? (
            <PayHeadForm form={forms} />
          ) : source === "category" ? (
            <BusinessCategoryForm />
          ) : source === "hsnCode" ? (
            <HsnCodeForm />
          ) :null}

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
      </Form>
    </Modal>
  );
}

export default CreateSettings;
