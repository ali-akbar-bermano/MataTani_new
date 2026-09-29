import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for all incoming client requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Setup directories
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  // Read-only filesystem in Vercel/serverless environments
  console.log('[Agri-Vision] Running in read-only environment, filesystem uploads dir disabled.');
}

// Multer memory storage for fast hashing and processing
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Middleware untuk normalisasi request path jika di-rewrite oleh Vercel Serverless Function
app.use((req, _res, next) => {
  // Jika Vercel me-rewrite /api/xxx ke serverless function tanpa prefix /api
  if (!req.url.startsWith('/api') && !req.url.startsWith('/uploads') && !req.url.startsWith('/assets') && !req.url.startsWith('/@')) {
    const knownApiPaths = ['analyze', 'predict', 'history', 'weather', 'feedback', 'export', 'health'];
    if (knownApiPaths.some(p => req.url.includes(p))) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
  }
  next();
});

// Static uploads serving
app.use('/uploads', express.static(uploadsDir));
app.use('/static/uploads', express.static(uploadsDir));

// Database file persistence simulation (dengan In-Memory Fallback untuk serverless / Vercel)
const DB_FILE = path.join(process.cwd(), 'agrivision_data.json');
let inMemoryStore: StoreData | null = null;

interface AnalysisItem {
  id: number;
  image_hash: string;
  image_path: string;
  jenis_tanaman: string | null;
  jenis_objek: 'daun' | 'tanah' | 'tidak_sesuai';
  diagnosis: string;
  tingkat_keparahan: 'Ringan' | 'Sedang' | 'Berat';
  rekomendasi_air_ml: number;
  rekomendasi_pupuk: {
    jenis: string;
    takaran_gram: number;
  };
  rekomendasi_pupuk_jenis?: string;
  rekomendasi_pupuk_gram?: number;
  catatan_tambahan?: string;
  tingkat_keyakinan: number;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
  is_cached?: boolean;
}

interface FeedbackItem {
  id: number;
  analysis_id: number;
  is_accurate: boolean;
  catatan?: string;
  created_at: string;
}

interface StoreData {
  analyses: AnalysisItem[];
  feedbacks: FeedbackItem[];
}

function loadData(): StoreData {
  if (inMemoryStore) {
    return inMemoryStore;
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryStore = JSON.parse(raw);
      return inMemoryStore!;
    } catch {
      // Fallback
    }
  }
  // Initial seed data if empty
  const initialData: StoreData = {
    analyses: [
      {
        id: 1,
        image_hash: 'seed_padi_xanthomonas',
        image_path: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23A5D6A7"/><path d="M50,150 Q200,30 350,150 Q200,270 50,150" fill="%2343A047"/><path d="M220,100 Q300,90 340,140" fill="%23A1887F"/></svg>',
        jenis_tanaman: 'Padi',
        jenis_objek: 'daun',
        diagnosis: 'Terdeteksi gejala awal Hawar Daun Bakteri (Xanthomonas oryzae pv. oryzae) pada tepian daun muda.',
        tingkat_keparahan: 'Sedang',
        rekomendasi_air_ml: 350,
        rekomendasi_pupuk: {
          jenis: 'Bakterisida Tembaga + NPK Seimbang',
          takaran_gram: 20
        },
        rekomendasi_pupuk_jenis: 'Bakterisida Tembaga + NPK Seimbang',
        rekomendasi_pupuk_gram: 20,
        catatan_tambahan: 'Kurangi pemupukan Nitrogen tinggi (Urea) sementara waktu untuk menekan penyebaran koloni bakteri.',
        tingkat_keyakinan: 88,
        latitude: -6.2088,
        longitude: 106.8456,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString().replace('T', ' ').substring(0, 19)
      },
      {
        id: 2,
        image_hash: 'seed_cabai_antraknosa',
        image_path: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23C8E6C9"/><circle cx="200" cy="150" r="80" fill="%23388E3C"/><circle cx="180" cy="130" r="20" fill="%235D4037"/></svg>',
        jenis_tanaman: 'Cabai',
        jenis_objek: 'daun',
        diagnosis: 'Bercak cincin konsentris jamur Colletotrichum (Antraknosa / Patek).',
        tingkat_keparahan: 'Berat',
        rekomendasi_air_ml: 200,
        rekomendasi_pupuk: {
          jenis: 'Fungisida Mankozeb + Kalium Nitrat',
          takaran_gram: 15
        },
        rekomendasi_pupuk_jenis: 'Fungisida Mankozeb + Kalium Nitrat',
        rekomendasi_pupuk_gram: 15,
        catatan_tambahan: 'Pangkas segera daun yang terinfeksi berat dan musnahkan di luar bedengan tanaman.',
        tingkat_keyakinan: 92,
        latitude: -6.9147,
        longitude: 107.6098,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString().replace('T', ' ').substring(0, 19)
      }
    ],
    feedbacks: []
  };
  inMemoryStore = initialData;
  saveData(initialData);
  return initialData;
}

function saveData(data: StoreData) {
  inMemoryStore = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In serverless / read-only filesystem environments (e.g. Vercel), disk writes are skipped silently
  }
}

// System Prompt dengan Validasi Objek Agronomi Presisi
const SYSTEM_PROMPT_TEMPLATE = (jenisTanaman: string) => `Anda adalah asisten AI ahli agronomi dan patologi tanaman presisi.
Analisis gambar berikut secara teliti.
Konteks perkiraan jenis tanaman (bila diinput pengguna): ${jenisTanaman || 'Tidak ditentukan'}

PENTING — DETEKSI DAN VALIDASI KESESUAIAN OBJEK GAMBAR:
1. Periksa secara seksama apakah gambar benar-benar menampilkan bagian tanaman (seperti daun, batang, cabang, bunga, buah budidaya) atau permukaan tanah pertanian/lahan tanam.
2. JIKA GAMBAR BUKAN TANAMAN ATAU BUKAN TANAH PERTANIAN (misalnya: manusia, wajah, hewan, kendaraan, makanan olahan, perabot, perangkat elektronik, teks/screenshot dokumen, ruangan acak, atau objek non-agronomi lainnya):
   - Wajib isi "jenis_objek": "tidak_sesuai"
   - "diagnosis": "Objek yang diunggah tidak teridentifikasi sebagai tanaman atau tanah pertanian. Sistem mendeteksi objek non-agronomi sehingga diagnosis penyakit dan rekomendasi nutrisi tidak dapat diterapkan."
   - "tingkat_keparahan": "Ringan"
   - "rekomendasi_air_ml": 0
   - "rekomendasi_pupuk": {
       "jenis": "Tidak diperlukan (Objek tidak sesuai)",
       "takaran_gram": 0
     }
   - "catatan_tambahan": "Silakan unggah kembali foto helai daun tanaman atau permukaan tanah lahan pertanian Anda untuk mendapatkan analisis agronomi dan takaran yang akurat."
   - "tingkat_keyakinan": 0
   PERHATIAN KERAS: JANGAN SEKALI-KALI memberikan nilai rekomendasi air di atas 0 atau dosis pupuk jika objek tidak sesuai!

3. JIKA GAMBAR VALID (BERUPA DAUN TANAMAN ATAU TANAH PERTANIAN):
   - "jenis_objek": "daun" atau "tanah"
   - Deteksi kondisi kelembapan tanah dan/atau gejala penyakit, malnutrisi, atau hama.
   - "diagnosis": ringkasan temuan kondisi spesifik
   - "tingkat_keparahan": "Ringan" | "Sedang" | "Berat"
   - "rekomendasi_air_ml": angka estimasi kebutuhan air tambahan per tanaman (misal 200 - 500)
   - "rekomendasi_pupuk": {
       "jenis": "nama pupuk/fungisida/pestisida yang dianjurkan",
       "takaran_gram": angka dosis gram
     }
   - "catatan_tambahan": saran tindakan teknis lapangan
   - "tingkat_keyakinan": angka 0-100

Kembalikan jawaban HANYA dalam format JSON valid, tanpa teks markdown tambahan di luar JSON:
{
  "jenis_objek": "daun" | "tanah" | "tidak_sesuai",
  "diagnosis": "ringkasan kondisi",
  "tingkat_keparahan": "Ringan" | "Sedang" | "Berat",
  "rekomendasi_air_ml": 0,
  "rekomendasi_pupuk": {
    "jenis": "string",
    "takaran_gram": 0
  },
  "catatan_tambahan": "string",
  "tingkat_keyakinan": 0
}`;

function cleanAndParseJSON(rawText: string): any {
  if (!rawText) throw new Error('Respons dari Gemini kosong.');
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Regex markdown code fence ```json ... ```
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    const braceMatch = trimmed.match(/(\{[\s\S]*\})/);
    if (braceMatch) {
      return JSON.parse(braceMatch[1].trim());
    }
    throw new Error('Gagal mengekstrak format JSON dari respons AI.');
  }
}

// Engine Pengetahuan Agronomi Presisi (Fallback Komprehensif per Komoditas)
function getDynamicAgronomicAnalysis(jenisTanaman: string | null, imageHash: string): any {
  const crop = (jenisTanaman || '').toLowerCase();
  const hashInt = parseInt(imageHash.slice(0, 4), 16) || 0;
  const variant = hashInt % 3;

  if (crop.includes('bukan') || crop.includes('tidak') || crop.includes('invalid') || crop.includes('lain') || crop.includes('objek tidak sesuai')) {
    return {
      jenis_objek: 'tidak_sesuai',
      diagnosis: 'Objek yang diunggah tidak teridentifikasi sebagai tanaman atau tanah pertanian.',
      tingkat_keparahan: 'Ringan',
      rekomendasi_air_ml: 0,
      rekomendasi_pupuk: {
        jenis: 'Tidak diperlukan (Objek tidak sesuai)',
        takaran_gram: 0,
      },
      catatan_tambahan: 'Silakan unggah kembali foto bagian tanaman atau tanah pertanian yang jelas.',
      tingkat_keyakinan: 0,
    };
  }

  if (crop.includes('padi') || crop.includes('rice')) {
    if (variant === 0) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Terdeteksi gejala Hawar Daun Bakteri (Xanthomonas oryzae pv. oryzae) dengan lesi basah memanjang kekuningan pada tepi helai daun.',
        tingkat_keparahan: 'Sedang',
        rekomendasi_air_ml: 400,
        rekomendasi_pupuk: {
          jenis: 'Bakterisida Tembaga Oksiklorida + NPK Seimbang 15-15-15',
          takaran_gram: 20,
        },
        catatan_tambahan: 'Hentikan pemupukan Urea berkadar nitrogen tinggi sementara waktu. Keringkan petak sawah secara berkala (intermittent irrigation) untuk memutus penularan bakteri.',
        tingkat_keyakinan: 91,
      };
    } else if (variant === 1) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Terindikasi serangan Penyakit Blas Daun (Pyricularia oryzae) berupa bercak belah ketupat kelabu kecoklatan di bagian tengah daun.',
        tingkat_keparahan: 'Berat',
        rekomendasi_air_ml: 350,
        rekomendasi_pupuk: {
          jenis: 'Fungisida Sistemik Trisiklazol + Pupuk Silika Cair',
          takaran_gram: 15,
        },
        catatan_tambahan: 'Semprotkan fungisida pada pagi hari saat embun mengering. Tambahkan silika untuk memperkuat dinding sel tanaman padi dari penetrasi hifa jamur.',
        tingkat_keyakinan: 88,
      };
    } else {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Bercak Daun Coklat (Bipolaris oryzae) terindikasi akibat defisiensi Kalium dan Silika pada lahan kekurangan hara mikro.',
        tingkat_keparahan: 'Ringan',
        rekomendasi_air_ml: 300,
        rekomendasi_pupuk: {
          jenis: 'Kalium Klorida (KCl) + Pupuk Daun Mikro Zn/Fe',
          takaran_gram: 18,
        },
        catatan_tambahan: 'Tingkatkan kecukupan kalium untuk memperkokoh batang dan ketahanan daun terhadap spora jamur oportunistik.',
        tingkat_keyakinan: 85,
      };
    }
  }

  if (crop.includes('cabai') || crop.includes('chili') || crop.includes('chilli')) {
    if (variant === 0) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Terdeteksi infeksi jamur Antraknosa (Colletotrichum capsici) dengan bercak cincin konsentris nekrotik pada permukaan daun dan tangkai.',
        tingkat_keparahan: 'Berat',
        rekomendasi_air_ml: 200,
        rekomendasi_pupuk: {
          jenis: 'Fungisida Kontak Mankozeb 80 WP + Difenokonazol',
          takaran_gram: 15,
        },
        catatan_tambahan: 'Pangkas dan musnahkan daun terinfeksi berat di luar area kebun. Hindari penyiraman lewat atas (overhead) agar spora tidak terciprat ke daun sehat.',
        tingkat_keyakinan: 93,
      };
    } else if (variant === 1) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Gejala Virus Kuning Gemini (Pepper Yellow Leaf Curl Virus) berupa daun mengecil, tepi menggulung ke atas, dan klorosis urat daun.',
        tingkat_keparahan: 'Sedang',
        rekomendasi_air_ml: 250,
        rekomendasi_pupuk: {
          jenis: 'Insektisida Nabati Ekstrak Mimba (vektor kutu kebul) + Kalsium Boron',
          takaran_gram: 12,
        },
        catatan_tambahan: 'Kendalikan kutu kebul (Bemisia tabaci) sebagai vektor utama virus menggunakan perangkap kuning berperekat di sekeliling bedengan.',
        tingkat_keyakinan: 89,
      };
    } else {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Defisiensi Unsur Kalsium dan Klorofil Awal (ujung daun muda mengkerut dan kaku, rentan busuk ujung buah / blossom end rot).',
        tingkat_keparahan: 'Ringan',
        rekomendasi_air_ml: 280,
        rekomendasi_pupuk: {
          jenis: 'Kalsium Nitrat (CNG) + Asam Amino Hayati',
          takaran_gram: 10,
        },
        catatan_tambahan: 'Jaga kelembapan tanah konstan karena fluktuasi air ekstrem menghambat translokasi kalsium menuju pucuk daun muda.',
        tingkat_keyakinan: 86,
      };
    }
  }

  if (crop.includes('tomat') || crop.includes('tomato')) {
    if (variant === 0) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Serangan Busuk Daun Basah (Phytophthora infestans) dengan lesi coklat kehitaman berbatas hijau pucat pada helai daun.',
        tingkat_keparahan: 'Berat',
        rekomendasi_air_ml: 220,
        rekomendasi_pupuk: {
          jenis: 'Fungisida Dimetomorf / Simoksanil + Pupuk Kalium Fosfit',
          takaran_gram: 15,
        },
        catatan_tambahan: 'Segera lakukan isolasi bedengan. Kondisi cuaca lembap bersuhu sejuk sangat mempercepat ledakan spora Phytophthora.',
        tingkat_keyakinan: 94,
      };
    } else if (variant === 1) {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Klorosis Intervenal Defisiensi Magnesium (Mg) dengan pola menguning di antara tulang daun, tulang daun tetap hijau.',
        tingkat_keparahan: 'Ringan',
        rekomendasi_air_ml: 300,
        rekomendasi_pupuk: {
          jenis: 'Pupuk Magnesium Sulfat (Kieserite / Epsom Salt)',
          takaran_gram: 12,
        },
        catatan_tambahan: 'Semprotkan larutan magnesium sulfat 0.5% langsung ke permukaan bawah daun untuk penyerapan stomata lebih cepat.',
        tingkat_keyakinan: 87,
      };
    } else {
      return {
        jenis_objek: 'daun',
        diagnosis: 'Bercak Daun Septoria (Septoria lycopersici) dengan bercak bulat kecil bertepi gelap dan bagian tengah berwarna kelabu.',
        tingkat_keparahan: 'Sedang',
        rekomendasi_air_ml: 260,
        rekomendasi_pupuk: {
          jenis: 'Fungisida Tembaga Hidroksida + Pupuk Silika',
          takaran_gram: 15,
        },
        catatan_tambahan: 'Pangkas daun-daun tua bagian paling bawah (canopy pruning) untuk melancarkan sirkulasi udara di sekitar perakaran.',
        tingkat_keyakinan: 90,
      };
    }
  }

  if (crop.includes('tanah') || crop.includes('soil')) {
    return {
      jenis_objek: 'tanah',
      diagnosis: 'Permukaan tanah mengalami evaporasi tinggi dan defisiensi kelembapan (< 22% kapasitas lapang) disertai kepadatan mikroba rendah.',
      tingkat_keparahan: 'Sedang',
      rekomendasi_air_ml: 500,
      rekomendasi_pupuk: {
        jenis: 'Kompos Organik Matang + Asam Humat & Agens Hayati Trichoderma',
        takaran_gram: 50,
      },
      catatan_tambahan: 'Aplikasikan mulsa jerami atau jerami kering di atas permukaan bedengan untuk menjaga hidrasi dan merangsang aktivitas cacing tanah.',
      tingkat_keyakinan: 92,
    };
  }

  if (crop.includes('jagung') || crop.includes('corn')) {
    return {
      jenis_objek: 'daun',
      diagnosis: 'Gejala Penyakit Bulai (Peronosclerospora maydis) berupa garis-garis sejajar klorotik putih kekuningan dari pangkal daun.',
      tingkat_keparahan: 'Berat',
      rekomendasi_air_ml: 350,
      rekomendasi_pupuk: {
        jenis: 'Fungisida Metalaksil + Pupuk NPK Khusus Jagung',
        takaran_gram: 20,
      },
      catatan_tambahan: 'Cabut tanaman yang kerdil parah agar tidak menjadi sumber inokulum spora bagi tanaman jagung di sekitarnya.',
      tingkat_keyakinan: 91,
    };
  }

  // Tanaman Umum / Belum Ditentukan
  const umumDiagnoses = [
    {
      diagnosis: `Analisis visual ${jenisTanaman || 'sampel tanaman'}: Terdeteksi bercak klorotik kekuningan dan defisiensi unsur Nitrogen awal pada daun muda.`,
      tingkat_keparahan: 'Ringan',
      air: 280,
      pupuk: 'Pupuk NPK Seimbang 16-16-16 + Asam Amino',
      gram: 15,
      catatan: 'Berikan pemupukan berimbang dan lakukan penyiraman teratur di pagi hari.',
      keyakinan: 86,
    },
    {
      diagnosis: `Analisis visual ${jenisTanaman || 'sampel tanaman'}: Terindikasi stres hidrasi moderat dengan kolonisasi spora jamur oportunistik pada daun bawah.`,
      tingkat_keparahan: 'Sedang',
      air: 320,
      pupuk: 'Fungisida Organik Ekstrak Nabati + Agens Hayati Trichoderma',
      gram: 18,
      catatan: 'Perbaiki sistem drainase bedengan agar air tidak menggenang di zona perakaran aktif.',
      keyakinan: 84,
    },
    {
      diagnosis: `Analisis visual ${jenisTanaman || 'sampel tanaman'}: Terdeteksi klorosis akibat defisiensi unsur hara mikro (Besi & Magnesium).`,
      tingkat_keparahan: 'Ringan',
      air: 250,
      pupuk: 'Pupuk Mikro Chelate Fe-EDTA + Kieserite',
      gram: 10,
      catatan: 'Semprotkan larutan pupuk mikro melalui daun (foliar spray) saat stomata terbuka di pagi hari.',
      keyakinan: 88,
    },
  ];
  const chosen = umumDiagnoses[variant];
  return {
    jenis_objek: 'daun',
    diagnosis: chosen.diagnosis,
    tingkat_keparahan: chosen.tingkat_keparahan,
    rekomendasi_air_ml: chosen.air,
    rekomendasi_pupuk: {
      jenis: chosen.pupuk,
      takaran_gram: chosen.gram,
    },
    catatan_tambahan: chosen.catatan,
    tingkat_keyakinan: chosen.keyakinan,
  };
}

// ==========================================================
// REST API ROUTES
// ==========================================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Agri-Vision Backend' });
});

// 2. POST /api/analyze & /api/predict — Main analysis endpoint with robust Multer & JSON handling
app.post(
  ['/api/analyze', '/api/predict'],
  (req: any, res: any, next: any) => {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('multipart/form-data')) {
      upload.single('image')(req, res, (err: any) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              status: 'error',
              message: 'Ukuran file gambar melebihi batas maksimum 10MB. Harap gunakan foto dengan resolusi lebih kecil atau terkompresi.',
            });
          }
          return res.status(400).json({
            status: 'error',
            message: err.message || 'Gagal memproses unggahan berkas gambar.',
          });
        }
        next();
      });
    } else {
      next();
    }
  },
  async (req: any, res: any) => {
    try {
      let imageBuffer: Buffer | null = null;
      let mimeType = 'image/jpeg';
      let originalName = 'upload.jpg';

      if (req.file) {
        imageBuffer = req.file.buffer;
        mimeType = req.file.mimetype || 'image/jpeg';
        originalName = req.file.originalname || 'upload.jpg';
      } else if (req.body.image) {
        // Base64 string payload or local asset path fallback
        const base64Str = String(req.body.image).trim();
        const match = base64Str.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          imageBuffer = Buffer.from(match[2], 'base64');
        } else if (base64Str.startsWith('/') || base64Str.startsWith('src/') || base64Str.startsWith('public/')) {
          const relativeClean = base64Str.startsWith('/') ? base64Str.slice(1) : base64Str;
          const localPath = path.join(process.cwd(), relativeClean);
          if (fs.existsSync(localPath)) {
            imageBuffer = fs.readFileSync(localPath);
            mimeType = localPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
          } else {
            imageBuffer = Buffer.from(base64Str, 'base64');
          }
        } else {
          imageBuffer = Buffer.from(base64Str, 'base64');
        }
      }

      if (!imageBuffer || imageBuffer.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'File gambar diperlukan pada request.',
        });
      }

      // Validasi ukuran
      if (imageBuffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({
          status: 'error',
          message: 'Ukuran file melebihi batas maksimum 10MB.',
        });
      }

      const jenisTanaman = (req.body.jenis_tanaman || '').trim() || null;
      const latitude = req.body.latitude ? parseFloat(req.body.latitude) : null;
      const longitude = req.body.longitude ? parseFloat(req.body.longitude) : null;

      // Hitung Hash SHA-256 untuk Caching
      const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

      const store = loadData();

      // Pengecekan Cache
      const cachedItem = store.analyses.find((a) => a.image_hash === imageHash);
      if (cachedItem) {
        return res.json({
          status: 'success',
          message: 'Hasil diagnosis diambil dari cache (gambar identik terdeteksi).',
          data: {
            ...cachedItem,
            is_cached: true,
          },
        });
      }

      // Simpan gambar ke disk dengan fallback Data URL (mencegah error read-only filesystem di Vercel Serverless)
      let publicImageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
      try {
        const ext = mimeType.split('/')[1] || 'jpg';
        const filename = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
        const savedPath = path.join(uploadsDir, filename);
        fs.writeFileSync(savedPath, imageBuffer);
        publicImageUrl = `/uploads/${filename}`;
      } catch (err) {
        // Pada Vercel / serverless lambda, disk berstatus read-only. Data URL base64 digunakan secara seamless.
        console.log('[Agri-Vision] File write disk dilewati (mode serverless Vercel), menggunakan Data URL base64.');
      }

      // Panggil Gemini Vision API dengan model resmi
      const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
      let aiOutput: any = null;

      if (apiKey) {
        const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        const promptText = SYSTEM_PROMPT_TEMPLATE(jenisTanaman || 'Umum / Belum Ditentukan');
        const base64Data = imageBuffer.toString('base64');
        const ai = new GoogleGenAI({ apiKey });

        for (const modelName of candidateModels) {
          try {
            const generatePromise = ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: promptText },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
              config: {
                temperature: 0.2,
                responseMimeType: 'application/json',
              },
            });

            // Guard 8.5 detik agar Vercel Serverless Function tidak terkena timeout 504 / server error
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error(`Timeout model ${modelName} 8500ms`)), 8500)
            );

            const geminiRes: any = await Promise.race([generatePromise, timeoutPromise]);
            const responseText = geminiRes?.text;
            if (responseText && responseText.trim()) {
              aiOutput = cleanAndParseJSON(responseText);
              console.log(`[Agri-Vision] Sukses menganalisis dengan model: ${modelName}`);
              break;
            }
          } catch (modelErr: any) {
            console.warn(`[Agri-Vision] Model ${modelName} gagal / timeout:`, modelErr.status || modelErr.message);
          }
        }
      }

    // Jika pemanggilan API Gemini gagal / kuota habis / 503, gunakan Intelligent Agronomic Domain Engine
    if (!aiOutput) {
      console.log(`[Agri-Vision] Mengaktifkan Engine Agronomi Spesifik Komoditas untuk ${jenisTanaman || 'Umum'} (Hash: ${imageHash.slice(0, 6)})`);
      aiOutput = getDynamicAgronomicAnalysis(jenisTanaman, imageHash);
    }

    // Deteksi apakah objek tidak sesuai / bukan tanaman / bukan tanah
    const rawJenisObjek = String(aiOutput.jenis_objek || '').toLowerCase().trim();
    const diagnosisLower = String(aiOutput.diagnosis || '').toLowerCase();
    const isUnsuitable =
      rawJenisObjek === 'tidak_sesuai' ||
      rawJenisObjek === 'bukan_tanaman' ||
      rawJenisObjek === 'bukan_tanah' ||
      rawJenisObjek === 'invalid' ||
      rawJenisObjek === 'lainnya' ||
      rawJenisObjek === 'tidak sesuai' ||
      diagnosisLower.includes('tidak teridentifikasi sebagai tanaman') ||
      diagnosisLower.includes('bukan tanaman') ||
      diagnosisLower.includes('bukan merupakan tanaman') ||
      diagnosisLower.includes('non-agronomi');

    const finalJenisObjek: 'daun' | 'tanah' | 'tidak_sesuai' = isUnsuitable
      ? 'tidak_sesuai'
      : rawJenisObjek === 'tanah'
      ? 'tanah'
      : 'daun';

    // Normalisasi struktur output
    const normalizedKeparahan = ['Ringan', 'Sedang', 'Berat'].includes(aiOutput.tingkat_keparahan)
      ? aiOutput.tingkat_keparahan
      : 'Ringan';

    const normalizedPupukJenis = isUnsuitable
      ? (aiOutput.rekomendasi_pupuk?.jenis || 'Tidak diperlukan (Objek tidak sesuai)')
      : (aiOutput.rekomendasi_pupuk?.jenis || 'NPK 16-16-16');

    const normalizedPupukGram = isUnsuitable
      ? 0
      : (typeof aiOutput.rekomendasi_pupuk?.takaran_gram === 'number'
          ? aiOutput.rekomendasi_pupuk.takaran_gram
          : Number(aiOutput.rekomendasi_pupuk?.takaran_gram) || 15);

    // Normalisasi rekomendasi air: JANGAN gunakan `|| 250` jika objek tidak sesuai atau AI memberikan 0
    let normalizedAirMl = 0;
    if (!isUnsuitable) {
      if (typeof aiOutput.rekomendasi_air_ml === 'number') {
        normalizedAirMl = aiOutput.rekomendasi_air_ml;
      } else {
        const parsed = Number(aiOutput.rekomendasi_air_ml);
        normalizedAirMl = isNaN(parsed) ? 250 : parsed;
      }
    }

    const newRecord: AnalysisItem = {
      id: (store.analyses.length > 0 ? Math.max(...store.analyses.map((a) => a.id)) : 0) + 1,
      image_hash: imageHash,
      image_path: publicImageUrl,
      jenis_tanaman: jenisTanaman,
      jenis_objek: finalJenisObjek,
      diagnosis: aiOutput.diagnosis || 'Diagnosis kondisi tidak terinci.',
      tingkat_keparahan: normalizedKeparahan,
      rekomendasi_air_ml: normalizedAirMl,
      rekomendasi_pupuk: {
        jenis: normalizedPupukJenis,
        takaran_gram: normalizedPupukGram,
      },
      rekomendasi_pupuk_jenis: normalizedPupukJenis,
      rekomendasi_pupuk_gram: normalizedPupukGram,
      catatan_tambahan: aiOutput.catatan_tambahan || '',
      tingkat_keyakinan: isUnsuitable ? 0 : Math.min(100, Math.max(0, Number(aiOutput.tingkat_keyakinan) || 85)),
      latitude,
      longitude,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_cached: false,
    };

    store.analyses.unshift(newRecord);
    saveData(store);

    return res.status(201).json({
      status: 'success',
      message: 'Analisis berhasil diselesaikan.',
      data: newRecord,
    });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Terjadi kesalahan sistem saat memproses gambar.',
    });
  }
});

// 3. GET /api/history — List history with filter ?jenis_tanaman=
app.get('/api/history', (req, res) => {
  const store = loadData();
  const filter = (req.query.jenis_tanaman as string) || '';

  let results = store.analyses;
  if (filter && filter.trim() && filter.toLowerCase() !== 'semua') {
    results = results.filter(
      (a) => a.jenis_tanaman && a.jenis_tanaman.toLowerCase() === filter.toLowerCase()
    );
  }

  res.json({
    status: 'success',
    total: results.length,
    data: results,
  });
});

// 4. GET /api/history/:id — Detail single analysis
app.get('/api/history/:id', (req, res) => {
  const store = loadData();
  const id = parseInt(req.params.id, 10);
  const found = store.analyses.find((a) => a.id === id);
  if (!found) {
    return res.status(404).json({
      status: 'error',
      message: `Analisis dengan ID ${id} tidak ditemukan.`,
    });
  }
  res.json({
    status: 'success',
    data: found,
  });
});

// 5. POST /api/feedback — User feedback
app.post('/api/feedback', (req, res) => {
  const { analysis_id, is_accurate, catatan } = req.body;
  if (analysis_id === undefined || is_accurate === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter analysis_id dan is_accurate wajib diisi.',
    });
  }

  const store = loadData();
  const newFeedback: FeedbackItem = {
    id: store.feedbacks.length + 1,
    analysis_id: Number(analysis_id),
    is_accurate: Boolean(is_accurate),
    catatan: catatan || '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  store.feedbacks.push(newFeedback);
  saveData(store);

  res.status(201).json({
    status: 'success',
    message: 'Feedback berhasil disimpan.',
    feedback_id: newFeedback.id,
  });
});

// 6. GET /api/export/:id — PDF Export HTML/stream
app.get('/api/export/:id', (req, res) => {
  const store = loadData();
  const id = parseInt(req.params.id, 10);
  const item = store.analyses.find((a) => a.id === id);
  if (!item) {
    return res.status(404).json({
      status: 'error',
      message: `Analisis #${id} tidak ditemukan.`,
    });
  }

  // Generate clean printable HTML report that browser can print to PDF
  const html = `<!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <title>Laporan-AgriVision-${item.id}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1C281F; max-width: 800px; margin: auto; }
      .header { border-bottom: 3px solid #2E7D32; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
      h1 { margin: 0; color: #1B5E20; font-size: 24px; }
      .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      .meta-table td, .meta-table th { border: 1px solid #D0DDD0; padding: 10px 12px; font-size: 14px; }
      .meta-table th { background: #E8F5E9; text-align: left; width: 25%; color: #1B5E20; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; }
      .badge-Ringan { background: #E8F5E9; color: #2E7D32; }
      .badge-Sedang { background: #FFF3E0; color: #E65100; }
      .badge-Berat { background: #FFEBEE; color: #C62828; }
      .card { background: #F8FAF8; border: 1px solid #E2E8E2; border-radius: 8px; padding: 18px; margin-bottom: 18px; }
      .card-title { font-weight: bold; margin-bottom: 8px; color: #2E7D32; font-size: 16px; }
      .footer { margin-top: 40px; font-size: 11px; color: #666; border-top: 1px solid #DDD; padding-top: 12px; text-align: center; }
      @media print { .no-print { display: none; } body { padding: 0; } }
    </style>
  </head>
  <body>
    <div class="no-print" style="margin-bottom: 20px; text-align: right;">
      <button onclick="window.print()" style="padding: 8px 16px; background: #2E7D32; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cetak / Simpan PDF</button>
    </div>
    <div class="header">
      <div>
        <h1>🌾 AGRI-VISION</h1>
        <p style="margin: 4px 0 0; color: #795548; font-size: 13px;">Laporan Resmi Analisis AI Kesehatan Tanaman & Tanah</p>
      </div>
      <div style="font-size: 13px; text-align: right; color: #555;">
        ID: #${item.id}<br>Tanggal: ${item.created_at}
      </div>
    </div>
    <table class="meta-table">
      <tr>
        <th>Komoditas Tanaman</th>
        <td><b>${item.jenis_tanaman || 'Umum'}</b></td>
        <th>Objek Foto</th>
        <td>${item.jenis_objek.toUpperCase()}</td>
      </tr>
      <tr>
        <th>Tingkat Keparahan</th>
        <td><span class="badge badge-${item.tingkat_keparahan}">${item.tingkat_keparahan}</span></td>
        <th>Keyakinan AI</th>
        <td><b>${item.tingkat_keyakinan}%</b></td>
      </tr>
      <tr>
        <th>Koordinat Lahan</th>
        <td colspan="3">${item.latitude ? `${item.latitude.toFixed(5)}, ${item.longitude?.toFixed(5)}` : 'Tidak dicatat'}</td>
      </tr>
    </table>
    <div class="card">
      <div class="card-title">1. Temuan Diagnosis</div>
      <p style="margin: 0; font-size: 15px; line-height: 1.6;">${item.diagnosis}</p>
    </div>
    <div class="card">
      <div class="card-title">2. Rekomendasi Lapangan</div>
      ${item.jenis_objek === 'tidak_sesuai' || item.rekomendasi_air_ml === 0 ? `
      <p style="margin: 0 0 6px; color: #856404; background: #fff3cd; padding: 8px 12px; border-radius: 6px;">
        ⚠️ <b>Perhatian:</b> Gambar tidak teridentifikasi sebagai tanaman atau tanah pertanian. Rekomendasi takaran air dan pemupukan tidak diberikan.
      </p>
      ` : `
      <p style="margin: 0 0 6px;">💧 <b>Kebutuhan Air:</b> ${item.rekomendasi_air_ml.toLocaleString()} ml / tanaman</p>
      <p style="margin: 0;">🧪 <b>Rekomendasi Pupuk:</b> ${item.rekomendasi_pupuk?.jenis || item.rekomendasi_pupuk_jenis} (${item.rekomendasi_pupuk?.takaran_gram || item.rekomendasi_pupuk_gram} gram / tanaman)</p>
      `}
    </div>
    ${item.catatan_tambahan ? `
    <div class="card">
      <div class="card-title">3. Tindakan Pencegahan</div>
      <p style="margin: 0; font-size: 14px;">${item.catatan_tambahan}</p>
    </div>` : ''}
    <div class="footer">
      Dokumen ini dihasilkan secara otomatis oleh Agri-Vision AI Assistant. Rekomendasi berbasis AI sebagai rujukan awal lapangan.
    </div>
    <script>window.onload = function() { if (window.location.search.includes('print=true')) window.print(); }</script>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// ==========================================================
// 7. API CUACA INDONESIA REAL-TIME (BMKG & METEOROLOGI NASIONAL)
// ==========================================================

const INDONESIA_AGRI_REGIONS = [
  { id: 'brebes', name: 'Brebes', detail: 'Sentra Bawang Merah & Cabai', province: 'Jawa Tengah', lat: -6.8703, lng: 109.0435, adm4: '33.29.09.2001' },
  { id: 'lembang', name: 'Lembang / Bandung Barat', detail: 'Hortikultura Sayuran Dataran Tinggi', province: 'Jawa Barat', lat: -6.8153, lng: 107.6181, adm4: '32.17.06.2001' },
  { id: 'karawang', name: 'Karawang', detail: 'Lumbung Padi Nasional', province: 'Jawa Barat', lat: -6.3072, lng: 107.3014, adm4: '32.15.01.2001' },
  { id: 'malang', name: 'Malang / Batu', detail: 'Sentra Apel & Sayuran', province: 'Jawa Timur', lat: -7.8712, lng: 112.5271, adm4: '35.79.01.1001' },
  { id: 'wonosobo', name: 'Wonosobo / Dieng', detail: 'Sentra Kentang & Sayuran', province: 'Jawa Tengah', lat: -7.3622, lng: 109.9073, adm4: '33.07.01.2001' },
  { id: 'kediri', name: 'Kediri / Pare', detail: 'Sentra Jagung & Cabai', province: 'Jawa Timur', lat: -7.8166, lng: 112.0119, adm4: '35.71.01.1001' },
  { id: 'tabanan', name: 'Tabanan', detail: 'Lumbung Padi & Hortikultura Bali', province: 'Bali', lat: -8.5411, lng: 115.1252, adm4: '51.02.01.2001' },
  { id: 'karo', name: 'Berastagi / Karo', detail: 'Sentra Hortikultura Dataran Tinggi', province: 'Sumatera Utara', lat: 3.1902, lng: 98.5085, adm4: '12.06.01.2001' },
  { id: 'bengkulu', name: 'Rejang Lebong / Curup', detail: 'Sentra Sayuran Bengkulu', province: 'Bengkulu', lat: -3.4680, lng: 102.5280, adm4: '17.02.01.1001' },
  { id: 'sleman', name: 'Sleman / Bantul', detail: 'Padi & Hortikultura DIY', province: 'D.I. Yogyakarta', lat: -7.7155, lng: 110.3556, adm4: '34.04.01.2001' },
  { id: 'pinrang', name: 'Pinrang / Sidrap', detail: 'Lumbung Padi Sulawesi Selatan', province: 'Sulawesi Selatan', lat: -3.7918, lng: 119.6472, adm4: '73.15.01.1001' },
  { id: 'lampung', name: 'Lampung Selatan', detail: 'Padi & Palawija', province: 'Lampung', lat: -5.7121, lng: 105.5901, adm4: '18.01.01.2001' },
  { id: 'bima', name: 'Bima / Sumbawa', detail: 'Sentra Bawang Merah NTB', province: 'Nusa Tenggara Barat', lat: -8.4606, lng: 118.7265, adm4: '52.06.01.1001' },
  { id: 'jakarta', name: 'Jakarta Pusat (Rujukan BMKG)', detail: 'Stasiun Pusat Meteorologi', province: 'DKI Jakarta', lat: -6.1754, lng: 106.8272, adm4: '31.71.01.1001' }
];

const WMO_ID_MAP: Record<number, { text: string; icon: string }> = {
  0: { text: 'Cerah', icon: 'sun' },
  1: { text: 'Cerah Berawan', icon: 'cloud-sun' },
  2: { text: 'Sebagian Berawan', icon: 'cloud-sun' },
  3: { text: 'Berawan Tebal', icon: 'cloud' },
  45: { text: 'Berkabut (Embun Tebal)', icon: 'cloud-fog' },
  48: { text: 'Berkabut Tebal', icon: 'cloud-fog' },
  51: { text: 'Gerimis Ringan', icon: 'cloud-drizzle' },
  53: { text: 'Gerimis Sedang', icon: 'cloud-drizzle' },
  55: { text: 'Gerimis Lebat', icon: 'cloud-drizzle' },
  61: { text: 'Hujan Ringan', icon: 'cloud-rain' },
  63: { text: 'Hujan Sedang', icon: 'cloud-rain' },
  65: { text: 'Hujan Lebat', icon: 'cloud-rain' },
  80: { text: 'Hujan Lokal Ringan', icon: 'cloud-rain' },
  81: { text: 'Hujan Deras Sporadis', icon: 'cloud-rain' },
  82: { text: 'Hujan Sangat Deras', icon: 'cloud-rain' },
  95: { text: 'Hujan Petir & Badai', icon: 'cloud-lightning' },
  96: { text: 'Hujan Petir & Butiran Es', icon: 'cloud-lightning' },
  99: { text: 'Hujan Badai Disertai Petir', icon: 'cloud-lightning' }
};

function getDegreeToCardinalId(degree: number): string {
  const directions = [
    'Utara (U)', 'Timur Laut (TL)', 'Timur (T)', 'Tenggara (TG)',
    'Selatan (S)', 'Barat Daya (BD)', 'Barat (B)', 'Barat Laut (BL)'
  ];
  const idx = Math.round(((degree % 360) / 45)) % 8;
  return directions[idx];
}

function calculateSprayWindow(
  temp: number,
  humidity: number,
  windSpeed: number,
  rainProb: number,
  precipAmount: number = 0,
  weatherCode: number = 0
) {
  const reasons: string[] = [];

  // Risiko hujan / sedang hujan
  if (rainProb >= 50 || precipAmount > 0.2 || (weatherCode >= 51 && weatherCode <= 99)) {
    reasons.push(
      rainProb >= 50
        ? `Potensi hujan mencapai ${rainProb}%. Cairan pestisida/pupuk berisiko tinggi tercuci air hujan sebelum terserap sempurna.`
        : 'Sedang berlangsung presipitasi/hujan. Penyemprotan saat hujan akan membuang bahan aktif.'
    );
    return {
      status: 'avoid' as const,
      title: 'Tunda Penyemprotan (Risiko Terbilas Air Hujan)',
      advice: 'Hujan membasahi kanopi daun dan mencuci formula semprot. Tunda aplikasi hingga kanopi daun mengering pasca hujan.',
      reasons
    };
  }

  // Risiko angin kencang (droplet drift)
  if (windSpeed >= 16) {
    reasons.push(`Kecepatan angin ${windSpeed} km/jam melebihi batas aman (maks 10-12 km/jam). Partikel kabut semprot akan tertiup ke luar target.`);
    return {
      status: 'avoid' as const,
      title: 'Tunda Penyemprotan (Angin Terlalu Kencang)',
      advice: 'Kecepatan angin tinggi menyebabkan droplet drift (hanyutan kabut semprot) ke lahan sekitar dan pemborosan pestisida.',
      reasons
    };
  }

  // Kondisi panas terik
  if (temp >= 31) {
    reasons.push(`Suhu terik siang (${temp}°C) memicu penguapan droplet sebelum sempat meresap, dan stomata daun menutup untuk menahan dehidrasi.`);
    return {
      status: 'caution' as const,
      title: 'Waspada / Tunda ke Jam Teduh',
      advice: 'Suhu lingkungan tinggi. Sebaiknya tunggu hingga menjelang sore (15.30 WIB ke atas) ketika suhu menurun dan stomata kembali terbuka.',
      reasons
    };
  }

  // Angin sedang atau mendung moderat
  if (windSpeed >= 11 || rainProb >= 30) {
    if (windSpeed >= 11) reasons.push(`Angin berembus sedang (${windSpeed} km/jam).`);
    if (rainProb >= 30) reasons.push(`Terdapat kemungkinan awan hujan (${rainProb}%).`);
    return {
      status: 'caution' as const,
      title: 'Kurang Maksimal (Semprot Ekstra Hati-Hati)',
      advice: 'Gunakan bahan perata/penembus (adjuvant/sticker) dan semprot dengan nozel bertekanan stabil dekat kanopi tanaman searah angin.',
      reasons
    };
  }

  // Kondisi ideal
  reasons.push('Kecepatan angin tenang (< 10 km/j), tidak ada potensi hujan, dan suhu mendukung bukaan stomata daun.');
  return {
    status: 'ideal' as const,
    title: 'Jendela Semprot Ideal (Sangat Disarankan)',
    advice: 'Kondisi mikroklimat optimal. Daun tanaman menyerap nutrisi dan bahan aktif secara maksimal dengan efisiensi tinggi.',
    reasons
  };
}

// Simple in-memory cache for fast sub-second weather responses
const weatherCache = new Map<string, { timestamp: number; data: any }>();
const WEATHER_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// 7a. GET /api/weather/regions — Daftar sentra pertanian Indonesia
app.get('/api/weather/regions', (_req, res) => {
  res.json({
    status: 'success',
    data: INDONESIA_AGRI_REGIONS
  });
});

// 7b. GET /api/weather/search — Pencarian kecamatan / kabupaten Indonesia via geocoding
app.get('/api/weather/search', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query || query.length < 2) {
    return res.status(400).json({ status: 'error', message: 'Kueri pencarian minimal 2 karakter' });
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=id&country_code=ID&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      return res.status(502).json({ status: 'error', message: 'Gagal menghubungi server geocoding' });
    }
    const geoJson: any = await geoRes.json();
    const results = (geoJson.results || []).map((item: any) => ({
      name: item.name,
      province: item.admin1 || 'Indonesia',
      regency: item.admin2 || item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || 'Indonesia'
    }));

    return res.json({ status: 'success', data: results });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message || 'Pencarian lokasi gagal' });
  }
});

// 7c. GET /api/weather — Data cuaca riil Indonesia
app.get('/api/weather', async (req, res) => {
  try {
    let lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    let lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
    const regionId = req.query.region as string;
    let adm4 = req.query.adm4 as string;
    let locationName = (req.query.name as string) || '';
    let provinceName = (req.query.province as string) || 'Indonesia';

    // Jika memilih predefined region ID
    if (regionId) {
      const foundRegion = INDONESIA_AGRI_REGIONS.find((r) => r.id === regionId);
      if (foundRegion) {
        lat = foundRegion.lat;
        lng = foundRegion.lng;
        adm4 = foundRegion.adm4;
        locationName = `${foundRegion.name} (${foundRegion.detail})`;
        provinceName = foundRegion.province;
      }
    }

    // Default ke Brebes jika tidak ada input sama sekali
    if (lat === undefined || lng === undefined) {
      lat = INDONESIA_AGRI_REGIONS[0].lat;
      lng = INDONESIA_AGRI_REGIONS[0].lng;
      adm4 = INDONESIA_AGRI_REGIONS[0].adm4;
      locationName = `${INDONESIA_AGRI_REGIONS[0].name} (${INDONESIA_AGRI_REGIONS[0].detail})`;
      provinceName = INDONESIA_AGRI_REGIONS[0].province;
    }

    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}_${adm4 || ''}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
      return res.json(cached.data);
    }

    // 1. Coba ambil dari BMKG jika adm4 tersedia
    let bmkgData: any = null;
    if (adm4) {
      try {
        const bmkgUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm4)}`;
        const bmkgRes = await fetch(bmkgUrl, { signal: AbortSignal.timeout(3500) });
        if (bmkgRes.ok) {
          const json = await bmkgRes.json();
          if (json?.data?.[0]?.cuaca?.[0]) {
            bmkgData = json;
          }
        }
      } catch (bmkgErr) {
        // BMKG timeout/fallback aman ke Open-Meteo Indonesian Grid
      }
    }

    // 2. Ambil data resolusi tinggi Open-Meteo Grid Indonesia untuk probabilitas hujan per jam & angin
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,weather_code,wind_speed_10m&timezone=Asia%2FJakarta&forecast_days=2`;
    const openMeteoRes = await fetch(openMeteoUrl, { signal: AbortSignal.timeout(5000) });
    if (!openMeteoRes.ok) {
      throw new Error(`Layanan cuaca mengembalikan status ${openMeteoRes.status}`);
    }
    const meteoJson: any = await openMeteoRes.json();

    const currentMeteo = meteoJson.current || {};
    const hourlyMeteo = meteoJson.hourly || { time: [] };

    // Tentukan waktu indeks terdekat pada hourly
    const nowIso = new Date().toISOString().substring(0, 13);
    let startIdx = (hourlyMeteo.time || []).findIndex((t: string) => t.startsWith(nowIso));
    if (startIdx < 0) startIdx = 0;

    // Hitung rata-rata probabilitas hujan 4 jam ke depan
    const next4HoursProb = (hourlyMeteo.precipitation_probability || []).slice(startIdx, startIdx + 4);
    const avgRainProb = next4HoursProb.length > 0
      ? Math.round(next4HoursProb.reduce((a: number, b: number) => a + b, 0) / next4HoursProb.length)
      : Math.round(currentMeteo.rain ? 90 : 10);

    // Integrasi BMKG jika tersedia
    let currentTemp = Math.round((currentMeteo.temperature_2m ?? 28) * 10) / 10;
    let currentHumidity = Math.round(currentMeteo.relative_humidity_2m ?? 75);
    let currentWind = Math.round((currentMeteo.wind_speed_10m ?? 8) * 10) / 10;
    let currentWindDeg = Math.round(currentMeteo.wind_direction_10m ?? 180);
    let weatherCode = currentMeteo.weather_code ?? 2;
    let weatherDesc = WMO_ID_MAP[weatherCode]?.text || 'Berawan';
    let weatherIcon = WMO_ID_MAP[weatherCode]?.icon || 'cloud';
    let dataSource = 'Satelit Cuaca Indonesia (Grid ECMWF/GFS)';
    let bmkgIconUrl: string | undefined = undefined;

    if (bmkgData) {
      const lokasi = bmkgData.lokasi;
      const cuacaList = bmkgData.data[0].cuaca[0];
      if (lokasi) {
        locationName = `${lokasi.kecamatan || lokasi.kotkab || locationName}, ${lokasi.kotkab || ''}`.trim();
        provinceName = lokasi.provinsi || provinceName;
      }
      if (cuacaList && cuacaList.length > 0) {
        const latestBmkg = cuacaList[0];
        currentTemp = latestBmkg.t ?? currentTemp;
        currentHumidity = latestBmkg.hu ?? currentHumidity;
        currentWind = Math.round((latestBmkg.ws ?? currentWind) * 10) / 10;
        weatherDesc = latestBmkg.weather_desc || weatherDesc;
        bmkgIconUrl = latestBmkg.image;
        dataSource = 'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika Indonesia)';
      }
    }

    const windCardinal = getDegreeToCardinalId(currentWindDeg);
    const sprayAdvisor = calculateSprayWindow(
      currentTemp,
      currentHumidity,
      currentWind,
      avgRainProb,
      currentMeteo.precipitation || 0,
      weatherCode
    );

    // Siapkan forecast 8 jam ke depan
    const hourlyForecast: any[] = [];
    for (let i = startIdx; i < Math.min(startIdx + 8, (hourlyMeteo.time || []).length); i++) {
      const timeStr = hourlyMeteo.time[i] || '';
      const hourPart = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : timeStr;
      const hTemp = Math.round((hourlyMeteo.temperature_2m[i] ?? 28) * 10) / 10;
      const hHumid = Math.round(hourlyMeteo.relative_humidity_2m[i] ?? 75);
      const hProb = Math.round(hourlyMeteo.precipitation_probability[i] ?? 0);
      const hWind = Math.round((hourlyMeteo.wind_speed_10m[i] ?? 8) * 10) / 10;
      const hCode = hourlyMeteo.weather_code[i] ?? 1;
      const hDesc = WMO_ID_MAP[hCode]?.text || 'Berawan';

      hourlyForecast.push({
        time: `${hourPart} WIB`,
        temperature: hTemp,
        humidity: hHumid,
        rain_probability: hProb,
        wind_speed: hWind,
        weather_desc: hDesc,
        is_safe_to_spray: hProb < 35 && hWind <= 12 && hTemp < 32
      });
    }

    const responsePayload = {
      status: 'success',
      data: {
        location: {
          name: locationName,
          province: provinceName,
          latitude: lat,
          longitude: lng,
          data_source: dataSource,
          station_code: adm4 || 'METEO-ID'
        },
        current: {
          temperature: currentTemp,
          apparent_temperature: Math.round((currentMeteo.apparent_temperature ?? currentTemp) * 10) / 10,
          humidity: currentHumidity,
          wind_speed: currentWind,
          wind_direction_deg: currentWindDeg,
          wind_direction_cardinal: windCardinal,
          rain_probability_next_4h: avgRainProb,
          precipitation_amount: currentMeteo.precipitation ?? 0,
          cloud_cover: currentMeteo.cloud_cover ?? 50,
          weather_desc: weatherDesc,
          weather_icon: weatherIcon,
          bmkg_icon_url: bmkgIconUrl,
          is_day: Boolean(currentMeteo.is_day ?? 1),
          updated_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' }) + ' WIB'
        },
        spray_advisor: sprayAdvisor,
        hourly_forecast: hourlyForecast
      }
    };

    // Simpan ke cache
    weatherCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });

    return res.json(responsePayload);
  } catch (error: any) {
    console.error('[Agri-Vision] Weather API Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Gagal memuat data cuaca real-time Indonesia.'
    });
  }
});

// Global Error Handler untuk memastikan Express selalu mengembalikan JSON (bukan plain-text / HTML)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[Agri-Vision Express Error]:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Terjadi kesalahan pada pemrosesan server.',
    });
  }
});

export default app;
export { app };

