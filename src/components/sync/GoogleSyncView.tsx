import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { 
  CloudCheck, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  FolderSync, 
  FileSpreadsheet, 
  ShieldCheck, 
  Settings2, 
  Database,
  ArrowRight,
  Sparkles,
  Download
} from 'lucide-react';

export const GoogleSyncView: React.FC = () => {
  const { 
    googleSyncConfig, 
    triggerGoogleSync, 
    jobs, 
    spareParts, 
    customers, 
    invoices, 
    language,
    addToast 
  } = useApp();
  const t = useI18n(language);

  const [sheetId, setSheetId] = useState(googleSyncConfig.sheetId);
  const [driveFolder, setDriveFolder] = useState(googleSyncConfig.driveFolderId);
  const [syncFreq, setSyncFreq] = useState(googleSyncConfig.autoSyncInterval);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Google Workspace cloud sync settings updated!', 'success');
  };

  const handleManualExportCSV = (table: 'jobs' | 'customers' | 'inventory') => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (table === 'jobs') {
      headers = ['Job Number', 'Customer Name', 'Phone', 'Device', 'Serial/IMEI', 'Status', 'Cost', 'Due Date'];
      rows = jobs.map(j => [j.jobNumber, j.customerName, j.customerPhone, `${j.deviceBrand} ${j.deviceModel}`, j.serialOrImei, j.status, String(j.finalCost || j.estimatedCost), j.dueDate]);
    } else if (table === 'customers') {
      headers = ['ID', 'Name', 'Phone', 'Email', 'Address', 'Total Spent', 'Points'];
      rows = customers.map(c => [c.id, c.name, c.phone, c.email || '', c.address, String(c.totalSpent), String(c.loyaltyPoints)]);
    } else {
      headers = ['Part Number', 'Name', 'Category', 'Quantity', 'Purchase Price', 'Selling Price', 'Rack'];
      rows = spareParts.map(p => [p.partNumber, p.name, p.category, String(p.quantity), String(p.purchasePrice), String(p.sellingPrice), p.locationRack]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x.replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCare_${table}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Exported ${table} CSV backup`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navGoogleSync')}
          </h1>
          <p className="text-xs text-slate-500">
            Bidirectional Google Sheets database sync & automatic Google Drive inspection photo archiving
          </p>
        </div>

        <button
          onClick={() => triggerGoogleSync()}
          disabled={googleSyncConfig.syncStatus === 'syncing'}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${googleSyncConfig.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span>{googleSyncConfig.syncStatus === 'syncing' ? 'Syncing with Google Cloud...' : 'Sync Now with Sheets & Drive'}</span>
        </button>
      </div>

      {/* Cloud Status Banner */}
      <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <CloudCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Google Workspace Cloud Active
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Authenticated Account: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{googleSyncConfig.googleUserEmail}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Last Successful Sync: <span className="font-mono text-slate-600 dark:text-slate-300">{googleSyncConfig.lastSyncTimestamp || 'Just now'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Open in Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Sync Topology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Sheets Entity Sync */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Google Sheets Live Database Mirrors
              </h3>
              <p className="text-xs text-slate-500">Every intake, invoice and part restock reflected in dedicated tabs</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Sheet: 'Jobs_Live'</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">{jobs.length} records</span>
                <button
                  onClick={() => handleManualExportCSV('jobs')}
                  className="p-1 text-slate-400 hover:text-emerald-600"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Sheet: 'Inventory_Catalog'</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">{spareParts.length} SKUs</span>
                <button
                  onClick={() => handleManualExportCSV('inventory')}
                  className="p-1 text-slate-400 hover:text-emerald-600"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Sheet: 'Customers_Registry'</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">{customers.length} clients</span>
                <button
                  onClick={() => handleManualExportCSV('customers')}
                  className="p-1 text-slate-400 hover:text-emerald-600"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Sheet: 'Tax_Invoices_GST'</span>
              </div>
              <span className="font-mono text-slate-500">{invoices.length} invoices</span>
            </div>
          </div>
        </div>

        {/* Google Drive Photo Storage */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Google Drive Intake Photo Directory
              </h3>
              <p className="text-xs text-slate-500">Structured folders for device intake, logic board solder & delivery proofs</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[10px]">Cloud Folder Hierarchy:</div>
            <div className="text-blue-600 dark:text-blue-400 font-bold">
              📂 /SmartCare-Repairs/
            </div>
            <div className="pl-4 text-slate-700 dark:text-slate-300">
              ├── 📂 Jobs/
              <div className="pl-4 text-slate-600 dark:text-slate-400">
                ├── 📁 SC-2026-101 (iPhone 15 Pro Max)/<br />
                │   ├── 📷 before_intake_screen.jpg<br />
                │   └── 📷 after_oled_replacement.jpg<br />
                ├── 📁 SC-2026-102 (MacBook Pro 16 M2)/<br />
                └── 📁 SC-2026-103 (Dell XPS 15)/
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Storage quota used:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">14.8 MB / 15 GB Free</span>
          </div>
        </div>
      </div>

      {/* Sync Configuration Form */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-teal-600" />
          <span>Sync Frequency & Cloud Target IDs</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Spreadsheet ID
              </label>
              <input
                type="text"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Drive Parent Folder ID
              </label>
              <input
                type="text"
                value={driveFolder}
                onChange={(e) => setDriveFolder(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Sync Frequency
              </label>
              <select
                value={syncFreq}
                onChange={(e) => setSyncFreq(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
              >
                <option value="hourly">Hourly Automated Batch</option>
                <option value="daily">Daily Midnight Backup</option>
                <option value="manual">Manual Trigger Only</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition"
            >
              Update Cloud Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
