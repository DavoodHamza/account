import moment from "moment";
import API from "../../../../config/api";

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
                      font-size: 20px;
                      font-weight: bold;
                      text-transform: uppercase;
                      text-decoration: underline;">
                      <td colspan="3">${pagetype ? pagetype : "Receipt"}</td>
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
                      <td><b>VAT Number</b></td>
                      <td><b>Telephone</b></td>
                      <td><b>E-mail</b></td>
                      <td></td>
                  </tr>
                  <tr>
                      <td>
  
                          ${user?.companyInfo?.taxregno}
  
  
                      </td>
                      <td>
  
                          ${user?.phonenumber}
                      </td>
                      <td>
  
                          ${user?.email}
                      </td>
                      <td></td>
                  </tr>
              </tbody>
          </table>
          <hr>
          <table style="margin: auto;width: 100%;">
              <tbody>
                  <tr>
                      <td width="25%"><b>Customer Reference</b></td>
                      <td width="25%">
  
                          ${customer?.reference || ""}
                      </td>
                      <td width="25%"><b>Invoice No</b></td>
                      <td width="25%">
  
                          ${sale?.invoiceno || ""}
                      </td>
                  </tr>
                  <tr>
                      <td width="25%" style="vertical-align:super;"><b>Customer Details</b></td>
                      <td width="25%">
  
                          ${customer?.name || ""}
                          <br />
                          ${customer?.bus_name || ""}
  
                          <br />
                          ${customer?.email || ""}
  
                      </td>
                      <td><b>Invoice Date</b></td>
                      <td>
                          ${moment(sale?.sdate).format("DD/MM/YYYY")}
  
                      </td>
                  </tr>
                  <tr>
                      <td style="vertical-align:super;"><b>Invoice Address</b></td>
                      <td>
                          ${sale?.inaddress || ""}
                      </td>
                      <td><b>Due Date</b></td>
                      <td>
                          ${moment(sale?.ldate).format("DD/MM/YYYY")}
  
                      </td>
                  </tr>
                  <tr>
                      <td style="vertical-align:super;"><b>Delivery Address</b></td>
                      <td>
                          ${sale?.deladdress || ""}
  
                      </td>
                      <td><b>Reference</b></td>
                      <td>${sale?.reference || ""}</td>
                  </tr>
              </tbody>
          </table>
          <table style="margin-top: 25px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                      <td style="height: 40px;" width="12%"><b>
                              Product/Service
                          </b></td>
                      <td width="12%"><b>
                              Description
                          </b></td>
                      <td width="12%"><b>Qty/Hrs</b></td>
                      <td width="12%"><b>Price/Rate</b></td>
                      <td width="12%"><b>Discount</b></td>
                      <td width="12%"><b>% GST/VAT</b></td>
                      <td width="12%"><b>GST/VAT</b></td>
                      <td width="12%"><b>Total</b></td>
                  </tr>
                  ${productlist
                    .map(
                      (product: any) => `
                  <tr style="font-size: 12px;">
                      <td>
                          ${product?.icode || ""}
                      </td>
                      <td>
                          ${product?.description || ""}
                      </td>
                      <td>
                          ${product?.quantity || ""}
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
                      <td width="20%"><b>VAT</b></td>
                      <td width="20%"><b>
                              ${parseFloat(vatTotal?.toFixed(2))}
  
                          </b></td>
                  </tr>
                  <tr style="font-size: 12px;">
                      <td width="30%"></td>
                      <td width="30%"></td>
                      <td width="20%"><b>Net</b></td>
                      <td width="20%"><b>
                              ${parseFloat(netTotal?.toFixed(2))}
  
                          </b></td>
                  </tr>
                  <tr style="background: gray;color: white;text-align: center;font-size: 12px;">
                      <td style="height: 35px;" colspan="2" width="12%"></td>
                      <td width="5%"><b>Total</b></td>
                      <td width="5%" style="color: black;"><b>
                              ${user?.companyInfo?.countryInfo?.symbol || ""}${total || ""}
                          </b>
  
                      </td>
                  </tr>
  
                  <tr style="text-align:right">
                      <td colspan="4">${"(" + sale?.totalText + ")" || ""}</td>
                  </tr>
  
              </tbody>
          </table>
          <table style="border-spacing: 0px;margin-top: 10px !important;margin: auto;width: 100%;">
              <tbody style="text-align: center;">
                  <tr style="border: none;background: lightgray;color: black;text-align: center;font-size: 12px;">
                      <td rowspan="2" width="52%" style="border: none;height: 60px;" colspan="2" width="12%">
                          <b>Invoice Descriptions</b>
                          <p style="text-align:justify;margin-left:12px;">
                              ${sale?.quotes || ""}
                              .</br>
                            
                          </p>
  
                          <br>
                          <br>
                          <b>Terms and Conditions</b>
                          <p style="text-align:justify;margin-left:12px;">
                              ${sale?.terms || ""}
                              .</br>
                             
                          </p>
                      </td>
                      <td width="12%" style="border-bottom: 1px solid gray;"><b>GST/VAT Rate</b></td>
                      <td width="12%" style="border-bottom: 1px solid gray;"><b>Net</b></td>
                      <td width="12%" style="border-bottom: 1px solid gray;"><b>GST/VAT</b></td>
                      <td width="12%" style="border-bottom: 1px solid gray;"><b>Total</b></td>
                  </tr>
                  <tr style="border: none;background: lightgray;color: black;text-align: center;font-size: 12px;">
                      <td width="12%" style="border: none;">
  
                          ${parseFloat(vatRate?.toFixed(2))}
  
                      </td>
                      <td width="12%" style="border: none;">
  
                          ${parseFloat(netTotal?.toFixed(2))}
  
                      </td>
                      <td width="12%" style="border: none;">
  
                          ${parseFloat(vatTotal?.toFixed(2))}
  
                      </td>
                      <td width="12%" style="border: none;">
  
                          ${user?.companyInfo?.countryInfo?.symbol || ""} ${
      sale?.total || ""
    }

  
                      </td>
                  </tr>
              </tbody>
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
                ${user?.fullName || ""}
            </td>
            <td>
                ${bankInf?.bankInf?.laccount || ""}
            </td>
            <td>
                ${bankInf?.paidmethod || ""}
            </td>
            <td>
                ${bankInf?.amount}
            </td>
            <td>
                ${moment(bankInf?.date).format("DD/MM/YYYY")}
            </td>
            <td>
                ${bankInf?.type}
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
  user,
  country,
  productlist,
  netTotal,
  vatTotal,
  bankList,
  isPaymentInfo,
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
                  ${product?.description || "-"}
              </td>
              <td>
                  ${product?.quantity || ""}
              </td>
              <td>
                  ${product?.costprice || ""}
              </td>
              <td style="text-align: center;">
                  ${product?.discount || "-"}
              </td>
              <td style="text-align: center;">
                  ${product?.incomeTaxAmount || "0 @ 0.00"}
              </td>
              <td style="text-align: right;">
                  ${
                    product?.total
                      ? `${user?.companyInfo?.countryInfo?.symbol || ""}${
                          product?.total || ""
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
                ${bankInf?.paidmethod || ""}
            </td>
            <td style="text-align: center;">
                ${moment(bankInf?.date).format("DD/MM/YYYY") || ""}
            </td>
            <td style="text-align: center;">
                ${bankInf?.type || ""}
            </td>
            <td style="text-align: right;">
                ${
                  bankInf?.amount
                    ? `${user?.companyInfo?.countryInfo?.symbol || ""}${
                        bankInf?.amount || ""
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
    
    <body style="align-content: center;margin: auto;">
        <div style="margin: 10px;">
            <table style="margin: auto;
            width: 100%;
            text-align: right;
            padding: 8px;
            font-size: 14px;">
                <tbody style="text-align: right; line-height: 20px;">
                 
                    <tr style="text-align: center;
                        font-size: 20px;
                        font-weight: bold;
                        text-transform: uppercase;
                        text-decoration: underline;">
                        <td colspan="3">${pagetype ? pagetype : "Receipt"}</td>
                    </tr>
                    <tr>
                        <td width="50%" style="text-align:left; color: #c2347f; font-size: 20px;">${
                          sale?.invoiceno
                        }</td>
                        <td width="50%" style="text-align: right;">
                            ${
                              saleComplete
                                ? `
                            <div>
                                <div style="padding: 5px;
                                        float: right;
                                        text-align: center;
                                        border: 1px solid green;
                                        border-radius: 4px;
                                        color: green;
                                        font-weight: 700;
                                        font-size: 12px;
                                        width: 32px;">Paid</div>
                            </div>`
                                : ""
                            }
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:left;"><b>${
                          customer?.name || "-"
                        }</b></td>
                        <td style="text-align:right;"><b>${
                          user?.companyInfo?.bname || "-"
                        }</b></td>
                    </tr>
                    <tr>
                        <td style="text-align:left;">${
                          customer?.bus_name || "-"
                        }</td>
                        <td style="text-align:right;">${
                          user?.companyInfo?.fullAddress || "-"
                        }<br>${country?.name || ""}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left;">Phone: ${
                          customer?.mobile || ""
                        }</td>
                        <td style="text-align: right;">Tax Reg. No.: ${
                          user?.taxregno || ""
                        }<br>Phone: ${user?.phonenumber || ""}</td>
                    </tr>
                    <tr>
                        <td style="text-align:left;">Email: ${
                          customer?.email || ""
                        }</td>
                        <td style="text-align: right;">Email: ${
                          user?.email || ""
                        }</td>
                    </tr>
                </tbody>
            </table>
            <table style="margin: auto;
                width: 100%;
                border-spacing: 0px;
                text-align: right;
                background: #c43281;
                color: white;
                font-size: 14px;">
                <tbody style="text-align: center;">
                    <tr style="line-height: 40px;font-size: 12px;">
                        <td width="50%" style="border: 1px solid white;">Total Due &nbsp; <span
                                style="font-size: 20px;">${
                                  user?.companyInfo?.countryInfo?.symbol || ""
                                }${sale?.outstanding || ""}</span>
                        </td>
                        <td width="50%" style="border: 1px solid white;">Due Date &nbsp; <span
                                style="font-size: 20px;">${moment(
                                  sale?.ldate
                                ).format("DD/MM/YYYY")}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
    
            <table style="margin-top: 5px !important;margin: auto;width: 100%;">
                <tbody style="text-align: left;">
                    <tr
                        style="background: white;color: #c43281;text-align: left; font-size: 10px; text-transform: uppercase;">
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Invoice
                            No</td>
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Sales
                            Reference</td>
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Invoice
                            Date</td>
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Due
                            Date</td>
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Total
                            Amount</td>
                    </tr>
                    <tr style="font-size: 12px;">
                        <td>${sale?.invoiceno || ""}</td>
                        <td>${sale?.reference || ""}</td>
                        <td>${
                          moment(sale?.date).format("DD/MM/YYYY") || ""
                        }</td>
                        <td>${
                          moment(sale?.ldate).format("DD/MM/YYYY") || ""
                        }</td>
                        <td>${user?.companyInfo?.countryInfo?.symbol}${netTotal || ""}</td>
                    </tr>
                </tbody>
            </table>
    
            <table style="margin-top: 5px !important;margin: auto;width: 100%;">
                <tbody style="text-align: left;">
                    <tr
                        style="background: white;color: #c43281;text-align: left; font-size: 10px; text-transform: uppercase;">
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Billing
                            Information</td>
                        <td style="height: 40px; border-bottom: 1px solid #ddd; font-weight: bold; padding: 8px;">Shipping
                            Information</td>
                    </tr>
                    <tr style="font-size: 12px;">
                        <td>${user?.companyInfo?.bname || ""}<br>${
    user?.companyInfo?.fullAddress || ""
  }<br>${user?.companyInfo?.phonenumber || ""}<br>${
    user?.companyInfo?.email || ""
  }</td>
                        <td>${customer?.bname || ""}<br>${
    customer?.address || ""
  }<br>${customer.mobile || ""}<br>${customer?.email || ""}</td>
                    </tr>
                </tbody>
            </table>
    
            <table style="margin-top: 5px !important;margin: auto;width: 100%;">
                <thead>
                    <tr
                        style="background: #c43281;color: white;text-align: left; font-size: 10px; text-transform: uppercase;">
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Product Code</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Description</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Unit Price</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Discount</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Income Tax</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Total</th>
                    </tr>
                </thead>
                <tbody style="font-size: 12px;">
                    ${generateProductRows()}
                </tbody>
            </table>
    
            <table style="margin-top: 5px !important;margin: auto;width: 100%;">
                <tr>
                    <td style="padding: 8px;text-align: right;font-weight: bold;">Total Before VAT:
                        ${user?.companyInfo?.countryInfo?.symbol}${
    parseFloat(netTotal.toFixed(2)) || ""
  }</td>
                </tr>
                <tr>
                    <td style="padding: 8px;text-align: right;font-weight: bold;">Total VAT:
                        ${user?.companyInfo?.countryInfo?.symbol}${
    parseFloat(vatTotal.toFixed(2)) || ""
  }</td>
                </tr>
                <tr>
                    <td style="padding: 8px;text-align: right;font-weight: bold;">Grand Total:
                        ${user?.companyInfo?.countryInfo?.symbol}${
    sale.outstanding || ""
  }</td>
                </tr>
            </table>
    
            ${
              isPaymentInfo
                ? `
            <table style="margin-top: 5px !important;margin: auto;width: 100%;">
                <thead>
                    <tr
                        style="background: #c43281;color: white;text-align: left; font-size: 10px; text-transform: uppercase;">
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Account</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Nominal Code</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Payment Method</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Date</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Type</th>
                        <th style="border-bottom: 1px solid #ddd; padding: 8px;">Amount</th>
                    </tr>
                </thead>
                <tbody style="font-size: 12px;">
                    ${generateBankInfoRows()}
                </tbody>
            </table>`
                : ""
            }
        </div>
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
            <td colspan="3"> ${pagetype ? pagetype : "Invoice"}</td>
          </tr>
          <tr style="text-align: right;">
            <td></td>
          </tr>
          <tr style="line-height:25px;">
            <td style="text-align: left"><img style="border-radius: 50%;width: 180px;"
                src="${API.FILE_PATH}logo/${
                  user?.companyInfo?.logo
                }" />
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
                Due Date: ${moment(sale?.ldate).format("DD/MM/YYYY")}<br>
                Reference: ${sale?.reference}</b>
            </td>
          </tr>
        </tbody>
      </table>
  
      <table style="margin-top: 10px !important;margin: auto;width: 100%;">
        <tbody style="text-align: center;">
          <tr
            style="background: black;color: white;text-align: center;font-size: 10px; text-transform: uppercase;">
            <td width="12%"><b>Product</b></td>
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
            <td style="text-align: right;"><b>Total VAT</b></td>
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
                  ${sale.quotes}
                </p>
                <br>
                <br>
                <b>Terms and Conditions</b><br><br>
                <p style="text-align:justify;margin-left:12px;">
                ${sale.terms}
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
            style="width:50%;border-bottom:1px solid gray;border-right:1px solid gray;border-left:1px solid gray;padding-left:120px">
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

export { template1, template2, template3 };
