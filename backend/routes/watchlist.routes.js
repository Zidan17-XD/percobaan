// routes/watchlist.routes.js
// Semua endpoint di sini butuh login (verifyToken), karena watchlist backend
// hanya dipakai untuk user yang sudah login (guest mode tetap pakai localStorage di frontend).
//
// Pola: frontend pakai REFETCH PATTERN (sesuai Modul Praktikum 11) -> setelah
// POST/DELETE berhasil, frontend akan panggil ulang GET /api/watchlist untuk
// menyegarkan data, bukan optimistic update.

const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken); // semua route di bawah ini wajib login

// ================================
// GET /api/watchlist - ambil semua watchlist milik user yang login
// ================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC",
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Get watchlist error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// POST /api/watchlist - tambah film ke watchlist
// Body: { movie_id, title, poster_path, release_date, vote_average }
// ================================
router.post("/", async (req, res) => {
  try {
    const { movie_id, title, poster_path, release_date, vote_average } = req.body;

    if (!movie_id || !title) {
      return res.status(400).json({ message: "movie_id dan title wajib diisi." });
    }

    // Cek duplikat dulu supaya bisa kasih pesan yang jelas
    // (tabel juga sudah punya UNIQUE KEY sebagai pengaman di level DB)
    const [existing] = await pool.query(
      "SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?",
      [req.user.id, movie_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Film sudah ada di watchlist." });
    }

    await pool.query(
      `INSERT INTO watchlist (user_id, movie_id, title, poster_path, release_date, vote_average)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, movie_id, title, poster_path || null, release_date || null, vote_average || null]
    );

    return res.status(201).json({ message: "Berhasil ditambahkan ke watchlist." });
  } catch (err) {
    console.error("Add watchlist error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// DELETE /api/watchlist/:movieId - hapus film dari watchlist (by TMDB movie_id)
// ================================
router.delete("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?",
      [req.user.id, movieId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Film tidak ditemukan di watchlist." });
    }

    return res.json({ message: "Berhasil dihapus dari watchlist." });
  } catch (err) {
    console.error("Delete watchlist error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

module.exports = router;
