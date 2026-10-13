import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Wrench, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { AppNotification } from '../../types';

interface GoogleSearchDiagnosisModalProps {
  notification: AppNotification | null;
  onClose: () => void;
  onConvertToJob: (data: { customerName?: string; customerPhone?: string; deviceModel?: string; issue?: string }) => void;
}

export const GoogleSearchDiagnosisModal: React.FC<GoogleSearchDiagnosisModalProps> = ({
  notification,
  onClose,
  onConvertToJob
}) => {
  const { markNotificationRead } = useApp();

  if (!notification) return null;

  const handleCreateJob = () => {
    markNotificationRead(notification.id);
    onConvertToJob({
      customerName: notification.customerName,
      customerPhone: notification.customerPhone,
      deviceModel: notification.deviceModel,
      issue: notification.issue || notification.message
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Google Search Grounded Diagnosis
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {notification.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Customer & Device Meta Pill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Customer</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {notification.customerName || 'Anonymous Customer'}
              </span>
              {notification.customerPhone && (
                <span className="text-slate-500 font-mono text-[11px] block mt-0.5">
                  {notification.customerPhone}
                </span>
              )}
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Device Model</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                {notification.deviceModel || 'General Electronics'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block font-semibold uppercase">Priority Level</span>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {notification.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Reported Issue */}
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Customer Reported Issue / Google Search Query:
            </span>
            <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-200">
              "{notification.issue || notification.message}"
            </div>
          </div>

          {/* Google Search Grounded Diagnosis Report */}
          {notification.diagnosis && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Google Search Diagnostic Findings & Parts Estimate</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {notification.diagnosis}
              </div>
            </div>
          )}

          {/* Web Search Queries Executed */}
          {notification.searchQueries && notification.searchQueries.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Google Search Queries Executed
              </span>
              <div className="flex flex-wrap gap-1.5">
                {notification.searchQueries.map((q, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{q}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grounding Source Links from Google Search */}
          {notification.groundingChunks && notification.groundingChunks.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Google Search Grounding Sources ({notification.groundingChunks.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notification.groundingChunks.map((chunk, i) => {
                  if (!chunk.web?.uri) return null;
                  return (
                    <a
                      key={i}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition group"
                    >
                      <div className="truncate pr-2">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate group-hover:text-blue-600 transition">
                          {chunk.web.title || chunk.web.uri}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">
                          {chunk.web.uri}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {notification.customerPhone && (
              <>
                <a
                  href={`tel:${notification.customerPhone}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/${notification.customerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(notification.customerName || 'Customer')},%20SmartCare%20Service%20Center%20received%20your%20repair%20inquiry%20for%20${encodeURIComponent(notification.deviceModel || 'your device')}.%20Our%20technician%20reviewed%20the%20Google%20diagnostic%20findings.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                markNotificationRead(notification.id);
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Dismiss
            </button>

            <button
              onClick={handleCreateJob}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Convert to Active Job Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
