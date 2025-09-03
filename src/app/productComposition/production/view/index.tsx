import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../components/pageHeader";
import { useEffect, useState } from "react";
import LoadingBox from "../../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import { Card, notification } from "antd";
import API from "../../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import { Col, Container, Row } from "react-bootstrap";
import "./styles.scss";
import ProductionItemsDataTable from "../../components/productionItemsDataTable";
export default function ProductionDetailsScreen() {
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const [notificationApi, contextHolder] = notification.useNotification();
  const { id } = useParams();
  const { t } = useTranslation();
  //state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [production, setProduction] = useState<any>({});
  //useEffect
  useEffect(() => {
    getProductionDetails();
  }, []);
  //function
  const getProductionDetails = async () => {
    try {
      setIsLoading(true);
      let url =
        API.PRODUCTION_MASTER + `${id}?companyId=${user?.companyInfo?.id}`;
      const response: any = await GET(url, null);
      if (response?.status) {
        setProduction(response?.data);
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

  return (
    <>
      {contextHolder}
      <PageHeader
        // onSubmit={() => navigate("/usr/create-product/service")}
        goBack={() => navigate(-1)}
        firstPathLink={urlLocation.pathname.replace("/create", "")}
        title={"Production Details"}
        secondPathLink={urlLocation?.pathname}
        secondPathText={"Production Details"}
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
                  <Row>
                    <Col md={6}>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Product
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.productDetails?.idescription}
                        </div>
                      </div>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Consumption Location
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.consumptionLocation?.location}
                        </div>
                      </div>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Production Location
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.productionLocation?.location}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Batch Quantity
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.batchQuantity}&nbsp;
                          {production?.productDetails?.units}
                        </div>
                      </div>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Production Quantity
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.productionQuantity}&nbsp;
                          {production?.productDetails?.units}
                        </div>
                      </div>
                      <div className="productionDetailsScreen-box1">
                        <div className="productionDetailsScreen-box2">
                          Total Quantity
                        </div>
                        <div className="productionDetailsScreen-box3">
                          : {production?.totalQuantity}&nbsp;
                          {production?.productDetails?.units}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <ProductionItemsDataTable
                    itemsDetails={production?.compositeProductionItems}
                    title={"Raw Materials"}
                    type={"default"}
                    totalSum={production?.compositeTotalCostPriceSum}
                  />
                  <br />
                  <br />
                  <ProductionItemsDataTable
                    itemsDetails={production?.wastageProductionItems}
                    title={"Wastage Products"}
                    type={"default"}
                    totalSum={production?.wastageTotalCostPriceSum}
                  />
                  <br />
                  <br />
                  <ProductionItemsDataTable
                    itemsDetails={production?.productProductionItems}
                    title={"Generated Products"}
                    type={"product"}
                    totalSum={production?.productTotalCostPriceSum}
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
