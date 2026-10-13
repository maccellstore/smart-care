import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n, getStatusColor } from '../../i18n/translations';
import { Job, CustomerCallLog, PaymentMode } from '../../types';
import { 
  PhoneCall, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter, 
  Wrench, 
  Send, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Check,
  X,
  CreditCard,
  Truck
} from 'lucide-react';

export const ReceptionistDeskView: React.FC<{
  onSelectJob?: (job: Job) => void;
  onPrintJob?: (job: Job) => void;
}> = ({ onSelectJob, onPrintJob }) => {
  const { 
    jobs, 
    callLogs, 
    addCallLog, 
    deliverJob, 
    currentUser, 
    language,
    addToast,
    setActiveTab
  } = useApp();
  const t = useI18n(language);

  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'delivered' | 'pending_call'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedJobForCall, setSelectedJobForCall] = useState<Job | null>(null);
  const [selectedJobForDelivery, setSelectedJobForDelivery] = useState<Job | null>(null);

  // Call Log form state
  const [callOutcome, setCallOutcome] = useState<CustomerCallLog['callOutcome']>('confirmed_pickup');
  const [callNotes, setCallNotes] = useState('');
  const [expectedPickupDate, setExpectedPickupDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // Handover form state
  const [collectedAmount, setCollectedAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [deliveryNotes, setDeliveryNotes] = useState('Collected by customer in person. Device tested and working.');

  // Finished jobs: ready for pickup or delivered
  const finishedJobs = jobs.filter(j => j.status === 'ready' || j.status === 'delivered');

  // Filter logic
  const filteredJobs = finishedJobs.filter(job => {
    // Sub-filter
    if (activeFilter === 'ready' && job.status !== 'ready') return false;
    if (activeFilter === 'delivered' && job.status !== 'delivered') return false;
    if (activeFilter === 'pending_call') {
      if (job.status !== 'ready') return false;
      const hasRecentCall = callLogs.some(c => c.jobId === job.id && (c.callOutcome === 'confirmed_pickup' || c.callOutcome === 'paid_online'));
      if (hasRecentCall) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        job.jobNumber.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.customerPhone.includes(q) ||
        job.deviceModel.toLowerCase().includes(q) ||
        job.deviceBrand.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Metrics
  const readyCount = jobs.filter(j => j.status === 'ready').length;
  const deliveredCount = jobs.filter(j => j.status === 'delivered').length;
  const totalBalanceToCollect = jobs
    .filter(j => j.status === 'ready')
    .reduce((sum, j) => sum + Math.max(0, (j.finalCost || j.estimatedCost) - j.advancePaid), 0);
  const callsTodayCount = callLogs.filter(c => {
    const today = new Date().toISOString().substring(0, 10);
    return c.date === today;
  }).length;

  const handleOpenCallModal = (job: Job) => {
    setSelectedJobForCall(job);
    setCallOutcome('confirmed_pickup');
    setCallNotes(`Spoke with ${job.customerName}. Informed repair is completed. Balance payable: ₹${Math.max(0, (job.finalCost || job.estimatedCost) - job.advancePaid)}.`);
  };

  const handleSaveCallLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForCall) return;

    addCallLog({
      jobId: selectedJobForCall.id,
      jobNumber: selectedJobForCall.jobNumber,
      customerId: selectedJobForCall.customerId,
      customerName: selectedJobForCall.customerName,
      customerPhone: selectedJobForCall.customerPhone,
      deviceModel: `${selectedJobForCall.deviceBrand} ${selectedJobForCall.deviceModel}`,
      callOutcome,
      notes: callNotes || 'Customer notified of finished work.',
      receptionistName: currentUser.name || 'Reception Staff',
      expectedPickupDate: callOutcome === 'confirmed_pickup' ? expectedPickupDate : undefined
    });

    setSelectedJobForCall(null);
  };

  const handleOpenDeliveryModal = (job: Job) => {
    setSelectedJobForDelivery(job);
    const balance = Math.max(0, (job.finalCost || job.estimatedCost) - job.advancePaid);
    setCollectedAmount(balance);
    setPaymentMode('upi');
    setDeliveryNotes(`Handed over ${job.deviceBrand} ${job.deviceModel} to ${job.customerName}. Complete demo given.`);
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForDelivery) return;

    deliverJob(selectedJobForDelivery.id, Number(collectedAmount), paymentMode, deliveryNotes);
    setSelectedJobForDelivery(null);
  };

  const generateWhatsAppMessage = (job: Job) => {
    const balance = Math.max(0, (job.finalCost || job.estimatedCost) - job.advancePaid);
    const text = language === 'ml'
      ? `പ്രിയ ${job.customerName}, സ്മാർട്ട്കെയർ സർവീസ് സെന്ററിൽ നൽകിയ താങ്കളുടെ ${job.deviceBrand} ${job.deviceModel} (ജോബ് #${job.jobNumber}) റിപ്പയർ പൂർത്തിയായി റെഡിയായിരിക്കുന്നു. ആകെ ബിൽ: ₹${job.finalCost || job.estimatedCost}, അടയ്ക്കാനുള്ള ബാലൻസ്: ₹${balance}. ഇന്ന് വൈകിട്ട് 8 മണിക്ക് മുൻപായി കൗണ്ടറിൽ നിന്ന് കൈപ്പറ്റാവുന്നതാണ്. ലൊക്കേഷൻ: സ്മാർട്ട്കെയർ, കണ്ണൂർ. ഫോൺ: +91 98470 12345.`
      : `Dear ${job.customerName}, your ${job.deviceBrand} ${job.deviceModel} (Job #${job.jobNumber}) repair is completed and tested at SmartCare Service Center. Total: ₹${job.finalCost || job.estimatedCost}, Balance to Pay: ₹${balance}. You can collect your device today between 9:30 AM - 8:00 PM. SmartCare Kannur. Call: +91 98470 12345.`;

    const cleanPhone = job.customerPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    // Auto record WhatsApp sent call log
    addCallLog({
      jobId: job.id,
      jobNumber: job.jobNumber,
      customerId: job.customerId,
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      deviceModel: `${job.deviceBrand} ${job.deviceModel}`,
      callOutcome: 'ready_notified',
      notes: `Sent WhatsApp ready-for-pickup alert. Balance pending: ₹${balance}.`,
      receptionistName: currentUser.name || 'Reception Desk'
    });
  };

  const getOutcomeBadge = (outcome: CustomerCallLog['callOutcome']) => {
    switch (outcome) {
      case 'confirmed_pickup':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Confirmed Pickup</span>;
      case 'requested_delivery':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Home Courier Delivery</span>;
      case 'paid_online':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">Paid Online (UPI)</span>;
      case 'callback_requested':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Callback Requested</span>;
      case 'no_answer':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">No Answer / Busy</span>;
      case 'asked_discount':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Billing Query</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Notified</span>;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Reception Desk & Customer Handover
              </h1>
              <p className="text-xs text-slate-500">
                Daily finished repairs, customer telephone communications, collection follow-ups & counter release
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('billing')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-emerald-500" />
            <span>Counter Invoicing</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter('ready')}
          className={`p-4 rounded-3xl border transition cursor-pointer ${
            activeFilter === 'ready' 
              ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-950/60 dark:border-emerald-500' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ready on Shelf</span>
            <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {readyCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting customer collection</p>
        </div>

        <div 
          onClick={() => setActiveFilter('pending_call')}
          className={`p-4 rounded-3xl border transition cursor-pointer ${
            activeFilter === 'pending_call' 
              ? 'bg-amber-50 border-amber-500 dark:bg-amber-950/60 dark:border-amber-500' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Calls Pending</span>
            <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {jobs.filter(j => j.status === 'ready' && !callLogs.some(c => c.jobId === j.id && c.callOutcome === 'confirmed_pickup')).length}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Need pickup confirmation</p>
        </div>

        <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dues to Collect</span>
            <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 truncate">
            ₹{totalBalanceToCollect.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">From ready devices</p>
        </div>

        <div 
          onClick={() => setActiveFilter('delivered')}
          className={`p-4 rounded-3xl border transition cursor-pointer ${
            activeFilter === 'delivered' 
              ? 'bg-purple-50 border-purple-500 dark:bg-purple-950/60 dark:border-purple-500' 
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivered & Handed</span>
            <div className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
            {deliveredCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{callsTodayCount} customer talks logged</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Finished Work ({finishedJobs.length})
          </button>

          <button
            onClick={() => setActiveFilter('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === 'ready'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Ready on Pickup Shelf ({readyCount})
          </button>

          <button
            onClick={() => setActiveFilter('pending_call')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === 'pending_call'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Needs Customer Call
          </button>

          <button
            onClick={() => setActiveFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFilter === 'delivered'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job #, customer, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Main List: Daily Finished Work Orders */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const statusConfig = getStatusColor(job.status);
            const totalCost = job.finalCost || job.estimatedCost;
            const balance = Math.max(0, totalCost - job.advancePaid);
            const isReady = job.status === 'ready';

            // Find latest call log for this job
            const latestCall = callLogs.find(c => c.jobId === job.id);

            return (
              <div
                key={job.id}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header row: Device & Customer info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${
                      isReady 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200 dark:border-purple-800'
                    }`}>
                      <Wrench className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm sm:text-base font-black text-blue-600 dark:text-blue-400">
                          {job.jobNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusConfig.badgeClass}`}>
                          {t(`status_${job.status}`)}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                          {job.category}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {job.deviceBrand} {job.deviceModel}
                      </h3>
                    </div>
                  </div>

                  {/* Customer Quick Contacts */}
                  <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{job.customerName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {job.customerPhone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle row: Work done, parts used, financial dues */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Finished Work Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Repairs Done by Technician
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {job.technicianNotes || job.issueDescription}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <span>Assigned Tech:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{job.assignedTechnicianName}</strong>
                    </div>
                  </div>

                  {/* Spares Installed & Warranty */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Parts Replaced & Warranty
                    </span>
                    {job.partsUsed.length > 0 ? (
                      <ul className="space-y-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                        {job.partsUsed.map((p, idx) => (
                          <li key={idx} className="flex items-center gap-1 font-mono">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{p.partName} (x{p.quantity})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No external spares billed (logic board repair)</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>90-Day Warranty Protected</span>
                    </span>
                  </div>

                  {/* Payment Details */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/40 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Repair Cost:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">₹{totalCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Advance Paid:</span>
                      <span className="font-mono text-emerald-600 font-semibold">₹{job.advancePaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Balance to Collect:</span>
                      <span className={`font-mono font-extrabold text-sm ${balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
                        ₹{balance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Latest Customer Talk Outcome / Note */}
                {latestCall && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-slate-500">Latest Customer Talk:</span>
                      {getOutcomeBadge(latestCall.callOutcome)}
                      <span className="text-slate-700 dark:text-slate-300 text-[11px] italic">
                        "{latestCall.notes}"
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {latestCall.date} {latestCall.time} by {latestCall.receptionistName}
                    </span>
                  </div>
                )}

                {/* Action Toolbar for Receptionist */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct Telephone Call Button */}
                    <a
                      href={`tel:${job.customerPhone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                      title="Direct phone call to customer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Customer</span>
                    </a>

                    {/* WhatsApp Ready Notification Button */}
                    <button
                      onClick={() => generateWhatsAppMessage(job)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                      title="Send pre-filled WhatsApp completion notice"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Ready Alert</span>
                    </button>

                    {/* Log Talk / Call Notes Button */}
                    <button
                      onClick={() => handleOpenCallModal(job)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/60 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-pink-800 transition"
                      title="Record notes from conversation with customer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-pink-600" />
                      <span>Log Talk Details</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Handover & Release Button (for ready devices) */}
                    {isReady && (
                      <button
                        onClick={() => handleOpenDeliveryModal(job)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 active:scale-95 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Counter Handover & Release</span>
                      </button>
                    )}

                    {job.status === 'delivered' && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Handover Completed</span>
                      </span>
                    )}

                    {onPrintJob && (
                      <button
                        onClick={() => onPrintJob(job)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 text-xs"
                        title="Print Gate Pass / Handover Receipt"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
            <PhoneCall className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Finished Repair Orders Matching Criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Devices marked "Ready" by bench technicians will automatically appear here for customer calling and counter delivery.
            </p>
          </div>
        )}
      </div>

      {/* Customer Call & Talk Logging Modal */}
      {selectedJobForCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Talk with Customer Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record telephone notes for {selectedJobForCall.jobNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForCall(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details Pill */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {selectedJobForCall.customerName}
                </span>
                <span className="font-mono text-slate-500">
                  {selectedJobForCall.customerPhone}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Balance Payable</span>
                <span className="font-mono font-bold text-rose-600">
                  ₹{Math.max(0, (selectedJobForCall.finalCost || selectedJobForCall.estimatedCost) - selectedJobForCall.advancePaid)}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveCallLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Call Outcome / Customer Response *
                </label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-pink-500"
                >
                  <option value="confirmed_pickup">Confirmed Pickup Today / Tomorrow</option>
                  <option value="requested_delivery">Requested Courier / Home Delivery</option>
                  <option value="paid_online">Customer Paid Online via UPI / NetBanking</option>
                  <option value="ready_notified">Sent WhatsApp Notification & Bill Slip</option>
                  <option value="callback_requested">Customer Busy - Requested Callback Later</option>
                  <option value="no_answer">No Answer / Phone Switched Off</option>
                  <option value="asked_discount">Billing Query / Discussion on Final Cost</option>
                </select>
              </div>

              {callOutcome === 'confirmed_pickup' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Pickup Date
                  </label>
                  <input
                    type="date"
                    value={expectedPickupDate}
                    onChange={(e) => setExpectedPickupDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Receptionist Discussion Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Detail conversation: e.g. Customer happy with quick repair, informed about 3 months warranty, will pick up in evening."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJobForCall(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md transition"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover & Counter Release Modal */}
      {selectedJobForDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Counter Handover & Delivery Release
                  </h3>
                  <p className="text-xs text-slate-500">
                    Release {selectedJobForDelivery.deviceBrand} {selectedJobForDelivery.deviceModel} (Job #{selectedJobForDelivery.jobNumber})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJobForDelivery(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Customer</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedJobForDelivery.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Service Charge</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹{selectedJobForDelivery.finalCost || selectedJobForDelivery.estimatedCost}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Balance Payment Collected Now (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="cash">Cash Counter</option>
                  <option value="card">Debit / Credit Card POS</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery & Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJobForDelivery(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition"
                >
                  Confirm Release & Mark Delivered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Communication & Call Log History Section */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-pink-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Conversation & Call History
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {callLogs.length} total logged calls
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {callLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {log.jobNumber}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {log.customerName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({log.customerPhone})
                  </span>
                  {getOutcomeBadge(log.callOutcome)}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {log.notes}
                </p>
                {log.expectedPickupDate && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <Calendar className="w-3 h-3" />
                    <span>Expected Handover: {log.expectedPickupDate}</span>
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-400 sm:text-right shrink-0">
                <div className="font-mono font-bold">{log.date} • {log.time}</div>
                <div>By: {log.receptionistName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
