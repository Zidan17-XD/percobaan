// middleware/auth.js
// Middleware untuk memverifikasi JWT yang dikirim frontend lewat header:
// Authorization: Bearer <token>
// (token ini otomatis ditempel oleh axiosInstance interceptor di frontend)

const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan. Silakan login." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded berisi payload yang dulu kita masukkan saat sign (id, username)
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Sesi login sudah habis, silakan login lagi." });
    }
    return res.status(401).json({ message: "Token tidak valid." });
  }
}

module.exports = verifyToken;
