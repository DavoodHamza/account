import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../../components/pageHeader";
import { useEffect, useState } from "react";
import LoadingBox from "../../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import { Card, Empty, notification } from "antd";
import API from "../../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import { Col, Container, Row } from "react-bootstrap";
import "./styles.scss";
export default function CompositionDetailsScreen() {
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const [notificationApi, contextHolder] = notification.useNotification();
  const { id } = useParams();

  //state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [bom, setBom] = useState<any>({});
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
      console.log("==================>>>>davoood", response);
      if (response?.status) {
        setBom(response?.data);
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
  const findCompositeLineClassName = (index: number) => {
    const compositeItemsLength = bom?.compositeBomItems?.length || 0;
    if (index === 0 && compositeItemsLength - 1 === index) {
      return "detailsCompositeItemsBox4";
    } else if (index == 0) {
      return "detailsCompositeItemsBox2";
    } else if (compositeItemsLength - 1 === index) {
      return "detailsCompositeItemsBox3";
    } else {
      return "detailsCompositeItemsBox";
    }
  };
  return (
    <>
      {contextHolder}
      <PageHeader
        // onSubmit={() => navigate("/usr/create-product/service")}
        goBack={() => navigate(-1)}
        firstPathLink={urlLocation.pathname.replace("/create", "")}
        title={"BOM Details"}
        secondPathLink={urlLocation?.pathname}
        secondPathText={"BOM Details"}></PageHeader>
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
                    <Col md={6} className={"detailsCompositeBox1"}>
                      <div className="detailsComposite-Txt1">Product</div>
                      <div
                        className={
                          bom?.compositeBomItems?.length === 1
                            ? "detailsCompositeBox3"
                            : "detailsCompositeBox5"
                        }>
                        <div className="detailsCompositeBox11">
                          <div className="detailsCompositeBox6">Product</div>
                          <div className="detailsCompositeBox7">
                            {bom?.Product?.idescription}
                          </div>
                        </div>
                        <div className="detailsCompositeBox11">
                          <div className="detailsCompositeBox6">Quantity</div>
                          <div className="detailsCompositeBox7">
                            {bom?.quantity}
                          </div>
                        </div>
                        {!bom?.compositeBomItems ||
                        bom?.compositeBomItems?.length === 0 ? null : (
                          <div className="detailsCompositeline1" />
                        )}
                      </div>
                    </Col>
                    <Col md={6} className={"detailsCompositeBox2"}>
                      <>
                        <div className="detailsComposite-Txt2">
                          Raw Material
                        </div>
                        {bom?.compositeBomItems?.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className={findCompositeLineClassName(index)}>
                              <div className="detailsCompositeline2" />
                              <div className="detailsCompositeBox12">
                                <div className="detailsCompositeBox6">
                                  Product
                                </div>
                                <div className="detailsCompositeBox7">
                                  {item?.Product?.idescription}
                                </div>
                              </div>
                              <div className="detailsCompositeBox12">
                                <div className="detailsCompositeBox6">
                                  Quantity
                                </div>
                                <div className="detailsCompositeBox7">
                                  {item?.quantity}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </>
                    </Col>
                  </Row>
                  <br />
                  <br />

                  <Row>
                    <Col md={6} className={"detailsCompositeBox1"}></Col>
                    <Col md={6} className={"detailsCompositeBox2"}>
                      <>
                        <div className="detailsComposite-Txt3">By Product</div>
                        {bom?.byProductBomItems?.length ? (
                          bom?.byProductBomItems?.map(
                            (item: any, index: number) => (
                              <div
                                key={index}
                                className={"detailsCompositeItemsBox4"}>
                                <div className="detailsCompositeBox12">
                                  <div className="detailsCompositeBox6">
                                    Product
                                  </div>
                                  <div className="detailsCompositeBox7">
                                    {item?.Product?.idescription}
                                  </div>
                                </div>
                                <div className="detailsCompositeBox12">
                                  <div className="detailsCompositeBox6">
                                    Quantity
                                  </div>
                                  <div className="detailsCompositeBox7">
                                    {item?.quantity}
                                  </div>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={"No Byproduct"}
                          />
                        )}
                      </>
                    </Col>
                  </Row>
                  <br />
                  <br />
                  <div className="createCompositeBox7">
                    <Row>
                      <Col md={6} className={"detailsCompositeBox1"}>
                        <div className="detailsCompositeBox8">
                          <div>Production Location : </div>
                          <div className="detailsComposite-txt4">
                            &nbsp;
                            {bom?.ProductionLocation?.location ||
                              "No Location Added"}
                          </div>
                        </div>
                      </Col>
                      <Col md={6} className={"detailsCompositeBox2"}>
                        <div className="detailsCompositeBox8">
                          <div>Consumption Location : </div>
                          <div className="detailsComposite-txt4">
                            &nbsp;
                            {bom?.ConsumptionLocation?.location ||
                              "No Location Added"}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
}
