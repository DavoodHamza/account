import { useTranslation } from "react-i18next";


function Subscription(props:any) {
  const { t } = useTranslation();
  return (
    <div>
      {props?.planDetails?.period === 1
        ? "Premium Plan - 1 Month"
        : props?.planDetails?.period === 12
        ? "Premium Plan - 12 Months"
        : props?.planDetails?.period === 24
        ? "Premium Plan - 24 Months"
        : "Free Plan - 2 Weeks"}
    </div>
  );
}

export default Subscription;
