// routes/history.routes.js
// Menyimpan & menampilkan riwayat film yang dibuka/ditonton user.
// Semua endpoint butuh login.

const express = require("express");
const pool = require("../config/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// ================================
// GET /api/history - riwayat film milik user yang login (terbaru dulu)
// ================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM history WHERE user_id = ? ORDER BY watched_at DESC LIMIT 50",
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Get history error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// POST /api/history - catat film yang baru dibuka/diklik
// Body: { movie_id, title, poster_path }
// ================================
router.post("/", async (req, res) => {
  try {
    const { movie_id, title, poster_path } = req.body;

    if (!movie_id || !title) {
      return res.status(400).json({ message: "movie_id dan title wajib diisi." });
    }

    await pool.query(
      "INSERT INTO history (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)",
      [req.user.id, movie_id, title, poster_path || null]
    );

    return res.status(201).json({ message: "Riwayat tersimpan." });
  } catch (err) {
    console.error("Add history error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// DELETE /api/history/:id - hapus 1 entri riwayat (by id row, bukan movie_id)
// ================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM history WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Riwayat tidak ditemukan." });
    }

    return res.json({ message: "Riwayat dihapus." });
  } catch (err) {
    console.error("Delete history error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

module.exports = router;
