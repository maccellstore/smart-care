import { 
  Job, 
  Customer, 
  SparePart, 
  TechnicianSpareLedgerItem, 
  Invoice, 
  Appointment, 
  CustomerFeedback, 
  GoogleSyncConfig, 
  User, 
  ActivityLog,
  CustomerCallLog
} from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Nair',
    email: 'rajesh@smartcare.service',
    phone: '+91 98470 12345',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialization: ['Diagnostics', 'Apple Certified Master Tech', 'Management'],
    workbench: 'Bench #0 - Master QC Station',
    status: 'active',
    commissionRate: 20,
    experienceYears: 12,
    totalRepairsCompleted: 1420,
    rating: 5.0,
    joinedDate: '2019-01-15'
  },
  {
    id: 'usr-2',
    name: 'Anandhu K',
    email: 'anandhu@smartcare.service',
    phone: '+91 94951 88231',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: ['MacBook Logic Board', 'iPhone Screen & IC repair', 'Micro-Soldering'],
    workbench: 'Bench #1 - Micro-soldering Cleanroom',
    status: 'active',
    commissionRate: 18,
    experienceYears: 7,
    totalRepairsCompleted: 618,
    rating: 4.9,
    joinedDate: '2021-03-10'
  },
  {
    id: 'usr-3',
    name: 'Rahul Raj',
    email: 'rahul@smartcare.service',
    phone: '+91 97455 11980',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialization: ['Windows Laptops', 'BGA Reballing', 'Gaming Rigs & GPU Repair'],
    workbench: 'Bench #2 - BGA Rework Station',
    status: 'active',
    commissionRate: 15,
    experienceYears: 5,
    totalRepairsCompleted: 489,
    rating: 4.8,
    joinedDate: '2022-06-01'
  },
  {
    id: 'usr-6',
    name: 'Midhun Joy',
    email: 'midhun.joy@smartcare.service',
    phone: '+91 98472 33499',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    specialization: ['iPad & Tablet Screens', 'Battery Replacement', 'FaceID Alignment'],
    workbench: 'Bench #3 - Mobile Assembly Desk',
    status: 'active',
    commissionRate: 14,
    experienceYears: 4,
    totalRepairsCompleted: 312,
    rating: 4.7,
    joinedDate: '2023-02-15'
  },
  {
    id: 'usr-4',
    name: 'Fathima Zeenath',
    email: 'fathima@smartcare.service',
    phone: '+91 96331 44552',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    specialization: ['Intake', 'Customer Support', 'Billing', 'Malayalam & English Care'],
    workbench: 'Front Desk Counter 1',
    status: 'active',
    joinedDate: '2022-09-01'
  },
  {
    id: 'usr-5',
    name: 'Arjun Varma',
    email: 'arjun.varma@gmail.com',
    phone: '+91 98460 77112',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    specialization: ['Customer']
  }
];

export const initialCallLogs: CustomerCallLog[] = [
  {
    id: 'call-1',
    jobId: 'job-5',
    jobNumber: 'SC-2026-105',
    customerId: 'cust-5',
    customerName: 'Aiswarya Mohan',
    customerPhone: '+91 94471 22334',
    deviceModel: 'Apple iPad Air 5th Gen (M1)',
    date: '2026-09-23',
    time: '11:30 AM',
    callOutcome: 'confirmed_pickup',
    notes: 'Informed customer iPad screen replacement & touch recalibration is complete. Balance payable: ₹1,500. Customer confirmed she will pick up at 5:30 PM after office.',
    receptionistName: 'Fathima Zeenath',
    expectedPickupDate: '2026-09-23'
  },
  {
    id: 'call-2',
    jobId: 'job-1',
    jobNumber: 'SC-2026-101',
    customerId: 'cust-1',
    customerName: 'Arjun Varma',
    customerPhone: '+91 98460 77112',
    deviceModel: 'MacBook Pro 14" M2 Pro',
    date: '2026-09-23',
    time: '02:15 PM',
    callOutcome: 'ready_notified',
    notes: 'Sent WhatsApp job finished notification with bill breakdown (₹12,500 total, advance paid ₹4,000, balance ₹8,500). Customer acknowledged via WhatsApp and requested UPI QR code.',
    receptionistName: 'Fathima Zeenath'
  },
  {
    id: 'call-3',
    jobId: 'job-3',
    jobNumber: 'SC-2026-103',
    customerId: 'cust-3',
    customerName: 'Muhammed Nihal',
    customerPhone: '+91 90481 99887',
    deviceModel: 'Dell XPS 15 9520',
    date: '2026-09-22',
    time: '04:45 PM',
    callOutcome: 'requested_delivery',
    notes: 'Customer requested doorstep courier delivery to Payyannur. Confirmed delivery address and received balance ₹2,800 via GPay. Dispatched via Professional Couriers.',
    receptionistName: 'Fathima Zeenath'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Arjun Varma',
    phone: '+91 98460 77112',
    email: 'arjun.varma@gmail.com',
    address: 'Near Fort Road, Kannur, Kerala - 670001',
    gstNumber: '32AABCS1429B1ZB',
    loyaltyPoints: 340,
    totalSpent: 18500,
    notes: ['Prefers original OEM parts', 'Frequent corporate client'],
    communicationLog: [
      { id: 'com-1', date: '2026-09-22 10:30', type: 'whatsapp', message: 'Job SC-2026-101 created for MacBook Pro M2.', sender: 'Fathima' },
      { id: 'com-2', date: '2026-09-23 09:15', type: 'whatsapp', message: 'Diagnosis complete. Keyboard replacement needed.', sender: 'Anandhu K' }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-2',
    name: 'Dr. Priya Menon',
    phone: '+91 94471 22883',
    email: 'priya.menon@hospital.org',
    address: 'Kalyan Nagar, Calicut, Kerala - 673004',
    loyaltyPoints: 120,
    totalSpent: 8200,
    notes: ['Needs urgent turnaround due to clinical duties'],
    communicationLog: [
      { id: 'com-3', date: '2026-09-21 14:00', type: 'sms', message: 'Job SC-2026-102: Screen replacement in progress.', sender: 'System' }
    ],
    createdAt: '2026-03-10'
  },
  {
    id: 'cust-3',
    name: 'Muhammed Nihal',
    phone: '+91 97466 33901',
    email: 'nihal.tech@craftstudio.in',
    address: 'Marine Drive, Kochi, Kerala - 682031',
    gstNumber: '32BNQPN9921K1ZZ',
    loyaltyPoints: 480,
    totalSpent: 34500,
    notes: ['Studio workstation repairs', 'Requires tax invoice always'],
    communicationLog: [
      { id: 'com-4', date: '2026-09-23 11:00', type: 'whatsapp', message: 'Job SC-2026-103 ready for pickup.', sender: 'Rahul Raj' }
    ],
    createdAt: '2025-11-20'
  },
  {
    id: 'cust-4',
    name: 'Sneha Haridas',
    phone: '+91 99951 88472',
    email: 'sneha.haridas@yahoo.com',
    address: 'Thavakkara, Kannur, Kerala - 670002',
    loyaltyPoints: 90,
    totalSpent: 4500,
    notes: ['First-time student discount applied'],
    communicationLog: [],
    createdAt: '2026-08-02'
  }
];

export const initialSpareParts: SparePart[] = [
  {
    id: 'part-1',
    name: 'MacBook Pro 14" M1/M2 Display Assembly (Space Gray)',
    category: 'macbook',
    brand: 'Apple OEM',
    compatibleModels: ['A2442', 'A2779', 'MacBook Pro 14 2021-2023'],
    partNumber: 'MBP-DISP-14-SG',
    purchasePrice: 28000,
    sellingPrice: 35000,
    quantity: 3,
    minStockThreshold: 2,
    locationRack: 'Rack A-2',
    supplierName: 'Silicon Care Imports BLR',
    supplierContact: '+91 98450 99881',
    lastRestocked: '2026-09-10'
  },
  {
    id: 'part-2',
    name: 'iPhone 15 Pro Max Super Retina XDR OLED Screen',
    category: 'mobile',
    brand: 'Apple OEM',
    compatibleModels: ['iPhone 15 Pro Max', 'A3106'],
    partNumber: 'IPH-15PM-OLED-OG',
    purchasePrice: 19500,
    sellingPrice: 24500,
    quantity: 1, // Low stock!
    minStockThreshold: 3,
    locationRack: 'Rack B-1',
    supplierName: 'Apex Mobile Solutions Kochi',
    supplierContact: '+91 94470 66554',
    lastRestocked: '2026-09-01'
  },
  {
    id: 'part-3',
    name: 'Dell XPS 15 9520 Dual Cooling Fan Set',
    category: 'laptop',
    brand: 'Dell OEM',
    compatibleModels: ['Dell XPS 15 9520', 'Precision 5570'],
    partNumber: 'FAN-XPS-9520-SET',
    purchasePrice: 2200,
    sellingPrice: 3400,
    quantity: 5,
    minStockThreshold: 2,
    locationRack: 'Rack C-4',
    supplierName: 'Delta Parts Global',
    supplierContact: '+91 80234 11223',
    lastRestocked: '2026-09-15'
  },
  {
    id: 'part-4',
    name: 'iPad Air 5 (M1) Touch Digitizer & Glass',
    category: 'tablet',
    brand: 'OEM Grade A+',
    compatibleModels: ['iPad Air 5th Gen 10.9"', 'A2588', 'A2589'],
    partNumber: 'IPAD-AIR5-DIGI',
    purchasePrice: 5800,
    sellingPrice: 8200,
    quantity: 2, // Low stock alert
    minStockThreshold: 2,
    locationRack: 'Rack B-3',
    supplierName: 'Apex Mobile Solutions Kochi',
    supplierContact: '+91 94470 66554',
    lastRestocked: '2026-08-28'
  },
  {
    id: 'part-5',
    name: 'Thermal Grizzly Kryonaut Extreme Thermal Paste 2g',
    category: 'laptop',
    brand: 'Thermal Grizzly',
    compatibleModels: ['Universal High-Performance Laptops/Desktops'],
    partNumber: 'TG-KRYO-EXT-2G',
    purchasePrice: 950,
    sellingPrice: 1400,
    quantity: 12,
    minStockThreshold: 4,
    locationRack: 'Consumables Tray 1',
    supplierName: 'GamerTech Wholesale Chennai',
    supplierContact: '+91 98401 22334',
    lastRestocked: '2026-09-18'
  },
  {
    id: 'part-6',
    name: 'Samsung Galaxy S24 Ultra Original Battery (5000mAh)',
    category: 'mobile',
    brand: 'Samsung Service Pack',
    compatibleModels: ['SM-S928B', 'S24 Ultra'],
    partNumber: 'SAM-S24U-BATT',
    purchasePrice: 2800,
    sellingPrice: 4200,
    quantity: 6,
    minStockThreshold: 2,
    locationRack: 'Rack B-2',
    supplierName: 'Apex Mobile Solutions Kochi',
    supplierContact: '+91 94470 66554',
    lastRestocked: '2026-09-12'
  },
  {
    id: 'part-7',
    name: 'Type-C Thunderbolt 4 Replacement Port Board for MacBook',
    category: 'macbook',
    brand: 'Foxconn OEM',
    compatibleModels: ['MacBook Pro M1/M2/M3'],
    partNumber: 'MBP-TB4-PORT',
    purchasePrice: 1800,
    sellingPrice: 2900,
    quantity: 1, // Low stock alert!
    minStockThreshold: 3,
    locationRack: 'Rack A-5',
    supplierName: 'Silicon Care Imports BLR',
    supplierContact: '+91 98450 99881',
    lastRestocked: '2026-08-15'
  }
];

export const initialJobs: Job[] = [
  {
    id: 'job-1',
    jobNumber: 'SC-2026-101',
    customerId: 'cust-1',
    customerName: 'Arjun Varma',
    customerPhone: '+91 98460 77112',
    customerEmail: 'arjun.varma@gmail.com',
    category: 'macbook',
    deviceBrand: 'Apple',
    deviceModel: 'MacBook Pro 14" M2 Pro (2023)',
    serialOrImei: 'C02GK9XXMD6R',
    passcodePattern: 'Unlock with customer presence',
    issueDescription: 'Accidental green tea spill on keyboard. Spacebar and row Q-P sticky, trackpad haptics stuttering.',
    technicianNotes: 'Ultrasonic board clean completed. Corrosion cleared near I/O daughterboard. New keyboard installed.',
    physicalCondition: 'Minor hairline scratches on bottom cover, no dents.',
    priority: 'urgent',
    status: 'testing',
    estimatedCost: 14500,
    advancePaid: 5000,
    finalCost: 14500,
    assignedTechnicianId: 'usr-2',
    assignedTechnicianName: 'Anandhu K',
    receivedDate: '2026-09-22 10:15',
    dueDate: '2026-09-24 17:00',
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
        type: 'before',
        caption: 'Keyboard liquid residue and staining upon intake',
        driveFileId: 'DRIVE_IMG_MBP_BEFORE_101',
        uploadedAt: '2026-09-22 10:20'
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
        type: 'internal',
        caption: 'Cleaned daughterboard and logic rail checked',
        driveFileId: 'DRIVE_IMG_MBP_INTERNAL_101',
        uploadedAt: '2026-09-23 09:30'
      }
    ],
    partsUsed: [
      {
        partId: 'part-7',
        partName: 'Type-C Thunderbolt 4 Replacement Port Board for MacBook',
        partNumber: 'MBP-TB4-PORT',
        quantity: 1,
        unitPrice: 2900,
        warrantyMonths: 6
      }
    ],
    statusHistory: [
      { status: 'received', changedAt: '2026-09-22 10:15', changedBy: 'Fathima Zeenath', note: 'Intake ticket generated' },
      { status: 'diagnosing', changedAt: '2026-09-22 11:30', changedBy: 'Anandhu K', note: 'Liquid damage inspection' },
      { status: 'in_repair', changedAt: '2026-09-22 15:45', changedBy: 'Anandhu K', note: 'Ultrasonic cleaning & board rework' },
      { status: 'testing', changedAt: '2026-09-23 10:00', changedBy: 'Anandhu K', note: 'Running Apple Hardware Diagnostics' }
    ],
    qrCodeData: 'https://smartcare.service/track/SC-2026-101'
  },
  {
    id: 'job-2',
    jobNumber: 'SC-2026-102',
    customerId: 'cust-2',
    customerName: 'Dr. Priya Menon',
    customerPhone: '+91 94471 22883',
    customerEmail: 'priya.menon@hospital.org',
    category: 'mobile',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro Max (Titanium Blue)',
    serialOrImei: '354890119283471',
    passcodePattern: '882200',
    issueDescription: 'Dropped on hospital marble tile. Display broken with purple vertical line, face ID working.',
    technicianNotes: 'Original OLED replacement needed with TrueTone reprogramming from original EEPROM.',
    physicalCondition: 'Front glass shattered, rear glass intact, titanium bezel scuffed top right.',
    priority: 'high',
    status: 'in_repair',
    estimatedCost: 24500,
    advancePaid: 10000,
    assignedTechnicianId: 'usr-2',
    assignedTechnicianName: 'Anandhu K',
    receivedDate: '2026-09-23 09:00',
    dueDate: '2026-09-23 18:30',
    photos: [
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        type: 'before',
        caption: 'Cracked front panel with vertical LCD bleed',
        driveFileId: 'DRIVE_IMG_IPH_102',
        uploadedAt: '2026-09-23 09:05'
      }
    ],
    partsUsed: [
      {
        partId: 'part-2',
        partName: 'iPhone 15 Pro Max Super Retina XDR OLED Screen',
        partNumber: 'IPH-15PM-OLED-OG',
        quantity: 1,
        unitPrice: 24500,
        warrantyMonths: 12
      }
    ],
    statusHistory: [
      { status: 'received', changedAt: '2026-09-23 09:00', changedBy: 'Fathima Zeenath', note: 'Customer in clinic rush' },
      { status: 'diagnosing', changedAt: '2026-09-23 09:30', changedBy: 'Anandhu K', note: 'TrueTone data dumped successfully' },
      { status: 'in_repair', changedAt: '2026-09-23 10:45', changedBy: 'Anandhu K', note: 'Installing new OLED panel' }
    ],
    qrCodeData: 'https://smartcare.service/track/SC-2026-102'
  },
  {
    id: 'job-3',
    jobNumber: 'SC-2026-103',
    customerId: 'cust-3',
    customerName: 'Muhammed Nihal',
    customerPhone: '+91 97466 33901',
    customerEmail: 'nihal.tech@craftstudio.in',
    category: 'laptop',
    deviceBrand: 'Dell',
    deviceModel: 'XPS 15 9520 Core i9 32GB RAM',
    serialOrImei: '9XJK0039A',
    issueDescription: 'Heavy thermal throttling during 4K video renders. Loud rattling noise from left exhaust fan.',
    technicianNotes: 'Dual fans replaced. High-performance Thermal Grizzly paste applied. CPU temp dropped 22°C under Cinebench test.',
    physicalCondition: 'Good condition, studio stickers on lid.',
    priority: 'normal',
    status: 'ready',
    estimatedCost: 4800,
    advancePaid: 2000,
    finalCost: 4800,
    assignedTechnicianId: 'usr-3',
    assignedTechnicianName: 'Rahul Raj',
    receivedDate: '2026-09-21 16:30',
    dueDate: '2026-09-23 12:00',
    photos: [
      {
        id: 'p-4',
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
        type: 'after',
        caption: 'New heatsink module installed & stress test passed',
        driveFileId: 'DRIVE_IMG_DELL_103',
        uploadedAt: '2026-09-23 11:15'
      }
    ],
    partsUsed: [
      {
        partId: 'part-3',
        partName: 'Dell XPS 15 9520 Dual Cooling Fan Set',
        partNumber: 'FAN-XPS-9520-SET',
        quantity: 1,
        unitPrice: 3400,
        warrantyMonths: 6
      },
      {
        partId: 'part-5',
        partName: 'Thermal Grizzly Kryonaut Extreme Thermal Paste 2g',
        partNumber: 'TG-KRYO-EXT-2G',
        quantity: 1,
        unitPrice: 1400,
        warrantyMonths: 3
      }
    ],
    statusHistory: [
      { status: 'received', changedAt: '2026-09-21 16:30', changedBy: 'Fathima Zeenath' },
      { status: 'in_repair', changedAt: '2026-09-22 11:00', changedBy: 'Rahul Raj' },
      { status: 'testing', changedAt: '2026-09-22 17:30', changedBy: 'Rahul Raj' },
      { status: 'ready', changedAt: '2026-09-23 11:00', changedBy: 'Rahul Raj', note: 'SMS & WhatsApp alert sent to customer' }
    ],
    qrCodeData: 'https://smartcare.service/track/SC-2026-103'
  },
  {
    id: 'job-4',
    jobNumber: 'SC-2026-104',
    customerId: 'cust-4',
    customerName: 'Sneha Haridas',
    customerPhone: '+91 99951 88472',
    category: 'tablet',
    deviceBrand: 'Apple',
    deviceModel: 'iPad Air 5th Gen (M1 - 64GB)',
    serialOrImei: 'DMPQ9803120X',
    issueDescription: 'Ghost touch along left side after drop. Apple Pencil not writing smoothly.',
    technicianNotes: 'Waiting for fresh batch of iPad Air digitizers arriving from Kochi vendor this afternoon.',
    physicalCondition: 'Corner ding on aluminum housing near volume rocker.',
    priority: 'normal',
    status: 'waiting_parts',
    estimatedCost: 8200,
    advancePaid: 3000,
    assignedTechnicianId: 'usr-2',
    assignedTechnicianName: 'Anandhu K',
    receivedDate: '2026-09-23 08:30',
    dueDate: '2026-09-25 18:00',
    photos: [],
    partsUsed: [],
    statusHistory: [
      { status: 'received', changedAt: '2026-09-23 08:30', changedBy: 'Fathima Zeenath' },
      { status: 'diagnosing', changedAt: '2026-09-23 09:45', changedBy: 'Anandhu K' },
      { status: 'waiting_parts', changedAt: '2026-09-23 10:15', changedBy: 'Anandhu K', note: 'Part SKU IPAD-AIR5-DIGI requested' }
    ],
    qrCodeData: 'https://smartcare.service/track/SC-2026-104'
  },
  {
    id: 'job-5',
    jobNumber: 'SC-2026-105',
    customerId: 'cust-1',
    customerName: 'Arjun Varma',
    customerPhone: '+91 98460 77112',
    category: 'electronics',
    deviceBrand: 'Sony',
    deviceModel: 'WH-1000XM5 Noise Canceling Headphones',
    serialOrImei: 'SN-WH5-9921',
    issueDescription: 'Right earbud no sound and swivel hinge loosened.',
    technicianNotes: 'Replaced right audio driver flex cable and tightened tension spring. Tested ANC audio balance.',
    physicalCondition: 'Earcups leather slightly worn, electronics tested intact.',
    priority: 'low',
    status: 'delivered',
    estimatedCost: 2600,
    advancePaid: 2600,
    finalCost: 2600,
    assignedTechnicianId: 'usr-3',
    assignedTechnicianName: 'Rahul Raj',
    receivedDate: '2026-09-18 11:00',
    dueDate: '2026-09-20 16:00',
    completedDate: '2026-09-20 14:00',
    deliveredDate: '2026-09-20 18:30',
    photos: [],
    partsUsed: [],
    statusHistory: [
      { status: 'received', changedAt: '2026-09-18 11:00', changedBy: 'Fathima Zeenath' },
      { status: 'ready', changedAt: '2026-09-20 14:00', changedBy: 'Rahul Raj' },
      { status: 'delivered', changedAt: '2026-09-20 18:30', changedBy: 'Fathima Zeenath', note: 'Customer satisfied, paid in full' }
    ],
    qrCodeData: 'https://smartcare.service/track/SC-2026-105'
  }
];

export const initialTechnicianLedger: TechnicianSpareLedgerItem[] = [
  {
    id: 'led-1',
    technicianId: 'usr-2',
    technicianName: 'Anandhu K',
    partId: 'part-2',
    partName: 'iPhone 15 Pro Max Super Retina XDR OLED Screen',
    partNumber: 'IPH-15PM-OLED-OG',
    quantity: 1,
    jobId: 'job-2',
    jobNumber: 'SC-2026-102',
    issuedDate: '2026-09-23 09:35',
    status: 'in_use',
    notes: 'Issued for Job SC-2026-102 screen replacement',
    handoverSignature: 'Anandhu K (Digital Verification)',
    handoverOfficer: 'Rajesh Nair'
  },
  {
    id: 'led-2',
    technicianId: 'usr-3',
    technicianName: 'Rahul Raj',
    partId: 'part-3',
    partName: 'Dell XPS 15 9520 Dual Cooling Fan Set',
    partNumber: 'FAN-XPS-9520-SET',
    quantity: 1,
    jobId: 'job-3',
    jobNumber: 'SC-2026-103',
    issuedDate: '2026-09-22 10:00',
    status: 'in_use',
    notes: 'Fitted and tested on XPS 15',
    handoverSignature: 'Rahul Raj (Digital Verification)',
    handoverOfficer: 'Rajesh Nair'
  },
  {
    id: 'led-3',
    technicianId: 'usr-2',
    technicianName: 'Anandhu K',
    partId: 'part-1',
    partName: 'MacBook Pro 14" M1/M2 Display Assembly (Space Gray)',
    partNumber: 'MBP-DISP-14-SG',
    quantity: 1,
    issuedDate: '2026-09-19 14:00',
    status: 'returned',
    returnedDate: '2026-09-20 11:30',
    notes: 'Customer opted for external monitor setup; part returned back to Rack A-2 in sealed antistatic wrap',
    handoverSignature: 'Anandhu K / Rajesh N',
    handoverOfficer: 'Rajesh Nair'
  },
  {
    id: 'led-4',
    technicianId: 'usr-3',
    technicianName: 'Rahul Raj',
    partId: 'part-5',
    partName: 'Thermal Grizzly Kryonaut Extreme Thermal Paste 2g',
    partNumber: 'TG-KRYO-EXT-2G',
    quantity: 1,
    issuedDate: '2026-09-15 09:30',
    status: 'returned',
    returnedDate: '2026-09-16 16:00',
    notes: 'Partial tube consumed for GPU workstation service',
    handoverSignature: 'Rahul Raj',
    handoverOfficer: 'Rajesh Nair'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0841',
    jobId: 'job-3',
    jobNumber: 'SC-2026-103',
    customerId: 'cust-3',
    customerName: 'Muhammed Nihal',
    customerPhone: '+91 97466 33901',
    customerAddress: 'Marine Drive, Kochi, Kerala - 682031',
    customerGst: '32BNQPN9921K1ZZ',
    date: '2026-09-23',
    dueDate: '2026-09-23',
    items: [
      {
        description: 'Dell XPS 15 9520 Dual Cooling Fan Set',
        hsnSacCode: '847330',
        quantity: 1,
        unitPrice: 3400,
        taxRatePercent: 18,
        amount: 3400
      },
      {
        description: 'Heatsink Servicing & Thermal Grizzly Application',
        hsnSacCode: '998713',
        quantity: 1,
        unitPrice: 1400,
        taxRatePercent: 18,
        amount: 1400
      }
    ],
    subTotal: 4800,
    discount: 0,
    cgst: 432,
    sgst: 432,
    igst: 0,
    totalAmount: 5664,
    paidAmount: 2000,
    balanceDue: 3664,
    paymentMode: 'upi',
    paymentStatus: 'partial',
    driveFileId: 'DRIVE_INV_0841_PDF'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0840',
    jobId: 'job-5',
    jobNumber: 'SC-2026-105',
    customerId: 'cust-1',
    customerName: 'Arjun Varma',
    customerPhone: '+91 98460 77112',
    customerAddress: 'Near Fort Road, Kannur, Kerala - 670001',
    customerGst: '32AABCS1429B1ZB',
    date: '2026-09-20',
    dueDate: '2026-09-20',
    items: [
      {
        description: 'Sony WH-1000XM5 Audio Flex & Swivel Mechanism Overhaul',
        hsnSacCode: '998713',
        quantity: 1,
        unitPrice: 2600,
        taxRatePercent: 18,
        amount: 2600
      }
    ],
    subTotal: 2600,
    discount: 200,
    cgst: 216,
    sgst: 216,
    igst: 0,
    totalAmount: 2832,
    paidAmount: 2832,
    balanceDue: 0,
    paymentMode: 'upi',
    paymentStatus: 'paid',
    driveFileId: 'DRIVE_INV_0840_PDF'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    customerName: 'Sujith Kumar',
    customerPhone: '+91 98950 44119',
    deviceType: 'macbook',
    deviceModel: 'MacBook Air M1 2020',
    issue: 'Battery health warning "Service Recommended", shutting down at 30%',
    serviceType: 'express',
    appointmentDate: '2026-09-23',
    timeSlot: '02:30 PM',
    status: 'scheduled',
    assignedTechnician: 'Anandhu K',
    reminderSent: true
  },
  {
    id: 'apt-2',
    customerName: 'Ananya Ramesh',
    customerPhone: '+91 94002 91122',
    deviceType: 'laptop',
    deviceModel: 'ASUS ROG Zephyrus G14',
    issue: 'Blue screen error CRITICAL_PROCESS_DIED on startup',
    serviceType: 'pickup',
    pickupAddress: 'Apt 4B, Skyview Towers, South Beach Road, Kannur',
    appointmentDate: '2026-09-23',
    timeSlot: '04:00 PM',
    status: 'confirmed',
    assignedTechnician: 'Rahul Raj',
    reminderSent: true
  },
  {
    id: 'apt-3',
    customerName: 'Deepak Mohan',
    customerPhone: '+91 97471 00293',
    deviceType: 'mobile',
    deviceModel: 'OnePlus 12',
    issue: 'Green line issue on display after software update',
    serviceType: 'in_store',
    appointmentDate: '2026-09-24',
    timeSlot: '11:00 AM',
    status: 'scheduled',
    reminderSent: false
  }
];

export const initialFeedbacks: CustomerFeedback[] = [
  {
    id: 'fb-1',
    jobId: 'job-5',
    jobNumber: 'SC-2026-105',
    customerId: 'cust-1',
    customerName: 'Arjun Varma',
    deviceModel: 'Sony WH-1000XM5',
    rating: 5,
    comment: 'Exceptional service! Sony service center asked for a 3-week wait, but SmartCare fixed my headphone swivel and driver within 24 hours. Sound is crystal clear. 10/10!',
    date: '2026-09-20',
    sentiment: 'positive',
    routedToGoogle: true,
    googleReviewClicked: true,
    resolved: true
  },
  {
    id: 'fb-2',
    jobId: 'job-prev-89',
    jobNumber: 'SC-2026-089',
    customerId: 'cust-2',
    customerName: 'Dr. Priya Menon',
    deviceModel: 'MacBook Air M2',
    rating: 5,
    comment: 'Very professional handling by Rajesh and Anandhu. Genuine Apple display quality with TrueTone functioning. Cleaned the dust internally as complimentary service!',
    date: '2026-09-18',
    sentiment: 'positive',
    routedToGoogle: true,
    googleReviewClicked: true,
    resolved: true
  },
  {
    id: 'fb-3',
    jobId: 'job-prev-77',
    jobNumber: 'SC-2026-077',
    customerId: 'cust-4',
    customerName: 'Sneha Haridas',
    deviceModel: 'iPhone 13',
    rating: 3,
    comment: 'Repair was fine and phone is working well, but delivery was delayed by 2 hours beyond the promised 4 PM due to heavy rush.',
    date: '2026-09-15',
    sentiment: 'neutral',
    routedToGoogle: false, // Routed to admin only!
    googleReviewClicked: false,
    adminNotes: 'Addressed by Fathima: Provided ₹250 accessory credit voucher on next visit. Customer was appreciative.',
    resolved: true
  }
];

export const initialGoogleSyncConfig: GoogleSyncConfig = {
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  sheetName: 'SmartCare_Master_Database_2026',
  driveFolderId: '10yWq-xK89D_Z9yLm_SmartCareRoot',
  autoSyncInterval: 'hourly',
  lastSyncTimestamp: '2026-09-23 11:30 AM',
  syncStatus: 'success',
  isConnected: true,
  googleUserEmail: 'maccellstorekannur@gmail.com',
  backupTabs: [
    { name: 'Jobs', rowsCount: 5, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'Customers', rowsCount: 4, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'Invoices', rowsCount: 2, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'Inventory', rowsCount: 7, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'Technicians', rowsCount: 4, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'Feedback', rowsCount: 3, lastUpdated: '2026-09-23 11:30 AM' },
    { name: 'BackupLog', rowsCount: 14, lastUpdated: '2026-09-23 11:30 AM' }
  ]
};

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-23 11:30',
    user: 'System AutoSync',
    role: 'admin',
    action: 'Google Sheets Cloud Backup',
    details: 'Synced 7 tabs successfully to Google Sheet ID: 1BxiMVs0XRA5n...',
    entityType: 'google_sync'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-23 11:00',
    user: 'Rahul Raj',
    role: 'technician',
    action: 'Job Status Update',
    details: 'Job SC-2026-103 changed to Ready for Delivery',
    entityType: 'job'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-23 09:35',
    user: 'Rajesh Nair',
    role: 'admin',
    action: 'Technician Spare Issuance',
    details: 'Issued iPhone 15 Pro Max OLED screen to Anandhu K with e-verification',
    entityType: 'technician'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-23 09:00',
    user: 'Fathima Zeenath',
    role: 'receptionist',
    action: 'New Job Intake',
    details: 'Created job SC-2026-102 for Dr. Priya Menon (iPhone 15 Pro Max)',
    entityType: 'job'
  }
];
