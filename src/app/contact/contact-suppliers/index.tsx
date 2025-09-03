import { useEffect, useState } from "react";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { DELETE, GET } from "../../../utils/apiCalls";
import SupplierListTable from "./SupplierListTable";
import LoadingBox from "../../../components/loadingBox";
import { Button, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const ContactSuppliers = () => {
  const { t } = useTranslation();
  const { canCreateContacts } = useAccessControl();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliersList();
  }, [page, take]);

  
  let createdBy = user?.isStaff ? user?.staff?.id : user?.id;
  const fetchSuppliersList = async () => {
    try {
      setIsLoading(true);
      let suppliers_list_url =
      API.CONTACT_MASTER_LIST +
        `supplier/${adminid}/${createdBy}/${user.companyid}?order=DESC&page=${page}&take=${take}`;
      const { data }: any = await GET(suppliers_list_url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };
  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const delete_url = API.DELETE_CONTACT + id;
      const data: any = await GET(delete_url, null);
      fetchSuppliersList();
      if (data.status) {
        notification.success({ message: "Supplier Deleted Successfully" });
      } else {
        notification.error({
          message: "Something went wrong!! Please try again later",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something went wrong!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        firstPathLink={location?.pathname}
        firstPathText={t("home_page.homepage.Suppliers_List")}
        // buttonTxt={t("home_page.homepage.ADD_SUPPLIER")}
        // onSubmit={() => navigate("/usr/contactSuppliers/create")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Suppliers_List")}
        >
          <div>
            {canCreateContacts() && (
              <Button
                type="primary"
                onClick={() => navigate("/usr/contactSuppliers/create")}
              >
                {t("home_page.homepage.Add_suppliers")}
              </Button>
            )}
          </div>
      </PageHeader>
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <SupplierListTable
            list={data}
            onPageChange={(p: any, t: any) => onPageChange(p, t)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleDelete={handleDelete}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </>
  );
};

export default ContactSuppliers;
