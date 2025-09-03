import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { Card, Form, notification } from "antd";
import "./styles.scss";
import { useSelector } from "react-redux";
import { POST } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import BomForm from "../../components/BomForm";
export default function CreateCompositionScreen() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const [notificationApi, contextHolder] = notification.useNotification();

  //state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //function
  const onFinish = async (vals: any) => {
    let obj: any = {
      companyId: user?.companyInfo?.id,
      staffId: user?.isStaff ? user?.staff?.id : null,
      createdBy: user?.isStaff ? user?.staff?.id : user?.id,
      usertype: user?.isStaff ? "staff" : "admin",
      productId: vals?.mainProduct.value,
      quantity: vals?.quantity,
      consumption_location: vals?.consumption_location?.value || null,
      production_location: vals?.production_location?.value || null,
      consumerItems: [],
      byproductItems: [],
    };
    if (vals?.compositeItems?.length) {
      vals?.compositeItems?.map((item: any) => {
        obj.consumerItems?.push({
          productId: item?.product?.value,
          quantity: item?.quantity,
        });
      });
    } else {
      notificationApi.error({ message: "Composite Items Cannot be Empty!" });
      return;
    }
    if (vals?.byProductItems?.length) {
      vals?.byProductItems?.map((item: any) => {
        obj.byproductItems?.push({
          productId: item?.product?.value,
          quantity: item?.quantity,
        });
      });
    }
    try {
      setIsLoading(true);
      const response: any = await POST(API.CREATE_BOM, obj);
      if (response?.status) {
        notificationApi.success({
          message: "Success",
          description: "The BOM has been successfully created.",
        });
        navigate("/usr/productComposition");
      } else {
        notificationApi.error({
          message: "Failed",
          description: response?.message || "Something Went Wrong in Our End",
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Failed",
        description: error?.message || "Something Went Wrong in Our End",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <PageHeader
        // onSubmit={() => navigate("/usr/create-product/service")}
        goBack={() => navigate(-1)}
        firstPathLink={urlLocation.pathname.replace("/create", "")}
        title={`${t("home_page.homepage.CreateBOM")}`}
        secondPathLink={urlLocation?.pathname}
        secondPathText={`${t("home_page.homepage.CreateBOM")}`}></PageHeader>

      <Container fluid>
        <br />
        <div className="adminTable-Box1">
          <div className="adminTable-Box2">
            <Card>
              <BomForm onFinish={onFinish} form={form} isLoading={isLoading} />
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
