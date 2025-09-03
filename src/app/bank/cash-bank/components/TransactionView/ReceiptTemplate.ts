import moment from "moment";
import API from "../../../../../config/api";
import { numberToWords } from "../../../../../utils/helpers";

const TemplateReceipts = ({ user, legerDetails }: any) => {
  const ledgerDetail = legerDetails[0];
  const paidMethod = ledgerDetail?.paidmethod || "";
  try {
    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1-transitional.dtd">
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receipt</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMH7dJd8VTP7hB+O7s5t3eKfBvb86A8c7t5Kt5a" crossorigin="anonymous">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
              }
              .receipt-table {
                  width: 700px;
                  border: 1px solid #ddd;
                  padding: 20px;
                  margin: 0 auto;
                  background-color: #fff;
              }
              .header, .footer {
                  width: 100%;
                  margin-bottom: 20px;
              }
              .header {
                  border-bottom: 2px solid #FFB14A;
                  padding-bottom: 10px;
              }
              .header .logo img {
                  width: 140px;
                  height: 80px;
              }
              .header .title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #0066B3;
                  text-align: center;
                  vertical-align: middle;
              }
              .header .receipt-no-date {
                  text-align: right;
                  vertical-align: middle;
              }
              .details-table, .payment-methods-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              .details-table td, .payment-methods-table td {
                  padding: 10px;
              }
              .details-table .label-cell {
                  width: 30%;
                  font-weight: bold;
                  padding-right: 10px;
                  vertical-align: top;
              }
              .details-table .value-cell {
                  width: 70%;
                  padding-left: 10px;
                  font-weight: bold;
                  border-bottom: 1px dashed grey;
                  vertical-align: top;
              }
              .payment-methods-table td {
                  padding: 5px;
              }
              .footer .authorized-signature {
                  text-align: right;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <table class="receipt-table">
              <tr>
                <td>
                  <table class="header">
                    <tr>
                      <td class="logo"><img src="${API.FILE_PATH}logo/${user?.companyInfo?.logo}" /></td>
                      <td class="title">${ledgerDetail?.type}</td>
                      <td class="receipt-no-date">
                          <span>Receipt No: ${ledgerDetail?.reference || ""}</span><br/>
                          <span>Date: ${moment(ledgerDetail?.userdate || ledgerDetail?.sdate).format("DD-MM-YYYY")}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table class="details-table">
                    <tr>
                      <td class="label-cell">From:</td>
                      <td class="value-cell">${ledgerDetail?.name || "&nbsp;"}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">Amount:</td>
                      <td class="value-cell">${ledgerDetail?.paidAmount || "&nbsp;"}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">Words:</td>
                      <td class="value-cell">${numberToWords(ledgerDetail?.paidAmount) || "&nbsp;"} ${user?.companyInfo?.countryInfo?.currency || "&nbsp;"}</td>
                    </tr>
                    <tr>
                      <td class="label-cell">Bank/Cash:</td>
                      <td class="value-cell">${ledgerDetail?.ledgername || "&nbsp;"}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${ledgerDetail?.ledgername !== 'Cash' ? `
                <tr>
                  <td>
                    <table class="payment-methods-table">
                    <tr>
                      <td><label><input type="checkbox" ${paidMethod === "Electronic" ? "checked" : ""}> Electronic</label></td>
                      <td><label><input type="checkbox" ${paidMethod === "Cheque" ? "checked" : ""}> Cheque</label></td>
                    </tr>
                    <tr>
                      <td><label><input type="checkbox" ${paidMethod === "Debit Card" ? "checked" : ""}> Debit Card</label></td>
                      <td><label><input type="checkbox" ${paidMethod === "Credit Card" ? "checked" : ""}> Credit Card</label></td>
                    </tr>
                    </table>
                  </td>
                </tr>` : ""}
              <tr>
                <td>
                  <table class="footer">
                    <tr>
                      <td class="authorized-signature">
                        ______________________________ <br>
                        Authorized Signature
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="font-size: 10px; text-align: center;">
                  <p>Created by <a href="https://www.taxgoglobal.com/">Taxgoglobal Limited</a></p>
                </td>
              </tr>
          </table>
      </body>
      </html>`;
  } catch (error) {
    console.log("err", error);
  }
};
export { TemplateReceipts };