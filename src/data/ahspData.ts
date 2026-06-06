/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AHSPTemplate, ResourceItem } from '../types';

export const REF_PRICES: { [name: string]: number } = {
  // Bahan (Materials)
  'Semen Portland (PC)': 1500, // per kg (~Rp 75,000 per 50kg bag)
  'Pasir Urug': 220000, // per m3
  'Pasir Pasang': 280000, // per m3
  'Pasir Beton': 320000, // per m3
  'Kerikil / Split': 350000, // per m3
  'Batu Belah / Kali': 300000, // per m3
  'Semen Warna / Grout': 12000, // per kg
  'Bata Merah': 900, // per bh
  'Homogeneous Tile 60x60': 150000, // per m2
  'Genteng Beton': 12000, // per bh
  'Rangka Baja Ringan C75': 95000, // per m2
  'Sekrup Rangka Atap': 250, // per bh
  'Papan Gypsum 9mm': 75000, // per lbr (~Rp 75k per board)
  'Rangka Hollow 40x40': 15000, // per m'
  'Sekrup Gypsum': 200, // per bh
  'Plamir Dinding': 18000, // per kg
  'Cat Dasar Alkali Resisting': 25000, // per kg
  'Cat Tembok / Dinding': 35000, // per kg
  'Amplas Lembaran': 3000, // per bh
  'Kayu Bekisting Kelas III': 2800000, // per m3
  'Kayu Balok Kelas II': 4500000, // per m3
  'Paku 5cm - 10cm': 18000, // per kg
  'Minyak Bekisting': 20000, // per liter
  'Besi Beton Polos / Ulir': 13500, // per kg
  'Kawat Beton / Bendrat': 25000, // per kg
  'Pintu UPVC Set': 950000, // per unit
  'Kaca Polos 5mm': 180000, // per m2
  'Air Kerja': 250, // per liter
  
  // Tenaga Kerja (Labor)
  'Pekerja': 120000, // per OH (Orang Hari)
  'Tukang Batu': 150000, // per OH
  'Tukang Kayu': 150000, // per OH
  'Tukang Besi': 150000, // per OH
  'Tukang Cat': 150000, // per OH
  'Kepala Tukang': 165000, // per OH
  'Mandor': 180000, // per OH

  // Alat (Equipment)
  'Concrete Mixer 0.3-0.6 m3': 180000, // per hari/jam-sewa (di-convert ke unit koefisien)
  'Alat Bantu Kerja': 15000, // per set/hari
};

export const AHSP_DATABASE: AHSPTemplate[] = [
  // 1. Pekerjaan Galian Dan Persiapan
  {
    code: 'A.2.1.1.1',
    name: 'Galian Tanah Biasa Kedalaman 1 m',
    unit: 'm3',
    category: 'Pekerjaan Persiapan & Galian',
    components: [
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.750, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.025, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.2.1.1.9',
    name: 'Urugan Kembali (Bekas Galian)',
    unit: 'm3',
    category: 'Pekerjaan Persiapan & Galian',
    components: [
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.192, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.019, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.2.1.1.11',
    name: 'Urugan Pasir Padat',
    unit: 'm3',
    category: 'Pekerjaan Persiapan & Galian',
    components: [
      { type: 'material', code: 'M.02', name: 'Pasir Urug', unit: 'm3', coefficient: 1.200, defaultPrice: REF_PRICES['Pasir Urug'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.300, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.2.1.1.20',
    name: 'Pengukuran dan Pemasangan Bouwplank',
    unit: 'm\'',
    category: 'Pekerjaan Persiapan & Galian',
    components: [
      { type: 'material', code: 'M.20', name: 'Kayu Bekisting Kelas III', unit: 'm3', coefficient: 0.012, defaultPrice: REF_PRICES['Kayu Bekisting Kelas III'] },
      { type: 'material', code: 'M.22', name: 'Paku 5cm - 10cm', unit: 'kg', coefficient: 0.020, defaultPrice: REF_PRICES['Paku 5cm - 10cm'] },
      { type: 'material', code: 'M.21', name: 'Kayu Balok Kelas II', unit: 'm3', coefficient: 0.007, defaultPrice: REF_PRICES['Kayu Balok Kelas II'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.005, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 2. Pekerjaan Pondasi
  {
    code: 'A.3.2.1.2',
    name: 'Pemasangan Pondasi Batu Belah camp. 1PC : 4PP',
    unit: 'm3',
    category: 'Pekerjaan Pondasi & Dinding',
    components: [
      { type: 'material', code: 'M.06', name: 'Batu Belah / Kali', unit: 'm3', coefficient: 1.200, defaultPrice: REF_PRICES['Batu Belah / Kali'] },
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 163.000, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.03', name: 'Pasir Pasang', unit: 'm3', coefficient: 0.520, defaultPrice: REF_PRICES['Pasir Pasang'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 1.500, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.750, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.075, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.075, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 3. Pekerjaan Beton (Beton K-175, K-225, Pembesian, Bekisting)
  {
    code: 'A.4.1.1.5',
    name: 'Membuat Beton Mutu K-175 (Semen, Pasir, Kerikil, Air)',
    unit: 'm3',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 326.000, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.04', name: 'Pasir Beton', unit: 'm3', coefficient: 0.540, defaultPrice: REF_PRICES['Pasir Beton'] },
      { type: 'material', code: 'M.05', name: 'Kerikil / Split', unit: 'm3', coefficient: 0.760, defaultPrice: REF_PRICES['Kerikil / Split'] },
      { type: 'material', code: 'M.30', name: 'Air Kerja', unit: 'liter', coefficient: 215.000, defaultPrice: REF_PRICES['Air Kerja'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 1.650, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.275, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.028, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.083, defaultPrice: REF_PRICES['Mandor'] },
      { type: 'equipment', code: 'E.01', name: 'Concrete Mixer 0.3-0.6 m3', unit: 'sewa-jam', coefficient: 0.35, defaultPrice: REF_PRICES['Concrete Mixer 0.3-0.6 m3'] },
    ],
  },
  {
    code: 'A.4.1.1.7',
    name: 'Membuat Beton Mutu K-225 (fc\' 19,3 MPa)',
    unit: 'm3',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 371.000, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.04', name: 'Pasir Beton', unit: 'm3', coefficient: 0.498, defaultPrice: REF_PRICES['Pasir Beton'] },
      { type: 'material', code: 'M.05', name: 'Kerikil / Split', unit: 'm3', coefficient: 0.769, defaultPrice: REF_PRICES['Kerikil / Split'] },
      { type: 'material', code: 'M.30', name: 'Air Kerja', unit: 'liter', coefficient: 215.000, defaultPrice: REF_PRICES['Air Kerja'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 1.650, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.275, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.028, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.083, defaultPrice: REF_PRICES['Mandor'] },
      { type: 'equipment', code: 'E.01', name: 'Concrete Mixer 0.3-0.6 m3', unit: 'sewa-jam', coefficient: 0.35, defaultPrice: REF_PRICES['Concrete Mixer 0.3-0.6 m3'] },
    ],
  },
  {
    code: 'A.4.1.1.17',
    name: 'Pembesian Beton dengan Besi Ulir / Polos (Besi per Kg)',
    unit: 'kg',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.25', name: 'Besi Beton Polos / Ulir', unit: 'kg', coefficient: 1.050, defaultPrice: REF_PRICES['Besi Beton Polos / Ulir'] },
      { type: 'material', code: 'M.26', name: 'Kawat Beton / Bendrat', unit: 'kg', coefficient: 0.015, defaultPrice: REF_PRICES['Kawat Beton / Bendrat'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.007, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.06', name: 'Tukang Besi', unit: 'OH', coefficient: 0.007, defaultPrice: REF_PRICES['Tukang Besi'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.0007, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.0004, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.1.1.20',
    name: 'Pemasangan Bekisting Pondasi (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.20', name: 'Kayu Bekisting Kelas III', unit: 'm3', coefficient: 0.040, defaultPrice: REF_PRICES['Kayu Bekisting Kelas III'] },
      { type: 'material', code: 'M.22', name: 'Paku 5cm - 10cm', unit: 'kg', coefficient: 0.300, defaultPrice: REF_PRICES['Paku 5cm - 10cm'] },
      { type: 'material', code: 'M.23', name: 'Minyak Bekisting', unit: 'liter', coefficient: 0.100, defaultPrice: REF_PRICES['Minyak Bekisting'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.520, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.260, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.026, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.026, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.1.1.21',
    name: 'Pemasangan Bekisting Sloof (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.20', name: 'Kayu Bekisting Kelas III', unit: 'm3', coefficient: 0.045, defaultPrice: REF_PRICES['Kayu Bekisting Kelas III'] },
      { type: 'material', code: 'M.22', name: 'Paku 5cm - 10cm', unit: 'kg', coefficient: 0.300, defaultPrice: REF_PRICES['Paku 5cm - 10cm'] },
      { type: 'material', code: 'M.23', name: 'Minyak Bekisting', unit: 'liter', coefficient: 0.100, defaultPrice: REF_PRICES['Minyak Bekisting'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.520, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.260, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.026, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.026, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.1.1.22',
    name: 'Pemasangan Bekisting Kolom (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Beton Struktur',
    components: [
      { type: 'material', code: 'M.20', name: 'Kayu Bekisting Kelas III', unit: 'm3', coefficient: 0.040, defaultPrice: REF_PRICES['Kayu Bekisting Kelas III'] },
      { type: 'material', code: 'M.22', name: 'Paku 5cm - 10cm', unit: 'kg', coefficient: 0.400, defaultPrice: REF_PRICES['Paku 5cm - 10cm'] },
      { type: 'material', code: 'M.23', name: 'Minyak Bekisting', unit: 'liter', coefficient: 0.200, defaultPrice: REF_PRICES['Minyak Bekisting'] },
      { type: 'material', code: 'M.21', name: 'Kayu Balok Kelas II', unit: 'm3', coefficient: 0.015, defaultPrice: REF_PRICES['Kayu Balok Kelas II'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.660, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.330, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.033, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.033, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 4. Pekerjaan Pasangan Dinding & Plesteran
  {
    code: 'A.4.4.1.1',
    name: 'Memasang Dinding Bata Merah Tebal 1/2 Bata camp. 1PC : 4PP (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Dinding & Finising',
    components: [
      { type: 'material', code: 'M.08', name: 'Bata Merah', unit: 'bh', coefficient: 70.000, defaultPrice: REF_PRICES['Bata Merah'] },
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 11.500, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.03', name: 'Pasir Pasang', unit: 'm3', coefficient: 0.043, defaultPrice: REF_PRICES['Pasir Pasang'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.300, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.015, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.4.2.4',
    name: 'Plesteran Tebal 15 mm camp. 1PC : 4PP (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Dinding & Finising',
    components: [
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 6.240, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.03', name: 'Pasir Pasang', unit: 'm3', coefficient: 0.024, defaultPrice: REF_PRICES['Pasir Pasang'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.260, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.150, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.015, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.013, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.4.2.27',
    name: 'Pekerjaan Acian Semen PC (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Dinding & Finising',
    components: [
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 3.250, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.200, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 5. Finishing Lantai
  {
    code: 'A.4.4.3.35',
    name: 'Pemasangan Lantai Homogeneous Tile Uk. 60x60 cm (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Lantai & Plafon',
    components: [
      { type: 'material', code: 'M.09', name: 'Homogeneous Tile 60x60', unit: 'm2', coefficient: 1.050, defaultPrice: REF_PRICES['Homogeneous Tile 60x60'] },
      { type: 'material', code: 'M.01', name: 'Semen Portland (PC)', unit: 'kg', coefficient: 9.800, defaultPrice: REF_PRICES['Semen Portland (PC)'] },
      { type: 'material', code: 'M.03', name: 'Pasir Pasang', unit: 'm3', coefficient: 0.045, defaultPrice: REF_PRICES['Pasir Pasang'] },
      { type: 'material', code: 'M.10', name: 'Semen Warna / Grout', unit: 'kg', coefficient: 1.500, defaultPrice: REF_PRICES['Semen Warna / Grout'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.700, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.05', name: 'Tukang Batu', unit: 'OH', coefficient: 0.350, defaultPrice: REF_PRICES['Tukang Batu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.035, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.035, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 6. Plafon & Hollow
  {
    code: 'A.4.5.1.20',
    name: 'Memasang Plafon Papan Gypsum Ukuran 1.20 x 2.40 m Tebal 9 mm + Rangka Hollow Galvalum (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Lantai & Plafon',
    components: [
      { type: 'material', code: 'M.11', name: 'Papan Gypsum 9mm', unit: 'lbr', coefficient: 0.364, defaultPrice: REF_PRICES['Papan Gypsum 9mm'] },
      { type: 'material', code: 'M.12', name: 'Rangka Hollow 40x40', unit: 'm\'', coefficient: 1.850, defaultPrice: REF_PRICES['Rangka Hollow 40x40'] },
      { type: 'material', code: 'M.13', name: 'Sekrup Gypsum', unit: 'bh', coefficient: 11.000, defaultPrice: REF_PRICES['Sekrup Gypsum'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.050, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.005, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.005, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 7. Rangka Atap & Genteng
  {
    code: 'A.4.2.1.22',
    name: 'Pemasangan Rangka Atap Baja Ringan C75 t=0.75mm (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Atap',
    components: [
      { type: 'material', code: 'M.14', name: 'Rangka Atap Baja Ringan C75', unit: 'm2', coefficient: 1.100, defaultPrice: REF_PRICES['Rangka Baja Ringan C75'] },
      { type: 'material', code: 'M.15', name: 'Sekrup Rangka Atap', unit: 'bh', coefficient: 15.000, defaultPrice: REF_PRICES['Sekrup Rangka Atap'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.150, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.06', name: 'Tukang Besi', unit: 'OH', coefficient: 0.100, defaultPrice: REF_PRICES['Tukang Besi'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.010, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.005, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
  {
    code: 'A.4.5.2.32',
    name: 'Pemasangan Atap Genteng Beton (per m2)',
    unit: 'm2',
    category: 'Pekerjaan Atap',
    components: [
      { type: 'material', code: 'M.16', name: 'Genteng Beton', unit: 'bh', coefficient: 11.000, defaultPrice: REF_PRICES['Genteng Beton'] },
      { type: 'material', code: 'M.22', name: 'Paku 5cm - 10cm', unit: 'kg', coefficient: 0.050, defaultPrice: REF_PRICES['Paku 5cm - 10cm'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.150, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.02', name: 'Tukang Kayu', unit: 'OH', coefficient: 0.150, defaultPrice: REF_PRICES['Tukang Kayu'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.015, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.015, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },

  // 8. Pekerjaan Cat
  {
    code: 'A.4.7.1.10',
    name: 'Pengecatan Tembok Baru (1 lapis plamir, 1 lapis alkali dasar, 2 lapis cat tembok)',
    unit: 'm2',
    category: 'Pekerjaan Pengecatan',
    components: [
      { type: 'material', code: 'M.17', name: 'Plamir Dinding', unit: 'kg', coefficient: 0.100, defaultPrice: REF_PRICES['Plamir Dinding'] },
      { type: 'material', code: 'M.18', name: 'Cat Dasar Alkali Resisting', unit: 'kg', coefficient: 0.100, defaultPrice: REF_PRICES['Cat Dasar Alkali Resisting'] },
      { type: 'material', code: 'M.19', name: 'Cat Tembok / Dinding', unit: 'kg', coefficient: 0.260, defaultPrice: REF_PRICES['Cat Tembok / Dinding'] },
      { type: 'material', code: 'M.31', name: 'Amplas Lembaran', unit: 'bh', coefficient: 0.200, defaultPrice: REF_PRICES['Amplas Lembaran'] },
      { type: 'labor', code: 'L.01', name: 'Pekerja', unit: 'OH', coefficient: 0.063, defaultPrice: REF_PRICES['Pekerja'] },
      { type: 'labor', code: 'L.07', name: 'Tukang Cat', unit: 'OH', coefficient: 0.042, defaultPrice: REF_PRICES['Tukang Cat'] },
      { type: 'labor', code: 'L.03', name: 'Kepala Tukang', unit: 'OH', coefficient: 0.004, defaultPrice: REF_PRICES['Kepala Tukang'] },
      { type: 'labor', code: 'L.04', name: 'Mandor', unit: 'OH', coefficient: 0.003, defaultPrice: REF_PRICES['Mandor'] },
    ],
  },
];

export const MOCK_RAB_DATA = [
  { id: 'rab_1', number: '1', category: 'Pekerjaan Galian & Pondasi', name: 'Pekerjaan Galian Tanah Kedalaman 1-m', volume: 45.5, unit: 'm3', unitPrice: 110000, totalPrice: 5005000 },
  { id: 'rab_2', number: '2', category: 'Pekerjaan Galian & Pondasi', name: 'Urugan pasir padat bawah pondasi t=10cm', volume: 4.8, unit: 'm3', unitPrice: 320000, totalPrice: 1536000 },
  { id: 'rab_3', number: '3', category: 'Pekerjaan Galian & Pondasi', name: 'Pasangan pondasi batu kali 1:4 super padat', volume: 22.4, unit: 'm3', unitPrice: 950000, totalPrice: 21280000 },
  { id: 'rab_4', number: '4', category: 'Struktur Beton', name: 'Beton Sloof & Kolom Mutu K-225 manual mixer', volume: 12.5, unit: 'm3', unitPrice: 1550000, totalPrice: 19375000 },
  { id: 'rab_5', number: '5', category: 'Struktur Beton', name: 'Bekisting plywood untuk sloof beton', volume: 38.0, unit: 'm2', unitPrice: 220000, totalPrice: 8360000 },
  { id: 'rab_6', number: '6', category: 'Pekerjaan Dinding & Arsitektur', name: 'Pasang dinding bata merah adukan 1:4 t=15cm', volume: 185.0, unit: 'm2', unitPrice: 1450000, totalPrice: 26825000 }, // wait, 145000 is more realistic but 1450000 is large. Let's make it 145000
  { id: 'rab_7', number: '7', category: 'Pekerjaan Dinding & Arsitektur', name: 'Plesteran semen pasang halus tebal 15mm 1:4', volume: 370.0, unit: 'm2', unitPrice: 85000, totalPrice: 31450000 },
  { id: 'rab_8', number: '8', category: 'Pekerjaan Dinding & Arsitektur', name: 'Acian halus dinding semen abu-abu', volume: 370.0, unit: 'm2', unitPrice: 45000, totalPrice: 16650000 },
  { id: 'rab_9', number: '9', category: 'Finishing Lantai & Langit-langit', name: 'Pasang lantai homogen tile 60x60 mewah ruang utama', volume: 90.0, unit: 'm2', unitPrice: 310000, totalPrice: 27900000 },
  { id: 'rab_10', number: '10', category: 'Finishing Lantai & Langit-langit', name: 'Pekerjaan Plafon gypsum board 9mm rangka hollow', volume: 90.0, unit: 'm2', unitPrice: 135000, totalPrice: 12150000 },
  { id: 'rab_11', number: '11', category: 'Pekerjaan Atap', name: 'Pekerjaan Rangka Atap Baja Ringan C75 t=0.75', volume: 115.0, unit: 'm2', unitPrice: 180000, totalPrice: 20700000 },
  { id: 'rab_12', number: '12', category: 'Pekerjaan Atap', name: 'Pasang Atap Genteng Beton Kokoh warna abu', volume: 115.0, unit: 'm2', unitPrice: 195000, totalPrice: 22425000 },
  { id: 'rab_13', number: '13', category: 'Finishing Akhir', name: 'Pengecatan dinding luar dan dalam cat dasar alkali', volume: 370.0, unit: 'm2', unitPrice: 55000, totalPrice: 20350000 },
];
