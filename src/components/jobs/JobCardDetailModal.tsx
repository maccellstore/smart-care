import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n, getStatusColor } from '../../i18n/translations';
import { Job, JobStatus } from '../../types';
import { BarcodeVisual, QRCodeVisual } from '../common/QRCodeBarcode';
import { 
  X, 
  Wrench, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  DollarSign, 
  Printer, 
  MessageSquare, 
  FileText, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  FolderSync, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const JobCardDetailModal: React.FC<{
  job: Job | null;
  onClose: () => void;
  onPrintJob: (job: Job) => void;
  onGenerateInvoice: (job: Job) => void;
}> = ({ job, onClose, onPrintJob, onGenerateInvoice }) => {
  const { 
    updateJobStatus, 
    updateJob, 
    addJobPhoto, 
    addCustomerLog,
    language,
    users,
    addToast
  } = useApp();
  const t = useI18n(language);

  if (!job) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'parts' | 'timeline'>('overview');
  const [technicianNote, setTechnicianNote] = useState(job.technicianNotes || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoType, setPhotoType] = useState<'before' | 'after' | 'internal'>('after');
  const [photoCaption, setPhotoCaption] = useState('');

  const statusList: { key: JobStatus; label: string }[] = [
    { key: 'received', label: 'Received' },
    { key: 'diagnosing', label: 'Diagnosing' },
    { key: 'waiting_parts', label: 'Waiting Parts' },
    { key: 'in_repair', label: 'In Repair' },
    { key: 'testing', label: 'Testing' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStatusIdx = statusList.findIndex(s => s.key === job.status);
  const statusColors = getStatusColor(job.status);
  const balance = (job.finalCost || job.estimatedCost) - job.advancePaid;

  const handleSaveNotes = () => {
    updateJob(job.id, { technicianNotes: technicianNote });
    addToast('Technician notes saved', 'success');
  };

  const handleAddSamplePhoto = () => {
    const defaultUrls = [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ];
    const url = photoUrl || defaultUrls[Math.floor(Math.random() * defaultUrls.length)];
    const caption = photoCaption || `${photoType.toUpperCase()} inspection check at stage: ${job.status}`;
    addJobPhoto(job.id, url, photoType, caption);
    setPhotoUrl('');
    setPhotoCaption('');
  };

  const handleWhatsAppSend = () => {
    const cleanPhone = job.customerPhone.replace(/\D/g, '');
    const text = `SmartCare Service Update for ${job.customerName}: Your ${job.deviceBrand} ${job.deviceModel} (Job #${job.jobNumber}) is currently ${job.status.replace('_', ' ').toUpperCase()}. Estimated balance: ₹${balance}. View live progress: ${job.qrCodeData}`;
    addCustomerLog(job.customerId, 'whatsapp', text);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 font-mono font-bold text-sm">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Job #{job.jobNumber}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors.badgeClass}`}>
                  {t(`status_${job.status}`)}
                </span>
                {job.priority === 'urgent' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {job.deviceBrand} {job.deviceModel} • Received {job.receivedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintJob(job)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 transition"
              title="Print Physical Job Intake Card with Barcode"
            >
              <Printer className="w-4 h-4 text-blue-500" />
              <span>Job Card</span>
            </button>

            <button
              onClick={() => onGenerateInvoice(job)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold shadow-md hover:from-orange-600 hover:to-amber-700 transition"
              title="Generate GST Tax Invoice"
            >
              <FileText className="w-4 h-4" />
              <span>GST Invoice</span>
            </button>

            <button
              onClick={handleWhatsAppSend}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              title="Send WhatsApp Status Update"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Lifecycle Stepper */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Workflow Progress
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {statusList.map((st, idx) => {
              const isPastOrCurrent = currentStatusIdx >= idx;
              const isCurrent = job.status === st.key;

              return (
                <button
                  key={st.key}
                  onClick={() => updateJobStatus(job.id, st.key)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center text-xs transition ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : isPastOrCurrent
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-400'
                  }`}
                >
                  <span className="text-[10px] mb-0.5 opacity-80">Step {idx + 1}</span>
                  <span className="truncate w-full">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Inspection & Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Before / After Photos</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {job.photos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'parts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Spare Parts Installed</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {job.partsUsed.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Audit Trail & History
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details */}
            <div className="md:col-span-2 space-y-4">
              {/* Customer Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Customer & Contact
                </h4>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {job.customerName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      📞 {job.customerPhone} {job.customerEmail && `• ✉️ ${job.customerEmail}`}
                    </div>
                  </div>
                  <button
                    onClick={handleWhatsAppSend}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Device Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Device Hardware & Fault Dossier
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Brand / Model:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{job.deviceBrand} {job.deviceModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Serial / IMEI:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{job.serialOrImei}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Passcode / PIN:</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{job.passcodePattern || 'None'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">Issue Reported:</span>
                  <p className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {job.issueDescription}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">Physical Inspection (Enclosure, Scratches, Liquid):</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {job.physicalCondition}
                  </p>
                </div>
              </div>

              {/* Technician Repair Notes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-purple-500" />
                    <span>Technician Internal Bench Notes</span>
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={technicianNote}
                  onChange={(e) => setTechnicianNote(e.target.value)}
                  placeholder="Record diagnostics, logic board solder notes, voltage rail readings, replaced ICs..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right 1 Col: Barcode, QR, Financials */}
            <div className="space-y-4">
              {/* Financial Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200/70 dark:border-slate-700 space-y-2">
                <h4 className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                  Financial Summary
                </h4>
                <div className="flex justify-between text-xs py-1 border-b border-blue-100 dark:border-slate-700">
                  <span className="text-slate-500">Estimated Cost:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{job.estimatedCost}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-blue-100 dark:border-slate-700">
                  <span className="text-slate-500">Advance Paid:</span>
                  <span className="font-mono font-bold text-emerald-600">₹{job.advancePaid}</span>
                </div>
                <div className="flex justify-between text-xs py-1.5 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Balance Due:</span>
                  <span className={`font-mono text-sm ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{balance}
                  </span>
                </div>
              </div>

              {/* Barcode & QR Code Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Live Barcode & QR Label
                </div>
                
                <BarcodeVisual value={job.jobNumber} width={190} height={42} />

                <div className="pt-2">
                  <QRCodeVisual value={job.qrCodeData} size={110} />
                </div>

                <p className="text-[10px] text-slate-400">
                  Scan with smartphone camera to view live status on SmartCare customer portal
                </p>

                <button
                  onClick={() => onPrintJob(job)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                >
                  Print Adhesive Label
                </button>
              </div>

              {/* Google Drive Folder Sync Notice */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <FolderSync className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Google Drive Sync:</span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                    /SmartCare/Jobs/{job.jobNumber}/
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Before / After Photos */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Add Photo Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Upload Device Inspection Image (Google Drive Auto-Synced)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Photo Stage</label>
                  <select
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="before">Before Repair (Intake)</option>
                    <option value="internal">Internal / Logic Board</option>
                    <option value="after">After Repair (Finished)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">Image Caption / Defect Note</label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="e.g. Broken OLED glass / Liquid residue on capacitors"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddSamplePhoto}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 shadow-md transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Sync</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {job.photos.length > 0 ? (
                job.photos.map((photo) => (
                  <div 
                    key={photo.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                        photo.type === 'before' ? 'bg-rose-600' : photo.type === 'after' ? 'bg-emerald-600' : 'bg-purple-600'
                      }`}>
                        {photo.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {photo.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{photo.uploadedAt}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">Drive ID: {photo.driveFileId?.substring(0, 10)}...</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center text-slate-400">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No photos attached yet. Click "Upload & Sync" to capture or upload intake pictures.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Spare Parts Installed */}
        {activeTab === 'parts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Installed Replacement Components
                </h4>
                <p className="text-xs text-slate-500">
                  Linked to technician personal spare inventory and billing invoice
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-semibold">
                    <th className="py-2.5 pl-4">Part Description</th>
                    <th className="py-2.5">SKU / Number</th>
                    <th className="py-2.5">Quantity</th>
                    <th className="py-2.5">Unit Price</th>
                    <th className="py-2.5">Warranty</th>
                    <th className="py-2.5 pr-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {job.partsUsed.length > 0 ? (
                    job.partsUsed.map((part, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 pl-4 font-semibold text-slate-800 dark:text-slate-200">
                          {part.partName}
                        </td>
                        <td className="py-3 font-mono text-[11px] text-slate-500">
                          {part.partNumber}
                        </td>
                        <td className="py-3 font-bold">{part.quantity}</td>
                        <td className="py-3 font-mono">₹{part.unitPrice}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            {part.warrantyMonths} Months
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                          ₹{part.quantity * part.unitPrice}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No spare parts logged yet. Issue parts from the "Technician Spares" module.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Trail / History */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Status Change Log & Audit History
            </h4>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {job.statusHistory.map((hist, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {hist.status.replace('_', ' ')}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">{hist.changedAt}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {hist.note || 'Status transitioned'}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      By: {hist.changedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
