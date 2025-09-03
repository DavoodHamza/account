import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/pageHeader";
import DataTable from "./components/Table";
import { useSelector } from "react-redux";
import API from "../../config/api";
import { GET } from "../../utils/apiCalls";
import moment from "moment";
import LoadingBox from "../../components/loadingBox";
import { Button, notification } from "antd";
import { useTranslation } from "react-i18next";
function Proposal() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;

  const columns = [
    {
      title: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: ( data: any) => data?.rowIndex + 1,
      },
    {
      dataField: "proposal_date",
      title: t("home_page.homepage.Date_pl"),
      cellRender: (data: any) =>
        moment(data?.proposal_date).format("DD-MM-YYYY"),
    },
    {
      dataField: "from_company_name",
      title: t("home_page.homepage.Form_pl"),
    },
    {
      dataField: "to_company_name",
      title: t("home_page.homepage.To_pl"),
    },
    {
      dataField: "proposal_title",
      title: t("home_page.homepage.Proposal_pl"),
    },
  ];

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const url = API.GET_PROPOSAL_LIST + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      setIsLoading(true);
      const url = API.DELETE_PROPOSAL + id;
      const data: any = await GET(url, null);
      fetchProposals();
      if (data.status) {
        notification.success({ message: "Item Deleted Successfully" });
      } else {
        notification.error({
          message: "something went wrong!! Please try again later",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.Proposals_List")}
        firstPathLink={location.pathname.replace("/create", "")}
        // buttonTxt={t("home_page.homepage.CREATE_pl")}
        // onSubmit={() => navigate("/usr/proposal/create")}
        title={t("home_page.homepage.Proposals_List")}
      >
        <div>
          <Button
            type="primary"
            onClick={() => navigate("/usr/proposal/create")}
          >
            + {t("home_page.homepage.add")}{' '}
            {t("home_page.homepage.Proposals_List")}
          </Button>
        </div>
      </PageHeader>

      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <DataTable
            columns={columns}
            list={data}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}

export default Proposal;
