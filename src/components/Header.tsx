import React from 'react';
import { Calculator } from 'lucide-react';

interface HeaderProps {
  ownerName: string;
  geminiActive: boolean;
}

export default function Header({ ownerName, geminiActive }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-md sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white block leading-none">
            CONSTRUCTA <span className="text-indigo-400">RAP</span>
          </span>
          <span className="text-[9px] text-slate-400 block mt-1 tracking-wider uppercase font-semibold">
            AHSP Standard PUPR • Engine Estimator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Gemini status badge */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-full px-3 py-1.5 flex items-center gap-2 text-[10px] text-slate-300">
          <span className={`w-2 h-2 rounded-full ${geminiActive ? 'bg-indigo-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-mono text-[9px] tracking-tight uppercase font-semibold">
            AI: {geminiActive ? 'GEMINI 3.5 ACTIVE' : 'SANDBOX MANUAL'}
          </span>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-800 pl-4 sm:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Senior Estimator</p>
            <p className="text-xs font-semibold text-white truncate max-w-[130px]" title={ownerName || 'Budi Santoso'}>
              {ownerName || 'Budi Santoso'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
            {ownerName ? ownerName.substring(0, 2).toUpperCase() : 'BS'}
          </div>
        </div>
      </div>
    </header>
  );
}
