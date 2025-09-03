import { Card, Popover } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPhoneAlt, FaUserCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdBusiness } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import ViewPopover from "../../../components/viewPopover";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import StaffTable from "./table";
import { useTranslation } from 'react-i18next';



const StaffView = () => {


  const { t } = useTranslation();

  const columns = [
      {
    name: "id",
    title: `${t("home_page.homepage.slno")}`,
    dataType: "string",
    alignment: "center",
    cellRender: ( data: any) => data?.rowIndex + 1,
  },
    {
      name: "date",
      title: `${t("home_page.homepage.Date")}`,
      dataType: "string",
      alignment: "center",
      cellRender:({data}:any)=>moment(data?.date).format('YYYY-MM-DD')
    },
    {
      name: "particular",
      title: `${t("home_page.homepage.Particulars")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "type",
      title: `${t("home_page.homepage.Voucher_Type")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "debit",
      title: `${t("home_page.homepage.Debit")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "credit",
      title: `${t("home_page.homepage.Credit")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "reference",
      title: `${t("home_page.homepage.Reference")}`,
      dataType: "string",
      alignment: "center",
      cellRender:({data}:any)=>data?.reference ? data?.reference : "-"
    },
    {
      name: "id",
      title: `${t("home_page.homepage.Action")}`,
      dataType: "string",
      cellRender:(data:any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <ViewPopover
                  onView={() => {
                    // navigate(`/usr/staff/details/${data?.data?.id}`);
                  }}
                  OnEdit={() =>{
                    // navigate(`/usr/staff/edit/${data?.data?.id}`)
                  }}
                  
                />
              }
              placement="bottom"
              trigger={"click"}
            >
              <BsThreeDotsVertical size={16} cursor={"pointer"} />
            </Popover>
          </div>
        );
      }}
  ];


  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statementData, setStatementData] = useState<any>()

  
  const today = new Date();
  const startDay =moment(new Date(today.setDate(1))).format("YYYY-MM-DD");

  const [currentDate, setCurrentDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [firstDate, setFirstDate] = useState(startDay);

  const location = useLocation()
  const {user} = useSelector((state:any)=>state.User)

  const { id } = useParams();

  const fetchStaffDetails = async () => {
    try {
      setIsLoading(true);
      const staff_details_url = API.CONTACT_MASTER + `details/${id}`;
      const { data }: any = await GET(staff_details_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();
  }, []);

  useEffect(() => {
    fetchStaffTransactions(firstDate,currentDate);
  }, [firstDate,currentDate]);

  
  const fetchStaffTransactions = async (sdate: any, ldate: any) => {
    try {
      setIsLoading(true);
      const sales_list_url =
        API.CONTACT_MASTER +
        `staffStatement/${user?.id}/${id}/${sdate}/${ldate}`;
      const { data }: any = await GET(sales_list_url, null);
      setStatementData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  const handleDateRangeChange = (dates: any) => {
    setCurrentDate(dates[0]);
    setFirstDate(dates[1]);
    fetchStaffTransactions(dates[0], dates[1]);
  };

  const firstColumn = [
    { label: t("home_page.homepage.Name"),
     text: data?.name, 
     icon: <FaUserCircle size={22} /> },
    {
      label: t("home_page.homepage.Staff_ID"),
      text: data?.staffId,
      icon: <IoMdBusiness size={20} />,
    },
    {
      label: t("home_page.homepage.Reference"),
      text: data?.reference,
      icon: <IoMdBusiness size={20} />,
    },
    {
      label: t("home_page.homepage.Mobile"),
      text: data?.mobile ? data?.mobile : "-",
      icon: <FaPhoneAlt size={18} />,
    },
  ];
  let secondColumn = [
    {
      label: t("home_page.homepage.Email"),
      text: data?.email ? data?.email : "-",
      icon: <MdEmail size={22} />,
    },
    {
      label: t("home_page.homepage.Telephone"),
      text: data?.telephone ? data?.telephone : "-",
      icon: <FaPhoneAlt size={20} />,
    },
    {
      label: t("home_page.homepage.Address"),
      text: data?.address ? data?.address : "-",
      icon: <FaLocationDot size={20} />,
    },
  ];

  return (
    <>
    <PageHeader
        firstPathLink="/usr/staffs"
        firstPathText={t("home_page.homepage.Staff_List")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.Staff_Details")}
        goback="/usr/staffs"
        title={t("home_page.homepage.Staff_Details")}
      />
      {
        isLoading ?<LoadingBox/> : (
          <Container>
        <br />
        <Card>
          <h5>{t("home_page.homepage.Staff_Details")}</h5>
          <hr />
              <Row>
            <Col md={6}>
              {firstColumn.map((details: any,index:number) => (
                <div className="customer-details-row" key={index}>
                  <div className="customer-icon-container"> {details.icon}</div>{" "}
                  <h6 className="customer-icon-text mb-0">{details.label} :</h6>
                  <h6 className="customer-icon-text mb-0">{details?.text}</h6>
                </div>
              ))}
            </Col>
            <Col md={6}>
              {secondColumn.map((details: any,index:number) => (
                <div className="customer-details-row" key={index}>
                  <div className="customer-icon-container"> {details.icon}</div>{" "}
                  <h6 className="customer-icon-text mb-0">{details.label} :</h6>
                  <h6 className="customer-icon-text mb-0">{details?.text}</h6>
                </div>
              ))}
            </Col>
          </Row>
          
        </Card>
        <br />
        <StaffTable
            columns={columns}
            list={statementData}
            title={t("home_page.homepage.Staff_Activities")}
            currentDate={currentDate}
            firstDate={firstDate}
           // onPageChange={(p: any, t: any) => onPageChange(p, t)}
            handleDateRangeChange={handleDateRangeChange}
            />
      
      </Container>
        )
      }
      
    </>
  );
};

export default StaffView;
