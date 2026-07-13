// TrendingSection.jsx
// Komponen: Menampilkan daftar film trending dengan filter
// Menggunakan: Conditional Rendering (jika tidak ada hasil)

import FilmCard from "./FilmCard"

const TRENDING_FILMS = [
  { id: 1, title: "The WONDERfools", year: 2026, rating: 6.8, comments: 42, badge: "S1", genre: "Comedy", image: "/assets/movie1.jpeg" },
  { id: 2, title: "Rick and Morty", year: 2026, rating: 7.8, comments: 34, badge: "S9", genre: "Comedy", image: "/assets/movie2.jpg" },
  { id: 3, title: "Perfect Crown", year: 2026, rating: 8.6, comments: 239, badge: "S1", genre: "Drama", image: "/assets/movie3.jpg" },
  { id: 4, title: "The Boys", year: 2019, rating: 8.4, comments: 200, badge: "S5", genre: "Action", image: "/assets/movie4.jpg" },
  { id: 5, title: "Mortal Kombat II", year: 2026, rating: 6.9, comments: 1, badge: "TS", genre: "Action", image: "/assets/movie5.jpg" },
  { id: 6, title: "Kitchen Soldier", year: 2026, rating: 7.7, comments: 28, badge: "S1", genre: "Drama", image: "/assets/movie6.jpeg" },
  { id: 7, title: "The Mummy", year: 2024, rating: 7.7, comments: 48, badge: "WEB-DL", genre: "Horror", image: "/assets/movie7.jpg" },
  { id: 8, title: "Sold Out", year: 2026, rating: 9.0, comments: 12, badge: "S1", genre: "Thriller", image: "/assets/movie8.jpg" },
]

function TrendingSection({ searchQuery, selectedGenre, selectedYear, watchlist, onToggleWatchlist }) {
  const filtered = TRENDING_FILMS.filter((f) => {
    const matchSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchGenre = selectedGenre === "All" || f.genre === selectedGenre
    const matchYear = selectedYear === "All" || String(f.year) === selectedYear
    return matchSearch && matchGenre && matchYear
  })

  return (
    <section aria-labelledby="trending-heading" className="max-w-7xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 id="trending-heading" className="text-white text-xl font-black">
          🔥 Trending Sekarang
        </h2>
        <div className="flex gap-2">
          {["Semua", "Film", "Serial"].map((t) => (
            <button key={t} className="text-xs px-3 py-1.5 rounded-full bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-all duration-200 border border-gray-700 hover:border-red-500">
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Rendering: tidak ada hasil */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🎭</p>
          <p className="text-lg font-semibold">Film tidak ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((film, i) => (
            <FilmCard
              key={film.id}
              film={film}
              index={i}
              isWatchlisted={watchlist.some((item) => item.id === film.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TrendingSection