import moment from "moment";
import { numberToWords } from "../../../utils/helpers";

const stockSummaryTemplate = ({
  user,
  personalData,
  stockSummary,
  totalValue,
  totalQuantity,
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
      <div style="margin: 20px;">
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
        <td colspan="3"><b>Stock Summary Report </b></td>
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
          <hr>
          <table style="margin: auto;width: 100%;">
              <tbody>
              
                  <tr>
                      
                      <td width="25%">
  
                         
                      </td>
                      
                      <td width="25%">
  
                          
                      </td>
                  </tr>
                  <tr>
                      
                      <td width="25%">
  
                          
  
                      </td>
                     
                      <td>
                         
  
                      </td>
                  </tr>
                  <tr>
                     
                      <td>
                          
                      </td>
                      
                      <td>
                          
  
                      </td>
                  </tr>
                  <tr>
                      
                      <td>
                          
  
                      </td>
                      
                      <td></td>
                  </tr>
              </tbody>
          </table>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                      <td style="height: 40px;" width="12%"><b>
                              PARTICULARS
                          </b></td>
                      <td width="12%"><b>
                              PRODUCT CATEGORY
                          </b></td>
                      <td width="12%"><b>QUANTITY</b></td>
                      <td width="12%"><b>RATE</b></td>
                      <td width="12%"><b>VALUE</b></td>
                  </tr>
                  ${stockSummary
                    .map(
                      (product: any) => `
                  <tr style="font-size: 12px;">
                      <td>
                          ${product.idescription}
                      </td>
                      <td>
                          ${product.itemtype}
                      </td>
                      <td>
                          ${product.quantity}
                      </td>
                      <td>
                          ${product.rate.toFixed(2)}
                      </td>
                      <td>
                          ${product.value.toFixed(2) || 0}
                      </td>
                  </tr>
              `
                    )
                    .join("")}

                    <tr style="font-size: 16px; height:50px;">
                      <td>
                      <b>
                          GRAND TOTAL</b>
                      </td>
                      <td>
                         
                      </td>
                      <td>
                      <b>${Number(totalQuantity).toFixed(2)}</b>
                          
                      </td>
                      <td>
                         
                      </td>
                      <td>
                      <b>
                          ${Number(totalValue).toFixed(2)}</b>
                      </td>
                  </tr>
              </tbody>
          </table>
          
      </div>
  </body>
  </html>`;
  } catch (error) {
    console.log("err", error);
  }
};

export { stockSummaryTemplate };
