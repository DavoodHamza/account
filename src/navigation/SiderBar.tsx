import { useEffect, useState } from "react";
import SideItem from "./components/sideItem";
import "./styles.scss";
// import Data from "./privilages.json";
import { Popover } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { RiFlashlightLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import logo from "../../src/assets/images/logo.webp";
import logo2 from "../../src/assets/images/logo2.webp";
import API from "../config/api";
import { useAccessControl } from "../utils/accessControl";
import { GET } from "../utils/apiCalls";
import ProfileSider from "./components/ProfileSider";
import Subscription from "./components/subscription";

function SiderBar(props: any) {
  const { t } = useTranslation();
  const [expand, setexpand] = useState(0);
  const [planDetails, setPlanDetails] = useState<any>();
  const navigate = useNavigate();
  const { user }: any = useSelector((state: any) => state.User);
  const {
    canViewReceipts,
    canViewContra,
    canViewBank,
    canViewCash,
    canViewReports,
    canViewLedgers,
    canViewStaff,
    canViewSettings,
    hasAnyReceiptsPermission,
    hasAnySalesPermission,
    hasAnyPurchasePermission,
  } = useAccessControl();

  useEffect(() => {
    fetchSbscriptionDetails();
  }, []);

  let Data = [
    {
      id: 1,
      name: `${t("sidebar.title.dashboard")}`,
      route: "/usr/dashboard",
      icon: "IoGridOutline",
      submenu: [],
    },
    {
      id: 2,
      name: `${t("home_page.homepage.Product_Service")}`,
      route: "/usr/product",
      icon: "RiShoppingBagLine",
      submenu: [
        {
          id: 1,
          name: `${t("home_page.homepage.Stock")}`,
          route: "/usr/productStock",
          icon: "PiChartLineUpBold",
        },
        {
          id: 2,
          name: `${t("home_page.homepage.Non_Stock")}`,
          route: "/usr/productNonStock",
          icon: "IoBan",
        },
        {
          id: 3,
          name: `${t("home_page.homepage.service")}`,
          route: "/usr/productService",
          icon: "RiSignalTowerLine",
        },
      ],
    },
    {
      id: 22,
      name: `${t("home_page.homepage.Manufacture")}`,
      route: "",
      icon: "MdOutlineSettingsInputComposite",
      submenu: [
        {
          id: 1,
          name: `${t("home_page.homepage.BOM")}`,
          route: "/usr/productComposition",
          icon: "LuCombine",
        },
        {
          id: 2,
          name: `${t("home_page.homepage.Production")}`,
          route: "/usr/bomProduction",
          icon: "IoMdAdd",
        },
      ],
    },
    {
      id: 3,
      name: `${t("home_page.homepage.stock_transfer")}`,
      route: "/usr/stock-transfer",
      icon: "GrTransaction",
    },
    {
      id: 4,
      name: `${t("sidebar.title.sale")}`,
      route: "/usr/sale",
      icon: "FiTag",
      submenu: [
        {
          id: 1,
          name: `${t("home_page.homepage.Sales_Invoice")}`,
          route: "/usr/sales-invoice",
          icon: "LiaFileInvoiceSolid",
        },
        {
          id: 2,
          name: `${t("sidebar.title.proformaInvoice")}`,
          route: "/usr/sales-proforma-invoice",
          icon: "GoChecklist",
        },
        {
          id: 3,
          name: `${t("sidebar.title.cnote")}`,
          route: "/usr/salesCredit",
          icon: "HiOutlineClipboardDocumentList",
        },
        {
          id: 5,
          name: `${t("home_page.homepage.Reccuring_Notification")}`,
          route: "/usr/sales-reccuring-notification",
          icon: "TbChecklist",
        },
      ],
    },
    {
      id: 5,
      name: `${t("sidebar.title.purchase")}`,
      route: "/usr/Purchase",
      icon: "FiShoppingCart",
      submenu: [
        {
          id: 1,
          name: `${t("sidebar.title.purchace_stock")}`,
          route: "/usr/purchace-invoice",
          icon: "MdShoppingCartCheckout",
        },
        {
          id: 2,
          name: `${t("home_page.homepage.Debit_Notes")}`,
          route: "/usr/purchase-debit-note",
          icon: "CgNotes",
        },
        {
          id: 3,
          name: `${t("sidebar.title.purchace_assets")}`,
          route: "/usr/purchase-fore-assets",
          icon: "FiShoppingBag",
        },
        {
          id: 4,
          name: `${t("sidebar.title.purchace_order")}`,
          route: "/usr/purchase-order",
          icon: "TfiShoppingCartFull",
        },
      ],
    },
    {
      id: 6,
      name: `${t("sidebar.title.contact")}`,
      route: "/usr/contacts",
      icon: "FaRegUser",
      submenu: [
        {
          id: 1,
          name: `${t("sidebar.title.customer")}`,
          route: "/usr/contactCustomers",
          icon: "LuUser2",
        },
        {
          id: 1,
          name: `${t("sidebar.title.supplier")}`,
          route: "/usr/contactSuppliers",
          icon: "LiaLuggageCartSolid",
        },
      ],
    },
    {
      id: 7,
      name: `${t("sidebar.title.journal")}`,
      route: "/usr/journal",
      icon: "FiBook",
      submenu: [],
    },
    {
      id: 8,
      name: `${t("home_page.homepage.Payments")}`,
      route: "/usr/payments",
      icon: "MdPayment",
      submenu: [
        {
          id: 1,
          name: `${t("home_page.homepage.SupplierPayment")}`,
          route: "/usr/payments/supplier-payment",
          icon: "MdShoppingCartCheckout",
        },
        {
          id: 2,
          name: `${t("home_page.homepage.OtherPayment")}`,
          route: "/usr/payments/other-payment",
          icon: "MdPayment",
        },
        {
          id: 3,
          name: `${t("home_page.homepage.CustomerRefund")}`,
          route: "/usr/payments/customer-refund",
          icon: "HiOutlineClipboardDocumentList",
        },
      ],
    },
    ...(hasAnyReceiptsPermission()
      ? [
          {
            id: 9,
            name: `${t("home_page.homepage.Reciepts")}`,
            route: "/usr/receipts",
            icon: "BiReceipt",
            submenu: [
              {
                id: 1,
                name: `${t("home_page.homepage.CustomerReceipt")}`,
                route: "/usr/receipts/customer-receipt",
                icon: "LiaFileInvoiceSolid",
              },
              {
                id: 2,
                name: `${t("home_page.homepage.OtherReceipt")}`,
                route: "/usr/receipts/other-receipt",
                icon: "BiReceipt",
              },
              {
                id: 3,
                name: `${t("home_page.homepage.SupplierRefund")}`,
                route: "/usr/receipts/supplier-refund",
                icon: "CgNotes",
              },
            ],
          },
        ]
      : []),
    ...(canViewContra()
      ? [
          {
            id: 10,
            name: `${t("home_page.homepage.contra_voucher")}`,
            route: "/usr/contra",
            icon: "RiExchangeBoxLine",
            submenu: [],
          },
        ]
      : []),
    ...(canViewBank()
      ? [
          {
            id: 11,
            name: `${t("sidebar.title.bank")}`,
            route: "/usr/cashBank",
            icon: "TbBuildingBank",
            submenu: [],
          },
        ]
      : []),
    ...(canViewCash()
      ? [
          {
            id: 12,
            name: `${t("sidebar.title.cash")}`,
            route: "/usr/cash",
            icon: "TbMoneybag",
            submenu: [],
          },
        ]
      : []),
    ...(canViewReports()
      ? [
          {
            id: 13,
            name: `${t("home_page.homepage.Report")}`,
            route: "/usr/report",
            icon: "IoBarChartOutline",
            submenu: [],
          },
        ]
      : []),
    ...(canViewLedgers()
      ? [
          {
            id: 14,
            name: `${t("home_page.homepage.Ledger")}`,
            route: "/usr/ledgers",
            icon: "LuClipboardList",
            submenu: [
              {
                id: 1,
                name: `${t("sidebar.title.myledger")}`,
                route: "/usr/ledgerMyLedger",
                icon: "CiViewList",
              },
              {
                id: 2,
                name: `${t("sidebar.title.defaultledger")}`,
                route: "/usr/ledgerDefaultLedger",
                icon: "SlNotebook",
              },
              {
                id: 3,
                name: `${t("sidebar.title.mycategory")}`,
                route: "/usr/ledgerMyCategory",
                icon: "SlNote",
              },
              {
                id: 4,
                name: `${t("home_page.homepage.Defualt_Category")}`,
                route: "/usr/ledgerDefaultCategory",
                icon: "LuBookOpen",
              },
              {
                id: 5,
                name: `${t("home_page.homepage.Fixed_Asset")}`,
                route: "/usr/purchaseFixedAsset",
                icon: "RiSignalTowerLine",
              },
              // {
              //   id: 6,
              //   name: `${t("home_page.homepage.Pay_Heads")}`,
              //   route: "/usr/payHead",
              //   icon: "CiViewList",
              // },
            ],
          },
        ]
      : []),
    // {
    //   id: 17,
    //   name: `${t("home_page.homepage.payroll")}`,
    //   route: "/usr/payroll/paysheet",
    //   icon: "MdAttachMoney",
    //   submenu: [
    //     {
    //       id: 1,
    //       name: `${t("home_page.homepage.Pay_Sheet")}`,
    //       route: "/usr/payroll/paysheet",
    //       icon: "CgNotes",
    //     },
    //     {
    //       id: 2,
    //       name: `${t("home_page.homepage.Employees")}`,
    //       route: "/usr/payroll/employees",
    //       icon: "MdOutlineGroup",
    //     },
    //   ],
    // },
    {
      id: 18,
      name: `${t("home_page.homepage.Proposal")}`,
      route: "/usr/proposal",
      icon: "MdOutlineStickyNote2",
      submenu: [],
    },
    ...(canViewStaff()
      ? [
          {
            id: 19,
            name: `${t("home_page.homepage.staff")}`,
            route: "/usr/staffs",
            icon: "IoPeopleOutline",
            submenu: [],
          },
        ]
      : []),
    {
      id: 20,
      name: `${t("home_page.homepage.counter")}`,
      route: "/usr/counter",
      icon: "RiComputerLine",
      submenu: [],
    },
    {
      id: 21,
      name: `${t("home_page.homepage.stripe_log")}`,
      route: "/usr/stripe-log",
      icon: "CiViewTimeline",
      submenu: [],
    },
    ...(canViewSettings()
      ? [
          {
            id: 21,
            name: `${t("home_page.homepage.Settings")}`,
            route: "/usr/company-profile/business",
            icon: "CiSettings",
            submenu: [],
          },
        ]
      : []),
  ];
  if (user.isStaff) {
    let access = user?.staff?.access?.split("|") || [];
    Data = Data.filter((item) => access?.includes(item.id + ""));
    Data.push(
      {
        id: 15,
        name: `Transactions`,
        route: "/usr/staff-transactions",
        icon: "AiOutlineTransaction",
        submenu: [],
      },
      {
        id: 16,
        name: `Activities`,
        route: "/usr/staff-activities",
        icon: "MdOutlineAnalytics",
        submenu: [],
      }
    );
  }

  const fetchSbscriptionDetails = async () => {
    try {
      let url = API.USER_SUBSCRIBED_PLAN;
      const response: any = await GET(url, null);
      if (response?.status) {
        setPlanDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={props.collapsed ? "" : "Navigation-SiderBar scroll"}>
      <div onClick={() => navigate("/usr/dashboard")}>
        {props.collapsed === true ? (
          <img style={{ width: 70, height: 60 }} src={logo} alt="logo" />
        ) : (
          <img
            style={{ width: 200, height: 60, objectFit: "cover" }}
            src={logo2}
            alt="logo2"
          />
        )}
      </div>
      <div>
        <ProfileSider collapsed={props.collapsed} />
      </div>
      {user.isStaff ? null : (
        <>
          {props.collapsed ? (
            <div style={{ margin: 10 }} />
          ) : (
            <div
              className="SiderBar-txt1"
              onClick={() => navigate("/user-profile/subscription")}
            >
              {t("home_page.homepage.SUBSCRIPTION")}
            </div>
          )}
          <Popover
            content={<Subscription planDetails={planDetails} />}
            title={t("home_page.homepage.CURRENT_SUBSCRIPTION")}
            placement="right"
            arrow={false}
          >
            <div
              style={{ padding: 14, cursor: "pointer" }}
              onClick={() => navigate("/user-profile/subscription")}
            >
              <div className="SiderBar-card">
                {props.collapsed ? (
                  <span className="SiderBar-cardtxt1">
                    <RiFlashlightLine />
                  </span>
                ) : (
                  <div style={{ flex: 1, margin: 10 }}>
                    {planDetails?.period === 1
                      ? "1 Month"
                      : planDetails?.period === 12
                      ? "12 Months"
                      : planDetails?.period === 24
                      ? "24 Months"
                      : "2 weeks"}{" "}
                    -{" "}
                    <span className="SiderBar-cardtxt">
                      {planDetails?.period === 1 ||
                      planDetails?.period === 12 ||
                      planDetails?.period === 24
                        ? "Premium Plan"
                        : "Free Plan"}
                    </span>
                    {new Date(planDetails?.subscriptionExpiry) <= new Date() &&
                      (moment(planDetails?.subscriptionExpiry).format(
                        "YYYY-MM-DD"
                      ) == moment(new Date()).format("YYYY-MM-DD") ? (
                        <p style={{ marginBottom: 0, color: "red" }}>
                          Expires Today
                        </p>
                      ) : (
                        <p style={{ marginBottom: 0, color: "red" }}>Expired</p>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Popover>
        </>
      )}
      {/* {retail()} */}
      {props.collapsed ? null : (
        <div className="SiderBar-txt1">{t("home_page.homepage.MAIN_MENU")}</div>
      )}
      <div className="SiderBar-scroll">
        {Data?.map((item: any) => {
          return (
            <SideItem
              key={item.id}
              id={item.id}
              name={item.name}
              item={item}
              Icon={item.icon}
              collapsed={props.collapsed}
              expand={expand}
              clickExpand={(val: any) => setexpand(val)}
            />
          );
        })}
      </div>
      <br /> <br />
    </div>
  );
}

export default SiderBar;
