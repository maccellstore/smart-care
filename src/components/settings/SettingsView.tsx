import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { 
  Building2, 
  Shield, 
  UserCheck, 
  Check, 
  RotateCcw,
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldAlert,
  KeyRound,
  Database,
  Download,
  Upload,
  Sliders,
  Briefcase,
  Wrench,
  PhoneCall,
  Globe,
  Sun,
  Moon,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  Smartphone
} from 'lucide-react';
import { AdminResetDataModal } from '../common/AdminResetDataModal';

export const SettingsView: React.FC = () => {
  const { 
    users, 
    language, 
    setLanguage,
    theme,
    toggleTheme,
    addToast, 
    adminSecurity, 
    updateAdminSecurity,
    exportDatabaseJSON,
    importDatabaseJSON,
    jobs,
    customers,
    spareParts,
    invoices,
    callLogs,
    currentRole
  } = useApp();
  const t = useI18n(language);

  const [activeSubTab, setActiveSubTab] = useState<'business' | 'passwords' | 'data' | 'preferences'>('business');

  // Business Profile States (with localStorage persistence)
  const [centerName, setCenterName] = useState(() => localStorage.getItem('sc_biz_name') || 'SmartCare Service Center');
  const [phone, setPhone] = useState(() => localStorage.getItem('sc_biz_phone') || '+91 98470 12345');
  const [email, setEmail] = useState(() => localStorage.getItem('sc_biz_email') || 'support@smartcare.service');
  const [address, setAddress] = useState(() => localStorage.getItem('sc_biz_address') || 'Fort Road, Kannur, Kerala - 670001');
  const [gstin, setGstin] = useState(() => localStorage.getItem('sc_biz_gstin') || '32AABCS1429B1ZB');
  const [defaultWarranty, setDefaultWarranty] = useState(() => Number(localStorage.getItem('sc_biz_warranty')) || 6);
  const [laborHsn, setLaborHsn] = useState(() => localStorage.getItem('sc_biz_hsn') || '9987');
  const [taxRate, setTaxRate] = useState(() => Number(localStorage.getItem('sc_biz_tax')) || 18);

  // All User Panel Password States
  const [adminUsername, setAdminUsername] = useState(adminSecurity.username || 'admin');
  const [adminPassword, setAdminPassword] = useState(adminSecurity.passwordHash || 'admin123');
  const [managerPassword, setManagerPassword] = useState(adminSecurity.managerPassword || 'manager123');
  const [technicianPassword, setTechnicianPassword] = useState(adminSecurity.technicianPassword || 'tech123');
  const [receptionistPassword, setReceptionistPassword] = useState(adminSecurity.receptionistPassword || 'reception123');

  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showManagerPass, setShowManagerPass] = useState(false);
  const [showTechPass, setShowTechPass] = useState(false);
  const [showReceptionPass, setShowReceptionPass] = useState(false);

  const [requireRoleSwitch, setRequireRoleSwitch] = useState(adminSecurity.requirePasswordForRoleSwitch);
  const [requireResetAuth, setRequireResetAuth] = useState(adminSecurity.requirePasswordForDataReset);

  // Modals & File Upload
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetModalMode, setResetModalMode] = useState<'wipe' | 'demo'>('wipe');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sc_biz_name', centerName);
    localStorage.setItem('sc_biz_phone', phone);
    localStorage.setItem('sc_biz_email', email);
    localStorage.setItem('sc_biz_address', address);
    localStorage.setItem('sc_biz_gstin', gstin);
    localStorage.setItem('sc_biz_warranty', String(defaultWarranty));
    localStorage.setItem('sc_biz_hsn', laborHsn);
    localStorage.setItem('sc_biz_tax', String(taxRate));
    addToast('Service Center profile & GST parameters saved successfully!', 'success');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      addToast('Administrator username and password cannot be empty', 'error');
      return;
    }
    if (!managerPassword.trim() || !technicianPassword.trim() || !receptionistPassword.trim()) {
      addToast('All staff panel passwords must be configured', 'error');
      return;
    }

    updateAdminSecurity({
      username: adminUsername.trim(),
      passwordHash: adminPassword.trim(),
      managerPassword: managerPassword.trim(),
      technicianPassword: technicianPassword.trim(),
      receptionistPassword: receptionistPassword.trim(),
      requirePasswordForRoleSwitch: requireRoleSwitch,
      requirePasswordForDataReset: requireResetAuth
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJSON(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navSettings')}
          </h1>
          <p className="text-xs text-slate-500">
            Business profile, staff panel passwords, data backup, live store wipe console & preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Active Role: {currentRole}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('business')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'business'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Business & GST Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('passwords')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'passwords'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>All User Panel Passwords</span>
        </button>

        <button
          onClick={() => setActiveSubTab('data')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'data'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Backup & Wipe</span>
        </button>

        <button
          onClick={() => setActiveSubTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'preferences'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Language & System</span>
        </button>
      </div>

      {/* Tab 1: Business Profile Form */}
      {activeSubTab === 'business' && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Service Center Business Details & Official Tax Registration</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Printed on All GST Invoices & Job Slips</span>
          </div>

          <form onSubmit={handleSaveBusiness} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Trading Name / Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official GSTIN (GST Tax Identification Number) *
                </label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Care Hotline *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Support Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Service Center Address *
                </label>
                <input
                  type="text"
                  required
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
                  min="0"
                  max="36"
                  value={defaultWarranty}
                  onChange={(e) => setDefaultWarranty(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Labor SAC Code (Kerala / India GST)
                </label>
                <input
                  type="text"
                  value={laborHsn}
                  onChange={(e) => setLaborHsn(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default GST Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Business Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: All User Panel Passwords & Role Access Control */}
      {activeSubTab === 'passwords' && (
        <div className="space-y-6">
          {/* Role Passwords Card */}
          <div className="rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-950">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    All User Panel Passwords & Role Security Lock
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Set unique PINs and passwords for every staff panel. Each panel shows only authorized modules.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Staff Authentication
              </span>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Admin Master Panel */}
                <div className="p-4 rounded-2xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">1. Administrator Panel</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-600 font-bold">Full Access</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Admin Username
                      </label>
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Admin Master Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminPass ? 'text' : 'password'}
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPass(!showAdminPass)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                        >
                          {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Manager Panel */}
                <div className="p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">2. Manager Workspace</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">Oversight & Ops</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Manager Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showManagerPass ? 'text' : 'password'}
                        required
                        value={managerPassword}
                        onChange={(e) => setManagerPassword(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowManagerPass(!showManagerPass)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showManagerPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Default PIN: manager123</p>
                  </div>
                </div>

                {/* 3. Technician Panel */}
                <div className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-amber-600 text-white">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">3. Technician Workbench</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-600 font-bold">Repairs & Spares</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Technician Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showTechPass ? 'text' : 'password'}
                        required
                        value={technicianPassword}
                        onChange={(e) => setTechnicianPassword(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowTechPass(!showTechPass)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showTechPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Default PIN: tech123</p>
                  </div>
                </div>

                {/* 4. Receptionist Panel */}
                <div className="p-4 rounded-2xl border border-pink-200/80 dark:border-pink-900/60 bg-pink-50/30 dark:bg-pink-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-pink-600 text-white">
                        <PhoneCall className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">4. Front Desk / Reception</span>
                    </div>
                    <span className="text-[10px] font-mono text-pink-600 font-bold">Intake & Bills</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Receptionist Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showReceptionPass ? 'text' : 'password'}
                        required
                        value={receptionistPassword}
                        onChange={(e) => setReceptionistPassword(e.target.value)}
                        className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowReceptionPass(!showReceptionPass)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                      >
                        {showReceptionPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Default PIN: reception123</p>
                  </div>
                </div>
              </div>

              {/* Security Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-purple-300 transition">
                  <input
                    type="checkbox"
                    checked={requireRoleSwitch}
                    onChange={(e) => setRequireRoleSwitch(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Require Password When Switching Any Staff Panel
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      Prompts for role credentials before unlocking Administrator, Manager, Technician, or Receptionist views.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer hover:border-purple-300 transition">
                  <input
                    type="checkbox"
                    checked={requireResetAuth}
                    onChange={(e) => setRequireResetAuth(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Require Password for Master Data Reset & Wipe
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      Prevents any operational data deletion or blank slate reset without verifying admin master password.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <KeyRound className="w-3.5 h-3.5 text-purple-500" />
                  <span>Configured passwords apply instantly across all terminals.</span>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Update All Panel Passwords</span>
                </button>
              </div>
            </form>
          </div>

          {/* Role Access Matrix */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Panel Modules & Permissions Breakdown</span>
              </h3>
              <span className="text-[11px] text-slate-400">Strict Separation of Duties</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-1.5">
                <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin (Master)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Has complete clearance to everything: Dashboard, Jobs, Invoices, Stock, Payroll, Financial Reports, Google Sync & Live Data Wipe.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
                <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Manager</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Has operational oversight: Dashboard, Jobs, Inventory, Customers, Billing, Appointments, and Reports. (Protected from database wipe).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Technician</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Shows ONLY their workbench: Repair Jobs, Spare Parts Catalog, Personal Spares Ledger, and Service Appointments. (Financials hidden).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/40 space-y-1.5">
                <div className="font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Receptionist</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Shows ONLY Front Desk tools: Reception Desk, New Job Intake, Customer Directory & Call Logs, Appointments, and Invoicing/Payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Management & Wipe Console */}
      {activeSubTab === 'data' && (
        <div className="space-y-6">
          {/* Database Metrics Stats Card */}
          <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Current Database Record Counts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40">
                <div className="font-mono text-xl font-black text-purple-700 dark:text-purple-300">{jobs.length}</div>
                <div className="text-[11px] text-slate-500">Repair Jobs</div>
              </div>
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40">
                <div className="font-mono text-xl font-black text-teal-700 dark:text-teal-300">{customers.length}</div>
                <div className="text-[11px] text-slate-500">Clients</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="font-mono text-xl font-black text-emerald-700 dark:text-emerald-300">{spareParts.length}</div>
                <div className="text-[11px] text-slate-500">Spares Racks</div>
              </div>
              <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40">
                <div className="font-mono text-xl font-black text-orange-700 dark:text-orange-300">{invoices.length}</div>
                <div className="text-[11px] text-slate-500">GST Invoices</div>
              </div>
              <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-900/40 col-span-2 sm:col-span-1">
                <div className="font-mono text-xl font-black text-pink-700 dark:text-pink-300">{callLogs.length}</div>
                <div className="text-[11px] text-slate-500">Call Logs</div>
              </div>
            </div>
          </div>

          {/* Backup & Export / Import Card */}
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Database Export & Import (JSON Backups)
                </h3>
                <p className="text-xs text-slate-500">
                  Save complete snapshots of all store records, customer accounts, and settings to your computer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    <span>Download Complete Store Backup</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Exports all repair jobs, client contacts, inventory items, and invoices as a formatted JSON file.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportDatabaseJSON}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Database JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-teal-500" />
                    <span>Restore Store from Backup JSON</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload a previously downloaded SmartCare backup file to restore records.
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Backup File & Restore</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Master Data Console */}
          <div className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50/70 via-rose-50/30 to-slate-50/50 dark:from-rose-950/30 dark:via-rose-950/10 dark:to-slate-900/40 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="font-black text-rose-950 dark:text-rose-100 text-sm">
                    Admin Master Data & Database Wipe Console
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-200/80 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                    SuperAdmin Only
                  </span>
                </div>
                <p className="text-xs text-rose-800/80 dark:text-rose-300 max-w-2xl leading-relaxed">
                  Choose between a complete database wipe (0 jobs, 0 customers, 0 tickets, 0 invoices) for live store launch, or reload standard sample demonstration records.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card A: Wipe All Data */}
              <div className="p-5 rounded-2xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-slate-900/90 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Wipe All Data (Blank Slate)
                      </h4>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                        Live Production Store Launch
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Clears all customer repair tickets, GST invoices, appointments, and inventory records to 0 so you start completely fresh with real customers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetModalMode('wipe');
                    setShowResetModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Wipe All Data to 0 Records</span>
                </button>
              </div>

              {/* Card B: Restore Demo Data */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Restore Factory Demonstration Records
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Testing & Training Dataset
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Re-populates 5 sample customer jobs (iPhone, MacBook, iPad, HP laptop), demo GST invoices, technician test records, and inventory racks.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetModalMode('demo');
                    setShowResetModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Sample Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Language & System Preferences */}
      {activeSubTab === 'preferences' && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>System & UI Localization Preferences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language Switcher Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Display Language</h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Switch between English and Malayalam for local service desk operators.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    language === 'en'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  English (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ml')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    language === 'ml'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  മലയാളം (Malayalam)
                </button>
              </div>
            </div>

            {/* Dark / Light Theme Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Theme Appearance</h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Toggle between Clean Light Mode and Micro-soldering Dark Cleanroom mode.
              </p>
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>Switch to {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reset / Wipe Modal */}
      {showResetModal && (
        <AdminResetDataModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          initialMode={resetModalMode}
        />
      )}
    </div>
  );
};
