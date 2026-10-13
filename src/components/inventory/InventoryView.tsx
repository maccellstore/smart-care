import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import { SparePart, ServiceCategory } from '../../types';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  PackagePlus, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  DollarSign, 
  X,
  Sparkles
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { spareParts, addSparePart, restockSparePart, language, searchQuery, setSearchQuery, addToast } = useApp();
  const t = useI18n(language);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showAddPartModal, setShowAddPartModal] = useState(false);

  // New Part form state
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('mobile');
  const [compatibleModels, setCompatibleModels] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(1200);
  const [sellingPrice, setSellingPrice] = useState(2500);
  const [quantity, setQuantity] = useState(10);
  const [minStock, setMinStock] = useState(3);
  const [locationRack, setLocationRack] = useState('Rack B-2');
  const [supplierName, setSupplierName] = useState('iFix Kerala Wholesale');
  const [supplierContact, setSupplierContact] = useState('+91 98470 55443');

  // Filtered parts
  const filteredParts = spareParts.filter(part => {
    if (showLowStockOnly && part.quantity > part.minStockThreshold) return false;
    if (categoryFilter !== 'all' && part.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = part.name.toLowerCase().includes(q);
      const matchNumber = part.partNumber.toLowerCase().includes(q);
      const matchRack = part.locationRack.toLowerCase().includes(q);
      const matchModels = part.compatibleModels.some(m => m.toLowerCase().includes(q));
      if (!matchName && !matchNumber && !matchRack && !matchModels) return false;
    }
    return true;
  });

  // Inventory valuation
  const totalStockUnits = spareParts.reduce((sum, p) => sum + p.quantity, 0);
  const totalValuationCost = spareParts.reduce((sum, p) => sum + (p.quantity * p.purchasePrice), 0);
  const totalRetailValuation = spareParts.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
  const lowStockCount = spareParts.filter(p => p.quantity <= p.minStockThreshold).length;

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName) return;

    addSparePart({
      name: partName,
      partNumber: partNumber || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      brand: 'Multi-Brand',
      compatibleModels: compatibleModels.split(',').map(m => m.trim()),
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      quantity: Number(quantity) || 0,
      minStockThreshold: Number(minStock) || 2,
      locationRack: locationRack || 'Rack A-1',
      supplierName: supplierName || 'Local Distributor',
      supplierContact: supplierContact || '+91 98470 00000'
    });

    addToast(`Spare part "${partName}" added to catalog`, 'success');
    setShowAddPartModal(false);
    setPartName('');
    setPartNumber('');
    setCompatibleModels('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navInventory')}
          </h1>
          <p className="text-xs text-slate-500">
            Hardware components, OEM screens, batteries, chips & warehouse rack locations
          </p>
        </div>

        <button
          onClick={() => setShowAddPartModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* Valuation KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total SKUs</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {spareParts.length} Parts
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{totalStockUnits} total items in bins</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Purchase Valuation</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            ₹{(totalValuationCost / 1000).toFixed(1)}k
          </div>
          <span className="text-[11px] text-slate-500 font-medium">At wholesale cost</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Retail Valuation</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ₹{(totalRetailValuation / 1000).toFixed(1)}k
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">+{(totalRetailValuation - totalValuationCost).toLocaleString('en-IN')} gross margin</span>
        </div>

        <div 
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            showLowStockOnly
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${showLowStockOnly ? 'text-amber-100' : 'text-slate-400'}`}>
            Low Stock Alerts
          </span>
          <div className={`text-2xl font-extrabold mt-1 ${showLowStockOnly ? 'text-white' : 'text-amber-600'}`}>
            {lowStockCount} Parts
          </div>
          <span className={`text-[11px] font-semibold ${showLowStockOnly ? 'text-amber-100' : 'text-amber-600'}`}>
            {showLowStockOnly ? 'Filtered: Click to reset' : 'Click to filter low stock'}
          </span>
        </div>
      </div>

      {/* Filter and Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Service Categories</option>
            <option value="mobile">Mobile Phones</option>
            <option value="macbook">MacBook & iMac</option>
            <option value="laptop">Windows Laptops</option>
            <option value="tablet">iPads & Tablets</option>
            <option value="accessories">Accessories</option>
            <option value="electronics">Electronics</option>
          </select>

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              showLowStockOnly
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Only ({lowStockCount})</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredParts.length}</strong> catalog components
        </span>
      </div>

      {/* Parts Table */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3.5 pl-4">Part Specification</th>
                <th className="py-3.5">SKU / Number</th>
                <th className="py-3.5">Compatible Models</th>
                <th className="py-3.5">Bin / Rack</th>
                <th className="py-3.5">Purchase / Selling</th>
                <th className="py-3.5">Stock Level</th>
                <th className="py-3.5 pr-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredParts.map((part) => {
                const isLow = part.quantity <= part.minStockThreshold;

                return (
                  <tr key={part.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 pl-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {part.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {part.supplierName} • {part.supplierContact}
                      </div>
                    </td>

                    <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300 font-bold">
                      {part.partNumber}
                    </td>

                    <td className="py-3.5 max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {part.compatibleModels.map((m, idx) => (
                          <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {part.locationRack}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="font-mono text-slate-500 line-through text-[11px]">
                        ₹{part.purchasePrice}
                      </div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        ₹{part.sellingPrice}
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          isLow
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {part.quantity} in stock
                        </span>
                        {isLow && (
                          <span className="text-[10px] font-bold text-amber-600">
                            (Min: {part.minStockThreshold})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => restockSparePart(part.id, 1)}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 transition"
                          title="Restock +1 unit"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => restockSparePart(part.id, 5)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-[10px] font-bold shadow-xs transition"
                          title="Restock +5 units"
                        >
                          +5
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

      {/* Add Spare Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Replacement Component
              </h3>
              <button onClick={() => setShowAddPartModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPart} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Part Description *</label>
                <input
                  type="text"
                  required
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  placeholder="e.g. MacBook Pro 14 M1 Pro Retina Screen Assembly"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Part Number / SKU</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. LCD-MBP-A2442"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="mobile">Mobile</option>
                    <option value="macbook">MacBook</option>
                    <option value="laptop">Laptop</option>
                    <option value="tablet">Tablet</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Compatible Models (Comma Separated)</label>
                <input
                  type="text"
                  value={compatibleModels}
                  onChange={(e) => setCompatibleModels(e.target.value)}
                  placeholder="MacBook Pro A2442, MacBook Pro 14 2021"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Purchase Price (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rack / Bin</label>
                  <input
                    type="text"
                    value={locationRack}
                    onChange={(e) => setLocationRack(e.target.value)}
                    placeholder="Rack A-1"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
