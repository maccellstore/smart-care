import React, { useState } from 'react';
import { Appointment, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Smartphone, 
  MapPin, 
  FileText, 
  X, 
  Check, 
  Edit2, 
  Trash2 
} from 'lucide-react';

interface EditAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  onClose,
  onSuccess
}) => {
  const { updateAppointment, deleteAppointment } = useApp();

  const [customerName, setCustomerName] = useState(appointment.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(appointment.customerPhone || '');
  const [deviceModel, setDeviceModel] = useState(appointment.deviceModel || '');
  const [deviceType, setDeviceType] = useState<ServiceCategory>(appointment.deviceType || 'mobile');
  const [serviceType, setServiceType] = useState<'in_store' | 'pickup' | 'express'>(appointment.serviceType || 'in_store');
  const [pickupAddress, setPickupAddress] = useState(appointment.pickupAddress || '');
  const [appointmentDate, setAppointmentDate] = useState(appointment.appointmentDate || '');
  const [timeSlot, setTimeSlot] = useState(appointment.timeSlot || '11:00 AM - 12:00 PM');
  const [issue, setIssue] = useState(appointment.issue || '');
  const [status, setStatus] = useState<Appointment['status']>(appointment.status || 'scheduled');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deviceModel.trim()) return;

    updateAppointment(appointment.id, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deviceModel: deviceModel.trim(),
      deviceType,
      serviceType,
      pickupAddress: serviceType === 'pickup' ? pickupAddress.trim() : undefined,
      appointmentDate,
      timeSlot,
      issue: issue.trim(),
      status
    });

    onSuccess?.();
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Cancel and delete appointment booking for ${appointment.customerName}?`)) {
      deleteAppointment(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Edit Appointment Booking
              </h3>
              <p className="text-xs text-slate-500">
                Update customer contact info, scheduled slot, device or pickup address
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Customer Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Full Name"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98470 12345"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Device Model & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Device Model *
              </label>
              <div className="relative">
                <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="e.g. iPhone 14 Pro"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Device Category
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as ServiceCategory)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="mobile">Mobile Phone</option>
                <option value="macbook">Apple MacBook</option>
                <option value="laptop">Windows Laptop</option>
                <option value="tablet">iPad / Tablet</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-2 text-xs font-semibold focus:outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Service Type & Pickup Address */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Service Delivery Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['in_store', 'pickup', 'express'] as const).map(mode => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setServiceType(mode)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                    serviceType === mode
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {serviceType === 'pickup' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Doorstep Pickup Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Flat/House No, Landmark, Kannur"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Issue Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reported Issue / Symptoms
            </label>
            <textarea
              rows={2}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Battery drains rapidly, display flickers occasionally"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Booking</span>
            </button>

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
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
