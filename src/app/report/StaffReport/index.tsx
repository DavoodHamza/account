import React from "react";
import { useState, useRef, useEffect } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Toolbar,
  Item,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import PageHeader from "../../../components/pageHeader";
import LoadingBox from "../../../components/loadingBox";
import { Container } from "react-bootstrap";
import { Button, Card, notification } from "antd";
import { useNavigate } from "react-router-dom";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../utils/apiCalls";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import { StaffReportTemplate } from "../StaffReport/template";
import SendMailModal from "../../../components/sendMailModal";
import moment from "moment";
import { useTranslation } from "react-i18next";

const StaffReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState();
  const [data, setData] = useState<any>();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const dataGridRef: any = useRef(null);
  const exportFormats = ["xlsx", "pdf"];
  const [emailModal, setEmailModal] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      name: "staff_name",
      title: t("home_page.homepage.name1"),
      dataType: "string",
    },
    {
      name: "totalPrice",
      title: t("home_page.homepage.O/SAMT"),
    },
    {
      name: "currentMonthTotal",
      title: t("home_page.homepage.Curent Month"),
      dataType: "string",
    },
    {
      name: "lastTwoMonthsTotal",
      title: t("home_page.homepage.PreviousMonth"),
    },
    {
      name: "lastThreeMonthsTotal",
      title: t("home_page.homepage.Last_3_Month"),
      dataType: "string",
    },
    {
      name: "lastFourMonthsTotal",
      title: t("home_page.homepage.Last_4_Month"),
      dataType: "string",
    },
  ];

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const fetchStaffReport = async () => {
    try {
      setIsLoading(true);
      const url = API.GET_STAFF_REPORT + user?.id + "/" + user?.companyInfo?.id;
      const response = await GET(url, null);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffReport();
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
      let templates = StaffReportTemplate(obj);
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
        templates = StaffReportTemplate(obj);
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
      filename: "Staff Report",
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
    a.download = `Staff Report${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        firstPathLink={"/usr/report"}
        firstPathText={t("home_page.homepage.Report")}
        secondPathLink={`/usr/report/staff-analysis`}
        secondPathText={t("home_page.homepage.Staff_Analysis")}
        goback={-1}
        title={t("home_page.homepage.Staff_Analysis")}
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
                caption={t("home_page.homepage.status")}
                alignment={"center"}
                cellRender={(e) => (
                  <Button
                    type="link"
                    onClick={() =>
                      navigate(`/usr/staff/details/${e?.data?.id}`)
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
                    <div className="Table-Txt">{selectedRows} selected</div>
                  </Item>
                ) : (
                  <Item location="before" visible={true}>
                    <div className="Table-Txt">{/* {props.title} */}</div>
                  </Item>
                )}
                <Item name="searchPanel" />
                <Item location="after" visible={true} name="exportButton" />
              </Toolbar>
              <Summary>
                <TotalItem
                  column="customer_name"
                  displayFormat={`Total`}
                  alignment={"center"}
                />
                <TotalItem
                  column="totalPrice"
                  summaryType="sum"
                  displayFormat={`{0}`}
                  alignment={"center"}
                  valueFormat={{ precision: 2 }}
                />
                <TotalItem
                  column="currentMonthTotal"
                  summaryType="sum"
                  displayFormat={`{0}`}
                  alignment={"center"}
                  valueFormat={{ precision: 2 }}
                />
                <TotalItem
                  column="lastTwoMonthsTotal"
                  summaryType="sum"
                  displayFormat={`{0}`}
                  alignment={"center"}
                  valueFormat={{ precision: 2 }}
                />
                <TotalItem
                  column="lastThreeMonthsTotal"
                  summaryType="sum"
                  displayFormat={`{0}`}
                  alignment={"center"}
                  valueFormat={{ precision: 2 }}
                />
                <TotalItem
                  column="lastFourMonthsTotal"
                  summaryType="sum"
                  displayFormat={`{0}`}
                  alignment={"center"}
                  valueFormat={{ precision: 2 }}
                />
              </Summary>
            </DataGrid>
          </Card>
          {emailModal ? (
            <SendMailModal
              open={emailModal}
              close={() => setEmailModal(false)}
              onFinish={(val: any) => genrateTemplate("email", val)}
              ownMail={user.email}
              fileName={`StaffReport${new Date()}.pdf`}
              Attachment={`StaffReport_${moment(new Date()).format(
                "DD-MM-YYYY"
              )}`}
              defaultValue={{
                to: user.email,
                subject: `StaffReport`,
                content: "StaffReport",
              }}
            />
          ) : null}
        </Container>
      )}
    </>
  );
};

export default StaffReport;
