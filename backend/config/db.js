// config/db.js
// Koneksi ke MySQL (XAMPP, localhost) menggunakan mysql2 (tanpa ORM).
// Pakai connection pool supaya tidak buka/tutup koneksi tiap query.

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "movieflix_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Cek koneksi sekali saat server start, biar error kelihatan dari awal
// (bukan baru muncul pas ada request pertama).
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Terhubung ke MySQL:", process.env.DB_NAME || "movieflix_db");
    conn.release();
  } catch (err) {
    console.error("❌ Gagal konek ke MySQL:", err.message);
    console.error(
      "   Cek: XAMPP MySQL sudah Start? .env sudah benar? Database sudah dibuat?"
    );
  }
})();

module.exports = pool;
