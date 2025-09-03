import React, { useEffect, useState, useCallback } from "react";
import { GET } from "../../../utils/apiCalls";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles.scss";
import Table from "../components/table";
import ExcelImport from "../../../components/ExcelImport";
import { Button, Tooltip } from "antd";
import { SiMicrosoftexcel } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { useAccessControl } from "../../../utils/accessControl";

const ProductStock = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);
  const { canCreateProducts } = useAccessControl();
  const columns = [
    {
      name: "id",
      title: "slno",
      // title: `${t("home_page.homepage.slno")}`,
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: "icode",
      title: `${t("home_page.homepage.Code")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "idescription",
      title: `${t("home_page.homepage.Item_Name")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "itemtype",
      title: `${t("home_page.homepage.Type")}`,
      dataType: "string",
      alignment: "center",
      // cellRender:async ({ data }: any) => {
      //   let ppp: any =  await ;
      //   console.log("ppppppppppppp",ppp)
      //   return (
      //     <div>{await translateText(data?.itemtype,"ml")}</div>
      //   )
      // }
    },
    {
      name: "product_category",
      title: `${t("home_page.homepage.Product_Category")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.productCategory?.category || "N/A",
    },
    {
      name: "stock",
      title: `${t("home_page.homepage.Quantity_in_Stock")}`,
      dataType: "number",
      alignment: "center",
      cellRender: ({ data }: any) => Number(data?.stock),
    },
    {
      name: "unit",
      title: `${t("home_page.homepage.Unit")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.unitDetails?.unit || "N/A",
    },
    {
      name: "c_price",
      title: `${t("home_page.homepage.Rate")}`,
      dataType: "string",
      alignment: "center",
    },
    {
      name: "location",
      title: `${t("home_page.homepage.Location")}`,
      dataType: "string",
      alignment: "center",
      cellRender: ({ data }: any) => data?.locationMatser?.location || "N/A",
    },
    {
      name: "vat",
      title:
        user?.companyInfo?.tax === "gst"
          ? t("home_page.homepage.gst")
          : t("home_page.homepage.vat"),
      dataType: "string",
      alignment: "center",
    },
  ];
  let template = API.SAMPLE_PRODCUT_EXCEL;
  const [data, setData] = useState();
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [itemTotal, setItemTotal] = useState(0);
  const [excelModal, setExcelModal] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search using setTimeout
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1500); // Increased from 300ms to 600ms
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    loadData(page, take, debouncedSearch);
  }, [page, take, debouncedSearch]);

  const adminid = user?.id;

  const loadData = async (page: any, take: any, searchValue = "") => {
    // Only show loading for initial load, not for searches
    if (!data) {
      setIsLoading(true);
    } else if (searchValue.trim()) {
      // Only show searching indicator if there's an actual search term
      setIsSearching(true);
    }

    let product_url =
      API.PRODUCT_MASTER_USER +
      `Stock/${adminid}/${user?.companyInfo?.id}?order=DESC&page=${page}&take=${take}` +
      (searchValue ? `&search=${encodeURIComponent(searchValue)}` : "");

    try {
      const { data: responseData, meta }: any = await GET(product_url, null);
      setItemTotal(meta?.itemCount);
      setData(responseData);
      setMeta(meta);
    } catch (error) {
      console.error("Error loading data:", error);
      // Keep existing data on error
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        firstPathLink={location.pathname.replace("/create/0", "")}
        secondPathLink={location?.pathname}
        secondPathText={t("home_page.homepage.Product_Stock_List")}
        goBack={"/usr/productStock"}
        title={t("home_page.homepage.List_All_Stocks")}
      >
        <div>
          <Tooltip title="Import from Excel">
            <Button onClick={() => setExcelModal(true)}>
              <SiMicrosoftexcel size={20} />
            </Button>
          </Tooltip>
          &nbsp;
          {canCreateProducts() && (
            <Button
              type="primary"
              onClick={() => navigate("/usr/create-product/Stock/create/0")}
            >
              {t("home_page.homepage.Add_Stock")}
            </Button>
          )}
        </div>
      </PageHeader>
      <Table
        products={isLoading ? null : data}
        columns={columns}
        take={take}
        page={page}
        total={meta?.itemCount}
        onItemSelect={() => {}}
        onPageChange={(p: any, t: any) => onPageChange(p, t)}
        onSuccess={() => loadData(page, take, debouncedSearch)}
        onSearch={onSearch}
        searchValue={search}
        title={t("home_page.homepage.Stock")}
        isSearching={isSearching}
        isLoading={isLoading}
      />
      {excelModal ? (
        <ExcelImport
          visible={excelModal}
          onCancel={() => setExcelModal(false)}
          onSucess={() => loadData(page, take)}
          URL={API.ADD_PRODUCT_VIA_EXCEL}
          template={template}
          type={"Stock"}
        />
      ) : null}
    </>
  );
};

export default ProductStock;
