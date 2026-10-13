import { Language, JobStatus, ServiceCategory, UserRole } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Topbar
    brandName: 'SmartCare Service Center',
    tagline: 'Mobile, MacBook, Laptop & Electronics Repair',
    searchPlaceholder: 'Search jobs, IMEI, customer phone, spare parts...',
    quickJob: 'New Job Card',
    notifications: 'Notifications',
    profile: 'Profile',
    role: 'Active Role',
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    pwaInstall: 'Install App',
    offlineMode: 'Offline Mode (Cached Data Active)',
    backupNow: 'Backup to Google Sheets',
    
    // Navigation
    navDashboard: 'Dashboard',
    navJobs: 'Jobs & Tickets',
    navCustomers: 'Customers',
    navInventory: 'Spare Parts & Inventory',
    navTechnicians: 'Technicians & Workbenches',
    navReceptionist: 'Reception & Customer Calls',
    navBilling: 'Billing & Invoices',
    navAppointments: 'Appointments',
    navFeedback: 'Customer Feedback & Reviews',
    navReports: 'Reports & Analytics',
    navGoogleSync: 'Google Sheets & Drive',
    navSettings: 'Users & Roles',
    navCustomerPortal: 'Track My Device',

    // KPI Cards
    kpiTotalJobs: 'Total Repair Jobs',
    kpiPending: 'Pending / In Queue',
    kpiInProgress: 'In Repair / Testing',
    kpiCompleted: 'Ready & Delivered',
    kpiRevenue: 'Total Revenue',
    kpiOutstanding: 'Outstanding Dues',
    kpiCustomerSatisfaction: 'Customer Rating (CSAT)',
    kpiLowStockAlerts: 'Low Stock Alerts',

    // Statuses
    status_received: 'Received',
    status_diagnosing: 'Diagnosing',
    status_waiting_parts: 'Waiting for Parts',
    status_in_repair: 'In Repair',
    status_testing: 'Quality Testing',
    status_ready: 'Ready for Delivery',
    status_delivered: 'Delivered',
    status_cancelled: 'Cancelled',

    // Categories
    cat_mobile: 'Mobile Phone',
    cat_macbook: 'MacBook & iMac',
    cat_laptop: 'Windows Laptop',
    cat_tablet: 'iPad & Tablet',
    cat_software: 'Software & OS',
    cat_accessories: 'Accessories & Spares',
    cat_electronics: 'Other Electronics',

    // Job Management
    createNewJob: 'Create New Job Card',
    editJob: 'Edit Job Details',
    jobNumber: 'Job #',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    deviceDetails: 'Device Details',
    deviceBrandModel: 'Brand & Model',
    serialImei: 'Serial # / IMEI',
    issueReported: 'Issue Reported',
    technicianNotes: 'Technician Notes',
    estimatedCost: 'Estimated Cost (₹)',
    advancePaid: 'Advance Paid (₹)',
    balanceDue: 'Balance Due (₹)',
    assignedTechnician: 'Assigned Technician',
    dueDate: 'Estimated Delivery Date',
    priority: 'Priority',
    physicalCondition: 'Physical Inspection',
    photosBeforeAfter: 'Device Photos (Before / After)',
    uploadDrive: 'Upload to Google Drive',
    printJobCard: 'Print Job Card',
    printInvoice: 'Print GST Invoice',
    sendWhatsApp: 'Send WhatsApp Update',
    sendSms: 'Send SMS',
    updateStatus: 'Update Status',
    
    // Inventory
    sparePartName: 'Part Name',
    partNumber: 'Part / SKU #',
    stockQty: 'In Stock',
    minThreshold: 'Min Alert',
    purchasePrice: 'Cost Price',
    sellingPrice: 'Sale Price',
    restock: 'Restock',
    addSparePart: 'Add New Spare Part',
    lowStockWarning: 'Items below minimum threshold',

    // Technician Spares
    issuedParts: 'Parts Issued to Tech',
    usedParts: 'Installed in Repairs',
    returnedParts: 'Returned to Stock',
    missingParts: 'Pending / Disputed',
    handoverSign: 'E-Sign Handover',
    reconciliationReport: 'Monthly Reconciliation',

    // Feedback & Google
    feedbackTitle: 'Customer Reviews & Feedback',
    leaveReview: 'Customer Experience Feedback',
    googleReviewPrompt: 'Prompted for Google Review',
    directGoogleLink: 'Leave us a Google Review on Google Maps',
    internalResolution: 'Private Feedback (Escalated to Admin)',
    starRating: 'Star Rating',
    npsScore: 'Net Promoter Score (NPS)',

    // Common Actions
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    exportCsv: 'Export to CSV',
    viewAll: 'View All',
    filterBy: 'Filter By',
    allStatuses: 'All Statuses',
    allCategories: 'All Categories',
    confirm: 'Confirm'
  },
  ml: {
    // Brand & Topbar
    brandName: 'സ്മാർട്ട്കെയർ സർവീസ് സെന്റർ',
    tagline: 'മൊബൈൽ, മാക്ബുക്ക്, ലാപ്ടോപ്പ് & ഇലക്ട്രോണിക്സ് റിപ്പയറിംഗ്',
    searchPlaceholder: 'ജോബ് #, IMEI, ഫോൺ നമ്പർ, സ്പെയർ പാർട്സ് തിരയുക...',
    quickJob: 'പുതിയ ജോബ് കാർഡ്',
    notifications: 'അറിയിപ്പുകൾ',
    profile: 'പ്രൊഫൈൽ',
    role: 'നിലവിലെ റോൾ',
    language: 'ഭാഷ',
    lightMode: 'ലൈറ്റ് മോഡ്',
    darkMode: 'ഡാർക്ക് മോഡ്',
    pwaInstall: 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക',
    offlineMode: 'ഓഫ്‌ലൈൻ മോഡ് (കാഷെ ചെയ്ത വിവരങ്ങൾ)',
    backupNow: 'ഗൂഗിൾ ഷീറ്റിലേക്ക് ബാക്കപ്പ് ചെയ്യുക',

    // Navigation
    navDashboard: 'ഡാഷ്‌ബോർഡ്',
    navJobs: 'ജോലികളും ടിക്കറ്റുകളും',
    navCustomers: 'ഉപഭോക്താക്കൾ',
    navInventory: 'സ്പെയർ പാർട്സുകൾ & സ്റ്റോക്ക്',
    navTechnicians: 'ടെക്നീഷ്യൻമാരും വർക്ക്ബെഞ്ചുകളും',
    navReceptionist: 'റിസപ്ഷൻ & കസ്റ്റമർ കോൾ ഡെസ്ക്',
    navBilling: 'ബില്ലിംഗും ഇൻവോയ്സും',
    navAppointments: 'അപ്പോയിന്റ്മെന്റുകൾ',
    navFeedback: 'കസ്റ്റമർ റിവ്യൂ & ഫീഡ്ബാക്ക്',
    navReports: 'റിപ്പോർട്ടുകളും അനലിറ്റിക്സും',
    navGoogleSync: 'ഗൂഗിൾ ഷീറ്റ്സ് & ഡ്രൈവ്',
    navSettings: 'യൂസേഴ്സും അനുമതികളും',
    navCustomerPortal: 'ഡിവൈസ് ട്രാക്ക് ചെയ്യുക',

    // KPI Cards
    kpiTotalJobs: 'ആകെ റിപ്പയർ ജോലികൾ',
    kpiPending: 'പെൻഡിംഗ് ജോലികൾ',
    kpiInProgress: 'റിപ്പയറിങ്ങിൽ / ടെസ്റ്റിംഗ്',
    kpiCompleted: 'തയ്യാറായവ & ഡെലിവറി ചെയ്തവ',
    kpiRevenue: 'ആകെ വരുമാനം',
    kpiOutstanding: 'ലഭിക്കാനുള്ള തുക',
    kpiCustomerSatisfaction: 'ഉപഭോക്തൃ സംതൃപ്തി (CSAT)',
    kpiLowStockAlerts: 'കുറഞ്ഞ സ്റ്റോക്ക് മുന്നറിയിപ്പുകൾ',

    // Statuses
    status_received: 'സ്വീകരിച്ചു',
    status_diagnosing: 'പരിശോധിക്കുന്നു',
    status_waiting_parts: 'പാർട്സുകൾക്കായി കാക്കുന്നു',
    status_in_repair: 'റിപ്പയറിങ്ങിൽ',
    status_testing: 'ക്വാളിറ്റി ടെസ്റ്റിംഗ്',
    status_ready: 'ഡെലിവറിക്ക് തയ്യാറാണ്',
    status_delivered: 'ഡെലിവർ ചെയ്തു',
    status_cancelled: 'റദ്ദാക്കി',

    // Categories
    cat_mobile: 'മൊബൈൽ ഫോൺ',
    cat_macbook: 'മാക്ബുക്ക് & ഐമാക്',
    cat_laptop: 'വിൻഡോസ് ലാപ്ടോപ്പ്',
    cat_tablet: 'ഐപാഡ് & ടാബ്‌ലെറ്റ്',
    cat_software: 'സോഫ്റ്റ്‌വെയർ & ഒഎസ്',
    cat_accessories: 'ആക്സസറികൾ & സ്പെയറുകൾ',
    cat_electronics: 'മറ്റു ഇലക്ട്രോണിക്സ്',

    // Job Management
    createNewJob: 'പുതിയ ജോബ് കാർഡ് ഉണ്ടാക്കുക',
    editJob: 'വിവരങ്ങൾ തിരുത്തുക',
    jobNumber: 'ജോബ് #',
    customerName: 'ഉപഭോക്താവിന്റെ പേര്',
    customerPhone: 'ഫോൺ നമ്പർ',
    deviceDetails: 'ഡിവൈസ് വിവരങ്ങൾ',
    deviceBrandModel: 'ബ്രാൻഡും മോഡലും',
    serialImei: 'സീരിയൽ # / IMEI',
    issueReported: 'പരാതി / തകരാറ്',
    technicianNotes: 'ടെക്നീഷ്യൻ കുറിപ്പുകൾ',
    estimatedCost: 'പ്രതീക്ഷിത ചെലവ് (₹)',
    advancePaid: 'മുൻകൂർ നൽകിയ തുക (₹)',
    balanceDue: 'ബാക്കി തുക (₹)',
    assignedTechnician: 'നിയോഗിച്ച ടെക്നീഷ്യൻ',
    dueDate: 'ഡെലിവറി തീയതി',
    priority: 'മുൻഗണന',
    physicalCondition: 'ബാഹ്യ പരിശോധന',
    photosBeforeAfter: 'ഫോട്ടോകൾ (മുമ്പ് / ശേഷം)',
    uploadDrive: 'ഗൂഗിൾ ഡ്രൈവിലേക്ക് അപ്‌ലോഡ്',
    printJobCard: 'ജോബ് കാർഡ് പ്രിന്റ് ചെയ്യുക',
    printInvoice: 'ജിഎസ്ടി ഇൻവോയ്സ് പ്രിന്റ് ചെയ്യുക',
    sendWhatsApp: 'വാട്സ്ആപ്പ് സന്ദേശം അയക്കുക',
    sendSms: 'എസ്എംഎസ് അയക്കുക',
    updateStatus: 'സ്റ്റാറ്റസ് മാറ്റുക',

    // Inventory
    sparePartName: 'സ്പെയർ പാർട്ട് പേര്',
    partNumber: 'പാർട്ട് നമ്പർ / SKU',
    stockQty: 'സ്റ്റോക്ക് ഉള്ളത്',
    minThreshold: 'കുറഞ്ഞ പരിധി',
    purchasePrice: 'വാങ്ങിയ വില',
    sellingPrice: 'വിൽപ്പന വില',
    restock: 'സ്റ്റോക്ക് ചേർക്കുക',
    addSparePart: 'പുതിയ പാർട്ട് ചേർക്കുക',
    lowStockWarning: 'കുറഞ്ഞ സ്റ്റോക്ക് ഉള്ള ഇനങ്ങൾ',

    // Technician Spares
    issuedParts: 'ടെക്നീഷ്യന് നൽകിയവ',
    usedParts: 'റിപ്പയറിങ്ങിന് ഉപയോഗിച്ചവ',
    returnedParts: 'തിരികെ സ്റ്റോക്കിലേക്ക് എത്തിയവ',
    missingParts: 'ബാക്കി / തർക്കത്തിലുള്ളവ',
    handoverSign: 'ഇ-സൈൻ കൈമാറ്റം',
    reconciliationReport: 'പ്രതിമാസ റിപ്പോർട്ട്',

    // Feedback & Google
    feedbackTitle: 'ഉപഭോക്തൃ അഭിപ്രായങ്ങളും റിവ്യൂകളും',
    leaveReview: 'അഭിപ്രായം രേഖപ്പെടുത്തുക',
    googleReviewPrompt: 'ഗൂഗിൾ റിവ്യൂ നൽകാൻ നിർദ്ദേശിച്ചു',
    directGoogleLink: 'ഗൂഗിൾ മാപ്പിൽ റിവ്യൂ രേഖപ്പെടുത്തുക',
    internalResolution: 'സ്വകാര്യ ഫീഡ്ബാക്ക് (അഡ്മിൻ പരിഹരിക്കുന്നു)',
    starRating: 'സ്റ്റാർ റേറ്റിംഗ്',
    npsScore: 'എൻപിഎസ് സ്കോർ (NPS)',

    // Common Actions
    save: 'സൂക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    delete: 'നീക്കം ചെയ്യുക',
    exportCsv: 'സിഎസ്വി ആയി ഡൗൺലോഡ്',
    viewAll: 'എല്ലാം കാണുക',
    filterBy: 'ഫിൽട്ടർ ചെയ്യുക',
    allStatuses: 'എല്ലാ സ്റ്റാറ്റസുകളും',
    allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    confirm: 'സ്ഥിരീകരിക്കുക'
  }
};

export const useI18n = (lang: Language) => {
  return (key: string, fallback?: string): string => {
    return translations[lang]?.[key] || translations.en[key] || fallback || key;
  };
};

export const getStatusColor = (status: JobStatus): { bg: string; text: string; border: string; badgeClass: string } => {
  switch (status) {
    case 'received':
      return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30', badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800' };
    case 'diagnosing':
      return { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30', badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800' };
    case 'waiting_parts':
      return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' };
    case 'in_repair':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30', badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800' };
    case 'testing':
      return { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/30', badgeClass: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800' };
    case 'ready':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800' };
    case 'delivered':
      return { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30', badgeClass: 'bg-green-100 text-green-800 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800' };
    case 'cancelled':
      return { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/30', badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
  }
};
