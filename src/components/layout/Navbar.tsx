import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { GoogleSearchDiagnosisModal } from '../common/GoogleSearchDiagnosisModal';
import { 
  Search, 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  PlusCircle, 
  CloudCheck, 
  Shield, 
  Wrench, 
  Headphones, 
  Smartphone,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Briefcase,
  Lock
} from 'lucide-react';
import { UserRole, AppNotification } from '../../types';
import { AdminAuthModal } from '../common/AdminAuthModal';

export const Navbar: React.FC<{ 
  onOpenNewJob: () => void;
  onPreloadJob?: (data: { customerName?: string; customerPhone?: string; deviceModel?: string; issue?: string }) => void;
}> = ({ onOpenNewJob, onPreloadJob }) => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    currentRole, 
    setCurrentRole, 
    currentUser, 
    searchQuery, 
    setSearchQuery,
    googleSyncConfig,
    triggerGoogleSync,
    jobs,
    spareParts,
    setActiveTab,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    selectedSearchNotification,
    setSelectedSearchNotification,
    adminSecurity
  } = useApp();

  const t = useI18n(language);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [targetRoleToAuth, setTargetRoleToAuth] = useState<UserRole | null>(null);

  // Compute operational alerts
  const lowStockCount = spareParts.filter(p => p.quantity <= p.minStockThreshold).length;
  const urgentJobsCount = jobs.filter(j => j.priority === 'urgent' && j.status !== 'delivered').length;

  const totalAlertBadge = unreadNotificationCount + (lowStockCount > 0 ? 1 : 0) + (urgentJobsCount > 0 ? 1 : 0);

  const roleOptions: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    { role: 'admin', label: 'Admin (Master)', desc: 'Full system, data wipe & financial controls', icon: <Shield className="w-4 h-4 text-purple-600" /> },
    { role: 'manager', label: 'Manager Workspace', desc: 'Team oversight, inventory & reports', icon: <Briefcase className="w-4 h-4 text-blue-600" /> },
    { role: 'technician', label: 'Technician Workbench', desc: 'Assigned jobs, diagnostics & spare parts', icon: <Wrench className="w-4 h-4 text-amber-600" /> },
    { role: 'receptionist', label: 'Front Desk / Reception', desc: 'Customer check-in, calls, billing & pickup', icon: <Headphones className="w-4 h-4 text-pink-600" /> },
    { role: 'customer', label: 'Customer Portal', desc: 'Live repair status tracking & feedback', icon: <Smartphone className="w-4 h-4 text-violet-600" /> }
  ];

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    setSelectedSearchNotification(notif);
    setShowNotifications(false);
  };

  const handleConvertToJob = (data: { customerName?: string; customerPhone?: string; deviceModel?: string; issue?: string }) => {
    if (onPreloadJob) {
      onPreloadJob(data);
    }
    onOpenNewJob();
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 transition-colors">
        {/* Left / Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/80 pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-3">
          {/* Google Search Radar Quick Link */}
          <button
            onClick={() => setActiveTab('customer-portal')}
            className="hidden lg:flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-xs"
            title="Open Google Search Grounded Repair Diagnostic Radar"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Google Search Radar</span>
          </button>

          {/* Google Sheets Sync Quick Button */}
          <button
            onClick={triggerGoogleSync}
            disabled={googleSyncConfig.syncStatus === 'syncing'}
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition disabled:opacity-50"
            title={`Google Sheets Connected: ${googleSyncConfig.googleUserEmail}`}
          >
            <CloudCheck className={`w-3.5 h-3.5 ${googleSyncConfig.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{googleSyncConfig.syncStatus === 'syncing' ? 'Syncing...' : 'Sheets Backup'}</span>
          </button>

          {/* Quick New Job Button (Staff only) */}
          {currentRole !== 'customer' && (
            <button
              onClick={onOpenNewJob}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-purple-700 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('quickJob')}</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
              className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Switch Language: English / മലയാളം"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'en' ? 'മലയാളം' : 'ENG'}</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Real-Time Notifications"
            >
              <Bell className="w-4 h-4" />
              {totalAlertBadge > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {totalAlertBadge}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      {t('notifications')}
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => markNotificationRead('all')}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 overflow-y-auto flex-1 text-xs pr-1">
                  {/* Real-time Customer Google Search Inquiries */}
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-2.5 ${
                        !notif.read
                          ? 'bg-blue-50/70 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-800 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        notif.type === 'customer_google_search' 
                          ? 'bg-blue-600 text-white' 
                          : notif.type === 'recall_alert' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {notif.type === 'customer_google_search' ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : notif.type === 'recall_alert' ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <Wrench className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 dark:text-white truncate text-[11px]">
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                          <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
                            <span>View Diagnosis</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Low Stock operational alert */}
                  {lowStockCount > 0 && (
                    <div 
                      onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 cursor-pointer hover:bg-amber-500/15 transition"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold">{lowStockCount} items low in stock</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300">Reorder required for screens & batteries.</p>
                      </div>
                    </div>
                  )}

                  {/* Urgent Ticket alert */}
                  {urgentJobsCount > 0 && (
                    <div 
                      onClick={() => { setActiveTab('jobs'); setShowNotifications(false); }}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200 cursor-pointer hover:bg-rose-500/15 transition"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold">{urgentJobsCount} Urgent Priority Work Order</p>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300">Liquid damage testing in progress on bench.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 pl-2 pr-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-400 transition"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser.name[0]}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-extrabold">{currentRole}</span>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Role (Demo)
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        setShowRoleMenu(false);
                        if (opt.role === currentRole) return;

                        if (opt.role === 'customer') {
                          setCurrentRole('customer');
                          return;
                        }

                        if (adminSecurity.requirePasswordForRoleSwitch) {
                          setTargetRoleToAuth(opt.role);
                          return;
                        }

                        setCurrentRole(opt.role);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition ${
                        currentRole === opt.role 
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5">{opt.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{opt.label}</span>
                          {opt.role !== 'customer' && adminSecurity.requirePasswordForRoleSwitch && (
                            <Lock className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Role & Panel Authentication Modal */}
      {targetRoleToAuth && (
        <AdminAuthModal
          isOpen={!!targetRoleToAuth}
          targetRole={targetRoleToAuth}
          onClose={() => setTargetRoleToAuth(null)}
          onSuccess={() => {
            if (targetRoleToAuth) {
              setCurrentRole(targetRoleToAuth);
              setTargetRoleToAuth(null);
            }
          }}
        />
      )}

      {/* Google Search Diagnosis Modal */}
      {selectedSearchNotification && (
        <GoogleSearchDiagnosisModal
          notification={selectedSearchNotification}
          onClose={() => setSelectedSearchNotification(null)}
          onConvertToJob={handleConvertToJob}
        />
      )}
    </>
  );
};
