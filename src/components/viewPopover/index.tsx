import { RiDeleteBinLine } from "react-icons/ri";
import "./styles.scss";
import { Popconfirm } from "antd";
import { AiOutlineQuestionCircle, AiOutlineSend } from "react-icons/ai";
import {
  MdEditDocument,
  MdOutlineContentCopy,
  MdPreview,
} from "react-icons/md";
import { useTranslation } from "react-i18next";


function ViewPopover(props: any) {
  const {t} = useTranslation();

  return (
    <>
      <div className="table-actionBox">
        {props.onView ? (
          <div
            className="table-actionBoxItem"
            onClick={(data: any) => props?.onView(data)}
          >
            <div>{t("home_page.homepage.View")}</div>
            <MdPreview size={18} color="grey" />
          </div>
        ) : null}
        {props.OnEdit ? (
          <div
            className="table-actionBoxItem"
            onClick={() => {
              props?.OnEdit();
            }}
          >
            <div>{t("home_page.homepage.Edit")}</div>
            <MdEditDocument size={18} color="grey" />
          </div>
        ) : null}

        {props.onCopy ? (
          <div className="table-actionBoxItem" onClick={() => props?.onCopy()}>
            <div>{t("home_page.homepage.Copy")}</div>
            <MdOutlineContentCopy size={18} color="grey" />
          </div>
        ) : null}

        {props.OnDelete ? (
          <Popconfirm
            title="Delete"
            description="Are you sure to delete ?"
            icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
            onConfirm={() => props?.OnDelete()}
            placement="topRight"
          >
            <div className="table-actionBoxItem">
              <div>{t("home_page.homepage.Delete")}</div>
              <RiDeleteBinLine size={18} color="grey" />
            </div>
          </Popconfirm>
        ) : null}
        {props.onSendNow ? (
          <Popconfirm
            title="Send Now"
            description="Are you sure to send?"
            icon={<AiOutlineQuestionCircle style={{ color: "red" }} />}
            onConfirm={() => props?.onSendNow()}
            placement="topRight"
          >
            <div className="table-actionBoxItem">
              <div>Send Now</div>
              <AiOutlineSend size={18} color="grey" />
            </div>
          </Popconfirm>
        ) : null}
      </div>
    </>
  );
}

export default ViewPopover;
