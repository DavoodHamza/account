import "./styles.scss";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Card } from "antd";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import BankCard from "./components/bankCard";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

function CashBank() {
  const { t } = useTranslation();
  const { canCreateBank, canUpdateBank, canDeleteBank } = useAccessControl();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user.id;
  const [bank, setBank] = useState<any>([]);
  const navigate = useNavigate();

  const fetchBankList = async () => {
    try {
      setIsLoading(true);
      let bank_list_url =
        API.GET_BANK_LIST + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(bank_list_url, null);

      let banklist = data?.bankList.filter(
        (item: any) => item.list.nominalcode !== "1200"
      );
      setBank(banklist);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankList();
  }, []);

  return (
    <div>
      <PageHeader
        firstPathLink={"/usr/bank"}
        firstPathText={t("home_page.homepage.Bank_Statement")}
        secondPathLink={"asse"}
        goback={-1}
        title={t("home_page.homepage.Bank_Statement")}
      />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Row>
            {bank?.map((item: any) => {
              return (
                <Col md={4} style={{ marginBottom: 20 }}>
                  <BankCard bankDetails={item} />
                </Col>
              );
            })}
            {canCreateBank() && (
              <Col md={2} style={{ marginBottom: 20 }}>
                <Card className="addBank-Card" style={{ height: "100%" }}>
                  <div
                    onClick={() =>
                      navigate(`/usr/cashBank/addbank/create`, {
                        state: { type: "1" },
                      })
                    }
                  >
                    <IoIosAddCircleOutline size={60} color="orange" />
                    <div>{t("home_page.homepage.ADD_BANK")}</div>
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

export default CashBank;
