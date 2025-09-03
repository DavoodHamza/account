// import { exportDataGrid } from "devextreme/excel_exporter";
// import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
// import { Workbook } from "exceljs";
// import { jsPDF } from "jspdf";
// import saveAs from "file-saver";
// import { notification } from "antd";

// function EXPORT(e: any, dataGridRef: any, doc: any, customizeCell: any) {
//   if (!dataGridRef?.current?.props?.dataSource?.length) {
//     notification.error({  
//       message: "No Rows Selected",
//     });
//     return;
//   }
//   if (e.format === "pdf") {
//     const document: any = new jsPDF();
//     const dataGrid = dataGridRef.current.instance;
//     exportDataGridToPdf({
//       jsPDFDocument: document,
//       component: dataGrid,
//       customizeCell({ gridCell, pdfCell }) {
//         customizeCell("pdf",gridCell, pdfCell);
//       },
//     }).then(() => {
//       document.save(`${doc}.pdf`);
//     });
//   } else if (e.format === "xlsx") {
//     const workbook = new Workbook();
//     const worksheet = workbook.addWorksheet("Main sheet");
//     exportDataGrid({
//       component: e.component,
//       worksheet: worksheet,
//       customizeCell: function ({excelCell,gridCell}) {
//         excelCell.font = { name: "Arial", size: 12 };
//         excelCell.alignment = { horizontal: "left" };
//         customizeCell("xlsx",gridCell, excelCell);
//       },
//     }).then(function () {
//       workbook.xlsx.writeBuffer().then(function (buffer) {
//         saveAs(
//           new Blob([buffer], { type: "application/octet-stream" }),
//           `${doc}.xlsx`
//         );
//       });
//     });
//   }
// }

// export { EXPORT };



import { exportDataGrid } from "devextreme/excel_exporter";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { Workbook } from "exceljs";
import { jsPDF } from "jspdf";
import saveAs from "file-saver";
import { notification } from "antd";

function EXPORT(e:any, dataGridRef:any, doc:any, customizeCell:any) {
  const dataGrid = dataGridRef?.current?.instance;
  if (!dataGrid) {
    notification.error({
      message: "Error",
      description: "DataGrid reference is not available.",
    });
    return;
  }

  const dataItems = dataGrid.getDataSource().items();
  if (!dataItems.length) {
    notification.error({
      message: "No Rows Available",
      description: "There is no data to export.",
    });
    return;
  }

  try {
    if (e.format === "pdf") {
      const document = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: document,
        component: dataGrid,
        customizeCell: ({ gridCell, pdfCell }) => {
          if (typeof customizeCell === "function") {
            customizeCell("pdf", gridCell, pdfCell);
          }
        },
      }).then(() => {
        document.save(`${doc}.pdf`);
        notification.success({
          message: "Export Successful",
          description: `${doc}.pdf has been exported.`,
        });
      }).catch((error) => {
        notification.error({
          message: "PDF Export Failed",
          description: error.message,
        });
      });
    } else if (e.format === "xlsx") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Main sheet");
      exportDataGrid({
        component: dataGrid,
        worksheet: worksheet,
        customizeCell: ({ gridCell, excelCell }) => {
          excelCell.font = { name: "Arial", size: 12 };
          excelCell.alignment = { horizontal: "left" };
          if (typeof customizeCell === "function") {
            customizeCell("xlsx", gridCell, excelCell);
          }
        },
      }).then(() => {
        return workbook.xlsx.writeBuffer();
      }).then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          `${doc}.xlsx`
        );
        notification.success({
          message: "Export Successful",
          description: `${doc}.xlsx has been exported.`,
        });
      }).catch((error) => {
        notification.error({
          message: "Excel Export Failed",
          description: error.message,
        });
      });
    }
    e.cancel = true; 
  } catch (error:any) {
    notification.error({
      message: "Export Error", 
      description: error.message || "An unexpected error occurred.",
    });
  }
}

export { EXPORT };