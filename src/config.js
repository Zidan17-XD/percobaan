// config.js
// Menyimpan konfigurasi environment agar tidak ada credential yang hardcode di source code.
// Semua nilai diambil dari environment variable Vite (prefix wajib VITE_).

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!TMDB_API_KEY) {
  // Peringatan di console saat development kalau .env belum diisi / lupa restart dev server
  console.warn(
    "[config.js] VITE_TMDB_API_KEY belum diset. Buat file .env di root project dan restart `npm run dev`."
  )
}
