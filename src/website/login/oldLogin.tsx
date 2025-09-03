import API from "../../config/api";
import "./styles.scss";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

const OldLogin = (props: any) => {
  const { t } = props;

  return (
    <Link to={API.TAXGO_V1} target="_blank">
      <div className="website-LoginBtn1">{t("home_page.homepage.old_account")}</div>
    </Link>
  );
};

export default withTranslation()(OldLogin);
