//import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useState } from "react";
import { GET } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { Popconfirm, notification } from "antd";
import { MdDelete, MdEditDocument, MdPreview } from "react-icons/md";
//import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { AiOutlineQuestionCircle } from "react-icons/ai";
//import { RxUpdate } from "react-icons/rx";

function ActionPopover(props: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const data = props.data.data;
  const { t } = useTranslation();
  const onView = () => {
    navigate(`/usr/composition-details/${data.id}`);
  };

  const onViewProductionDetails = () => {
    navigate(`/usr/production-details/${data.id}`);
  };

  const onEdit = () => {
    navigate(`/usr/edit-composition/${data.id}`);
  };
  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  return (
    <>
      <div className="table-actionBox">
        {props?.tableType == "bom" ? (
          <>
            <div className="table-actionBoxItem" onClick={onView}>
              <div>{t("home_page.homepage.View")}</div>
              <MdPreview size={18} color="grey" />
            </div>
            <div className="table-actionBoxItem" onClick={onEdit}>
              <div>{t("home_page.homepage.Edit")}</div>
              <MdEditDocument size={18} color="grey" />
            </div>
            <Popconfirm
              title="Delete"
              description="Are you sure to delete ?"
              icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
              onConfirm={() => props?.deleteBom(data?.id)}
              placement="topRight"
            >
              <div className="table-actionBoxItem">
                <div style={{ color: "red" }}>
                  {t("home_page.homepage.Delete")}
                </div>
                <MdDelete size={18} color="red" />
              </div>
            </Popconfirm>
          </>
        ) : (
          <div
            className="table-actionBoxItem"
            onClick={onViewProductionDetails}
          >
            <div>{t("home_page.homepage.View")}</div>
            <MdPreview size={18} color="grey" />
          </div>
        )}
      </div>
    </>
  );
}

export default ActionPopover;
