import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { ServiceCategory, Priority, JobStatus } from '../../types';
import { 
  X, 
  Wrench, 
  User, 
  Smartphone, 
  Laptop, 
  DollarSign, 
  Calendar, 
  ShieldAlert, 
  Upload, 
  Camera, 
  Check, 
  Sparkles,
  Search,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const NewJobModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  initialData?: {
    customerName?: string;
    customerPhone?: string;
    deviceModel?: string;
    issue?: string;
  } | null;
}> = ({ isOpen, onClose, initialData }) => {
  const { 
    customers, 
    users, 
    createJob, 
    createCustomer, 
    language,
    performGoogleSearchDiagnosis,
    addToast
  } = useApp();
  const t = useI18n(language);

  // Form states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('new');
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [category, setCategory] = useState<ServiceCategory>('mobile');
  const [deviceBrand, setDeviceBrand] = useState('Apple');
  const [deviceModel, setDeviceModel] = useState(initialData?.deviceModel || '');
  const [serialOrImei, setSerialOrImei] = useState('');
  const [passcodePattern, setPasscodePattern] = useState('');
  const [issueDescription, setIssueDescription] = useState(initialData?.issue || '');
  const [physicalCondition, setPhysicalCondition] = useState('Normal wear and tear. Minor scratches.');
  const [priority, setPriority] = useState<Priority>('normal');
  const [estimatedCost, setEstimatedCost] = useState<number>(3500);
  const [advancePaid, setAdvancePaid] = useState<number>(1000);
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().substring(0, 10);
  });
  const [assignedTechnicianId, setAssignedTechnicianId] = useState<string>('usr-2');

  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [googleFindings, setGoogleFindings] = useState<string | null>(null);

  // Update when initialData changes
  React.useEffect(() => {
    if (initialData) {
      if (initialData.customerName) setCustomerName(initialData.customerName);
      if (initialData.customerPhone) setCustomerPhone(initialData.customerPhone);
      if (initialData.deviceModel) {
        setDeviceModel(initialData.deviceModel);
        if (initialData.deviceModel.toLowerCase().includes('macbook')) {
          setCategory('macbook');
          setDeviceBrand('Apple');
        } else if (initialData.deviceModel.toLowerCase().includes('iphone')) {
          setCategory('mobile');
          setDeviceBrand('Apple');
        } else if (initialData.deviceModel.toLowerCase().includes('samsung')) {
          setCategory('mobile');
          setDeviceBrand('Samsung');
        } else if (initialData.deviceModel.toLowerCase().includes('dell') || initialData.deviceModel.toLowerCase().includes('lenovo') || initialData.deviceModel.toLowerCase().includes('hp')) {
          setCategory('laptop');
        }
      }
      if (initialData.issue) setIssueDescription(initialData.issue);
    }
  }, [initialData, isOpen]);

  const handleQuickGoogleSearch = async () => {
    if (!deviceModel || !issueDescription) {
      addToast('Enter model and issue to search Google for diagnostics', 'warning');
      return;
    }
    setIsSearchingGoogle(true);
    try {
      const res = await performGoogleSearchDiagnosis({
        customerName,
        customerPhone,
        deviceModel,
        issue: issueDescription,
        category
      });
      setGoogleFindings(res.diagnosis);
      addToast('Google Search diagnosis retrieved and attached!', 'success');
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  if (!isOpen) return null;

  const handleCustomerSelect = (id: string) => {
    setSelectedCustomerId(id);
    if (id !== 'new') {
      const existing = customers.find(c => c.id === id);
      if (existing) {
        setCustomerName(existing.name);
        setCustomerPhone(existing.phone);
        setCustomerEmail(existing.email);
        setCustomerAddress(existing.address);
      }
    } else {
      setCustomerName('');
      setCustomerPhone('+91 ');
      setCustomerEmail('');
      setCustomerAddress('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCustId = selectedCustomerId;

    // If new customer, create in customer registry
    if (selectedCustomerId === 'new') {
      const newCust = createCustomer({
        name: customerName || 'Walk-in Client',
        phone: customerPhone || '+91 99999 00000',
        email: customerEmail || 'client@example.com',
        address: customerAddress || 'Kannur, Kerala'
      });
      targetCustId = newCust.id;
    }

    const assignedTech = users.find(u => u.id === assignedTechnicianId);

    createJob({
      customerId: targetCustId,
      customerName: customerName || 'Walk-in Client',
      customerPhone: customerPhone || '+91 99999 00000',
      customerEmail: customerEmail,
      category,
      deviceBrand: deviceBrand || 'Generic',
      deviceModel: deviceModel || 'Device',
      serialOrImei: serialOrImei || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      passcodePattern,
      issueDescription: issueDescription || 'General servicing & diagnostics',
      physicalCondition,
      priority,
      status: 'received',
      estimatedCost: Number(estimatedCost) || 0,
      advancePaid: Number(advancePaid) || 0,
      dueDate,
      assignedTechnicianId,
      assignedTechnicianName: assignedTech?.name
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('createNewJob')}
              </h2>
              <p className="text-xs text-slate-500">
                Generate intake ticket, barcode label and customer acknowledgment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Customer Details */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>1. Customer Profile</span>
              </h3>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-blue-600 dark:text-blue-400"
              >
                <option value="new">+ Add New Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Arjun Varma"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (for WhatsApp / SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98460 77112"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Address & City
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Fort Road, Kannur, Kerala"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Device Details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Smartphone className="w-3.5 h-3.5 text-purple-500" />
              <span>2. Device Specification & Inspection</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="mobile">Mobile Phone</option>
                  <option value="macbook">MacBook & iMac</option>
                  <option value="laptop">Windows Laptop</option>
                  <option value="tablet">iPad / Tablet</option>
                  <option value="software">Software & Recovery</option>
                  <option value="accessories">Accessories</option>
                  <option value="electronics">Other Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={deviceBrand}
                  onChange={(e) => setDeviceBrand(e.target.value)}
                  placeholder="e.g. Apple, Dell, Lenovo, Sony"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model / Variant *
                </label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max / MacBook Pro M2"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Serial Number or IMEI *
                </label>
                <input
                  type="text"
                  required
                  value={serialOrImei}
                  onChange={(e) => setSerialOrImei(e.target.value)}
                  placeholder="15-digit IMEI or Apple Serial"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Screen Passcode / PIN / Pattern
                </label>
                <input
                  type="text"
                  value={passcodePattern}
                  onChange={(e) => setPasscodePattern(e.target.value)}
                  placeholder="e.g. 123456 or Pattern L-shape"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Priority (Express Fee)</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Issue Reported by Customer *
                </label>
                <button
                  type="button"
                  onClick={handleQuickGoogleSearch}
                  disabled={isSearchingGoogle || !deviceModel}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-[10px] font-bold transition disabled:opacity-50"
                  title="Query Google Search for device root causes and repair pricing"
                >
                  {isSearchingGoogle ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Search className="w-3 h-3 text-indigo-600" />
                  )}
                  <span>Google Search Diagnostics</span>
                </button>
              </div>
              <textarea
                required
                rows={2}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe screen flickers, liquid spill, battery backup drop, no boot, etc."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />

              {googleFindings && (
                <div className="mt-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
                  <div className="flex items-center justify-between mb-1 font-bold text-blue-700 dark:text-blue-300 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Google Search Grounded Diagnostic Findings</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setGoogleFindings(null)}
                      className="text-slate-400 hover:text-slate-600 text-[10px]"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-200 whitespace-pre-line line-clamp-4">
                    {googleFindings}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Physical Inspection (Scratches / Dents / Liquid Contact Indicator)
              </label>
              <input
                type="text"
                value={physicalCondition}
                onChange={(e) => setPhysicalCondition(e.target.value)}
                placeholder="Inspect glass, bezels, screws and water indicator tape"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Section 3: Financials & Assignment */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Financial Estimate & Technician Assignment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Advance Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold font-mono text-emerald-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Technician
                </label>
                <select
                  value={assignedTechnicianId}
                  onChange={(e) => setAssignedTechnicianId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {users.filter(u => u.role === 'technician' || u.role === 'admin').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs font-bold text-white shadow-lg shadow-blue-500/25 active:scale-95 transition"
            >
              <Check className="w-4 h-4" />
              <span>Create Job Card & Generate Barcode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
