
const agedDebtorsTemplate  = ({ user,payList,personalData}: any) => {

  const fDate = new Date();
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
const totalPrice = payList.reduce((accumulator:any, currentValue:any) => {
    return accumulator + currentValue.totalPrice;
  }, 0);
const currentMonthTotal = payList.reduce((accumulator:any, currentValue:any) => {
    return accumulator + currentValue.currentMonthTotal;
  }, 0);
const lastTwoMonthsTotal = payList.reduce((accumulator:any, currentValue:any) => {
    return accumulator + currentValue.lastTwoMonthsTotal;
  }, 0);
const lastThreeMonthsTotal = payList.reduce((accumulator:any, currentValue:any) => {
    return accumulator + currentValue.lastThreeMonthsTotal;
  }, 0);
const lastFourMonthsTotal = payList.reduce((accumulator:any, currentValue:any) => {
    return accumulator + currentValue.lastFourMonthsTotal;
  }, 0);



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
          <td colspan="3">${user?.companyInfo?.tax === "gst" ? "GSTIN/UIN" :"VAT Number"}:${personalData?.taxno}</td>
        </tr>
          <tr
          style="
            text-align: center;
            font-size: 14px;
            height:25px;
          "
        >
          <td colspan="3"><b>Agred Debtors Report</b></td>
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
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="12%"><b>
                          Supplier
                      </b></td>
                  <td width="12%"><b>
                  O/S AMT
                      </b></td>
                  <td width="12%"><b>Current Month</b></td>

                  <td width="12%"><b>Previous Month</b></td>
                  <td width="12%"><b>Last 3 Months</b></td>
                  <td width="12%"><b>Last 4 Months</b></td>
              </tr>





              ${payList?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                      ${item?.customer_name}
                  </td>
                  <td>
                      ${item?.totalPrice}
                  </td>
                  <td>
                      ${item?.currentMonthTotal}
                  </td>
                  <td>
                      ${item?.lastTwoMonthsTotal}
                  </td>
                  <td>
                      ${item?.lastThreeMonthsTotal}
                  </td>
                  <td>
                      ${item?.lastFourMonthsTotal}
                  </td>
                  
                  
                  
              </tr>
          `
                )
                .join("")}

                <tr style="font-size: 12px;">
                <td >
                <b>Total</b>
                </td>
                <td >
                <b>${totalPrice.slice(totalPrice.startsWith('0') ? 1 : 0)}</b>
                </td>
                <td >
                <b>${currentMonthTotal.slice(currentMonthTotal.startsWith('0') ? 1 : 0)}</b>
                </td>
                <td >
                <b>${lastTwoMonthsTotal.slice(lastTwoMonthsTotal.startsWith('0') ? 1 : 0)}</b>
                </td>
                <td >
                <b>${lastThreeMonthsTotal.slice(lastThreeMonthsTotal.startsWith('0') ? 1 : 0)}</b>
                </td>
                <td >
                <b>${lastFourMonthsTotal.slice(lastFourMonthsTotal.startsWith('0') ? 1 : 0)}</b>
                </td>
                   
                    
                </tr>

          </tbody>
      </table>
      <hr>
          

        </div>
      </body>
    </html>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { agedDebtorsTemplate };
