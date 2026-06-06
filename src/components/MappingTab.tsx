import React from 'react';
import { Info, Layers, AlertTriangle, Database, ChevronUp, ChevronDown } from 'lucide-react';
import { ConstructionProject } from '../types';

interface MappingTabProps {
  project: ConstructionProject;
  ahspDatabase: Array<{ code: string; name: string; unit: string }>;
  mappings: { [id: string]: string };
  handleMappingChange: (rabId: string, value: string) => void;
  expandedItems: { [id: string]: boolean };
  toggleRowExpanded: (id: string) => void;
  formatIDR: (num: number) => string;
  setActiveTab: (tab: 'upload' | 'mapping' | 'prices' | 'summary') => void;
}

export default function MappingTab({
  project,
  ahspDatabase,
  mappings,
  handleMappingChange,
  expandedItems,
  toggleRowExpanded,
  formatIDR,
  setActiveTab,
}: MappingTabProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-xl p-4.5 flex items-start gap-3 shadow-sm text-xs leading-relaxed">
        <Info className="h-5 w-5 text-indigo-650 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-indigo-900">Panduan Sinkronisasi Standardisasi AHSP (PUPR Nasional 2026)</p>
          <p className="text-slate-650 mt-1">
            Sistem secara otomatis menguraikan koefisien takaran konstruksi standard PUPR ke dalam item pekerjaan Anda. Anda bebas **menyesuaikan kode AHSP** melalui dropdown. Klik tombol panah di ujung baris untuk membongkar rincian kebutuhan volume bahan dan alokasi hari orang kerja kasar (OH).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 bg-slate-900 text-white border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm tracking-wide text-white">RINCIAN INTEGRASI AHSP TERHADAP RAB</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Pemetaan koefisien volume rencana anggaran pelaksanaan kontraktor secara terkontrol.</p>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3.5 py-1.5 rounded-full font-bold">
            Total Margin Proyek: {formatIDR(project.totalProfit)} ({project.totalRABAmount > 0 ? ((project.totalProfit / project.totalRABAmount) * 100).toFixed(1) : '0'}%)
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {project.rapItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <AlertTriangle className="h-8 w-8 text-indigo-550 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">Belum Ada Data RAB yang Dimuat</p>
              <p className="text-xs text-slate-450 mt-1.5 max-w-md mx-auto leading-relaxed">
                Silakan kembali ke menu tab **1. Unggah RAB** untuk mengunggah dokumen PDF, menempel teks manual, atau memuat data simulasi siap pakai.
              </p>
            </div>
          ) : (
            project.rapItems.map((item, idx) => {
              const isExpanded = !!expandedItems[item.id];
              const profitRatio = item.profitPercentage;
              let ratioBadgeColor = "bg-emerald-50 text-emerald-800 border border-emerald-100";
              if (profitRatio < 10) ratioBadgeColor = "bg-rose-50 text-rose-800 border border-rose-100";
              else if (profitRatio < 25) ratioBadgeColor = "bg-amber-50 text-amber-800 border border-amber-200/50";

              return (
                <div key={item.id} className="transition duration-150">
                  {/* Flex header row */}
                  <div className="p-4 sm:px-6 flex flex-col lg:flex-row items-shrink-0 lg:items-center justify-between gap-4 hover:bg-slate-50/70">
                    {/* Title & Info */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">#{idx + 1}</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-800 leading-tight">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold font-mono">
                        Volume Kontrak: {item.volume.toFixed(2)} {item.unit}
                      </p>
                    </div>

                    {/* Mapping Selector & Info */}
                    <div className="w-full lg:w-auto flex flex-wrap items-stretch sm:items-center gap-3">
                      <div className="flex flex-col">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kode AHSP Standard</label>
                        <select
                          value={item.matchedAHSPCode || ''}
                          onChange={(e) => handleMappingChange(item.id, e.target.value)}
                          className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650 text-slate-700 transition"
                        >
                          <option value="">-- Lewati / Manual --</option>
                          {ahspDatabase.map(ahsp => (
                            <option key={ahsp.code} value={ahsp.code}>
                              [{ahsp.code}] {ahsp.name} ({ahsp.unit})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Pricing Quickview */}
                      <div className="flex gap-4 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-150 text-center">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase">Unit RAP</span>
                          <span className="text-xs font-mono font-bold text-slate-700">{formatIDR(item.unitDirectCost)}</span>
                        </div>
                        <div className="border-r border-slate-200" />
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase">Total RAP</span>
                          <span className="text-xs font-mono font-bold text-indigo-950">{formatIDR(item.totalDirectCost)}</span>
                        </div>
                      </div>

                      {/* Profit margin ratio */}
                      <div className="text-right flex flex-col items-end min-w-[120px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Est. Margin</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ratioBadgeColor}`}>
                          {item.profitPercentage.toFixed(0)}% ({formatIDR(item.profit)})
                        </span>
                      </div>

                      {/* Toggle Expand button */}
                      <button
                        onClick={() => toggleRowExpanded(item.id)}
                        className="bg-slate-150 hover:bg-slate-200 p-2 rounded-lg text-slate-600 transition duration-150 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Analisis Takaran */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 sm:px-6 space-y-4 shadow-inner animate-fade-in">
                      {item.resources.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                          Item pekerjaan ini belum dipetakan ke Standar AHSP PUPR. Silakan pilih kode di atas untuk membongkar rincian bahan dan upah.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Database className="h-4 w-4 text-indigo-600" /> Analisis Takaran Kebutuhan per Unit {item.unit}
                          </h5>

                          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                 <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-tight text-[10px]">
                                  <th className="p-2.5 pl-4">Kelompok</th>
                                  <th className="p-2.5">Uraian Komponen Bahan / Alat</th>
                                  <th className="p-2.5 text-right w-24">Koefisian</th>
                                  <th className="p-2.5 text-center w-16">Satuan</th>
                                  <th className="p-2.5 text-right text-indigo-700 font-bold w-36">Total Vol Proyek</th>
                                  <th className="p-2.5 text-right w-32">Harga Lapangan</th>
                                  <th className="p-2.5 text-right pr-4 w-36">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(() => {
                                  const materialsRes = item.resources.filter(r => r.type === "material");
                                  const laborRes = item.resources.filter(r => r.type === "labor");
                                  const equipmentRes = item.resources.filter(r => r.type === "equipment");

                                  const renderResourceRow = (res: any) => {
                                    let grpBadge = "bg-indigo-50 text-indigo-800 border border-indigo-100";
                                    if (res.type === 'labor') grpBadge = "bg-amber-50 text-amber-900 border border-amber-200/50";
                                    if (res.type === 'equipment') grpBadge = "bg-purple-50 text-purple-800 border border-purple-100";

                                    return (
                                      <tr key={res.id} className="hover:bg-slate-50/50 transition">
                                        <td className="p-2.5 pl-4">
                                          <span className={`${grpBadge} text-[9px] uppercase font-bold px-1.5 py-0.5 rounded`}>
                                            {res.type === 'material' ? 'Bahan' : res.type === 'labor' ? 'Upah' : 'Alat'}
                                          </span>
                                        </td>
                                        <td className="p-2.5 font-semibold text-slate-700">{res.name}</td>
                                        <td className="p-2.5 text-right font-mono text-slate-500">{res.coefficient.toFixed(4)}</td>
                                        <td className="p-2.5 text-center text-slate-450 font-bold uppercase">{res.unit}</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-indigo-700">{res.neededQuantity.toFixed(2)}</td>
                                        <td className="p-2.5 text-right font-mono text-slate-650">{formatIDR(res.unitPrice)}</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-slate-800 pr-4">{formatIDR(res.totalCost)}</td>
                                      </tr>
                                    );
                                  };

                                  return (
                                    <>
                                      {materialsRes.length > 0 && (
                                        <>
                                          <tr className="bg-indigo-50/30 text-indigo-900 font-bold text-[10px] leading-normal border-y border-slate-150">
                                            <td colSpan={6} className="p-2 pl-4 py-1.5 text-indigo-950 uppercase tracking-wider">📦 Komponen Bahan / Material (Bahan)</td>
                                            <td className="p-2 text-right pr-4 py-1.5 font-mono text-indigo-950 font-extrabold bg-indigo-50/40">Subtotal: {formatIDR(materialsRes.reduce((sum, r) => sum + r.totalCost, 0))}</td>
                                          </tr>
                                          {materialsRes.map(renderResourceRow)}
                                        </>
                                      )}
                                      {equipmentRes.length > 0 && (
                                        <>
                                          <tr className="bg-purple-50/30 text-purple-900 font-bold text-[10px] leading-normal border-y border-slate-150">
                                            <td colSpan={6} className="p-2 pl-4 py-1.5 text-purple-950 uppercase tracking-wider">⚙️ Komponen Sewa Alat / Perlengkapan (Alat)</td>
                                            <td className="p-2 text-right pr-4 py-1.5 font-mono text-purple-950 font-extrabold bg-purple-50/40">Subtotal: {formatIDR(equipmentRes.reduce((sum, r) => sum + r.totalCost, 0))}</td>
                                          </tr>
                                          {equipmentRes.map(renderResourceRow)}
                                        </>
                                      )}
                                    </>
                                  );
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('upload')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-lg transition-all"
        >
          Kembali ke Impor
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-100 text-center transition-all cursor-pointer"
        >
          Lanjutkan ke Harga Lapangan <Layers className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
