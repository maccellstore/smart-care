import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  PlusCircle, 
  Menu, 
  PhoneCall, 
  Boxes, 
  ShieldAlert, 
  Receipt,
  Smartphone
} from 'lucide-react';

export const MobileNav: React.FC<{ 
  onToggleSidebar: () => void; 
  onOpenNewJob: () => void;
}> = ({ onToggleSidebar, onOpenNewJob }) => {
  const { activeTab, setActiveTab, currentRole } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 lg:hidden">
      {/* Role specific Left Button */}
      {currentRole === 'technician' ? (
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'jobs'
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span>My Jobs</span>
        </button>
      ) : currentRole === 'receptionist' ? (
        <button
          onClick={() => setActiveTab('receptionist')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'receptionist'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <PhoneCall className="w-5 h-5 mb-0.5" />
          <span>Front Desk</span>
        </button>
      ) : currentRole === 'customer' ? (
        <button
          onClick={() => setActiveTab('customer-portal')}
          className={`flex flex-col items-center justify-center w-16 py-1 text-[10px] font-medium transition ${
            activeTab === 'customer-portal'
              ? 'text-violet-600 dark:text-violet-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span>Tracker</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>
      )}

      {/* Role specific Second Button */}
      {currentRole === 'technician' ? (
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'inventory'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Boxes className="w-5 h-5 mb-0.5" />
          <span>Spares</span>
        </button>
      ) : currentRole === 'customer' ? (
        <button
          onClick={() => setActiveTab('customer-portal')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'customer-portal'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span>Services</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'jobs'
              ? 'text-purple-600 dark:text-purple-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span>Jobs</span>
        </button>
      )}

      {/* Floating Center Action Button */}
      {currentRole !== 'customer' ? (
        <button
          onClick={onOpenNewJob}
          className="flex flex-col items-center justify-center -mt-5 h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition"
          title="New Job Card"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('customer-portal')}
          className="flex flex-col items-center justify-center -mt-5 h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-teal-500 text-white shadow-lg shadow-violet-500/30 active:scale-95 transition"
          title="My Repairs"
        >
          <Smartphone className="w-6 h-6" />
        </button>
      )}

      {/* Role specific Third Button */}
      {currentRole === 'receptionist' ? (
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'customers'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Clients</span>
        </button>
      ) : currentRole === 'technician' ? (
        <button
          onClick={() => setActiveTab('technicians')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'technicians'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span>Bench</span>
        </button>
      ) : currentRole === 'customer' ? (
        <button
          onClick={() => setActiveTab('customer-portal')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition text-slate-500 hover:text-slate-800 dark:text-slate-400`}
        >
          <Receipt className="w-5 h-5 mb-0.5 text-teal-500" />
          <span>Bill</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition ${
            activeTab === 'customers'
              ? 'text-teal-600 dark:text-teal-400 font-bold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Clients</span>
        </button>
      )}

      {/* Menu / More Button */}
      <button
        onClick={onToggleSidebar}
        className="flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 transition"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>Menu</span>
      </button>
    </nav>
  );
};
