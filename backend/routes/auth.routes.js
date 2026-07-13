// routes/auth.routes.js
// Endpoint: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("../config/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;

// ================================
// POST /api/auth/register
// ================================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter." });
    }

    // Cek apakah username/email sudah dipakai
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username atau email sudah terdaftar." });
    }

    // Hash password sebelum disimpan (JANGAN simpan plain text)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    const newUser = { id: result.insertId, username, email };

    // Langsung buatkan token juga supaya user tidak perlu login ulang setelah register
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// POST /api/auth/login
// ================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username/email dan password wajib diisi." });
    }

    // Boleh login pakai username ATAU email
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Username/email atau password salah." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Username/email atau password salah." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// ================================
// GET /api/auth/me
// Dipakai frontend untuk cek "masih login gak?" saat pertama kali app dibuka
// ================================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

module.exports = router;
