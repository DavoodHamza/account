import moment from "moment";
const vatTemplate = ({
  User,
  vatSales,
  vatPurchase,
  totalSalesValue,
  totalPurchaseValue,
  currentDate,
  oneMonthAgoDate,
  personalData,
  toDate
}: any) => {
  const country101 = User?.companyInfo?.tax === "gst"
  const fDate = new Date(currentDate);
  const ldate = new Date(oneMonthAgoDate);
  const date = new Date(toDate)
  const value = (Number(totalSalesValue) - Number(totalPurchaseValue)).toFixed(2);
  const gst = (Number(totalSalesValue / 2) - Number(totalPurchaseValue / 2)).toFixed(2);
  const formattedCurrentDate = `${getOrdinalDay(
    fDate.getDate()
  )} ${getMonthName(fDate.getMonth())} ${fDate.getFullYear()}`;
  const formattedEndDate = `${getOrdinalDay(ldate.getDate())} ${getMonthName(
    ldate.getMonth()
  )} ${ldate.getFullYear()}`;

  function getOrdinalDay(day: any) {
    const suffixes = ["th", "st", "nd", "rd"];
    const relevantDigits = day < 30 ? day % 20 : day % 30;
    const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];
    return `${day}${suffix}`;
  }
  function getMonthName(month: any) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  }
  // let totalAmount;
  // let totalDebitSide = totalDebit;
  // let totalCreditSide = totalCredit;
  // if(openingBalance > 0){
  //   let total = Math.abs(openingBalance) + Number(totalCredit)
  //    totalAmount = Number(total) +  Number(totalCredit)
  //    totalCreditSide = Number(totalCredit) + Math.abs(openingBalance);

  // }else{
  //   let total = Math.abs(openingBalance) + Number(totalDebit)
  //    totalAmount = Number(total) +  Number(totalDebit)
  //    totalDebitSide =  Number(totalDebit) + Math.abs(openingBalance);
  // }

  try {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="x-apple-disable-message-reformatting" />
        <link
          href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i"
          rel="stylesheet"
        />
        <title>Tax GO Invoice</title>
      </head>
      <body style="width: 100%; align-content: center; margin: auto">
        <div style="margin: 20px">
          <table style="margin-top: 60px !important; margin: auto; width: 100%">
            <tbody>
              <tr
                style="
                  text-align: center;
                  font-size: 17px;
                  font-weight: bold;
                  text-transform: uppercase;
                  height:25px;
                "
              >
                <td colspan="3">  ${personalData?.bname || ""}</td>
              </tr>
              <tr
              style="
                text-align: center;
                font-size: 14px;
                height:25px;
              "
            >
              <td colspan="3">${personalData?.fulladdress || ""}</td>
            </tr>
              <tr
              style="
                text-align: center;
                font-size: 14px;
                height:25px;
              "
            >
              <td colspan="3">${User?.companyInfo?.tax === "gst" ?  "GSTIN/UIN" : "Vat Number"}:${personalData?.taxno}</td>
            </tr>
              <tr
              style="
                text-align: center;
                font-size: 14px;
                height:25px;
              "
            >
              <td colspan="3"><b>${User?.companyInfo?.tax === "gst" ? "GST Report" : "VAT Report"}</b></td>
            </tr>
      <tr
      style="
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase; " >
    </tr>
    <tr
    style="
      text-align: center;
      font-size: 14px;
    "
  >
  </tr> 
</tr>
<tr
style="
  text-align: center;
  font-size: 14px;
"
>
</tr>
    </tbody>
          </table>
        <div style="text-align: center; margin-top: 10px"> <span>${formattedCurrentDate}</span></div>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
          <tr style="background: white;color: black;text-align: center;font-size: 20px;margin:10px;">
                  <td style="height: 50px;" width="20%"><b>
                          ${User?.companyInfo?.tax === "gst" ? "GST On Sales" : "VAT On Sales"}
                      </b></td>
              </tr>
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="30% margin-top:20px"><b>
                          Rate
                      </b></td>
                      ${country101 ? `
                      <td width="30%"><b> CGST
                      </b></td>
                       <td width="30%"><b> SGST
                      </b></td>` : "" }
                     
                  <td width="30%"><b>
                  Amount
                      </b></td>
              </tr>
              ${vatSales
                ?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                  ${
                    item?.percentage
                  }
                  </td>
                    ${country101 ? 
                    `<td>${item?.total/2}</td>
                    <td>${item?.total/2}</td>` : ''}
                  <td>
                    ${item?.total}
                  </td>
              </tr>
          `
                )
                .join("")}
                <tr style="font-size:20px:">
                <td>
                ${User?.companyInfo?.tax === "gst" ? "Total GST On Sales" : "Total VAT On Sales"}
                </td>
                ${country101 ? 
                  `<td>${totalSalesValue / 2}</td>
                  <td>${totalSalesValue / 2}`: ""}
                <td>
                ${totalSalesValue}
                </td>
                </tr>
          </tbody>
      </table>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
          <tr style="background: white;color: black;text-align: center;font-size: 20px; margin:10px">
                  <td style="height: 50px;" width="20%"><b>
                          ${User?.companyInfo?.tax === "gst" ? "GST On Purchase": "VAT On Purchase"}
                      </b></td>
              </tr>
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="30% margin-top:10px"><b>
                          Rate
                      </b></td>
                      ${country101 ? 
                        `<td width="30%"><b>CGST</b></td>
                        <td width="30%"><b>SGST</b></td>`:""}
                  <td width="30%"><b>
                  Amount
                      </b></td>
              </tr>
              ${vatPurchase
                ?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                  ${
                    item?.percentage
                  }
                  </td>
                  ${country101 ?`
                  <td>${item?.total/2}</td>
                  <td>${item?.total/2}</td>`:""}
                  <td>
                    ${item?.total}
                  </td>
              </tr>
          `
                )
                .join("")}
                <tr style="font-size:20px:">
                <td>
                ${country101 ? "Total GST On Purchase" :"Total VAT On Purchase"}
                </td>
                ${country101 ? 
                  `<td>${totalPurchaseValue / 2}</td>
                   <td> ${totalPurchaseValue / 2}</td>`:""}
                <td>
                ${totalPurchaseValue}
                </td>
                </tr>
          </tbody>
      </table>
      </table>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="background: white;color: black;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="30%"><b>
                          ${country101 ? "Overall GST" : "Overall VAT"}
                      </b></td>
                      ${country101 ?
                        ` <td width="30%"><b>${gst}</b></td>
                      <td width="30%"><b>${gst}</b></td>`:""}
                  <td width="30%"><b>
                  ${value}
                      </b></td>
              </tr>
          </tbody>
      </table>
        </div>
      </body>
    </html>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { vatTemplate };