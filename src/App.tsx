import { ConfigProvider, message } from "antd";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./utils/protectedRoute";

//screens
import { useCallback, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DigitalInvoice from "./app/invoice";
import i18n from "./i18n";
import Navigation from "./navigation";
import RetailExpress from "./retailExpress";
import Accounting from "./website/accounting";
import HelpLink from "./website/help";
import Blog from "./website/blog";
import ChatBot from "./website/chatbot";
import OnBoardingScreen from "./website/chatbot/components/onBoardingScreen";
import Otpverification from "./website/chatbot/components/otpverification";
import Consulting from "./website/consulting";
import Contact from "./website/contact";
import Forgott from "./website/forgott";
import ResetPassword from "./website/forgott/resetPassword";
import Home from "./website/home";
import Login from "./website/login";
import UpdateEmail from "./website/login/emailUpdate";
import Payroll from "./website/payroll";
import Plans from "./website/plans";
import Privacy from "./website/privacy";
import Retail from "./website/retail";
import Services from "./website/services";
import Signup from "./website/signup";
import Support from "./website/support/index";
import TaxForm from "./website/taxCalculator/TaxForm";
import Terms from "./website/terms";
import UserManual from "./website/user-manual/userManual";
import SubscriptionPage from "./app/subscription";
import BlogDetailPage from "./website/blog/components/detailPage";
import AboutUs from "./website/aboutus";
// import AddNews from "./website/addNews";
import CompanyForm from "./app/companyList/components/form";
import CompanyList from "./app/companyList";
import PaymentSuccess from "./app/StripePayment/components/paymentSuccess";
import PaymentError from "./app/StripePayment/components/paymentError";
import MainProfilePage from "./app/profile/mainProfile";
import SalesPersonLogin from "./affiliate/salesPersonView/salesLogin";
import SalesPersonView from "./affiliate/salesPersonView";
import AdminDashBoard from "./admin/adminNavigation";
import AffiliationForm from "./admin/affiliations/component/form";
import PaystackSuccess from "./app/subscription/PaystackSuccsess";
import Restaurant from "./website/Use Case/Restaurant";
import Retails from "./website/Use Case/Retail";
import Finance from "./website/Use Case/Finance";
import Logistics from "./website/Use Case/Logistics";
import Instructor from "./website/Use Case/Instructor";
import Healthcare from "./website/Use Case/HealthCare";
import Photographers from "./website/Use Case/Photographers";
import Business from "./website/Use Case/Business";
import AddNews from "./admin/addNews";
import OurProducts from "./app/our_Products/page";

function App(props: any) {
  const navigate = useNavigate();
  const handleKeyPress = useCallback((e: any) => {
    if (e.key === "s" && e.altKey) {
      navigate("/usr/sale-invoice-form/0");
    } else if (e.key?.toUpperCase() === "w"?.toUpperCase() && e.altKey) {
      navigate("/usr/create-product/Nonstock/create/0");
    } else if (e.key?.toUpperCase() === "m"?.toUpperCase() && e.altKey) {
      navigate("/usr/create-product/Service/create/0");
    } else if (e.key?.toUpperCase() === "r"?.toUpperCase() && e.altKey) {
      navigate("/usr/proforma-invoice-form/create");
    } else if (e.key?.toUpperCase() === "t"?.toUpperCase() && e.altKey) {
      navigate("/usr/purchace-invoice-form/create/0");
    } else if (e.key?.toUpperCase() === "y"?.toUpperCase() && e.altKey) {
      navigate("/usr/purchace-debitnote-form/create");
    } else if (e.key?.toUpperCase() === "u"?.toUpperCase() && e.altKey) {
      navigate("/usr/purchase-asset-form/Create/0");
    } else if (e.key?.toUpperCase() === "i"?.toUpperCase() && e.altKey) {
      navigate("/usr/contactCustomers/create");
    } else if (e.key?.toUpperCase() === "o"?.toUpperCase() && e.altKey) {
      navigate("/usr/contactSuppliers/create");
    } else if (e.key?.toUpperCase() === "p"?.toUpperCase() && e.altKey) {
      navigate("/usr/CreateJournal");
    } else if (e.key?.toUpperCase() === "a"?.toUpperCase() && e.altKey) {
      navigate("/usr/cashBank");
    } else if (
      e.key?.toUpperCase() === "s"?.toUpperCase() &&
      (e.altKey || e.metaKey)
    ) {
      navigate("/usr/ledgerMyCategory");
    } else if (e.key?.toUpperCase() === "d"?.toUpperCase() && e.altKey) {
      navigate("/usr/ledgerMyLedger");
    } else if (e.key?.toUpperCase() === "g"?.toUpperCase() && e.altKey) {
      navigate("/usr/purchaseFixedAsset");
    } else if (e.key?.toUpperCase() === "h"?.toUpperCase() && e.altKey) {
      navigate("/usr/cash");
    } else if (e.key?.toUpperCase() === "j"?.toUpperCase() && e.altKey) {
      navigate("/usr/ledgerMyCategory");
    } else if (e.key?.toUpperCase() === "k"?.toUpperCase() && e.altKey) {
      navigate("/usr/ledgerMyLedger");
    } else if (e.key?.toUpperCase() === "l"?.toUpperCase() && e.altKey) {
      navigate("/usr/salesCredit/screditform/0");
    } else if (e.key?.toUpperCase() === "v"?.toUpperCase() && e.altKey) {
      navigate("/usr/proposal/create");
    } else if (e.key?.toUpperCase() === "q"?.toUpperCase() && e.altKey) {
      navigate("/usr/report/account-ledger");
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
   
  const direction: any = localStorage.getItem("direction");
  const User = useSelector((state: any) => state.User);
  message.config({ top: 100 });
  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#18a762",
            fontFamily: "Poppins-Regular",
            borderRadius: 4,
            colorTextPlaceholder: "#888c99",
          },
        }}
      >
        <div dir={direction}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />;
            <Route path="/our_Products" element={<OurProducts />} />;
            <Route path="/login" element={<Login />} />;
            <Route path="/signup" element={<Signup />} />;
            <Route path="/getstart/:code" element={<Signup />} />;
            <Route path="/getstart" element={<ChatBot />} />;
            <Route path="/getstart/:code" element={<Signup />} />;
            <Route path="/forgot" element={<Forgott />} />;
            <Route path="/contact" element={<Contact />} />;
            <Route path="/services" element={<Services />} />;
            <Route path="/news" element={<Blog />} />;
            <Route path="/plans" element={<Plans />} />;
            <Route path="/aboutus" element={<AboutUs />} />;
            <Route path="/support" element={<Support />} />
            <Route path="/taxCalculator" element={<TaxForm />} />;
            <Route path="/accounting" element={<Accounting />} />;
            <Route path="/retail" element={<Retail />} />;
            <Route path="/consulting" element={<Consulting />} />;
            <Route path="/payroll" element={<Payroll />} />;
            <Route path="/terms" element={<Terms />} />;
            <Route path="/privacy" element={<Privacy />} />;
            <Route path="/help-tutorial" element={<HelpLink />} />;
            <Route path="/usermanual/:type" element={<UserManual />} />;
            <Route path="/invoice/:type/:id" element={<DigitalInvoice />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />;
            <Route path="/questionScreen" element={<OnBoardingScreen />} />;
            <Route path="/payment-success" element={<PaymentSuccess />} />;
            <Route path="/paystack" element={<PaystackSuccess />} />;
            <Route path="/payment-failed" element={<PaymentError />} />;
            <Route path="/blog-details/:id" element={<BlogDetailPage />} />;
            <Route path="/Restaurant" element={<Restaurant />} />;
            <Route path="/Retails" element={<Retails />} />;
            <Route path="/Finances" element={<Finance />} />;
            <Route path="/Logistics" element={<Logistics />} />;
            <Route path="/Instuct" element={<Instructor />} />;
            <Route path="/Health" element={<Healthcare />} />;
            <Route path="/Photographer" element={<Photographers />} />;
            <Route path="/Business" element={<Business />} />;

            <Route path="/admin/news" element={<AddNews />} />;
            <Route path="/affiliate-login" element={<SalesPersonLogin />} />;
            <Route path="/affiliate/:type/:id" element={<AffiliationForm />} />;
            <Route
              path="/affiliate-details"
              element={
                <ProtectedRoute isSignedIn={User.isSalesPerson}>
                  <SalesPersonView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute isSignedIn={User.admin}>
                  <AdminDashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot/otpverification"
              element={<Otpverification />}
            />
            ;
            <Route
              path="/updateEmail/:verifyData"
              element={<UpdateEmail type="update" />}
            />
            <Route
              path="/verifyemail/:verifyData"
              element={<UpdateEmail type="verify" />}
            />
            ;
            <Route
              path="/usr/*"
              element={
                <ProtectedRoute isSignedIn={User.auth}>
                  <Navigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company"
              element={
                <ProtectedRoute isSignedIn={User.auth}>
                  <CompanyList />
                </ProtectedRoute>
              }
            />
            ;
            <Route path="/user-profile">
              <Route index element={<Navigate to="general" replace />} />
              <Route
                path=":source"
                element={
                  <ProtectedRoute isSignedIn={User.auth}>
                    <MainProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/subscription"
              element={
                <ProtectedRoute isSignedIn={User.auth}>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
            ;
            <Route
              path="/company/:type/:id"
              element={
                <ProtectedRoute isSignedIn={User.auth}>
                  <CompanyForm />
                </ProtectedRoute>
              }
            />
            ;
            <Route
              path="/retail-express"
              element={
                <ProtectedRoute isSignedIn={User.auth}>
                  <RetailExpress />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Routes>
        </div>
      </ConfigProvider>
    </I18nextProvider>
  );
}

export default App;
