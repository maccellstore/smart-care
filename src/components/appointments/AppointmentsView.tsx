import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { Appointment, ServiceCategory, Job } from '../../types';
import { 
  CalendarClock, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  X
} from 'lucide-react';

export const AppointmentsView: React.FC<{
  onSelectJob?: (job: Job) => void;
}> = () => {
  const { appointments, createAppointment, updateAppointmentStatus, createJob, customers, language, addToast, setActiveTab } = useApp();
  const t = useI18n(language);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showBookModal, setShowBookModal] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceType, setDeviceType] = useState<ServiceCategory>('mobile');
  const [serviceType, setServiceType] = useState<'in_store' | 'pickup' | 'express'>('in_store');
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [issue, setIssue] = useState('');
  const [isPickup, setIsPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');

  const filtered = appointments.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deviceModel) return;

    createAppointment({
      customerName,
      customerPhone,
      deviceType,
      deviceModel,
      serviceType: isPickup ? 'pickup' : serviceType,
      appointmentDate,
      timeSlot,
      issue: issue || 'Device diagnostic checkup',
      pickupAddress: isPickup ? pickupAddress : undefined,
      status: 'scheduled'
    });

    addToast('Appointment booked successfully!', 'success');
    setShowBookModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
    setIssue('');
  };

  const handleConvertToJob = (apt: Appointment) => {
    // Generate new job from appointment
    const existingCust = customers.find(c => c.phone === apt.customerPhone);
    const customerId = existingCust ? existingCust.id : `cust-${Date.now()}`;

    createJob({
      customerId,
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      customerEmail: existingCust?.email || '',
      category: apt.deviceType,
      deviceBrand: apt.deviceModel.split(' ')[0] || 'Generic',
      deviceModel: apt.deviceModel,
      serialOrImei: `SN-APT-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDescription: `[From Booking ${apt.timeSlot}] ${apt.issue}`,
      physicalCondition: 'Intake via appointment desk',
      priority: 'normal',
      status: 'received',
      estimatedCost: 3500,
      advancePaid: 0,
      dueDate: apt.appointmentDate
    });

    updateAppointmentStatus(apt.id, 'completed');
    addToast(`Work Order created from appointment!`, 'success');
    setActiveTab('jobs');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navAppointments')}
          </h1>
          <p className="text-xs text-slate-500">
            Customer intake calendar, scheduled bench visits & doorstep device pickup dispatch
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:from-sky-700 hover:to-blue-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              filterStatus === st
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {st} ({appointments.filter(a => st === 'all' ? true : a.status === st).length})
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-full">
                  {apt.appointmentDate} • {apt.timeSlot}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  apt.status === 'scheduled' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {apt.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {apt.customerName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{apt.customerPhone}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>Device:</span>
                  <span>{apt.deviceModel}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Service:</span>
                  <span className="capitalize">{apt.serviceType.replace('_', ' ')}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  "{apt.issue}"
                </p>
              </div>

              {apt.pickupAddress && (
                <div className="flex items-start gap-1.5 text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded-xl border border-teal-200/50">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="text-[11px]">Doorstep Pickup: {apt.pickupAddress}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              {apt.status !== 'completed' && apt.status !== 'cancelled' ? (
                <>
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                    className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                  >
                    Confirm Visit
                  </button>
                  <button
                    onClick={() => handleConvertToJob(apt)}
                    className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>Create Job</span>
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Appointment Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule Repair Appointment
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sreelakshmi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98460 12345"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Device Model *</label>
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="e.g. iPhone 14 Pro / Dell XPS 15"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Device Type</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value as ServiceCategory)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="mobile">Mobile Phone</option>
                    <option value="macbook">Apple MacBook</option>
                    <option value="laptop">Windows Laptop</option>
                    <option value="tablet">iPad / Tablet</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                  >
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>02:00 PM - 03:00 PM</option>
                    <option>04:00 PM - 05:00 PM</option>
                    <option>06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issue Details</label>
                <textarea
                  rows={2}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe failure symptoms..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs"
                />
              </div>

              {/* Doorstep Pickup Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={isPickup}
                    onChange={(e) => setIsPickup(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-0"
                  />
                  <span>Request Doorstep Pickup & Delivery (+₹150)</span>
                </label>
                {isPickup && (
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter pickup address, house/office number, landmarks"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs"
                  />
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
