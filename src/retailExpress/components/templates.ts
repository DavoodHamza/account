const printTemplate = ({
    columns,
    total,
    total_vat,
    taxable_value,
    toPaidAmount,
    payReturn,
    CASHIER,
    RECEIPT,
    NO,
    DATE,
    TIME,
    companyInfo
}: any) => {
    try {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Receipt</title>
<style>
  body {
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
  }
  .receipt-container {
    margin: 20px 0;
    text-align: left;
  }
  .header, .totals, .footer {
    text-align: center;
    border-bottom: 1px dashed #000;
  }
  .header h2 {
    margin: 0;
  }
  .header p, .totals p, .footer p {
    margin: 5px 0;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  .table th, .table td {
    font-size: 14px;
    text-align: left;
    padding: 5px 0;
  }
  .table .price, .table .amount, .table .vat {
    text-align: right;
  }
  .table th {
    border-bottom: 1px dashed #000;
    border-top: 1px dashed #000;
  }
  .table tr:last-child th, .table tr:last-child td {
    border-bottom: 1px dashed #000;
  }
  .totals{
    font-size: 14px;
    text-align: right;
  }
  .totals h3{
    margin: 0;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
  .mainFooter p, .mainFooter h4 {
    margin: 0;
  }
  .subHeader{
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  }
  .subHeader p{
    margin: 5px 0px 0px 0px;
  }
  .mainFooter {
    text-align: center;
    margin-top: 5px;
    border-top: 1px dashed #000;
  }
</style>
</head>
<body>
<div class="receipt-container">
  <div class="header">
    <h2>${companyInfo.bname ? companyInfo.bname : '____'}</h2>
    <p>${companyInfo.city ? companyInfo.city : '___'} / ${companyInfo.fulladdress ? companyInfo.fulladdress : '___'}</p>
    <p>Tel: ${companyInfo.cphoneno ? companyInfo.cphoneno : '___'}</p>
    <p>VAT REG.NO ${companyInfo.taxno ? companyInfo.taxno : '____'}</p>
  </div>
  <div class="subHeader">
    <div>
      <p>TABLE NO: ${NO}</p>
      <p>RECEIPT: ${RECEIPT}</p>
      <p>CASHIER: ${CASHIER}</p>
    </div>
    <div style="text-align: right; display: flex; flex-direction: column; justify-content: end">
      <p>DATE: ${DATE}</p>
      <p> TIME: ${TIME}</p>
    </div>
  </div>
  <table class="table">
    <tr>
        <th>QTY</th>
        <th>DESCRIPTION</th>
        <th class="price">PRICE</th>
        <th class="vat">VAT</th>
        <th class="amount">AMOUNT</th>
    </tr>
    ${columns.map((product: any) => `
        <tr>
            <td>${product.quantity || ""}</td>
            <td>${product.description || ""}</td>
            <td class="price">${product.price || ""}</td>
            <td class="vat">${product.vat || ""}</td>
            <td class="amount">${product.total || ""}</td>
        </tr>
    `).join("")}
</table>
  <div class="totals">
    <p>SUBTOTAL  ${taxable_value}</p>
    <h3>TOTAL  ${total}</h3>
    <p>VAT  ${total_vat}</p>
    <p>CASH  ${toPaidAmount}</p>
    <p>CHANGE   ${payReturn}</p>
  </div>
  <div class="mainFooter">
    <h3>THANK YOU</h3>
    <p>Powerd By</p>
    <h4>Tax GO Global</h4>
  </div>
</div>
</body>
</html>
        `;
    } catch (error) {
        console.log("err", error);
    }
};

export { printTemplate };
