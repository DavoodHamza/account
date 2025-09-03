import { Button, Card, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { MdFileDownload } from "react-icons/md";
import { useParams } from "react-router";
import API from "../../config/api";
import { GETWITHBASE } from "../../utils/apiCalls";
import { template3 } from "../sales/components/templates";

const DigitalInvoice = () => {
  const { type, id }: any = useParams();
  const [data, setData] = useState<any>({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [template, setTemplate] = useState("<html><body></body></html>");
  useEffect(() => {
    getDatas();
  }, []);

  const getDatas = async () => {
    try {
      const url = API.SHARE_INVOICE + type + "/" + id;
      const response: any = await GETWITHBASE(url, {});
      setData(response.data);

      let obj = {
        user: response.data?.userInfo,
        customer: response.data?.invoiceDetails?.customer,
        sale: response.data?.invoiceDetails,
        productlist: response.data?.invoiceItems,
        bankList: response.data?.banking,
        vatTotal: Number(response.data?.invoiceDetails.total_vat),
        netTotal: Number(response.data?.invoiceDetails?.taxable_value),
        total: response.data?.invoiceDetails?.total,
        vatRate: 1000,
        isPaymentInfo: false,
        pagetype: "Invoice",
      };
      let _template = template3(obj);
      setTemplate(_template);
    } catch (error) {
      console.log(error);
    }
  };

  const downLoadPdf = async (templates: any) => {
    try {
      setDownloadLoading(true);
      let templateContent = templates.replace("\r\n", "");
      templateContent = templateContent.replace('\\"', '"');
      const encodedString = btoa(templateContent);
      const pdf_url = API.PDF_GENERATE_URL;
      const pdfData = {
        filename: "Sales Invoice",
        html: encodedString,
        isDownload: true,
        sendEmail: false,
        type: "",
        userid: "",
      };

      const response = await fetch(pdf_url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
      a.download = `sales${data?.invoiceDetails?.customer?.bus_name}_${
        data?.invoiceDetails?.invoiceno
      }_${moment(new Date()).format("DD-MM-YYYY")}`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadLoading(false);
    } catch (error) {
      setDownloadLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <div style={{ display: "flex", justifyContent: "end", padding: 5 }}>
          <Tooltip
            title="Download Invoice"
            mouseEnterDelay={0.5}
            arrow={false}
            color="white"
            overlayClassName="toolTip-Card"
            overlayInnerStyle={{
              color: "#000000",
              marginTop: 5,
              fontSize: "14px",
            }}
            placement={"bottom"}
          >
            <Button
              onClick={() => downLoadPdf(template)}
              loading={downloadLoading}
            >
              <MdFileDownload size={20} style={{color: "orange"}}/>
            </Button>
          </Tooltip>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: template,
          }}
        />
      </Card>
    </Container>
  );
};

export default DigitalInvoice;
