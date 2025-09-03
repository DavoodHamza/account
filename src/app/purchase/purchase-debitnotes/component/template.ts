import moment from "moment";
import API from "../../../../config/api";
import { numberToWords } from "../../../../utils/helpers";

const template1 = ({
  pagetype,
  user,
  customer,
  sale,
  productlist,
  vatTotal,
  netTotal,
  total,
  vatRate,
  selectedBank,
  bankList,
  isPaymentInfo,
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
          <table style="margin-top: 60px !important;margin: auto;width: 100%;">
              <tbody>
              <tr style="text-align: center;
              font-size: 15px;
              font-weight: 700;
              text-align:'center';
              text-transform: uppercase;
              text-decoration: underline;">
              <td colspan="6"><b style="margin-bottom:25px">${
                pagetype ? pagetype : "Receipt"
              }</b></td>
          </tr>
                  <tr>
                      <td><b>
                              ${user?.companyInfo?.bname || ""}
                          </b></td>
                      <td colspan="2"><b>
                              ${user?.companyInfo?.fulladdress || ""}
                          </b></td>
                      <td style="text-align: center" rowspan="6"><img style="width: 140px; height: 80px;"
                              src="${API.FILE_PATH}logo/${
      user?.companyInfo?.logo
    }" />
                      </td>
                  </tr>
                  <tr>
                      <td></td>
                  </tr>
                  <tr>
                      <td></td>
                  </tr>
                  <tr>
                      <td><b>
                      ${
                        user?.companyInfo?.tax === "gst"
                          ? "GST No"
                          : "vat No"
                      }
                      </b></td>
                      <td><b>Mobile Number</b></td>
                      <td><b>E-mail</b></td>
                      <td></td>
                  </tr>
                  <tr>
                      <td>
                      ${
                        user?.companyInfo?.countryInfo?.name
                          ? user?.companyInfo?.countryInfo?.name
                          : "-"
                      }
              <br>
                          ${user?.companyInfo?.taxno || ""}
                      </td>
                      <td>
  
                          ${user?.companyInfo?.cphoneno || ""}
                      </td>
                      <td>
                          ${user?.email || ""}
                      </td>
                      <td></td>
                  </tr>
              </tbody>
          </table>
          <hr>
        <table style="margin-top: 25px !important;margin: auto;width: 100%;">
          <tbody> 
            <tr>
              <td><b>Customer Name</b></td>
              <td><b>${
                user?.companyInfo?.tax === "gst"
                  ? "Customer GST No"
                  : "Customer Vat No"
              }</b></td>
              <td><b>Invoice Date</b></td>
              <td><b>Invoice No</b></td>
              <td><b>Reference</b></td>
            </tr>
            <tr>
              <td>${customer?.name || ""}</td>
              <td>${customer?.vat_number || ""}</td>
              <td>${sale?.ldate ? moment(sale.sdate).format("DD/MM/YYYY") : ""}</td>
              <td>${sale?.invoiceno || ""}</td>
              <td>${sale?.reference || ""}
            </tr>
          </tbody>
          </table>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                      <td style="height: 40px;" width="12%"><b>
                      Item Code
                          </b></td>
                      <td width="12%"><b>
                              Description
                          </b></td>
                      <td width="12%"><b>Qty/Hrs</b></td>
                      <td width="12"><b> Unit</b></td>
                      <td width="12%"><b>Price/Rate</b></td>
                      <td width="12%"><b>Discount</b></td>
                      <td width="12%"><b>GST/VAT%</b></td>
                      <td width="12%"><b>GST/VAT</b></td>
                      <td width="12%"><b>Total</b></td>
                  </tr>
                  ${productlist
                    .map(
                      (product: any) => `
                  <tr style="font-size: 12px;">
                      <td>
                          ${product?.product?.icode || ""}
                      </td>
                      <td>
                          ${product?.product?.idescription || ""}
                      </td>
                      <td>
                          ${product?.quantity || ""}
                      </td>
                      <td>
                      ${product?.product?.unit || ""}
                      </td>
                      <td>
                          ${product?.costprice || ""}
                      </td>
                      <td>
                          ${product?.discount || ""}
                      </td>
                      <td>
                          ${product?.vat || ""}
                      </td>
                      <td>
                          ${product?.vatamt || ""}
                      </td>
                      <td>
                          ${user?.companyInfo?.countryInfo?.symbol || ""}${
                        product?.total || ""
                      }
                      </td>
                  </tr>
              `
                    )
                    .join("")}
  
              </tbody>
          </table>
          <hr>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="font-size: 12px;">
                      <td width="30%"></td>
                      <td width="30%"></td>
                      <td width="20%"><b>${user?.companyInfo?.tax === "gst" ?  
                        "GST" : "VAT"
                      }</b></td>
                      <td width="20%"><b>
                      ${
                        user?.companyInfo?.countryInfo?.symbol || ""
                      }${parseFloat(vatTotal.toFixed(2))}
                          </b></td>
                  </tr>
                  <tr style="font-size: 12px;">
                      <td width="30%"></td>
                      <td width="30%"></td>
                      <td width="20%"><b>Net</b></td>
                      <td width="20%"><b>
                      ${
                        user?.companyInfo?.countryInfo?.symbol || ""
                      }${parseFloat(netTotal.toFixed(2))}
  
                          </b></td>
                  </tr>
                  <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                      <td style="height: 35px;" colspan="2" width="12%"></td>
                      <td width="5%"><b>Total</b></td>
                      <td width="5%" style="color: black;"><b>
                              ${user?.companyInfo?.countryInfo?.symbol || ""}${
      sale.total || ""
    }
                          </b>
  
                      </td>
                  </tr>
  
                  <tr style="text-align:right;margin-right:20px;">
                      <td colspan="3">
                      ${numberToWords(sale?.total) || ""} ${
      user?.companyInfo?.countryInfo?.currency
    }s</td>
                  </tr>
              </tbody>
          </table>
          <table style="border-spacing: 0px;margin-top: 10px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="border: none;background: lightgray;color: black;text-align: start;font-size: 12px;">
                      <td rowspan="2" width="52%" style="border: none;height: 60px;" colspan="2" width="12%">
                          <b style="margin-left:10px; padding-top:10px;">Invoice Descriptions</b>
                          <p style="text-align:start; margin-left:10px;">
                              ${sale?.quotes == null ? "" : sale?.quotes || ""}
                              .</br>
                          </p>
                          <br>
                          <br>
                          <b style="margin-left:10px;">Terms and Conditions</b>
                          <p style="text-align:start; margin-left:10px;">
                          ${sale?.terms == null ? "" : sale?.terms || ""}
                              </br>
                          </p>
                      </td> 
                      <td style="text-align: right;font-size: 16px; line-height: 25px; padding: 20px; width: 35%">
              <b>GST/VAT %</b>:${parseFloat(vatTotal?.toFixed(2))}
               <br>
               <b>Net</b>: ${parseFloat(netTotal?.toFixed(2))}
               <br>
               <b>GST/VAT</b>:${parseFloat(vatTotal?.toFixed(2))}
               <br>
               <b>Grand Total</b>:${
                 user?.companyInfo?.countryInfo?.symbol || ""
               } ${sale?.total || ""}
               <div>
               </div>
           </td>
                  </tr>
                      </tbody>
          </table>
                      <table style="width:100%">
        <tr style="width:100%;height:20px">
          <td style="width:50%">
        </td>
          <td style="width:50%"></td>
        </tr>
        <tr style="width:100%;height:70px">
          <td style="width:50%"></td>
          <td
            style="width:50%;border-top:1px solid gray;border-right:1px solid gray;border-left:1px solid gray">
          </td>
        </tr>
        <tr style="width:100%;height:10px">
        <td style="text-align: left; line-height: 25px; padding: 20px; width: 50%">
        ${
          selectedBank
            ? `
            <b>Company's Bank Details</b>
            <br>
            ${selectedBank?.laccount == "" || selectedBank?.laccount == null
             ? ""
             :`
              Bank Name: ${selectedBank?.laccount}<br>`
              }
              ${selectedBank?.accnum == "" || selectedBank?.accnum == null
              ? ""
              :`Account No: ${selectedBank?.accnum}<br>`
              }
            ${
              selectedBank?.branch == "" || selectedBank?.branch == null
                ? ""
                : `
            Branch: ${selectedBank?.branch}
            <br>
            `
            }
            ${
              selectedBank?.ifsc == "" || selectedBank?.ifsc == null
                ? ""
                : `
            IFSC: ${selectedBank?.ifsc}
            <br>
            `
            }
            ${
              selectedBank?.bicnum == "" || selectedBank?.bicnum == null
                ? ""
                : `
            Bank Swift: ${selectedBank?.bicnum}
            `
            }
          `
            : ""
        }
      </td>
          <td
            style="width:50%;border-bottom:1px solid gray;border-right:1px solid gray;border-left:1px solid gray;padding-left:120px">
            Authorised Signatory</td>
        </tr>
      </table>
              
          ${
            isPaymentInfo
              ? `<div>
              <p style="text-align: center;"><b>Payment Information</b></p>
          </div>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;border: 1px solid black;">
              <tbody style="text-align: center;">
                  <tr style="background: gray;color: black;text-align: center;font-size: 12px;">
                      <td style="height: 25px;" width="12%"><b>Bank Holder Name</b></td>
                      <td width="12%"><b>Account No</b></td>
                      <td width="12%"><b>Paid Method</b></td>
                      <td width="12%"><b>Amount</b></td>
                      <td width="12%"><b>Date</b></td>
                      <td width="12%"><b>Payment Type</b></td>
                  </tr>
  
                 
                  ${bankList
                    .map(
                      (bankInf: any) => `
        <tr style="font-size: 12px;">
            <td>
                ${user.fullName || ""}
            </td>
            <td>
                ${bankInf?.bankInf?.laccount || ""}
            </td>
            <td>
                ${bankInf.paidmethod || ""}
            </td>
            <td>
                ${bankInf.amount || ""}
            </td>
            <td>
                ${moment(bankInf.date).format("DD/MM/YYYY")}
            </td>
            <td>
                ${bankInf.type}
            </td>
        </tr>
    `
                    )
                    .join("")}
  
  
              </tbody>
          </table>
  
          <table style="width:100%">
              <tr style="width:100%;height:30px">
                  <td style="width:50%"></td>
                  <td style="width:50%"></td>
              </tr>
              <tr style="width:100%;height:70px">
                  <td style="width:50%"></td>
                  <td style="width:50%;border-top:1px solid gray;border-right:1px solid gray;border-left:1px solid gray">
                  </td>
              </tr>
              <tr style="width:100%;height:10px">
                  <td style="width:50%"></td>
                  <td
                      style="width:50%;border-bottom:1px solid gray;border-right:1px solid gray;border-left:1px solid gray;padding-left:120px">
                      Authorised Signatory</td>
              </tr>
          </table>`
              : ""
          }
          <div style="font-size: 10px; margin-top: 25px;">
              <p style="text-align: center;">Created by <a target="_blank"
                      href="https://www.taxgoglobal.com/">Taxgoglobal Limited</a></p>
          </div>
      </div>
  </body>
  </html>`;
  } catch (error) {
    console.log("err", error);
  }
};
const template2 = ({
  pagetype,
  sale,
  saleComplete,
  customer,
  selectedBank,
  user,
  country,
  productlist,
  Discount,
  round,
  netTotal,
  vatTotal,
  bankList,
  isPaymentInfo,
  gstType,
  path,
}: any) => {
  const generateProductRows = () => {
    if (productlist) {
      return productlist
        .map(
          (product: any) => `
          <tr style="font-size: 12px;">
              <td style="text-align: left;">
                  ${product?.icode || product?.description || "-"}
              </td>
              <td style="text-align: left;">
                  ${product.description || "-"}
              </td>
              <td>
                  ${product.quantity || ""}
              </td>
              <td>
                  ${product.costprice || ""}
              </td>
              <td style="text-align: center;">
                  ${product.discount || "-"}
              </td>
              <td style="text-align: center;">
                  ${product.incomeTaxAmount || "0 @ 0.00"}
              </td>
              <td style="text-align: right;">
                  ${product.total
              ? `${user?.companyInfo?.countryInfo?.symbol || ""}${product.total || ""
              }`
              : ""
            }
              </td>
          </tr>
      `
        )
        .join("");
    } else {
      return "";
    }
  };

  const generateBankInfoRows = () => {
    if (bankList) {
      return bankList
        .map(
          (bankInf: any) => `
        <tr style="font-size: 12px;">
            <td style="text-align: left;">
                ${bankInf?.bankInf?.laccount || ""}
            </td>
            <td style="text-align: left;">
                ${bankInf?.bankInf?.nominalcode || ""}
            </td>
            <td style="text-align: left;">
                ${bankInf.paidmethod || ""}
            </td>
            <td style="text-align: center;">
                ${moment(bankInf.date).format("DD/MM/YYYY") || ""}
            </td>
            <td style="text-align: center;">
                ${bankInf.type || ""}
            </td>
            <td style="text-align: right;">
                ${bankInf.amount
              ? `${user?.companyInfo?.countryInfo?.symbol || ""}${bankInf.amount || ""
              }`
              : ""
            }
            </td>
        </tr>
    `
        )
        .join("");
    } else {
      return "";
    }
  };

  return `<!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="date=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="x-apple-disable-message-reformatting" />
      <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i" rel="stylesheet" />
      <style>
          body {
              margin: 30px;
              font-family: Arial, Helvetica, sans-serif;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th,
          td {
              padding: 8px;
              text-align: left;
              font-size: 13px;
          }
          th {
              font-weight: 700;
          }
          .header-img {
              width: 100px;
              height: 50px;
              object-fit: cover;
          }
          .bold {
              font-weight: 700;
          }
          .light {
              font-weight: 300;
          }
          .medium {
              font-weight: 500;
              line-height: 22px;
          }
          .bordered {
              border: 1px solid grey !important;
              background-color: white;
          }
          .heading{
              /* width: 100%; */
              background-color: #DFDCDC;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 700;
              padding: 5px;
              font-size: 14px;
          }
      </style>
      <title>Tax GO Invoice</title>
  </head>
  <body>
      <table>
          <tr>
              <td>
                  <img class="header-img"  src="${API.FILE_PATH}logo/${user?.companyInfo?.logo
    }"  alt="Logo" />
              </td>
              <td><b><center><u>${pagetype ? pagetype : "Invoice"
    }</u><b></center></td>
              <td class="medium" style="text-align: right;line-height: 20px;">
                  <b>Invoice Number :</b>${sale?.invoiceno || ""}<br />
                  <b>Bill Date: </b>${sale?.ldate ? moment(sale?.ldate).format("DD/MM/YYYY") : "-"}<br><br />
              </td>
          </tr>
      </table>
      <hr />
      <table>
          <tr>
              <th>From :</th>
              <th>To :</th>
              <th>Account Details :</th>
          </tr>
          <tr>
              <td class="medium">
              ${user?.companyInfo?.bname ? user?.companyInfo?.bname : "-"
    } <br />
              ${user?.companyInfo?.fulladdress
      ? user?.companyInfo?.fulladdress
      : "-"
    }
              <br>
              ${user?.companyInfo?.countryInfo?.name
      ? user?.companyInfo?.countryInfo?.name
      : "-"
    }
              <br>
              ${
                productlist?.[0]?.incomeTax !== 0
                  ? `<br>
                ${
                  user?.companyInfo?.tax === "gst"
                    ? `GSTIN: ${user?.companyInfo?.taxno}`
                    : `VAT No: ${user?.companyInfo?.taxno}`
                }`
                  : ""
              }
              
              ${user?.phonenumber ? user?.phonenumber : ""}
              <br>
              ${user?.email ? user?.email : ""}
              <br>
              ${user?.companyInfo?.registerno
      ? `Reg. No: ${user?.companyInfo?.registerno}`
      : ""
    }
              </td>
              <td class="medium">
              ${customer?.bus_name ? `${customer?.bus_name} <br> ` : ""}
              ${customer?.address ? `${customer?.address} <br> ` : ""}
                ${customer?.mobile ? `${customer?.mobile} <br> ` : ""}

                  ${customer?.email ? `${customer?.email} <br> ` : ""}
             
                  GSTIN:${customer?.vat_number ? `${customer?.vat_number} <br> ` : ""
    }
            
              </td>
              <td class="medium">
              ${selectedBank
      ? `
                  Bank Name : ${selectedBank?.laccount} <br />
                  ${
                    selectedBank?.accountname == "" ||
                    selectedBank?.accountname == null
                      ? ""
                      : `Account Name : ${selectedBank?.accountname}<br />`
                  }
                  ${
                    selectedBank?.accnum == "" || selectedBank?.accnum == null
                      ? ""
                      : `Account Number : ${selectedBank?.accnum}<br />`
                  }
                  ${
                    selectedBank?.branch == "" || selectedBank?.branch == null
                      ? ""
                      : `
                  Branch: ${selectedBank?.branch}
                  <br>
                  `
      }
                  ${selectedBank?.ifsc == "" || selectedBank?.ifsc == null
        ? ""
        : `
                  IFSC: ${selectedBank?.ifsc}
                  <br>
                  `
      }
                  `
      : ""
    }
              </td>
          </tr>
      </table>
      <hr />
      <table>
          <tr class="heading">
              <td >Product Details</td>
          </tr>
      </table>
      <table>
          <tr class="bordered">
              <th class="bordered">ITEM CODE</th>
              <th class="bordered">DESCRIPTION</th>
              <th class="bordered">PRICE</th>
              ${path == "Service" ? "" : `<th class="bordered">QTN</th>`}
              ${path == "Service" ? "" : `<th class="bordered">UNIT</th>`}
              <th class="bordered">Discount <br>(Amt & %)</th>
              ${user?.companyInfo?.tax === "vat"
      ? `<th class="bordered"><b>Vat <br>(Amt & %)</b></td>`
      : `<th class="bordered"><b>GST <br>(Amt & %)</b></td>`
    }
              <th class="bordered">TOTAL</th>
          </tr>
          ${productlist
      .map(
        (product: any) => `
          <tr class="bordered">
              <td class="bordered">
              ${product?.product?.icode
            ? product?.product?.icode
            : product.product?.idescription
              ? `- ${product?.product?.idescription}`
              : ""
          }
              </td>
              <td class="bordered">${product?.description ? product?.description : ""
          }</td>
              <td class="bordered">${product?.costprice ? product?.costprice : ""
          }</td>
              ${path == "Service"
            ? ""
            : `<td class="bordered">${product?.quantity ? product?.quantity : ""
            }</td>`
          }
              ${path == "Service"
            ? ""
            : `<td class="bordered">${product?.product?.unit ? product?.product?.unit : ""
            }</td>`
          }
              <td class="bordered">${product?.discount_amount ? product?.discount_amount: "-"
          }</td>
              ${user?.companyInfo?.tax === "vat"
            ? `<td class="bordered">${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
            : `<td class="bordered">${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
          }
              <td class="bordered">
              ${product?.total
            ? `${user?.companyInfo?.countryInfo?.symbol}${product?.total}`
            : ""
          }</td>  
              `
      )
      .join("")}       
          </tr> 
      </table>
      <br>
      <table class="bordered">
      <tr>
       <th>Invoice Notes</th>
      <th></th>
      <th></th>
      </tr>
      <tr>
         <td class="medium">
                 ${sale?.quotes === null || sale?.quotes == ""
      ? "-"
      : sale?.quotes
    } <br />
                </td>
                <td class="medium">
                <br />
                </td>
                <td class="medium">
                <b>Taxable Value:</b> ${
                  netTotal
                    ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(
                        netTotal.toFixed(2)
                      )}`
                    : ""
                } <br />
                <b>${
                  user?.companyInfo?.tax === "gst" ? "Total GST" : "Total VAT"
                }:</b>  ${
    vatTotal
      ? `${user?.companyInfo?.countryInfo?.symbol} ${
          parseFloat(vatTotal.toFixed(2)) || ""
        }`
      : ""
  }<br />
                <b>Overall Discount:</b>${
                  Discount
                    ? `${user?.companyInfo?.countryInfo?.symbol} ${
                        parseFloat(Discount)?.toFixed(2) || 0
                      }`
                    : ""
                }<br />
                <b>Grand Total:</b>  ${
                  sale.total
                    ? `${user?.companyInfo?.countryInfo?.symbol} ${Number(
                        sale.total
                      )}`
                    : ""
                }<br/>
                ${numberToWords(Number(sale.total).toFixed(2)) || ""}
                 <br/>
              
                </td>
            </tr>
      </table>
      <br/>
      <table class="bordered">
      <tr>
      <th ><u>Company Sign and Seal</u></th>
      <th><u>Receiver Sign and Seal</u></th>
       </tr>
        <tr>
      <td>
      <br>
       <br>
             <br>
      </td>
            <td>
      <br>
       <br>
             <br>
      </td>
      </tr>
      </table>
      <hr>
      <table>
      <tr>
      <td margin-top: 25px;><center>Created by <a href="https://www.taxgoglobal.com/">Taxgoglobal Limited</a></center></td>
      </tr>
      </table>
  </body>
  </html>`;
};
const template3 = ({
  pagetype,
  user,
  saleComplete,
  customer,
  sale,
  productlist,
  netTotal,
  vatTotal,
  isPaymentInfo,
  selectedBank,
}: any) => {
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
    <title>Tax GO Invoice</title>
  </head>
  
  <body style="width: 100%;align-content: center;margin: auto;font-family:pins, 'Segoe UI', Tahoma, sans-serif">
    <div style="margin: 20px;">
      <table style="margin: auto;
          width: 100%;
          text-align: right;
          background: #fafafa;
          padding: 8px;
          font-size: 14px;">
        <tbody style="text-align: right;">
          <tr style="text-align: center;
                        font-size: 20px;
                        font-weight: bold;
                        text-transform: uppercase;
                        text-decoration: underline;">
            <td colspan="3"> ${pagetype ? pagetype : "Debit-Note"}</td>
          </tr>
          <tr style="text-align: right;">
            <td></td>
          </tr>
          <tr style="line-height:25px;">
            <td style="text-align: left"><img style="border-radius: 50%;width: 180px;"
                src="${API.FILE_PATH}logo/${user?.companyInfo?.logo}" />
            </td>
            <td style="padding-left: 25px;vertical-align:super; font-size:20px;">
              <b>
                ${user?.companyInfo?.bname ? user?.companyInfo?.bname : "-"}
              </b>
              <br>
              ${
                user?.companyInfo?.fulladdress
                  ? user?.companyInfo?.fulladdress
                  : "-"
              }
              <br>
              ${user?.companyInfo?.countryInfo?.name ? user?.companyInfo?.countryInfo?.name : "-"}
              <br>
              ${
                user?.companyInfo?.taxregno
                  ? `Tax No: ${user?.companyInfo?.taxregno}`
                  : ""
              }
              <br>
              ${
                user?.companyInfo.registerno
                  ? `Reg. No: ${user?.companyInfo?.registerno}`
                  : ""
              }
              <br>
              Phone:
              ${user.phonenumber ? user.phonenumber : ""}
              <br>
              ${user?.email ? user?.email : ""}
            </td>
            ${
              saleComplete
                ? `
              <td>
                <div>
                  <div style="padding: 5px;
                                float: right;
                                text-align: center;
                                border: 1px solid green;
                                border-radius: 4px;
                                color: green;
                                font-weight: 700;
                                font-size: 12px;
                                width: 32px;">Paid
                  </div>
                </div>
              </td>`
                : ""
            }
          </tr>
        </tbody>
      </table>
      <table style="width: 100%;
          font-size: 14px;
          border-spacing: 0px;
          line-height: 22px;">
        <tbody>
          <tr style="line-height:30px;">
            <td style="padding: 10px 0px;">
              <b>INVOICE ADDRESS</b><br>
              ${customer?.bus_name ? customer?.bus_name : "-"}
              <br>
              ${customer?.address ? customer?.address : "-"}
              <br>
              ${customer?.mobile ? customer?.mobile : "-"}
              <br>
              ${customer?.email ? customer?.email : "-"}
              <br>
              <b>Delivery Address</b><br>
              ${sale?.deladdress ? sale?.deladdress : "-"}
            </td>
            <td colspan="2" style="background-color: #febb54;
                          color: black; font-size:16px; padding-right: 15px;text-align:right;">
              <b>Invoice number#: ${sale?.invoiceno}<br>
                Issued Date: ${moment(sale?.sdate).format("DD/MM/YYYY")}<br>
                Reference: ${sale?.reference || "-"}</b>
            </td>
          </tr>
        </tbody>
      </table>
  
      <table style="margin-top: 10px !important;margin: auto;width: 100%;">
        <tbody style="text-align: center;">
          <tr
            style="background: black;color: white;text-align: center;font-size: 10px; text-transform: uppercase;">
            <td style="height: 40px; " width="12%"><b>Product/Service</b></td>
            <td width="12%"><b>Description</b></td>
            <td width="12%"><b>Price</b></td>
            <td width="12%"><b>Qtn</b></td>
            <td width="12%"><b>Discount <br>(Amt & %)</b></td>
            <td width="12%"><b>VAT <br>(Amt & %)</b></td>
            <td width="12%"><b>Amount(${user?.companyInfo?.countryInfo?.symbol})</b></td>
          </tr>
          ${productlist
            .map(
              (product: any) => `
            <tr style="font-size: 12px;">
              <td>
                ${product?.product?.icode ? product?.product?.icode: ""}
              </td>
              <td>
                ${product.description ? product?.description : ""}
              </td>
              <td>
                ${product?.costprice ? product?.costprice : ""}
              </td>
              <td>
                ${product?.quantity || ""}
              </td>
              <td>
                ${product?.discount ? product?.discount : "-"}
              </td>
              <td>
                ${
                  product.incomeTaxAmount
                    ? `${product?.incomeTaxAmount} @ ${product?.incomeTax}`
                    : "0 @ 0.00"
                }
              </td>
              <td>
                ${
                  product.total
                    ? `${user?.companyInfo?.countryInfo?.symbol}${product.total}`
                    : ""
                }
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <hr style="border: 0.5px solid lightgray;">
      <table style="margin-top: 5px !important;margin: auto;width: 100%; line-height: 18px;">
        <tbody style="text-align: center;">
          <tr style="font-size: 12px;">
            <td width="75%"></td>
            <td style="text-align: right;"><b>Sub Total</b></td>
            <td style="border-bottom:1px solid lightgray;text-align: right;"><b>
                ${
                  netTotal
                    ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(
                        netTotal.toFixed(2)
                      )}`
                    : ""
                }
              </b></td>
          </tr>
          <tr style="font-size: 12px;">
            <td width="75%"></td>
            <td style="text-align: right;"><b>${user?.countryInfo === "gst" ? "Total VAT" :"Total GST"}</b></td>
            <td style="border-bottom:1px solid lightgray;text-align: right;"><b>
                ${
                  vatTotal
                    ? `${user?.companyInfo?.countryInfo?.symbol} ${
                        parseFloat(vatTotal.toFixed(2)) || ""
                      }`
                    : ""
                }
              </b></td>
          </tr>
          <tr style="font-size: 12px;">
            <td width="75%"></td>
            <td style="text-align: right;"><b>Total</b></td>
            <td style="text-align: right;"><b>
                ${
                  sale.total ? `${user?.companyInfo?.countryInfo?.symbol} ${sale.total}` : ""
                }
              </b></td>
          </tr>

        </tbody>
      </table>
      ${
        isPaymentInfo
          ? `
        <!-- Payment Information Table -->
        <table style="border-spacing: 0px;margin-top: 10px !important;margin: auto;width: 100%; line-height: 22px;">
          <tbody style="text-align: center; background-color: #febb54;">
            <tr style="border: none;background: febb54;color: black;text-align: center;font-size: 12px;">
              <td style="text-align: left;line-height: 15px;padding: 20px; width:75%;">
                <b>Invoice Descriptions</b><br><br>
                <p style="text-align:justify;margin-left:12px;">
                  ${sale.quotes || ""}
                </p>
                <br>
                <br>
                <b>Terms and Conditions</b><br><br>
                <p style="text-align:justify;margin-left:12px;">
                ${sale.terms || ""}
                </p>
              </td>
              <td style="text-align: left; line-height: 25px; padding: 20px; width: 25%">
                ${
                  selectedBank
                    ? `
                  <b>Bank Details</b>
                  <br>
                  Bank Name: ${selectedBank?.list?.laccount}
                  <br>
                  Branch: ${selectedBank?.list?.ibannum}
                  <br>
                  Bank Swift: ${selectedBank?.list?.bicnum}`
                    : ""
                }
              </td>
            </tr>
          </tbody>
        </table>`
          : ""
      }
      <table style="width:100%">
        <tr style="width:100%;height:30px">
          <td style="width:50%"></td>
          <td style="width:50%"></td>
        </tr>
        <tr style="width:100%;height:70px">
          <td style="width:50%"></td>
          <td
            style="width:50%;border-top:1px solid gray;border-right:1px solid gray;border-left:1px solid gray">
          </td>
        </tr>
        <tr style="width:100%;height:10px">
          <td style="width:50%"></td>
          <td
            style="width:50%; height:200px;border-bottom:1px solid gray;border-right:1px solid gray;border-left:1px solid gray;padding-left:120px">
            Authorised Signatory</td>
        </tr>
      </table>
      <div style="font-size: 10px; margin-top: 25px;">
        <p style="text-align: center;">Created by <a href="https://www.taxgoglobal.com/">Taxgoglobal Limited</a></p>
      </div>
    </div>
  </body>
  
  </html>`;
};
const template4 = ({
  pagetype,
  user,
  customer,
  sale,
  path,
  gstType,
  invoicearray,
  productlist,
  Discount,
  vatTotal,
  netTotal,
  total,
  vatRate,
  bankList,
  selectedBank,
  isPaymentInfo,
}: any) => {
  try {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 100%;
        margin: auto;
        padding: 30px;
        font-size: 16px;
        max-height:255mm;
        line-height: 24px;
        color: #555;
      }
      table {
        width: 100%;
        line-height: inherit;
        text-align: left;
        border-collapse: collapse;
      }
      table td {
        padding: 5px;
        vertical-align: top;
      }
      table tr.top table td {
        padding-bottom: 20px;
      }
      table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
      }
      table tr.top table td:last-child {
        font-size: 35px;
        font-weight: 700;
        text-align: end;
      }
      table tr.information table td {
        padding-bottom: 40px;
      }
      table tr.heading th {
        background: #eee;
        border: 1px solid black;
        font-weight: bold;
        padding: 5px;
      }
      table tr.details td {
        padding-bottom: 20px;
        border: 1px solid black;
      }
      table tr.item td {
        border-bottom: 1px solid #eee;
      }
      table tr.item.last td {
        border-bottom: none;
      }
      table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
      }
      .logo {
        max-width: 150px;
        max-height: 50px;
      }
      .space {
        margin-bottom: 15px;
      }
      .secondpart .secondpart-data{
        text-align: right;
      }
      .width{
        width: 70%;
      }
      .footer-text1{
        text-align: center;
      }
      .footer-textbold{
        font-weight: 900;
        color: black;
      }
      .footer{
        border-top: 1px solid black;
      }
         tbody.main-table td {
            border: none;
        border-left: 1px solid black;
        border-right: 1px solid black;
        padding: 4px !important;
       }
        .main-table1 {
            height: 60mm;
            max-height: 60mm;
            vertical-align: top;
          }
            .lineheightitem{
            padding:0; 
            height:1px;
            max-height:10px;
            border-bottom: none;
            border-top: none;
            }
            .lineitem{
            padding:0;
            border-bottom: none;
            border-top: none;
            }
            .lineitem.last td {
              border-bottom: 1px solid black;
            }
    </style>
  </head>
  <body>
  ${invoicearray.map(
      (item: any, index: number) => `
    <table  cellpadding="0" cellspacing="0">
      <tr class="top">
        <td colspan="2">
          <table>
            <tr>
              <td>${pagetype ? pagetype : "Receipt"}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr class="information">
        <td colspan="2">
          <table class="secondpart">
            <tr>
            <td>
            <img style="width: 150px; height: 100px;" src="${API.FILE_PATH}logo/${user?.companyInfo?.logo}" />
            </td>
              <td class="secondpart-data">
                Date:${moment(sale?.sdate).format("DD/MM/YYYY")}<br />
                Invoice No:${sale?.invoiceno}<br />
                ${productlist?.[0]?.incomeTax !== 0 ? (
          `
                ${user?.companyInfo?.tax === "gst"
            ? `GSTIN: ${user?.companyInfo?.taxno}`
            : `VAT No: ${user?.companyInfo?.taxno}`
          }`
        ) : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <table>
        <tr class="heading">
          <th>From</th>
          <th>To</th>
          <th>Bank Details</th>
        </tr>
        <tr class="details">
          <td>
            ${user?.companyInfo?.bname ? user?.companyInfo?.bname : "-"}<br />
            ${user?.companyInfo?.fulladdress
          ? user?.companyInfo?.fulladdress
          : "-"
        }<br />
            ${user?.companyInfo?.countryInfo?.name
          ? user?.companyInfo?.countryInfo?.name
          : "-"
        }<br />
            ${user?.companyInfo?.tax === "gst"
          ? `GSTIN:${user?.companyInfo?.taxno}`
          : `VAT No: ${user?.companyInfo?.taxno}`
        }<br />
            ${user?.companyInfo?.cphoneno ? user?.companyInfo?.cphoneno : ""}
          </td>
          <td>
          ${customer?.bus_name ? `${customer?.bus_name}<br> ` : ""}
          ${customer?.address ? `${customer?.address} <br> ` : ""}
          ${customer?.mobile ? `${customer?.mobile} <br> ` : ""}
          ${customer?.email ? `${customer?.email} <br> ` : ""}
          ${user?.companyInfo?.tax === "gst" ?
          `GSTIN ${customer?.vat_number}<br>` : `${customer?.vat_number} <br>`}
          </td>
          <td>
          ${selectedBank
          ? `
                  Bank Name : ${selectedBank?.laccount} <br />
                  ${selectedBank?.accountname == "" || selectedBank?.accountname == null
            ? ""
            : `Account Name : ${selectedBank?.accountname}<br />`
          }
                  ${selectedBank?.accnum == "" || selectedBank?.accnum == null
            ? ""
            : `Account Number : ${selectedBank?.accnum}<br />`
          }
                  ${selectedBank?.branch == "" || selectedBank?.branch == null
            ? ""
            : `
                  Branch: ${selectedBank?.branch}
                  <br>
                  `
          }
                  ${selectedBank?.ifsc == "" || selectedBank?.ifsc == null
            ? ""
            : `
                  IFSC: ${selectedBank?.ifsc}
                  <br>
                  `
          }
                  `
          : ""
        }
          </td>
        </tr>
      </table><br/>
       <table class="space">
             <tr class="heading">
             <th>Product Name[${user?.companyInfo?.tax === "gst" ? "HSN":"Item Code"}]</th>
              <th>Rate</th>
              ${path == "Service" ? "" : `<th>Qtn</th>`}
              <th>Discount(Amt & %)</th>
              ${user?.companyInfo?.tax === "vat"
          ? `<th>Vat(Amt & %)</th>`
          : gstType
            ? `<th>CGST(Amt & %)</th>
               <th>SGST(Amt & %)</th>`
            : `<th>GST(Amt & %)</th>`
        }
        <th>Total</th>
    </tr>
    <tbody class="main-table main-table1" style="border-bottom: 1px solid black;">
        ${item.map((product: any,index:number) => `
        <tr class=${item?.length-1===index?"lineitem":"lineheightitem"} >
            <td>${product?.description ? product?.description : ""}[${user?.companyInfo?.tax === "gst" ? product?.product?.hsn_code : product?.product?.idescription}]</td>
            <td>${product?.costprice ? product?.costprice : ""}</td>
            ${path == "Service" ? "" : `<td>${product?.quantity ? product?.quantity : ""}</td>`}
            <td>${product?.discount ? product?.discount : "-"}</td>
            ${user?.companyInfo?.tax === "vat"
            ? `<td>${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
            : gstType
              ? `<td>${product?.incomeTaxAmount / 2} @ ${product?.incomeTax / 2}</td>
                       <td>${product?.incomeTaxAmount / 2} @ ${product?.incomeTax / 2}</td>`
              : `<td>${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
          }
            <td>${product?.total ? `${user?.companyInfo?.countryInfo?.symbol}${product?.total}` : ""}</td>
        </tr>`).join('')}
        </tbody>
        </table>
       ${isPaymentInfo
          ? `
      <table class="page-break no-page-break">
        <tr class="heading">
          <th>Bank Holder Name</th>
          <th>Account No</th>
          <th>Paid Method</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Payment Type</th>
        </tr>
        ${bankList
            .map(
              (bankInf: any) => `
        <tr class="details">
          <td>${user.fullName || ""}</td>
          <td>${bankInf?.bankInf?.laccount || ""}</td>
          <td>${bankInf.paidmethod || ""}</td>
          <td>${bankInf.amount}</td>
          <td>${moment(bankInf.date).format("DD/MM/YYYY")}</td>
          <td>${bankInf.type}</td>
        </tr>`  )
            .join("")}
      </table>
      `: ""}
      <br/>
    </table>
     ${invoicearray?.length == index + 1 ? (
          `
    <table class="notes page-break no-page-break">
  <tr>
    <td style="width: 40%; text-align: start; padding: 0;">
      <table class="page-break no-page-break">
        <tr>
          <td class="width">Taxable Value:</td>
          <td class="dataend">
            ${netTotal ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(netTotal.toFixed(2))}` : ""}
          </td>
        </tr>
        <tr>
          <td class="width">${user?.companyInfo?.tax === "gst" ? "Total GST:" : "Total VAT:"}</td>
          <td class="dataend">
            ${vatTotal ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(vatTotal.toFixed(2)) || ""}` : ""}
          </td>
        </tr>
        <tr>
          <td class="width">Overall Discount:</td>
          <td class="dataend">
            ${Discount ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(Discount)?.toFixed(2) || 0}` : ""}
          </td>
        </tr>
        <tr>
          <td class="width">Grand Total:</td>
          <td class="dataend">
            ${sale.total ? `${user?.companyInfo?.countryInfo?.symbol} ${Number(sale.total).toFixed(2)}` : ""}
          </td>
        </tr>
      </table>
       `
        ) : (
          `<div></div>`
        )
        }
    </td>
    <td style="width: 10%; text-align: center; padding: 0;"></td>
    <td style="width: 40%; text-align: center; padding: 0;">
      <table class ="page-break no-page-break">
        <tr class="heading">
          <th>Authorised Signatory</th>
        </tr>
        <tr>
          <td style="border: 1px solid black; height: 100px;">
            <br/>
            <br/>
            <br/>
            <br/>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    <p class="footer-text1 footer-textbold">Thank you for your business!</p>
    <p class="footer-text1">Notes:${sale?.quotes == null ? "" : sale?.quotes || ""}
    </p>
    <table class="footer">
      <tr><td class="footer-text1">Created by <a target="_blank"href="https://www.taxgoglobal.com/">Taxgoglobal Limited</a></tr></td>
  </table>
  `)}
  </body>
</html>`;
  } catch (error) {
    console.log("err", error);
  }
};
const template5 = ({
  pagetype,
  user,
  customer,
  sale,
  path,
  gstType,
  invoicearray,
  productlist,
  Discount,
  vatTotal,
  netTotal,
  total,
  vatRate,
  bankList,
  selectedBank,
  isPaymentInfo,
}: any) => {
  try {
    return `
<!DOCTYPE html>
<head>
      <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax GO Invoice</title>
    <style>
       body {
           max-width: 850px;
            margin: auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
            max-height:255mm;
        }
        .fulltable {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        tr {
            height: 100%;
        }
        .header {
            text-align: center;
            height: 20%;
        }
        tbody{
            padding-bottom: 2% !important;
        }
        tbody.main-table td {
            border: none;
        border-left: 1px solid black;
        border-right: 1px solid black;
        padding: 4px !important;
    }
    .main-table1 {
            height: 100mm;
            max-height: 100mm;
            vertical-align: top;
        }
            .lineheightitem{
            padding:0; 
            height:1px;
            max-height:10px;
            }
            .lineitem{
            padding:0;
            }
    </style>
</head>
<body>
${invoicearray.map(
      (item: any, index: number) => `
    <table class="fulltable">
        <table>
            <tr>
                <td colspan="2" class="header">
                    <h2>${pagetype ? pagetype : "Receipt"}</h2>
                    <p>Invoice No:${sale?.invoiceno}</p>
                    <p>Date:${moment(sale?.sdate).format("DD/MM/YYYY")}</p>
                </td>
            </tr>
            <tr>
                <td style="width: 50%;">
                    <strong>From</strong><br>
                    ${user?.companyInfo?.bname ? user?.companyInfo?.bname : "-"}<br>
                    ${user?.companyInfo?.fulladdress
          ? user?.companyInfo?.fulladdress
          : "-"
        }<br>
                    ${user?.companyInfo?.countryInfo?.name
          ? user?.companyInfo?.countryInfo?.name
          : "-"
        }<br>
                    ${user?.companyInfo?.tax === "gst"
          ? `GSTIN:${user?.companyInfo?.taxno}`
          : `VAT No: ${user?.companyInfo?.taxno}`
        }<br>
             ${user?.companyInfo?.cphoneno ? user?.companyInfo?.cphoneno : ""}
                </td>
                <td style="width: 50%;">
                    <strong>To</strong><br>
                     ${customer?.bus_name ? `${customer?.bus_name}<br> ` : ""}
                     ${customer?.address ? `${customer?.address} <br> ` : ""}
                     ${customer?.mobile ? `${customer?.mobile} <br> ` : ""}
                     ${customer?.email ? `${customer?.email} <br> ` : ""}
                     ${user?.companyInfo?.tax === "gst" ?
                   `GSTIN${customer?.vat_number}<br>` : `${customer?.vat_number} <br>`}
                </td>
            </tr>
        </table>
        <table>
             <tr style="border-bottom: 1px solid black;">
             <th style="width: 300px;">Product Name[${user?.companyInfo?.tax === "gst" ? "HSN":"Item Code"}]</th>
              <th style="width: 50px;">Rate</th>
              ${path == "Service" ? "" : `<th style="width: 50px;">Qtn</th>`}
              <th style="width: 100px;">Discount(Amt & %)</th>
              ${user?.companyInfo?.tax === "vat"
          ? `<th style="width: 100px;">Vat(Amt & %)</th>`
          : gstType
            ? `<th style="width: 100px;">CGST(Amt & %)</th>
               <th style="width: 100px;">SGST(Amt & %)</th>`
            : `<th style="width: 100px;">GST(Amt & %)</th>`
        }
        <th style="width: 100px;">Total</th>
    </tr>
    <tbody class="main-table main-table1">
        ${item.map((product: any,index:number) => `
        <tr class=${item?.length-1===index?"lineitem":"lineheightitem"}>
            <td>${product?.description ? product?.description : ""}[${user?.companyInfo?.tax === "gst" ? product?.product?.hsn_code : product?.product?.idescription}]</td>
            <td>${product?.costprice ? product?.costprice : ""}</td>
            ${path == "Service" ? "" : `<td>${product?.quantity ? product?.quantity : ""}</td>`}
            <td>${product?.discount ? product?.discount : "-"}</td>
            ${user?.companyInfo?.tax === "vat"
            ? `<td>${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
            : gstType
              ? `<td>${product?.incomeTaxAmount / 2} @ ${product?.incomeTax / 2}</td>
                       <td>${product?.incomeTaxAmount / 2} @ ${product?.incomeTax / 2}</td>`
              : `<td>${product?.incomeTaxAmount} @ ${product?.incomeTax}</td>`
          }
            <td>${product?.total ? `${user?.companyInfo?.countryInfo?.symbol}${product?.total}` : ""}</td>
        </tr>`).join('')}
        </table>
        <table>
        <tr style="border-top:  1px solid black;">
            <td rowspan="2" style="width: 431px;border-bottom:none;">Notes: ${sale?.quotes == null ? "" : sale?.quotes || ""}</td>
            <td colspan="2" style="width:185px; border-bottom:none;">Taxable Value</td>
            <td style="border-bottom:none;">${netTotal ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(netTotal.toFixed(2))}` : ""}</td>
        </tr>
        <tr style="border-top:none;">
            <td colspan="2" style="width:185px; border-bottom:none;border-top:none;">${user?.companyInfo?.tax === "gst" ? "Total GST" : "Total VAT"}</td>
            <td style="border-bottom:none;border-top:none;">${vatTotal ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(vatTotal.toFixed(2)) || ""}` : ""}</td>
        </tr>
        <tr style="border-top:none;">
            <td rowspan="3" style="width: 431px;border-top:none;"><span>Terms: ${sale?.terms == null ? "" : sale?.terms || ""}</span></td>
            <td colspan="2" style="width: 185px; border-top: none;">Overall Discount</td>
            <td style="border-top: none;">${Discount ? `${user?.companyInfo?.countryInfo?.symbol} ${parseFloat(Discount)?.toFixed(2) || 0}` : ""}</td>
        </tr>
        <tr style="border-bottom:  1px solid black;">
            <td colspan="2" style="width="185px;">Grand Total</td>
            <td>${sale.total ? `${user?.companyInfo?.countryInfo?.symbol} ${Number(sale.total).toFixed(2)}` : ""}</td>
        </tr>
    </tbody>
</table>
            ${selectedBank
          ? `
        <table>
            <tbody class="main-table">
             <tr><td colspan="6"><b>Company's Bank Details</b></td></tr>
                <tr><td colspan="6" > ${selectedBank?.laccount == "" || selectedBank?.laccount == null
            ? ""
            : `
              Bank Name: ${selectedBank?.laccount}<br>`
          }</td></tr>
                <tr><td colspan="6">${selectedBank?.accountname == "" || selectedBank?.accountname == null
            ? "" : `Account Name : ${selectedBank?.accountname}<br />`}</td></tr>
                <tr><td colspan="6"> ${selectedBank?.branch == "" || selectedBank?.branch == null ? "" : `
                  Branch: ${selectedBank?.branch}
                  <br>`}</td></tr>
                <tr><td colspan="6">${selectedBank?.ifsc == "" || selectedBank?.ifsc == null ? "" : `
                  IFSC: ${selectedBank?.ifsc}
                  <br>` }</td></tr>
                <tr>
                    <td colspan="3" style="border-right: none; border-bottom:  1px solid black;">
                        <p>Thank you. Have a great day!</p>
                    </td>
                    <td  colspan="3" style="border-left: none; border-bottom:  1px solid black;">
                        <p style="text-align-last: end;">Signatory</p>
                    </td>
                </tr>
            </tbody>
        </table>`: ""}
    </table>`)}
</body>
</html>
   `;
  } catch (error) {
    console.log("err", error);
  }
};

export { template1, template2, template3, template4, template5};
