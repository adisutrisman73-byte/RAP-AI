/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Layers,
  Sliders,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

import { RABItem, ConstructionProject } from './types';
import { AHSP_DATABASE, MOCK_RAB_DATA, REF_PRICES } from './data/ahspData';
import { calculateProjectRAP } from './utils/constructionEngine';

// Import modular sub-components
import Header from './components/Header';
import Footer from './components/Footer';
import UploadTab from './components/UploadTab';
import MappingTab from './components/MappingTab';
import PricesTab from './components/PricesTab';
import SummaryTab from './components/SummaryTab';

export default function App() {
  // Project Details
  const [projectName, setProjectName] = useState('Pembangunan Rumah Tinggal Tipe 45');
  const [projectLocation, setProjectLocation] = useState('Kawasan Hunian Pegawai IKN, Kalimantan Timur');
  const [ownerName, setOwnerName] = useState('Aditama Sutrisman');

  // App State
  const [activeTab, setActiveTab] = useState<'upload' | 'mapping' | 'prices' | 'summary'>('upload');
  const [rabItems, setRabItems] = useState<RABItem[]>([]);
  const [mappings, setMappings] = useState<{ [rabId: string]: string }>({});
  const [customPrices, setCustomPrices] = useState<{ [name: string]: number }>({ ...REF_PRICES });
  
  // UI Helpers
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [geminiStatus, setGeminiStatus] = useState<{ checked: boolean; enabled: boolean }>({ checked: false, enabled: false });
  const [pastedText, setPastedText] = useState('');
  const [expandedItems, setExpandedItems] = useState<{ [id: string]: boolean }>({});
  const [editingResourceKey, setEditingResourceKey] = useState<string | null>(null);
  const [editingResourceVal, setEditingResourceVal] = useState<number>(0);

  // Checks server health to detect if Gemini API is available
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiStatus({ checked: true, enabled: !!data.geminiEnabled });
      })
      .catch((err) => {
        console.error('Server offline or API error:', err);
        setGeminiStatus({ checked: true, enabled: false });
      });
  }, []);

  // Compute RAP in real-time
  const project: ConstructionProject = calculateProjectRAP(
    projectName,
    projectLocation,
    ownerName,
    rabItems,
    mappings,
    customPrices
  );

  // Group resource registries for neat display in Prices tab
  const materials = Object.values(project.resourceRegistry).filter(r => r.type === 'material');
  const wages = Object.values(project.resourceRegistry).filter(r => r.type === 'labor');
  const equipments = Object.values(project.resourceRegistry).filter(r => r.type === 'equipment');

  // Trigger Excel download
  const handleExportExcel = async () => {
    try {
      setLoading(true);
      setLoadingStep('Mempersiapkan data dan membuat file Excel...');
      
      // Lazy load export function to reduce bundle size and run clearly
      const { exportProjectToExcel } = await import('./utils/excelExport');
      
      exportProjectToExcel(
        project.name,
        project.location,
        project.rabItems,
        project.rapItems,
        materials,
        wages,
        equipments
      );
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      alert("Gagal mengekspor file Excel: " + err.message);
    }
  };

  // Pre-load example dataset
  const handleLoadDemo = () => {
    setLoading(true);
    setLoadingStep('Melakukan parsing template RAB...');
    
    setTimeout(() => {
      setRabItems(MOCK_RAB_DATA);
      
      // Auto-assign mock codes
      const demoMappings: { [id: string]: string } = {};
      MOCK_RAB_DATA.forEach(item => {
        demoMappings[item.id] = (item as any).suggestedAHSPCode;
      });
      setMappings(demoMappings);
      
      setProjectName('Pembangunan Rumah Tinggal Tipe 45');
      setProjectLocation('Kawasan Hunian Pegawai IKN, Kalimantan Timur');
      setOwnerName('Aditama Sutrisman');
      setLoading(false);
      setActiveTab('mapping');
    }, 800);
  };

  // Convert File to Base65 and send to backend
  const processRabPdf = (file: File) => {
    if (!file) return;
    setErrorFeedback(null);
    setLoading(true);
    setLoadingStep('Mengunggah berkas PDF RAB...');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Url = reader.result as string;
        const base64Data = base64Url.split(',')[1];

        setLoadingStep('Membaca berkas PDF & Mengekstrak Data Tabel (Gemini 3.5 Flash)...');
        const res = await fetch('/api/parse-rab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileData: base64Data, fileType: "application/pdf" })
        });

        const outcome = await res.json();
        if (!outcome.success) throw new Error(outcome.error || "Gagal menguraikan RAB.");

        const items: RABItem[] = outcome.data;
        if (items.length === 0) {
          throw new Error("Tidak ada item pekerjaan terdeteksi di dokumen. Coba kopeks/baca file teks atau gunakan contoh.");
        }

        setRabItems(items);
        
        // Populate initial mappings
        const initMap: { [id: string]: string } = {};
        items.forEach(it => {
          initMap[it.id] = (it as any).suggestedAHSPCode || '';
        });
        setMappings(initMap);

        setLoadingStep('Memetakan Analisis Satuan Standard AHSP Nasional...');
        setLoading(false);
        setActiveTab('mapping');
      } catch (err: any) {
        console.error(err);
        setErrorFeedback(err.message || 'Gagal mengekstrak PDF. Pasang teks manual atau coba gunakan data contoh.');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process text-pasted RAB 
  const processRabText = async () => {
    if (!pastedText.trim()) return;
    setErrorFeedback(null);
    setLoading(true);
    setLoadingStep('Menganalisis teks RAB pelamar...');

    try {
      const res = await fetch('/api/parse-rab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textData: pastedText })
      });

      const outcome = await res.json();
      if (!outcome.success) throw new Error(outcome.error || "Gagal menguraikan teks.");

      const items: RABItem[] = outcome.data;
      if (items.length === 0) {
        throw new Error("Gagal mengenali format pekerjaan. Pastikan teks berisi rincian item, volume, dan satuan.");
      }

      setRabItems(items);
      const initMap: { [id: string]: string } = {};
      items.forEach(it => {
        initMap[it.id] = (it as any).suggestedAHSPCode || '';
      });
      setMappings(initMap);
      setLoading(false);
      setActiveTab('mapping');
    } catch (err: any) {
      console.error(err);
      setErrorFeedback(err.message || 'Gagal memproses teks.');
      setLoading(false);
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processRabPdf(e.dataTransfer.files[0]);
    }
  };

  const toggleRowExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Change individual RAB item matched code in mappings State
  const handleMappingChange = (rabId: string, value: string) => {
    setMappings(prev => ({ ...prev, [rabId]: value }));
  };

  // Custom Price edits in Resources list
  const handleStartEditPrice = (key: string, val: number) => {
    setEditingResourceKey(key);
    setEditingResourceVal(val);
  };

  const handleSavePrice = (key: string) => {
    setCustomPrices(prev => ({ ...prev, [key]: editingResourceVal }));
    setEditingResourceKey(null);
  };

  const resetAllPrices = () => {
    setCustomPrices({ ...REF_PRICES });
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans leading-relaxed flex flex-col antialiased">
      {/* PROFESSIONAL POLISH CORE HEADER */}
      <Header ownerName={ownerName} geminiActive={geminiStatus.enabled} />

      {/* DETAILED PROGRESS LOADING MASK */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl flex flex-col items-center justify-center text-center animate-fade-in animate-duration-150">
            <div className="relative flex items-center justify-center mb-5">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-100 border-t-indigo-650" />
              <Sparkles className="absolute h-5 w-5 text-indigo-650 animate-pulse" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Sedang Memproses Estimasi</h3>
            <p className="text-sm text-slate-500 mb-5 animate-pulse font-medium">{loadingStep}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-600 h-full w-[75%] animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* TABS CONTROLLERS */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-0 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4.5 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-650 font-bold bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
            }`}
            id="tab-upload"
          >
            <Upload className="h-4 w-4" />
            1. Unggah RAB (PDF/Teks)
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`flex items-center gap-2 px-4.5 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'mapping'
                ? 'border-indigo-600 text-indigo-650 font-bold bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
            }`}
            id="tab-mapping"
          >
            <Layers className="h-4 w-4" />
            2. Pemetaan & Koefisien AHSP
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-4.5 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'prices'
                ? 'border-indigo-600 text-indigo-650 font-bold bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
            }`}
            id="tab-prices"
          >
            <Sliders className="h-4 w-4" />
            3. Penyesuaian Harga Lapangan
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4.5 py-3 border-b-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-650 font-bold bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
            }`}
            id="tab-summary"
          >
            <TrendingUp className="h-4 w-4" />
            4. Dashboard RAP & Margin
          </button>
        </div>

        {/* FEEDBACK CRITICAL AREA ERROR */}
        {errorFeedback && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 rounded-xl flex items-start gap-3 shadow-sm text-xs">
            <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Gagal Mengimpor Dokumen</h4>
              <p className="text-rose-700 mt-1 leading-relaxed">{errorFeedback}</p>
            </div>
          </div>
        )}

        {/* CONTROLL TAB ROUTER */}
        {activeTab === 'upload' && (
          <UploadTab
            projectName={projectName}
            setProjectName={setProjectName}
            projectLocation={projectLocation}
            setProjectLocation={setProjectLocation}
            ownerName={ownerName}
            setOwnerName={setOwnerName}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            processRabPdf={processRabPdf}
            pastedText={pastedText}
            setPastedText={setPastedText}
            processRabText={processRabText}
            handleLoadDemo={handleLoadDemo}
            rabItems={rabItems}
            setRabItems={setRabItems}
            formatIDR={formatIDR}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'mapping' && (
          <MappingTab
            project={project}
            ahspDatabase={AHSP_DATABASE}
            mappings={mappings}
            handleMappingChange={handleMappingChange}
            expandedItems={expandedItems}
            toggleRowExpanded={toggleRowExpanded}
            formatIDR={formatIDR}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'prices' && (
          <PricesTab
            materials={materials}
            wages={wages}
            equipments={equipments}
            editingResourceKey={editingResourceKey}
            editingResourceVal={editingResourceVal}
            setEditingResourceVal={setEditingResourceVal}
            handleStartEditPrice={handleStartEditPrice}
            handleSavePrice={handleSavePrice}
            resetAllPrices={resetAllPrices}
            formatIDR={formatIDR}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryTab
            project={project}
            materials={materials}
            wages={wages}
            equipments={equipments}
            handleExportExcel={handleExportExcel}
            formatIDR={formatIDR}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* SYSTEM Baseline footer */}
      <Footer />
    </div>
  );
}
