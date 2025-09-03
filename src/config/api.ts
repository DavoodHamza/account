const API = {
  // BASE_URL: "http://localhost:8082/taxgov2/", // MASTER LOCAL
  //  MASTER_BASE_URL: "http://localhost:8083/taxgov2/", // DEV LOCAL\
  // WEBURL: "http://localhost:3000/",
  WEBURL: "https://www.taxgoglobal.com/",
  MASTER_BASE_URL: "https://master-server.taxgoglobal.com/taxgov2/",
  BASE_URL: "https://taxgov2-server.taxgoglobal.com/taxgov2/", // MASTER
  // BASE_URL: "https://taxgov2-dev-server.taxgoglobal.com/taxgov2/", // DEV
  // BASE_URL: "http://localhost:8085/taxgov2/", // DEV LOCAL

  TAXGO_V0: "https://main.dd5bgcyjfqt12.amplifyapp.com/login",
  TAXGO_V1: "https://master.dd5bgcyjfqt12.amplifyapp.com/login",

  SAMPLE_PRODCUT_EXCEL: "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/taxgo/sample-product-list.xlsx",

  RESETPASSWORD: "auth/reset-password",
  FORGOTPASSWORD: "auth/forgot-password",
  // FILE_PATH: "https://taxgo-v2.s3.eu-west-1.amazonaws.com/",
  FILE_PATH: "https://bairuha-bucket.s3.ap-south-1.amazonaws.com/",
  LOGIN: "user/login",
  ALL_COUNTRIES: "countries/all", //GET
  BUSINESS_CATEGORY: "business_category", //GET
  PUBLIC_REGISTER: "user/publicregister", //POST
  LOGIN_GMAIL: "auth/google_login",
  LOGIN_EMAIL: "auth/email-login",
  LOGIN_PHONE: "auth/Phone-login",
  LOGIN_REGISTRATION: "auth/register",
  PAYMENT_CREATE: "payment/stripe",
  PAYMENT_RETRIEVE: "payment/retrievePayment",
  USER_SUBSCRIPTION_LIST: "stripe_log/user-log",

  //company
  GET_ALL_COMPANIES: "company_master/list/",
  CREATE_COMPANY: "company_master/createCompany",
  CREATE_SUBSCRIBED_COMPANY: "company_master/createNew",

  //Dashboard
  CUSTOM_DATA: "dashboard/customData",
  GRAPH_DATA: "dashboard/graphData", //POST
  PROFORMA_INVOICE_LIST: "SaleInvoice/list/", //GET
  SALES_LIST: "SaleInvoice/lists/", //GET
  CUSTOMER_LIST: "contactMaster/searchList/customer/", //GET
  ADD_CUSTOMER: "customer/add",
  CUSTOMER: "customer/",
  CONTACT_MASTER: "contactMaster/",
  CONTACT_MASTER_LIST: "contactMaster/list/",
  CONTACTS_LIST_TYPE: "contactMaster/lists/",
  SUPPLIER: "contactMaster/",
  SEND_VERIFY_EMAIL: "auth/send_verify_mail",

  // Business category
  CREATE_BUSINESS_CATEGORY: "business_category",

  // profile --------------------
  UPDATE_PASSWORD: "user/updatePassword",
  UPDATE_PROFILE_PICTURE: "user/updateProfilePicture",
  GET_PROFILE_DETAILS: "user/viewProfile/",
  UPDATE_PHONENUMBER: "auth/updatePhonenumber/",
  UPDATE_EMAIL: "auth/send-update-email/",
  VERIFY_EMAIL: "auth/verifyEmail/",
  USER_SUBSCRIBED_PLAN: "subscriptions/getUserPlan",

  // profile --------------------
  GET_USER_DETAILS: "user/viewProfile",
  UPDATE_PICTURE: "user/updateProfilePicture/",
  UPDATE_LOGO: "user/updateLogoPicture/",
  CUSTOMISE_DATA: "user_settings/invoiceNoConfig/",
  UPADATE_TEMPLATE: "user/updateInvoiceTemplate/",
  UPDATE_PROFILE: "user/updateProfile/",
  UPDATE_PROFILE_INFO: "user/updateUserInfo",
  CLEAR_USER_DATA: "user/clear-data/",
  USER_SETTING_GETINVOICENO: "user_settings/getInvoiceNo/",

  // profile ---------------------
  LOCATION_GET: "location",
  LOCATION_DELETE: "location/delete/",
  LOCATION_GETBY_ID: "location/byId/",
  LOCATION_POST: "location/add",
  LOCATION_PUT: "location/update/",
  LOCATION_GET_BY_USER: "location/list/",
  LOCATION_GET_BY_COMPANY: "location/list-by-company/", // get list of the location for a company with pagination
  DELETE_BANK_TRANSACTION: "ledger_details/delateTransaction/",
  HSN_CODE_LIST: "hsn_code/list/",
  CREATE_TAX_MASTER: "tax_master/add",
  TAX_MASTER: "tax_master/",

  // purchase table--------------------->
  PURCHASE_INVOICE_LIST: "purchaseinvoice/list/",
  PURCHASE_SUPPLIER_LIST: "purchaseinvoice/viewInvoice/",
  PURCHASE_INVOICE_ADD: "purchaseinvoice/add",
  PURCHASE_INVOICE_UPDATE: "purchaseinvoice/update/",
  PURCHASE_PRODUCT_LIST: "ProductMaster/user/Stocks/",
  PURCHASE_TAXGO_SUPPLIER_LIST: "contactMaster/allList/supplier/",
  PURCHASE_DEFUALT_LEDGER_LIST: "account_master/defualt-ledger/purchase/",
  PURCHASE_ID_BY_LIST: "purchaseinvoice/listSupplierPay/",
  GET_PURCHASE_ID_BY_LIST: "purchaseinvoice/addSupOtherPaymentCash",
  GET_FIXED_ASSET_LEDJERS: "account_master/fixed-assets/",
  PURCHASE_SUPPKIER_LIST: "supplier/list/",
  PURCHASE_INVOICELIST_BY_DATE: "Purchaseinvoice/listByDateFilter/",
  PURCHASE_PAYMENT: "purchaseinvoice/supplierpayment",
  VIEW_PURCHASE_INVOICE: "purchaseinvoice/viewInvoice/",

  //Product Master
  PRODUCT_MASTER_USER: "ProductMaster/user/list/",
  ADD_PRODUCT: "ProductMaster/add",
  ADD_PRODUCT_VIA_EXCEL: "ProductMaster/addFromExcel",
  GET_PRODUCT_CATEGORY: "ProductCategory/category/",
  GET_PRODUCT_MASTER_BY_ID: "ProductMaster/getProductById/",
  GET_PRODUCT_UPDATE: "ProductMaster/update/",
  PRODUCT_STOCK_UPDATE: "ProductMaster/adjustStockLevel/",
  PRODUCT_UNIT_BY_USER: "unit/user/",
  DELETE_PRODUCT: "ProductMaster/delete/",
  CHECK_IF_EXIST: "ProductMaster/checkifExist/",
  PRODUCTMASTER_IMAGE_UPLOADER: "ProductMaster/updateProductImage",
  GET_AACCOUNT_BYID: "ProductMaster/saccount/",
  GET_PRODUCT_TYPELIST: "ProductMaster/user/list/type/",
  GET_PRODUCT_TYPE: "ProductMaster/user/type/",
  GET_PRODUCT_BY_HSN: "ProductMaster/getProductHsnCode/",

  //credit note
  ALL_CREDIT_NOTES: "CreditNote/all/",
  CREDIT_INVOICE_LIST: "SaleInvoice/list/", //GET
  CREATE_CREDIT_NOTE: "SaleInvoice/add",
  CREATE_CREDIT_NOTE_NEW: "SaleInvoice/addCreditNew",

  //suppliers-list
  SUPPLIERS_LIST: "contactMaster/list/supplier/",
  SUPPLIERS_LIST_ID: "contactMaster/",
  VAT_EXISTS: "contactMaster/checkifVatNumberExist/",

  SUPPLIERS_SEARCH_LIST: "contactMaster/searchList/supplier/",
  SUPPLIER_PAY_LIST: "purchaseinvoice/supplierPayidList/",
  PURCHASE_ALL_PAY_LISTS: "purchaseinvoice/listAllSupplierPay/",
  GET_ALL_LISTS_CONTACTMASTER: "contactMaster/allList/",
  DELETE_CONTACT: "contactMaster/delete/",
  SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST: "contactMaster/search/custnSup/",

  //unit
  UNIT_LIST_USER: "unit/list/",
  UNIT_CREATE: "unit/add",
  UNIT_UPDATE: "unit/update/",
  UNIT_DELETE: "unit/delete/",
  UNIT_GETBY_ID: "unit/byId/",

  PRODUCTCATEGORY_LIST_USER: "ProductCategory/user/",
  PRODUCTCATEGORY_CREATE: "ProductCategory/add",
  PRODUCTCATEGORY_UPDATE: "ProductCategory/update/",
  PRODUCTCATEGORY_DELETE: "ProductCategory/delete/",
  PRODUCTCATEGORY_GETBY_ID: "ProductCategory/byId/",
  //EmployeeCategory

  EMPLOYEECATEGORY_LIST_USER: "employeeCategory/user/",
  EMPLOYEECATEGORY_GET_BYID: "employeeCategory/byId/",
  EMPLOYEECATEGORY_CREATE: "employeeCategory/add",
  EMPLOYEECATEGORY_UPDATE: "employeeCategory/update/",
  EMPLOYEECAREGORY_DELETE: "employeeCategory/delete/",

  //payrollPayHead
  PAYROLLPAYHEAD_LIST_USER: "account_master/getPayHead/",
  PAYROLLPAYHEAD_CREATE: "payrollPayHead/add",
  PAYROLLPAYHEAD_UPDATE: "payrollPayHead/update/",
  PAYROLLPAYMENT_DELETE: "payrollPayHead/delete/",
  PAYROLLPAYMENT_GET_BYID: "payrollPayHead/byId/",

  //payrollPayHead
  EMPLOYEES_LIST: "employees/user/",
  EMPLOYEES_LIST_USER: "employees/byCompany/",
  EMPLOYEES_CREATE: "employees/add",
  EMPLOYEES_UPDATE: "employees/update/",

  //payrollPayHead
  GET_PAYSHEET: "paySheet/",
  PAYSHEET_LIST_USER: "paySheet/user/",
  PAYSHEET_CREATE: "paySheet/add",
  PAYSHEET_UPDATE: "paySheet/update/",
  PAYSHEET_PAYMENT: "paySheet/sendPayment/",
  UPDATE_PAYSHEET: "paySheet/update/",

  // employee
  DELETE_EMPLOYEE: "employees/delete/",

  //Journallist
  JOURNAL: "Journal/",
  JOURNAL_LIST: "Journal/list/",
  ADD_JOURNAL: "Journal/add",
  GET_ALL_ENTRIES: "contactMaster/all/list/",
  DELETE_JOURNAL: "Journal/delete/",

  //Bank
  ADD_BANK: "account_master/addBank",
  GET_BANK_LIST: "account_master/getBankList/",
  GET_ACCOUNT_MASTER_LIST: "account_master/list",
  GET_BANK_DETAILS: "bank/bankDetails/",
  UPDATE_BANK: "account_master/updateBank",
  UPDATE_BANK_DETAILS: "ledger_details/updateCashDeatails/",
  LIST_BANK_ACTIVITY: "bank/listBankActivity/",
  LIST_BANK_ACTIVITY_NEW: "bank/listBankActivityNew/",
  BANK_TRANSFER: "bank/bankTransfer",
  GET_BANK_TRANSACTION_DETAILS: "bank/getBankingTransactionDetail/",
  VIEW_TRANSFER: "bank/viewtransfer/",
  UPDATE_RECONCILE: "ledger_details/update/",
  LIST_LEDGER: "account_master/list",
  GET_MY_LEDGERS: "account_master/getMyLedgers/",
  EXPENSE_LEDGER_LIST: "account_master/expenseLedgers/",
  GET_LEDGER_CATEGORY: "ledgercategory/",
  GET_LEDGER_CAT: "searchList/:type/:id",
  GET_CATEGORY_LIST: "ledgercategory/all",
  GET_CATEGORY_GROUP_LIST: "ledgercategorygroup/all",
  LEDGER_CREATE: "account_master/add",
  CREATE_LEDGER_CATEGORY: "Ledgercategory",
  UPDATE_LEDGER_CATEGORY: "Ledgercategory/",
  UPDATE_LEDGER: "account_master/update/",
  CHANGE_LEDGER_VISIBILITY: "account_master/update-visibility",
  GET_ALL_LEDGERS: "account_master/list-page-by",
  LEDGER_DEATAILS: "ledger_details/",
  LEDGER_DEATAILS_UPDATE: "ledger_details/update_ledger/",
  LEDGER_ACCOUNT_DETAILS: "account_master/defualt-ledger/journals/",
  CREATE_SUPPLIER_REFUND: "purchaseinvoice/addSuppRefundCash",
  CREATE_PURCHASE_PAYMENT: "purchaseinvoice/addSuppReceiptCash",
  GET_CONTACT_MASTER_LIST: "contactMaster/getalldata/",
  S_DELETE_LEDGER: "ledger_details/delete/",
  GET_CREDIT_NOTE_SALESINVOICE: "SaleInvoice/getListByCustmer/",
  CUSTOMER_SUPPLIER_LIST: "contactMaster/allList/",
  GET_SCREDITLIST_SUPPLIER_REFUND: "SaleInvoice/scredit_invoice/", //GET
  CONTACT_MASTER_SEARCHLIST: "contactMaster/searchList/both/", //GET
  GET_PURCHASE_INVOICE: "purchaseinvoice/list/",
  UPDATE_SUPPLIER_REFUND: "purchaseinvoice/update/",
  // GET_SCREDITLIST_SUPPLIER_REFUND: "SaleInvoice/scredit_list/", //GET
  ///////////
  LEDGER_UPDATE: "ledger_details/update_ledger/",
  DELETE_PURCHASE_INVOICE: "purchaseinvoice/delete-invoice/",
  DELETE_SALES_INVOICE: "SaleInvoice/delete-invoice/",

  //LEDGER
  UPDATE_MY_LEDGER: "account_master/update/",
  GET_LEDGERBY_ID: "Ledgercategory/getLedgerCategoryById/",
  //LEDGERCATEGORY GROUP
  GET_LEDGERCATE_GROUP: "ledgercategorygroup/all",

  GET_ALL_LEDGER_DETAILS: "report/ledger-details/",
  GET_LEDGER_DETAILS: "account_master/getLedgerById/",

  //Tax
  TAXLIST: "tax_master/list/",

  //Report VatGst
  VAT_RETURN: "report/overallVatReport/",

  HSN_REPORT: "report/hsnReport/",

  //enquiry
  GET_ENURIES_LIST: "contactus",
  VAT_RETURN_NOMINAL: "report/getVatNominalList/",
  VAT_RETURN_VIEW: "report/getNominalVat/",

  //Report Profit/Loss
  PROFITLOSS: "report/profitLoss/",
  GET_SALES_LIST: "SaleInvoice/list/",

  //trial balance
  TRIAL_BALANCE: "report/trialbalance/",

  //Day Report
  DAY_REPORT: "report/dayReport",
  DAY_DETAIL_REPORT: "report/dayReport/totalsummary",
  DAY_REPORT_SUMMARY: "report/dayReportSummary",

  //stocksummary
  GET_PURCHASE_MONTH: "purchaseinvoice/month/",
  GET_SALEINVOICE_STOCK: "SaleInvoice/stock/",
  GET_SALESMONTH_DAILY: "purchaseinvoice/month/",
  GET_STOCK_DETAILS: "report/user/list/type/",
  GET_PRODUCT_DETAILS: "report/product/",
  INWARD_DATA: "report/inward/",
  OUTWARD_DATA: "report/outward/",

  //Cash
  GET_CASH_LIST: "account_master/getCashList/",
  GET_CASH_LIST_ACTIVITY_BY_ID: "bank/listBankActivity/",

  GET_CASH_LIST_PAGE: "bank/list/",
  //Sale
  GET_SALE_INVOICE_BY_ID: "SaleInvoice/listCustomerPay/",
  SALE_ALL_CUSTOMER_PAY: "SaleInvoice/listallCustomerPay/",
  UPDATE_SALES: "SaleInvoice/update/",
  SALES_PAYMENT: "SaleInvoice/customerPayment",

  // proforma
  GET_INVOICENO: "user_settings/getInvoiceNo/",
  VIEW_SALE_INVOICE: "SaleInvoice/viewInvoice/",
  GET_CUSTOMERS: "customer/list/",
  GET_PRODUCT_LIST: "ProductMaster/user/Stock/",
  Stripe_mail: "payment/send-invoice-email",

  //Receipt
  ADD_CUSTOMER_RECCEIPT: "SaleInvoice/addCustReceipt",
  ADD_OTHER_RECEIPT: "SaleInvoice/addOtherReceipt",
  ADD_SUPPLIRE_REFUND: "purchaseinvoice/addSuppRefund",
  GET_SALE_ID_BY_PAY_LIST: "SaleInvoice/customerPayidList/",
  // GET_CUS_REFUND_INVOICE_LIST: "SaleInvoice/customerPayidList/",
  EDIT_SUPPLIER_REFUND: "purchaseinvoice/update/",

  //Payment
  ADD_CUSTOMER_REFUND: "SaleInvoice/addCustRefundCash",
  ADD_SUPPLIRE_OTHER_PAYMENT: "purchaseinvoice/addSupOtherPayment/",
  ADD_SUPPLIRE_PAYMENT: "purchaseinvoice/addSuppPayment/",

  //reccuring notification
  GET_RECCURING_LIST: "reccuringnotification/list/",
  GET_RECCURING: "reccuringnotification/get/",
  EDIT_RECCURING: "reccuringnotification/update/",
  DELETE_RECCURING: "reccuringnotification/delete/",

  //Report Aged Creditors
  REPORT_CREDITORS: "report/agedcreditors2/",

  //Report Aged Creditors
  REPORT_DEBTORS: "report/agedebtors2/",

  SHARE_INVOICE: "share/invoice/",

  //tax calculator
  GET_COUNTRIES_DETAILS:
    "https://taxgocalculator-default-rtdb.firebaseio.com/taxCountry.json",
  GET_COUNTRY_FORM:
    "https://taxgocalculator-default-rtdb.firebaseio.com/taxForms/",

  // account master --------->
  GETBANK_LIST_BYID: "account_master/getBankListById/",

  //
  // PDF_GENERATE_URL: `https://pdf.taxgoglobal.com/getPdf`,
  PDF_GENERATE_URL: `https://pdfserver.bairuhatech.com/getPdf`,

  //proposals
  GET_PROPOSAL_LIST: "proposal/list/",
  CREATE_PROPOSAL: "proposal/add",
  DELETE_PROPOSAL: "proposal/delete/",
  GET_PROPOSAL: "proposal/",
  UPDATE_PROPOSAL: "proposal/update/",
  UPLOAD_PROPOSAL_LOGO: "proposal/uploadLogo",

  IMAGE_COMPRESS: "img_compress/compress",
  FILE_UPLOAD: "img_compress/file",

  //REPORT APIS
  BALANCESHEET: "report/balancesheet", //POST

  GET_CASH_DETAILS: "account_master/getLedgerById/",

  UPDATE_INVOICE_DETAILS: "user_settings/updateInvoiceConfig/",

  //RETAIL EXPRESS
  LIST_PRODUCTS: "retail/productlist/",

  //Payments
  GET_TRANSACTION: "bank/transactions",

  // END OF YEAR
  END_OF_YEAR: "account_master/setEndOfYear/",
  END_OF_YEAR_USER: "end-of-year/user-sync/",
  END_OF_YEAR_SETTINGS: "end-of-year/settings-sync/",
  END_OF_YEAR_ACCOUNTS: "end-of-year/accounts-sync/",
  END_OF_YEAR_PRODUCTS: "end-of-year/products-sync/",
  END_OF_YEAR_CONTACTS: "end-of-year/contact-sync/",
  END_OF_YEAR_BASEURL: "base/update/endofyear",
  //Staff
  ADD_STAFF: "contactMaster/staff/create",
  CREATE_DEFAULT_STAFF: "contactMaster/defaultStaff/create",
  STAFF_EMAIL_LOGIN: "auth/staff/email-login",
  STAFF_DASHBOARD_DATA: "dashboard/staffData/",
  GET_STAFF_REPORT: "report/staffAnalysis/",

  //blog
  BLOG: "blog",
  TEST_BLOG: "blog/lists",
  DELETE_BLOG: "blog/",

  // subscribe plan
  GET_PRICING: "subscriptions/getprice",
  SUBSCRIPTION_PAYMENT: "stripe_log/subscription",

  //Product location master
  PRODUCTS_LOCATION: "ProductLocationMaster/",
  GET_PRODUCTS_BY_LOCATION: "ProductLocationMaster/getProductsByLocation/",
  GET_ONE_PRODUCT_BY_LOCATION: "ProductLocationMaster/getOneProductByLocation/",

  GET_STOCK_TRANSFER_LIST: "stockTransfer/list/",
  VIEW_STOCK_TRANSFER: "stockTransfer/",
  CREATE_STOCK_TRANSFER: "stockTransfer",
  //affiliation
  AFFILIATION: "affiliations/",
  ADD_AFFILIATION: "affiliations/add",
  EDIT_AFFILIATION: "affiliations/update/",
  LIST_AFFILIATION: "affiliations/list",

  //affiliationLogin
  AFFILIATE_LOGIN: "affiliations/getByCode/",
  ///bom_master (bill of Material)
  BOM_BY_ID: "bom_master/",
  CREATE_BOM: "bom_master/create", // create a new BOM
  GET_BOM_LIST_BY_COMPANY: "bom_master/getAllBomByCompany", //get BOM data list by a company with Pagination
  UPDATE_BOM: "bom_master/update", //put:- to update BOM
  BOM_LIST_PRODUCTION: "bom_master/getListForProduction", // get:- list of bom with pagination for production selector
  EXPENSE_LEDGER_LIST_IN_BOM: "account_master/expenseLedgers/",

  //bom Production
  CREATE_PRODUCTION: "production_master/create",
  GET_PRODUCTION_LIST_BY_COMPANY: "production_master/getAllProductionByCompany",
  PRODUCTION_MASTER: "production_master/",

  // this is paystack api
  PAYSTACK_PAYMENT: "payment/paystack-initialize",

  SUBSCRIPTIONS: "subscriptions",
};
export default API;
