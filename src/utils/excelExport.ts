/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { RABItem, RAPItem, ResourceRegistryItem } from '../types';

export function exportProjectToExcel(
  projectName: string,
  location: string,
  rabItems: RABItem[],
  rapItems: RAPItem[],
  materials: ResourceRegistryItem[],
  wages: ResourceRegistryItem[],
  equipments: ResourceRegistryItem[]
) {
  const wb = XLSX.utils.book_new();

  // --- SHEET 1: REKAPITULASI PROYEK ---
  const totalRAB = rabItems.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const totalRAP = rapItems.reduce((acc, curr) => acc + curr.totalDirectCost, 0);
  const totalProfit = totalRAB - totalRAP;
  const marginPercentage = totalRAB > 0 ? (totalProfit / totalRAB) * 100 : 0;

  const summarySheetData = [
    ["REKAPITULASI RENCANA ANGGARAN PELAKSANAAN (RAP) & PERBANDINGAN RAB"],
    ["NAMA PROYEK", projectName || "Pembangunan Rumah Tinggal"],
    ["LOKASI", location || "Ibu Kota Nusantara, Indonesia"],
    ["TANGGAL EKSPOR", new Date().toLocaleDateString('id-ID')],
    [],
    ["SUMMARY INSTRUMEN KEUANGAN PROYEK"],
    ["Kategori", "Jumlah Anggaran (IDR)"],
    ["Rencana Anggaran Biaya (RAB Pemilik / Owner)", totalRAB],
    ["Rencana Anggaran Pelaksanaan (RAP Riil Fisik)", totalRAP],
    ["Estimasi Margin / Keuntungan Selisih", totalProfit],
    ["Persentase Efisiensi Margin / Keuntungan", `${marginPercentage.toFixed(2)} %`],
    [],
    ["Rincian per Kelompok Sumber Daya FIsik (RAP)"],
    ["Kelompok Sumber Daya", "Total Kebutuhan Biaya (IDR)"],
    ["1. Kebutuhan Bahan Campuran Fisik", materials.reduce((acc, curr) => acc + curr.totalPrice, 0)],
    ["2. Kebutuhan Upah Pekerja / Tukang", wages.reduce((acc, curr) => acc + curr.totalPrice, 0)],
    ["3. Kebutuhan Sewa Alat & Perlengkapan", equipments.reduce((acc, curr) => acc + curr.totalPrice, 0)],
    [],
    ["Catatan Proyek:"],
    ["- Seluruh kalkulasi bahan dan biaya didasarkan pada standar koefisien analisis AHSP PUPR."],
    ["- Harga unit bahan dilapangan sewaktu-waktu dapat disesuaikan untuk efisiensi margin lebih lanjut."]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);

  // Set widths for a neat alignment
  wsSummary['!cols'] = [
    { wch: 35 },
    { wch: 45 }
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Rencana");

  // --- SHEET 2: DAFTAR RINCIAN PEKERJAAN (RAB vs RAP) ---
  const detailedSheetHeaders = [
    [
      "No",
      "Kategori Pekerjaan",
      "Uraian / Item Pekerjaan (Rincian Komponen)",
      "Volume / Kebutuhan",
      "Satuan",
      "Harga Satuan RAB Owner (Rp)",
      "Total RAB Owner (Rp)",
      "Kode AHSP / Koefisien",
      "Harga Satuan RAP Fisik (Rp)",
      "Total RAP Fisik (Rp)",
      "Keuntungan / Profit (Rp)",
      "Persen Margin (%)"
    ]
  ];

  const detailedRows: any[] = [];
  rapItems.forEach((item, idx) => {
    const matchedRab = rabItems.find(r => r.id === item.id);
    
    // Add the main job item row
    detailedRows.push([
      idx + 1,
      item.category,
      item.name,
      item.volume,
      item.unit,
      matchedRab?.unitPrice ? Math.round(matchedRab.unitPrice) : 0,
      matchedRab?.totalPrice ? Math.round(matchedRab.totalPrice) : 0,
      item.matchedAHSPCode || "-",
      Math.round(item.unitDirectCost),
      Math.round(item.totalDirectCost),
      Math.round(item.profit),
      Number(item.profitPercentage.toFixed(1))
    ]);

    // Detail each resource components inside this item
    if (item.resources && item.resources.length > 0) {
      const mats = item.resources.filter(res => res.type === "material");
      const labor = item.resources.filter(res => res.type === "labor");
      const equip = item.resources.filter(res => res.type === "equipment");

      if (mats.length > 0) {
        detailedRows.push([
          "",
          "",
          "   [Porsi Komponen Bahan / Material]",
          "",
          "",
          "",
          "",
          "",
          "",
          Math.round(mats.reduce((sum, r) => sum + r.totalCost, 0)),
          "",
          ""
        ]);
        mats.forEach(res => {
          detailedRows.push([
            "",                                  // No
            "",                                  // Kategori Pekerjaan
            `     • ${res.name}`,               // Uraian
            Number(res.neededQuantity.toFixed(4)), // Kebutuhan Kuantitas Fisik
            res.unit,                            // Satuan
            "",                                  // Harga Satuan RAB Owner
            "",                                  // Total RAB Owner
            `Koef: ${res.coefficient.toFixed(4)}`, // Koefisien AHSP Standard
            Math.round(res.unitPrice),           // Harga Satuan Lapangan RAP
            Math.round(res.totalCost),           // Total Subtotal Biaya RAP
            "",                                  // Keuntungan
            ""                                   // Persen Margin
          ]);
        });
      }



      if (equip.length > 0) {
        detailedRows.push([
          "",
          "",
          "   [Porsi Komponen Alat & Perlengkapan]",
          "",
          "",
          "",
          "",
          "",
          "",
          Math.round(equip.reduce((sum, r) => sum + r.totalCost, 0)),
          "",
          ""
        ]);
        equip.forEach(res => {
          detailedRows.push([
            "",                                  // No
            "",                                  // Kategori Pekerjaan
            `     • ${res.name}`,               // Uraian
            Number(res.neededQuantity.toFixed(4)), // Kebutuhan Kuantitas Fisik
            res.unit,                            // Satuan
            "",                                  // Harga Satuan RAB Owner
            "",                                  // Total RAB Owner
            `Koef: ${res.coefficient.toFixed(4)}`, // Koefisien AHSP Standard
            Math.round(res.unitPrice),           // Harga Satuan Lapangan RAP
            Math.round(res.totalCost),           // Total Subtotal Biaya RAP
            "",                                  // Keuntungan
            ""                                   // Persen Margin
          ]);
        });
      }

      // Add a subtle empty row to separate work items beautifully
      detailedRows.push([]);
    }
  });

  // Add Grand Totals to detailed sheet
  const detailedSheetData = [
    ...detailedSheetHeaders,
    ...detailedRows,
    [],
    [
      "TOTAL ANGGARAN PROYEK",
      "",
      "",
      "",
      "",
      "",
      totalRAB,
      "",
      "",
      totalRAP,
      totalProfit,
      Number(marginPercentage.toFixed(1))
    ]
  ];

  const wsDetails = XLSX.utils.aoa_to_sheet(detailedSheetData);
  wsDetails['!cols'] = [
    { wch: 5 },  // No
    { wch: 25 }, // Kategori
    { wch: 35 }, // Uraian
    { wch: 10 }, // Volume
    { wch: 8 },  // Satuan
    { wch: 20 }, // H. Satuan RAB
    { wch: 20 }, // Total RAB
    { wch: 15 }, // Kode
    { wch: 20 }, // H. Satuan RAP
    { wch: 20 }, // Total RAP
    { wch: 20 }, // Profit
    { wch: 15 }  // Profit %
  ];

  XLSX.utils.book_append_sheet(wb, wsDetails, "Rincian Pekerjaan");

  // --- SHEET 3: REKAPITULASI BAHAN (Purchase Order List) ---
  const materialsHeaders = [["Nama Bahan / Material", "Satuan", "Total Kebutuhan", "Harga Satuan Lapangan (Rp)", "Total Subtotal Biaya (Rp)"]];
  const materialsRows = materials.map(m => [m.name, m.unit, m.totalQuantity, m.unitPrice, m.totalPrice]);
  const materialsSheetData = [...materialsHeaders, ...materialsRows];
  const wsMaterials = XLSX.utils.aoa_to_sheet(materialsSheetData);
  wsMaterials['!cols'] = [
    { wch: 35 }, // name
    { wch: 10 }, // unit
    { wch: 15 }, // quantity
    { wch: 20 }, // unit price
    { wch: 20 }  // total price
  ];
  XLSX.utils.book_append_sheet(wb, wsMaterials, "Kebutuhan Bahan");



  // --- SHEET 5: REKAPITULASI PERALATAN ---
  const equipmentHeaders = [["Nama Alat Bantu / Berat", "Satuan sewa", "Total Pemakaian", "Tarif Sewa Alat (Rp)", "Total Subtotal Biaya (Rp)"]];
  const equipmentRows = equipments.map(e => [e.name, e.unit, e.totalQuantity, e.unitPrice, e.totalPrice]);
  const equipmentSheetData = [...equipmentHeaders, ...equipmentRows];
  const wsEquipment = XLSX.utils.aoa_to_sheet(equipmentSheetData);
  wsEquipment['!cols'] = [
    { wch: 35 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, wsEquipment, "Kebutuhan Sewa Alat");

  // Write and trigger download
  const cleanFilename = (projectName || "RAP_Konstruksi").replace(/\s+/g, '_') + "_AHSP.xlsx";
  XLSX.writeFile(wb, cleanFilename);
}
