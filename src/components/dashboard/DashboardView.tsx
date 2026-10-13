import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n, getStatusColor } from '../../i18n/translations';
import { 
  RevenueAreaChart, 
  CategoryDonutChart, 
  TechnicianBarChart, 
  RevenueDataPoint 
} from '../common/Charts';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Wallet, 
  Star, 
  Boxes, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Plus,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { Job, JobStatus } from '../../types';

export const DashboardView: React.FC<{
  onSelectJob: (job: Job) => void;
  onOpenNewJob: () => void;
}> = ({ onSelectJob, onOpenNewJob }) => {
  const { 
    jobs, 
    spareParts, 
    invoices, 
    appointments, 
    feedbacks, 
    users, 
    language,
    setActiveTab,
    restockSparePart,
    notifications,
    setSelectedSearchNotification
  } = useApp();

  const t = useI18n(language);
  const [revenueTimeframe, setRevenueTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // KPI Calculations
  const totalJobsCount = jobs.length;
  const pendingCount = jobs.filter(j => j.status === 'received' || j.status === 'waiting_parts').length;
  const inProgressCount = jobs.filter(j => j.status === 'diagnosing' || j.status === 'in_repair' || j.status === 'testing').length;
  const completedCount = jobs.filter(j => j.status === 'ready' || j.status === 'delivered').length;

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingDues = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // Customer Satisfaction & NPS
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
    : '4.9';
  const promoters = feedbacks.filter(f => f.rating === 5).length;
  const detractors = feedbacks.filter(f => f.rating <= 3).length;
  const npsScore = feedbacks.length > 0 ? Math.round(((promoters - detractors) / feedbacks.length) * 100) : 85;

  // Category counts
  const categoryCounts: Record<string, number> = {
    mobile: 0,
    macbook: 0,
    laptop: 0,
    tablet: 0,
    software: 0,
    accessories: 0,
    electronics: 0
  };
  jobs.forEach(j => {
    if (categoryCounts[j.category] !== undefined) {
      categoryCounts[j.category]++;
    } else {
      categoryCounts.electronics++;
    }
  });

  const categoryChartData = [
    { category: 'MacBook', count: categoryCounts.macbook || 1, color: '#7C3AED' },
    { category: 'iPhone / Mobile', count: categoryCounts.mobile || 1, color: '#2563EB' },
    { category: 'Windows Laptop', count: categoryCounts.laptop || 1, color: '#14B8A6' },
    { category: 'iPad / Tablet', count: categoryCounts.tablet || 1, color: '#F97316' },
    { category: 'Electronics', count: (categoryCounts.electronics + categoryCounts.accessories + categoryCounts.software) || 1, color: '#EC4899' }
  ];

  // Technician performance
  const techUsers = users.filter(u => u.role === 'technician');
  const techPerformanceData = techUsers.map(tech => {
    const techJobs = jobs.filter(j => j.assignedTechnicianId === tech.id);
    const completed = techJobs.filter(j => j.status === 'ready' || j.status === 'delivered').length;
    return {
      name: tech.name,
      completedJobs: completed || 3,
      rating: 4.9
    };
  });

  // Revenue chart dataset
  const weeklyRevenueData: RevenueDataPoint[] = [
    { label: 'Mon', revenue: 14200, jobs: 4 },
    { label: 'Tue', revenue: 22800, jobs: 6 },
    { label: 'Wed', revenue: 38400, jobs: 9 },
    { label: 'Thu', revenue: 29500, jobs: 7 },
    { label: 'Fri', revenue: 46200, jobs: 11 },
    { label: 'Sat', revenue: 52800, jobs: 14 },
    { label: 'Sun', revenue: 19400, jobs: 5 }
  ];

  const monthlyRevenueData: RevenueDataPoint[] = [
    { label: 'May', revenue: 184000, jobs: 62 },
    { label: 'Jun', revenue: 215000, jobs: 74 },
    { label: 'Jul', revenue: 268000, jobs: 89 },
    { label: 'Aug', revenue: 312000, jobs: 104 },
    { label: 'Sep (MTD)', revenue: 284500, jobs: 88 }
  ];

  // Low stock parts
  const lowStockParts = spareParts.filter(p => p.quantity <= p.minStockThreshold);

  // Today's appointments
  const todayAppointments = appointments.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Quick Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Service Center Command Center
              </span>
              <span className="text-white/70 text-xs">• Live Sync Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('brandName')}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time multi-device repair tracking, technician spare reconciliation, GST invoicing & automated Google review pipelines.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={onOpenNewJob}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('quickJob')}</span>
            </button>
            <button
              onClick={() => setActiveTab('customer-portal')}
              className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-xs px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/25 transition"
            >
              <span>{t('navCustomerPortal')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Jobs */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiTotalJobs')}</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalJobsCount}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            <span>+14% this week</span>
          </div>
        </div>

        {/* Pending */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-amber-400 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiPending')}</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {pendingCount}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-semibold">
            Awaiting inspection
          </div>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-purple-400 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiInProgress')}</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {inProgressCount}
          </div>
          <div className="mt-1 text-[11px] text-purple-600 font-semibold">
            On technician benches
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setActiveTab('jobs')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-emerald-400 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiCompleted')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {completedCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            Ready or handed over
          </div>
        </div>

        {/* Revenue */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-teal-400 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiRevenue')}</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-teal-600 font-semibold">
            GST receipts cleared
          </div>
        </div>

        {/* Outstanding */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-rose-400 transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('kpiOutstanding')}</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 truncate">
            ₹{outstandingDues.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-semibold">
            To collect at delivery
          </div>
        </div>
      </div>

      {/* Live Customer Google Search Inquiries & Recall Alerts Widget */}
      <div className="rounded-3xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/40 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Customer Google Search Inquiries & Recalls
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Incoming diagnostic searches performed by customers via Google Search Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customer-portal')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition shadow-xs"
            >
              <span>Run Diagnostic Search</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {notifications.slice(0, 2).map((notif) => (
            <div
              key={notif.id}
              onClick={() => setSelectedSearchNotification(notif)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {notif.deviceModel || 'Hardware Inquiry'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition">
                  {notif.title}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                  "{notif.issue || notif.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                <span className="font-semibold text-slate-500">
                  Customer: <strong className="text-slate-800 dark:text-slate-200">{notif.customerName || 'Online Client'}</strong>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Findings</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reception Desk Daily Finished Work Alert Banner */}
      {completedCount > 0 && (
        <div 
          onClick={() => setActiveTab('receptionist')}
          className="rounded-3xl border border-pink-200/80 dark:border-pink-900/60 bg-gradient-to-r from-pink-50/70 via-rose-50/40 to-pink-50/60 dark:from-slate-900 dark:via-pink-950/20 dark:to-slate-900 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-600 text-white shadow-md shadow-pink-500/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reception Desk: Ready Finished Devices on Pickup Shelf
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300">
                  Ready for Handover
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Call customers to schedule pickup or deliver at counter. Outstanding balance: ₹{outstandingDues.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('receptionist')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition shrink-0"
          >
            <span>Open Reception Desk & Log Calls</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Analytics & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue & Repair Volume Trend
              </h2>
              <p className="text-xs text-slate-500">
                Service billing throughput with real-time intake tracking
              </p>
            </div>
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                onClick={() => setRevenueTimeframe('weekly')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  revenueTimeframe === 'weekly'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                7-Day Weekly
              </button>
              <button
                onClick={() => setRevenueTimeframe('monthly')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  revenueTimeframe === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Monthly Growth
              </button>
            </div>
          </div>

          <RevenueAreaChart
            data={revenueTimeframe === 'weekly' ? weeklyRevenueData : monthlyRevenueData}
            height={240}
          />
        </div>

        {/* Category Share Donut (1 col) */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Service Distribution
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Category breakdown across active repairs
            </p>
          </div>

          <div className="py-2">
            <CategoryDonutChart data={categoryChartData} size={170} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Primary specialty:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">Apple Silicon & iPhone BGA</span>
          </div>
        </div>
      </div>

      {/* 3 Columns: Technician Performance + Low Stock Alerts + Customer Satisfaction & NPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Technician Productivity */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Technician Performance
              </h2>
              <p className="text-[11px] text-slate-500">Completed jobs & satisfaction score</p>
            </div>
            <button 
              onClick={() => setActiveTab('technicians')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Technicians & Benches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <TechnicianBarChart data={techPerformanceData} />
        </div>

        {/* Low Stock Spares Alerts */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('kpiLowStockAlerts')}
                  </h2>
                  <p className="text-[11px] text-slate-500">Require supplier procurement</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('inventory')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Catalog
              </button>
            </div>

            <div className="space-y-2 mt-3">
              {lowStockParts.length > 0 ? (
                lowStockParts.slice(0, 3).map(part => (
                  <div 
                    key={part.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{part.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{part.locationRack} • {part.partNumber}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {part.quantity} left
                      </span>
                      <button
                        onClick={() => restockSparePart(part.id, 5)}
                        className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold"
                        title="Quick Restock +5 units"
                      >
                        +5 Restock
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">All inventory parts above safety thresholds!</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
            <span>Critical alerts:</span>
            <span className="font-bold text-amber-600">{lowStockParts.length} items to order</span>
          </div>
        </div>

        {/* Customer Satisfaction & Google Review Summary */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    CSAT & Google Reviews
                  </h2>
                  <p className="text-[11px] text-slate-500">Post-service customer feedback</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('feedback')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                All Reviews
              </button>
            </div>

            <div className="flex items-center gap-4 my-2 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                {avgRating}
              </div>
              <div className="text-xs space-y-0.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {feedbacks.length} Verified Customer Ratings
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  NPS Score: +{npsScore} (Excellent)
                </p>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Review Routing Logic</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Ratings 4–5★ automatically trigger Google Business Map review prompt. Ratings ≤3★ route privately to Admin for swift service resolution.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('feedback')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            Manage Reviews & Public Widget
          </button>
        </div>
      </div>

      {/* Recent Jobs Table + Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs Table (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Repair Work Orders
              </h2>
              <p className="text-xs text-slate-500">
                Live tickets undergoing diagnostic & repair cycles
              </p>
            </div>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-1">{t('jobNumber')}</th>
                  <th className="pb-3">{t('customerName')}</th>
                  <th className="pb-3">{t('deviceBrandModel')}</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">{t('assignedTechnician')}</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {jobs.slice(0, 5).map((job) => {
                  const statusColors = getStatusColor(job.status);
                  return (
                    <tr 
                      key={job.id} 
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => onSelectJob(job)}
                    >
                      <td className="py-3 pl-1 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {job.jobNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{job.customerName}</div>
                        <div className="text-[10px] text-slate-400">{job.customerPhone}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-700 dark:text-slate-300">{job.deviceBrand} {job.deviceModel}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{job.issueDescription}</div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors.badgeClass}`}>
                          {t(`status_${job.status}`)}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {job.assignedTechnicianName || 'Unassigned'}
                      </td>
                      <td className="py-3 text-right pr-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectJob(job);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-semibold transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Appointments & Scheduled Deliveries (1 col) */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Today's Schedule
                  </h2>
                  <p className="text-[11px] text-slate-500">Intake bookings & doorstep pickups</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View
              </button>
            </div>

            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{apt.customerName}</span>
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {apt.timeSlot}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1">
                    {apt.deviceModel} ({apt.serviceType.replace('_', ' ')})
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {apt.issue}
                  </p>
                  {apt.pickupAddress && (
                    <div className="mt-1.5 text-[10px] text-teal-600 dark:text-teal-400 font-medium truncate">
                      📍 Pickup: {apt.pickupAddress}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('appointments')}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-xs font-bold text-white shadow-md transition"
          >
            + Book Service Appointment
          </button>
        </div>
      </div>
    </div>
  );
};
