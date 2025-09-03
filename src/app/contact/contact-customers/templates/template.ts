import moment from "moment";

const template1 = ({ user,personalData,invoiceData,totalDebit,totalCredit,totalClosing ,openingBalance,currentDate,firstDate,type}: any) => {

  const fDate = new Date(currentDate);
  const ldate = new Date(firstDate)

  const formattedCurrentDate = `${getOrdinalDay(fDate.getDate())} ${getMonthName(fDate.getMonth())} ${fDate.getFullYear()}`;
  const formattedEndDate = `${getOrdinalDay(ldate.getDate())} ${getMonthName(ldate.getMonth())} ${ldate.getFullYear()}`;

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
let totalDebitSide = totalDebit;
let totalCreditSide = totalCredit;
if(openingBalance > 0){
  let total = Math.abs(openingBalance) + Number(totalCredit)
   totalAmount = Number(total) +  Number(totalCredit)
   totalCreditSide = Number(totalCredit) + Math.abs(openingBalance);

}else{
  let total = Math.abs(openingBalance) + Number(totalDebit)
   totalAmount = Number(total) +  Number(totalDebit)
   totalDebitSide =  Number(totalDebit) + Math.abs(openingBalance);
}
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
                "
              >
                <td colspan="3">  ${user?.companyInfo?.bname || ""}</td>
              </tr>
             
              <tr
              style="
                text-align: center;
                font-size: 14px;
              "
            >
              <td colspan="3">${user?.companyInfo?.address1 || ""},${user?.companyInfo?.address2 || ""}</td>
            </tr>
            <tr
            style="
              text-align: center;
              font-size: 14px;
            "
          >
            <td colspan="3"> ${user?.companyInfo?.tax === "gst" ? "GSTIN/UIN" :"VAT Number"} :  ${user?.companyInfo?.taxno}</td>
          </tr> 

      <tr
      style="
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
      "
    >
      <td colspan="3">  ${personalData?.bus_name}</td>
    </tr>
    <tr
    style="
      text-align: center;
      font-size: 14px;
    "
  >
    <td colspan="3">  <span>${type} Statement</span></td>
  </tr> 
  <tr
style="
  text-align: center;
  font-size: 14px;
"
>

<td colspan="3">${personalData?.address}</td>
</tr>

<tr
style="
  text-align: center;
  font-size: 14px;
"
>
<td colspan="3"> ${user?.companyInfo?.tax === "gst" ? "GSTIN/UIN" :"VAT Number"} : ${personalData?.vat_number}</td>
</tr>
            </tbody>
          </table>
        <div style="text-align: center; margin-top: 10px"> <span>${formattedEndDate} - ${formattedCurrentDate}</span></div>
        <div style="text-align: right"> <span>Opening Balance:${openingBalance >= 0 ? Math.abs(openingBalance) : ''}${openingBalance < 0 ? Math.abs(openingBalance) : ''}</span></div>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="12%"><b>
                          Date
                      </b></td>
                  <td width="12%"><b>Invoice No</b></td>
                  <td width="12%"><b>Reference</b></td>
                  <td width="12%"><b>Voucher Type</b></td>
                  <td width="12%"><b>Particulars</b></td>
                  <td width="12%"><b>Debit</b></td>
                  <td width="12%"><b>Credit</b></td>
              </tr>
              ${invoiceData?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                      ${moment(item?.userdate).format('YYYY-MM-DD') || ""}
                  </td>
                  <td>${item?.invoiceno || ""}</td>
                  <td>${item?.reference || ""}</td>
                  <td>
                        ${item.type === "Journal"
                      ? "Journal"
                      : item.type ==="stockassets"
                    ? "Purchase For Asset" 
                  :item.type }
                  </td>
                  <td>
                  ${item?.type === "Sales Invoice"
                  ? "Sales"
                  : item?.type === "Purchase Invoice"
                  ? "Purchase"
                  : item?.type === "stockassets"
                  ? "Purchase For Asset"
                  : item?.type === "Credit Notes"
                  ? "Sales Credit Note"
                  : item?.type === "Debit Notes"
                  ? "Purchase Debit Note"
                  : item?.type === "Journal"
                  ? item?.ledgerAccount.join(', ') 
                  : item?.itemDetails?.laccount}
                  </td>
                  <td>
                      ${item.debit}
                  </td>
                  <td>
                      ${item.credit || ""}
                  </td>
              </tr>
          `
                )
                .join("")}
          </tbody>
      </table>
      <hr>
      <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="font-size: 15px;">
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%">Current Total</td>
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%">${parseFloat(totalDebit)}</td>
                  <td style="height: 10px;" width="10%">${parseFloat(totalCredit)}</td> 
              </tr>
              <tr style="font-size: 15px;">
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%"><center>Opening Balance</center></td>
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%">${openingBalance >= 0 ? Math.abs(openingBalance) : ''}</td>
                  <td style="height: 10px;" width="10%">${openingBalance < 0 ? Math.abs(openingBalance) : ''}</td> 
              </tr>
              <tr style="font-size: 15px;">
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%"><center>Closing Balance</center></td>
                  <td style="height: 10px;" width="10%"></td>
                  <td style="height: 10px;" width="10%">${totalClosing <= 0 ? Math.abs(totalClosing) : ''}</td>
                  <td style="height: 10px;" width="10%">${totalClosing > 0 ? Math.abs(totalClosing) :''}</td> 
              </tr>
          </tbody>
      </table>
      <hr>
      </body>
    </html>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { template1 };
