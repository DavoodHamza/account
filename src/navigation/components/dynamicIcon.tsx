import React from "react";
import { IconType } from "react-icons";
import { CgUnavailable } from "react-icons/cg";
import { IoGridOutline } from "react-icons/io5";
import { RiShoppingBagLine } from "react-icons/ri";

import { FiTag } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { TbBuildingBank } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { IoBarChartOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { PiChartLineUpBold } from "react-icons/pi";

import { BsGraphDownArrow } from "react-icons/bs";
import { IoBan } from "react-icons/io5";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { GoChecklist } from "react-icons/go";
import { MdAttachMoney, MdOutlineSettingsInputComposite } from "react-icons/md";

import { TbFileInvoice } from "react-icons/tb";

import { RiSignalTowerLine } from "react-icons/ri";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbChecklist } from "react-icons/tb";
import { MdShoppingCartCheckout } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { FiShoppingBag } from "react-icons/fi";
import { LuUser2 } from "react-icons/lu";
import { LiaLuggageCartSolid } from "react-icons/lia";
import { CiViewList } from "react-icons/ci";
import { SlNotebook } from "react-icons/sl";
import { SlNote } from "react-icons/sl";
import { LuBookOpen } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { MdOutlineGroup } from "react-icons/md";
import { TbMessageQuestion } from "react-icons/tb";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import { RiComputerLine } from "react-icons/ri";
import { CiViewTimeline } from "react-icons/ci";
import { BiReceipt } from "react-icons/bi";
import { MdPayment } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { RiExchangeBoxLine } from "react-icons/ri";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { GrTransaction } from "react-icons/gr";
import { LuCombine } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
function DynamicIcon(props: any) {
  type IconName =
    | "CgUnavailable"
    | "IoGridOutline"
    | "RiShoppingBagLine"
    | "FiTag"
    | "FiShoppingCart"
    | "FiBook"
    | "TbBuildingBank"
    | "TbMoneybag"
    | "IoBarChartOutline"
    | "LuClipboardList"
    | "FiBox"
    | "PiChartLineUpBold"
    | "BsGraphDownArrow"
    | "RiSignalTowerLine"
    | "IoBan"
    | "LiaFileInvoiceSolid"
    | "GoChecklist"
    | "TbFileInvoice"
    | "HiOutlineClipboardDocumentList"
    | "TbChecklist"
    | "MdShoppingCartCheckout"
    | "CgNotes"
    | "FiShoppingBag"
    | "LuUser2"
    | "LiaLuggageCartSolid"
    | "CiViewList"
    | "SlNotebook"
    | "SlNote"
    | "LuBookOpen"
    | "FaRegUser"
    | "MdOutlineGroup"
    | "MdAttachMoney"
    | "CiSettings"
    | "MdOutlineStickyNote2"
    | "TbMessageQuestion"
    | "IoPeopleOutline"
    | "MdOutlineAnalytics"
    | "AiOutlineTransaction"
    | "RiComputerLine"
    | "CiViewTimeline"
    | "BiReceipt"
    | "MdPayment"
    | "FaMoneyBillTransfer"
    | "RiExchangeBoxLine"
    | "TfiShoppingCartFull"
    | "GrTransaction"
    | "MdOutlineSettingsInputComposite"
    | "LuCombine"
    | "IoMdAdd";

  interface IconProps {
    iconName: IconName;
    size?: number;
    color?: string;
  }
  function Icon({ iconName, size = 26, color = "red" }: IconProps) {
    const icons: Record<IconName, IconType> = {
      CgUnavailable: CgUnavailable,
      IoGridOutline: IoGridOutline,
      RiShoppingBagLine: RiShoppingBagLine,
      FiTag: FiTag,
      FiShoppingCart: FiShoppingCart,
      FaRegUser: FaRegUser,
      FiBook: FiBook,
      TbBuildingBank: TbBuildingBank,
      TbMoneybag: TbMoneybag,
      IoBarChartOutline: IoBarChartOutline,
      LuClipboardList: LuClipboardList,
      FiBox: FiBox,
      PiChartLineUpBold: PiChartLineUpBold,
      BsGraphDownArrow: BsGraphDownArrow,
      RiSignalTowerLine: RiSignalTowerLine,
      IoBan: IoBan,
      LiaFileInvoiceSolid: LiaFileInvoiceSolid,
      GoChecklist: GoChecklist,
      TbFileInvoice: TbFileInvoice,
      HiOutlineClipboardDocumentList: HiOutlineClipboardDocumentList,
      TbChecklist: TbChecklist,
      MdShoppingCartCheckout: MdShoppingCartCheckout,
      CgNotes: CgNotes,
      FiShoppingBag: FiShoppingBag,
      LuUser2: LuUser2,
      LiaLuggageCartSolid: LiaLuggageCartSolid,
      CiViewList: CiViewList,
      SlNotebook: SlNotebook,
      SlNote: SlNote,
      LuBookOpen: LuBookOpen,
      MdOutlineGroup: MdOutlineGroup,
      CiSettings: CiSettings,
      MdAttachMoney: MdAttachMoney,
      MdOutlineStickyNote2: MdOutlineStickyNote2,
      TbMessageQuestion: TbMessageQuestion,
      IoPeopleOutline: IoPeopleOutline,
      MdOutlineAnalytics: MdOutlineAnalytics,
      AiOutlineTransaction: AiOutlineTransaction,
      RiComputerLine: RiComputerLine,
      CiViewTimeline: CiViewTimeline,
      BiReceipt: BiReceipt,
      MdPayment: MdPayment,
      FaMoneyBillTransfer: FaMoneyBillTransfer,
      RiExchangeBoxLine: RiExchangeBoxLine,
      TfiShoppingCartFull: TfiShoppingCartFull,
      GrTransaction:GrTransaction,
      MdOutlineSettingsInputComposite: MdOutlineSettingsInputComposite,
      LuCombine: LuCombine,
      IoMdAdd: IoMdAdd,
    };
    if (!icons.hasOwnProperty(iconName)) {
      console.warn(
        `Icon '${iconName}' not found. Rendering default icon instead.`
      );
      iconName = "CgUnavailable"; // set default icon name
    }
    const IconComponent = icons[iconName];
    return <IconComponent size={size} color={props.color} />;
  }
  return <Icon iconName={props.name} size={props.size} />;
}
export default DynamicIcon;
