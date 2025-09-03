import { Button, Modal, Popover, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import PageHeader from "../../components/pageHeader";
import ViewPopover from "../../components/viewPopover";
import { GET, POST, PUT } from "../../utils/apiCalls";
import { useAccessControl } from "../../utils/accessControl";
import CounterForm from "./components/form";
import CounterTable from "./components/table";
import { useTranslation } from "react-i18next";

function CounterScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user } = useSelector((state: any) => state.User);
  const location = useLocation();
  const { canViewCounters, canCreateCounters, canUpdateCounters, canDeleteCounters } = useAccessControl();

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [meta, setMeta] = useState<any>();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<any>([]);
  const [form, setForm] = useState(false);
  const [counter, setCounter] = useState(false);
  const [counterId, setCounterId] = useState(false);
  const [query, setQuery] = useState("");

  const columns = [
    {
      name: "id",
      title: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "name",
      title: `${t("home_page.homepage.Name_counter")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "balance",
      title: `${t("home_page.homepage.Balance_counter")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "id",
      title: `${t("home_page.homepage.Action_counter")}`,
      dataType: "string",
      cellRender: (data: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <ViewPopover
                  onView={canViewCounters() ? () => {
                    navigate(`/usr/counter/details/${data?.data?.id}`);
                  } : undefined}
                  OnEdit={canUpdateCounters() ? () => {
                    fetchCounterDetails(data?.data?.id);
                    setCounterId(data?.data?.id);
                  } : undefined}
                  OnDelete={canDeleteCounters() ? () => {
                    // Add delete functionality here
                    console.log("Delete counter:", data?.data?.id);
                  } : undefined}
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

  const fetchCounters = async () => {
    try {
      let obj = {
        adminId: user?.id,
        companyid: user?.companyInfo?.id,
        query: query,
        page: page,
        take: take,
      };
      let url = `billing_counter/list`;
      const response: any = await POST(url, obj);
      if (response?.status) {
        setList(response.datas);
        setMeta(response.meta);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("------- error -", error);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, [page, take, query]);

  const fetchCounterDetails = async (val: any) => {
    try {
      let url = `billing_counter/counter/${Number(val)}`;
      const response: any = await GET(url, null);
      if (response) {
        setCounter(response);
        setForm(true);
      }
    } catch (error) {
      console.log("------- error -", error);
    }
  };
  const onFinish = async (values: any) => {
    try {
      let shiftList: any = [];
      values.shift.forEach((shift: any) => {
        let startTime = dayjs(shift.time[0]).format("h:mm A");
        let endTime = dayjs(shift.time[1]).format("h:mm A");
        let shiftObj = {
          fromtime: startTime,
          totime: endTime,
          name: shift.name,
        };
        shiftList.push(shiftObj);
      });
      let url = !values.counterid
        ? `billing_counter/add`
        : `billing_counter/update/${values.counterid}`;
      let METHORD = !values.counterid ? POST : PUT;
      const obj = {
        adminid: user?.id,
        companyid: user?.companyInfo?.id,
        balance: values.balance || 0,
        name: values.name,
        sdate: values.sdate,
        shiftlist: shiftList,
        location:values?.location
      };
      const response: any = await METHORD(url, obj);
      if (response.status) {
        notification.success({
          message: "success",
          description: response.message,
        });
        setForm(false);
        fetchCounters();
      } else {
        notification.error({
          message: "Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: `Failed to create counter !!  Please try again later`,
      });
    }
  };

  return (
    <>
      <PageHeader
        firstPathText={t("home_page.homepage.countertitle")}
        firstPathLink={location.pathname}
        // buttonTxt={t("home_page.homepage.ADD")}
        // onSubmit={() => {
        //   setCounterId(false);
        //   setForm(true);
        // }}
        goback="/usr/dashboard"
        title={`${t("home_page.homepage.countertitle")}`}
      >
        <div>
          {canCreateCounters() && (
            <Button
              type="primary"
              onClick={() => {
                setCounterId(false);
                setForm(true);
              }}
            >
              + {t("home_page.homepage.ADD")}
              {` ${t("home_page.homepage.countertitle")}`}
            </Button>
          )}
        </div>

      </PageHeader>
      <div className="adminTable-Box1">
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Container>
            <br />
            <CounterTable
              columns={columns}
              list={list}
              onPage={(page: any, pageSize: any) => {
                setPage(page);
                setTake(pageSize);
              }}
              onQuery={(val: any) => setQuery(val)}
              query={query}
              meta={meta}
            />
          </Container>
        )}
      </div>
      {form && (
        <Modal
          open={form}
          width={window.innerWidth <= 480 ? "90%" : "40%"}
          closable={false}
          onCancel={() => {
            setForm(false);
            setCounter(false);
          }}
          footer={false}
        >
          <CounterForm
            onCancel={() => {
              setForm(false);
              setCounter(false);
            }}
            onSubmit={onFinish}
            counter={counter}
            counterId={counterId}
          />
        </Modal>
      )}
    </>
  );
}

export default CounterScreen;
