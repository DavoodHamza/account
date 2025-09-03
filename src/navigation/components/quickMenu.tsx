import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAccessControl } from "../../utils/accessControl";

function QuickMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user }: any = useSelector((state: any) => state.User);
  const { canCreateProducts, canCreateSales, canCreatePurchases, canCreateContacts } = useAccessControl();

  // Map each quick menu item to the corresponding SiderBar ID
  const quickMenuPermissions = [
    { id: 2, route: "/usr/create-product/Stock/create/0" }, // Product & Service
    { id: 2, route: "/usr/create-product/Nonstock/create/0" },
    { id: 2, route: "/usr/create-product/Service/create/0" },
    { id: 4, route: "/usr/sale-invoice-form/0" }, // Sale
    { id: 4, route: "/usr/proforma-invoice-form/create/0" },
    { id: 4, route: "/usr/salesCredit/screditform/0" },
    { id: 5, route: "/usr/purchace-invoice-form/create/0" }, // Purchase
    { id: 5, route: "/usr/purchace-debitnote-form/create" },
    { id: 5, route: "/usr/purchase-asset-form/Create/0" },
    { id: 6, route: "/usr/contactCustomers/create" }, // Contact
    { id: 6, route: "/usr/contactSuppliers/create" },
    { id: 7, route: "/usr/CreateJournal" }, // Journal
    { id: 11, route: "/usr/cashBank/addbank/create" }, // Bank
    { id: 14, route: "/usr/ledgerMyCategory" }, // Ledger
    { id: 14, route: "/usr/ledgerMyLedger" },
  ];

  // Helper to check if a route should be shown for staff
  const hasAccess = (route: string) => {
    if (!user.isStaff) return true;
    let access = user?.staff?.access?.split("|") || [];
    const found = quickMenuPermissions.find((item) => item.route === route);
    if (!found) return true; // If not mapped, show by default
    return access.includes(found.id + "");
  };

  return (
    <div style={{ width: 450 }}>
      <div className="heading-txt2">{t("home_page.homepage.Quick_Access")}</div>
      <hr />
      <Container fluid>
        <Row>
          <Col
            sm={6}
            xs={12}
            style={{
              margin: 0,
              padding: 0,
              borderRight: "1px solid lightgray",
            }}
          >
            {canCreateProducts() && (
              <div
                onClick={() => navigate("/usr/create-product/Stock/create/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_Stock")} {" "}
              </div>
            )}
            {canCreateProducts() && (
              <div
                onClick={() => navigate("/usr/create-product/Nonstock/create/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_non_stock")} {" "}
              </div>
            )}
            {canCreateProducts() && (
              <div
                onClick={() => navigate("/usr/create-product/Service/create/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_service")} {" "}
              </div>
            )}
            {canCreateSales() && (
              <div
                onClick={() => navigate("/usr/sale-invoice-form/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.create_sales_invoice")} {" "}
              </div>
            )}
            {canCreateSales() && (
              <div
                onClick={() => navigate("/usr/proforma-invoice-form/create/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.create_proforma_invoice")} {" "}
              </div>
            )}
            {canCreateSales() && (
              <div className="QuickMenu-item"
                onClick={() => navigate('/usr/salesCredit/screditform/0')}
              >{t("home_page.homepage.Add_credit_note")} </div>
            )}
            {canCreatePurchases() && (
              <div className="QuickMenu-item"
                onClick={() => navigate('/usr/purchace-invoice-form/create/0')}
              >
                {t("home_page.homepage.Add_cost_of_good_sold")} {" "}
              </div>
            )}
            {canCreatePurchases() && (
              <div
                onClick={() => navigate("/usr/purchace-debitnote-form/create")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_Debit_note")}
              </div>
            )}
          </Col>
          <Col sm={6} xs={12}>
            {canCreatePurchases() && (
              <div
                onClick={() => navigate("/usr/purchase-asset-form/Create/0")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_purchase_for_asset")} {" "}
              </div>
            )}
            {canCreateContacts() && (
              <div
                onClick={() => navigate("/usr/contactCustomers/create")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_customers")}
              </div>
            )}
            {canCreateContacts() && (
              <div
                onClick={() => navigate("/usr/contactSuppliers/create")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_suppliers")}
              </div>
            )}
            {hasAccess("/usr/CreateJournal") && (
              <div
                onClick={() => navigate("/usr/CreateJournal")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_journal")}
              </div>
            )}
            {hasAccess("/usr/cashBank/addbank/create") && (
              <div
                onClick={() => navigate("/usr/cashBank/addbank/create")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_bank")}
              </div>
            )}
            {hasAccess("/usr/ledgerMyCategory") && (
              <div
                onClick={() => navigate("/usr/ledgerMyCategory")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_My_category")}
              </div>
            )}
            {hasAccess("/usr/ledgerMyLedger") && (
              <div
                onClick={() => navigate("/usr/ledgerMyLedger")}
                className="QuickMenu-item"
              >
                {t("home_page.homepage.Add_my_ledger")}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default QuickMenu;
