import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import { useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import Table from "../components/table";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { DELETE, GET } from "../../../utils/apiCalls";
import moment from "moment";
import DataSource from "devextreme/data/data_source";
export default function CompositionListScreen() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  //   state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);

  //declared const and let variables
  const columns = [
    {
      name: "id",
      title: `${t("home_page.homepage.sl_no")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: false,
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "Product",
      title: `${t("home_page.homepage.Product")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: true,
      cellRender: ({ data }: any) => data?.Product.idescription,
    },
    {
      name: "quantity",
      title: `${t("home_page.homepage.Qantity")}`,
      dataType: "number",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => Number(data?.quantity),
    },
    {
      name: "compositeBomItems",
      title: `${t("home_page.homepage.No_of_Composite")}`,
      dataType: "number",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => Number(data?.compositeBomItems?.length),
    },
    {
      name: "byProductBomItems",
      title: `${t("home_page.homepage.No_of_Byproduct")}`,
      dataType: "number",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => Number(data?.byProductBomItems?.length),
    },
    {
      name: "createdAt",
      title: `${t("home_page.homepage.Date")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) =>
        moment(data?.createdAt).format("DD/MM/YYYY"),
    },
  ];
  //function
  interface ExtractedData {
    productSearch: string;
    ids: number[];
  }
  type FilterCondition = (string | number)[] | string | FilterCondition[];
  function parseFiltersRecursively(
    filters: FilterCondition | FilterCondition[],
    data: ExtractedData = { productSearch: "", ids: [] }
  ): ExtractedData {
    if (!filters) return data;

    if (!Array.isArray(filters[0])) {
      filters = [filters];
    }

    (filters as FilterCondition[]).forEach((filter) => {
      if (Array.isArray(filter)) {
        if (
          filter.length === 3 &&
          filter[0] === "Product" &&
          filter[1] === "contains"
        ) {
          data.productSearch = filter[2] as string;
        } else if (
          filter.length === 3 &&
          filter[0] === "id" &&
          filter[1] === "="
        ) {
          data.ids.push(filter[2] as number);
        } else {
          parseFiltersRecursively(filter as FilterCondition[], data);
        }
      }
    });

    return data;
  }
  const store = new DataSource({
    key: "id",

    async load(loadOptions: any) {
      let sPageNo: number | "" = "";
      let sPageSize: number | "" = "";
      if (loadOptions?.skip >= 0 && loadOptions?.take >= 0) {
        sPageNo = loadOptions?.skip / loadOptions?.take + 1;
        sPageSize = loadOptions?.take;
      }
      let filteredData: ExtractedData;
      filteredData = parseFiltersRecursively(loadOptions?.filter);
      const arrayIdString = encodeURIComponent(
        JSON.stringify(filteredData?.ids)
      );
      try {
        let url =
          API.GET_BOM_LIST_BY_COMPANY +
          `?companyId=${user?.companyInfo?.id}&searchProduct=${filteredData?.productSearch}&ids=${arrayIdString}&order=DESC&page=${sPageNo}&take=${sPageSize}`;
        const response: any = await GET(url, null);
        console.log("response?.Status Code", response?.status);
        if (response?.status) {
          return {
            data: response?.data?.data,
            totalCount: response?.data?.meta?.itemCount,
          };
        } else {
          notificationApi.error({
            message: "Failed",
            description: response?.message || "Something Went Wrong in Our End",
          });
          return {
            data: [],
            totalCount: 0,
          };
        }
      } catch (error: any) {
        notificationApi.error({
          message: "Failed",
          description: error?.message || "Something Went Wrong in Our End",
        });
        return {
          data: [],
          totalCount: 0,
        };
      }
    },
  });
  //-----------------test---------------------------//
  const deleteBom = async (DeleteId: any) => {
    try {
      setIsLoading(true);
      let url =
        API.BOM_BY_ID + `${DeleteId}?companyId=${user?.companyInfo?.id}`;
      const res: any = await DELETE(url);
      if (res.status) {
        notification.success({
          message: "Success",
          description: "BOM deleted successfully",
        });
        store.reload();
      } else {
        notificationApi.error({
          message: "Failed",
          description: res?.message || "Something Went Wrong in Our End",
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Failed",
        description: error?.message || "Something Went Wrong in Our End",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === `${t("home_page.homepage.sl_no")}`
    ) {
      const id = gridCell?.column?.index + 1;

      if (type === "pdf") {
        cell.text = id.toString();
      } else if (type === "xlsx") {
        cell.value = id;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === `${t("home_page.homepage.Product")}`
    ) {
      if (type === "pdf") {
        cell.text = gridCell?.value?.idescription;
      } else if (type === "xlsx") {
        cell.value = gridCell?.value?.idescription;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === `${t("home_page.homepage.No_of_Composite")}`
    ) {
      if (type === "pdf") {
        cell.text = String(gridCell?.value?.length);
      } else if (type === "xlsx") {
        cell.value = gridCell?.value?.length || 0;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === `${t("home_page.homepage.No_of_Byproduct")}`
    ) {
      if (type === "pdf") {
        cell.text = String(gridCell?.value?.length);
      } else if (type === "xlsx") {
        cell.value = gridCell?.value?.length || 0;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === `${t("home_page.homepage.Date")}`
    ) {
      if (type === "pdf") {
        cell.text = moment(gridCell?.value)?.format("DD/MM/YYYY");
      } else if (type === "xlsx") {
        cell.value = moment(gridCell?.value)?.format("DD/MM/YYYY");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <PageHeader
        firstPathLink={location.pathname.replace("/create", "")}
        secondPathLink={location?.pathname}
        secondPathText={`${t("home_page.homepage.BOM_List")}`}
        goBack={"/usr/productComposition"}
        title={`${t("home_page.homepage.BOM_List")}`}>
        <div>
          <Button
            type="primary"
            onClick={() => navigate("/usr/create-composition")}>
            {`${t("home_page.homepage.CREATE")}`}
          </Button>
        </div>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Table
          bomStore={store}
          columns={columns}
          searchPlaceHolder={"Search Products"}
          deleteBom={deleteBom}
          tableType="bom"
          onSuccess={() => console.log("not Implemented u54694u60")}
          title={`${t("home_page.homepage.Bill_of_Material_(BOM)")}`}
          exportFileTitle={"Bill of Material (BOM)"}
          handleEditClick={() => {}}
          customizeExportCell={customizeExportCell}
        />
      )}
    </>
  );
}
