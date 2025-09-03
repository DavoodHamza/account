import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/pageHeader";
import { Button, notification } from "antd";
import {  useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import DataSource from "devextreme/data/data_source";
import Table from "../components/table";

//BOM production
export default function ProductionListScreen() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  //   state
  const { user } = useSelector((state: any) => state.User);
  const [isLoading, setIsLoading] = useState(false);

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
      title:`${t("home_page.homepage.Product")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: true,
      cellRender: ({ data }: any) => data?.productDetails.idescription,
    },
    {
      name: "quantity",
      title:`${t("home_page.homepage.Total_Quantity")}`,
      dataType: "number",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => Number(data?.totalQuantity),
    },
    {
      name: "compositeBomItems",
      title: `${t("home_page.homepage.No_of_Composite")}`,
      dataType: "number",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) =>
        Number(data?.compositeProductionItems?.length),
    },
    {
      name: "consumptionLocation",
      title: `${t("home_page.homepage.Consumption_Location")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => data?.consumptionLocation.location,
    },
    {
      name: "productionLocation",
      title: `${t("home_page.homepage.Production_Location")}`,
      dataType: "string",
      alignment: "center",
      allowSearch: false,
      cellRender: ({ data }: any) => data?.productionLocation.location,
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
          API.GET_PRODUCTION_LIST_BY_COMPANY +
          `?companyId=${user?.companyInfo?.id}&search=${filteredData?.productSearch}&ids=${arrayIdString}&order=DESC&page=${sPageNo}&take=${sPageSize}`;
        const response: any = await GET(url, null);
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

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (gridCell.rowType === "data" && gridCell?.column?.caption === "Sl no") {
      const id = gridCell?.column?.index + 1;
      if (type === "pdf") {
        cell.text = id.toString();
      } else if (type === "xlsx") {
        cell.value = id;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === "Product"
    ) {
      if (type === "pdf") {
        cell.text = gridCell?.data?.productDetails?.idescription;
      } else if (type === "xlsx") {
        cell.value = gridCell?.data?.productDetails?.idescription;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === "Total Quantity"
    ) {
      if (type === "pdf") {
        cell.text = String(gridCell?.data?.totalQuantity);
      } else if (type === "xlsx") {
        cell.value = gridCell?.data?.totalQuantity || 0;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === "No.of Composite"
    ) {
      if (type === "pdf") {
        cell.text = String(gridCell?.data?.compositeProductionItems?.length);
      } else if (type === "xlsx") {
        cell.value = gridCell?.data?.compositeProductionItems?.length || 0;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === "Consumption Location"
    ) {
      if (type === "pdf") {
        cell.text = gridCell?.data?.consumptionLocation?.location;
      } else if (type === "xlsx") {
        cell.value = gridCell?.data?.consumptionLocation?.location;
      }
    }
    if (
      gridCell.rowType === "data" &&
      gridCell?.column?.caption === "Production Location"
    ) {
      if (type === "pdf") {
        cell.text = gridCell?.data?.productionLocation?.location;
      } else if (type === "xlsx") {
        cell.value = gridCell?.data?.productionLocation?.location;
      }
    }
    if (gridCell.rowType === "data" && gridCell?.column?.caption === "Date") {
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
        secondPathText={`${t("home_page.homepage.Production_List")}`}
        goBack={"/usr/bomProduction"}
        title={`${t("home_page.homepage.Production_List")}`}
      >
        <div>
          <Button
            type="primary"
            onClick={() => navigate("/usr/create-production")}
          >
            {t("home_page.homepage.CREATE")}
          </Button>
        </div>
      </PageHeader>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <Table
            bomStore={store}
            columns={columns}
            tableType="production"
            searchPlaceHolder={"Search Products"}
            onSuccess={() => console.log("not Implemented u54694u60")}
            title={`${t("home_page.homepage.Production_List")}`}
            exportFileTitle={"Production"}
            handleEditClick={undefined}
            deleteBom={undefined}
            customizeExportCell={customizeExportCell}
          />
        </>
      )}
    </>
  );
}
