import { Button, Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GET } from "../../utils/apiCalls";
import API from "../../config/api";
import { TbGraphFilled } from "react-icons/tb";
import img1 from "../../assets/images/A.webp";
import img2 from "../../assets/images/B.webp";
import img3 from "../../assets/images/C.webp";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import UserGraph from "./components/userGraph";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [usersData, setUsersData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = `dashboard/userGraphData`;
      const { data }: any = await GET(url, null);
      setUsersData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <br />
      <div className="dashboard-greetig-container">
        <strong className="dashboard-username-text">Hi, Emeka</strong>
      </div>
      <br />
      <Row>
        <Col md={4}>
          <Card className="dashboard-card">
            <div className="d-flex align-items-center justify-content-between pb-2">
              <div className="d-flex align-items-center">
                <div className="dashboard-icon-container">
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <TbGraphFilled size={24} color="orange" />
                  )}
                </div>
                <div>
                  <h5 className="dashboard-icons-text mb-0">
                    Total Tax GO Users
                  </h5>
                </div>
              </div>

              <div>
                <img
                  src={img1}
                  alt="icon"
                  style={{ width: "40px", height: "30px" }}
                />
              </div>
            </div>
            <div className="" style={{ display: "flex", alignItems: "center" }}>
              <span className="dashboard-total-sales-price">
                {usersData?.totalTaxgoUsers}
              </span>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: "100%" }}>
            <div className="d-flex align-items-center justify-content-between pb-2">
              <div className="d-flex align-items-center">
                <div className="dashboard-icon-container">
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <HiUsers size={24} color="rgb(119 117 236)" />
                  )}
                </div>
                <div>
                  <h5 className="dashboard-icons-text mb-0">
                    Total Retail Xpress Users
                  </h5>
                </div>
              </div>
              <div>
                <img
                  src={img2}
                  alt="icon"
                  style={{ width: "40px", height: "30px" }}
                />
              </div>
            </div>
            <div className="" style={{ display: "flex", alignItems: "center" }}>
              <span className="dashboard-total-sales-price">
                {" "}
                {usersData?.totalRetailUsers}
              </span>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: "100%" }}>
            <div className="d-flex align-items-center justify-content-between pb-2">
              <div className="d-flex align-items-center">
                <div
                  className="dashboard-icon-container"
                  style={{ backgroundColor: "#c5e6c5" }}
                >
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <RiMoneyDollarCircleFill size={28} color="rgb(83 213 83)" />
                  )}
                </div>
                <h5 className="dashboard-icons-text mb-0">Total Users</h5>
              </div>

              <div>
                <img
                  src={img3}
                  alt="icon"
                  style={{ width: "40px", height: "30px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="dashboard-total-sales-price">
                {Number(usersData?.totalTaxgoUsers) +
                  Number(usersData?.totalRetailUsers)}
              </span>
            </div>
          </Card>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Tax GO Users Preview</h4>
              <Button
                onClick={() => navigate("/admin/users/taxgo")}
                size="small"
                type="link"
              >
                {t("home_page.homepage.View_All")}
              </Button>
            </div>
            <br />
            {usersData?.TaxgoDatasets?.length > 0 && (
              <UserGraph
                data={usersData?.TaxgoDatasets}
                lineColor={"orange"}
                pointColor={"orange"}
                mainColor="rgb(238 224 196)"
              />
            )}
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Retail Xpress Users Preview</h4>
              <Button
                onClick={() => navigate("/admin/users/retail_xpress")}
                size="small"
                type="link"
              >
                {t("home_page.homepage.View_All")}
              </Button>
            </div>
            <br />
            {usersData?.RetailDatasets?.length > 0 && (
              <UserGraph
                data={usersData?.RetailDatasets}
                lineColor={"green"}
                pointColor={"green"}
                mainColor="lightGreen"
              />
            )}
          </Card>
        </Col>
      </Row>
      <br />
    </Container>
  );
};

export default DashBoard;
