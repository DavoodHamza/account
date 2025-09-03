import { Card } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";
import Data from "./cotent.json";
import "./styles.scss";

const UserManual = () => {
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isFullLoading] = useState(false);
  const { type } = useParams();
  const handleItemClick = (id: any) => {
    setSelectedId(id);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSelectedId(Data.length > 0 ? Data[0].id : null);
  }, [Data]);

  const selectedItem = Data.find((item) => item.id === selectedId);

  return (
    <>
      {type === "web" ? <WebsiteHeader /> : null}
      <div className="website-screens">
        <Container>
          <br />
          <strong>Tax GO user manual</strong>
          <br />
          <Row>
            <Col
              sm={2}
              style={{
                backgroundColor: "white",
                borderRadius: "10px 0px 0px 10px",
                padding: 10,
              }}
            >
              <div>
                {Data.map((item) => (
                  <div
                    key={item.id}
                    className={`dashboard-box1 ${
                      selectedId === item?.id ? "selected" : ""
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.head}
                  </div>
                ))}
              </div>
            </Col>
            <Col className="userManual-contentBox" md={10}>
              <div>
                {isFullLoading ? (
                  <LoadingBox />
                ) : (
                  <>
                    {selectedItem && (
                      <>
                        <div className="manualtext1">{selectedItem?.head}</div>
                        <div className="questions">
                          <IoArrowForwardOutline
                            color="blue"
                            size={15}
                            style={{ marginRight: 5 }}
                          />
                          {selectedItem?.p1}
                        </div>
                        <Row>
                          <Col md={12} className="content-box1">
                            <Card>
                              <img
                                src={selectedItem?.image1}
                                alt="image1"
                                width={"100%"}
                              />
                            </Card>
                          </Col>
                          <Col md={12} className="content-box1">
                            <div className="points">
                              {selectedItem.points?.map((dotpoints, index) => (
                                <div key={index} className="">
                                  {" "}
                                  <BsCaretRightFill
                                    size={15}
                                    style={{ marginRight: 5 }}
                                    color="#18a762"
                                  />
                                  {dotpoints}
                                </div>
                              ))}
                            </div>
                          </Col>

                          <Col sm={12} className="content-box1">
                            <div className="questions">
                              <IoArrowForwardOutline
                                color="blue"
                                size={15}
                                style={{ marginRight: 5 }}
                              />
                              {selectedItem?.p2}
                            </div>
                            <Card>
                              <img
                                src={selectedItem?.image2}
                                alt="image2"
                                width={"100%"}
                              />
                            </Card>
                          </Col>
                          <Col md={12} className="content-box1">
                            <div className="points">
                              {selectedItem?.points2?.map(
                                (dotpoints2, index) => (
                                  <div key={index} className="">
                                    {" "}
                                    <BsCaretRightFill
                                      style={{ marginRight: 5 }}
                                      size={15}
                                      color="#18a762"
                                    />
                                    {dotpoints2}
                                  </div>
                                )
                              )}
                            </div>
                          </Col>

                          {selectedItem.p3 ||
                          selectedItem.image3 ||
                          selectedItem.points3 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p3}
                              </div>
                              <Card>
                                <img
                                  src={selectedItem?.image3}
                                  width={"100%"}
                                  alt="image2"
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points3?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                          {selectedItem.p4 ||
                          selectedItem.image4 ||
                          selectedItem.points4 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p4}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image4}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points4?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}

                          {selectedItem.p5 ||
                          selectedItem.image5 ||
                          selectedItem.points5 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p5}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image5}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points5?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}

                          {selectedItem.p6 ||
                          selectedItem.image6 ||
                          selectedItem.points6 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p6}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image6}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points6?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                          {selectedItem.p7 ||
                          selectedItem.image7 ||
                          selectedItem.points7 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p7}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image7}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points7?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                          {selectedItem.p8 ||
                          selectedItem.image8 ||
                          selectedItem.points8 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p8}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image8}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points8?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                          {selectedItem.p9 ||
                          selectedItem.image9 ||
                          selectedItem.points9 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p9}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image9}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points9?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}

                          {selectedItem?.p10 ||
                          selectedItem.image10 ||
                          selectedItem.points10 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p10}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image10}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points10?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}

                          {selectedItem.p11 ||
                          selectedItem.image11 ||
                          selectedItem.points11 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p11}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image11}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points11?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                          {/* here is the next start */}

                          {selectedItem.image12 ? (
                            <Col md={12}>
                              <div className="questions">
                                <IoArrowForwardOutline
                                  color="blue"
                                  size={15}
                                  style={{ marginRight: 5 }}
                                />
                                {selectedItem?.p9}
                              </div>
                              <Card>
                                <img
                                  alt="image2"
                                  src={selectedItem?.image12}
                                  width={"100%"}
                                />
                              </Card>
                              <Col md={12} className="content-box1">
                                <div className="points">
                                  {selectedItem.points9?.map(
                                    (dotpoints, index) => (
                                      <div key={index} className="">
                                        {" "}
                                        <BsCaretRightFill
                                          size={15}
                                          style={{ marginRight: 5 }}
                                          color="#18a762"
                                        />
                                        {dotpoints}
                                      </div>
                                    )
                                  )}
                                </div>
                              </Col>
                            </Col>
                          ) : null}
                        </Row>
                      </>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {type === "web" ? (
        <>
          <Whatsapp /> <WebsiteFooter />
        </>
      ) : null}
    </>
  );
};

export default UserManual;
