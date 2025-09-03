import { useEffect, useRef, useState } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Button, Card, notification } from "antd";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { HSNReportTemplate } from "../HsnCode/components/template";
import moment from "moment";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";

const columns = [
  {
    name: "hsn_code",
    title: "HSN/SAC",
    dataType: "string",
    alignment: "center",
  },
  {
    name: "description",
    title: "Description",
    dataType: "string",
  },
];

const HsnCodeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const [emailModal, setEmailModal] = useState(false);
  const dataGridRef: any = useRef(null);
  const exportFormats = ["xlsx", "pdf"];
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { t } = useTranslation();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const fetchHsnCodes = async () => {
    try {
      setIsLoading(true);
      let url = API.HSN_CODE_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHsnCodes();
  }, []);
  const sendMailPdf = async (templates: any, email: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      email: email,
      filename: "Sales Invoice",
      html: encodedString,
      isDownload: false,
      sendEmail: true,
      type: "",
      userid: "",
    };
    const token = user.token;

    const response = await fetch(pdf_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pdfData),
    });

    if (response.ok) {
      notification.success({ message: "Email Successfully Sent" });
      setEmailModal(false);
    }
    if (!response.ok) {
      notification.success({
        message:
          "Apologies, there was an error when attempting to send the email.",
      });
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };
  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        personalData: user.companyInfo,
        ReportData: data,
      };
      let templates = HSNReportTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        personalData: user?.companyInfo,
        ReportData: data,
      };

      let templates: any = null;
      if (!user) {
        notification.error({
          message: <div>Please select an email template</div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/settings/customize")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }
      if (!user) {
        notification.error({
          message: <div>Please select default Bank </div>,
          description: (
            <Button
              type={"link"}
              onClick={() => navigate("/usr/profile/business")}
            >
              Click to select
            </Button>
          ),
        });
        return;
      }

      if (user) {
        templates = HSNReportTemplate(obj);
      }
      if (type === "email") {
        sendMailPdf(templates, emaildata);
      } else {
        await downLoadPdf(templates);
      }

      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }
  const downLoadPdf = async (templates: any) => {
    let templateContent = templates.replace("\r\n", "");
    templateContent = templateContent.replace('\\"', '"');
    const encodedString = btoa(templateContent);
    const pdf_url = API.PDF_GENERATE_URL;
    const pdfData = {
      filename: "HSN/SAC Report",
      html: encodedString,
      isDownload: true,
      sendEmail: false,
      type: "",
      userid: "",
    };
    const token = user.token;

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
    a.download = `HSN/SAC Report${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        firstPathText="Report"
        secondPathText={t("home_page.homepage.HSN/SAC_Summary")}
        firstPathLink={location?.pathname}
        secondPathLink={location?.pathname}
        title={t("home_page.homepage.HSN/SAC_Summary")}
        children={
          <div>
            <Button
              className="Report-HeaderButton-dwnld"
              onClick={() => generateTemplate("downLoad", {})}
            >
              <MdFileDownload size={20} />
            </Button>{" "}
            <Button
              className="Report-HeaderButton-print"
              onClick={() => setEmailModal(true)}
            >
              <MdAttachEmail size={20} />
            </Button>
          </div>
        }
      />
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
          <Card>
            <DataGrid
              ref={dataGridRef}
              dataSource={data}
              columnAutoWidth={true}
              showBorders={true}
              showRowLines={true}
              remoteOperations={false}
              onSelectionChanged={onSelectionChanged}
            >
              <SearchPanel
                visible={true}
                width={window.innerWidth <= 580 ? 140 : 240}
              />
              <HeaderFilter visible={true} />
              {columns.map((column: any, index: number) => {
                return (
                  <Column
                    dataField={column.name}
                    caption={column.title}
                    dataType={column.dataType}
                    format={column.format}
                    alignment={"center"}
                  ></Column>
                );
              })}

              <Column
                dataField={""}
                caption={"Action"}
                alignment={"center"}
                cellRender={({ data }) => (
                  <Button
                    type="link"
                    onClick={() =>
                      navigate(`/usr/report/hsn_sac/details/${data?.hsn_code}`)
                    }
                  >
                    {t("home_page.homepage.View")}
                  </Button>
                )}
              />

              <Paging defaultPageSize={10} />
              <Pager
                visible={true}
                allowedPageSizes={[10, 20, 30]}
                displayMode={"compact"}
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
              />
              <Export
                enabled={true}
                allowExportSelectedData={true}
                formats={exportFormats}
              />
              <Toolbar>
                {selectedRows ? (
                  <Item location="before" visible={true}>
                    <div className="Table-Txt">
                      {selectedRows}
                      {t("home_page.homepage.selected")}
                    </div>
                  </Item>
                ) : (
                  <Item location="before" visible={true}>
                    <div className="Table-Txt">
                      {t("home_page.homepage.HSN_SACList")}
                    </div>
                  </Item>
                )}
                <Item name="searchPanel" />
                <Item location="after" visible={true} name="exportButton" />
              </Toolbar>
            </DataGrid>
          </Card>
          {emailModal ? (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              ownMail={user.email}
              fileName={`HSN/SACReport${new Date()}.pdf`}
              Attachment={`HSN/SACReport_${moment(new Date()).format(
                "DD-MM-YYYY"
              )}`}
              defaultValue={{
                to: user.email,
                subject: t("home_page.homepage.HSN_SACReport"),
                content: t("home_page.homepage.HSN_SACReport"),
              }}
            />
          ) : null}
        </Container>
      )}
    </>
  );
};

export default HsnCodeScreen;
