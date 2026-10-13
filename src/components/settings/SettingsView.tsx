import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { 
  Settings2, 
  Shield, 
  UserCheck, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { users, language, addToast, resetAllData } = useApp();
  const t = useI18n(language);

  const [centerName, setCenterName] = useState('SmartCare Service Center');
  const [phone, setPhone] = useState('+91 98470 12345');
  const [email, setEmail] = useState('support@smartcare.service');
  const [address, setAddress] = useState('Fort Road, Kannur, Kerala - 670001');
  const [gstin, setGstin] = useState('32AABCS1429B1ZB');
  const [defaultWarranty, setDefaultWarranty] = useState(6);
  const [laborHsn, setLaborHsn] = useState('9987');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Service Center profile & GST parameters updated!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('navSettings')}
        </h1>
        <p className="text-xs text-slate-500">
          Service center business identity, GST tax registration, default warranties & role-based permissions
        </p>
      </div>

      {/* Business Profile Form */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Service Center Business Details & GSTIN</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trading Name
              </label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official GSTIN (Goods & Service Tax ID)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Care Hotline
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Center Physical Address (Printed on Invoices & Job Slips)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Hardware Warranty (Months)
              </label>
              <input
                type="number"
                value={defaultWarranty}
                onChange={(e) => setDefaultWarranty(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Labor SAC Code (Kerala GST)
              </label>
              <input
                type="text"
                value={laborHsn}
                onChange={(e) => setLaborHsn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Role-Based Access Control Matrix */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>Role-Based Access Control (RBAC) System</span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Current authorized users and access permissions across modules
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5">User</th>
                <th className="py-2.5">System Role</th>
                <th className="py-2.5">Permissions Granted</th>
                <th className="py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {u.name}
                    <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 text-[11px]">
                    {u.role === 'admin' ? 'Full SuperAdmin Privileges, Reports, Backups' :
                     u.role === 'technician' ? 'Assigned Tickets, Diagnostic Bench Notes, Spare Issuance' :
                     'Check-In Desk, Intake Tickets, Tax Invoicing'}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Demo Data Button */}
      <div className="p-5 rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
            Factory Reset Sample Demo Data
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
            Reset all sample jobs, inventory, appointments and customer records back to clean initial demo state.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all jobs, customers and inventory to default sample dataset?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store</span>
        </button>
      </div>
    </div>
  );
};
