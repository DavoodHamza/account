import { useState } from "react";
import { Table } from "react-bootstrap";
import { IoExpand } from "react-icons/io5";
import { IoContract } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Sheet = (props: any) => {
  const [listBank, setlistBanks] = useState(false);
  const [expand, setExpand] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  let profit = Number(props.profitLoss.values.netProfit) * -1;

  let liabilities = Number(props?.data?.totalLabilities) + profit;
  let assets = Number(props?.data?.totalAssets);
  let stockValue =
    Number(props?.data?.stock) - Number(props?.data.vatRecivable);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="report-text">{t("home_page.homepage.BALANCESHEET_AS_ON")} {props?.toDate}</div>

        {expand ? (
          <IoExpand
            size={20}
            onClick={() => setExpand(!expand)}
            cursor={"pointer"}
          />
        ) : (
          <IoContract
            size={20}
            onClick={() => setExpand(!expand)}
            cursor={"pointer"}
          />
        )}
      </div>
      <br />
      <Table bordered responsive={true} style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>
              {t("home_page.homepage.LIABILITY")}
            </th>
            <th
              style={{ width: 160, backgroundColor: "#feefc3", fontSize: 16 }}
            >
              {t("home_page.homepage.AMOUNT")} ( {props?.user?.companyInfo?.countryInfo?.symbol} )
            </th>
            <th style={{ backgroundColor: "#feefc3", fontSize: 16 }}>{t("home_page.homepage.ASSETS")}</th>
            <th
              style={{ width: 160, backgroundColor: "#feefc3", fontSize: 16 }}
            >
              {t("home_page.homepage.AMOUNT")} ( {props?.user?.companyInfo?.countryInfo?.symbol} )
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor:
                  !expand || (!props?.data?.currentLiability?.length && expand)
                    ? ""
                    : "#f2f2f2",
                fontWeight: "900",
              }}
              colSpan={
                !expand || (!props?.data?.currentLiability?.length && expand)
                  ? 1
                  : 2
              }
            >
              {t("home_page.homepage.CURRENT_LIABILITIES")}
            </td>
            {!expand || (!props?.data?.currentLiability?.length && expand) ? (
              <td style={{ fontWeight: "900" }} colSpan={1}>
                {(props?.data?.currentLiability?.length &&
                  !expand &&
                  props?.data?.currentLiability
                    .reduce(
                      (acc: any, sum: any) => acc + Number(sum?.balance),
                      0
                    )
                    .toFixed(2)) ||
                  null}
              </td>
            ) : null}
            <td
              style={{
                backgroundColor:
                  !expand || (!props?.data?.currentAsset?.length && expand)
                    ? ""
                    : "#f2f2f2",
                fontWeight: "900",
              }}
              colSpan={
                !expand || (!props?.data?.currentAsset?.length && expand)
                  ? 1
                  : 2
              }
            >
              {t("home_page.homepage.CURRENT_ASSETS")}
            </td>
            {!expand || (!props?.data?.currentAsset?.length && expand) ? (
              <td style={{ fontWeight: "900" }} colSpan={1}>
                {props?.data?.currentAsset?.length ||
                props?.data?.bankSum ||
                props?.data?.cashinHand ||
                (props?.data.stockWIthVatRecivable && !expand)
                  ? // Calculate the total value if the conditions are met
                    (
                      props?.data?.currentAsset.reduce(
                        (acc: any, sum: any) => acc + Number(sum?.balance),
                        0
                      ) +
                      Number(props?.data?.bankSum) +
                      Number(props?.data?.cashinHand) +
                      Number(props?.data.stockWIthVatRecivable)
                    ).toFixed(2)
                  : null}
              </td>
            ) : null}
          </tr>
          {expand &&
          (props?.data?.currentLiability?.length ||
            props?.data?.currentAsset?.length) ? (
            <tr>
              <td colSpan={2}>
                {props?.data?.currentLiability?.length ? (
                  <Table bordered responsive={true}>
                    <tbody>
                      {props?.data?.currentLiability?.map((labelity: any) => {
                        // if (labelity.balance <= 0) {
                        //   return null;
                        // } else {
                        return (
                          <tr>
                            <td>
                              {labelity["ledgerDetails.laccount"].toUpperCase()}
                            </td>
                            <td style={{ width: 150 }}>
                              {Number(labelity?.balance).toFixed(2)}
                            </td>
                          </tr>
                        );
                        // }
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </td>
              <td
                colSpan={2}
                rowSpan={props?.data?.futureLiability?.length ? 2 : undefined}
              >
                <Table bordered responsive={true}>
                  <tbody>
                    {props.data.currentAsset
                      ?.sort((a: any, b: any) => b.balance - a.balance)
                      .map((Asset: any) => {
                        // if (Asset.balance <= 0) {
                        //   return null;
                        // } else {
                        return (
                          <tr>
                            <td>{Asset?.laccount}</td>
                            <td style={{ width: 150 }}>
                              {Number(Asset?.balance).toFixed(2)}
                            </td>
                          </tr>
                        );
                        // }
                      })}

                    {listBank ? (
                      <>
                        <div
                          style={{
                            fontSize: 16,
                            borderWidth: 0,
                            paddingLeft: 10,
                          }}
                        >
                          {t("home_page.homepage.BANKS")}
                        </div>
                        {props?.data?.bank?.map((element: any) => (
                          <tr>
                            <td>{element.laccount}</td>
                            <td style={{ width: 150 }}>
                              {Number(element.balance).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <br />
                      </>
                    ) : (
                      <tr
                        onClick={() => {
                          if (props?.data?.bank?.length) setlistBanks(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{t("home_page.homepage.BANKS")}</td>
                        <td style={{ width: 150 }}>
                          {Number(props?.data?.bankSum).toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {Number(props?.data?.cashinHand) > 0 ? (
                      <tr>
                        <td>{t("home_page.homepage.CASHINHAND")}</td>
                        <td style={{ width: 150 }}>
                          {Number(props?.data?.cashinHand).toFixed(2)}
                        </td>
                      </tr>
                    ) : null}

                    <tr>
                      <td>{t("home_page.homepage.STOCK")}</td>
                      <td style={{ width: 150 }}>
                        {Number(props?.data.stockWIthVatRecivable).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </td>
            </tr>
          ) : null}

          <tr>
            {user?.companyInfo?.tax === "gst" ? (
            <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GSTPAYABLE")}</td>
             ):(
              <td style={{ fontWeight: "900" }}>{t("home_page.homepage.VATPAYABLE")}</td>
             )}
            <td style={{ fontWeight: "900" }}>
              {Number(props?.data.vatPayble) > 0
                ? Number(props?.data.vatPayble).toFixed(2)
                : 0}
            </td>
            {user?.companyInfo?.tax === "gst" ?(
            <td style={{ fontWeight: "900" }}>{t("home_page.homepage.GSTRECEIVABLE")}</td>
          ):(
            <td style={{ fontWeight: "900" }}>{t("home_page.homepage.VATRECEIVABLE")}</td>
          )}
            <td style={{ fontWeight: "900" }}>
              {Number(props?.data.vatRecivable) > 0
                ? Number(props?.data.vatRecivable).toFixed(2)
                : 0}
            </td>
          </tr>
          <tr>
            <td
              style={{
                backgroundColor:
                  !props?.data?.futureLiability?.length ||
                  (!props?.data?.futureLiability?.length && expand)
                    ? ""
                    : "#f2f2f2",
                fontWeight: "900",
              }}
              colSpan={1}
            >
              {t("home_page.homepage.FUTURELIABILITY")}
            </td>
            {!expand || (!props?.data?.futureLiability?.length && expand) ? (
              <td>
                {(props?.data?.futureLiability?.length &&
                  !expand &&
                  props?.data?.futureLiability.reduce(
                    (acc: any, sum: any) => acc + Number(sum?.sum),
                    0
                  )) ||
                (!props?.data?.futureLiability?.length && expand)
                  ? 0
                  : 0}
              </td>
            ) : null}
            <td style={{ fontWeight: "900" }} colSpan={1}>
              {t("home_page.homepage.FUTUREASSETS")}
            </td>
            {!expand || (!props?.data?.futureAsset?.length && expand) ? (
              <td style={{ fontWeight: "900" }} colSpan={1}>
                {(props?.data?.futureAsset?.length &&
                  !expand &&
                  props?.data?.futureAsset.reduce(
                    (acc: any, sum: any) => acc + Number(sum?.sum),
                    0
                  )) ||
                (!props?.data?.futureAsset?.length && !expand)
                  ? 0
                  : !props?.data?.futureLiability?.length && expand
                  ? 0
                  : 0}
              </td>
            ) : null}
          </tr>
          {expand &&
          (props?.data?.futureLiability?.length ||
            props?.data?.futureAsset?.length) ? (
            <tr>
              <td colSpan={2}>
                {props?.data?.futureLiability?.length ? (
                  <Table bordered responsive={true}>
                    <tbody>
                      {props?.data?.futureAsset?.map((labelity: any) => {
                        return (
                          <tr>
                            <td>
                              {labelity["ledgerDetails.laccount"].toUpperCase()}
                            </td>
                            <td style={{ width: 150 }}>
                              {Number(labelity?.balance).toFixed(2)}
                            </td>
                          </tr>
                        );
                        // }
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </td>
              <td colSpan={2}>
                {true ? (
                  <Table bordered responsive={true}>
                    <tbody>
                      {[
                        { balance: 500, "ledgerDetails.laccount": "ttttt" },
                        { balance: 500, "ledgerDetails.laccount": "ttttt" },
                      ]?.map((labelity: any) => {
                        return (
                          <tr>
                            <td>
                              {labelity["ledgerDetails.laccount"].toUpperCase()}
                            </td>
                            <td style={{ width: 150 }}>
                              {Number(labelity?.balance).toFixed(2)}
                            </td>
                          </tr>
                        );
                        // }
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </td>
            </tr>
          ) : null}
          <tr>
            <td
              style={{
                backgroundColor:
                  !expand || (!props?.data?.datacapital?.length && expand)
                    ? ""
                    : "#f2f2f2",
                fontWeight: "900",
              }}
              colSpan={
                !expand || (!props?.data?.datacapital?.length && expand) ? 1 : 2
              }
            >
              {t("home_page.homepage.CAPITAL")}
            </td>
            {!expand || (!props?.data?.datacapital?.length && expand) ? (
              <td style={{ fontWeight: "900" }}>
                {props?.data?.datacapital?.length && !expand
                  ? (props?.data?.capital).toFixed(2)
                  : 0}
              </td>
            ) : null}
            <td
              style={{
                backgroundColor:
                  !expand || (!props?.data?.fixedAssets?.length && expand)
                    ? ""
                    : "#f2f2f2",
                fontWeight: "900",
              }}
              colSpan={
                !expand || (!props?.data?.fixedAssets?.length && expand) ? 1 : 2
              }
            >
              {t("home_page.homepage.FIXEDASSETS")}
            </td>
            {!expand || (!props?.data?.fixedAssets?.length && expand) ? (
              <td style={{ fontWeight: "900" }}>
                {props?.data?.fixedAssets?.length && !expand
                  ? props?.data?.totalFixedAssets
                  : 0 || (!props?.data?.fixedAssets?.length && expand)
                  ? 0
                  : 0
                  //76867
                  }
              </td>
            ) : null}
          </tr>
          {expand &&
          (props?.data?.fixedAssets?.length ||
            props?.data?.datacapital?.length) ? (
            <tr>
              <td colSpan={2}>
                {props?.data?.datacapital?.length ? (
                  <Table bordered responsive={true} style={{ marginBottom: 0 }}>
                    <tbody>
                      {props?.data?.datacapital?.map((fixo: any) => {
                        return (
                          <tr>
                            <td>{fixo["ledgerDetails.laccount"]}</td>
                            <td style={{ width: 150 }}>
                              {Number(fixo?.balance).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </td>
              <td colSpan={2}>
                {props?.data?.fixedAssets?.length ? (
                  <Table bordered responsive={true} style={{ marginBottom: 0 }}>
                    <tbody>
                      {props?.data?.fixedAssets?.map((fixo: any) => {
                        return (
                          <tr>
                            <td>{fixo["ledgerDetails.laccount"]}</td>
                            <td style={{ width: 150 }}>
                              {Number(fixo?.sum).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : null}
              </td>
            </tr>
          ) : null}
          <tr>
            <td style={{ fontWeight: "900" }} colSpan={1}>
             {t("home_page.homepage.ProfitAndLoss")} 
            </td>
            <td style={{ fontWeight: "900" }} colSpan={1}>
              {profit}
            </td>
            <td style={{ fontWeight: "900" }} colSpan={2}></td>
          </tr>

          <tr>
            <th style={{ backgroundColor: "#f2f2f2", fontWeight: "900" }}>
              {t("home_page.homepage.TOTALLIABILITIES")}
            </th>
            <th style={{ backgroundColor: "#f2f2f2", fontWeight: "900" }}>
              {Number(liabilities).toFixed(2)}
            </th>
            <th style={{ backgroundColor: "#f2f2f2", fontWeight: "900" }}>
              {t("home_page.homepage.TOTALASSETS")}
            </th>
            <th style={{ backgroundColor: "#f2f2f2", fontWeight: "900" }}>
              {Number(assets).toFixed(2)}
            </th>
          </tr>
        </tbody>
      </Table>
      <br />
      {/* <div>The accompaying notes are an integral part of this statement.</div> */}
    </div>
  );
};

export default Sheet;
