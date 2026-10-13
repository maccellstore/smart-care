import React from 'react';
import { User, Job, TechnicianSpareLedgerItem } from '../../types';
import { AlertTriangle, X, Trash2, ShieldAlert, ArrowRight } from 'lucide-react';

interface DeleteTechnicianModalProps {
  technician: User;
  jobs: Job[];
  sparesLedger: TechnicianSpareLedgerItem[];
  onClose: () => void;
  onConfirmDelete: (technicianId: string) => void;
}

export const DeleteTechnicianModal: React.FC<DeleteTechnicianModalProps> = ({
  technician,
  jobs,
  sparesLedger,
  onClose,
  onConfirmDelete
}) => {
  const activeJobs = jobs.filter(
    j => j.assignedTechnicianId === technician.id && j.status !== 'delivered' && j.status !== 'cancelled'
  );

  const benchSpares = sparesLedger.filter(
    ts => ts.technicianId === technician.id && ts.status === 'in_use'
  );
  const totalSparesUnits = benchSpares.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-rose-200/80 dark:border-rose-900/60 overflow-hidden">
        {/* Top Warning Banner */}
        <div className="p-6 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-b border-rose-100 dark:border-rose-950/60">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Delete Technician?
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Permanent removal from staff directory
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Technician Profile Card preview */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <img
              src={technician.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={technician.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                {technician.name}
              </h4>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 block font-semibold truncate">
                {technician.workbench || 'Bench Station'}
              </span>
              <span className="text-[11px] text-slate-500">
                {technician.phone}
              </span>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{technician.name}</strong> from the service team?
          </p>

          {/* Active Jobs & Spares Safeguard Notice */}
          <div className="space-y-2">
            {activeJobs.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{activeJobs.length} Active Work Order(s) Assigned</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  These customer repairs will be safely returned to the general unassigned bench queue so no work is delayed or lost.
                </p>
              </div>
            )}

            {totalSparesUnits > 0 && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{totalSparesUnits} Component(s) on Bench</span>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  Custody records remain logged in the Workbench Spares Ledger for administrative audit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirmDelete(technician.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete Technician</span>
          </button>
        </div>
      </div>
    </div>
  );
};
