# 🎬 MovieFlix

Aplikasi katalog film (mirip Netflix) — Tugas UAS Mata Kuliah Pemrograman Web (ST084), Universitas AMIKOM Yogyakarta.

Dikerjakan berkelompok. Data film diambil dari [TMDB API](https://www.themoviedb.org/documentation/api), watchlist & history user disimpan di database sendiri (MySQL) dengan autentikasi JWT.

---

## Daftar Isi

1. [Tech Stack](#1-tech-stack)
2. [Kenapa Express, bukan NestJS?](#2-kenapa-express-bukan-nestjs)
3. [Struktur Folder](#3-struktur-folder)
4. [Cara Menjalankan dari Nol](#4-cara-menjalankan-dari-nol)
5. [Alur Autentikasi & Watchlist](#5-alur-autentikasi--watchlist)
6. [Daftar API Endpoint](#6-daftar-api-endpoint)
7. [Skema Database](#7-skema-database)
8. [Environment Variables](#8-environment-variables)
9. [Troubleshooting](#9-troubleshooting)
10. [Catatan Keamanan](#10-catatan-keamanan)
11. [Tim & Pembagian Tugas](#11-tim--pembagian-tugas)

---

## 1. Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| HTTP Client | Axios (dengan interceptor untuk auto-attach JWT) |
| Backend | Express.js (Node.js) |
| Database | MySQL (lokal, via XAMPP) — akses pakai `mysql2`, **tanpa ORM** |
| Auth | `bcrypt` (hash password) + `jsonwebtoken` (JWT) |
| Data Film | TMDB API (bukan data buatan sendiri) |
| Deployment | **Tidak di-deploy ke cloud** — semua berjalan di `localhost` |

---

## 2. Kenapa Express, bukan NestJS?

Modul praktikum 7–9 di mata kuliah ini mengajarkan **NestJS + TypeORM/Mongoose**. Kelompok kami memutuskan **tetap memakai Express.js**, dengan pertimbangan:

| Aspek | NestJS | Express (dipilih) |
|---|---|---|
| Struktur | Wajib modular (Module/Controller/Service) | Bebas, kami desain sendiri sesuai kebutuhan |
| Kurva belajar | Sedang–tinggi (perlu paham DI, decorator, TypeScript) | Rendah, tim sudah familiar |
| Waktu setup | Lebih lama (generate module/controller/service manual per fitur) | Cepat, langsung fokus ke logic |
| Cocok untuk | Aplikasi besar, tim besar, jangka panjang | Aplikasi skala kecil–menengah, deadline ketat |
| Risiko migrasi mendadak | — | Migrasi ke NestJS di tengah deadline 1 minggu dinilai **terlalu berisiko** |

Dengan deadline UAS sekitar 1 minggu dan aplikasi yang scope-nya tidak terlalu besar (3 tabel, CRUD + auth), Express dinilai lebih sesuai secara waktu dan risiko. Perbandingan ini mengacu ke tabel perbandingan NestJS vs Express di Modul Praktikum 7.

---

## 3. Struktur Folder

```
uts-pemrograman-web/
├── src/                          # FRONTEND (React)
│   ├── App.jsx                   # komponen utama: state watchlist, search, tab switching
│   ├── main.jsx                  # entry point
│   ├── config.js                 # baca VITE_API_URL & VITE_TMDB_API_KEY dari .env
│   ├── api/
│   │   └── axiosInstance.js      # axios instance + interceptor (logging, auto-attach JWT)
│   ├── context/
│   │   └── AuthContext.jsx       # state user, token, login/register/logout
│   └── components/
│       ├── Navbar.jsx
│       ├── HeroBanner.jsx        # data hardcode, slider auto
│       ├── FilterBar.jsx
│       ├── Counter.jsx           # animasi count-up
│       ├── TrendingSection.jsx   # data film hardcode + FilmCard
│       ├── DataList.jsx          # fetch TMDB via axios
│       ├── FilmCard.jsx
│       ├── LoadingIndicator.jsx
│       └── AuthModal.jsx         # form login/register
│
├── backend/                      # BACKEND (Express + MySQL)
│   ├── index.js                  # entry point, CORS, error handler
│   ├── config/
│   │   └── db.js                 # koneksi pool mysql2
│   ├── middleware/
│   │   └── auth.js               # verifikasi JWT
│   ├── routes/
│   │   ├── auth.routes.js        # register, login, me
│   │   ├── watchlist.routes.js   # CRUD watchlist (butuh login)
│   │   └── history.routes.js     # CRUD history (butuh login)
│   └── schema.sql                # definisi 3 tabel: users, watchlist, history
│
├── .env.example                  # template env frontend
└── backend/.env.example          # template env backend
```

---

## 4. Cara Menjalankan dari Nol

### A. Siapkan Database (XAMPP)

1. Buka **XAMPP Control Panel** → klik **Start** pada MySQL.
2. Buka `http://localhost/phpmyadmin`.
3. Buat database baru bernama `movieflix_db`.
4. Klik tab **Import** → pilih file `backend/schema.sql` → klik **Go**.
5. Pastikan 3 tabel (`users`, `watchlist`, `history`) muncul di sidebar kiri.

### B. Jalankan Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`, minimal ganti `JWT_SECRET` dengan string acak (jangan biarkan kosong/default):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=movieflix_db
JWT_SECRET=isi-dengan-string-acak-yang-panjang
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Jalankan:

```bash
npm run dev
```

Kalau berhasil, terminal akan menampilkan:
```
🚀 Server berjalan di http://localhost:5000
✅ Terhubung ke MySQL: movieflix_db
```

### C. Jalankan Frontend

Buka terminal baru (biarkan backend tetap jalan):

```bash
cd uts-pemrograman-web        # root project (bukan folder backend)
npm install
cp .env.example .env
```

Edit `.env` di root, isi token TMDB kamu sendiri:

```env
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=isi-dengan-tmdb-read-access-token-kamu
```

> ⚠️ Ambil token dari [themoviedb.org](https://www.themoviedb.org) → Settings → API. **Jangan pernah** commit token ini ke Git — selalu lewat `.env`.

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### D. Cek Semua Sudah Nyambung

- Buka DevTools (F12) → tab Network → pastikan request ke `localhost:5000/api/...` sukses (status 200), bukan error CORS merah.
- Coba register user baru lewat `AuthModal` → cek tabel `users` di phpMyAdmin, harus muncul baris baru dengan `password_hash` (bukan password asli).

---

## 5. Alur Autentikasi & Watchlist

**Guest (belum login):**
- Watchlist disimpan di `localStorage` browser (key: `movieflix-watchlist`).
- Data hilang kalau ganti browser/device, tapi tidak butuh koneksi backend.

**Sudah login:**
- Setelah `login`/`register` sukses, backend mengembalikan `token` (JWT) yang disimpan di `AuthContext` (dan biasanya juga di `localStorage` agar tidak logout saat refresh).
- `axiosInstance.js` otomatis menempelkan header `Authorization: Bearer <token>` di setiap request lewat request interceptor.
- Watchlist & history disinkronkan penuh ke MySQL lewat endpoint `/api/watchlist` dan `/api/history`.

**Pola refetch (bukan optimistic update):**
Setiap kali user melakukan `POST` (tambah) atau `DELETE` (hapus) watchlist, frontend **tidak langsung mengubah state di layar**. Sebaliknya, setelah request berhasil, frontend memanggil ulang `GET /api/watchlist` untuk mengambil data terbaru dari server. Pola ini mengikuti Modul Praktikum 11 dan dipilih karena lebih sederhana untuk diimplementasikan dan lebih menjamin data di layar selalu sinkron dengan database — trade-off-nya adalah sedikit lebih lambat dibanding optimistic update.

---

## 6. Daftar API Endpoint

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Body / Keterangan |
|---|---|---|---|
| GET | `/` | ❌ | Cek server hidup |
| POST | `/api/auth/register` | ❌ | `{ username, email, password }` |
| POST | `/api/auth/login` | ❌ | `{ username, password }` (username boleh diisi email) |
| GET | `/api/auth/me` | ✅ | Ambil data user dari token (cek sesi masih valid) |
| GET | `/api/watchlist` | ✅ | Ambil semua watchlist milik user login |
| POST | `/api/watchlist` | ✅ | `{ movie_id, title, poster_path, release_date, vote_average }` |
| DELETE | `/api/watchlist/:movieId` | ✅ | Hapus 1 film dari watchlist (by TMDB `movie_id`) |
| GET | `/api/history` | ✅ | Ambil riwayat film yang dibuka (maks 50 terbaru) |
| POST | `/api/history` | ✅ | `{ movie_id, title, poster_path }` |
| DELETE | `/api/history/:id` | ✅ | Hapus 1 entri riwayat (by `id` baris, bukan `movie_id`) |

Endpoint bertanda ✅ wajib menyertakan header:
```
Authorization: Bearer <token>
```

---

## 7. Skema Database

```
users                    watchlist                 history
─────────────            ─────────────             ─────────────
id (PK)                  id (PK)                    id (PK)
username (unique)        user_id (FK → users.id)    user_id (FK → users.id)
email (unique)           movie_id                   movie_id
password_hash            title                      title
created_at               poster_path                poster_path
                          release_date               watched_at
                          vote_average
                          added_at
```

- `watchlist.user_id` dan `history.user_id` adalah **foreign key** ke `users.id` dengan `ON DELETE CASCADE` (kalau user dihapus, watchlist & history-nya ikut terhapus).
- `watchlist` punya `UNIQUE KEY (user_id, movie_id)` untuk mencegah film yang sama masuk watchlist dua kali.

Screenshot relasi tabel (untuk laporan Soal 2) diambil dari **phpMyAdmin → pilih database → tab Designer**.

---

## 8. Environment Variables

### Frontend (`.env` di root)
| Variable | Contoh | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | Base URL backend |
| `VITE_TMDB_API_KEY` | `eyJhbGc...` | TMDB Read Access Token (v4 auth) |

### Backend (`backend/.env`)
| Variable | Contoh | Keterangan |
|---|---|---|
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_PORT` | `3306` | Port MySQL default XAMPP |
| `DB_USER` | `root` | User MySQL default XAMPP |
| `DB_PASSWORD` | *(kosong)* | Password default XAMPP |
| `DB_NAME` | `movieflix_db` | Nama database |
| `JWT_SECRET` | *(string acak)* | Kunci rahasia untuk sign/verify JWT |
| `PORT` | `5000` | Port backend |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin frontend yang diizinkan |

> File `.env` **tidak boleh** di-commit ke Git (sudah masuk `.gitignore`). Yang di-commit adalah `.env.example`.

---

## 9. Troubleshooting

| Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|
| `Access to XMLHttpRequest ... blocked by CORS policy` | Backend belum jalan, atau `CORS_ORIGIN` di `backend/.env` tidak sama dengan URL frontend | Pastikan backend jalan di port 5000, cek `CORS_ORIGIN=http://localhost:5173` |
| `❌ Gagal konek ke MySQL: connect ECONNREFUSED` | XAMPP MySQL belum di-Start | Buka XAMPP Control Panel, klik Start pada MySQL |
| `401 Unauthorized` di endpoint watchlist/history | Header `Authorization` tidak dikirim, atau token sudah expired (7 hari) | Login ulang, pastikan axios interceptor menempel token |
| Data TMDB tidak muncul / error 401 dari TMDB | `.env` belum dibuat, atau lupa restart `npm run dev` setelah bikin `.env` | Cek `VITE_TMDB_API_KEY` terisi, restart dev server |
| `ER_DUP_ENTRY` saat tambah watchlist | Film yang sama sudah ada di watchlist user tsb | Ini behavior yang disengaja (dicegah via `UNIQUE KEY`) |
| Backend jalan tapi tabel belum ada | `schema.sql` belum di-import | Import ulang lewat phpMyAdmin tab Import |

---

## 10. Catatan Keamanan

- Password **tidak pernah** disimpan dalam bentuk plain text — selalu di-hash dengan `bcrypt` (10 salt rounds) sebelum masuk database.
- Token TMDB sempat ter-hardcode di source code yang sudah publik di GitHub pada commit awal. Token tersebut sudah **di-rotate** dan dipindahkan ke environment variable (`VITE_TMDB_API_KEY`). Token lama dianggap tidak valid lagi.
- JWT disimpan di client (bukan di cookie httpOnly) untuk kesederhanaan implementasi dalam scope tugas kuliah — trade-off ini disadari dan bukan untuk penggunaan production sesungguhnya.

---

## 11. Tim & Pembagian Tugas

| Nama | NIM | Bagian yang Dikerjakan |
|---|---|---|
| *(isi)* | *(isi)* | *(isi, contoh: Navbar, HeroBanner, FilterBar)* |
| *(isi)* | *(isi)* | *(isi, contoh: DataList, integrasi TMDB)* |
| *(isi)* | *(isi)* | *(isi, contoh: Backend — auth, watchlist, history)* |
| *(isi)* | *(isi)* | *(isi, contoh: AuthContext, axiosInstance, AuthModal)* |

---

**UAS Pemrograman Web (ST084) — Universitas AMIKOM Yogyakarta**
