//import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import UpdateStock from "./updateStock";
import { useState } from "react";
import { GET } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { notification } from "antd";
import { MdEditDocument, MdPreview } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

function ActionPopover(props: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const data = props.data.data;
  const { t } = useTranslation();
  const { canViewProducts, canUpdateProducts, canDeleteProducts } = useAccessControl();
  const onView = () => {
    navigate(`/usr/product-view/${data.itemtype}/${data.id}`);
  };

  const onEdit = () => {
    data?.itemtype == "Asset" ? props?.handleEditAsset(data.id) :
    navigate(`/usr/create-product/${data.itemtype}/update/${data.id}`);
  };
  const showModal = () => {
    setModalVisible(true);
  };

  const Delete = async () => {
    try {
      let url = API.DELETE_PRODUCT + Number(data.id);
      const res: any = await GET(url, null);
      if (res.status) {
        notification.success({message:"Success",description:"Product deleted successfully"});
        props.onSuccess();
      }else{
        notification.error({message:"Failed",description:"Failed to delete product"});
      }
    } catch (error) {
      console.log(error)
      notification.error({message:"Server Error",description:"Failed to delete product!! Please try again later"});    
    }
   
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
        { 
          data?.itemtype == "Asset" ? null : 
          canViewProducts() && (
            <div
            className="table-actionBoxItem"
            onClick={onView}
          >
            <div>{t("home_page.homepage.View")}</div>
            <MdPreview size={18} color="grey" />
          </div>
          )
        }
        {canUpdateProducts() && (
          <div
              className="table-actionBoxItem"
              onClick={onEdit}
            >
              <div>{t("home_page.homepage.Edit")}</div>
              <MdEditDocument size={18} color="grey" />
            </div>
        )}
      </div>
      <UpdateStock
        modalVisible={modalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        stock={data}
        onSuccess={props.onSuccess}
      />
    </>
  );
}

export default ActionPopover;
