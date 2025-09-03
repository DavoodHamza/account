import moment from "moment";
const  HSNReportTemplate = ({
  personalData,
  ReportData
}: any) => {
  const country101 = personalData?.country;
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
              <td colspan="3">${country101 ? "GSTIN/UIN" : "Vat Number"}:${personalData?.taxno}</td>
            </tr>
              <tr
              style="
                text-align: center;
                font-size: 14px;
                height:25px;
              "
            >
              <td colspan="3"><b>HSN/SAC Report</b></td>
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
        <div style="text-align: center; margin-top: 10px"> <span></span></div>
          <table style="margin-top: 10px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
              <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                  <td><b>HSN/SAC</b></td>
                  <td><b>Description</b></td>
              </tr>
              ${ReportData.map((item:any) =>`
              <tr>
              <td>${item?.hsn_code}</td>
              <td>${item?.description}</td>
              </tr>`
            )}
          </tbody>
      </table>
      </table>
        </div>
      </body>
    </html>
    <hr>
    `;
  } catch (error) {
    console.log("err", error);
  }
};
export { HSNReportTemplate };