import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  X, 
  CheckCircle2, 
  Database,
  Sparkles,
  Layers,
  Check,
  ShieldCheck,
  PackageX
} from 'lucide-react';

interface AdminResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'wipe' | 'demo';
}

export const AdminResetDataModal: React.FC<AdminResetDataModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'wipe'
}) => {
  const { 
    adminSecurity, 
    adminResetAllData, 
    jobs, 
    customers, 
    invoices, 
    appointments, 
    spareParts, 
    callLogs,
    currentRole,
    currentUser
  } = useApp();

  const [resetMode, setResetMode] = useState<'demo' | 'wipe'>(initialMode);
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(true);
  const [wipeInventory, setWipeInventory] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isAdmin = currentRole === 'admin';

  const handleExecuteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If password requirement is enabled, check password unless current user is already authenticated as superadmin and typed empty
    if (adminSecurity.requirePasswordForDataReset) {
      if (password) {
        if (password !== adminSecurity.passwordHash) {
          setError('Incorrect Admin password. Authorization denied.');
          return;
        }
      } else if (!isAdmin) {
        setError('Please enter your Admin password to authorize data reset');
        return;
      }
    }

    if (!confirmed) {
      setError('Please check the confirmation acknowledgement checkbox');
      return;
    }

    const authPassword = password || adminSecurity.passwordHash;
    const success = adminResetAllData(resetMode, authPassword, { wipeInventory });
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-rose-300 dark:border-rose-900 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white relative border-b border-rose-900/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  Master Data Reset & Wipe Console
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/30 text-rose-300 border border-rose-400/30">
                  Admin Authorized
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Complete database wipe for live store or sample demo restoration
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleExecuteReset} className="p-6 space-y-4 text-xs">
          {/* Live System Count Preview */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-bold uppercase text-[10px]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>Current Records in System</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Database</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Jobs/Tickets</span>
                <span className={`text-sm font-bold font-mono ${jobs.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {jobs.length}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Customers</span>
                <span className={`text-sm font-bold font-mono ${customers.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {customers.length}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Invoices</span>
                <span className={`text-sm font-bold font-mono ${invoices.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {invoices.length}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bookings</span>
                <span className={`text-sm font-bold font-mono ${appointments.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {appointments.length}
                </span>
              </div>
            </div>
          </div>

          {/* Reset Mode Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setResetMode('wipe')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  resetMode === 'wipe'
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 dark:border-rose-400 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Wipe All Data (Blank Slate)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Clears all customer repair tickets, invoices, appointments, call logs & inventory to 0 for fresh store operations.
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Clears all to 0 records</span>
                </div>
              </div>

              <div
                onClick={() => setResetMode('demo')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  resetMode === 'demo'
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-400 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Restore Sample Demo Data
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Populates standard demonstration devices (MacBook, iPhone, Dell XPS), customer history, invoices & stock.
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Restores sample records</span>
                </div>
              </div>
            </div>
          </div>

          {/* Options for Wipe Mode */}
          {resetMode === 'wipe' && (
            <div className="p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
              <span className="text-[11px] font-bold text-rose-900 dark:text-rose-200 block">
                Data Collections to Purge:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>All Jobs & Tickets</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>All Customers</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>All Invoices & Payments</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>All Appointments</span>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wipeInventory}
                  onChange={(e) => setWipeInventory(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] font-semibold text-rose-900 dark:text-rose-200">
                  Also wipe Spare Parts & Inventory stock ({spareParts.length} parts)
                </span>
              </label>
            </div>
          )}

          {/* Admin Authorization Status */}
          <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Authorization</span>
              </span>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active Admin Session ({currentUser.name})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Password Required
                </span>
              )}
            </div>

            {adminSecurity.requirePasswordForDataReset && (
              <div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder={`Enter admin password (Default: ${adminSecurity.passwordHash})`}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Leave empty to authorize using current Admin session, or enter password.
                </span>
              </div>
            )}
          </div>

          {/* Acknowledge Checkbox */}
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setError('');
              }}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-tight">
              I confirm I want to {resetMode === 'wipe' ? 'wipe all records to 0' : 'restore default sample records'}.
            </span>
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-semibold text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition active:scale-95 ${
                resetMode === 'wipe'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              {resetMode === 'wipe' ? <Trash2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
              <span>{resetMode === 'wipe' ? 'WIPE ALL DATA TO ZERO (0)' : 'RESTORE SAMPLE DEMO DATA'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
