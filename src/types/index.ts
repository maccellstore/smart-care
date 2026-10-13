export type ServiceCategory = 
  | 'mobile' 
  | 'macbook' 
  | 'laptop' 
  | 'tablet' 
  | 'software' 
  | 'accessories' 
  | 'electronics';

export type JobStatus = 
  | 'received' 
  | 'diagnosing' 
  | 'waiting_parts' 
  | 'in_repair' 
  | 'testing' 
  | 'ready' 
  | 'delivered' 
  | 'cancelled';

export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export type UserRole = 'admin' | 'manager' | 'technician' | 'receptionist' | 'customer';

export type Language = 'en' | 'ml';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specialization?: string[];
  workbench?: string;
  status?: 'active' | 'on_leave' | 'busy';
  commissionRate?: number;
  experienceYears?: number;
  totalRepairsCompleted?: number;
  rating?: number;
  joinedDate?: string;
  emergencyContact?: string;
  address?: string;
  certifications?: string[];
  notes?: string;
  monthlyTarget?: number;
}

export interface CustomerCallLog {
  id: string;
  jobId: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  date: string;
  time: string;
  callOutcome: 'confirmed_pickup' | 'requested_delivery' | 'callback_requested' | 'asked_discount' | 'no_answer' | 'paid_online' | 'ready_notified';
  notes: string;
  receptionistName: string;
  expectedPickupDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  loyaltyPoints: number;
  totalSpent: number;
  notes?: string[];
  communicationLog: {
    id: string;
    date: string;
    type: 'whatsapp' | 'sms' | 'call' | 'email';
    message: string;
    sender: string;
  }[];
  createdAt: string;
}

export interface JobPhoto {
  id: string;
  url: string;
  type: 'before' | 'after' | 'internal';
  caption: string;
  driveFileId?: string;
  uploadedAt: string;
}

export interface SparePartUsed {
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  warrantyMonths: number;
}

export interface Job {
  id: string;
  jobNumber: string; // e.g., SC-2026-1082
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  category: ServiceCategory;
  deviceBrand: string;
  deviceModel: string;
  serialOrImei: string;
  passcodePattern?: string;
  issueDescription: string;
  technicianNotes?: string;
  physicalCondition: string; // scratches, dents, liquid indicators
  priority: Priority;
  status: JobStatus;
  estimatedCost: number;
  advancePaid: number;
  finalCost?: number;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  receivedDate: string;
  dueDate: string;
  completedDate?: string;
  deliveredDate?: string;
  photos: JobPhoto[];
  partsUsed: SparePartUsed[];
  statusHistory: {
    status: JobStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }[];
  qrCodeData: string;
}

export interface SparePart {
  id: string;
  name: string;
  category: ServiceCategory;
  brand: string;
  compatibleModels: string[];
  partNumber: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minStockThreshold: number;
  locationRack: string;
  supplierName: string;
  supplierContact: string;
  lastRestocked: string;
}

export type TechnicianSpareStatus = 'in_use' | 'returned' | 'missing';

export interface TechnicianSpareLedgerItem {
  id: string;
  technicianId: string;
  technicianName: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  jobId?: string;
  jobNumber?: string;
  issuedDate: string;
  status: TechnicianSpareStatus;
  returnedDate?: string;
  notes?: string;
  handoverSignature?: string; // Data URL or text sign
  handoverOfficer: string;
}

export type PaymentMode = 'cash' | 'upi' | 'card' | 'net_banking' | 'credit';

export interface InvoiceItem {
  description: string;
  hsnSacCode: string;
  quantity: number;
  unitPrice: number;
  taxRatePercent: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0841
  jobId: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerGst?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentMode: PaymentMode;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  driveFileId?: string;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: ServiceCategory;
  deviceModel: string;
  issue: string;
  serviceType: 'in_store' | 'pickup' | 'express';
  pickupAddress?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:30 AM"
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  assignedTechnician?: string;
  reminderSent: boolean;
}

export interface CustomerFeedback {
  id: string;
  jobId: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  deviceModel: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  routedToGoogle: boolean;
  googleReviewClicked: boolean;
  adminNotes?: string;
  resolved: boolean;
}

export interface GoogleSyncConfig {
  sheetId: string;
  sheetName: string;
  driveFolderId: string;
  autoSyncInterval: 'hourly' | 'daily' | 'manual';
  lastSyncTimestamp: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  isConnected: boolean;
  googleUserEmail: string;
  backupTabs: {
    name: string;
    rowsCount: number;
    lastUpdated: string;
  }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  entityType: 'job' | 'invoice' | 'inventory' | 'customer' | 'technician' | 'google_sync';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AppNotification {
  id: string;
  type: 'customer_google_search' | 'recall_alert' | 'job_status' | 'urgent_ticket';
  title: string;
  message: string;
  customerName?: string;
  customerPhone?: string;
  deviceModel?: string;
  issue?: string;
  diagnosis?: string;
  groundingChunks?: GroundingChunk[];
  searchQueries?: string[];
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export interface SearchDiagnosisParams {
  customerName?: string;
  customerPhone?: string;
  deviceModel: string;
  issue: string;
  category?: ServiceCategory;
}

export interface DiagnosisResult {
  diagnosis: string;
  groundingChunks: GroundingChunk[];
  searchQueries: string[];
  notification?: AppNotification;
}

export interface RecallResult {
  recalls: string;
  groundingChunks: GroundingChunk[];
}
