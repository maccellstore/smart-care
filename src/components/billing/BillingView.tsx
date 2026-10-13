import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { Invoice, PaymentMode, InvoiceItem, Job } from '../../types';
import { 
  Receipt, 
  Search, 
  Plus, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  X, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export const BillingView: React.FC<{
  onSelectJob?: (job: Job) => void;
}> = () => {
  const { invoices, jobs, createInvoice, recordInvoicePayment, language, searchQuery, addToast } = useApp();
  const t = useI18n(language);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states for new invoice
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [laborCharge, setLaborCharge] = useState(1500);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode>('upi');
  const [paidNow, setPaidNow] = useState(1500);

  // Financial summary
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.paymentStatus !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
      const matchCust = inv.customerName.toLowerCase().includes(q);
      const matchJob = inv.jobNumber?.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchJob) return false;
    }
    return true;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    // Build line items matching InvoiceItem
    const items: InvoiceItem[] = [
      ...job.partsUsed.map(p => ({
        description: `${p.partName} (${p.partNumber})`,
        hsnSacCode: '8471',
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        taxRatePercent: 18,
        amount: p.quantity * p.unitPrice
      })),
      {
        description: `Professional Service & Diagnostic Labor (${job.deviceBrand} ${job.deviceModel})`,
        hsnSacCode: '9987',
        quantity: 1,
        unitPrice: Number(laborCharge),
        taxRatePercent: 18,
        amount: Number(laborCharge)
      }
    ];

    const subTotal = items.reduce((sum, it) => sum + it.amount, 0);
    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const grandTotal = Math.round(subTotal + cgst + sgst);

    const paid = Number(paidNow) || 0;
    const balance = Math.max(0, grandTotal - paid);
    const paymentStatus: 'paid' | 'partial' | 'unpaid' = balance === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid';

    createInvoice({
      jobId: job.id,
      jobNumber: job.jobNumber,
      customerId: job.customerId,
      customerName: job.customerName,
      customerPhone: job.customerPhone,
      customerAddress: 'Fort Road, Kannur, Kerala - 670001',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
      items,
      subTotal,
      discount: 0,
      cgst,
      sgst,
      igst: 0,
      totalAmount: grandTotal,
      paidAmount: paid,
      balanceDue: balance,
      paymentStatus,
      paymentMode: selectedPaymentMode
    });

    addToast('GST Tax Invoice created', 'success');
    setShowNewInvoiceModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navBilling')}
          </h1>
          <p className="text-xs text-slate-500">
            GST compliant invoicing, HSN/SAC code breakdown, UPI QR payments & settlement receipts
          </p>
        </div>

        <button
          onClick={() => setShowNewInvoiceModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create GST Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">{invoices.length} Tax Invoices Issued</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Collected</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Cleared via UPI & Cash</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Due</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-rose-600 font-medium">Collectible on device delivery</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid in Full</option>
              <option value="partial">Partially Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 dark:text-slate-100">{filteredInvoices.length}</strong> invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 pl-4">Invoice #</th>
                <th className="py-3.5">Job Ticket</th>
                <th className="py-3.5">Customer</th>
                <th className="py-3.5">Date</th>
                <th className="py-3.5">Mode</th>
                <th className="py-3.5">Total (₹)</th>
                <th className="py-3.5">Balance</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <td className="py-3.5 pl-4 font-mono font-bold text-orange-600 dark:text-orange-400">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3.5 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {inv.jobNumber || 'Direct Sale'}
                  </td>

                  <td className="py-3.5">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {inv.customerName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {inv.customerPhone}
                    </div>
                  </td>

                  <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                    {inv.date}
                  </td>

                  <td className="py-3.5">
                    <span className="font-mono uppercase font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {inv.paymentMode}
                    </span>
                  </td>

                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 font-mono">
                    {inv.balanceDue > 0 ? (
                      <span className="text-rose-600 font-bold">₹{inv.balanceDue}</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">₹0</span>
                    )}
                  </td>

                  <td className="py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : inv.paymentStatus === 'partial'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {inv.paymentStatus.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold"
                      >
                        View & Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail & Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          {/* Action buttons (hidden in print) */}
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-lg transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={() => setSelectedInvoice(null)}
              className="rounded-xl p-2.5 bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white shadow-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Invoice Container */}
          <div className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 p-8 shadow-2xl print-container my-8 font-sans border border-slate-200 text-xs space-y-6">
            {/* Invoice Header */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-blue-600">SmartCare</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Service Center
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Apple Authorized Standard Electronic Services & Multi-Device Diagnostic Lab
                </p>
                <p className="text-[10px] text-slate-500">
                  Fort Road, Kannur, Kerala - 670001 | Phone: +91 98470 12345
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  GSTIN: 32AABCS1429B1ZB • State: Kerala (32)
                </p>
              </div>

              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                  TAX INVOICE
                </span>
                <div className="text-right mt-2 space-y-0.5">
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-slate-500">Date: {selectedInvoice.date}</div>
                  <div className="text-slate-500 font-mono">Job #: {selectedInvoice.jobNumber || 'Direct'}</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To Customer</span>
                <div className="text-sm font-bold text-slate-900">{selectedInvoice.customerName}</div>
                <div className="text-slate-600 font-mono">Phone: {selectedInvoice.customerPhone}</div>
                <div className="text-slate-500">{selectedInvoice.customerAddress}</div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Information</span>
                <div>Mode: <strong className="uppercase font-mono">{selectedInvoice.paymentMode}</strong></div>
                <div>Status: <strong className="uppercase text-emerald-700">{selectedInvoice.paymentStatus}</strong></div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2 pl-3">Description</th>
                  <th className="py-2">HSN/SAC</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">GST Rate</th>
                  <th className="py-2 pr-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 pl-3 font-medium text-slate-900">{it.description}</td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500">{it.hsnSacCode}</td>
                    <td className="py-2.5 text-center">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{it.unitPrice}</td>
                    <td className="py-2.5 text-right font-mono text-[11px] text-slate-500">{it.taxRatePercent}%</td>
                    <td className="py-2.5 pr-3 text-right font-mono font-bold">₹{it.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Calculation */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Taxable Subtotal:</span>
                  <span className="font-mono font-bold">₹{selectedInvoice.subTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">CGST (9%):</span>
                  <span className="font-mono font-medium">₹{selectedInvoice.cgst.toFixed(1)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">SGST (9%):</span>
                  <span className="font-mono font-medium">₹{selectedInvoice.sgst.toFixed(1)}</span>
                </div>
                <div className="flex justify-between py-2 border-y-2 border-slate-900 font-bold text-sm">
                  <span>Grand Total (Incl. GST):</span>
                  <span className="font-mono text-blue-700">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-700">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoice.balanceDue > 0 && (
                  <div className="flex justify-between py-1 text-rose-600 font-bold">
                    <span>Balance Due:</span>
                    <span className="font-mono">₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Signatures */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[10px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700">Payment & Warranty Note:</p>
                <p>This is a computer generated tax invoice. Replaced electronic components carry a limited warranty as per company service terms.</p>
              </div>
              <div className="text-center pt-8 border-t border-slate-300">
                <span className="font-semibold text-slate-700">For SmartCare Service Center</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Generate GST Invoice for Job
              </h3>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Completed Repair Job *
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.jobNumber} — {j.customerName} ({j.deviceBrand} {j.deviceModel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service & Diagnostic Labor Fee (₹)
                </label>
                <input
                  type="number"
                  value={laborCharge}
                  onChange={(e) => setLaborCharge(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={selectedPaymentMode}
                    onChange={(e) => setSelectedPaymentMode(e.target.value as PaymentMode)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="upi">UPI / QR Code</option>
                    <option value="cash">Cash Counter</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="net_banking">NEFT / NetBanking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Received Now (₹)
                  </label>
                  <input
                    type="number"
                    value={paidNow}
                    onChange={(e) => setPaidNow(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md"
                >
                  Generate Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
