import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import LoadingBox from "../../../../components/loadingBox";
import PageHeader from "../../../../components/pageHeader";
import { Container, Table } from "react-bootstrap";
import { Button, Card } from "antd";
import { withTranslation } from "react-i18next";

import moment from "moment";
import { Link } from "react-router-dom";

const HsnCodeReport = (props: any) => {
  const { t } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const { hsn_code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      let url = API.HSN_REPORT + `${user?.companyInfo?.id}/${hsn_code}`;
      const { data }: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.Report")}
        secondPathText= {t("home_page.homepage.HSN/SAC_Summary")}
        firstPathLink={location?.pathname}
        secondPathLink={location?.pathname}
        title={t("home_page.homepage.HSN/SAC_Summary")}
      />
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            {data?.map((item: any, index: number) => (
              <>
                <div className="pageHeader-title">
                  {index + 1}. {item?.idescription}
                </div>
                <br />
                <Table bordered hover striped width={"auto"}>
                  <thead className="Report-thead">
                    <tr>
                      <th className="Report-table-th">{t("home_page.homepage.date")}.
                      </th>
                      <th className="Report-table-th">{t("home_page.homepage.particular")}</th>
                      <th className="Report-table-th">{t("home_page.homepage.voucher")}</th>
                      <th className="Report-table-th">{t("home_page.homepage.invoice")}</th>
                      <th className="Report-table-th">{t("home_page.homepage.tax")}</th>
                      <th className="Report-table-th">{t("home_page.homepage.total")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item?.invoiceData?.map((element: any) => (
                      <tr>
                        <td className="Report-table-td">
                          {moment(element?.userdate).format("YYYY-MM-DD")}
                        </td>
                        <td className="Report-table-td">{element?.type}</td>
                        <td className="Report-table-td">{element?.type}</td>
                        <td className="Report-table-td">
                          {element?.invoiceno}
                        </td>
                        <td className="Report-table-td">{element?.vatamt}</td>
                        <td className="Report-table-td">
                          <div
                            style={{ color: "blue", cursor: 'pointer' }}
                            onClick={() => {
                              if (element.type === "Purchase Invoice") {
                                navigate(
                                  `/usr/purchase-invoice-view/${element?.purchaseid}`
                                );
                              } else if (element.type === "Sales Invoice") {
                                navigate(
                                  `/usr/sale-invoice-view/${element?.saleid}`
                                );
                              } else if (element.type === "Purchase Debit Notes") {
                                navigate(
                                  `/usr/purchase-debitnote-view/${element?.purchaseid}`
                                );
                              } else if (element.type === "Sales Credit Notes") {
                                navigate(
                                  `/usr/sales-credit-view/${element?.saleid}`
                                );
                              }
                            }}
                          >
                            {element?.total}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ))}
          </Card>
        </Container>
      )}
    </>
  );
};

export default withTranslation()(HsnCodeReport);
