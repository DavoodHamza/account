import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Tooltip } from "antd";
import { MdEmail, MdFileDownload } from "react-icons/md";
import PageHeader from "../../../components/pageHeader";
import { Col, Container, Row } from "react-bootstrap";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io";
import dayjs from "dayjs";
import PayrollEmployeeTable from "./table";
import { FaAddressCard } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";
import { GrStakeholder } from "react-icons/gr";
import { GoPackage } from "react-icons/go";
import { FaCodeBranch } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { PayrollTemplate } from "./template";
import moment from "moment";
import LoadingBox from "../../../components/loadingBox";

const PayrollEmployeesViewPage = () => {
  const {id} = useParams();
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false)
  const adminid = user?.id;
  const [data, setData] = useState<any>();
  const navigate = useNavigate();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const location = useLocation();

  const GetEmployees = async () => {
    try {
      setIsLoading(true)
      const url = API.EMPLOYEES_LIST_USER + `${user?.companyInfo?.id}/` + id;
      const response: any = await GET(url, "");
      if (response) {
        setData(response?.data);
      }
    } catch (error) {
      console.log(error, "error--------------------->");
    }finally{
      setIsLoading(false)
    }
  };
  const personalDetails = [
    {
      label: "FirstName",
      text: data?.firstName,
      icon: <FaUserCircle size={22} />,
    },
    {
      label: "LastName",
      text: data?.lastName,
      icon: <FaUserCircle size={22} />,
    },
    {
      label: "Email",
      text: data?.email ? data?.email : "-",
      icon: <MdEmail size={22} />,
    },
    {
      label: "Mobile",
      text: data?.phone ? data?.phone : "-",
      icon: <FaPhoneAlt size={18} />,
    },
    {
      label: "Address",
      text: data?.fullAddress ? data?.fullAddress : "-",
      icon: <FaAddressCard size={20} />,
    },
    {
      label: "Date Of Join",
      text: dayjs(data?.date_of_join).format("DD-MM-YYYY")
        ? dayjs(data?.date_of_join).format("DD-MM-YYYY")
        : "-",
      icon: <BsCalendar2DateFill size={20} />,
    },
  ];

  const businessDetails = [
    {
      label: "Employee Number",
      text: data?.employeeNumber ? data?.employeeNumber : "-",
      icon: <IoMdBusiness size={20} />,
    },
    {
      label: "Designation",
      text: data?.Designation ? data?.Designation : "-",
      icon: <IoMdBusiness size={20} />,
    },

    {
      label: "Account Holder Name",
      text: data?.accountHolderName ? data?.accountHolderName : "-",
      icon: <GrStakeholder size={20} />,
    },
    {
      label: "Account Number",
      text: data?.accountNumber ? data?.accountNumber : "-",
      icon: <CiBank size={20} />,
    },
    {
      label: "Branch",
      text: data?.branch ? data?.branch : "-",
      icon: <FaCodeBranch size={20} />,
    },
    {
      label: "Salary Package",
      text: data?.salaryPackage ? data?.salaryPackage : "-",
      icon: <GoPackage size={20} />,
    },
  ];

  useEffect(() => {
    GetEmployees();
  }, []);

  async function generateTemplate(type: any, emaildata: any) {
    try {
      setDownloadLoading(true);
      let obj = {
        user,
        personalData: data,
        invoiceData: "saleList?.ledgerList",
        openingBalance: "saleList?.openingBalance",
        type: "Customer",
      };
      let templates = PayrollTemplate(obj);
      await downLoadPdf(templates);
      setDownloadLoading(false);
    } catch (error) {
      console.log(error);
      setDownloadLoading(false);
    }
  }

  const downLoadPdf = async (templates: any) => {
    try {
      let templateContent = templates?.replace("\r\n", "");
      templateContent = templateContent?.replace('\\"', '"');
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
      a.download = `Employees Details${moment(new Date()).format(
        "DD-MM-YYYY"
      )}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div>
      <PageHeader
        firstPathLink={location.pathname}
        firstPathText="Pay Roll - Employees"
        secondPathLink={location.pathname}
        secondPathText="Employee Details"
        goback="/usr/payroll/employees"
        title="Employee Details"
        children={
          <div>
            &nbsp;
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
                loading={downloadLoading}
                onClick={() => generateTemplate(data?.type, data)}
              >
                <MdFileDownload size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      />
      <br />
      <Container>
        {
          isLoading ? <LoadingBox/> : ( 
            <Card>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h5>Employee Details</h5>
              <Button
                style={{ width: "100px" }}
                type="primary"
                onClick={() => navigate(`/usr/payroll/form/employees/${id}`)}
              >
                <b>Edit</b>
              </Button>
            </div>
  
            <hr />
            <Row>
              <Col md={6}>
                {personalDetails.map((details: any) => (
                  <div className="customer-details-row pt-4">
                    <div className="customer-icon-container"> {details.icon}</div>
                    <h6 className="customer-icon-text mb-0">
                      <b>{details.label}</b> :
                    </h6>
                    <h6 className="customer-icon-text mb-0">{details?.text}</h6>
                  </div>
                ))}
              </Col>
              <Col md={6}>
                {businessDetails.map((details: any) => (
                  <div className="customer-details-row pt-4">
                    <div className="customer-icon-container">{details.icon}</div>
                    <h6 className="customer-icon-text mb-0">
                      <b>{details.label}</b> :
                    </h6>
                    <h6 className="customer-icon-text mb-0">{details?.text}</h6>
                  </div>
                ))}
              </Col>
            </Row>
            <br />
          </Card>
          )
        }
       
        {/* <Card>
          <PayrollEmployeeTable />
        </Card> */}
        <br />
      </Container>
    </div>
  );
};

export default PayrollEmployeesViewPage;
