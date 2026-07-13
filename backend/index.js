// index.js
// Entry point backend MovieFlix (Express + MySQL, tanpa ORM)

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const historyRoutes = require("./routes/history.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// Middleware global
// ================================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Logger sederhana, biar kelihatan di terminal tiap ada request masuk (untuk screenshot laporan)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ================================
// Routes
// ================================
app.get("/", (req, res) => {
  res.json({ message: "MovieFlix API is running 🎬" });
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/history", historyRoutes);

// ================================
// 404 handler (route tidak ditemukan)
// ================================
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

// ================================
// Global error handler (jaga-jaga kalau ada error yang lolos dari try/catch)
// ================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Terjadi kesalahan tak terduga di server." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
