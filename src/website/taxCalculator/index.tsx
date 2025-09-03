import WebsiteHeader from "../../components/websiteHeader";
import WebsiteFooter from "../../components/websiteFooter";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";
import API from "../../config/api";
import "./styles.scss";
import Whatsapp from "../../components/whatsapp";
import ChatBot from "../../components/bot";

function TaxCalculator() {
  const [countryData, setCountryData] = useState<any>([]);
  const get_countrie_url = API.GET_COUNTRIES_DETAILS;

  //function to get the countries list
  const getCountries = async () => {
    const requestOptions: any = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(get_countrie_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCountryData(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className="website-screens">
      <WebsiteHeader />

      <div className="card-container">
        <Row gutter={[16, 16]}>
          {countryData.map((card: any, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6} className="card-row">
              <Link to={`${card.id}`}>
                <Card
                  className="country-card"
                  hoverable
                  cover={
                    <img
                      className="country-image circular-image"
                      alt={`Card ${index + 1}`}
                      src={`${card.icon}`}
                    />
                  }
                >
                  <Card.Meta className="country-text" title={card.name} />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      <Whatsapp />
      {/* <ChatBot/> */}
      <WebsiteFooter />
    </div>
  );
}

export default TaxCalculator;
