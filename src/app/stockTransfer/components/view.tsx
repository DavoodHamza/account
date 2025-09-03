import { useLocation, useParams } from "react-router-dom";
import { t } from "i18next";
import { Col, Container, Row, Table } from "react-bootstrap";
import PageHeader from "../../../components/pageHeader";
import { useEffect, useState } from "react";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import LoadingBox from "../../../components/loadingBox";
import { Card } from "antd";
import dayjs from "dayjs";

const StockTransferView = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = API.VIEW_STOCK_TRANSFER + id;
      const { data }: any = await GET(url, null);
      setTransferData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        firstPathLink={"/usr/stock-transfer"}
        firstPathText="Stock Transfer"
        secondPathLink={location?.pathname}
        secondPathText="Stock Transfer Details"
        goBack={"/usr/stock-transfer"}
        title="Stock Transfer Details"
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <Row>
              <Col md="12">
                <div className="salesInvoice-Header">Transfer Details</div>

                <Table bordered>
                  <tbody>
                    <tr>
                      <td className="items-head">Series No.</td>
                      <td>
                        <strong>{transferData?.locationDetails?.locationCode}</strong>
                      </td>
                      <td className="items-head">Voucher No.</td>
                      <td>
                        <strong>{transferData?.voucherNo}</strong>
                      </td>
                      <td className="items-head">Date</td>
                      <td className="items-value">
                        {dayjs(transferData?.transferDate).format("DD-MM-YYYY")}
                      </td>
                    </tr>

                    <tr>
                      <td className="items-head">From</td>
                      <td className="items-value">
                        {transferData?.locationFromDetails?.location}
                      </td>
                      <td className="items-head">To</td>
                      <td className="items-value">
                        {transferData?.locationToDetails?.location}
                      </td>
                      <td className="items-head">
                        {t("home_page.homepage.Reference")}
                      </td>
                      <td className="items-value">{transferData?.reference}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <div className="salesInvoice-SubHeader ">Transfer Items</div>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>{t("home_page.homepage.PRODUCT")}</th>
                      <th>{t("home_page.homepage.QUANTITY")}</th>
                      <th>{t("home_page.homepage.UNIT")}</th>
                      <th>{t("home_page.homepage.PRICE")}</th>
                      <th>{t("home_page.homepage.TOTAL")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferData?.itemDetails?.map((item: any) => {
                      return (
                        <tr>
                          <td>{item?.productName}</td>
                          <td>{item?.qty}</td>
                          <td>{item?.unit}</td>
                          <td>{item?.price}</td>
                          <td>{item?.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            {transferData?.totalCharge > 0 ? (
              <Row>
                <Col>
                  <div className="salesInvoice-SubHeader ">Extra Charges</div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Ledger Account</th>
                        <th>Bank/Cash</th>
                        <th>Amount</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferData?.charges?.map((item: any) => {
                        return (
                          <tr>
                            <td>{item?.ledgerName}</td>
                            <td>{item?.paidBank}</td>
                            <td>{item?.amount}</td>
                            <td>{item?.notes ? item?.notes : "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            ) : null}

            <Row>
              <Col sm={6}></Col>
              <Col sm={6}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Total Items amount</strong>
                      </td>
                      <td>
                        <strong>
                          {Number(transferData?.totalAmount) -
                            Number(transferData?.totalCharge)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total Extra Charges</strong>
                      </td>
                      <td>
                        <strong>{transferData?.totalCharge}</strong>
                      </td>
                    </tr>
                    {/* <tr>
                      <td>
                        <strong>{t("home_page.homepage.TOTAL_AMOUNT")}</strong>
                      </td>
                      <td>
                        <strong>{transferData?.totalAmount}</strong>
                      </td>
                    </tr> */}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </Container>
      )}
    </>
  );
};

export default StockTransferView;
