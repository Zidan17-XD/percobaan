-- schema.sql
-- MovieFlix - UAS Pemrograman Web (ST084)
-- Import file ini lewat phpMyAdmin (tab "Import") atau lewat query console.
-- Pastikan database sudah dibuat dulu, misal: CREATE DATABASE movieflix_db;

-- ================================
-- Tabel: users
-- ================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ================================
-- Tabel: watchlist (FK -> users)
-- Menyimpan film yang disimpan user untuk ditonton nanti
-- ================================
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,               -- id film dari TMDB
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  release_date VARCHAR(20),
  vote_average DECIMAL(3,1),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_watchlist_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_user_movie (user_id, movie_id)  -- cegah duplikat film yang sama per user
) ENGINE=InnoDB;

-- ================================
-- Tabel: history (FK -> users)
-- Menyimpan riwayat film yang pernah dibuka/ditonton user
-- ================================
CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,               -- id film dari TMDB
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
