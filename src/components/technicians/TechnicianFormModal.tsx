import React, { useState } from 'react';
import { User } from '../../types';
import { 
  X, 
  UserPlus, 
  Edit2, 
  Check, 
  Sparkles, 
  Wrench, 
  Phone, 
  Mail, 
  Award, 
  ShieldAlert, 
  Trash2,
  SlidersHorizontal,
  Image,
  Building2
} from 'lucide-react';

interface TechnicianFormModalProps {
  technician?: User | null;
  onClose: () => void;
  onSave: (techData: Omit<User, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<User>) => void;
  onDelete?: (technician: User) => void;
  existingCount: number;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
];

const BENCH_PRESETS = [
  'Bench #1 - Logic Board Micro-Soldering Cleanroom',
  'Bench #2 - BGA Rework & Chipset Station',
  'Bench #3 - Mobile & iPad Display Precision Station',
  'Bench #4 - MacBook Power Delivery & Audio Bench',
  'Bench #5 - Windows Laptop Thermal & GPU Station',
  'Bench #6 - General Diagnostics & Fast-Track Intake'
];

const SKILL_PRESETS = [
  'MacBook Logic Board',
  'iPhone IC & Display',
  'Micro-Soldering',
  'BGA Rework',
  'Windows Gaming Laptops',
  'iPad & Tablets',
  'Liquid Damage Ultrasonic',
  'Battery & Power IC',
  'FaceID & Sensors',
  'BIOS / Firmware Flash'
];

const CERT_PRESETS = [
  'Apple Certified Mac Technician (ACMT)',
  'IPC-7711/7721 Rework Specialist',
  'ESD-Safe Station Certified',
  'Level 4 Chip-Level Master',
  'Microsoft Surface Certified'
];

export const TechnicianFormModal: React.FC<TechnicianFormModalProps> = ({
  technician,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  existingCount
}) => {
  const isEditing = Boolean(technician);

  // Form states
  const [name, setName] = useState(technician?.name || '');
  const [phone, setPhone] = useState(technician?.phone || '+91 ');
  const [email, setEmail] = useState(technician?.email || '');
  const [emergencyContact, setEmergencyContact] = useState(technician?.emergencyContact || '');
  const [workbench, setWorkbench] = useState(technician?.workbench || `Bench #${existingCount + 1} - Precision Desk`);
  const [status, setStatus] = useState<'active' | 'busy' | 'on_leave'>(technician?.status || 'active');
  const [experienceYears, setExperienceYears] = useState(technician?.experienceYears ?? 4);
  const [commissionRate, setCommissionRate] = useState(technician?.commissionRate ?? 15);
  const [monthlyTarget, setMonthlyTarget] = useState(technician?.monthlyTarget ?? 45);
  const [address, setAddress] = useState(technician?.address || 'Kannur Service Hub');
  const [notes, setNotes] = useState(technician?.notes || '');
  const [avatar, setAvatar] = useState(
    technician?.avatar || PRESET_AVATARS[existingCount % PRESET_AVATARS.length]
  );
  
  // Skills tags
  const [specializations, setSpecializations] = useState<string[]>(
    technician?.specialization || ['MacBook Logic Board', 'Micro-Soldering']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Certifications tags
  const [certifications, setCertifications] = useState<string[]>(
    technician?.certifications || ['Apple Certified Mac Technician (ACMT)', 'ESD-Safe Station Certified']
  );
  const [customCertInput, setCustomCertInput] = useState('');

  const handleToggleSkill = (skill: string) => {
    if (specializations.includes(skill)) {
      setSpecializations(specializations.filter(s => s !== skill));
    } else {
      setSpecializations([...specializations, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      if (!specializations.includes(customSkillInput.trim())) {
        setSpecializations([...specializations, customSkillInput.trim()]);
      }
      setCustomSkillInput('');
    }
  };

  const handleToggleCert = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleAddCustomCert = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customCertInput.trim()) {
      e.preventDefault();
      if (!certifications.includes(customCertInput.trim())) {
        setCertifications([...certifications, customCertInput.trim()]);
      }
      setCustomCertInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim()) {
      return;
    }

    if (isEditing && technician) {
      onUpdate(technician.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        emergencyContact: emergencyContact.trim(),
        workbench: workbench.trim(),
        status,
        experienceYears: Number(experienceYears),
        commissionRate: Number(commissionRate),
        monthlyTarget: Number(monthlyTarget),
        address: address.trim(),
        notes: notes.trim(),
        avatar: avatar.trim(),
        specialization: specializations,
        certifications
      });
    } else {
      onSave({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role: 'technician',
        emergencyContact: emergencyContact.trim(),
        workbench: workbench.trim(),
        status,
        experienceYears: Number(experienceYears),
        commissionRate: Number(commissionRate),
        monthlyTarget: Number(monthlyTarget),
        address: address.trim(),
        notes: notes.trim(),
        avatar: avatar.trim(),
        specialization: specializations,
        certifications,
        rating: 5.0,
        totalRepairsCompleted: 0,
        joinedDate: new Date().toISOString().substring(0, 10)
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              {isEditing ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isEditing ? `Edit Technician: ${technician?.name}` : 'Add New Technician to Staff'}
              </h3>
              <p className="text-xs text-slate-500">
                Setup workbench station, skill capabilities, contact info, and commission share
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Avatar Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Technician Profile Photo
            </label>
            <div className="flex items-center gap-3">
              <img
                src={avatar || PRESET_AVATARS[0]}
                alt="Selected"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] text-slate-500 block">
                  Select a quick profile portrait or paste image link:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setAvatar(url)}
                      className={`w-7 h-7 rounded-xl overflow-hidden border-2 transition ${
                        avatar === url ? 'border-blue-600 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sreejith Menon"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98470 12345"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech@smartcare.service"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+91 94470 54321"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Workbench Station Selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Allocated Workbench Station *
            </label>
            <div className="space-y-2">
              <select
                value={BENCH_PRESETS.includes(workbench) ? workbench : 'custom'}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    setWorkbench(e.target.value);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold focus:outline-none"
              >
                {BENCH_PRESETS.map((bp, idx) => (
                  <option key={idx} value={bp}>{bp}</option>
                ))}
                <option value="custom">-- Custom Workbench Station --</option>
              </select>

              <input
                type="text"
                value={workbench}
                onChange={(e) => setWorkbench(e.target.value)}
                placeholder="Custom station name (e.g. Bench #7 - Cleanroom BGA)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Duty Status, Experience, Commission & Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Work Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-semibold"
              >
                <option value="active">🟢 Active Duty</option>
                <option value="busy">🟡 Bench Full / Busy</option>
                <option value="on_leave">🔴 On Leave</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Labor Share (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-mono font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Repairs/Mo
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-mono font-bold text-emerald-600"
              />
            </div>
          </div>

          {/* Specialization Skills Selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Technical Specializations & Core Competencies
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SKILL_PRESETS.map((tag) => {
                const isSelected = specializations.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleSkill(tag)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              placeholder="Type custom specialization and press Enter..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Certifications & Badges */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Professional Certifications & Compliance
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CERT_PRESETS.map((cert) => {
                const isSelected = certifications.includes(cert);
                return (
                  <button
                    type="button"
                    key={cert}
                    onClick={() => handleToggleCert(cert)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cert}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={customCertInput}
              onChange={(e) => setCustomCertInput(e.target.value)}
              onKeyDown={handleAddCustomCert}
              placeholder="Type additional certification and press Enter..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Branch Location & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Branch / Desk Location
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Kannur Service Hub - Floor 1"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Internal Remarks / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key equipment: Quick 861DW hot air, Hakko iron"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isEditing && technician && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(technician);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Technician</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Register Technician'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
