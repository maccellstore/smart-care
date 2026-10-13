import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n, getStatusColor } from '../../i18n/translations';
import { Job, JobStatus, ServiceCategory, Priority } from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Smartphone, 
  Laptop, 
  Wrench,
  ChevronRight,
  Send,
  MoreVertical,
  QrCode,
  Edit2,
  UserCheck
} from 'lucide-react';
import { EditJobCustomerModal } from './EditJobCustomerModal';

export const JobList: React.FC<{
  onSelectJob: (job: Job) => void;
  onOpenNewJob: () => void;
  onPrintJob: (job: Job) => void;
}> = ({ onSelectJob, onOpenNewJob, onPrintJob }) => {
  const { 
    jobs, 
    updateJobStatus, 
    language, 
    searchQuery, 
    setSearchQuery,
    addCustomerLog,
    addToast
  } = useApp();
  const t = useI18n(language);

  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<Job | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [editingCustomerJob, setEditingCustomerJob] = useState<Job | null>(null);

  // Filtering
  const filteredJobs = jobs.filter((job) => {
    // Status
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    // Category
    if (categoryFilter !== 'all' && job.category !== categoryFilter) return false;
    // Priority
    if (priorityFilter !== 'all' && job.priority !== priorityFilter) return false;
    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNumber = job.jobNumber.toLowerCase().includes(q);
      const matchCustomer = job.customerName.toLowerCase().includes(q);
      const matchPhone = job.customerPhone.includes(q);
      const matchModel = job.deviceModel.toLowerCase().includes(q);
      const matchImei = job.serialOrImei.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchPhone && !matchModel && !matchImei) {
        return false;
      }
    }
    return true;
  });

  const statuses: { id: JobStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: t('allStatuses'), count: jobs.length },
    { id: 'received', label: t('status_received'), count: jobs.filter(j => j.status === 'received').length },
    { id: 'diagnosing', label: t('status_diagnosing'), count: jobs.filter(j => j.status === 'diagnosing').length },
    { id: 'waiting_parts', label: t('status_waiting_parts'), count: jobs.filter(j => j.status === 'waiting_parts').length },
    { id: 'in_repair', label: t('status_in_repair'), count: jobs.filter(j => j.status === 'in_repair').length },
    { id: 'testing', label: t('status_testing'), count: jobs.filter(j => j.status === 'testing').length },
    { id: 'ready', label: t('status_ready'), count: jobs.filter(j => j.status === 'ready').length },
    { id: 'delivered', label: t('status_delivered'), count: jobs.filter(j => j.status === 'delivered').length },
  ];

  const handleSendWhatsApp = (job: Job) => {
    const cleanPhone = job.customerPhone.replace(/\D/g, '');
    const message = customMsg || `Hello ${job.customerName}, this is SmartCare Service Center regarding your ${job.deviceBrand} ${job.deviceModel} (Job #${job.jobNumber}). Status is currently: ${job.status.toUpperCase().replace('_', ' ')}. Estimated balance due: ₹${(job.estimatedCost - job.advancePaid)}. Track live at: ${job.qrCodeData}`;
    
    // Log in customer history
    addCustomerLog(job.customerId, 'whatsapp', message);
    addToast(`WhatsApp alert queued for ${job.customerName}`, 'success');

    // Open WhatsApp Web or App
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setShowWhatsAppModal(null);
    setCustomMsg('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navJobs')}
          </h1>
          <p className="text-xs text-slate-500">
            Lifecycle tracking from intake to diagnostic, testing, parts and delivery
          </p>
        </div>

        <button
          onClick={onOpenNewJob}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-purple-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createNewJob')}</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map(s => {
          const isActive = statusFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{s.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="mobile">Mobile Phones</option>
            <option value="macbook">MacBook & Apple</option>
            <option value="laptop">Windows Laptops</option>
            <option value="tablet">iPads & Tablets</option>
            <option value="software">Software & OS</option>
            <option value="accessories">Accessories</option>
            <option value="electronics">Electronics</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="normal">🔵 Normal</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredJobs.length}</span> work orders
        </div>
      </div>

      {/* Job Cards Grid / Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 pl-4">{t('jobNumber')}</th>
                <th className="py-3.5">{t('customerName')}</th>
                <th className="py-3.5">{t('deviceBrandModel')}</th>
                <th className="py-3.5">{t('issueReported')}</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Financials</th>
                <th className="py-3.5">{t('assignedTechnician')}</th>
                <th className="py-3.5 pr-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                  const statusColors = getStatusColor(job.status);
                  const balance = (job.finalCost || job.estimatedCost) - job.advancePaid;

                  return (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      {/* Job Number & QR Badge */}
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center gap-1.5 font-mono font-extrabold text-blue-600 dark:text-blue-400">
                          <span>{job.jobNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {job.receivedDate.substring(5, 10)} • Due {job.dueDate.substring(5, 10)}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {job.customerName}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCustomerJob(job);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="Edit Customer Details"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {job.customerPhone}
                        </div>
                      </td>

                      {/* Device Brand & Model */}
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {job.deviceBrand} {job.deviceModel}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                          IMEI: {job.serialOrImei}
                        </div>
                      </td>

                      {/* Issue & Priority */}
                      <td className="py-3.5 max-w-[180px]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {job.priority === 'urgent' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              URGENT
                            </span>
                          )}
                          {job.priority === 'high' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                              HIGH
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {job.issueDescription}
                        </p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={job.status}
                          onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold border transition cursor-pointer ${statusColors.badgeClass}`}
                        >
                          <option value="received">Received</option>
                          <option value="diagnosing">Diagnosing</option>
                          <option value="waiting_parts">Waiting for Parts</option>
                          <option value="in_repair">In Repair</option>
                          <option value="testing">Quality Testing</option>
                          <option value="ready">Ready for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Financials */}
                      <td className="py-3.5">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          ₹{(job.finalCost || job.estimatedCost).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Adv: ₹{job.advancePaid} | <span className={balance > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600'}>Due: ₹{balance}</span>
                        </div>
                      </td>

                      {/* Assigned Tech */}
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <Wrench className="w-3 h-3 text-slate-400" />
                          {job.assignedTechnicianName || 'Unassigned'}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Customer */}
                          <button
                            onClick={() => setEditingCustomerJob(job)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Customer Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Job Card */}
                          <button
                            onClick={() => onPrintJob(job)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Print Job Card Ticket & Barcode"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Customer Alert */}
                          <button
                            onClick={() => {
                              setShowWhatsAppModal(job);
                              setCustomMsg(`Hello ${job.customerName}, SmartCare update: Your ${job.deviceBrand} ${job.deviceModel} (Job #${job.jobNumber}) is currently ${job.status.replace('_', ' ').toUpperCase()}. Expected delivery: ${job.dueDate}.`);
                            }}
                            className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 transition"
                            title="Send WhatsApp Status Notification"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Detail arrow */}
                          <button
                            onClick={() => onSelectJob(job)}
                            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                            title="View Full Repair Dossier"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No repair jobs match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Modal Preview */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Send WhatsApp Customer Alert
                </h3>
                <p className="text-xs text-slate-500">
                  Recipient: {showWhatsAppModal.customerName} ({showWhatsAppModal.customerPhone})
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Preview
              </label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400">
                This triggers a direct WhatsApp deep-link and logs the event in the customer's communication history.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowWhatsAppModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendWhatsApp(showWhatsAppModal)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCustomerJob && (
        <EditJobCustomerModal
          job={editingCustomerJob}
          onClose={() => setEditingCustomerJob(null)}
        />
      )}
    </div>
  );
};
