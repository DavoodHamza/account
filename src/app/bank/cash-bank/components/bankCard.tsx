import "../styles.scss";
import { Button, Card, Tooltip } from "antd";
import { IoWalletOutline } from "react-icons/io5";
import { RiEditFill } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function BankCard({ bankDetails }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card className="bank-Card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="cardHead">
          <strong>{bankDetails.list.laccount}</strong>
          <span className="cardSubHead">
            (
            {bankDetails.list.laccount &&
            (bankDetails.list.laccount.toString().toLowerCase() === "current" ||
              bankDetails.list.laccount.toString().toLowerCase() === "cash")
              ? "default"
              : bankDetails.list.acctype}
            )
          </span>
        </div>
        <div>
          <Tooltip title="Edit Bank" placement="bottom">
            <Button
              onClick={() =>
                navigate(`/usr/cashBank/addbank/edit`, {
                  state: {
                    type: "2",
                    data: bankDetails,
                  },
                })
              }
            >
              <RiEditFill size={22} />
            </Button>
          </Tooltip>
          &nbsp;
          <Tooltip title="View Bank" placement="bottom">
            <Button
              onClick={() =>
                navigate(`/usr/cashBank/${bankDetails?.list?.id}/details`)
              }
            >
              <IoIosMore size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center text-end py-2">
        <div>
          <IoWalletOutline size={36} color="#18a762" />
        </div>
        <div className="pt-2">
          <span style={{ color: "#6c757d", fontWeight: 600, fontSize: "12px" }}>
            {t("home_page.homepage.Balance")}
          </span>
          <h2 style={{ fontWeight: 700, fontSize: "22px" }}>
            {Number(
              Number(bankDetails.openingBalance) ||
                Number(bankDetails.list.amount) ||
                0
            ).toFixed(2)}
          </h2>
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between">
          <span className="NormalText">
            {t("home_page.homepage.Opening_Balance")}:{" "}
            <strong>
              {Number(Number(bankDetails.list.opening) || 0).toFixed(2)}
            </strong>
          </span>
        </div>
      </div>
    </Card>
  );
}

export default BankCard;
