import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { Card } from "antd";
import { Container, Table } from "react-bootstrap";
import moment from "moment";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { useTranslation } from "react-i18next";


function ProposalView() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>();
  const { id } = useParams();
  const location = useLocation();
  const {t} = useTranslation();
  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const url = API.GET_PROPOSAL + id;
      const { data }: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <PageHeader
            firstPathText={t("home_page.homepage.Proposal")}
            firstPathLink={location.pathname}
            secondPathText ={t("home_page.homepage.Proposal_Details")}
            secondPathLink ={location.pathname}
            title={t("home_page.homepage.Proposal_Details")}
          />
          <br />
          <Container>
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.From_Details")}</div>
              <Table>
                <thead>
                  <tr>
                    <th>{t("home_page.homepage.Date")}</th>
                    <th>{t("home_page.homepage.Company_Name")}</th>
                    <th>{t("home_page.homepage.Email")}</th>
                    <th>{t("home_page.homepage.Mobile")}</th>
                    <th>{t("home_page.homepage.Website")}</th>
                    <th>{t("home_page.homepage.Address")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{moment(data?.proposal_date).format("DD-MM-YYYY")}</td>
                    <td>{data?.from_company_name}</td>
                    <td>{data?.from_email}</td>
                    <td>{data?.from_mobile}</td>
                    <td>{data?.from_website}</td>
                    <td>{data?.from_address}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <br />
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.To_Details")}</div>
              <Table>
                <thead>
                  <tr>
                    <th>{t("home_page.homepage.Date")}</th>
                    <th>{t("home_page.homepage.Company_Name")}</th>
                    <th>{t("home_page.homepage.Email")}</th>
                    <th>{t("home_page.homepage.Mobile")}</th>
                    <th>{t("home_page.homepage.Website")}</th>
                    <th>{t("home_page.homepage.Address")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{moment(data?.proposal_date).format("DD-MM-YYYY")}</td>
                    <td>{data?.to_company_name}</td>
                    <td>{data?.to_email}</td>
                    <td>{data?.to_mobile}</td>
                    <td>{data?.to_website}</td>
                    <td>{data?.to_address}</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
            <br />
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.About_Us")}</div>
              <p>{data?.about__from_company}</p>
            </Card>
            <br />
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.Services_ms")}</div>
              <p>{data?.about_from_services}</p>
            </Card><br />
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.Technologies")}</div>
              <p>{data?.about_from_technologies}</p>
            </Card>
            <br />
            <Card>
              <div className="productAdd-Txt1">{t("home_page.homepage.Proposal_Details")}</div>
              <h6>
                {data?.proposal_title} - {data?.proposal_subtitle}
              </h6>
              <p>{data?.proposal_details}</p>
              <br />
              <div className="productAdd-Txt1">{t("home_page.homepage.Billings")}</div>
              <Table bordered>
                <thead>
                  <tr>
                    <th>{t("home_page.homepage.Description")}</th>
                    <th>{t("home_page.homepage.Quantity")}</th>
                    <th>{t("home_page.homepage.Price")}</th>
                    <th>{t("home_page.homepage.Total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.billing?.map((item: any) => (
                    <tr>
                      <td>{item?.description}</td>
                      <td>{item?.qty}</td>
                      <td>{item?.price}</td>
                      <td>{item?.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="productAdd-Txt1">{t("home_page.homepage.Project-Plan")}</div>
              <Table bordered>
                <thead>
                  <tr>
                    <th>{t("home_page.homepage.Module")}</th>
                    <th>{t("home_page.homepage.Screens")}</th>
                    <th>{t("home_page.homepage.Features")}</th>
                    <th>{t("home_page.homepage.Details")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.project_plan?.map((item: any) => (
                    <tr>
                      <td>{item?.module}</td>
                      <td>{item?.screens}</td>
                      <td>{item?.features}</td>
                      <td>{item?.details}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <br />
               <div className="productAdd-Txt1">{t("home_page.homepage.Terms_Conditions")}</div>
              <p>{data?.proposal_terms}</p> 
              <br />
              <div className="productAdd-Txt1">{t("home_page.homepage.Conclusions")}</div>
              <p>{data?.conclusion}</p>
            </Card>
            <br />
          </Container>
        </>
      )}{" "}
    </>
  );
}

export default ProposalView;
