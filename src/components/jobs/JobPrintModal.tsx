import React from 'react';
import { Job } from '../../types';
import { BarcodeVisual, QRCodeVisual } from '../common/QRCodeBarcode';
import { X, Printer } from 'lucide-react';

export const JobPrintModal: React.FC<{
  job: Job | null;
  onClose: () => void;
}> = ({ job, onClose }) => {
  if (!job) return null;

  const handlePrint = () => {
    window.print();
  };

  const balance = (job.finalCost || job.estimatedCost) - job.advancePaid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Top Action Bar (hidden in print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print Document</span>
        </button>
        <button
          onClick={onClose}
          className="rounded-xl p-2.5 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Printable Paper Document (A4 format style) */}
      <div className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl print-container my-8 font-sans border border-slate-200 text-xs">
        {/* Document Header */}
        <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-blue-600">SmartCare</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Service Center
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Apple MacBook, iPhone, Windows Laptops & Multi-Brand Electronics Specialist
            </p>
            <p className="text-[10px] text-slate-500">
              Fort Road, Kannur, Kerala - 670001 | Phone: +91 98470 12345 | Email: support@smartcare.service
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              GSTIN: 32AABCS1429B1ZB • State Code: 32 (Kerala)
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs">
              JOB INTAKE CARD
            </span>
            <div className="mt-2">
              <BarcodeVisual value={job.jobNumber} width={160} height={36} />
            </div>
          </div>
        </div>

        {/* Job Meta Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Details</span>
            <div className="text-sm font-bold text-slate-900">{job.customerName}</div>
            <div className="text-slate-600 font-mono">Phone: {job.customerPhone}</div>
            {job.customerEmail && <div className="text-slate-500">{job.customerEmail}</div>}
          </div>

          <div className="text-right">
            <div className="space-y-0.5">
              <div className="text-slate-500">Job Card #: <strong className="font-mono text-slate-900">{job.jobNumber}</strong></div>
              <div className="text-slate-500">Date Received: <strong className="text-slate-900">{job.receivedDate}</strong></div>
              <div className="text-slate-500">Est. Delivery: <strong className="text-slate-900">{job.dueDate}</strong></div>
              <div className="text-slate-500">Technician: <strong className="text-slate-900">{job.assignedTechnicianName || 'Bench Queue'}</strong></div>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="py-4 border-b border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Device & Inspection Specification</span>
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Brand & Model</span>
              <strong className="text-slate-900">{job.deviceBrand} {job.deviceModel}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Serial / IMEI</span>
              <strong className="font-mono text-slate-900">{job.serialOrImei}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Passcode / PIN</span>
              <strong className="font-mono text-slate-900">{job.passcodePattern || 'N/A'}</strong>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <span className="text-[10px] text-slate-500 block">Fault / Problem Reported:</span>
              <p className="font-medium text-slate-800 bg-slate-50 p-2 rounded border border-slate-200">
                {job.issueDescription}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Physical Cosmetic State:</span>
              <p className="text-slate-600 text-[11px]">
                {job.physicalCondition}
              </p>
            </div>
          </div>
        </div>

        {/* Financials & QR Code */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b border-slate-200 items-center">
          <div className="col-span-2 space-y-1">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Estimated Repair Cost:</span>
              <span className="font-mono font-bold">₹{job.estimatedCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Advance Paid:</span>
              <span className="font-mono font-bold text-emerald-700">₹{job.advancePaid.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 font-bold text-sm bg-slate-50 px-2 rounded">
              <span>Estimated Balance at Delivery:</span>
              <span className="font-mono text-blue-700">₹{balance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <QRCodeVisual value={job.qrCodeData} size={84} />
            <span className="text-[9px] text-slate-500 font-bold mt-1">Scan for Live Status</span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="pt-3 text-[9px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700 uppercase">Customer Terms & Service Agreement:</p>
          <ol className="list-decimal pl-4 space-y-0.5">
            <li>Customer must present this original job intake slip or registered phone OTP at time of delivery.</li>
            <li>SmartCare is not liable for existing data loss. Customers are advised to maintain independent backups prior to service.</li>
            <li>Devices not collected within 45 days after ready notification will incur daily storage charges of ₹50/day.</li>
            <li>Replacement parts come with specified hardware warranty (3 to 12 months) covering manufacturing defects only. Liquid or physical damage is not covered under warranty.</li>
          </ol>
        </div>

        {/* Signature Box */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-4">
          <div className="text-center pt-8 border-t border-slate-300">
            <span className="text-[10px] text-slate-600 font-semibold block">Customer Signature</span>
          </div>
          <div className="text-center pt-8 border-t border-slate-300">
            <span className="text-[10px] text-slate-600 font-semibold block">Authorised Service Representative</span>
          </div>
        </div>
      </div>
    </div>
  );
};
