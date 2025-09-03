import { useState, useRef, useEffect } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Button, Card, notification } from "antd";
import { Container } from "react-bootstrap";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import columns from "./columns.json";
import { useNavigate } from "react-router";
import { MdAttachEmail, MdFileDownload } from "react-icons/md";
import moment from "moment";
import { agedCreditorsTemplate } from "./template";
import SendMailModal from "../../../components/sendMailModal";
import { useTranslation } from "react-i18next";

const AgedCreditors = () => {
  const navigate = useNavigate();
  const [emailModal, setEmailModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const navigation = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [payList, setPayList] = useState([]);
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const { t } = useTranslation();
  const columns = [
    {
      name: "customer_name",
      title: t("home_page.homepage.Supplier"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "totalPrice",
      title: t("home_page.homepage.O/SAMT"),
      alignment: "center",
    },
    {
      name: "currentMonthTotal",
      title: t("home_page.homepage.CurrentMonth"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "lastTwoMonthsTotal",
      title: t("home_page.homepage.PreviousMonth"),
      alignment: "center",
    },
    {
      name: "lastThreeMonthsTotal",
      title: t("home_page.homepage.Last_3_Month"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "lastFourMonthsTotal",
      title: t("home_page.homepage.Last_4_Month"),
      dataType: "string",
      alignment: "center",
    },
  ];

  const exportFormats = ["xlsx", "pdf"];

  const LodeCustomerAllPayList = async () => {
    setIsLoading(true);
    try {
      let URL = API.REPORT_CREDITORS + user?.id + "/" + user?.companyInfo?.id;
      const data: any = await GET(URL, null);
      if (data.status) {
        let fiterData: any = [];
        data.data.agedDebtors.filter((item: any) => {
          if (
            item.currentMonthTotal > 0 ||
            item.totalPrice > 0 ||
            item.lastTwoMonthsTotal > 0 ||
            item.lastThreeMonthsTotal > 0 ||
            item.lastFourMonthsTotal > 0
          ) {
            fiterData.push(item);
          }
        });
        setPayList(fiterData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
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

  async function genrateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        payList,
        personalData: user.companyInfo,
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
        templates = agedCreditorsTemplate(obj);
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

  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        payList,
        personalData: user.companyInfo,
      };
      let templates = agedCreditorsTemplate(obj);
      await downLoadPdf(templates);
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
      filename: "Sales Invoice",
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
    a.download = `AgedCreditors${moment(new Date()).format("DD-MM-YYYY")}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    LodeCustomerAllPayList();
  }, []);

  // const onCellClick = (e: any) => {
  //   if (e?.data?.id) {
  //     navigation(`/usr/contactSuppliers/details/${e?.data?.id}`);
  //   }
  // };
  return (
    <>
      <PageHeader
        firstPathLink={"/usr/report"}
        firstPathText={t("home_page.homepage.Report")}
        secondPathLink={`/usr/report/sundryCreditors`}
        secondPathText={t("home_page.homepage.Sundry_Creditors")}
        goback={-1}
        title={t("home_page.homepage.ListAllUnpaid_Purchace")}
        children={
          <div>
            <Button
              onClick={() => generateTemplate("downLoad", {})}
              loading={downloadLoading}
            >
              <MdFileDownload size={20} />
            </Button>
            &nbsp;
            <Button onClick={() => setEmailModal(true)}>
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
              dataSource={payList}
              columnAutoWidth={true}
              showBorders={true}
              showRowLines={true}
              onSelectionChanged={onSelectionChanged}
              remoteOperations={false}
              //onCellClick={onCellClick}
              // onExporting={(e) => EXPORT(e, dataGridRef, "products")}
            >
              <Selection
                mode="multiple"
                selectAllMode="allPages"
                showCheckBoxesMode="always"
              />
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
                    alignment={column.alignment}
                  ></Column>
                );
              })}

              <Column
                dataField={""}
                caption={"Status"}
                alignment={"center"}
                cellRender={(e) => (
                  <Button
                    type="link"
                    onClick={() =>
                      navigation(`/usr/contactSuppliers/details/${e?.data?.id}`)
                    }
                  >
                    {t("home_page.homepage.View")}
                  </Button>
                )}
              />

              <Paging defaultPageSize={take} />
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
              fileName={`agedCreditorsDetails${new Date()}.pdf`}
              Attachment={`${user.companyInfo.bname}_agedCreditors_${moment(
                new Date()
              ).format("DD-MM-YYYY")}`}
              defaultValue={{
                to: user.email,
                subject: `Aged Creditor`,
                content: `Aged Creditor Details`,
              }}
            />
          ) : null}
        </Container>
      )}
    </>
  );
};

export default AgedCreditors;
