import moment from "moment";

const DaySummaryTemplate = ({
  user,
  data,
  endDate,
  firstDate,
  personalData,
}: any) => {
  try {
    const fDate = new Date(firstDate);
    const ldate = new Date(endDate);

    const getOrdinalDay = (day: any) => {
      const suffixes = ["th", "st", "nd", "rd"];
      const relevantDigits = day < 30 ? day % 20 : day % 30;
      const suffix =
        relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];
      return `${day}${suffix}`;
    };

    const getMonthName = (month: any) => {
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
    };
    const formattedCurrentDate: any = `${getOrdinalDay(
      fDate.getDate()
    )} ${getMonthName(fDate.getMonth())} ${fDate.getFullYear()}`;
    const formattedEndDate: any = `${getOrdinalDay(
      ldate.getDate()
    )} ${getMonthName(ldate.getMonth())} ${ldate.getFullYear()}`;

    console.log(
      formattedCurrentDate,
      ":formattedCurrentDate==========================formattedEndDate:",
      formattedEndDate
    );

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
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
        <style>
        .main-table {
          border-collapse: collapse;
        }

        .main-table th, .main-table td {
            border: 1px solid black;
        }
        </style>
      </head>
      <body style="width: 100%; align-content: center; margin: auto">
        <div style="margin: 20px">
          <table style="margin-top: 60px !important; margin: auto; width: 100%">
            <tbody>
              <tr style="text-align: center; font-size: 17px; font-weight: bold; text-transform: uppercase; height: 25px;">
                <td colspan="3">${personalData?.bname || ""}</td>
              </tr>
              <tr style="text-align: center; font-size: 14px; height: 25px;">
                <td colspan="3">${personalData?.fulladdress || ""}</td>
              </tr>
              <tr style="text-align: center; font-size: 14px; height: 25px;">
                <td colspan="3">${
                  user?.companyInfo?.tax === "gst"
                    ? "GSTIN/UIN"
                    : "VAT Number"
                }:${personalData?.taxno}</td>
              </tr>
              <tr style="text-align: center; font-size: 14px; height: 25px;">
                <td colspan="3"><b>Day Summary Report</b></td>
              </tr>
                <tr style="text-align: center; font-size: 14px; height: 25px;">
                <td colspan="3"><b>${formattedCurrentDate} - ${formattedEndDate}</b></td>
              </tr>
              <tr style="text-align: center; font-size: 16px; font-weight: bold; text-transform: uppercase;"></tr>
              <tr style="text-align: center; font-size: 14px;"></tr>
            </tbody>
          </table>


          <table class="main-table" style="margin-top: 60px !important; margin: auto; width: 100%">
            <tbody style="text-align: center;">
              <tr>
                <td><b>SL No</b></td>
                <td><b>Date</b></td>
                <td><b>Voucher Type</b></td>
                <td><b>Ledger Name</b></td>
                <td><b>Debit</b></td>
                <td><b>Credit</b></td>
              </tr>
              ${data?.allData
                ?.map((allDataItem: any, allDataIndex: any) =>
                  allDataItem?.values?.map(
                    (item: any, itemIndex: any) =>
                      `<tr key="${allDataIndex}-${itemIndex}">
                    ${
                      itemIndex === 0
                        ? `
                      <td rowSpan="${
                        allDataItem?.values?.length
                      }" style="vertical-align: middle; text-align: center;">
                        ${allDataIndex + 1}
                      </td>
                      <td rowSpan="${
                        allDataItem?.values?.length
                      }" style="vertical-align: middle; text-align: center;">
                        ${moment(allDataItem?.date).format("DD-MM-YYYY")}
                      </td>
                      <td rowSpan="${
                        allDataItem?.values?.length
                      }" style="vertical-align: middle; text-align: center;">
                        ${allDataItem?.type}
                      </td>`
                        : ``
                    }
                    <td >${item?.ledgerName}</td>
                    <td>${item?.debit}</td>
                    <td>${item?.credit}</td>
                  </tr>`
                  )
                )
                .join("")}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td><strong>Total</strong></td>
                <td><strong>${Number(data?.totalDebit).toFixed(2)}</strong></td>
                <td><strong>${Number(data?.totalCredit).toFixed(
                  2
                )}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>`;
  } catch (error) {
    console.log("Error:", error);
    return "";
  }
};

export { DaySummaryTemplate };
