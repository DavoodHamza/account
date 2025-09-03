import moment from "moment";

const journalTemplate = ({
  pagetype,
  user,
  customer,
  sale,
  personalData,
}: any) => {
  try {
    return `<!DOCTYPE html
      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="date=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="x-apple-disable-message-reformatting" />
      <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i" rel="stylesheet" />
      <title>Tax GO Invoice</title>
  </head>
  
  <body style="width: 100%;align-content: center;margin: auto;">
      <div style="margin:10px;">
          <table style="margin-top: 20px !important;margin: auto;width: 100%;">
          <tbody>
          <tr style="text-align: center;
          font-size: 15px;
          font-weight: 700;
          text-align:'center';
          text-transform: uppercase;
          text-decoration: underline;">
          <td colspan="3" >${pagetype ? pagetype : "Journal Reciept"}</td>
          <br/>
          </tr>
              <tr>
              <td> Date: ${moment(personalData?.userdate).format("DD/MM/YYYY")}<td>
              </tr>
              <tr>
              <td>Reference: ${personalData?.reference || ""}<td>
              </tr>
              <tr>
              <td>Description:  ${personalData?.description || ""}<td>
              </tr>
              <tr>
              <td>Amount:  ${personalData?.total || ""}</td>
              </tr>
            </tr>
              <hr>
          </tbody>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;">
          <tbody style="text-align: center;">
          <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
              <th>Ledger</th>
              <th>Details</th>
              <th>Debit</th>
              <th>Credit</th>
          </tr> 
          ${personalData.column
            .map(
              (item: any) => `
          <tr style="font-size: 12px;">
              <td>
              ${ item?.bus_name || item?.ledgerDetails?.laccount}
              </td>
              <td>
                   ${item?.details || ""}
              </td>
              <td>
                  ${item?.debit}
              </td>                 
              <td>
                  ${item?.credit}
              </td>                 
          </tr>`
            )
            .join("")}
      </tbody>
      </table>

          <hr>
      </div>
  </body>
  </html>`;
  } catch (error) {
    console.log("err", error);
  }
};

export { journalTemplate };
