import { Alert, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BsBuildings } from "react-icons/bs";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import LoadingBox from "../../components/loadingBox";
import API from "../../config/api";
import { update } from "../../redux/slices/userSlice";
import { GET } from "../../utils/apiCalls";
import OuterPageHeader from "./components/OuterPageHeader";
import CompanyHeader from "./components/header";
import { withTranslation } from "react-i18next";

import "./styles.scss";
import { jwtDecode } from "jwt-decode";
import SubscriptionModal from "../../app/subscription/components/AddOnModal";
import { PiWarningCircle } from "react-icons/pi";
import moment from "moment";

const CompanyList = (props: any) => {
  const { t } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [planDetails, setPlanDetails] = useState<any>();

  const navigate = useNavigate();
  const User = useSelector((state: any) => state.User);
  const dispatch = useDispatch();
  const fetchSbscriptionDetails = async () => {
    try {
      setIsLoading(true);
      let url = API.USER_SUBSCRIBED_PLAN;
      const response: any = await GET(url, null);
      if (response?.status) {
        setPlanDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const deleteHandler = async (id: number) => {
  //   try {
  //     setIsLoading(true);
  //     let url = `company_master/${id}`;
  //     const response: any = await DELETE(url);
  //     if (response.status) {
  //       notification.success({
  //         message: "Success",
  //         description: "Company deleted successfully",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     notification.error({
  //       message: "Server Error",
  //       description: "Failed to delete this company!! Please try again later",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      let url = API.GET_ALL_COMPANIES + User?.user?.id;
      const response: any = await GET(url, null);
      setCompanies(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSbscriptionDetails();
    fetchCompanies();
  }, []);

  const filteredCompanies = searchQuery
    ? companies.filter((company: any) =>
        company.bname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companies;

  const userData = User?.user;

  const handleClick = (item: any) => {
    const obj = {
      id: userData?.id,
      email: userData?.email,
      tokenid: userData?.tokenid,
      fullName: userData?.fullName,
      password: userData?.password,
      phonenumber: userData?.phonenumber,
      status: userData?.status,
      image: userData?.image,
      adminid: userData?.adminid,
      companyid: item?.id,
      countryid: userData?.countryid,
      usertype: userData?.usertype,
      active: userData?.active,
      dob: userData?.dob,
      companyInfo: item,
      countryInfo: item?.countryInfo,
      country_code: userData?.country_code,
      mobileverified: userData?.mobileverified,
      emailverified: userData?.emailverified,
      token: userData?.token,
      // bankInfo: item?.bankInfo,
    };
    dispatch(update(obj));
    navigate("/usr/dashboard");
  };

  const Token = useSelector((state: any) => state?.User?.user?.token);
  const decoded: any = jwtDecode(Token);
  let currentDate = new Date();
  let subscriptionEndDate = new Date(decoded?.subscriptionExpiry);

  return (
    <>
      <CompanyHeader />
      <Container>
        <br />
        <OuterPageHeader title={t("home_page.homepage.All_Compani")} />
        <br />
        {subscriptionEndDate <= currentDate && (
          <>
            <Alert
              message={
                <div className="company-textMessageContainer">
                  <div>
                    {" "}
                    <PiWarningCircle size={24} color="red" />
                  </div>{" "}
                  <span>
                    {moment(subscriptionEndDate).format("YYYY-MM-DD") ===
                    moment(currentDate).format("YYYY-MM-DD")
                      ? `Your subscription plan expires today`
                      : `Your current subscription has been expired,`}
                  </span>
                  <button onClick={() => navigate("/subscription")}>
                    Renew Plan.
                  </button>
                </div>
              }
              type="error"
            />
            <br />
          </>
        )}

        <div className="dashboard-greetig-container">
          <strong className="dashboard-username-text">
            {t("home_page.homepage.welcome")}{" "}
            {userData?.fullName !== null ? userData?.fullName : "User"}
          </strong>
        </div>
        <br />
        <div className="dashboard-greetig-container">
          <Input
            placeholder="Search"
            prefix={<FiSearch className="site-form-item-icon" />}
            className="company-searchBar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div>
            <Button
              className="company-primary-Button"
              size="large"
              onClick={() => navigate("/company/create/0")}
              disabled={subscriptionEndDate < currentDate}
            >
              <FaPlus />
              <span style={{ paddingLeft: "2px" }}>
                {t("home_page.homepage.companies")}
              </span>
            </Button>
          </div>
        </div>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Row className="companyBox-row">
            {companies?.length === 0 && (
              <>
                <Alert
                  className="mt-0 py-0 w-100 py-3"
                  message="Please create company for the further flow!!"
                  type="warning"
                  style={{ textAlign: "center" }}
                  showIcon
                />
              </>
            )}
            {filteredCompanies?.map((item: any) => {
              return (
                <>
                  <Col
                    md={3}
                    xs={12}
                    className="main-box-container"
                    onClick={() => handleClick(item)}
                  >
                    <div className="company-inside-box">
                      <div
                        className="company-logo-profile"
                        onClick={() => handleClick(item)}
                      >
                        {item.logo == null || item.logo == "" ? (
                          <BsBuildings size={30} />
                        ) : (
                          <div className="profile-picture">
                            <img
                              src={API.FILE_PATH + "logo/" + item?.logo}
                              className="sider-profile-img"
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                      <span
                        className="company-name-text"
                        onClick={() => handleClick(item)}
                      >
                        {item.bname}
                      </span>
                      <span
                        className="company-card-icon-text"
                        onClick={() => handleClick(item)}
                      >
                        {item.bcategory}
                      </span>
                    </div>
                    {item.cemail && (
                      <div style={{ marginTop: "30px" }}>
                        <div className="customer-details-row">
                          <MdEmail color="#001861" />
                          <span className="company-card-icon-text mb-0">
                            {item.cemail}
                          </span>
                        </div>
                      </div>
                    )}

                    {item.fulladdress && (
                      <div className="customer-details-row">
                        <FaLocationDot color="#001861" />
                        <span className="company-card-icon-text mb-0">
                          {item.fulladdress}
                        </span>
                      </div>
                    )}
                  </Col>
                </>
              );
            })}
          </Row>
        )}

        <br />
        {isOpen && (
          <SubscriptionModal
            planDetails={planDetails}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </Container>
    </>
  );
};

export default withTranslation()(CompanyList);
