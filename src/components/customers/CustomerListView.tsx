import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { Customer, Job } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Wrench, 
  History, 
  MessageSquare, 
  Send, 
  X, 
  Clock,
  Sparkles,
  ExternalLink,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const CustomerListView: React.FC<{
  onSelectJob: (job: Job) => void;
}> = ({ onSelectJob }) => {
  const { 
    customers, 
    jobs, 
    createCustomer, 
    deleteCustomer,
    addCustomerLog, 
    language,
    searchQuery,
    addToast
  } = useApp();
  const t = useI18n(language);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newLogType, setNewLogType] = useState<'whatsapp' | 'sms' | 'call' | 'email'>('whatsapp');
  const [newLogContent, setNewLogContent] = useState('');

  // Form states for new customer
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newGst, setNewGst] = useState('');

  // Filter customers by search
  const filteredCustomers = customers.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.address.toLowerCase().includes(q);
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    createCustomer({
      name: newName,
      phone: newPhone,
      email: newEmail,
      address: newAddress,
      gstNumber: newGst
    });
    addToast(`Customer ${newName} added successfully!`, 'success');
    setShowNewCustomerModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewGst('');
  };

  const handleAddLog = (customerId: string) => {
    if (!newLogContent.trim()) return;
    addCustomerLog(customerId, newLogType, newLogContent);
    setNewLogContent('');
    addToast('Communication logged', 'success');

    // Update locally selected customer state
    const updated = customers.find(c => c.id === customerId);
    if (updated) setSelectedCustomer({ ...updated });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navCustomers')}
          </h1>
          <p className="text-xs text-slate-500">
            Client profiles, communication history, device ownership records & loyalty points
          </p>
        </div>

        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-700 hover:to-blue-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const custJobs = jobs.filter(j => j.customerId === cust.id);
          const activeJobs = custJobs.filter(j => j.status !== 'delivered' && j.status !== 'cancelled');

          return (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className="group cursor-pointer rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-extrabold flex items-center justify-center text-sm shadow-xs">
                    {cust.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 transition">
                      {cust.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <span>{cust.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    {cust.loyaltyPoints} pts
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerToDelete(cust);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition opacity-80 group-hover:opacity-100"
                    title={`Delete customer ${cust.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {cust.address && (
                <div className="flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="truncate">{cust.address}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  Total Spent: <strong className="font-mono text-slate-900 dark:text-slate-100">₹{cust.totalSpent.toLocaleString('en-IN')}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  {activeJobs.length > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {activeJobs.length} In-Service
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {custJobs.length} Past Repairs
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    Customer ID: {selectedCustomer.id} • Registered {selectedCustomer.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerToDelete(selectedCustomer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold transition"
                  title="Delete this customer profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Profile</span>
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contact & Loyalty Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Phone Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{selectedCustomer.email || 'None'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Loyalty Points</span>
                <span className="font-bold text-amber-600">{selectedCustomer.loyaltyPoints} SmartPoints (₹{(selectedCustomer.loyaltyPoints * 2)} discount value)</span>
              </div>
            </div>

            {/* Service & Repair History */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-500" />
                <span>Device Service History ({jobs.filter(j => j.customerId === selectedCustomer.id).length})</span>
              </h3>

              <div className="space-y-2">
                {jobs.filter(j => j.customerId === selectedCustomer.id).map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedCustomer(null);
                      onSelectJob(job);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition text-xs"
                  >
                    <div>
                      <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {job.jobNumber} — {job.deviceBrand} {job.deviceModel}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {job.issueDescription}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {job.status.toUpperCase()}
                      </span>
                      <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                        ₹{(job.finalCost || job.estimatedCost).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication & Call Logs */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
                <span>Communication Log & Customer Notes</span>
              </h3>

              {/* Add Note / Log Form */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as any)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="call">Phone Call</option>
                    <option value="sms">SMS Text</option>
                    <option value="email">Email Notice</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLogContent}
                    onChange={(e) => setNewLogContent(e.target.value)}
                    placeholder="e.g. Called customer regarding screen quotation approval. Customer agreed to ₹4,500."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <button
                    onClick={() => handleAddLog(selectedCustomer.id)}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </div>

              {/* Log Timeline */}
              <div className="space-y-2">
                {(selectedCustomer.communicationLog || []).map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {log.type} • {log.sender}
                      </span>
                      <span>{log.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Customer Profile
              </h3>
              <button onClick={() => setShowNewCustomerModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Nair"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98470 11223"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Civil Station, Calicut"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GST Number (Optional B2B)</label>
                <input
                  type="text"
                  value={newGst}
                  onChange={(e) => setNewGst(e.target.value)}
                  placeholder="32ABCDE1234F1Z5"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-rose-200 dark:border-rose-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Customer Profile?
                </h3>
                <p className="text-xs text-slate-500">
                  Permanently remove client from database
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Client Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{customerToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{customerToDelete.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Associated Repairs:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {jobs.filter(j => j.customerId === customerToDelete.id).length} jobs
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Note: Existing repair invoices and job cards will remain preserved in historical records for GST & tax compliance, but this client profile will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCustomer(customerToDelete.id);
                  if (selectedCustomer?.id === customerToDelete.id) {
                    setSelectedCustomer(null);
                  }
                  setCustomerToDelete(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
