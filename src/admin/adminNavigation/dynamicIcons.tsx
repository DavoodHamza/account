import { IconType } from "react-icons";
import { RiContactsLine, RiCoupon3Line } from "react-icons/ri";
import { IoNewspaperOutline } from "react-icons/io5";
import { CgUnavailable } from "react-icons/cg";
import { TbDeviceMobileCheck, TbMathSymbols } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { FaRegCreditCard } from "react-icons/fa6";

function DynamicIcon(props: any) {
  type IconName =
    | "IoNewspaperOutline"
    | "RiCoupon3Line"
    | "CgUnavailable"
    | "TbMathSymbols"
    | "TbDeviceMobileCheck"
    | "LuUsers"
    | "RxDashboard"
    | "RiContactsLine"
    | "FaRegCreditCard";

  interface IconProps {
    iconName: IconName;
    size?: number;
    color?: string;
  }
  function Icon({ iconName, size = 26, color = "red" }: IconProps) {
    const icons: Record<IconName, IconType> = {
      IoNewspaperOutline: IoNewspaperOutline,
      RiCoupon3Line: RiCoupon3Line,
      CgUnavailable: CgUnavailable,
      TbMathSymbols: TbMathSymbols,
      TbDeviceMobileCheck: TbDeviceMobileCheck,
      LuUsers: LuUsers,
      RxDashboard: RxDashboard,
      RiContactsLine: RiContactsLine,
      FaRegCreditCard:FaRegCreditCard
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
