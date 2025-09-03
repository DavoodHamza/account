import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import DashBoard from "../dashBoard";
import Affiliations from "../affiliations";
import AddNews from "../addNews";
import Enquiry from "../enquiry";
import RetailXpressUsers from "../UserList/retailXpress";
import LayoutHeader from "./layoutHeader";
import TaxgoUsers from "../UserList/taxgo";
import AdminSideBar from "./adminSideBar";
import ViewAffiliation from "../affiliations/component/view";
import LoyaltyCard from "../loyaltyCard";
import Subscriptions from "../subscriptions";

const AdminDashBoard = () => {
  const { Sider, Content } = Layout;
  return (
    <>
      <Layout>
        <Sider
          style={{
            backgroundColor: "#fff",
            borderRight: "1px solid #dedede",
            height: "100vh",
          }}
          width={250}
        >
          <AdminSideBar />
        </Sider>
        <Layout>
          <LayoutHeader />
          <Content
            style={{
              background: "#f5f5f5",
              height: "70vh",
              overflow: "scroll",
            }}
          >
            <Routes>
              <Route path="/dashboard" index element={<DashBoard />} />
              <Route path="/news" element={<AddNews />} />
              <Route path="/enquiry" element={<Enquiry />} />
              <Route path="/affiliations" element={<Affiliations />} />
              <Route path="/affiliations/:id" element={<ViewAffiliation />} />
              <Route path="/loyaltyCard" element={<LoyaltyCard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/users/taxgo" element={<TaxgoUsers />} />
              <Route
                path="/users/retail_xpress"
                element={<RetailXpressUsers />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AdminDashBoard;
