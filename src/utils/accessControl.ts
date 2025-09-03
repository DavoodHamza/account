import { useSelector } from "react-redux";

export const useAccessControl = () => {
  const { user } = useSelector((state: any) => state.User);


  const isAdmin = !user.isStaff;

  // Get staff access permissions
  const staffAccess = user?.staff?.access?.split("|") || [];

  /**
   * Check if staff has access to a specific module/action
   * @param moduleId - The module ID to check access for
   * @returns boolean - true if user has access
   */
  const hasAccess = (moduleId: string | number): boolean => {
    // Admin has full access
    if (isAdmin) return true;

    // Staff access is controlled by permissions
    return staffAccess.includes(moduleId.toString());
  };

  /**
   * Check if user can view staff
   */
  const canViewStaff = (): boolean => {
    const hasBasicAccess = hasAccess("19");
    const hasViewAccess = hasAccess("19_view");
    const canView = hasBasicAccess || hasViewAccess;



    return canView;
  };

  /**
   * Check if user can create staff
   */
  const canCreateStaff = (): boolean => {
    // Only grant create access if user has specific create permission (19_create)
    // Basic access (19) should only grant view access, not create
    const hasCreateAccess = hasAccess("19_create");
    const canCreate = hasCreateAccess;



    return canCreate;
  };

  /**
   * Check if user can edit staff
   */
  const canEditStaff = (): boolean => {
    // Only grant update access if user has specific update permission (19_update)
    // Basic access (19) should only grant view access, not update
    const hasUpdateAccess = hasAccess("19_update");
    const canUpdate = hasUpdateAccess;



    return canUpdate;
  };

  /**
   * Check if user can delete staff
   */
  const canDeleteStaff = (): boolean => {
    // Only grant delete access if user has specific delete permission (19_delete)
    // Basic access (19) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("19_delete");
    const canDelete = hasDeleteAccess;

 
    

    return canDelete;
  };

  /**
   * Check if user can view products
   */
  const canViewProducts = (): boolean => {
    return hasAccess("2"); // Product & Service module ID
  };

  /**
   * Check if user can create products
   */
  const canCreateProducts = (): boolean => {
    return hasAccess("2_create"); // Product create permission
  };

  /**
   * Check if user can update products
   */
  const canUpdateProducts = (): boolean => {
    return hasAccess("2_update"); // Product update permission
  };

  /**
   * Check if user can delete products
   */
  const canDeleteProducts = (): boolean => {
    // Delete option is disabled for Product & Service section
    return false;
  };

  /**
   * Check if user can view sales
   */
  const canViewSales = (): boolean => {
    const hasBasicAccess = hasAccess("4");
    const hasViewAccess = hasAccess("4_view");
    const canView = hasBasicAccess || hasViewAccess;

  

    return canView;
  };

  /**
   * Check if user can create sales
   */
  const canCreateSales = (): boolean => {
    // Only grant create access if user has specific create permission (4_create)
    // Basic access (4) should only grant view access, not create
    const hasCreateAccess = hasAccess("4_create");
    const canCreate = hasCreateAccess;



    return canCreate;
  };

  /**
   * Check if user can update sales
   */
  const canUpdateSales = (): boolean => {
    // Only grant update access if user has specific update permission (4_update)
    // Basic access (4) should only grant view access, not update
    const hasUpdateAccess = hasAccess("4_update");
    const canUpdate = hasUpdateAccess;

  

    return canUpdate;
  };

  /**
   * Check if user can delete sales
   */
  const canDeleteSales = (): boolean => {
    // Only grant delete access if user has specific delete permission (4_delete)
    // Basic access (4) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("4_delete");
    const canDelete = hasDeleteAccess;

;

    return canDelete;
  };

  /**
   * Check if user can view purchases
   */
  const canViewPurchases = (): boolean => {
    return hasAccess("5") || hasAccess("5_view"); // Purchase module ID or view permission
  };

  /**
   * Check if user can create purchases
   */
  const canCreatePurchases = (): boolean => {
    // Only grant create access if user has specific create permission (5_create)
    // Basic access (5) should only grant view access, not create
    const hasCreateAccess = hasAccess("5_create");
    const canCreate = hasCreateAccess;

    return canCreate;
  };

  /**
   * Check if user can update purchases
   */
  const canUpdatePurchases = (): boolean => {
    // Only grant update access if user has specific update permission (5_update)
    // Basic access (5) should only grant view access, not update
    const hasUpdateAccess = hasAccess("5_update");
    const canUpdate = hasUpdateAccess;


    

    return canUpdate;
  };

  /**
   * Check if user can delete purchases
   */
  const canDeletePurchases = (): boolean => {
    // Only grant delete access if user has specific delete permission (5_delete)
    // Basic access (5) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("5_delete");
    const canDelete = hasDeleteAccess;

   
    

    return canDelete;
  };

  /**
   * Check if user can view contacts
   */
  const canViewContacts = (): boolean => {
    return hasAccess("6"); // Contacts module ID
  };

  /**
   * Check if user can create contacts
   */
  const canCreateContacts = (): boolean => {
    return hasAccess("6_create"); // Contacts create permission
  };

  /**
   * Check if user can update contacts
   */
  const canUpdateContacts = (): boolean => {
    return hasAccess("6_update"); // Contacts update permission
  };

  /**
   * Check if user can delete contacts
   */
  const canDeleteContacts = (): boolean => {
    return hasAccess("6_delete"); // Contacts delete permission
  };

  /**
   * Check if user can view journals
   */
  const canViewJournals = (): boolean => {
    return hasAccess("7") || hasAccess("7_view"); // Journal module ID or view permission
  };

  /**
   * Check if user can create journals
   */
  const canCreateJournals = (): boolean => {
    // Only grant create access if user has specific create permission (7_create)
    // Basic access (7) should only grant view access, not create
    const hasCreateAccess = hasAccess("7_create");
    const canCreate = hasCreateAccess;

  
    

    return canCreate;
  };

  /**
   * Check if user can update journals
   */
  const canUpdateJournals = (): boolean => {
    // Only grant update access if user has specific update permission (7_update)
    // Basic access (7) should only grant view access, not update
    const hasUpdateAccess = hasAccess("7_update");
    const canUpdate = hasUpdateAccess;

    

    return canUpdate;
  };

  /**
   * Check if user can delete journals
   */
  const canDeleteJournals = (): boolean => {
    // Only grant delete access if user has specific delete permission (7_delete)
    // Basic access (7) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("7_delete");
    const canDelete = hasDeleteAccess;

  
    

    return canDelete;
  };

  /**
   * Check if user can view payments
   */
  const canViewPayments = (): boolean => {
    return hasAccess("11") || hasAccess("11_view"); // Payment module ID or view permission
  };

  /**
   * Check if user can create payments
   */
  const canCreatePayments = (): boolean => {
    // Only grant create access if user has specific create permission (11_create)
    // Basic access (11) should only grant view access, not create
    const hasCreateAccess = hasAccess("11_create");
    const canCreate = hasCreateAccess;

  
    

    return canCreate;
  };

  /**
   * Check if user can update payments
   */
  const canUpdatePayments = (): boolean => {
    // Only grant update access if user has specific update permission (11_update)
    // Basic access (11) should only grant view access, not update
    const hasUpdateAccess = hasAccess("11_update");
    const canUpdate = hasUpdateAccess;

  
    

    return canUpdate;
  };

  /**
   * Check if user can delete payments
   */
  const canDeletePayments = (): boolean => {
    // Only grant delete access if user has specific delete permission (11_delete)
    // Basic access (11) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("11_delete");
    const canDelete = hasDeleteAccess;

    return canDelete;
  };

  /**
   * Check if user can view receipts
   */
  const canViewReceipts = (): boolean => {
    const hasBasicAccess = hasAccess("9");
    const hasViewAccess = hasAccess("9_view");
    const canView = hasBasicAccess || hasViewAccess;


    

    return canView;
  };

  /**
   * Check if user can create receipts
   */
  const canCreateReceipts = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewReceipts();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant create access if user has specific create permission (9_create)
    const hasCreateAccess = hasAccess("9_create");
    const canCreate = hasCreateAccess;

  

    return canCreate;
  };

  /**
   * Check if user can update receipts
   */
  const canUpdateReceipts = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewReceipts();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant update access if user has specific update permission (9_update)
    const hasUpdateAccess = hasAccess("9_update");
    const canUpdate = hasUpdateAccess;


    return canUpdate;
  };

  /**
   * Check if user can delete receipts
   */
  const canDeleteReceipts = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewReceipts();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant delete access if user has specific delete permission (9_delete)
    const hasDeleteAccess = hasAccess("9_delete");
    const canDelete = hasDeleteAccess;


    return canDelete;
  };

  /**
   * Check if user can view contra
   */
  const canViewContra = (): boolean => {
    const hasBasicAccess = hasAccess("10");
    const hasViewAccess = hasAccess("10_view");
    const canView = hasBasicAccess || hasViewAccess;

  

    return canView;
  };

  /**
   * Check if user can create contra
   */
  const canCreateContra = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewContra();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant create access if user has specific create permission (10_create)
    const hasCreateAccess = hasAccess("10_create");
    const canCreate = hasCreateAccess;

  

    return canCreate;
  };

  /**
   * Check if user can update contra
   */
  const canUpdateContra = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewContra();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant update access if user has specific update permission (10_update)
    const hasUpdateAccess = hasAccess("10_update");
    const canUpdate = hasUpdateAccess;

  

    return canUpdate;
  };

  /**
   * Check if user can delete contra
   */
  const canDeleteContra = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewContra();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant delete access if user has specific delete permission (10_delete)
    const hasDeleteAccess = hasAccess("10_delete");
    const canDelete = hasDeleteAccess;

  

    return canDelete;
  };

  /**
   * Check if user can view bank
   */
  const canViewBank = (): boolean => {
    const hasBasicAccess = hasAccess("11");
    const hasViewAccess = hasAccess("11_view");
    const canView = hasBasicAccess || hasViewAccess;

   

    return canView;
  };

  /**
   * Check if user can create bank
   */
  const canCreateBank = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewBank();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant create access if user has specific create permission (11_create)
    const hasCreateAccess = hasAccess("11_create");
    const canCreate = hasCreateAccess;



    return canCreate;
  };

  /**
   * Check if user can update bank
   */
  const canUpdateBank = (): boolean => {
    // Only grant update access if user has specific update permission (11_update)
    // Basic access (11) should only grant view access, not update
    const hasUpdateAccess = hasAccess("11_update");
    const canUpdate = hasUpdateAccess;

    

    return canUpdate;
  };

  /**
   * Check if user can delete bank
   */
  const canDeleteBank = (): boolean => {
    // Only grant delete access if user has specific delete permission (11_delete)
    // Basic access (11) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("11_delete");
    const canDelete = hasDeleteAccess;

 

    return canDelete;
  };

  /**
   * Check if user can view cash
   */
  const canViewCash = (): boolean => {
    const hasBasicAccess = hasAccess("12");
    const hasViewAccess = hasAccess("12_view");
    const canView = hasBasicAccess || hasViewAccess;

  

    return canView;
  };

  /**
   * Check if user can create cash
   */
  const canCreateCash = (): boolean => {
    // Only grant create access if user has specific create permission (12_create)
    // Basic access (12) should only grant view access, not create
    const hasCreateAccess = hasAccess("12_create");
    const canCreate = hasCreateAccess;

    

    return canCreate;
  };

  /**
   * Check if user can update cash
   */
  const canUpdateCash = (): boolean => {
    // Only grant update access if user has specific update permission (12_update)
    // Basic access (12) should only grant view access, not update
    const hasUpdateAccess = hasAccess("12_update");
    const canUpdate = hasUpdateAccess;

   

    return canUpdate;
  };

  /**
   * Check if user can delete cash
   */
  const canDeleteCash = (): boolean => {
    // Only grant delete access if user has specific delete permission (12_delete)
    // Basic access (12) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("12_delete");
    const canDelete = hasDeleteAccess;



    return canDelete;
  };

  /**
   * Check if user can view reports
   */
  const canViewReports = (): boolean => {
    const hasBasicAccess = hasAccess("13");
    const hasViewAccess = hasAccess("13_view");
    const canView = hasBasicAccess || hasViewAccess;



    return canView;
  };

  /**
   * Check if user can create reports
   */
  const canCreateReports = (): boolean => {
    // Only grant create access if user has specific create permission (13_create)
    // Basic access (13) should only grant view access, not create
    const hasCreateAccess = hasAccess("13_create");
    const canCreate = hasCreateAccess;

 

    return canCreate;
  };

  /**
   * Check if user can update reports
   */
  const canUpdateReports = (): boolean => {
    // Only grant update access if user has specific update permission (13_update)
    // Basic access (13) should only grant view access, not update
    const hasUpdateAccess = hasAccess("13_update");
    const canUpdate = hasUpdateAccess;

  

    return canUpdate;
  };

  /**
   * Check if user can delete reports
   */
  const canDeleteReports = (): boolean => {
    // Only grant delete access if user has specific delete permission (13_delete)
    // Basic access (13) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("13_delete");
    const canDelete = hasDeleteAccess;

   

    return canDelete;
  };

  /**
   * Check if user can view ledgers
   */
  const canViewLedgers = (): boolean => {
    const hasBasicAccess = hasAccess("14");
    const hasViewAccess = hasAccess("14_view");
    const canView = hasBasicAccess || hasViewAccess;



    return canView;
  };

  /**
   * Check if user can create ledgers
   */
  const canCreateLedgers = (): boolean => {
    // Only grant create access if user has specific create permission (14_create)
    // Basic access (14) should only grant view access, not create
    const hasCreateAccess = hasAccess("14_create");
    const canCreate = hasCreateAccess;



    return canCreate;
  };

  /**
   * Check if user can update ledgers
   */
  const canUpdateLedgers = (): boolean => {
    // Only grant update access if user has specific update permission (14_update)
    // Basic access (14) should only grant view access, not update
    const hasUpdateAccess = hasAccess("14_update");
    const canUpdate = hasUpdateAccess;


    return canUpdate;
  };

  /**
   * Check if user can delete ledgers
   */
  const canDeleteLedgers = (): boolean => {
    // Only grant delete access if user has specific delete permission (14_delete)
    // Basic access (14) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("14_delete");
    const canDelete = hasDeleteAccess;

   

    return canDelete;
  };

  /**
   * Check if user can view settings
   */
  const canViewSettings = (): boolean => {
    const hasBasicAccess = hasAccess("21");
    const hasViewAccess = hasAccess("21_view");
    const canView = hasBasicAccess || hasViewAccess;


    return canView;
  };

  /**
   * Check if user can create settings
   */
  const canCreateSettings = (): boolean => {
    // Only grant create access if user has specific create permission (21_create)
    // Basic access (21) should only grant view access, not create
    const hasCreateAccess = hasAccess("21_create");
    const canCreate = hasCreateAccess;



    return canCreate;
  };

  /**
   * Check if user can update settings
   */
  const canUpdateSettings = (): boolean => {
    // Only grant update access if user has specific update permission (21_update)
    // Basic access (21) should only grant view access, not update
    const hasUpdateAccess = hasAccess("21_update");
    const canUpdate = hasUpdateAccess;

  
    

    return canUpdate;
  };

  /**
   * Check if user can delete settings
   */
  const canDeleteSettings = (): boolean => {
    // Only grant delete access if user has specific delete permission (21_delete)
    // Basic access (21) should only grant view access, not delete
    const hasDeleteAccess = hasAccess("21_delete");
    const canDelete = hasDeleteAccess;

 
    

    return canDelete;
  };

  /**
   * Check if user can view counters
   */
  const canViewCounters = (): boolean => {
    const hasBasicAccess = hasAccess("20");
    const hasViewAccess = hasAccess("20_view");
    const canView = hasBasicAccess || hasViewAccess;

   
    

    return canView;
  };

  /**
   * Check if user can create counters
   */
  const canCreateCounters = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewCounters();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant create access if user has specific create permission (20_create)
    const hasCreateAccess = hasAccess("20_create");
    const canCreate = hasCreateAccess;

  

    return canCreate;
  };

  /**
   * Check if user can update counters
   */
  const canUpdateCounters = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewCounters();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant update access if user has specific update permission (20_update)
    const hasUpdateAccess = hasAccess("20_update");
    const canUpdate = hasUpdateAccess;

  
    

    return canUpdate;
  };

  /**
   * Check if user can delete counters
   */
  const canDeleteCounters = (): boolean => {
    // First check if user has view access - if not, deny all other permissions
    const hasViewAccess = canViewCounters();
    if (!hasViewAccess) {
      return false;
    }
    
    // Only grant delete access if user has specific delete permission (20_delete)
    const hasDeleteAccess = hasAccess("20_delete");
    const canDelete = hasDeleteAccess;

  

    return canDelete;
  };

  /**
   * Check if user has any receipts permissions at all
   */
  const hasAnyReceiptsPermission = (): boolean => {
    const hasBasicAccess = hasAccess("9");
    const hasViewAccess = hasAccess("9_view");
    const hasCreateAccess = hasAccess("9_create");
    const hasUpdateAccess = hasAccess("9_update");
    const hasDeleteAccess = hasAccess("9_delete");

    const hasAnyPermission =
      hasBasicAccess ||
      hasViewAccess ||
      hasCreateAccess ||
      hasUpdateAccess ||
      hasDeleteAccess;



    return hasAnyPermission;
  };

  /**
   * Check if user has any counter permissions at all
   */
  const hasAnyCounterPermission = (): boolean => {
    const hasBasicAccess = hasAccess("20");
    const hasViewAccess = hasAccess("20_view");
    const hasCreateAccess = hasAccess("20_create");
    const hasUpdateAccess = hasAccess("20_update");
    const hasDeleteAccess = hasAccess("20_delete");

    const hasAnyPermission =
      hasBasicAccess ||
      hasViewAccess ||
      hasCreateAccess ||
      hasUpdateAccess ||
      hasDeleteAccess;


    return hasAnyPermission;
  };

  /**
   * Check if user has any sales permissions at all
   */
  const hasAnySalesPermission = (): boolean => {
    const hasBasicAccess = hasAccess("4");
    const hasViewAccess = hasAccess("4_view");
    const hasCreateAccess = hasAccess("4_create");
    const hasUpdateAccess = hasAccess("4_update");
    const hasDeleteAccess = hasAccess("4_delete");

    const hasAnyPermission =
      hasBasicAccess ||
      hasViewAccess ||
      hasCreateAccess ||
      hasUpdateAccess ||
      hasDeleteAccess;

  

    return hasAnyPermission;
  };

  /**
   * Check if user has any purchase permissions at all
   */
  const hasAnyPurchasePermission = (): boolean => {
    const hasFullAccess = hasAccess("5");
    const hasViewAccess = hasAccess("5_view");
    const hasCreateAccess = hasAccess("5_create");
    const hasUpdateAccess = hasAccess("5_update");
    const hasDeleteAccess = hasAccess("5_delete");

    const hasAnyPermission =
      hasFullAccess ||
      hasViewAccess ||
      hasCreateAccess ||
      hasUpdateAccess ||
      hasDeleteAccess;

   

    return hasAnyPermission;
  };

  return {
    isAdmin,
    hasAccess,
    // Staff permissions
    canViewStaff,
    canCreateStaff,
    canEditStaff,
    canDeleteStaff,
    // Product permissions
    canViewProducts,
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,
    // Sales permissions
    canViewSales,
    canCreateSales,
    canUpdateSales,
    canDeleteSales,
    // Purchase permissions
    canViewPurchases,
    canCreatePurchases,
    canUpdatePurchases,
    canDeletePurchases,
    // Contact permissions
    canViewContacts,
    canCreateContacts,
    canUpdateContacts,
    canDeleteContacts,
    // Journal permissions
    canViewJournals,
    canCreateJournals,
    canUpdateJournals,
    canDeleteJournals,
    // Payment permissions
    canViewPayments,
    canCreatePayments,
    canUpdatePayments,
    canDeletePayments,
    // Receipts permissions
    canViewReceipts,
    canCreateReceipts,
    canUpdateReceipts,
    canDeleteReceipts,
    // Contra permissions
    canViewContra,
    canCreateContra,
    canUpdateContra,
    canDeleteContra,
    // Bank permissions
    canViewBank,
    canCreateBank,
    canUpdateBank,
    canDeleteBank,
    // Cash permissions
    canViewCash,
    canCreateCash,
    canUpdateCash,
    canDeleteCash,
    // Report permissions
    canViewReports,
    canCreateReports,
    canUpdateReports,
    canDeleteReports,
    // Ledger permissions
    canViewLedgers,
    canCreateLedgers,
    canUpdateLedgers,
    canDeleteLedgers,
    // Settings permissions
    canViewSettings,
    canCreateSettings,
    canUpdateSettings,
    canDeleteSettings,
    // Counter permissions
    canViewCounters,
    canCreateCounters,
    canUpdateCounters,
    canDeleteCounters,
    // Sales permissions
    hasAnySalesPermission,
    // Purchase permissions
    hasAnyPurchasePermission,
    // Receipts permissions
    hasAnyReceiptsPermission,
    // Counter permissions
    hasAnyCounterPermission,
    staffAccess,
  };
};
