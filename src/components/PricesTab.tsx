import React from 'react';
import { Sliders, Database, User, Check, Edit2 } from 'lucide-react';

interface ResourceRecord {
  key: string;
  name: string;
  unit: string;
  totalQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PricesTabProps {
  materials: ResourceRecord[];
  wages: ResourceRecord[];
  equipments: ResourceRecord[];
  editingResourceKey: string | null;
  editingResourceVal: number;
  setEditingResourceVal: (val: number) => void;
  handleStartEditPrice: (key: string, val: number) => void;
  handleSavePrice: (key: string) => void;
  resetAllPrices: () => void;
  formatIDR: (num: number) => string;
  setActiveTab: (tab: 'upload' | 'mapping' | 'prices' | 'summary') => void;
}

export default function PricesTab({
  materials,
  wages,
  equipments,
  editingResourceKey,
  editingResourceVal,
  setEditingResourceVal,
  handleStartEditPrice,
  handleSavePrice,
  resetAllPrices,
  formatIDR,
  setActiveTab,
}: PricesTabProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-amber-50 border border-amber-100 text-amber-950 rounded-xl p-4.5 flex items-start gap-3 shadow-sm text-xs leading-relaxed">
        <Sliders className="h-5 w-5 text-amber-650 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-amber-900">Optimasi Margin Lapangan dengan Supplier & Upah Area</p>
          <p className="text-slate-650 mt-1">
            Daftar komponen di bawah ini dikumpulkan dari seluruh rincian hasil pemetaan AHSP sebelumnya. **Ubah harga porsi luar** untuk menguji penawaran nyata dari toko supplier Anda. Nilai total anggaran pelaksanaan lapangan (RAP) dan margin kesehatan kontraktor akan ter-update seketika!
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="text-xs font-semibold text-slate-500">Modifikasi harga satuan sementara:</span>
        <button
          onClick={resetAllPrices}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg border border-slate-200 transition-all shadow-sm cursor-pointer"
        >
          Reset ke Harga Standard PUPR
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materials Registry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 p-2 rounded-lg text-xs border border-indigo-100/30">
              <Database className="h-4 w-4" />
            </span>
            Katalog Pembelian Bahan / Material Proyek
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wide">
                  <th className="p-2 py-3">Uraian Bahan Fisik</th>
                  <th className="p-2 py-3 text-center">Unit</th>
                  <th className="p-2 py-3 text-right">Kebutuhan</th>
                  <th className="p-2 py-3 text-right">Harga Satuan (Rp)</th>
                  <th className="p-2 py-3 text-right w-28">Subtotal PO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((mat) => (
                  <tr key={mat.key} className="hover:bg-slate-50/70 transition duration-150">
                    <td className="p-2 font-semibold text-slate-700">{mat.name}</td>
                    <td className="p-2 text-center text-slate-400 font-bold uppercase">{mat.unit}</td>
                    <td className="p-2 text-right font-mono text-indigo-700 font-bold">{mat.totalQuantity.toFixed(1)}</td>
                    <td className="p-2 text-right text-indigo-650">
                      {editingResourceKey === mat.key ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <input
                            type="number"
                            value={editingResourceVal}
                            onChange={(e) => setEditingResourceVal(Number(e.target.value))}
                            className="w-20 text-xs font-mono border border-indigo-400 rounded px-1.5 py-0.5 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button onClick={() => handleSavePrice(mat.key)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md shadow-sm transition">
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditPrice(mat.key, mat.unitPrice)}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50 border-b border-dashed border-indigo-300 px-1 py-0.5 rounded font-mono font-semibold inline-flex items-center gap-1 transition"
                        >
                          {formatIDR(mat.unitPrice)} <Edit2 className="h-2.5 w-2.5 text-indigo-400" />
                        </button>
                      )}
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-slate-800">{formatIDR(mat.totalPrice)}</td>
                  </tr>
                ))}
                {materials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">Tidak ada komponen bahan yang digunakan dalam pemetaan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Labor & Equipment Registry */}
        <div className="space-y-6">
          {/* Labor Registry */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="bg-amber-50 text-amber-700 p-2 rounded-lg text-xs border border-amber-100">
                <User className="h-4 w-4" />
              </span>
              Katalog Hari Orang Kerja (OH) & Tarif Tukang
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-105 uppercase text-[10px] tracking-wide">
                    <th className="p-2 py-3">Fungsionaris Upah</th>
                    <th className="p-2 py-3 text-center">Unit</th>
                    <th className="p-2 py-3 text-right">Akumulasi (OH)</th>
                    <th className="p-2 py-3 text-right">Tarif Harian (Rp)</th>
                    <th className="p-2 py-3 text-right w-28">Subtotal Upah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wages.map((wg) => (
                    <tr key={wg.key} className="hover:bg-slate-50/70 transition duration-150">
                      <td className="p-2 font-semibold text-slate-700">{wg.name}</td>
                      <td className="p-2 text-center text-slate-400 font-bold uppercase">{wg.unit}</td>
                      <td className="p-2 text-right font-mono text-indigo-700 font-bold">{wg.totalQuantity.toFixed(1)}</td>
                      <td className="p-2 text-right">
                        {editingResourceKey === wg.key ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <input
                              type="number"
                              value={editingResourceVal}
                              onChange={(e) => setEditingResourceVal(Number(e.target.value))}
                              className="w-20 text-xs font-mono border border-indigo-400 rounded px-1.5 py-0.5 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button onClick={() => handleSavePrice(wg.key)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md shadow-sm transition">
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditPrice(wg.key, wg.unitPrice)}
                            className="text-indigo-650 hover:text-indigo-800 hover:bg-indigo-50/50 border-b border-dashed border-indigo-300 px-1 py-0.5 rounded font-mono font-semibold inline-flex items-center gap-1 transition-all"
                          >
                            {formatIDR(wg.unitPrice)} <Edit2 className="h-2.5 w-2.5 text-indigo-400" />
                          </button>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-800">{formatIDR(wg.totalPrice)}</td>
                    </tr>
                  ))}
                  {wages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">Tidak ada komponen upah kerja dalam pemetaan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equipment Registry */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <span className="bg-purple-50 text-purple-700 p-2 rounded-lg text-xs border border-purple-100">
                <Sliders className="h-4 w-4" />
              </span>
              Katalog Sewa Alat Kerja Lapangan
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wide">
                    <th className="p-2 py-3">Nama Alat Sewa</th>
                    <th className="p-2 py-3 text-center">Unit</th>
                    <th className="p-2 py-3 text-right">Vol Pemakaian</th>
                    <th className="p-2 py-3 text-right">Harga Sewa (Rp)</th>
                    <th className="p-2 py-3 text-right w-28">Subtotal Sewa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {equipments.map((eq) => (
                    <tr key={eq.key} className="hover:bg-slate-50/70 transition duration-150">
                      <td className="p-2 font-semibold text-slate-700">{eq.name}</td>
                      <td className="p-2 text-center text-slate-400 font-bold uppercase">{eq.unit}</td>
                      <td className="p-2 text-right font-mono text-indigo-700 font-bold">{eq.totalQuantity.toFixed(2)}</td>
                      <td className="p-2 text-right">
                        {editingResourceKey === eq.key ? (
                          <div className="flex items-center gap-1.5 justify-end">
                            <input
                              type="number"
                              value={editingResourceVal}
                              onChange={(e) => setEditingResourceVal(Number(e.target.value))}
                              className="w-20 text-xs font-mono border border-indigo-400 rounded px-1.5 py-0.5 text-right focus:outline-none"
                            />
                            <button onClick={() => handleSavePrice(eq.key)} className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-md shadow-sm transition">
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditPrice(eq.key, eq.unitPrice)}
                            className="text-indigo-630 hover:text-indigo-850 hover:bg-indigo-50/50 border-b border-dashed border-indigo-300 px-1 py-0.5 rounded font-mono font-semibold inline-flex items-center gap-1 transition-all"
                          >
                            {formatIDR(eq.unitPrice)} <Edit2 className="h-2.5 w-2.5 text-indigo-400" />
                          </button>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-800">{formatIDR(eq.totalPrice)}</td>
                    </tr>
                  ))}
                  {equipments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">Tidak ada penyerapan biaya sewa alat luar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-6">
        <button
          onClick={() => setActiveTab('mapping')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-lg transition"
        >
          Kembali ke Pemetaan
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all cursor-pointer"
          id="summary-tab-continue-btn"
        >
          Hasil Keputusan Margin Akhir <Sliders className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
