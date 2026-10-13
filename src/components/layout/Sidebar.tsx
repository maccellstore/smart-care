import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Boxes, 
  ShieldAlert, 
  Receipt, 
  CalendarClock, 
  Star, 
  BarChart3, 
  CloudCheck, 
  UserCheck, 
  Smartphone,
  RotateCcw,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Trash2
} from 'lucide-react';
import { AdminResetDataModal } from '../common/AdminResetDataModal';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    language, 
    jobs, 
    spareParts, 
    appointments, 
    currentRole 
  } = useApp();
  const t = useI18n(language);
  const [showResetModal, setShowResetModal] = useState(false);

  const pendingJobsCount = jobs.filter(j => j.status !== 'delivered' && j.status !== 'cancelled').length;
  const readyJobsCount = jobs.filter(j => j.status === 'ready').length;
  const lowStockCount = spareParts.filter(p => p.quantity <= p.minStockThreshold).length;
  const upcomingAptsCount = appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    roles?: string[];
  }[] = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
      roles: ['admin', 'manager']
    },
    {
      id: 'jobs',
      label: t('navJobs'),
      icon: <Wrench className="w-4 h-4 text-purple-500" />,
      badge: pendingJobsCount,
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      roles: ['admin', 'manager', 'technician', 'receptionist']
    },
    {
      id: 'receptionist',
      label: t('navReceptionist'),
      icon: <PhoneCall className="w-4 h-4 text-pink-500" />,
      badge: readyJobsCount > 0 ? readyJobsCount : undefined,
      badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      id: 'customers',
      label: t('navCustomers'),
      icon: <Users className="w-4 h-4 text-teal-500" />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      id: 'inventory',
      label: t('navInventory'),
      icon: <Boxes className="w-4 h-4 text-emerald-500" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      roles: ['admin', 'manager', 'technician']
    },
    {
      id: 'technicians',
      label: t('navTechnicians'),
      icon: <ShieldAlert className="w-4 h-4 text-indigo-500" />,
      roles: ['admin', 'manager', 'technician']
    },
    {
      id: 'billing',
      label: t('navBilling'),
      icon: <Receipt className="w-4 h-4 text-orange-500" />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      id: 'appointments',
      label: t('navAppointments'),
      icon: <CalendarClock className="w-4 h-4 text-sky-500" />,
      badge: upcomingAptsCount,
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      roles: ['admin', 'manager', 'technician', 'receptionist']
    },
    {
      id: 'feedback',
      label: t('navFeedback'),
      icon: <Star className="w-4 h-4 text-amber-500" />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      id: 'reports',
      label: t('navReports'),
      icon: <BarChart3 className="w-4 h-4 text-rose-500" />,
      roles: ['admin', 'manager']
    },
    {
      id: 'google-sync',
      label: t('navGoogleSync'),
      icon: <CloudCheck className="w-4 h-4 text-teal-600" />,
      roles: ['admin']
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: <UserCheck className="w-4 h-4 text-slate-500" />,
      roles: ['admin', 'manager']
    },
    {
      id: 'customer-portal',
      label: t('navCustomerPortal'),
      icon: <Smartphone className="w-4 h-4 text-violet-500" />,
      roles: ['customer', 'admin', 'manager']
    }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentRole);
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-teal-500 text-white shadow-md shadow-blue-500/20">
            <Wrench className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                SmartCare
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{currentRole}</span>
              <span>Workspace</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Operations & Management
          </div>

          {filteredNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-xs dark:from-blue-950/70 dark:to-purple-950/70 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Service Categories Quick Pill Strip */}
        <div className="p-3 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-slate-100 via-blue-50/40 to-purple-50/40 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-850 border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Supported Devices</span>
          </div>
          <div className="flex flex-wrap gap-1 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-medium">iPhone/Mobile</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-100/80 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 font-medium">MacBook</span>
            <span className="px-1.5 py-0.5 rounded bg-teal-100/80 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 font-medium">Laptops</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-medium">iPads</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100/80 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 font-medium">Electronics</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>v2.6 Online</span>
          </div>
          {currentRole === 'admin' ? (
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="Wipe all operational data or restore sample demo dataset"
            >
              <Trash2 className="w-3 h-3 text-rose-500" />
              <span>Reset / Wipe</span>
            </button>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              {currentRole} panel
            </span>
          )}
        </div>
      </aside>

      {showResetModal && (
        <AdminResetDataModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          initialMode="wipe"
        />
      )}
    </>
  );
};
