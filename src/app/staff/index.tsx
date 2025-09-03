import React, { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import StaffTable from "./components/table";
import { Container } from "react-bootstrap";
import { DELETE, GET } from "../../utils/apiCalls";
import API from "../../config/api";
import { useSelector } from "react-redux";
import { Button, Popover, notification, Space } from "antd";
import ViewPopover from "../../components/viewPopover";
import { BsThreeDotsVertical } from "react-icons/bs";
import { KeyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../utils/accessControl";

const StaffScreen = () => {
  const { t } = useTranslation();
  const columns = [
    {
      name: "id",
      title: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "name",
      title: t("home_page.homepage.Name_db"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "staffId",
      title: t("home_page.homepage.StaffID_db"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "reference",
      title: t("home_page.homepage.Reference_db"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "email",
      title: t("home_page.homepage.Email_db"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "mobile",
      title: t("home_page.homepage.mobile_db"),
      dataType: "string",
      alignment: "center",
    },
    {
      name: "id",
      title: t("home_page.homepage.Action"),
      dataType: "string",
      cellRender: (data: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <ViewPopover
                  onView={
                    canViewStaff()
                      ? () => {
                          navigate(`/usr/staff/details/${data?.data?.id}`);
                        }
                      : undefined
                  }
                  OnEdit={
                    canEditStaff()
                      ? () => {
                          navigate(`/usr/staff/edit/${data?.data?.id}`);
                        }
                      : undefined
                  }
                  OnDelete={
                    canDeleteStaff()
                      ? () => {
                          handleDelete(data?.data?.id);
                        }
                      : undefined
                  }
                />
              }
              placement="bottom"
              trigger={"click"}
            >
              <BsThreeDotsVertical size={16} cursor={"pointer"} />
            </Popover>
          </div>
        );
      },
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const [staffData, setStaffData] = useState<any>();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const {
    canViewStaff,
    canCreateStaff,
    canEditStaff,
    canDeleteStaff,
    isAdmin,
  } = useAccessControl();

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const url = API.CONTACT_MASTER + id;
      const response: any = await DELETE(url);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Staff deleted successfully",
        });
        fetchStaffList();
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to delete staff",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to delete staff!! Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, [page, take]);

  const fetchStaffList = async () => {
    try {
      setIsLoading(true);
      let customer_list_url =
        API.CONTACT_MASTER_LIST +
        `staff/${adminid}/${adminid}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}`;
      const { data }: any = await GET(customer_list_url, null);
      setStaffData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageHeader
        firstPath={t("home_page.homepage.Staff_List")}
        firstPathLink={location.pathname}
        // buttonTxt={t("home_page.homepage.add")}
        // onSubmit={ () => navigate("/usr/staff/create/0")}
        goback="/usr/dashboard"
        title={t("home_page.homepage.Staff_List")}
      >
        <div>
          <Space>
            {canCreateStaff() && (
              <Button
                type="primary"
                onClick={() => navigate("/usr/staff/create/0")}
              >
                + {t("home_page.homepage.add")}{" "}
                {t("home_page.homepage.Staff_List")}
              </Button>
            )}
          </Space>
        </div>
      </PageHeader>
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Container>
            <br />
            <StaffTable columns={columns} list={staffData} />
          </Container>
        )}
      </div>
    </>
  );
};

export default StaffScreen;
