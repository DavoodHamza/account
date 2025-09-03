import React, { useEffect, useState } from "react";
import PageHeader from "../../../../../components/pageHeader";
import { useParams } from "react-router-dom";
import { Button, Card } from "antd";
import LoadingBox from "../../../../../components/loadingBox";
import { Col, Container, Row, Table } from "react-bootstrap";
import API from "../../../../../config/api";
import { GET } from "../../../../../utils/apiCalls";
import moment from "moment";
import { useTranslation } from "react-i18next";
function ViewBankTransfer() {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const { id: transactionid } = useParams();
  const [date,setdate] = useState<any>([])

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const url = API.VIEW_TRANSFER + transactionid;
      const { data }: any = await GET(url, null);
      setData(data);
      const formattedDate = moment(data?.transferDetails?.sdate).format("DD-MM-YYYY")
      setdate(formattedDate);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBankDetails();
  }, []);

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cashBank"}
        firstPathText={t("home_page.homepage.Bank")}
        secondPathLink={`/usr/cashBank/${transactionid}/details`}
        secondPathText={t("home_page.homepage.BankDetails")}
        thirdPathLink={`/usr/cashBank/viewtransfer/${transactionid}`}
        thirdPathText={t("home_page.homepage.View")}
        goback={-1}
        title={t("home_page.homepage.ViewBankTransfer")}

      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <Table bordered responsive={true} style={{ tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.ViewBankTransfer")}</th>
                  <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.FROM")}</th>
                  <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.TO")}</th>
                  <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.REFERENCE")}</th>
                  <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.Amount")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{date}</td>
                  <td>{data?.fromBank?.laccount}</td>
                  <td>{data?.toBank?.laccount}</td>
                  <td>{data?.transferDetails?.reference}</td>
                  <td>{Number(Math.abs(data?.transferDetails?.total)).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Container>
      )}
    </div>
  );
}

export default ViewBankTransfer;
