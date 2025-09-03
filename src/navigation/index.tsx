import { Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CashBank from "../app/bank/cash-bank";
import BankDetails from "../app/bank/cash-bank/components/Bankdetails";
import ReconcilePage from "../app/bank/cash-bank/components/ReconcilePage";
import Cash from "../app/cash";
import ContactCustomers from "../app/contact/contact-customers";
import ContactSuppliers from "../app/contact/contact-suppliers";
import Dashboard from "../app/dashboard";
import Journal from "../app/journals";
import ProductNonStock from "../app/product/product-nonstock";
import ProductService from "../app/product/product-service";
import ProductStock from "../app/product/product-stock";
import PurchaseDebitNote from "../app/purchase/purchase-debitnotes";
import PurchaseInvoice from "../app/purchase/purchase-invoice";
import CreditNotes from "../app/sales/sales-credit";
import Header from "./Header";
import SiderBar from "./SiderBar";
import HelpBox from "./components/helpBox";
import NotificatonBox from "./components/notificatonBox";
import "./styles.scss";

//Ledger screens
import LedgerDefaultCategory from "../app/ledger/ledger-DefaultCategory";
import LedgerDefaultLedger from "../app/ledger/ledger-DefaultLedger";
import LedgerMyCategory from "../app/ledger/ledger-MyCategory";
import LedgerMyLedger from "../app/ledger/ledger-MyLedger";

import CreateCutomer from "../app/contact/contact-customers/components/CreateCutomer";
import CustomerDetails from "../app/contact/contact-customers/components/CustomerDetails";
import EditCustomerDetails from "../app/contact/contact-customers/components/EditCustomerDetails";
import CreateSupplier from "../app/contact/contact-suppliers/components/CreateSupplier";
import EditSupplier from "../app/contact/contact-suppliers/components/EditSupplier";
import SupplierDetails from "../app/contact/contact-suppliers/components/SupplierDetails";
import Merchant from "../app/merchant";
import RecoveryNotification from "../app/sales/reccuring-notification";
import SaleNewCreditNotes from "../app/sales/sales-newCreditNotes";

import ViewBankTransfer from "../app/bank/cash-bank/components/TransactionView/ViewBankTransfer";
import CashTable from "../app/cash/component/cashTable";
import PurchasePaymentForm from "../app/cash/component/form/purchasePayment";
import CustumerReceiptForm from "../app/cash/component/form/salesReceipt";
import CashView from "../app/cash/component/view";
import CreateJournal from "../app/journals/component/create-journal";
import PayRollForm from "../app/payroll/component/form";
import PaySheet from "../app/payroll/paySheet";
import Employees from "../app/payroll/payrollEmployees";
import ProductAdd from "../app/product/components/form";
import ProductView from "../app/product/components/view";
import Report from "../app/report";
import BalanceSheet from "../app/report/BalanceSheet";
import ProfitnLoss from "../app/report/ProfitnLoss";
import StockSummary from "../app/report/StockSummary";
import VatNominalView from "../app/report/VatGst/VatNominalView";
import VatReturnView from "../app/report/VatGst/VatReturnView";
import VatReturns from "../app/report/VatGst/VatReturns";
import Settings from "../app/settings";

import AddBankDetails from "../app/bank/cash-bank/components/addBank";
import EditJournal from "../app/journals/component/EditJournal";
import JournalDetails from "../app/journals/component/JournalDetails";
import TrialBalance from "../app/report/TrialBalance";

//sales invoice screens
import SalesInvoice from "../app/sales/sales-invoice";
import SaleInvoiceForm from "../app/sales/sales-invoice/invoiceForm";
import SaleInvoiceView from "../app/sales/sales-invoice/view";
//perfoma invoice screens
import SaleInvoiceProforma from "../app/sales/sales-proforma";
import ProformaInvoiceForm from "../app/sales/sales-proforma/invoiceForm";

import AgedCreditors from "../app/report/AgedCreditors";
import AgedDebtors from "../app/report/AgedDebtors";

import PurchaceInvoice from "../app/purchase/purchase-invoice";
import PurchaceInvoiceForm from "../app/purchase/purchase-invoice/component/invoiceForm";

import BankTransfer from "../app/bank/cash-bank/components/MoreOptions/bank-Transfer/BankTransfer";
import BankPurchasePayment from "../app/bank/cash-bank/components/MoreOptions/purchase-payment";
import BankSalesReciept from "../app/bank/cash-bank/components/MoreOptions/sales-reciept";
import PurchaseFixedAsset from "../app/product/product-asset";
import Proposal from "../app/proposal";
import ProposalForm from "../app/proposal/components/Form";
import PurchaseAsset from "../app/purchase/purchase-assets";
import PurchaseAssetForm from "../app/purchase/purchase-assets/purchaseAssetForm";
import PurchaseAssetViewPage from "../app/purchase/purchase-assets/viewPage";
import PurchaceDebitnotesForm from "../app/purchase/purchase-debitnotes/component/invoiceForm";
import StockMonth from "../app/report/StockSummary/stockmonth";
import CreditNotesForm from "../app/sales/sales-credit/CreditNotesForm";
import Edit from "../app/sales/sales-credit/Edit";
import ViewCreditNote from "../app/sales/sales-credit/ViewCreditNote";

import { useSelector } from "react-redux";
import CounterScreen from "../app/Conter";
import CounterView from "../app/Conter/components/view";
import Reconcile from "../app/bank/cash-bank/components/Bankdetails/Reconcile";
import CustomerRefund from "../app/bank/cash-bank/components/MoreOptions/purchase-payment/customerRefund";
import OtherPayment from "../app/bank/cash-bank/components/MoreOptions/purchase-payment/otherPayment";
import SupplierPayment from "../app/bank/cash-bank/components/MoreOptions/purchase-payment/supplierPayment";
import CustomerReciept from "../app/bank/cash-bank/components/MoreOptions/sales-reciept/customerReciept";
import OtherReciept from "../app/bank/cash-bank/components/MoreOptions/sales-reciept/otherReciept";
import SupplierRefund from "../app/bank/cash-bank/components/MoreOptions/sales-reciept/supplierRefund";
import ViewPurchasePaymentScreens from "../app/bank/cash-bank/components/TransactionView/ViewPurchasePayment";
import AddCashDetails from "../app/cash/component/addCash";
import PayHead from "../app/ledger/ledger-PayHead";
import AddPayHeadLedger from "../app/ledger/ledger-PayHead/components/addLedger";
import ViewLedger from "../app/ledger/view";
import PaySheetView from "../app/payroll/paySheet/view";
import PayrollEmployeesViewPage from "../app/payroll/payrollEmployees/viewPage";
import CompanyProfile from "../app/profile/companyProfile";
import EditProposal from "../app/proposal/components/EditProposal";
import ProposalView from "../app/proposal/components/View";
import DebitNotInvoiceView from "../app/purchase/purchase-debitnotes/component/view";
import PurchaceInvoiceView from "../app/purchase/purchase-invoice/component/view";
import HsnCodeScreen from "../app/report/HsnCode";
import HsnCodeReport from "../app/report/HsnCode/components/hsn_report";
import StaffReport from "../app/report/StaffReport";
import Stockbase from "../app/report/StockSummary/stockbase";
import ReccuringEdit from "../app/sales/reccuring-notification/edit";
import PerfomaView from "../app/sales/sales-proforma/view";
import StaffScreen from "../app/staff";
import StaffForm from "../app/staff/components/form";
import StaffView from "../app/staff/components/view";
import StaffActivityList from "../app/staffActivities";
import StaffTransaction from "../app/staffTransaction";
import StaffTransactionView from "../app/staffTransaction/components/view";
import StripeLogScreen from "../app/stripe_log";
import UserManual from "../website/user-manual/userManual";
import { jwtDecode } from "jwt-decode";
import SubscriptionExpiry from "../components/SubscriptionExpiry";
import SupplierPaymentScreen from "../app/Payments/SupplierPayment";
import SupplierPaymentForm from "../app/Payments/SupplierPayment/form";
import OtherPaymentScreen from "../app/Payments/OtherPayment";
import OtherPaymentForm from "../app/Payments/OtherPayment/form";
import SupplierRefundScreen from "../app/Receipts/SupplierRefund";
import SupplierRefundForm from "../app/Receipts/SupplierRefund/form";
import CustomerRefundForm from "../app/Payments/CustomerRefund/form";
import CustomerRefundScreen from "../app/Payments/CustomerRefund";
import CustomerReceiptScreen from "../app/Receipts/CustomerReceipt";
import CustomerRecieptForm from "../app/Receipts/CustomerReceipt/form";
import OtherReceiptForm from "../app/Receipts/OtherReceipt/form";
import OtherReceiptScreen from "../app/Receipts/OtherReceipt";
import ContraScreen from "../app/Contra";
import ContraForm from "../app/Contra/components/form";
import PurchaseOrder from "../app/purchase/purchase-order";
import PurchaseOrderForm from "../app/purchase/purchase-order/components/form";
import PurchaseOrderView from "../app/purchase/purchase-order/components/view";
import StockTransferView from "../app/stockTransfer/components/view";
import StockTransferForm from "../app/stockTransfer/components/form";
import StockTransfer from "../app/stockTransfer";
import DayReport from "../app/report/DayReport/dayReport";
import DaySummary from "../app/report/DayReport";
import DayReportSummary from "../app/report/DayReport/summary";

import InvoiceCopy from "../app/sales/sales-invoice/copy";
import AccountLedger from "../app/report/AccountLedger/index";
import CompositionListScreen from "../app/productComposition/composition";
import CreateCompositionScreen from "../app/productComposition/composition/create";
import CompositionDetailsScreen from "../app/productComposition/composition/view";
import EditCompositionScreen from "../app/productComposition/composition/edit";
import ProductionListScreen from "../app/productComposition/production";
import CreateProductionScreen from "../app/productComposition/production/create";
import ProductionDetailsScreen from "../app/productComposition/production/view";
const { Sider } = Layout;
function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const direction = useSelector((state: any) => state.language.direction);

  useEffect(() => {
    function handleResize() {
      // If width is <= 768px, keep it collapsed
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      } else {
        // For wider screens, you can choose to expand it or leave it collapsed based on your design
        setCollapsed(false); // Change this to false if you want it expanded by default on desktop
      }
    }

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Initialize the correct state based on the current window size
    handleResize();

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const token = useSelector((state: any) => state?.User?.user?.token);
  const decoded: any = jwtDecode(token);
  let currentDate = new Date();
  let subscriptionEndDate = new Date(decoded?.subscriptionExpiry);

  return (
    <Layout className="Navigation-container" dir={direction}>
      <Sider
        width={260}
        collapsedWidth={70}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          zIndex: 1000,
          backgroundColor: "#fff",
          borderRight: "2px solid rgb(241, 241, 241)",
        }}
        collapsed={collapsed}
        className="Navigation-Sider"
      >
        <SiderBar collapsed={collapsed} />
      </Sider>
      <Layout
        className="Navigation-layout"
        style={{
          marginLeft: direction === "LTR" ? (collapsed ? 70 : 260) : 0,
          marginRight: direction === "RTL" ? (collapsed ? 70 : 260) : 0,
        }}
      >
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          notification={() => setShowNotification(!showNotification)}
          help={() => setShowHelp(!showHelp)}
        />
        <>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />;
            {/* credit notes */}
            <Route
              path="/salesCredit"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CreditNotes />
                )
              }
            />
            ;
            <Route
              path="/salesCredit/screditform/:id"
              element={<CreditNotesForm />}
            />
            <Route path="/salesCredit/edit/:id" element={<Edit />} />
            <Route path="/salesCredit/view/:id" element={<ViewCreditNote />} />
            <Route
              path="/sales-new-credit-notes"
              element={<SaleNewCreditNotes />}
            />
            ;
            <Route path="/InvoiceCopy/:id" element={<InvoiceCopy />} />
            ;
            <Route
              path="/sales-reccuring-notification"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <RecoveryNotification />
                )
              }
            />
            <Route
              path="/sales-reccuring-notification/edit/:id"
              element={<ReccuringEdit />}
            />
            <Route
              path="/purchase-debit-note"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaseDebitNote />
                )
              }
            />
            ;
            <Route path="/purchaseInvoice" element={<PurchaseInvoice />} />;
            <Route
              path="/purchase-fore-assets"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaseAsset />
                )
              }
            />
            ;
            <Route
              path="/purchase-fore-assets/view/:id"
              element={<PurchaseAssetViewPage />}
            />
            ;
            <Route
              path="/purchase-asset-form/:type/:id"
              element={<PurchaseAssetForm />}
            />
            ;
            <Route
              path="/productNonStock"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductNonStock />
                )
              }
            />
            ;
            <Route
              path="/productService"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductService />
                )
              }
            />
            ;
            <Route
              path="/productStock"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductStock />
                )
              }
            />
            ;
            <Route
              path="/purchaseFixedAsset"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaseFixedAsset />
                )
              }
            />
            ;
            <Route
              path="/productService"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductService />
                )
              }
            />
            ;
            <Route
              path="/productStock"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductStock />
                )
              }
            />
            ;{/* Stock Transfer */}
            <Route
              path="/stock-transfer/:id"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <StockTransferForm />
                )
              }
            />
            ;
            <Route
              path="/stock-transfer"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <StockTransfer />
                )
              }
            />
            ;
            <Route
              path="/stock-transfer/:id/details"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <StockTransferView />
                )
              }
            />
            ;
            <Route
              path="/purchaseFixedAsset"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaseFixedAsset />
                )
              }
            />
            ;
            <Route
              path="/create-product/:service/:type/:id"
              element={<ProductAdd />}
            />
            ;
            <Route path="/product-view/:type/:id" element={<ProductView />} />;
            <Route
              path="/contactSuppliers"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ContactSuppliers />
                )
              }
            />
            ;
            <Route
              path="/contactSuppliers/create"
              element={<CreateSupplier />}
            />
            ;
            <Route
              path="/contactSuppliers/details/:id"
              element={<SupplierDetails />}
            />
            ;
            <Route
              path="/contactSuppliers/edit/:id"
              element={<EditSupplier />}
            />
            ; ;
            <Route
              path="/contactCustomers"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ContactCustomers />
                )
              }
            />
            ;
            <Route
              path="/contactCustomers/create"
              element={<CreateCutomer />}
            />
            ;
            <Route
              path="/contactCustomers/details/:id"
              element={<CustomerDetails />}
            />
            ;
            <Route
              path="/contactCustomers/edit/:id"
              element={<EditCustomerDetails />}
            />
            ;
            <Route
              path="/journal"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Journal />
                )
              }
            />
            ;
            <Route path="/CreateJournal" element={<CreateJournal />} />;
            <Route path="/journal/details/:id" element={<JournalDetails />} />;
            <Route path="/journal/edit/:id" element={<EditJournal />} />;
            {/* payments & Receipts*/}
            <Route
              path="/payments/supplier-payment"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <SupplierPaymentScreen />
                )
              }
            />
            ;
            <Route
              path="/supplier-payment/:type/:id"
              element={<SupplierPaymentForm />}
            />
            <Route
              path="/payments/other-payment"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <OtherPaymentScreen />
                )
              }
            />
            ;
            <Route
              path="/other-payment/:type/:id"
              element={<OtherPaymentForm />}
            />
            <Route
              path="/payments/customer-refund"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CustomerRefundScreen />
                )
              }
            />
            ;
            <Route
              path="/customer-refund/:type/:id"
              element={<CustomerRefundForm />}
            />
            <Route
              path="/receipts/supplier-refund"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <SupplierRefundScreen />
                )
              }
            />
            ;
            <Route
              path="/supplier-refund/:type/:id"
              element={<SupplierRefundForm />}
            />
            <Route
              path="/receipts/customer-receipt"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CustomerReceiptScreen />
                )
              }
            />
            ;
            <Route
              path="/customer-receipt/:type/:id"
              element={<CustomerRecieptForm />}
            />
            <Route
              path="/receipts/other-receipt"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <OtherReceiptScreen />
                )
              }
            />
            ;
            <Route
              path="/other-receipt/:type/:id"
              element={<OtherReceiptForm />}
            />
            <Route
              path="/contra"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ContraScreen />
                )
              }
            />
            ;
            <Route path="/contra-form/:type/:id" element={<ContraForm />} />
            <Route
              path="/cash"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Cash />
                )
              }
            />
            ;
            <Route
              path="/cashBank"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CashBank />
                )
              }
            />
            ;
            <Route
              path="/cash"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Cash />
                )
              }
            />
            ;
            <Route
              path="/cashBank"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CashBank />
                )
              }
            />
            ;
            <Route path="/cashBank/:id/details/*">
              <Route index element={<Navigate to="transaction" replace />} />
              <Route path=":source" element={<BankDetails />} />
            </Route>
            <Route path="/cashBank/reconcile/:id" element={<ReconcilePage />} />
            ;
            <Route
              path="/cashBank/purchase-reciept/:id"
              element={<PurchasePaymentForm />}
            />
            <Route
              path="/cashBank/reconcile/:id/:status"
              element={<Reconcile />}
            />
            ;
            <Route
              path="/cashBank/bank-transfer/:id"
              element={<BankTransfer />}
            />
            <Route
              path="/cashBank/viewtransfer/:id"
              element={<ViewBankTransfer />}
            />
            ;
            <Route path="/report/sundryCreditors" element={<AgedCreditors />} />
            ;
            <Route path="/report/sundryDebtors" element={<AgedDebtors />} />;
            <Route path="/report/staff-analysis" element={<StaffReport />} />;
            <Route path="/report/account-ledger" element={<AccountLedger />} />;
            <Route path="/report/hsn_sac" element={<HsnCodeScreen />} />;
            <Route
              path="/report/hsn_sac/details/:hsn_code"
              element={<HsnCodeReport />}
            />
            ;
            <Route path="/cashBank/reconcile/:id" element={<ReconcilePage />} />
            ;
            <Route
              path="/cashBank/purchase-reciept/:id"
              element={<PurchasePaymentForm />}
            />
            ;
            <Route
              path="/cashBank/bank-transfer/:id"
              element={<BankTransfer />}
            />
            ;
            <Route
              path="/cashBank/viewtransfer/:id"
              element={<ViewBankTransfer />}
            />
            ;
            <Route path="/cashBank/reconcile/:id" element={<ReconcilePage />} />
            <Route
              path="/cashBank/:id/details/banktransfer/:type"
              element={<BankTransfer />}
            />
            ;
            <Route path="/cashBank/addbank/:id" element={<AddBankDetails />} />
            <Route
              path="/cashBank/:id/details/salesreciept/:tab"
              element={<BankSalesReciept />}
            />
            <Route
              path="/cashBank/:id/details/salesreciept/customer/:update"
              element={<CustomerReciept />}
            />
            <Route
              path="/cashBank/:id/details/salesreciept/other/:update"
              element={<OtherReciept />}
            />
            <Route
              path="/cashBank/:id/details/salesreciept/supplier-refund/:update"
              element={<SupplierRefund />}
            />
            <Route
              path="/cashBank/:id/details/purchasepayment/:tab"
              element={<BankPurchasePayment />}
            />
            <Route
              path="/cashBank/:purchaseType/:id/details"
              element={<ViewPurchasePaymentScreens />}
            />
            <Route
              path="/cashBank/:id/details/purchasepayment/supplier/:update"
              element={<SupplierPayment />}
            />
            <Route
              path="/cashBank/:id/details/purchasepayment/other/:update"
              element={<OtherPayment />}
            />
            <Route
              path="/cashBank/:id/details/purchasepayment/customer/:update"
              element={<CustomerRefund />}
            />
            <Route path="/cashBank/addbank/:id" element={<AddBankDetails />} />
            <Route
              path="/cashBank/viewtransfer/:id"
              element={<ViewBankTransfer />}
            />
            ;
            <Route path="/cash/cashTable/:id" element={<CashTable />} />
            <Route path="/cash/addCash/:id" element={<AddCashDetails />} />
            <Route path="/cash/salesreceipt/:id/*">
              <Route
                index
                element={<Navigate to="customer-receipt" replace />}
              />
              <Route path=":source" element={<CustumerReceiptForm />} />
            </Route>
            <Route path="/cash/purchacepayment/:id/*">
              <Route
                index
                element={<Navigate to="supplier-payment" replace />}
              />
            </Route>
            <Route path="/cash/view/:id/:type" element={<CashView />} />
            <Route path="/cash/salesreceipt/:id/:type/*">
              <Route
                index
                element={<Navigate to="customer-receipt" replace />}
              />
              <Route path=":source" element={<CustumerReceiptForm />} />
            </Route>
            <Route path="/cash/purchacepayment/:id/:type/*">
              <Route
                index
                element={<Navigate to="supplier-payment" replace />}
              />
              <Route path=":source" element={<PurchasePaymentForm />} />
            </Route>
            <Route
              path="/report"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Report />
                )
              }
            />
            ;
            <Route path="/report/vatReturns" element={<VatReturns />} />;
            <Route path="/report/dayReport/*">
              <Route index element={<Navigate to="detailed" replace />} />
              <Route path=":source" element={<DaySummary />} />
            </Route>
            <Route path="/report/BalanceSheet" element={<BalanceSheet />} />;
            <Route path="/report/TrialBalance" element={<TrialBalance />} />;
            <Route
              path="/report/vatReturnView/:id/:sdate/:edate"
              element={<VatReturnView />}
            />
            ;
            <Route
              path="/report/vatNominalView/:id/:ledger/:sdate/:edate/:product"
              element={<VatNominalView />}
            />
            ;
            <Route path="/report/profitloss" element={<ProfitnLoss />} />;
            <Route path="/report/stockSummary" element={<StockSummary />} />;
            <Route
              path="/report/stockSummary/stockmonth/:id"
              element={<StockMonth />}
            />
            ;
            <Route
              path="/report/stockSummary/stockbase/:adminId/:id/:month"
              element={<Stockbase />}
            />
            ;
            <Route
              path="/ledgerDefaultCategory"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <LedgerDefaultCategory />
                )
              }
            />
            <Route
              path="/payHead"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PayHead />
                )
              }
            />
            ;
            <Route path="/payHead/:id" element={<AddPayHeadLedger />} />;
            <Route
              path="/ledgerDefaultLedger"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <LedgerDefaultLedger />
                )
              }
            />
            ;
            <Route path="/ledger-view/:id" element={<ViewLedger />} />;
            <Route
              path="/ledgerMyCategory"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <LedgerMyCategory />
                )
              }
            />
            ;
            <Route
              path="/ledgerMyLedger"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <LedgerMyLedger />
                )
              }
            />
            ;
            <Route
              path="/payroll/employees"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Employees />
                )
              }
            />
            ;
            <Route
              path="/payroll/employees/viewPage/:id"
              element={<PayrollEmployeesViewPage />}
            />
            ;
            <Route path="/payroll/form/:source/:id" element={<PayRollForm />} />
            <Route
              path="/payroll/paysheet-view/:id"
              element={<PaySheetView />}
            />
            <Route
              path="/payroll/paysheet"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PaySheet />
                )
              }
            />
            ;
            <Route path="/merchant" element={<Merchant />} />;
            <Route path="/settings/*">
              <Route
                index
                element={
                  subscriptionEndDate < currentDate ? (
                    <SubscriptionExpiry />
                  ) : (
                    <Navigate to="customize" replace />
                  )
                }
              />
              <Route path=":source" element={<Settings />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />;
            {/* <Route path="/profile">
              <Route index element={<Navigate to="general" replace />} />
              <Route path=":source" element={<Profile />} />
            </Route> */}
            <Route path="/company-profile">
              <Route index element={<Navigate to="business" replace />} />
              <Route path=":source" element={<CompanyProfile />} />
            </Route>
            {/*/ SALES INVOICE /*/}
            <Route
              path="/sales-invoice"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <SalesInvoice />
                )
              }
            />
            <Route path="sale-invoice-form/:id" element={<SaleInvoiceForm />} />
            <Route path="sale-invoice-view/:id" element={<SaleInvoiceView />} />
            {/*/ END SALES INVOICE /*/}
            {/* Proforma Invoice  */}
            <Route
              path="proforma-invoice-form/:type/:id"
              element={<ProformaInvoiceForm />}
            />
            <Route
              path="/sales-proforma-invoice"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <SaleInvoiceProforma />
                )
              }
            />
            {/*/ PURCHACE INVOICE /*/}
            <Route
              path="/purchace-invoice"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaceInvoice />
                )
              }
            />
            <Route
              path="purchace-invoice-form/:type/:id"
              element={<PurchaceInvoiceForm />}
            />
            <Route
              path="purchase-invoice-view/:id"
              element={<PurchaceInvoiceView />}
            />
            <Route
              path="purchace-debitnote-form/:id"
              element={<PurchaceDebitnotesForm />}
            />
            <Route
              path="purchace-debitnote-view/:id"
              element={<DebitNotInvoiceView />}
            />
            {/* Purchase order */}
            <Route
              path="/purchase-order"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <PurchaseOrder />
                )
              }
            />
            <Route
              path="purchase-order-form/:type/:id"
              element={<PurchaseOrderForm />}
            />
            <Route
              path="purchase-order-view/:id"
              element={<PurchaseOrderView />}
            />
            {/* ------ */}
            <Route path="sale-invoice-view/:id" element={<SaleInvoiceView />} />
            <Route path="perfoma-invoice-view/:id" element={<PerfomaView />} />
            {/*/ Proposal /*/}
            <Route
              path="proposal"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <Proposal />
                )
              }
            />
            <Route path="proposal/create" element={<ProposalForm />} />
            <Route path="proposal/edit/:id" element={<EditProposal />} />
            <Route path="proposal/details/:id" element={<ProposalView />} />
            <Route path="proposal/create" element={<ProposalForm />} />
            <Route path="user-manual" element={<UserManual />} />
            {/* Staffs */}
            <Route
              path="staffs"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <StaffScreen />
                )
              }
            />
            <Route path="staff/:type/:id" element={<StaffForm />} />
            <Route path="staff/details/:id" element={<StaffView />} />
            <Route path="/staff-transactions" element={<StaffTransaction />} />;
            <Route
              path="/staff-transaction/details/:id"
              element={<StaffTransactionView />}
            />
            ;
            <Route path="/staff-activities" element={<StaffActivityList />} />;
            {/* counter */}
            <Route
              path="/counter"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CounterScreen />
                )
              }
            />
            ;
            <Route path="/counter/details/:id" element={<CounterView />} />;
            {/* Stripe Log */}
            <Route
              path="/stripe-log"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <StripeLogScreen />
                )
              }
            />
            ;{/* product Composition */}
            <Route
              path="/productComposition"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <CompositionListScreen />
                )
              }
            />
            <Route
              path="/create-composition"
              element={<CreateCompositionScreen />}
            />
            <Route
              path="/composition-details/:id"
              element={<CompositionDetailsScreen />}
            />
            <Route
              path="/edit-composition/:id"
              element={<EditCompositionScreen />}
            />
            ;{/* BOM production */}
            <Route
              path="/bomProduction"
              element={
                subscriptionEndDate < currentDate ? (
                  <SubscriptionExpiry />
                ) : (
                  <ProductionListScreen />
                )
              }
            />
            <Route
              path="/create-production"
              element={<CreateProductionScreen />}
            />
            <Route
              path="/production-details/:id"
              element={<ProductionDetailsScreen />}
            />
          </Routes>
        </>
      </Layout>
      {showNotification ? (
        <Drawer
          title="NOTIFICATIONS"
          placement={"right"}
          width={400}
          onClose={() => setShowNotification(false)}
          open={showNotification}
          zIndex={700}
          mask={false}
        >
          <NotificatonBox />
        </Drawer>
      ) : null}
      {showHelp ? (
        <Drawer
          title="HELP & SUPPORT"
          placement={"right"}
          width={400}
          onClose={() => setShowHelp(false)}
          open={showHelp}
          zIndex={700}
          mask={false}
        >
          <HelpBox closeDrawer={() => setShowHelp(false)} />
        </Drawer>
      ) : null}
    </Layout>
  );
}

export default Navigation;
