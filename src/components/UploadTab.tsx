import React from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, Trash2, Settings, Layers } from 'lucide-react';
import { RABItem } from '../types';

interface UploadTabProps {
  projectName: string;
  setProjectName: (val: string) => void;
  projectLocation: string;
  setProjectLocation: (val: string) => void;
  ownerName: string;
  setOwnerName: (val: string) => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  processRabPdf: (file: File) => void;
  pastedText: string;
  setPastedText: (val: string) => void;
  processRabText: () => void;
  handleLoadDemo: () => void;
  rabItems: RABItem[];
  setRabItems: (items: RABItem[]) => void;
  formatIDR: (num: number) => string;
  setActiveTab: (tab: 'upload' | 'mapping' | 'prices' | 'summary') => void;
}

export default function UploadTab({
  projectName,
  setProjectName,
  projectLocation,
  setProjectLocation,
  ownerName,
  setOwnerName,
  dragActive,
  handleDrag,
  handleDrop,
  processRabPdf,
  pastedText,
  setPastedText,
  processRabText,
  handleLoadDemo,
  rabItems,
  setRabItems,
  formatIDR,
  setActiveTab,
}: UploadTabProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Meta details setting bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-3.5 flex items-center gap-2">
          <Settings className="h-4 w-4 text-indigo-650" /> Informasi Dasar Pekerjaan Proyek
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nama Proyek</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full text-sm bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650 focus:bg-white focus:outline-none transition-all"
              placeholder="Contoh: Pembangunan Ruko IKN"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lokasi Proyek</label>
            <input
              type="text"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              className="w-full text-sm bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650 focus:bg-white focus:outline-none transition-all"
              placeholder="Contoh: Balikpapan Tengah, Kaltim"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Klien / Owner Proyek</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full text-sm bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-650 focus:bg-white focus:outline-none transition-all"
              placeholder="Contoh: Bapak Aditama"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF & Paste interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl border-2 border-dashed p-10 text-center flex flex-col items-center justify-center group transition-all duration-300 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/40'
                : 'border-slate-250 hover:border-indigo-400 bg-white shadow-sm'
            }`}
          >
            <div className="bg-indigo-50 p-4.5 rounded-full group-hover:bg-indigo-100 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <Upload className="h-8 w-8 text-indigo-600" />
            </div>
            <h4 className="text-base font-bold text-slate-850 mt-4.5">Pilih atau Seret Berkas PDF RAB anda</h4>
            <p className="text-xs text-slate-450 mt-1.5 max-w-sm leading-relaxed">
              AI kami otomatis membaca, memindai, dan mencocokkan kolom deskripsi, satuan, volume dan harga porsi dokumen Anda secara instan.
            </p>
            
            <div className="mt-6">
              <label className="cursor-pointer bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-lg transition-all shadow-md shadow-indigo-500/10 inline-block">
                Cari File PDF Anda
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files?.[0] && processRabPdf(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Paste Area */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-sm text-slate-850 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" /> Cara Alternatif: Tempel Teks RAB (Cepat & Handal)
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Tempel daftar baris atau struktur volume pekerjaan Anda dari berkas Excel/Word di bawah ini.
            </p>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 hover:bg-slate-100/30 border border-slate-200 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              placeholder="Contoh format teks tempel:&#10;1. Pekerjaan Galian Tanah, 45 m3&#10;2. Pekerjaan Urugan Pasir, 5 m3&#10;3. Plesteran Dinding Bata, 120 m2, Rp 85.000"
            />
            <div className="mt-3.5 flex justify-end">
              <button
                onClick={processRabText}
                disabled={!pastedText.trim()}
                className="bg-indigo-650 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm shadow-indigo-500/10 transition-all font-sans"
              >
                Konversi Teks Manual
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR TEMPLATE CODES */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[350px] border border-slate-800">
            <div className="absolute top-0 right-0 h-44 w-44 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="z-10 space-y-4">
              <div className="bg-indigo-500/80 p-2.5 rounded-lg inline-block shadow-md">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest block mb-0.5">Uji Coba Sistem</span>
                <h3 className="text-lg font-bold tracking-tight">Tidak Memiliki Berkas RAB Sekarang?</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kami telah memformat template standard siap saji untuk <strong>Proyek Rumah Tinggal Tipe 45</strong> yang disesuaikan lengkap dengan 13 jenis item pekerjaan fisik sipil.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gunakan simulasi data uji untuk membongkar detail takaran material, menghitung upah kerja kasar, menguji mitigasi harga lapangan, serta melakukan ekspor Microsoft Excel.
              </p>
            </div>

            <div className="z-10 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={handleLoadDemo}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                id="use-demo-data-btn"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-indigo-200" />
                Gunakan Data Simulasi Contoh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOKUMEN PREVIEW TABLE */}
      {rabItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-850">Preview Data RAB Hasil Ekstraksi</h3>
              <p className="text-xs text-slate-450">Berhasil memetakan {rabItems.length} item pekerjaan utama konstruksi.</p>
            </div>
            <button
              onClick={() => setRabItems([])}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-bold transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> Bersihkan Data
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-tight text-[11px]">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3 w-[180px]">Kategori</th>
                  <th className="p-3">Uraian Pekerjaan</th>
                  <th className="p-3 text-right w-24">Volume</th>
                  <th className="p-3 text-center w-16">Satuan</th>
                  <th className="p-3 text-right w-36 font-semibold">Harga Satuan (Rp)</th>
                  <th className="p-3 text-right w-40 font-bold">Total Harga RAB (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105">
                {rabItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition duration-150">
                    <td className="p-3 text-center font-semibold text-slate-450">{idx + 1}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                    <td className="p-3 text-right font-mono font-semibold">{item.volume.toFixed(1)}</td>
                    <td className="p-3 text-center font-medium text-slate-500 uppercase">{item.unit}</td>
                    <td className="p-3 text-right font-mono text-slate-600">{formatIDR(item.unitPrice || 0)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{formatIDR(item.totalPrice || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setActiveTab('mapping')}
              className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer"
            >
              Lanjutkan ke Pemetaan AHSP <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
