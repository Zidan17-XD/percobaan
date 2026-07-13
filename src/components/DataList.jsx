// DataList.jsx
// Komponen: Mengambil dan menampilkan data film dari TMDB API menggunakan Axios
// Menggunakan: useState, useEffect, Axios, LoadingIndicator, Conditional Rendering

import { useState, useEffect } from "react"
import axios from "axios"
import LoadingIndicator from "./LoadingIndicator"
import { TMDB_API_KEY } from "../config"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342"

function DataList({ searchQuery, watchlist = [], onToggleWatchlist = () => {} }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  // Reset halaman saat query pencarian berubah
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // useEffect: fetch data setiap kali nilai `page` atau `searchQuery` berubah
  useEffect(() => {
    setLoading(true)
    setError(null)

    const endpoint = searchQuery
      ? `${TMDB_BASE_URL}/search/movie?language=id-ID&page=${page}&include_adult=false&query=${encodeURIComponent(searchQuery)}`
      : `${TMDB_BASE_URL}/movie/popular?language=id-ID&page=${page}`

    axios
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      })
      .then((res) => {
        setMovies(res.data.results ?? [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Gagal memuat data TMDB. Periksa koneksi atau token/API key.")
        setLoading(false)
      })
  }, [page, searchQuery])

  return (
    <section
      aria-labelledby="api-heading"
      className="max-w-7xl mx-auto px-4 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 id="api-heading" className="text-white text-xl font-black">
            📡 Data dari API TMDB
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery
              ? `Hasil pencarian untuk "${searchQuery}"`
              : "Menampilkan film populer dari TMDB"}
          </p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
          via Axios • Halaman {page}
        </span>
      </div>

      {loading && <LoadingIndicator message="Memuat data dari TMDB..." />}

      {/* Conditional Rendering: tampilkan error */}
      {!loading && error && (
        <div role="alert" className="bg-red-950 border border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-400 font-semibold">⚠️ {error}</p>
          <button
            onClick={() => setPage(page)}
            className="mt-3 text-sm text-red-300 underline hover:text-white"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Conditional Rendering: tampilkan data jika berhasil */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-semibold">Tidak ada hasil untuk "{searchQuery}"</p>
          <p className="text-sm mt-1">Coba kata kunci lain atau hapus pencarian</p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="bg-gray-900 border border-gray-800 hover:border-red-500/50 rounded-3xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-red-900/10"
                aria-label={`Film: ${movie.title}`}
              >
                <div className="relative">
                  {movie.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-64 bg-gray-800 flex items-center justify-center text-4xl text-gray-600">
                      🎬
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <p className="text-xs uppercase text-gray-400 tracking-wider">
                      {movie.release_date ? movie.release_date.slice(0, 4) : "TBA"}
                    </p>
                    <h3 className="text-white font-bold text-lg leading-snug mt-1">
                      {movie.title}
                    </h3>
                  </div>
                </div>
                  <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
                    <span className="bg-gray-800 rounded-full px-2 py-1">★ {movie.vote_average?.toFixed(1) ?? "-"}</span>
                    <span>{movie.genre_ids?.length ? `Genre ID ${movie.genre_ids[0]}` : "Genre: N/A"}</span>
                    <div className="ml-auto">
                      {(() => {
                        const isWatchlisted = watchlist.some((i) => i.id === movie.id)
                        return (
                          <button
                            onClick={() => onToggleWatchlist({
                              id: movie.id,
                              title: movie.title,
                              poster_path: movie.poster_path,
                              release_date: movie.release_date,
                              vote_average: movie.vote_average,
                            })}
                            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${isWatchlisted ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                          >
                            {isWatchlisted ? "❤️ Watchlist" : "+ Watchlist"}
                          </button>
                        )
                      })()}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {movie.overview || "Tidak ada deskripsi tersedia."}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-700"
            >
              ← Sebelumnya
            </button>
            <span className="px-4 py-2 text-sm text-gray-400">{page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white transition-all border border-gray-700"
            >
              Berikutnya →
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default DataList