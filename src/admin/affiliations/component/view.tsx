import { Button, Card, Input, message, Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import API from "../../../config/api";
import { REGISTERGET } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import { useParams } from "react-router-dom";
import Avatar from "../../../assets/images/user.webp";
import "../styles.scss";
import { TbGraphFilled } from "react-icons/tb";
import SubHeader from "../../adminNavigation/subHeader";
import { RiCoupon3Line } from "react-icons/ri";
// import BankDetailsForm from "./bankDetailsForm";
import AffiliationFormModal from "./modalForm";

const ViewAffiliation = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [isCopy, setIsCopy] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  // const [bankDetailModal, setBankDetailModal] = useState(false);
  const { id } = useParams();

  const getAffiliation = async () => {
    try {
      setIsLoading(true);
      let api = API.BASE_URL + API.AFFILIATION + id;
      const response: any = await REGISTERGET(api, null);
      if (response?.status) {
        setData(response.data);
      } else {
        message.error("Can't load the affiliation");
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while loading the affiliation");
    } finally {
      setIsLoading(false);
    }
  };

  const CopyLink = () => {
    navigator.clipboard
      .writeText(`www.taxgoglobal.com/getstart/${data?.affiliationCode}`)
      .then(() => {
        setIsCopy(true);
        setTimeout(() => {
          setIsCopy(false);
        }, 25000);
        message.success("link copied");
      })
      .catch(() => {
        message.error("Failed to copy");
      });
  };
  useEffect(() => {
    getAffiliation();
  }, []);

  const affiliation = [
    {
      key: "name",
      label: "Name",
      value: data?.name,
    },
    {
      key: "email",
      label: "Email",
      value: data?.email,
    },
    {
      key: "phone",
      label: "Phone",
      value: data?.phone,
    },
    {
      key: "countryname",
      label: "Country",
      value: data?.countryInfo?.name,
    },
    {
      key: "affiliationCode",
      label: "Affiliate Code",
      value: data?.affiliationCode,
    },
    {
      key: "amountEarned",
      label: "Amount Earned",
      value: `${(data?.amountEarned || 0).toFixed(2)}  ${
        data?.countryInfo?.maincurrency
      }`,
    },
  ];

  const columns = [
    {
      title: "Field",
      dataIndex: "label",
      key: "label",
      render: (record: any) => {
        return <strong>{record}</strong>;
      },
    },
    {
      title: "Details",
      dataIndex: "value",
      key: "value",
    },
  ];

  const detailsColumns = [
    {
      title: "Sl",
      dataIndex: "id",
      key: "id",
      render: (id: any, __: any, rowIndex: number) => {
        return <div className="table-Txt">{rowIndex + 1}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value: any) => {
        return <div>{value} </div>;
      },
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (value: any) => {
        return <div>{value}</div>;
      },
    },
    {
      title: "No of Counters",
      dataIndex: "counter",
      key: "counter",
      render: (value: any) => {
        return <div>{value}</div>;
      },
    },
    {
      title: "Retail Xpress with Tax GO",
      dataIndex: "counter",
      key: "retailXpressWithTaxgo",
      render: (data: any) => {
        return (
          <div>
            {data > 0 ? (
              <Tag color="green">Yes</Tag>
            ) : (
              <Tag color="red">No</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
      render: (value: any) => {
        return (
          <div>
            {value} {value == 1 ? " month" : " months"}
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any) => {
        return <div>{value}</div>;
      },
    },
    {
      title: "Sole Trader",
      dataIndex: "soleTrader",
      key: "soleTrader",
      render: (value: any) => {
        return (
          <div>
            {value === true ? (
              <Tag color="green">Yes</Tag>
            ) : (
              <Tag color="red">No</Tag>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <SubHeader
            firstPathLink={"/admin/affiliations"}
            firstPathText="Affiliates "
            goback={-1}
            title={data?.name}
          />
          <br />
          <Container>
            <Row>
              <Col md={4} sm={12}>
                <Card>
                  <div className="affiliatephoto_container">
                    <div className="affiliate_profilepic">
                      <img
                        src={!data?.image ? Avatar : data?.image}
                        className="profile_Photo"
                        alt="profile_Photo"
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 6 }}>
                    <strong>Name: {data?.name}</strong>
                    <br />
                    <strong>Code: {data?.affiliationCode}</strong>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={affiliation}
                    pagination={false}
                    scroll={{ x: true }}
                  />
                  {/* <div className="col-12 d-flex justify-content-end mt-3">
                    <Button
                      type="primary"
                      onClick={() => setBankDetailModal(true)}
                    >
                      Send Rewards
                    </Button>
                  </div> */}
                </Card>
              </Col>
              <Col md={8} sm={12}>
                <Row className="g-3">
                  <Col md={6} sm={12}>
                    <Card>
                      <div className="d-flex justify-content-between">
                        {isLoading ? (
                          <Spin />
                        ) : (
                          <>
                            <div
                              style={{
                                backgroundColor: "rgb(238 224 196)",
                                padding: 10,
                                borderRadius: 50,
                              }}
                            >
                              <TbGraphFilled size={24} color="orange" />
                            </div>
                            <div
                              style={{
                                backgroundColor: "rgb(238 224 196)",
                                padding: 10,
                                borderRadius: 50,
                              }}
                            >
                              <RiCoupon3Line size={24} color="#1a6934" />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="d-flex justify-content-evenly my-2">
                        <span className="affiliate_card_text">
                          Total Referrals
                        </span>
                        <span className="dashboard-total-sales-price">
                          &nbsp;&nbsp;
                          {data?.noOfPersons || 0}
                        </span>
                      </div>
                    </Card>
                  </Col>
                  <Col md={6} sm={12}>
                    <Card>
                      <div className="d-flex justify-content-between">
                        {isLoading ? (
                          <Spin />
                        ) : (
                          <>
                            <div
                              style={{
                                backgroundColor: "rgb(238 224 196)",
                                padding: 10,
                                borderRadius: 50,
                              }}
                            >
                              <TbGraphFilled size={24} color="orange" />
                            </div>
                            <div
                              style={{
                                backgroundColor: "rgb(238 224 196)",
                                padding: 10,
                                borderRadius: 50,
                              }}
                            >
                              <RiCoupon3Line size={24} color="#1a6934" />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="d-flex justify-content-evenly my-2">
                        <span className="affiliate_card_text">
                          Total Reward
                        </span>
                        <span className="dashboard-total-sales-price">
                          {(data?.amountEarned || 0).toFixed(2)}
                        </span>{" "}
                        &nbsp;
                        <div>{data?.countryInfo?.maincurrency}</div>
                      </div>
                    </Card>
                  </Col>
                  <Col sm={12}>
                    <Card
                      title="Get Affiliate Link"
                      headStyle={{ borderBottom: "none" }}
                    >
                      <div className="d-flex pb-3 ">
                        <Input
                          readOnly
                          value={`www.taxgoglobal.com/getstart/${data?.affiliationLink}`}
                          style={{ marginRight: "10px" }}
                        />
                        <Button type="primary" onClick={CopyLink}>
                          {isCopy ? "Copied" : "Copy Link"}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                  <Col md={12} sm={12}>
                    {data?.noOfPersons > 0 && (
                      <Table
                        title={() => (
                          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                            Referred{" "}
                            {`${data?.noOfPersons > 1 ? "User's" : "User"}`}{" "}
                            details
                          </div>
                        )}
                        columns={detailsColumns}
                        dataSource={data?.details}
                        pagination={false}
                        bordered
                        scroll={{ x: true }}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={8} sm={12}>
                <br />
                <br />
              </Col>
            </Row>
          </Container>
        </>
      )}
      {isEditOpen && (
        <AffiliationFormModal
          openModal={isEditOpen}
          setIsOpen={setIsEditOpen}
          type="edit"
          id={id}
          reload={getAffiliation}
        />
      )}
      {/* {bankDetailModal && (
        <BankDetailsForm
          open={bankDetailModal}
          close={() => setBankDetailModal(false)}
          rewardamount={data?.amountEarned || 0}
          currency={data?.countryInfo?.maincurrency}
          currencyCode={data?.countryInfo?.currencycode}
          country={data?.countryInfo?.name}
          type="sendMoney"
        />
      )} */}
    </>
  );
};

export default ViewAffiliation;
