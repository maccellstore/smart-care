import React from 'react';
import { User, Job, TechnicianSpareLedgerItem } from '../../types';
import { 
  X, 
  Phone, 
  Mail, 
  MessageSquare, 
  Wrench, 
  Award, 
  Star, 
  Calendar, 
  Boxes, 
  ArrowRightLeft, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building2,
  Clock,
  Briefcase
} from 'lucide-react';

interface TechnicianDetailsModalProps {
  technician: User;
  jobs: Job[];
  sparesLedger: TechnicianSpareLedgerItem[];
  onClose: () => void;
  onEdit: (technician: User) => void;
  onDelete: (technician: User) => void;
  onIssueSpare: (technicianId: string) => void;
  onReturnSpare: (ledgerId: string) => void;
  onStatusChange: (technicianId: string, status: 'active' | 'busy' | 'on_leave') => void;
  onSelectJob?: (job: Job) => void;
}

export const TechnicianDetailsModal: React.FC<TechnicianDetailsModalProps> = ({
  technician,
  jobs,
  sparesLedger,
  onClose,
  onEdit,
  onDelete,
  onIssueSpare,
  onReturnSpare,
  onStatusChange,
  onSelectJob
}) => {
  const activeJobs = jobs.filter(
    j => j.assignedTechnicianId === technician.id && j.status !== 'delivered' && j.status !== 'cancelled'
  );
  
  const completedJobs = jobs.filter(
    j => j.assignedTechnicianId === technician.id && (j.status === 'delivered' || j.status === 'ready')
  );

  const benchSpares = sparesLedger.filter(
    ts => ts.technicianId === technician.id && ts.status === 'in_use'
  );
  const totalSparesCount = benchSpares.reduce((sum, s) => sum + s.quantity, 0);

  // Clean phone number for tel & WhatsApp
  const rawPhone = technician.phone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  const statusConfig = {
    active: {
      label: 'Active on Duty',
      color: 'bg-emerald-500 text-white',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
    },
    busy: {
      label: 'Bench Full / Busy',
      color: 'bg-amber-500 text-white',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
    },
    on_leave: {
      label: 'On Leave',
      color: 'bg-rose-500 text-white',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
    }
  };

  const currentStatus = technician.status || 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={technician.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={technician.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <span 
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${statusConfig[currentStatus].color}`}
                title={statusConfig[currentStatus].label}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {technician.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
                  Staff ID: {technician.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig[currentStatus].badge}`}>
                  {statusConfig[currentStatus].label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-indigo-300 font-semibold">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{technician.workbench || 'Bench #1 - Cleanroom'}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{technician.rating || 5.0} Rating</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{technician.experienceYears || 4} Years Experience</span>
                </div>
              </div>
            </div>

            {/* Quick Status Dropdown */}
            <div className="self-end sm:self-center">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Change Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => onStatusChange(technician.id, e.target.value as any)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:bg-slate-800"
              >
                <option value="active" className="text-slate-900">🟢 Active Duty</option>
                <option value="busy" className="text-slate-900">🟡 Bench Full / Busy</option>
                <option value="on_leave" className="text-slate-900">🔴 On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Contact & Communication Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${technician.phone}`}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 hover:bg-blue-100 transition"
            >
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  Call Technician
                </span>
                <span className="text-xs font-mono font-bold truncate block">
                  {technician.phone}
                </span>
              </div>
            </a>

            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition"
            >
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  WhatsApp Direct
                </span>
                <span className="text-xs font-bold truncate block">
                  Open Chat
                </span>
              </div>
            </a>

            <a
              href={`mailto:${technician.email}`}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100 transition"
            >
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Email Address
                </span>
                <span className="text-xs font-medium truncate block">
                  {technician.email}
                </span>
              </div>
            </a>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Queue</span>
              <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
                {activeJobs.length} Jobs
              </div>
              <span className="text-[10px] text-slate-400">On bench right now</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Repaired</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {technician.totalRepairsCompleted || 0}
              </div>
              <span className="text-[10px] text-slate-400">Verified successful fixes</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Labor Share</span>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {technician.commissionRate ?? 15}%
              </div>
              <span className="text-[10px] text-slate-400">Commission on repairs</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bench Spares</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                {totalSparesCount} Units
              </div>
              <span className="text-[10px] text-slate-400">{benchSpares.length} components held</span>
            </div>
          </div>

          {/* Workbench & Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Skills */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Specialization Skills
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(technician.specialization && technician.specialization.length > 0
                  ? technician.specialization
                  : ['Logic Board Repair', 'Display IC Calibration', 'Precision Soldering']
                ).map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications & Workplace details */}
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Certifications & Compliance
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(technician.certifications && technician.certifications.length > 0
                  ? technician.certifications
                  : ['Apple Certified Mac Technician (ACMT)', 'IPC-7711 Rework Specialist', 'ESD-Safe Workstation Certified']
                ).map((cert, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"
                  >
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional details: Emergency Contact, Address & Notes */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Emergency Contact</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {technician.emergencyContact || '+91 94470 00000'}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Service Center Branch</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {technician.address || 'Kannur Main Hub - Bench Floor 1'}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Joined Organization</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {technician.joinedDate || '2021-03-10'}
              </p>
            </div>
          </div>

          {/* Active Repair Queue Assigned to this Tech */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Active Repair Work Orders ({activeJobs.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                Devices assigned to {technician.name.split(' ')[0]}'s bench
              </span>
            </div>

            {activeJobs.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                No jobs currently in active queue. Technician is ready to receive new device assignments.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                {activeJobs.map(job => (
                  <div 
                    key={job.id} 
                    onClick={() => onSelectJob?.(job)}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                          {job.jobNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {job.deviceBrand} {job.deviceModel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        Customer: <strong className="text-slate-700 dark:text-slate-300">{job.customerName}</strong> — {job.issueDescription}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                        ₹{(job.finalCost || job.estimatedCost).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Due: {job.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bench Spares Currently Held */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Components in Workbench Custody ({benchSpares.length} items / {totalSparesCount} units)
                </h4>
              </div>

              <button
                onClick={() => onIssueSpare(technician.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Issue Parts to Bench</span>
              </button>
            </div>

            {benchSpares.length === 0 ? (
              <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
                No spare parts currently checked out. All unused parts are safely deposited in central store.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Component Name</th>
                      <th className="py-2.5 px-3">Part #</th>
                      <th className="py-2.5 px-3">Qty Held</th>
                      <th className="py-2.5 px-3">Checked Out</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {benchSpares.map(spare => (
                      <tr key={spare.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {spare.partName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                          {spare.partNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                          {spare.quantity} units
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                          {spare.issuedDate}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onReturnSpare(spare.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition"
                          >
                            Return to Store
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={() => onDelete(technician)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Technician</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>

            <button
              onClick={() => onEdit(technician)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details & Workbench</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
