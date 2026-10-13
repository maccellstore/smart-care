import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { TechnicianSpareLedgerItem, User, Job } from '../../types';
import { TechnicianDetailsModal } from './TechnicianDetailsModal';
import { TechnicianFormModal } from './TechnicianFormModal';
import { DeleteTechnicianModal } from './DeleteTechnicianModal';
import { 
  ShieldAlert, 
  Wrench, 
  ArrowRightLeft, 
  PackageCheck, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  Plus, 
  Boxes, 
  AlertCircle,
  X,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Star,
  Activity,
  Award,
  Calendar,
  Briefcase,
  Check,
  Percent,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  LayoutGrid,
  List,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const TechnicianSparesView: React.FC = () => {
  const { 
    technicianLedger, 
    spareParts, 
    users, 
    jobs, 
    issueSpareToTechnician, 
    returnTechnicianSpare, 
    markSpareMissing,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    language,
    addToast
  } = useApp();
  const t = useI18n(language);

  // Sub-tabs: Roster or Spares
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'spares'>('roster');

  // View Mode: Grid cards vs Table
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Spares sub-view filter
  const [selectedTechId, setSelectedTechId] = useState<string>('all');
  const [showIssueModal, setShowIssueModal] = useState(false);

  // Form states for issuing spare
  const [issueTechId, setIssueTechId] = useState('usr-2');
  const [issuePartId, setIssuePartId] = useState(spareParts[0]?.id || '');
  const [issueQty, setIssueQty] = useState(1);
  const [issueJobId, setIssueJobId] = useState('');
  const [issueNotes, setIssueNotes] = useState('');

  // Roster filters
  const [rosterSearch, setRosterSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'busy' | 'on_leave'>('all');

  // Modals
  const [selectedDetailTech, setSelectedDetailTech] = useState<User | null>(null);
  const [editingTech, setEditingTech] = useState<User | null>(null);
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [deletingTech, setDeletingTech] = useState<User | null>(null);

  const techs = users.filter(u => u.role === 'technician');

  // Filtered technicians
  const filteredTechs = techs.filter(tech => {
    if (statusFilter !== 'all' && (tech.status || 'active') !== statusFilter) return false;
    if (rosterSearch.trim()) {
      const q = rosterSearch.toLowerCase();
      const matchName = (tech.name || '').toLowerCase().includes(q);
      const matchBench = (tech.workbench || '').toLowerCase().includes(q);
      const matchSpec = (tech.specialization || []).some(s => s.toLowerCase().includes(q));
      const matchCert = (tech.certifications || []).some(c => c.toLowerCase().includes(q));
      const matchPhone = (tech.phone || '').includes(q);
      const matchEmail = (tech.email || '').toLowerCase().includes(q);
      if (!matchName && !matchBench && !matchSpec && !matchCert && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  // Filtered tech spares currently in_use
  const filteredTechSpares = technicianLedger.filter(ts => {
    if (ts.status !== 'in_use') return false;
    if (selectedTechId !== 'all' && ts.technicianId !== selectedTechId) return false;
    return true;
  });

  const handleStatusChange = (techId: string, newStatus: 'active' | 'busy' | 'on_leave') => {
    updateTechnician(techId, { status: newStatus });
    if (selectedDetailTech?.id === techId) {
      setSelectedDetailTech(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const part = spareParts.find(p => p.id === issuePartId);
    if (!part) return;

    if (part.quantity < issueQty) {
      addToast(`Only ${part.quantity} units available in central store!`, 'error');
      return;
    }

    issueSpareToTechnician(issueTechId, issuePartId, Number(issueQty), issueJobId || undefined, issueNotes);
    addToast('Spare component checked out to technician workbench', 'success');
    setShowIssueModal(false);
  };

  const handleReturn = (ledgerId: string) => {
    returnTechnicianSpare(ledgerId, 'Returned in original sealed condition');
  };

  const handleMissing = (ledgerId: string) => {
    if (window.confirm('Mark this spare component as missing / damaged on bench?')) {
      markSpareMissing(ledgerId, 'Damaged during bench installation');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Technicians & Workbenches
              </h1>
              <p className="text-xs text-slate-500">
                Staff directory, workbench assignments, technical specializations, repair metrics & spare parts custody
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'roster' ? (
            <button
              onClick={() => setShowAddTechModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Technician</span>
            </button>
          ) : (
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Issue Parts to Technician</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'roster'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Technician Staff Roster ({techs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('spares')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'spares'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Workbench Spares Ledger ({technicianLedger.filter(l => l.status === 'in_use').length})</span>
          </button>
        </div>

        {activeSubTab === 'roster' && (
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table Directory View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SUB-VIEW 1: TECHNICIAN STAFF ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Techs</span>
              <div className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
                {techs.filter(t => (t.status || 'active') === 'active').length} / {techs.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">On active bench stations</p>
            </div>

            <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Jobs in Progress</span>
              <div className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">
                {jobs.filter(j => j.status === 'in_repair' || j.status === 'diagnosing' || j.status === 'testing').length}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Under active bench repair</p>
            </div>

            <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Repairs</span>
              <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {techs.reduce((sum, t) => sum + (t.totalRepairsCompleted || 0), 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Lifetime verified fixes</p>
            </div>

            <div className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Spares on Benches</span>
              <div className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">
                {technicianLedger.filter(l => l.status === 'in_use').reduce((sum, s) => sum + s.quantity, 0)} units
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">In workbench custody</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Technicians ({techs.length})
              </button>

              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === 'active'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Active Duty
              </button>

              <button
                onClick={() => setStatusFilter('busy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === 'busy'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Bench Full / Busy
              </button>

              <button
                onClick={() => setStatusFilter('on_leave')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === 'on_leave'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                On Leave
              </button>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                placeholder="Search technician, workbench, skill, cert..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTechs.map(tech => {
                const activeJobs = jobs.filter(
                  j => j.assignedTechnicianId === tech.id && j.status !== 'delivered' && j.status !== 'cancelled'
                );
                const benchSpares = technicianLedger.filter(
                  ts => ts.technicianId === tech.id && ts.status === 'in_use'
                );
                const totalSparesUnits = benchSpares.reduce((sum, s) => sum + s.quantity, 0);

                const statusDot = 
                  (tech.status || 'active') === 'active' 
                    ? 'bg-emerald-500' 
                    : tech.status === 'busy' 
                    ? 'bg-amber-500' 
                    : 'bg-rose-500';

                return (
                  <div
                    key={tech.id}
                    className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3.5">
                      {/* Top Profile Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div 
                          onClick={() => setSelectedDetailTech(tech)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <img
                              src={tech.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                              alt={tech.name}
                              className="w-13 h-13 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs group-hover:ring-2 group-hover:ring-blue-500 transition"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${statusDot}`}
                              title={`Status: ${tech.status || 'active'}`}
                            />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition flex items-center gap-1">
                              <span>{tech.name}</span>
                            </h3>
                            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">
                              {tech.workbench || 'Bench Station'}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{tech.rating || 5.0}</span>
                              <span className="text-slate-400 font-normal">({tech.experienceYears || 4} yrs exp)</span>
                            </div>
                          </div>
                        </div>

                        {/* Top quick actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedDetailTech(tech)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="View Full Technician Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingTech(tech)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="Edit Technician Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTech(tech)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                            title="Delete Technician"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact row */}
                      <div className="space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px]">{tech.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11px] truncate">{tech.email}</span>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                          Core Expertise
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(tech.specialization || ['Device Diagnostics']).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {(tech.specialization?.length || 0) > 3 && (
                            <span 
                              onClick={() => setSelectedDetailTech(tech)}
                              className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                            >
                              +{(tech.specialization?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Operational Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <span className="text-[10px] text-slate-400 block font-semibold">Queue</span>
                          <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                            {activeJobs.length}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <span className="text-[10px] text-slate-400 block font-semibold">Repaired</span>
                          <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                            {tech.totalRepairsCompleted || 0}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <span className="text-[10px] text-slate-400 block font-semibold">Labor Share</span>
                          <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                            {tech.commissionRate || 15}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedDetailTech(tech)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        onClick={() => {
                          setIssueTechId(tech.id);
                          setShowIssueModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Issue Parts</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                      <th className="py-3.5 pl-4">Technician</th>
                      <th className="py-3.5">Workbench Station</th>
                      <th className="py-3.5">Status</th>
                      <th className="py-3.5">Contact</th>
                      <th className="py-3.5">Skills</th>
                      <th className="py-3.5">Active Queue</th>
                      <th className="py-3.5">Lifetime Repaired</th>
                      <th className="py-3.5">Labor Share</th>
                      <th className="py-3.5 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredTechs.map(tech => {
                      const activeJobs = jobs.filter(
                        j => j.assignedTechnicianId === tech.id && j.status !== 'delivered' && j.status !== 'cancelled'
                      );

                      const statusBadge = 
                        (tech.status || 'active') === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                          : tech.status === 'busy' 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' 
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';

                      return (
                        <tr key={tech.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3 pl-4">
                            <div 
                              onClick={() => setSelectedDetailTech(tech)}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <img
                                src={tech.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={tech.name}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition">
                                  {tech.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {tech.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                            {tech.workbench || 'Bench Station'}
                          </td>

                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusBadge}`}>
                              {(tech.status || 'active').replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3">
                            <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{tech.phone}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{tech.email}</div>
                          </td>

                          <td className="py-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {(tech.specialization || []).slice(0, 2).map((s, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 font-mono font-bold text-purple-600">
                            {activeJobs.length} jobs
                          </td>

                          <td className="py-3 font-mono font-bold text-emerald-600">
                            {tech.totalRepairsCompleted || 0}
                          </td>

                          <td className="py-3 font-mono font-bold text-blue-600">
                            {tech.commissionRate ?? 15}%
                          </td>

                          <td className="py-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedDetailTech(tech)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingTech(tech)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                                title="Edit Technician"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingTech(tech)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                                title="Delete Technician"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: WORKBENCH SPARES LEDGER */}
      {activeSubTab === 'spares' && (
        <div className="space-y-6">
          {/* Technician Filter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setSelectedTechId('all')}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedTechId === 'all'
                  ? 'bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950/70 dark:border-blue-400 dark:text-blue-100 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">All Workbenches</span>
                <Boxes className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold mt-1">
                {technicianLedger.filter(l => l.status === 'in_use').reduce((sum: number, s: TechnicianSpareLedgerItem) => sum + s.quantity, 0)} Units
              </div>
              <span className="text-[11px] text-slate-500">Across {techs.length} technicians</span>
            </div>

            {techs.map(tech => {
              const techItems = technicianLedger.filter(ts => ts.technicianId === tech.id && ts.status === 'in_use');
              const totalUnits = techItems.reduce((sum: number, s: TechnicianSpareLedgerItem) => sum + s.quantity, 0);
              const isSelected = selectedTechId === tech.id;

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-purple-50 border-purple-500 text-purple-900 dark:bg-purple-950/70 dark:border-purple-400 dark:text-purple-100 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{tech.name}</span>
                    <Wrench className="w-4 h-4 text-purple-500 shrink-0" />
                  </div>
                  <div className="text-2xl font-extrabold mt-1">
                    {totalUnits} Units
                  </div>
                  <span className="text-[11px] text-slate-500">{techItems.length} unique parts held</span>
                </div>
              );
            })}
          </div>

          {/* Main Table: Spares Currently with Technicians */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bench Inventory & Custody Records
                </h3>
                <p className="text-xs text-slate-500">Items checked out by technicians for repair operations</p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredTechSpares.length} assigned records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                    <th className="py-3.5 pl-4">Technician</th>
                    <th className="py-3.5">Spare Part Description</th>
                    <th className="py-3.5">SKU / Number</th>
                    <th className="py-3.5">Quantity with Tech</th>
                    <th className="py-3.5">Date Issued</th>
                    <th className="py-3.5">Linked Job Ticket</th>
                    <th className="py-3.5 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredTechSpares.length > 0 ? (
                    filteredTechSpares.map((ts: TechnicianSpareLedgerItem) => {
                      return (
                        <tr key={ts.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3.5 pl-4">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {ts.technicianName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Tech ID: {ts.technicianId}
                            </div>
                          </td>

                          <td className="py-3.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {ts.partName}
                            </span>
                          </td>

                          <td className="py-3.5 font-mono text-[11px] text-slate-500 font-bold">
                            {ts.partNumber}
                          </td>

                          <td className="py-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              {ts.quantity} units
                            </span>
                          </td>

                          <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                            {ts.issuedDate}
                          </td>

                          <td className="py-3.5">
                            {ts.jobNumber ? (
                              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                                {ts.jobNumber}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">In Bench Tray</span>
                            )}
                          </td>

                          <td className="py-3.5 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReturn(ts.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition shadow-xs"
                                title="Return unused spare back to central store"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Return to Store</span>
                              </button>

                              <button
                                onClick={() => handleMissing(ts.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 text-[11px] font-semibold transition"
                                title="Mark as damaged or scrap"
                              >
                                <AlertCircle className="w-3 h-3" />
                                <span>Scrap</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No active spares assigned to selected technician workbenches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TECHNICIAN DETAILS MODAL */}
      {selectedDetailTech && (
        <TechnicianDetailsModal
          technician={selectedDetailTech}
          jobs={jobs}
          sparesLedger={technicianLedger}
          onClose={() => setSelectedDetailTech(null)}
          onEdit={(tech) => {
            setSelectedDetailTech(null);
            setEditingTech(tech);
          }}
          onDelete={(tech) => {
            setSelectedDetailTech(null);
            setDeletingTech(tech);
          }}
          onIssueSpare={(techId) => {
            setIssueTechId(techId);
            setShowIssueModal(true);
          }}
          onReturnSpare={handleReturn}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* MODAL 2: ADD / EDIT TECHNICIAN FORM */}
      {(showAddTechModal || editingTech) && (
        <TechnicianFormModal
          technician={editingTech}
          existingCount={techs.length}
          onClose={() => {
            setShowAddTechModal(false);
            setEditingTech(null);
          }}
          onSave={(data) => {
            addTechnician(data);
          }}
          onUpdate={(id, updates) => {
            updateTechnician(id, updates);
          }}
          onDelete={(tech) => {
            setEditingTech(null);
            setDeletingTech(tech);
          }}
        />
      )}

      {/* MODAL 3: DELETE CONFIRMATION MODAL */}
      {deletingTech && (
        <DeleteTechnicianModal
          technician={deletingTech}
          jobs={jobs}
          sparesLedger={technicianLedger}
          onClose={() => setDeletingTech(null)}
          onConfirmDelete={(id) => {
            deleteTechnician(id);
            setDeletingTech(null);
          }}
        />
      )}

      {/* MODAL 4: ISSUE SPARE TO TECH */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Issue Parts from Central Store
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Technician *
                </label>
                <select
                  value={issueTechId}
                  onChange={(e) => setIssueTechId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                >
                  {techs.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.workbench || 'Bench'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Component from Store *
                </label>
                <select
                  value={issuePartId}
                  onChange={(e) => setIssuePartId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium"
                >
                  {spareParts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (In Store: {p.quantity} | {p.locationRack})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Work Order (Optional)
                </label>
                <select
                  value={issueJobId}
                  onChange={(e) => setIssueJobId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium"
                >
                  <option value="">Hold in Workbench Tray</option>
                  {jobs.filter(j => j.status !== 'delivered').map(j => (
                    <option key={j.id} value={j.id}>
                      {j.jobNumber} — {j.customerName} ({j.deviceBrand} {j.deviceModel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Issue
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bench Note / Justification
                </label>
                <input
                  type="text"
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  placeholder="e.g. Screen replacement allocation"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  Transfer to Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
