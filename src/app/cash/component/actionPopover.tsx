import { useNavigate } from "react-router-dom";
import "../styles.scss";
import { useState } from "react";
import { DELETE } from "../../../utils/apiCalls";
import ContraVoucher from "./form/contraVoucher";
import { MdDelete, MdEditDocument, MdPreview } from "react-icons/md";
import { Popconfirm, Popover, Spin, notification } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";
function ActionPopover({ data, id, reLoadaApis }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [loding, setLoding] = useState(false);

  const onView = () => {
    navigate(`/usr/cash/view/${data.data.id}/${id}`);
  };

  const handleOk = () => {
    setModalVisible(false);
    reLoadaApis();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onEdit = () => {
    if (data.data.type == "Customer Receipt") {
      navigate(`/usr/cash/salesreceipt/${id}/${data.data.id}/customer-receipt`);
    } else if (data.data.type == "Other Receipt") {
      navigate(`/usr/cash/salesreceipt/${id}/${data.data.id}/other-receipt`);
    } else if (data.data.type == "Supplier Refund") {
      navigate(`/usr/cash/salesreceipt/${id}/${data.data.id}/supplire-refund`);
    } else if (data.data.type == "Supplier Payment") {
      navigate(
        `/usr/cash/purchacepayment/${id}/${data.data.id}/supplier-payment`
      );
    } else if (data.data.type == "Other Payment") {
      navigate(`/usr/cash/purchacepayment/${id}/${data.data.id}/other-payment`);
    } else if (data.data.type == "Customer Refund") {
      navigate(
        `/usr/cash/purchacepayment/${id}/${data.data.id}/customer-refund`
      );
    } else {
      setModalVisible(true);
    }
  };

  const onDeleate = async () => {
    try {
      setLoding(true);
      let url = "ledger_details/delateTransaction/" + data.data.id;
      const deleted: any = await DELETE(url);
      if (deleted?.status) {
        notification.success({ message: "Transaction Deleted Successfully" });
        setLoding(false);
        reLoadaApis();
      } else {
        notification.error({ message: "Failed to Delete the Transaction" });
        setLoding(false);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: "Failed to Delete the Transaction" });
    }
  };

  return (
    <>
      <div className="table-title">
        <Popover
          content={
            <div className="table-actionBox">
              <div className="table-actionBoxItem" onClick={onView}>
                <div>{t("home_page.homepage.View")}</div>
                <MdPreview size={18} color="grey" />
              </div>
              <div className="table-actionBoxItem" onClick={onEdit}>
                <div>{t("home_page.homepage.Edit")}</div>
                <MdEditDocument size={18} color="grey" />
              </div>
              {!loding ? (
                <Popconfirm
                  title="Delete"
                  description="Are you sure to delete ?"
                  icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
                  onConfirm={onDeleate}
                  placement="topRight"
                >
                  <div className="table-actionBoxItem">
                    <div>{t("home_page.homepage.Delete")}</div>
                    <MdDelete size={18} color="grey" />
                  </div>
                </Popconfirm>
              ) : (
                <div className="table-actionBoxItem">
                  <Spin />
                </div>
              )}
            </div>
          }
          placement="bottom"
          trigger={"click"}
        >
          <BsThreeDotsVertical size={16} cursor={"pointer"} />
        </Popover>
      </div>
      {modalVisible && (
        <ContraVoucher
          modalVisible={modalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          id={data.data.id}
          type={"update"}
          ledger={id}
        />
      )}
    </>
  );
}

export default ActionPopover;
