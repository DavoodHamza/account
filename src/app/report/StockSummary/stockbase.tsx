import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Stockbase = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const { id, month } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [value, setValue] = useState<any>([]);
  const location = useLocation();

  const loadData = async () => {
    try {
      setIsLoading(true);
      let product_url = API.GET_PRODUCT_TYPE + `${adminid}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(product_url, null);
      setValue(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getstockdaily = async () => {
    try {
      setIsLoading(true);
      let url =
        "purchaseinvoice/bymonth/" + user?.id + "/" + id + "/" + month;
      const { data }: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    getstockdaily();
  }, []);

  return (
    <>
      <PageHeader firstPathText="Report" 
      firstPathLink="/usr/report"
      title="STOCK SUMMARY - Day" 
      secondPathText="stocksummary"
      secondPathLink={location.pathname} 
      thirdPathText = "stocksummary-month"
      thirdPathLink={location.pathname} 
      fourthPathText = "stocksummary-day"
      fourthPathTLink = {location.pathname}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <div className="ReportStockbase-main">
          <div className="ReportStockbase-main1">
            <div className="StocksummaryTable-head">
            {value?.map((data: any) => {
                  if (data?.id == id) {
                    return (
                      <div
                        key={data?.id}
                        style={{
                          fontSize: "25px",
                        }}
                      >
                        {data.idescription}
                      </div>
                    );
                  }
                })}
              </div>
            <Table bordered hover striped width={"auto"}>
              <thead className="Report-thead">
                <tr>
                  <th className="Report-table-th">DATE</th>
                  <th className="Report-table-th">PARTICULAR</th>
                  <th className="Report-table-th">VOUCHER TYPE</th>
                  <th className="Report-table-th">
                    <center>Inwards</center>
                    <>
                      <div className="stockSummaryItem1">
                        <span>QUANTITY</span>
                        <span>VALUE</span>
                      </div>
                    </>
                  </th>
                  <th className="Report-table-th">
                    <center>Outwards</center>
                    <>
                      <div className="stockSummaryItem1">
                        <span>QUANTITY</span>
                        <span>VALUE</span>
                      </div>
                    </>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item: any) => (
                  <tr>
                    <td
                      className="Report-table-td">
                      <Moment format="DD/MM/YYYY">{item.sdate}</Moment>
                    </td>
                    <td className="Report-table-td">{item.particular}</td>
                    <td className="Report-td-link"
                    onClick={() => {
                      let path =
                        item.type === "Purchase Invoice"
                          ? "purchace-invoice-form"
                          : item.type === "Sales Invoice"
                          ? "sale-invoice-form"
                          : item.type === "Purchase Debit Notes"
                          ? "purchace-debitnote-form"
                          : "salesCredit/edit";

                      let _id =
                        item.type === "Purchase Invoice" ||
                        item.type === "Purchase debit Notes"
                          ? item?.purchaseid
                          : item?.saleid;
                      navigate(`/usr/${path}/${_id}`);
                    }}
                    >
                    {item.type}
                      </td>
                    <td className="Report-table-td">
                      <>
                        <div className="stockSummaryItem1">
                          {item.type === "Purchase Invoice" ||
                          item?.type === "Purchase Debit Notes" ? (
                            <>
                              <span>{item?.type === "Purchase Debit Notes" ? `(-) ${item.quantity}` : item.quantity }</span>
                              <span>{item?.type === "Purchase Debit Notes" ? `(-) ${item.total}` : item.total }</span>
                            </>
                          ) : (
                            <>
                              <span></span>
                              <span></span>
                            </>
                          )}
                        </div>
                      </>
                    </td>

                    <td className="Report-table-td">
                      <>
                        <div className="stockSummaryItem1">
                          {item.type === "Sales Invoice" ||
                          item?.type === "Sales Credit Notes" ? (
                            <>
                              <span>{item?.type === "Sales Credit Notes" ? `(-) ${item.quantity}` : item.quantity }</span>
                              <span>{item?.type === "Sales Credit Notes" ? `(-) ${item.total}` : item.total }</span>
                            </>
                          ) : (
                            <>
                              <span></span>
                              <span></span>
                            </>
                          )}
                        </div>
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};
export default Stockbase;
