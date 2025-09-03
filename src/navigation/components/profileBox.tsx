import { TbLogout } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsBuildings } from "react-icons/bs";
import { Modal } from "antd";
import AffiliationForm from "../../admin/affiliations/component/form";
import { useState } from "react";

function ProfileBox(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.User);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    dispatch(logout({}));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: 280 }} className="profileBox-Box1">
      <br />
      <div className="profileBox-Box2">
        {user?.image == null || user?.image == "" ? (
          <HiOutlineUserCircle size={70} color="#d9d9d9" />
        ) : (
          <div className="profile-picture">
            <img
              src={user?.image}
              className="sider-profile-img"
              style={{ width: "50%" }}
              alt=""
            />
          </div>
        )}
        <div className="profileBox-txt1">
          {t("home_page.homepage.Hi")},{" "}
          {props?.type === "affiliate"
            ? user?.name
            : user?.isStaff
            ? user?.staff?.name
            : user?.fullName}
        </div>

        <br />
      </div>
      <div
        className="profileBox-Box3"
        onClick={() => {
          if (props?.type === "affiliate") {
            setIsOpen(true);
          } else {
            navigate("/user-profile");
          }
        }}
      >
        <div onClick={() => navigate(`/affiliate/edit/${user?.id}`)}>
          {t("home_page.homepage.Manage_Account")}
        </div>

        <div className="profileBox-Box4">
          <FiUser size={25} color={"#ff9800"} />
        </div>
      </div>

      {props?.val === 1 ? null : (
        <div className="profileBox-Box3" onClick={() => navigate("/company")}>
          <div>My Companies</div>
          <div className="profileBox-Box4">
            <BsBuildings size={25} color={"#FF9800"} />
          </div>
        </div>
      )}

      {/* <Popconfirm
        placement="bottomRight"
        title="Logout"
        description="Are you sure you want to log out?"
        onConfirm={() => dispatch(logout({}))}
      > */}
      <div className="profileBox-Box3" onClick={showModal}>
        <div className="profileBox-Txt3">{t("home_page.homepage.Logout")}</div>

        <div className="profileBox-Box4">
          <TbLogout size={25} color="red" />
        </div>
      </div>
      {/* </Popconfirm> */}

      <Modal
        title="Logout"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        // okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>

      {isOpen && props?.type === "affiliate" && (
        <AffiliationForm isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}

export default ProfileBox;
