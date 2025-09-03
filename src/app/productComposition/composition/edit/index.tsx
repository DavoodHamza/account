import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/pageHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Card, Form, notification } from "antd";
import "./styles.scss";
import BomForm from "../../components/BomForm";
import { useEffect, useState } from "react";
import LoadingBox from "../../../../components/loadingBox";
import API from "../../../../config/api";
import { useSelector } from "react-redux";
import { GET, PUT } from "../../../../utils/apiCalls";
export default function EditCompositionScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const [form] = Form.useForm();
  const { id } = useParams();
  const [notificationApi, contextHolder] = notification.useNotification();

  //state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [formInitialValue, setFormInitialValue] = useState<any>({});

  //useEffect
  useEffect(() => {
    getBomDetails();
  }, []);

  //function
  const getBomDetails = async () => {
    try {
      setIsLoading(true);
      let url = API.BOM_BY_ID + `${id}?companyId=${user?.companyInfo?.id}`;
      const response: any = await GET(url, null);
      if (response?.status) {
        form.setFieldsValue(mapBomDataToFormData(response?.data));
      } else {
        notificationApi.error({
          message: "Failed",
          description: response?.message || "Something Went Wrong in Our End",
        });
        // navigate(-1);
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
  function mapBomDataToFormData(bomData: any) {
    let formData: any = {
      mainProduct: {
        label: bomData?.Product?.idescription,
        value: bomData?.Product?.id,
        key: bomData?.Product?.id,
        disabled: false,
      },
      quantity: bomData?.quantity,
      compositeItems: bomData?.compositeBomItems?.map((item: any) => ({
        id: item?.id,
        product: {
          label: item?.Product?.idescription,
          value: item?.Product?.id,
          key: item?.Product?.id,
          disabled: false,
        },
        quantity: item?.quantity,
      })),
    };
    if (bomData?.byProductBomItems?.length) {
      formData["byProductItems"] = bomData?.byProductBomItems?.map(
        (item: any) => ({
          id: item?.id,
          product: {
            label: item?.Product?.idescription,
            value: item?.Product?.id,
            key: item?.Product?.id,
            disabled: false,
          },
          quantity: item?.quantity,
        })
      );
    }
    if (bomData?.ProductionLocation?.id) {
      formData["production_location"] = {
        label: bomData?.ProductionLocation?.location,
        value: bomData?.ProductionLocation?.id,
        key: bomData?.ProductionLocation?.id,
      };
    }
    if (bomData?.ConsumptionLocation?.id) {
      formData["consumption_location"] = {
        label: bomData?.ConsumptionLocation?.location,
        value: bomData?.ConsumptionLocation?.id,
        key: bomData?.ConsumptionLocation?.id,
      };
    }
    return formData;
  }
  const mapFormDataToBomData = (FormValue: any) => {
    return {
      id: Number(id),
      companyId: Number(user?.companyInfo?.id),
      productId: FormValue?.mainProduct?.value,
      quantity: FormValue?.quantity,
      consumption_location: FormValue?.consumption_location?.value || null,
      production_location: FormValue?.production_location?.value || null,
      consumerItems: FormValue.compositeItems.map((item: any) => ({
        ...(item?.id && { id: item?.id }), // Include id only if it exists
        quantity: item?.quantity,
        productId: item.product?.value,
      })),
      byproductItems: FormValue.byProductItems.map((item: any) => ({
        ...(item?.id && { id: item?.id }), // Include id only if it exists
        quantity: item.quantity,
        productId: item.product.value,
      })),
    };
  };

  const update = async (val: any) => {
    try {
      setIsBtnLoading(true);
      const response: any = await PUT(
        API.UPDATE_BOM,
        mapFormDataToBomData(val)
      );
      if (response?.status) {
        notificationApi.success({
          message: "Success",
          description: "The BOM has been successfully Updated.",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1500);
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
      setIsBtnLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <PageHeader
        // onSubmit={() => navigate("/usr/create-product/service")}
        goBack={() => navigate(-1)}
        firstPathLink={urlLocation.pathname.replace("/create", "")}
        title={"Update BOM"}
        secondPathLink={urlLocation?.pathname}
        secondPathText={"Update BOM"}
      ></PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <Container fluid>
            <br />
            <div className="adminTable-Box1">
              <div className="adminTable-Box2">
                <Card>
                  <BomForm
                    form={form}
                    onFinish={update}
                    isLoading={isBtnLoading}
                  />
                </Card>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
}
