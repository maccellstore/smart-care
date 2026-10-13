/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { DashboardView } from './components/dashboard/DashboardView';
import { JobList } from './components/jobs/JobList';
import { NewJobModal } from './components/jobs/NewJobModal';
import { JobCardDetailModal } from './components/jobs/JobCardDetailModal';
import { JobPrintModal } from './components/jobs/JobPrintModal';
import { CustomerListView } from './components/customers/CustomerListView';
import { InventoryView } from './components/inventory/InventoryView';
import { TechnicianSparesView } from './components/technicians/TechnicianSparesView';
import { ReceptionistDeskView } from './components/receptionist/ReceptionistDeskView';
import { BillingView } from './components/billing/BillingView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { FeedbackView } from './components/feedback/FeedbackView';
import { ReportsView } from './components/reports/ReportsView';
import { GoogleSyncView } from './components/sync/GoogleSyncView';
import { SettingsView } from './components/settings/SettingsView';
import { CustomerPortalView } from './components/portal/CustomerPortalView';
import { Job } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toasts, removeToast } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [preloadJobData, setPreloadJobData] = useState<{
    customerName?: string;
    customerPhone?: string;
    deviceModel?: string;
    issue?: string;
  } | null>(null);

  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForPrint, setSelectedJobForPrint] = useState<Job | null>(null);

  const handleSelectJob = (job: Job) => {
    setSelectedJobForDetail(job);
  };

  const handlePrintJob = (job: Job) => {
    setSelectedJobForPrint(job);
  };

  const handleGenerateInvoiceFromJob = (job: Job) => {
    setSelectedJobForDetail(null);
    setActiveTab('billing');
  };

  const handlePreloadJob = (data: { customerName?: string; customerPhone?: string; deviceModel?: string; issue?: string }) => {
    setPreloadJobData(data);
    setIsNewJobOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors selection:bg-blue-500 selection:text-white">
      {/* Sidebar for Desktop & Offcanvas Drawer for Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <Navbar 
          onOpenNewJob={() => setIsNewJobOpen(true)} 
          onPreloadJob={handlePreloadJob}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectJob={handleSelectJob}
              onOpenNewJob={() => setIsNewJobOpen(true)}
            />
          )}

          {activeTab === 'jobs' && (
            <JobList
              onSelectJob={handleSelectJob}
              onOpenNewJob={() => setIsNewJobOpen(true)}
              onPrintJob={handlePrintJob}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerListView onSelectJob={handleSelectJob} />
          )}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'technicians' && <TechnicianSparesView />}

          {activeTab === 'receptionist' && (
            <ReceptionistDeskView
              onSelectJob={handleSelectJob}
              onPrintJob={handlePrintJob}
            />
          )}

          {activeTab === 'billing' && <BillingView onSelectJob={handleSelectJob} />}

          {activeTab === 'appointments' && (
            <AppointmentsView onSelectJob={handleSelectJob} />
          )}

          {activeTab === 'feedback' && <FeedbackView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'google-sync' && <GoogleSyncView />}

          {activeTab === 'settings' && <SettingsView />}

          {activeTab === 'customer-portal' && (
            <CustomerPortalView 
              onOpenNewJob={() => setIsNewJobOpen(true)}
              onPreloadJob={handlePreloadJob}
            />
          )}
        </main>
      </div>

      {/* Bottom Nav for Mobile Phone viewports */}
      <MobileNav
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenNewJob={() => setIsNewJobOpen(true)}
      />

      {/* Offline Mode Alert */}
      <OfflineIndicator />

      {/* Modals */}
      <NewJobModal
        isOpen={isNewJobOpen}
        initialData={preloadJobData}
        onClose={() => {
          setIsNewJobOpen(false);
          setPreloadJobData(null);
        }}
      />

      <JobCardDetailModal
        job={selectedJobForDetail}
        onClose={() => setSelectedJobForDetail(null)}
        onPrintJob={handlePrintJob}
        onGenerateInvoice={handleGenerateInvoiceFromJob}
      />

      <JobPrintModal
        job={selectedJobForPrint}
        onClose={() => setSelectedJobForPrint(null)}
      />

      {/* Floating Toast Alerts Stack */}
      <div className="fixed bottom-18 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md animate-fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
