import moment from "moment";

const profitLossTemplate = ({ user,User,profitLoss,personalData,currentDate}: any) => {

  const fDate = new Date(currentDate);
//   const ldate = new Date(oneMonthAgoDate)

  const formattedCurrentDate = `${getOrdinalDay(fDate.getDate())} ${getMonthName(fDate.getMonth())} ${fDate.getFullYear()}`;
//   const formattedEndDate = `${getOrdinalDay(ldate.getDate())} ${getMonthName(ldate.getMonth())} ${ldate.getFullYear()}`;

  function getOrdinalDay(day:any) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = (day < 30) ? day % 20 : day % 30;
    const suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return `${day}${suffix}`;
}

function getMonthName(month:any) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
}
let totalAmount;
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
          <td colspan="3">${User?.companyInfo?.tax === "gst" ?  "GSTIN/UIN" :"Vat Number"}::${personalData?.taxno}</td>
        </tr>
          <tr
          style="
            text-align: center;
            font-size: 14px;
            height:25px;
          "
        >
          <td colspan="3"><b>Profit & Loss Report</b></td>
        </tr>


  <tr
  style="
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  "
>
  
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
        <table table style="margin-top: 10px !important;margin: auto;width: 100%;">
        <tbody style="text-align: center;">
        <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
        <td style="height: 40px;" width="12%">
        Particular
        </td>
        <td style="height: 40px;" width="12%">
        Amount
        </td>
        <td style="height: 40px;" width="12%">
        Particular
        </td>
        <td style="height: 40px;" width="12%">
        Amount
        </td>
        </tr>
        <tr>
        <td><center>Opening Stock</center></td>
        <td><center>${Number(profitLoss?.openingStocks).toFixed(2) || 0.0}</center></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td>Purchase</td>
        <td>${Number(profitLoss?.values?.purchaseTotal).toFixed(2) || 0.0}</td>
        <td>Sales</td>
        <td>${Number(profitLoss?.values?.salesTotal).toFixed(2) || 0.0}</td>
        </tr>
        <tr>
        <td>Purchase Return</td>
        <td>${Number(profitLoss?.values?.purchaseDebitTotal).toFixed(2) || 0.0}</td>
        <td>Sales Return</td>
        <td>${Number(profitLoss?.values?.salesCreditTotal).toFixed(2) || 0.0}</td>
        </tr>
        <tr>
        <td><center>Actual Purchase</center></td>
        <td> <center>${profitLoss?.values?.activePurchase || 0.0}</center></td>
        <td><center>Actual Sales</center></td>
        <td><center>${profitLoss?.values?.activeSales || 0.0}</center></td>
        <tr>
        <tr>
        <td></td>
        <td></td>
        <td><center>Closing Stock</center></td>
        <td><center>${Number(Math.abs(profitLoss?.closingStocks)).toFixed(2) || 0.0}</center></td>
        </tr>
        <tr>
        <td><center> ${profitLoss?.directexpenses?.length !== 0 ? ('Direct Expenses'):('')}</center></td>
        <td><center></center></td>
        <td><center> ${profitLoss?.directexpenses?.length !== 0 ? ('Direct Expenses'):('')}</center></td>
        <td><center></center></td>
        </tr>
        <tr>
        <td><center>
        ${
          profitLoss?.directexpenses &&
            profitLoss?.directexpenses
              ?.filter(
                (item: any) =>
                  item.ledger !== "Cost of Sales-goods" &&
                  item.ledger !== "Purchase Return"
              )
              .map((item: any) => (
                 item?.ledger
              ))
        }
        </center></td>
        <td><center>
        ${
          profitLoss?.directexpenses &&
            profitLoss?.directexpenses
              ?.filter(
                (item: any) =>
                  item.ledger !== "Cost of Sales-goods" &&
                  item.ledger !== "Purchase Return"
              )
              .map((item: any) => (
                Number(item?.amount).toFixed(2)
              ))
        }
        </center></td>
        <td><center>
        ${
          profitLoss?.directIncome &&
            profitLoss?.directIncome.map((item: any) => (
               item?.ledger 
            ))
        }
        </center></td>
        <td><center>
        ${
          profitLoss?.directIncome &&
            profitLoss?.directIncome.map((item: any) => (
                Number(item?.amount).toFixed(2)))
        }
        </center></td>
        </tr>
        <tr>
        <td><center>
        ${profitLoss?.values?.grossCD <= 0 ? (
          'Gross Profit c/d'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD <= 0 ? (
          Math.abs(profitLoss?.values?.grossCD)
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD > 0 ? (
          'Gross Loss c/d'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD > 0 ? (
          profitLoss?.values?.grossCD
        ):('')}
        </center></td>
        </tr>
        <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
        <td><center>Total</center></td>
        <td><center>${profitLoss?.values?.debitSideTotal || 0}</center></td>
        <td><center>Total</center></td>
        <td><center>${profitLoss?.values?.creditSideTotal || 0}</center></td>
        </tr>
        <br/>
        <tr>
        <td><center>
        ${profitLoss?.values?.grossCD > 0 ? (
          'Gross Profit b/d'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD > 0 ? (
          profitLoss?.values?.grossCD
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD <= 0 ? (
          'Gross Loss b/d'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.grossCD <= 0 ? (
          Math.abs(profitLoss?.values?.grossCD)
        ):('')}
        </center></td>
        </tr>
        <tr>
        <td><center>
        ${profitLoss?.indirectExpenseList?.length !== 0 ? (
          'Indirect Expense'
        ):('')}
        </center></td>
        <td><center></center></td>
        <td><center>
        ${profitLoss?.indirectIncomeList?.length !== 0 ? (
          'Indirect Income'
        ):('')}
        </center></td>
        <td><center></center></td>
        </tr>
        <tr>
        <td><center>
        ${profitLoss?.indirectExpenseList &&
          profitLoss?.indirectExpenseList
            ?.filter(
              (item: any) =>
                item.ledger !== "Purchase Return" &&
                item.ledger !== "Cost of Sales-goods"
            )
            ?.map((item: any) => {
              return(
                   item?.ledger
              )
            })}
        </center></td>
        <td><center>
        ${profitLoss?.indirectExpenseList &&
          profitLoss?.indirectExpenseList
            ?.filter(
              (item: any) =>
                item.ledger !== "Purchase Return" &&
                item.ledger !== "Cost of Sales-goods"
            )
            ?.map((item: any) => {
              return(
              Number(item?.amount).toFixed(2))
            })}
        </center></td>
        <td><center>
        ${profitLoss?.indirectIncomeList &&
          profitLoss?.indirectIncomeList?.map((item: any) => {
              return(
             item?.ledger)
          })}
        </center></td>
        <td><center>
        ${profitLoss?.indirectIncomeList &&
          profitLoss?.indirectIncomeList?.map((item: any) => {
              return(
            Number(item?.amount).toFixed(2))
          })}
        </center></td>
        </tr>
        <tr>
        <td><center>
        ${profitLoss?.values?.netProfit <= 0 ? (
          'Net Profit'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.netProfit <= 0 ? (
          Math.abs(profitLoss?.values?.netProfit) || 0.0
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.netProfit > 0 ? (
          'Net Loss'
        ):('')}
        </center></td>
        <td><center>
        ${profitLoss?.values?.netProfit > 0 ? (
          Math.abs(profitLoss?.values?.netProfit) || 0.0
        ):('')}
        </center></td>
        </tr>
        <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
        <td><center>Total</center></td>
        <td><center>${profitLoss.values.grandLeftTotal}</center></td>
        <td><center>Total</center></td>
        <td><center> ${profitLoss.values.grandRightTotal}</center></td>
        </tr>
        </tbody>
        </table>
      </body>
    </html>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { profitLossTemplate };
