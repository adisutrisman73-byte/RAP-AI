import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12 shrink-0 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center text-xs space-y-2">
        <p className="font-semibold text-slate-200">© 2026 CONSTRUCTA RAP — Sistem Estimasi Harga Satuan Lapangan Otomatis</p>
        <p className="text-[10px] text-slate-500">
          Menggunakan landasan Koefisien AHSP Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR) RI. Sesuai dengan spesifikasi konstruksi tata ruang terbaru.
        </p>
      </div>
    </footer>
  );
}
