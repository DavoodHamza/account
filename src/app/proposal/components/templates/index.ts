import API from "../../../../config/api";
import { Store } from "../../../../redux/store";
import { template1 } from "./template1";
import { template2 } from "./template2";
import { template3 } from "./template3";

export const generatePDF = (data: any, temp: any) => {
  const page =
    temp === "template1"
      ? template1(data)
      : temp === "template2"
      ? template2(data)
      : temp === "template3"
      ? template3(data)
      : "";

  const element = document.createElement("div");
  element.innerHTML = page;

  const generateAndDownloadPDF = async (data: any, template: any) => {
    try {
      const pdf_url = API.PDF_GENERATE_URL;
      let templateContent = template.replace("\r\n", "");
      templateContent = templateContent.replace('\\"', '"');
      const encodedString = btoa(templateContent);

      const pdfData = {
        filename: data.proposal_title,
        html: encodedString,
        isDownload: true,
        sendEmail: false,
        type: "",
        userid: "",
      };

      const User: any = Store.getState().User;
      const token = User.token;

      const response = await fetch(pdf_url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const pdfBlob = await response.arrayBuffer();
      const blob = new Blob([pdfBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error in PDF generation and download:", error);
    }
  };

  generateAndDownloadPDF(data, page);
};
