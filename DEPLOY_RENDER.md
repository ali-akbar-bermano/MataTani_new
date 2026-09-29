# Panduan Deploy ke Render.com (MataTani Agri-Vision)

Proyek ini telah siap untuk dideploy ke **Render.com** sebagai Web Service Node.js (Fullstack Express + React Vite).

---

## Langkah-Langkah Deploy ke Render.com

### 1. Hubungkan Repository ke Render
1. Buka [dashboard.render.com](https://dashboard.render.com/) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"New +"** di pojok kanan atas, lalu pilih **"Web Service"**.
3. Pilih opsi **"Build and deploy from a Git repository"** lalu klik **Next**.
4. Cari dan pilih repository: **`ali-akbar-bermano/MataTani_new`** (klik **Connect**).

---

### 2. Pengaturan Konfigurasi Service di Render
Render akan menampilkan formulir konfigurasi. Pastikan data berikut terisi:

- **Name**: `matatani-agrivision` (atau nama pilihan Anda)
- **Region**: Singapore (Southeast Asia) atau Oregon (pilih yang terdekat)
- **Branch**: `main` (atau `master`)
- **Root Directory**: *(Biarkan kosong)*
- **Runtime**: **`Node`**
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  npm run start
  ```
- **Instance Type**: **Free**

---

### 3. Konfigurasi Environment Variables (PENTING)
Gulir ke bawah ke bagian **"Environment Variables"**, lalu klik **"Add Environment Variable"**:

| Key | Value | Catatan |
|---|---|---|
| `NODE_ENV` | `production` | Menjalankan server dalam mode produksi |
| `GEMINI_API_KEY` | *(Masukkan API Key Gemini Anda)* | Digunakan untuk analisis diagnosis tanaman |

> *Catatan: Jika API key belum diisi atau kuota habis, aplikasi tetap dapat berjalan normal menggunakan built-in Intelligent Agronomic Engine.*

---

### 4. Deploy!
1. Klik tombol **"Create Web Service"** di bagian bawah.
2. Render akan secara otomatis menjalankan proses cloning, `npm install`, `npm run build`, dan `npm run start`.
3. Setelah status berubah menjadi **"Live"**, aplikasi Anda dapat diakses melalui URL:  
   `https://matatani-agrivision.onrender.com` (atau subdomain yang diberikan Render).
