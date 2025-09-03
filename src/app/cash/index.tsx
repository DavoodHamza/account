import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import PageHeader from "../../components/pageHeader";
import API from "../../config/api";
import { GET } from "../../utils/apiCalls";
import CashCard from "./component/cashCard";
import { useAccessControl } from "../../utils/accessControl";
import { Card } from "antd";
import { IoIosAddCircleOutline } from "react-icons/io";

function Cash() {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { canCreateCash, canUpdateCash, canDeleteCash, canViewCash } = useAccessControl();
  const [cash, setCash] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const navigate = useNavigate();

  const loadCash = async () => {
    setIsLoading(true);
    let URL = API.GET_CASH_LIST + user?.id +'/' + user?.companyInfo?.id;
    const { data }: any = await GET(URL, null);
    if (data) {
      setIsLoading(false);
      setCash(data.bankList);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCash();
  }, []);
  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/cash"}
        firstPathText={t("home_page.homepage.Cash_Statement")}
        secondPathLink={"/usr/cash"}
        goback={-1}
        title={t("home_page.homepage.Cash_Statement")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Row>
            {cash?.map((item: any) => {
              return (
                <Col md={8} style={{ marginBottom: "25px" }}>
                  <CashCard
                    bankDetails={item}
                    countryCode={user?.companyInfo?.countryInfo?.currencycode}
                    navigate={() => navigate(`cashTable/${item?.list?.id}`)}
                    edit={() => navigate(`addCash/${item?.list?.id}`)}
                    canUpdateCash={canUpdateCash}
                    canViewCash={canViewCash}
                  />
                </Col>
              );
            })}
            {canCreateCash() && (
              <Col md={4} style={{ marginBottom: "25px" }}>
                <Card className="addCash-Card" style={{ height: "100%" }}>
                  <div
                    onClick={() =>
                      navigate(`/usr/cash/addCash/create`, {
                        state: { type: "1" },
                      })
                    }
                  >
                    <IoIosAddCircleOutline size={60} color="orange" />
                    <div>{t("home_page.homepage.add")} {t("sidebar.title.cash")}</div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
          <br />
        </Container>
      )}
    </div>
  );
}

export default Cash;
