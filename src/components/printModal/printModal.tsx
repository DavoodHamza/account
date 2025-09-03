import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

function PrintModal({ open, modalClose, template, navigation, width, pageSize = "POS-80" }: any) {
  const navigate = useNavigate();

  const getPageSizeStyles = (size: string) => {
    const pageSizes: { [key: string]: { width: string; height: string; margin: string } } = {
      // POS and Small sizes
      "POS-58": { width: "58mm", height: "200mm", margin: "2mm" },
      "POS-80": { width: "80mm", height: "200mm", margin: "2mm" },
      "Receipt": { width: "80mm", height: "300mm", margin: "2mm" },
      "Small-Invoice": { width: "100mm", height: "150mm", margin: "3mm" },
      "A6": { width: "105mm", height: "148mm", margin: "5mm" },
      // Standard sizes
      "A0": { width: "841mm", height: "1189mm", margin: "20mm" },
      "A1": { width: "594mm", height: "841mm", margin: "15mm" },
      "A2": { width: "420mm", height: "594mm", margin: "15mm" },
      "A3": { width: "297mm", height: "420mm", margin: "10mm" },
      "A4": { width: "210mm", height: "297mm", margin: "10mm" },
      "A5": { width: "148mm", height: "210mm", margin: "8mm" },
      "Letter": { width: "8.5in", height: "11in", margin: "0.5in" },
      "Legal": { width: "8.5in", height: "14in", margin: "0.5in" },
    };

    return pageSizes[size] || pageSizes["A4"];
  };

  const handlePrint = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = template;
    
    const pageStyles = getPageSizeStyles(pageSize);
    
    // Determine if it's a small POS size
    const isSmallPOS = pageSize.includes("POS") || pageSize === "Receipt" || pageSize === "Small-Invoice" || pageSize === "A6";
    
    const printWindow: any = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print - ${pageSize}</title>
          <style>
            @page {
              size: ${pageSize};
              margin: ${pageStyles.margin};
            }
            body {
              width: ${pageStyles.width};
              height: ${pageStyles.height};
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: ${isSmallPOS ? "8px" : "12px"};
              line-height: ${isSmallPOS ? "1.2" : "1.4"};
            }
            .print-container {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            ${isSmallPOS ? `
            table {
              font-size: 8px !important;
              border-collapse: collapse;
            }
            th, td {
              padding: 2px !important;
              font-size: 8px !important;
            }
            h1, h2, h3 {
              font-size: 10px !important;
              margin: 2px 0 !important;
            }
            .company-name {
              font-size: 10px !important;
              font-weight: bold;
            }
            ` : ''}
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCancel = () => {
    modalClose(false);
    if (!navigation) {
      navigate(-1);
    }
  };
  return (
    <Modal
      open={open}
      onOk={handlePrint}
      onCancel={handleCancel}
      width={width ? width : "75%"}
      title={`Print Preview - ${pageSize}`}
      okText="Print"
      cancelText="Cancel"
    >
      <div dangerouslySetInnerHTML={{ __html: template }} />
    </Modal>
  );
}

export default PrintModal;
