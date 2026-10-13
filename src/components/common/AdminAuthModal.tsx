import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  KeyRound, 
  AlertCircle,
  Wrench,
  PhoneCall,
  Briefcase
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetRole?: UserRole;
  title?: string;
  subtitle?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole = 'admin',
  title,
  subtitle
}) => {
  const { adminSecurity, verifyRolePassword, addToast } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const roleMeta: Record<UserRole, {
    label: string;
    defaultPasswordHint: string;
    defaultTitle: string;
    defaultSubtitle: string;
    bgGradient: string;
    icon: React.ReactNode;
    badgeColor: string;
  }> = {
    admin: {
      label: 'Administrator',
      defaultPasswordHint: adminSecurity.passwordHash || 'admin123',
      defaultTitle: 'Administrator Clearance',
      defaultSubtitle: 'Enter master admin password to unlock all management tools',
      bgGradient: 'from-purple-900 via-indigo-950 to-slate-900',
      icon: <Shield className="w-5 h-5 text-white" />,
      badgeColor: 'bg-purple-500/30 text-purple-200 border-purple-400/30'
    },
    manager: {
      label: 'Manager Workspace',
      defaultPasswordHint: adminSecurity.managerPassword || 'manager123',
      defaultTitle: 'Manager Authentication',
      defaultSubtitle: 'Enter manager password to access oversight, reports & team view',
      bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
      icon: <Briefcase className="w-5 h-5 text-white" />,
      badgeColor: 'bg-blue-500/30 text-blue-200 border-blue-400/30'
    },
    technician: {
      label: 'Technician Workbench',
      defaultPasswordHint: adminSecurity.technicianPassword || 'tech123',
      defaultTitle: 'Technician Workbench Login',
      defaultSubtitle: 'Enter technician password to access repairs, spares & test logs',
      bgGradient: 'from-amber-900 via-stone-950 to-slate-900',
      icon: <Wrench className="w-5 h-5 text-white" />,
      badgeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/30'
    },
    receptionist: {
      label: 'Front Desk / Receptionist',
      defaultPasswordHint: adminSecurity.receptionistPassword || 'reception123',
      defaultTitle: 'Reception Desk Login',
      defaultSubtitle: 'Enter front desk password to access intake, calls, client bills & pickup',
      bgGradient: 'from-pink-900 via-rose-950 to-slate-900',
      icon: <PhoneCall className="w-5 h-5 text-white" />,
      badgeColor: 'bg-pink-500/30 text-pink-200 border-pink-400/30'
    },
    customer: {
      label: 'Customer Portal',
      defaultPasswordHint: 'Open Access',
      defaultTitle: 'Customer Portal Access',
      defaultSubtitle: 'Public customer repair tracking & feedback portal',
      bgGradient: 'from-violet-900 via-slate-950 to-slate-900',
      icon: <UserIcon className="w-5 h-5 text-white" />,
      badgeColor: 'bg-violet-500/30 text-violet-200 border-violet-400/30'
    }
  };

  const meta = roleMeta[targetRole];
  const modalTitle = title || meta.defaultTitle;
  const modalSubtitle = subtitle || meta.defaultSubtitle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isValid = verifyRolePassword(targetRole, password);
    if (!isValid) {
      setError(`Incorrect password for ${meta.label} panel. Please verify and try again.`);
      return;
    }

    addToast(`Authenticated as ${meta.label}!`, 'success');
    setPassword('');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${meta.bgGradient} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-md">
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  {modalTitle}
                </h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {modalSubtitle}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta.badgeColor}`}>
              <Lock className="w-2.5 h-2.5" />
              <span>Password-Protected Role: {meta.label}</span>
            </span>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {meta.label} Panel Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder={`Enter ${meta.label.toLowerCase()} password`}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Default PIN / Password:</span>
            </div>
            <button
              type="button"
              onClick={() => setPassword(meta.defaultPasswordHint)}
              className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900 font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition active:scale-95"
              title="Click to autofill"
            >
              {meta.defaultPasswordHint}
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Unlock {meta.label}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
