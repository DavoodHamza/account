const trialBalanceTemplate = ({
  user,
  data,
  currentDate,
  oneMonthAgoDate,
  datas,
  personalData,
}: any) => {
  const fDate = new Date(currentDate);
  // const ldate = new Date(oneMonthAgoDate)

  const formattedCurrentDate = `${getOrdinalDay(
    fDate.getDate()
  )} ${getMonthName(fDate.getMonth())} ${fDate.getFullYear()}`;
  // const formattedEndDate = `${getOrdinalDay(ldate.getDate())} ${getMonthName(ldate.getMonth())} ${ldate.getFullYear()}`;

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
              <td colspan="3">${
               user?.companyInfo?.tax === "gst" ? "GSTIN/UIN" : "VAT Number"
              }:${personalData?.taxno}</td>
            </tr>
              <tr
              style="
                text-align: center;
                font-size: 14px;
                height:25px;
              "
            >
              <td colspan="3"><b>Trail Balance Report</b></td>
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
                          Nominal Code
                      </b></td>
                  <td width="12%"><b>
                  Name
                      </b></td>

                  <td width="12%"><b>Debit</b></td>
                  <td width="12%"><b>Credit</b></td>
              </tr>

              ${data
                ?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                  ${item.nominalcode}
                  </td>
                  <td>
                  ${item?.laccount}
                  </td>
                  <td>
                      ${Math.abs(item.debit)}
                  </td>
                  <td>
                      ${Math.abs(item.credit) || ""}
                  </td>
                  
              </tr>
          `
                )
                .join("")}

          </tbody>
      </table>
      <hr>
          <table style="margin-top: 10px !important;width: 100%;">
              <tbody style="text-align:center;">
  
                  <tr style="font-size: 12px;">
                      <td width="30%"></td>
                      <td width="30%">Total Balance</td>
                      <td width="20%"><b> 
                      ${Math.abs(datas.debtotal) || ""}
                      </b></td>
                      <td width="20%"><b>
                ${Math.abs(datas.credtotal) || ""}
                          </b></td>
                  </tr>

              </tbody>
          </table>
         
      </tr>
      
      </tbody>
     

        </div>
      </body>
    </html>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { trialBalanceTemplate };
