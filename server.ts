/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up bodies with increased limits for handling base64 PDFs
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ limit: '40mb', extended: true }));

// Initialize Google GenAI
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiApiKey) {
  ai = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Robust JSON quote repair function for Gemini outputs
const cleanInvalidJSONQuotes = (jsonStr: string): string => {
  let cleanStr = jsonStr.trim();
  if (cleanStr.startsWith("```json")) {
    cleanStr = cleanStr.substring(7);
  } else if (cleanStr.startsWith("```")) {
    cleanStr = cleanStr.substring(3);
  }
  if (cleanStr.endsWith("```")) {
    cleanStr = cleanStr.substring(0, cleanStr.length - 3);
  }
  cleanStr = cleanStr.trim();

  // Repair malformed scientific looping number sequences (e.g. 10.5e-821557... with huge loops)
  // Since exponents like e-821557 in model output loop glitches represent numbers close to 0, or just infinite repetitious noise,
  // we capture any decimal/integer followed by e/E, a minus/plus, and more than 5 digits, and replace with just the prefix value.
  cleanStr = cleanStr.replace(/:\s*(-?\d+(?:\.\d+)?)[eE][+-]?\d{5,}/g, ': $1');
  cleanStr = cleanStr.replace(/e-[0-9]{10,}/gi, '');

  const lines = cleanStr.split("\n");
  const cleanedLines = lines.map(line => {
    // Only target string properties that look like: "key": "value" (with optional trailing comma or close bracket)
    const match = line.match(/^(\s*"[a-zA-Z0-9_]+")\s*:\s*"(.*)"\s*(,?)\s*$/);
    if (match) {
      const keyPart = match[1];
      const valuePart = match[2];
      const commaPart = match[3] || '';
      // Escape any double quote inside valuePart that is NOT already escaped
      const sanitizedValue = valuePart.replace(/(?<!\\)"/g, '\\"');
      return `${keyPart}: "${sanitizedValue}"${commaPart}`;
    }
    return line;
  });
  return cleanedLines.join("\n");
};

// Robust sanitization of raw JSON to prevent parser crash due to repetitious numeric output loops
const sanitizeRawJSONString = (raw: string): string => {
  let text = raw.trim();
  
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.substring(0, text.length - 3);
  }
  text = text.trim();

  // 1. Remove insanely long scientific exponents (e.g. e-821557... or numbers with huge loops)
  text = text.replace(/([0-9.]+)[eE][+-]?[0-9]{5,}/g, '$1'); 
  text = text.replace(/e-[0-9]{10,}/gi, '');

  // 2. Truncate decimal numbers with ultra-long decimal parts (e.g. 503937.00503937503937...)
  text = text.replace(/([":]\s*)(\d+)\.(\d{15,})(\d*)/g, (match, prefix, intPart, decPart) => {
    return prefix + intPart + "." + decPart.substring(0, 4);
  });

  // 3. Truncate ultra-long integer digits without quotes: e.g. 5039370050393700... -> 5039370050
  text = text.replace(/([":]\s*)(\d{15,})(\d*)/g, (match, prefix, firstPart) => {
    return prefix + firstPart.substring(0, 10);
  });

  // 4. Truncate ultra-long integer digits inside quotes: e.g. "5039370050393700..." -> "5039370050"
  text = text.replace(/([":]\s*")(\d{15,})(\d*)"/g, (match, prefix, firstPart) => {
    return prefix + firstPart.substring(0, 10) + '"';
  });

  return text;
};

// Loosely parse truncated or glitched JSON array by extracting syntactically valid object parts
const looseParseJSONArray = (rawJson: string): any[] => {
  const sanitized = sanitizeRawJSONString(rawJson);
  
  // Try standard parse first
  try {
    const result = JSON.parse(sanitized);
    if (Array.isArray(result)) return result;
    if (result && typeof result === 'object') return [result];
  } catch (e) {
    console.warn("Standard parse of sanitized JSON failed. Attempting object-level extraction.", e);
  }

  // Bracket/Brace nested object extraction fallback with string detection
  const items: any[] = [];
  let braceCount = 0;
  let objectStart = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        if (braceCount === 0) {
          objectStart = i;
        }
        braceCount++;
      } else if (char === '}') {
        if (braceCount > 0) {
          braceCount--;
          if (braceCount === 0 && objectStart !== -1) {
            const objCandidate = sanitized.substring(objectStart, i + 1);
            try {
              const parsedObj = JSON.parse(objCandidate);
              if (parsedObj && typeof parsedObj === 'object') {
                items.push(parsedObj);
              }
            } catch (err) {
              // Try repairing the quotes before parsing
              try {
                const repairedObj = cleanInvalidJSONQuotes(objCandidate);
                const parsedRepaired = JSON.parse(repairedObj);
                if (parsedRepaired && typeof parsedRepaired === 'object') {
                  items.push(parsedRepaired);
                }
              } catch (errInner) {
                // Ignore invalid/unparseable objects
              }
            }
          }
        }
      }
    }
  }

  if (items.length > 0) {
    console.log(`Successfully extracted ${items.length} valid objects from loose/truncated JSON.`);
    return items;
  }

  return [];
};

// Simple fallback matcher when Gemini is not available or fails
const keywordFallbackMatcher = (name: string): string => {
  const norm = name.toLowerCase();
  if (norm.includes('galian') || norm.includes('gali')) return 'A.2.1.1.1';
  if (norm.includes('urug') && norm.includes('pasir')) return 'A.2.1.1.11';
  if (norm.includes('urug')) return 'A.2.1.1.9';
  if (norm.includes('pasang') && norm.includes('pondasi')) return 'A.3.2.1.2';
  if (norm.includes('pondasi') && norm.includes('batu')) return 'A.3.2.1.2';
  if (norm.includes('sloof') || norm.includes('kolom') || norm.includes('beton')) {
    if (norm.includes('175')) return 'A.4.1.1.5';
    return 'A.4.1.1.7'; // default K-225
  }
  if (norm.includes('bekisting')) {
    if (norm.includes('sloof')) return 'A.4.1.1.21';
    if (norm.includes('kolom') || norm.includes('balok')) return 'A.4.1.1.22';
    return 'A.4.1.1.20';
  }
  if (norm.includes('besi') || norm.includes('pembesian') || norm.includes('tulangan')) return 'A.4.1.1.17';
  if (norm.includes('dinding') || norm.includes('bata') || norm.includes('tembok')) return 'A.4.4.1.1';
  if (norm.includes('plesteran') || norm.includes('plester')) return 'A.4.4.2.4';
  if (norm.includes('acian') || norm.includes('aci')) return 'A.4.4.2.27';
  if (norm.includes('homogeneous') || norm.includes('ht') || norm.includes('granit') || norm.includes('keramik')) return 'A.4.4.3.35';
  if (norm.includes('plafon') || norm.includes('gypsum') || norm.includes('langit')) return 'A.4.5.1.20';
  if (norm.includes('baja ringan') || norm.includes('kuda-kuda')) return 'A.4.2.1.22';
  if (norm.includes('genteng') || norm.includes('atap')) return 'A.4.5.2.32';
  if (norm.includes('cat') || norm.includes('pengecatan') || norm.includes('bodi')) return 'A.4.7.1.10';
  return '';
};

// API Routes

// 1. Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiEnabled: !!ai });
});

// 2. Parse RAB (PDF base64 or Text)
app.post("/api/parse-rab", async (req, res): Promise<any> => {
  const { fileData, fileType, textData } = req.body;

  if (!ai) {
    console.warn("GEMINI_API_KEY is not configured or initialized. Using fallback mock parsing.");
    return res.status(200).json({
      success: true,
      mode: "fallback",
      message: "Menggunakan pelapis parsing lokal karena API Key belum siap.",
      data: []
    });
  }

  try {
    let contents: any[] = [];
    let prompt = `Anda adalah ahli estimasi biaya konstruksi sipil Indonesia (civil estimator). 
Tugas Anda adalah membaca data RAB (Rencana Anggaran Biaya) proyek konstruksi terlampir dan mengekstrak semua item pekerjaan secara akurat ke dalam format JSON. 

Item pekerjaan ini biasanya terstruktur dalam tabel yang berisi:
1. Kategori/Bab Pekerjaan (misal: "Pekerjaan Persiapan", "Pekerjaan Pondasi", "Pekerjaan Atap")
2. Deskripsi/Nama Pekerjaan (misal: "Galian tanah biasa kedalaman 1m", "Pasangan bata merah 1:4")
3. Volume (angka desimal/bulat)
4. Satuan (misal: "m3", "m2", "m'", "kg", "bh", "ls")
5. Harga Satuan (opsional)
6. Total Harga (opsional)

Mohon ekstrak semua item pekerjaan tersebut. Masukkan data volume dan harga sebagai angka murni (number), hilangkan lambang Rp, titik ribuan, atau koma desimal Indonesia harus diubah menjadi standar titik desimal JSON (misal Rp 1.500.000,50 menjadi 1500000.50 atau volume 45,5 menjadi 45.5).

Kembalikan data dalam format Array JSON yang murni, tanpa bungkus markdown.`;

    if (fileData && fileType === "application/pdf") {
      // PDF file parsing
      contents = [
        {
          inlineData: {
            data: fileData,
            mimeType: "application/pdf"
          }
        },
        prompt
      ];
    } else {
      // Direct text parsing
      const rawText = textData || "";
      if (!rawText.trim()) {
        return res.status(400).json({ success: false, error: "Tidak ada dokumen atau teks yang dikirimkan." });
      }
      contents = [
        `Berikut adalah data teks mentah dari file RAB atau ketikan manual:\n\n${rawText}\n\n---\n\n${prompt}`
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Kategori bab pekerjaan" },
              name: { type: Type.STRING, description: "Nama item pekerjaan lengkap" },
              volume: { type: Type.NUMBER, description: "Volume kuantitas pekerjaan (angka desimal/bulat)" },
              unit: { type: Type.STRING, description: "Satuan pekerjaan, e.g. m3, m2, kg, m', bh, titik, ls" },
              unitPrice: { type: Type.NUMBER, description: "Harga satuan dari RAB pemilik jika tertera (angka murni, berikan 0 jika kosong atau non-numeric)" },
              totalPrice: { type: Type.NUMBER, description: "Total harga pekerjaan dari RAB pemilik (angka murni, berikan 0 jika kosong atau non-numeric)" }
            },
            required: ["category", "name", "volume", "unit"]
          }
        }
      }
    });

    const parsedText = response.text?.trim() || "[]";
    const items = looseParseJSONArray(parsedText);

    if (!items || items.length === 0) {
      throw new Error("Format dokumen RAB terlalu rumit atau respons terpotong oleh AI. Mohon gunakan data teks yang lebih ringkas.");
    }

    // Complement with local keyword auto-matching
    const itemsWithMapping = items.map((item: any, idx: number) => {
      const generatedId = `rab_extracted_${Date.now()}_${idx}`;
      
      const cleanNumber = (val: any): number => {
        if (val === undefined || val === null) return 0;
        if (typeof val === 'number') {
          return isNaN(val) ? 0 : val;
        }
        // Clean any alphanumeric/symbol/repetition noise out of string so we obtain a clean float
        const cleanedStr = String(val).replace(/[^0-9.\-eE]/g, '');
        const parsed = parseFloat(cleanedStr);
        return isNaN(parsed) ? 0 : parsed;
      };

      const vol = cleanNumber(item.volume);
      const uPrice = cleanNumber(item.unitPrice);
      const tPrice = cleanNumber(item.totalPrice) || (vol * uPrice);

      return {
        id: generatedId,
        category: item.category || "Pekerjaan Konstruksi",
        name: item.name,
        volume: vol,
        unit: item.unit || "unit",
        unitPrice: uPrice,
        totalPrice: tPrice,
        suggestedAHSPCode: keywordFallbackMatcher(item.name)
      };
    });

    return res.json({
      success: true,
      mode: "gemini",
      data: itemsWithMapping
    });

  } catch (error: any) {
    console.error("Gemini Parsing Error:", error);
    return res.status(500).json({
      success: false,
      error: "Gagal memproses dokumen dengan AI: " + error.message,
    });
  }
});

// 3. Match AHSP (Intelligent mapping using Gemini)
app.post("/api/match-ahsp", async (req, res): Promise<any> => {
  const { rabItems, availableAHSP } = req.body;

  if (!rabItems || !Array.isArray(rabItems)) {
    return res.status(400).json({ success: false, error: "rabItems tidak valid" });
  }

  // If Gemini is not available, do fast keyword local matching
  if (!ai) {
    const fallbackResults = rabItems.map(item => ({
      rabItemId: item.id,
      matchedAHSPCode: keywordFallbackMatcher(item.name)
    }));
    return res.json({ success: true, mode: "fallback", mappings: fallbackResults });
  }

  try {
    const listForPrompt = rabItems.map(item => ({ id: item.id, name: item.name, unit: item.unit }));
    const ahspForPrompt = availableAHSP.map((a: any) => ({ code: a.code, name: a.name, unit: a.unit }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Gunakan kepintaran Anda sebagai Civil Estimator di Indonesia yang hafal standard PUPR AHSP.
Tugas Anda adalah memasangkan (melakukan mapping) setiap item pekerjaan dari daftar RAB berikut ke kode AHSP yang paling relevan dari daftar standard AHSP yang disediakan di bawah ini.

Daftar Pekerjaan RAB:
${JSON.stringify(listForPrompt, null, 2)}

Daftar Standard AHSP Tersedia:
${JSON.stringify(ahspForPrompt, null, 2)}

Aturan Pasangan:
1. Cocokkan berdasarkan kesamaan makna, jenis bahan, dan pekerjaan (misal: "galian tanah sedalam 1 meter" sangat cocok dengan "Galian Tanah Biasa Kedalaman 1 m" -> A.2.1.1.1).
2. Perhatikan satuan pekerjaan (m3 dengan m3, m2 dengan m2).
3. Jika sama sekali tidak ada yang cocok kasar, carilah item terdekat atau biarkan "matchedAHSPCode" sebagai string kosong "".
4. Harus mengembalikan Array JSON berisi objek dengan properti "rabItemId" dan "matchedAHSPCode".

Format output wajib JSON array murni tanpa pembungkus lainnya.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rabItemId: { type: Type.STRING },
              matchedAHSPCode: { type: Type.STRING }
            },
            required: ["rabItemId", "matchedAHSPCode"]
          }
        }
      }
    });

    const parsedText = response.text?.trim() || "[]";
    const mappings = looseParseJSONArray(parsedText);
    return res.json({
      success: true,
      mode: "gemini",
      mappings
    });

  } catch (error: any) {
    console.error("Gemini Match Error:", error);
    // fallback
    const fallbackResults = rabItems.map(item => ({
      rabItemId: item.id,
      matchedAHSPCode: keywordFallbackMatcher(item.name)
    }));
    return res.json({ success: true, mode: "fallback", mappings: fallbackResults });
  }
});

// Vite Setup for serving React Frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
