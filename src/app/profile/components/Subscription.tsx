import { Alert, Button, Card, notification } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import rocket from "../../../assets/images/Rocket.svg";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AddOnModal from "../../subscription/components/AddOnModal";

function Subscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [planDetails, setPlanDetails] = useState<any>();
  const [paymentLog, setPaymentLog] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSbscriptionDetails = async () => {
    try {
      setIsLoading(true);
      let url = API.USER_SUBSCRIBED_PLAN;
      const response: any = await GET(url, null);
      if (response?.status) {
        setPlanDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionLog = async () => {
    try {
      setIsLoading(true);
      let url = API.USER_SUBSCRIPTION_LIST;
      const response: any = await GET(url, null);
      if (response.status) {
        const limitedData = await response?.data?.slice(0, 10);
        setPaymentLog(limitedData);
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSbscriptionDetails();
    fetchSubscriptionLog();
  }, []);
  return (
    <Container>
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <Card>
            <Row>
              <Col md={6}>
                <Alert
                  message={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <b className="profile-subscription-Txt2">
                          Current Plan{" "}
                        </b>
                        <span>
                          ({" "}
                          {planDetails?.period === 1
                            ? "1 Month"
                            : planDetails?.period === 12
                            ? "12 Months"
                            : planDetails?.period === 24
                            ? "24 Months"
                            : "Free Plan - 2 Weeks"}
                          )
                        </span>

                        {new Date(planDetails?.subscriptionExpiry) <=
                          new Date() &&
                          (moment(planDetails?.subscriptionExpiry).format(
                            "YYYY-MM-DD"
                          ) == moment(new Date()).format("YYYY-MM-DD") ? (
                            <span style={{ color: "red" }}>
                              {" "}
                              - Expires Today
                            </span>
                          ) : (
                            <span style={{ color: "red" }}> - Expired</span>
                          ))}
                      </div>
                    </div>
                  }
                  description={
                    <div className="subscription-item-container">
                      <p>Number of companies : {planDetails?.company}</p>
                      <p>Number of counters : {planDetails?.counter}</p>
                      <p>
                        Retails Xpress Access :{" "}
                        {planDetails?.counter > 0 ? "Yes" : "No"}
                      </p>
                      <p>
                        Subscription End Date :{" "}
                        {moment(planDetails?.subscriptionExpiry).format(
                          "YYYY-MM-DD"
                        )}
                      </p>
                    </div>
                  }
                  type="info"
                />
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <img
                      src={rocket}
                      alt="upgrade"
                      className="profile-subscription-rocket-image"
                    />
                  </Col>
                  <Col
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      marginTop: 10,
                    }}
                  >
                    {new Date(planDetails?.subscriptionExpiry) < new Date() ||
                    planDetails?.period === 2 ? (
                      <>
                        <p className="profile-subscription-Txt2">
                          Do you want to upgrade your subscription plan with add
                          ons
                        </p>
                        <div>
                          <Button
                            type="primary"
                            onClick={() => navigate("/subscription")}
                          >
                            Upgrade
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="profile-subscription-Txt2">
                          Do you want to upgrade your subscription plan
                        </p>
                        <div>
                          <Button
                            type="primary"
                            onClick={() => setIsOpen(true)}
                          >
                            Add On
                          </Button>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />

            <hr />
            <br />
            <p className="profile-subscription-Txt2">Billing History</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>SL No.</th>
                  <th>Payment Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  {/* <th>Invoice</th> */}
                </tr>
              </thead>
              <tbody>
                {paymentLog?.map((item: any, index: number) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{moment(item?.createdAt).format("YYYY-MM-DD")}</td>
                    <td>{item?.subscriptionPlan} Months</td>
                    <td>{item?.amount}</td>
                    <td>
                      {item?.status === "succeeded" ? "Success" : "Failed"}
                    </td>
                    {/* <td>Download</td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <br />
        </>
      )}

      {isOpen && (
        <AddOnModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          planDetails={planDetails}
        />
      )}
    </Container>
  );
}

export default Subscription;
