import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n, getStatusColor } from '../../i18n/translations';
import { Job, JobStatus } from '../../types';
import { GoogleSearchAssistant } from '../common/GoogleSearchAssistant';
import { 
  Search, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  MessageSquare, 
  Camera, 
  Sparkles, 
  Wrench,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const CustomerPortalView: React.FC<{
  initialJobNumber?: string;
  onOpenNewJob?: () => void;
  onPreloadJob?: (data: { customerName?: string; customerPhone?: string; deviceModel?: string; issue?: string }) => void;
}> = ({ initialJobNumber = 'SC-2026-101', onOpenNewJob, onPreloadJob }) => {
  const { jobs, language, submitCustomerFeedback, addToast } = useApp();
  const t = useI18n(language);

  const [activeSubTab, setActiveSubTab] = useState<'search' | 'track'>('search');
  const [searchVal, setSearchVal] = useState(initialJobNumber);
  const [activeJob, setActiveJob] = useState<Job | null>(() => {
    return jobs.find(j => j.jobNumber.toLowerCase() === initialJobNumber.toLowerCase()) || jobs[0] || null;
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchVal.trim().toLowerCase();
    const found = jobs.find(j => 
      j.jobNumber.toLowerCase() === query || 
      j.customerPhone.includes(query) ||
      j.serialOrImei.toLowerCase() === query
    );
    setActiveJob(found || null);
    setSubmittedFeedback(false);
  };

  const steps: { key: JobStatus; label: string; desc: string }[] = [
    { key: 'received', label: 'Received', desc: 'Device accepted at desk & tagged with barcode' },
    { key: 'diagnosing', label: 'Diagnosing', desc: 'Diagnostic voltage & bench test in progress' },
    { key: 'waiting_parts', label: 'Waiting for Parts', desc: 'Awaiting OEM replacement part dispatch' },
    { key: 'in_repair', label: 'In Repair', desc: 'Hardware repair & soldering on bench' },
    { key: 'testing', label: 'Testing', desc: 'Quality inspection & benchmark tests' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'Repaired & packed for handover' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over to customer with warranty' }
  ];

  const currentStepIdx = activeJob ? steps.findIndex(s => s.key === activeJob.status) : -1;
  const statusColors = activeJob ? getStatusColor(activeJob.status) : null;
  const balance = activeJob ? (activeJob.finalCost || activeJob.estimatedCost) - activeJob.advancePaid : 0;

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;

    submitCustomerFeedback({
      jobId: activeJob.id,
      jobNumber: activeJob.jobNumber,
      customerId: activeJob.customerId,
      customerName: activeJob.customerName,
      deviceModel: `${activeJob.deviceBrand} ${activeJob.deviceModel}`,
      rating,
      comment: comment || 'Device working great, prompt service!'
    });

    setSubmittedFeedback(true);
  };

  const handleJobRequestedFromSearch = (data: { customerName: string; customerPhone: string; deviceModel: string; issue: string }) => {
    if (onPreloadJob) {
      onPreloadJob(data);
    }
    if (onOpenNewJob) {
      onOpenNewJob();
    } else {
      addToast(`Repair inquiry received for ${data.deviceModel}. Work order initiated!`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('search')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'search'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Search Diagnosis & Recalls</span>
        </button>

        <button
          onClick={() => setActiveSubTab('track')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'track'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-purple-600" />
          <span>Track Active Job Ticket</span>
        </button>
      </div>

      {/* Mode 1: Google Search Grounded Diagnosis & Recall Finder */}
      {activeSubTab === 'search' && (
        <div className="space-y-6 animate-fade-in">
          <GoogleSearchAssistant
            onJobCardRequested={handleJobRequestedFromSearch}
          />
        </div>
      )}

      {/* Mode 2: Order Tracker */}
      {activeSubTab === 'track' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
              <Smartphone className="w-3.5 h-3.5" />
              <span>SmartCare Client Repair Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Track Your Device Repair Live
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-lg mx-auto">
              Enter your Job Card Number (e.g. <span className="font-mono font-bold text-white underline cursor-pointer" onClick={() => { setSearchVal('SC-2026-101'); }}>SC-2026-101</span> or <span className="font-mono font-bold text-white underline cursor-pointer" onClick={() => { setSearchVal('SC-2026-102'); }}>SC-2026-102</span>) or Phone Number
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex gap-2">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="e.g. SC-2026-101 or 98470"
                className="flex-1 rounded-2xl bg-white text-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold shadow-inner focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95"
              >
                Track
              </button>
            </form>
          </div>

          {activeJob ? (
            <div className="space-y-6 animate-fade-in">
              {/* Main Status Dossier */}
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                        {activeJob.jobNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors?.badgeClass}`}>
                        {t(`status_${activeJob.status}`)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {activeJob.deviceBrand} {activeJob.deviceModel}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      Serial / IMEI: {activeJob.serialOrImei}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/919847012345?text=Hi%20SmartCare,%20checking%20status%20for%20Job%20${activeJob.jobNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Technician</span>
                    </a>
                  </div>
                </div>

                {/* Visual Step Progress Tracker */}
                <div className="py-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                    Live Repair Progress
                  </h3>

                  <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-7 gap-2">
                    <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

                    {steps.map((st, idx) => {
                      const isCompleted = currentStepIdx > idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={st.key} className="relative z-10 flex sm:flex-col items-start sm:items-center text-left sm:text-center pb-6 sm:pb-0 gap-3 sm:gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900 scale-110 animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div>
                            <div className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-blue-600 dark:text-blue-400'
                                : isCompleted
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400'
                            }`}>
                              {st.label}
                            </div>
                            <div className="text-[10px] text-slate-500 hidden sm:block max-w-[100px] mx-auto mt-0.5">
                              {st.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Financial Summary & Delivery Target */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Repair Charge:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                      ₹{(activeJob.finalCost || activeJob.estimatedCost).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">Advance Paid: ₹{activeJob.advancePaid}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Balance Payable on Delivery:</span>
                    <span className={`font-mono font-bold text-base ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{balance.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Pay via GooglePay / Cash</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Handover Date:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {activeJob.dueDate}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block">Priority: {activeJob.priority.toUpperCase()}</span>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Issue Reported
                  </span>
                  <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {activeJob.issueDescription}
                  </p>
                </div>

                {/* Photos Before / After */}
                {activeJob.photos.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Inspection & Repair Photos ({activeJob.photos.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeJob.photos.map(p => (
                        <div key={p.id} className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800">
                          <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-xs">
                            {p.type.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Form for Delivered / Ready Jobs */}
              {(activeJob.status === 'ready' || activeJob.status === 'delivered') && (
                <div className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 shadow-xs">
                  {!submittedFeedback ? (
                    <form onSubmit={handleSubmitRating} className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          Leave a Verified Review for this Repair
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Your feedback helps us maintain the highest standard of repair quality in Kerala.
                      </p>

                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setRating(s)}
                            className="text-2xl transition hover:scale-125"
                          >
                            <span className={s <= rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}>
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-600 ml-2">
                          {rating} of 5 Stars
                        </span>
                      </div>

                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience (e.g. quick turnaround, courteous technician)..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition"
                        >
                          Post Feedback
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-4 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Thank You for Your Feedback!
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Your review has been verified and recorded with Job #{activeJob.jobNumber}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Work Order Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Please check the job number printed on your receipt slip (e.g. SC-2026-101) or search using your registered phone number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
