import { useSelector } from "react-redux";
import { BiSolidBusiness, BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import API from "../../config/api";
import '../styles.scss';

const ProfileSider = (props: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.User);
  const financialDate = moment(user?.companyInfo?.financial_year_start);
  let startYear = financialDate.year();
  let endYear = financialDate.year() + 1;
  return (
    <div
      className="navigation-profile-sider-container"
      onClick={() => navigate(`/usr/company-profile/business`)}
    >
      <div className="navigation-user-profile">
        {user?.companyInfo?.logo == null || user?.companyInfo?.logo == "" ? (
          <BiSolidBusiness size={30} />
        ) : (
          <div className="profile-picture">
            <img
              src={API.FILE_PATH + "logo/" + user?.companyInfo?.logo}
              className="sider-profile-img"
              alt=""
            />
          </div>
        )}
      </div>
      {props.collapsed ? null : (
        <div className="username-container">
          <div className="username">
            {user?.isStaff
              ? `${user?.staff?.name}`
              :  user?.companyInfo?.bname}
          </div>
          <div style={{ color: "grey", fontSize: 12 }}>
            {user?.isStaff
              ? "Staff"
              : // t("home_page.homepage.User")
                `${startYear}-${endYear}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSider;
