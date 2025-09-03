import { Button, Card, Tooltip } from "antd";
import "../styles.scss";
import { IoWalletOutline } from "react-icons/io5";
import { RiEditFill } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { useTranslation } from "react-i18next";

function CashCard({ bankDetails, countryCode, navigate, edit, canUpdateCash, canViewCash }: any) {
  const { t } = useTranslation();
  // useEffect(() => {
  //   fetchData();
  // }, []);
  // const fetchData = async (val?: any) => {
  //   try {
  //     const translatedBankName: any = await translateText(val);
  //     setBankName(translatedBankName);
  //     return translatedBankName
  //   } catch (error) {
  //     console.error("Error translating bank name:", error);
  //   }
  // };

  return (
    <Card className="bank-Card" style={{marginLeft:"15px"}}>
      <div>
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
                (bankDetails?.list?.laccount.toString().toLowerCase() ===
                  "current" ||
                  bankDetails?.list?.laccount?.toString().toLowerCase() === "cash")
                ? "default"
                : bankDetails?.list?.acctype}
              )
            </span>
          </div>
          <div>
            {" "}
            {canUpdateCash() && (
              <Tooltip
                arrow={false}
                title="Edit Bank"
                placement="bottom"
                overlayInnerStyle={{ fontSize: "10px" }}
              >
                <Button onClick={() => edit()} >
                  <RiEditFill size={22} />
                </Button>
              </Tooltip>
            )}{' '}
            {canViewCash() && (
              <Tooltip
                arrow={false}
                title="View Cash"
                placement="bottom"
                overlayInnerStyle={{ fontSize: "10px" }}
              >
                <Button
                  onClick={() => navigate()}
                >
                  <IoIosMore size={20} />
                </Button>
              </Tooltip>
            )}
          </div>
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
            {Number(bankDetails?.openingBalance)  ||
              Number(bankDetails?.list?.amount) ||
              0}
          </h2>
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-between">
          <span className="NormalText">{t("home_page.homepage.Opening_Balance")}:</span>
          <strong className="">{Number(bankDetails?.list?.opening) || 0}</strong>
        </div>
      </div>
    </Card>
  );
}

export default CashCard;
