# Panduan Publish ke Vercel (MataTani Agri-Vision)

Proyek ini telah dikonfigurasi secara lengkap untuk Vercel Serverless Architecture tanpa merusak fitur utama apa pun:
1. **Diagnosis AI (Gemini Vision)** tetap berjalan via Vercel Serverless Function (`api/index.ts`).
2. **Scan Kamera & Upload Gambar** otomatis menggunakan fallback base64 Data URL sehingga aman dari limitasi *read-only filesystem* di cloud Vercel.
3. **Prakiraan Cuaca BMKG & Open-Meteo** tetap dapat diakses di `/api/weather`.
4. **Ensiklopedia Hama, Kalkulator Pupuk & Riwayat** berjalan mulus.
5. **Animasi Splash Pembuka** langsung muncul saat pertama kali dibuka.

---

## Langkah-langkah Publish ke Vercel:

### 1. Push Code ke GitHub / GitLab / Bitbucket
Pastikan semua file terbaru (termasuk `vercel.json` dan folder `api/`) telah di-commit ke repositori Git Anda.

### 2. Import Project di Vercel Dashboard
1. Buka [https://vercel.com](https://vercel.com) dan login ke akun Vercel Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository Git Anda dan klik **"Import"**.

### 3. Konfigurasi Project Settings di Vercel
Vercel akan mendeteksi framework otomatis:
- **Framework Preset**: `Vite` (atau `Other`)
- **Root Directory**: `./` (default)
- **Build Command**: `vite build` (sudah otomatis diset di `vercel.json`)
- **Output Directory**: `dist` (sudah otomatis diset di `vercel.json`)

### 4. Menambahkan Environment Variable (PENTING untuk AI)
Sebelum klik Deploy, buka bagian **"Environment Variables"** pada form import Vercel:
- **Key**: `GEMINI_API_KEY`
- **Value**: Masukkan API Key Google Gemini Anda (dari Google AI Studio)
- Klik **Add**.

*(Catatan: Jika API Key belum diisi atau kuota habis, aplikasi memiliki **Intelligent Agronomic Domain Engine** cadangan otomatis sehingga proses diagnosis tetap tidak akan error atau crash).*

### 5. Klik Deploy
Klik tombol **"Deploy"**. Tunggu proses build selesai (~1-2 menit).
Aplikasi Anda akan aktif di domain: `https://nama-project-anda.vercel.app`.
