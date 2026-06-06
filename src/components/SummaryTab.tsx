import React from 'react';
import { FileCode, CheckCircle2, TrendingUp, Sliders, FileSpreadsheet } from 'lucide-react';
import { ConstructionProject } from '../types';

interface SummaryTabProps {
  project: ConstructionProject;
  materials: any[];
  wages: any[];
  equipments: any[];
  handleExportExcel: () => void;
  formatIDR: (num: number) => string;
  setActiveTab: (tab: 'upload' | 'mapping' | 'prices' | 'summary') => void;
}

export default function SummaryTab({
  project,
  materials,
  wages,
  equipments,
  handleExportExcel,
  formatIDR,
  setActiveTab,
}: SummaryTabProps) {
  const totMat = materials.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totWages = wages.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totEq = equipments.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const total = totMat + totWages + totEq;
  
  const pMat = total > 0 ? (totMat / total) * 100 : 0;
  const pWag = total > 0 ? (totWages / total) * 100 : 0;
  const pEq = total > 0 ? (totEq / total) * 100 : 0;

  return (
    <div className="space-y-6 font-sans">
      {/* KPI Metrics Dashboard Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RAB Nilai Kontrak Pemilik</span>
          <h4 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-2">{formatIDR(project.totalRABAmount)}</h4>
          <p className="text-[11px] text-slate-400 mt-1">Estimasi Kontrak Awal Klien Resmi</p>
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
            <FileCode className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">RAP Estimasi Biaya Riil</span>
          <h4 className="text-xl sm:text-2xl font-bold font-mono text-indigo-700 mt-2">{formatIDR(project.totalRAPAmount)}</h4>
          <p className="text-[11px] text-slate-450 mt-1">Akumulasi Biaya Lapangan Terkalkulasi</p>
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-indigo-50 border border-indigo-100/50 rounded-lg text-indigo-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Kelebihan Anggaran (Margin)</span>
          <h4 className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 mt-2">{formatIDR(project.totalProfit)}</h4>
          <p className="text-[11px] text-emerald-650 mt-1">Selisih Keuntungan Kasar Kontraktor</p>
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-emerald-100 rounded-lg text-emerald-650 border border-emerald-250">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Persentase Sehat Margin</span>
          <h4 className="text-xl sm:text-2xl font-bold font-mono text-indigo-900 mt-2">
            {project.totalRABAmount > 0 ? ((project.totalProfit / project.totalRABAmount) * 100).toFixed(1).replace('.0','') : '0'} %
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">Rasio Profitabilitas Rencana Usaha</p>
          <div className="absolute top-2.5 right-2.5 p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-indigo-600">
            <Sliders className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Sub-resource splits visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Pie diagram simulation structured */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-850 pb-2 border-b border-slate-150 flex items-center gap-1.5">
            Distribusi Pembagian Alokasi RAP
          </h4>

          <div className="space-y-4">
            {/* elegant continuous colored bar representation */}
            <div className="h-5 w-full rounded-lg bg-slate-100 overflow-hidden flex">
              <div style={{ width: `${pMat}%` }} className="bg-indigo-600 h-full transition-all duration-300" title="Pembelian Bahan" />
              <div style={{ width: `${pWag}%` }} className="bg-amber-400 h-full transition-all duration-300" title="Alokasi Upah" />
              <div style={{ width: `${pEq}%` }} className="bg-purple-650 h-full transition-all duration-300" title="Sewa Alat" />
            </div>

            <div className="space-y-1.5 mt-4 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all">
                <span className="flex items-center gap-2 font-semibold text-slate-600">
                  <span className="h-3 w-3 bg-indigo-600 rounded-full shrink-0" /> 1. Kebutuhan Belanja Bahan
                </span>
                <span className="font-mono font-bold text-slate-800">{formatIDR(totMat)} ({pMat.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all">
                <span className="flex items-center gap-2 font-semibold text-slate-600">
                  <span className="h-3 w-3 bg-amber-400 rounded-full shrink-0" /> 2. Kebutuhan Alokasi Upah
                </span>
                <span className="font-mono font-bold text-slate-800">{formatIDR(totWages)} ({pWag.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-150 transition-all">
                <span className="flex items-center gap-2 font-semibold text-slate-600">
                  <span className="h-3 w-3 bg-purple-650 rounded-full shrink-0" /> 3. Pembayaran Sewa Alat
                </span>
                <span className="font-mono font-bold text-slate-800">{formatIDR(totEq)} ({pEq.toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[11px] text-slate-500 leading-relaxed">
            <strong>Notes:</strong> Rencana Anggaraan Pelaksanaan kontraktor yang ideal berkisar minimal 15-20% margin untuk menyeimbangkan pengadaan tidak terduga, risiko meteorologis dan fluktuasi harga pasar.
          </div>
        </div>

        {/* EXPORT EXECUTIVE BOARD */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-6">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-200/40 text-xs">
                <FileSpreadsheet className="h-4.5 w-4.5" />
              </span>
              <h3 className="font-bold text-base text-slate-900">Hasil Analisis RAP Siap Diekspor</h3>
            </div>
            <p className="text-xs text-slate-550 leading-relaxed">
              Sinkronisasi data berhasil. File ekspor ini memuat empat buah sheet komprehensif: Rekapitulasi margin rencana kerja, Perbandingan Nilai Owner lawan Nilai Riil Konstruksi, Purchase order pembelian Bahan Fisik, dan Rekapitulasi Alokasi Hari Orang Kerja Kasar.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-150">
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5 tracking-wider">NAMA PROYEK</span>
                <span className="font-bold text-slate-800">{project.name}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5 tracking-wider">LOKASI PROYEK</span>
                <span className="font-bold text-slate-800">{project.location}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5 tracking-wider">TERALOKASI AHSP</span>
                <span className="font-bold text-indigo-700">{Object.keys(project.rapItems).length} Pekerjaan Fisik</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5 tracking-wider">KLIEN LAHAN</span>
                <span className="font-bold text-slate-800">{project.owner || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportExcel}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 transition-all duration-200 cursor-pointer"
              id="export-excel-btn"
            >
              <FileSpreadsheet className="h-5 w-5" />
              Unduh Laporan Microsoft Excel (.xlsx)
            </button>
            <button
              onClick={() => setActiveTab('mapping')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-bold text-xs py-3.5 px-5 rounded-xl transition-all cursor-pointer"
            >
              Tinjau Ulang Koefisien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
