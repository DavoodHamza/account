import moment from "moment";

const PayrollTemplate = ({ user, invoiceData }: any) => {
  //   const fDate = new Date(currentDate);
  //   const ldate = new Date(oneMonthAgoDate);

  //   const formattedCurrentDate = `${getOrdinalDay(
  //     fDate.getDate()
  //   )} ${getMonthName(fDate?.getMonth())} ${fDate?.getFullYear()}`;
  //   const formattedEndDate = `${getOrdinalDay(ldate?.getDate())} ${getMonthName(
  //     ldate.getMonth()
  //   )} ${ldate.getFullYear()}`;

  //   function getOrdinalDay(day: any) {
  //     const suffixes = ["th", "st", "nd", "rd"];
  //     const relevantDigits = day < 30 ? day % 20 : day % 30;
  //     const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];
  //     return `${day}${suffix}`;
  //   }

  //   function getMonthName(month: any) {
  //     const months = [
  //       "Jan",
  //       "Feb",
  //       "Mar",
  //       "Apr",
  //       "May",
  //       "Jun",
  //       "Jul",
  //       "Aug",
  //       "Sep",
  //       "Oct",
  //       "Nov",
  //       "Dec",
  //     ];
  //     return months[month];
  //   }

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
              <td colspan="3">${user?.companyInfo?.address1 || ""},${
      user?.companyInfo?.address2 || ""
    }</td>
            </tr>
            <tr
            style="
              text-align: center;
              font-size: 14px;
            "
          >
            <td colspan="3"> VAT Number :  ${user?.companyInfo?.taxregno}</td>
          </tr> 

      <tr
      style="
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
      "
    >
      <td colspan="3">  </td>
    </tr>
    <tr
    style="
      text-align: center;
      font-size: 14px;
    "
  >
    <td colspan="3">  <span>Statement</span></td>
  </tr> 
  <tr
style="
  text-align: center;
  font-size: 14px;
"
>

<td colspan="3"></td>
</tr>

<tr
style="
  text-align: center;
  font-size: 14px;
"
>
<td colspan="3"> VAT Number : </td>
</tr>
            </tbody>
          </table>

        <div style="text-align: center; margin-top: 10px"> <span></span></div>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td style="height: 40px;" width="12%"><b>
                          Date
                      </b></td>
                  <td width="12%"><b>
                  Full Name
                      </b></td>
                  <td width="12%"><b>Email</b></td>

                  <td width="12%"><b>Phone</b></td>
                  <td width="12%"><b>Date Of Join</b></td>
                  <td width="12%"><b>Employee Group</b></td>
                  <td width="12%"><b>Salary Package</b></td>
              </tr>
              <tr style="font-size: 12px;">
              <td >
              </td>
                  <td>
                 <b>Opening Balance</b>
                  </td>
                  <td> 
                  </td>
                  <td>
                  <b>  </b>
                  </td>
                  <td>
                  <b></b>
                  </td>
                  
              </tr>
              ${invoiceData
                ?.map(
                  (item: any) => `
              <tr style="font-size: 12px;">
                  <td>
                      ${moment(item?.userdate).format("YYYY-MM-DD") || ""}
                  </td>
                  <td>
                  ${
                    item?.type === "Sales Invoice"
                      ? "Sales"
                      : item?.type === "Purchase Invoice"
                      ? "Purchase"
                      : item?.type === "Credit Notes"
                      ? "Sales Credit Note"
                      : item?.type === "Debit Notes"
                      ? "Purchase Debit Note"
                      : item?.type === "Journal"
                      ? item?.ledgerAccount.join(", ")
                      : item?.itemDetails?.laccount
                  }
                  </td>
                  <td>
                        ${item?.type === "Journal" ? "Journal" : item.type}
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
          <table style="margin-top: 10px !important;width: 100%;">
              <tbody style="text-align:center;">
  
                  <tr style="font-size: 12px;">
                      <td width="30%"></td>
                      <td width="30%"></td>
                      <td width="20%"><b> </b></td>
                      <td width="20%"><b>
                          </b></td>
                      <td width="20%"><b>
                          </b></td>
                      <td width="20%"><b>
                          </b></td>
                      <td width="20%"><b>
                          </b></td>
                  </tr>

              </tbody>
          </table>
          <div style="width: 35%; margin-left: auto;border-bottom:1px solid black"></div>
          <table style="width: 100%;margin-top: 10px !important;">
          <tbody style="text-align:center;">
          <tr style="font-size: 12px;">
          <td width="40%"></td>
          <td width="20%"><b>Closing Balance</b></td>
          <td width="20%"><b> 
          </b></td>
          <td width="20%"><b>
        

              </b></td>
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
export { PayrollTemplate };
