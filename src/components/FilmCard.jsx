// FilmCard.jsx
// Komponen: Kartu tampilan satu film
// Menggunakan: Semantic HTML (article), Tailwind hover effects

const COLORS = [
  "from-red-900","from-blue-900","from-purple-900","from-yellow-900",
  "from-green-900","from-pink-900","from-orange-900","from-teal-900",
]

const badgeColor = (badge) => {
  if (badge === "TS") return "bg-orange-500"
  if (badge === "WEB-DL") return "bg-green-600"
  return "bg-blue-600"
}

function FilmCard({ film, index, isWatchlisted, onToggleWatchlist }) {
  return (
    <article
      className="relative group rounded-xl overflow-hidden border border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/30 bg-gray-900"
      aria-label={`Film: ${film.title} (${film.year})`}
    >
      {/* Poster */}
      <div className={`relative h-56 bg-gradient-to-br ${COLORS[index % COLORS.length]} to-gray-900 flex items-center justify-center overflow-hidden`}>
        {film.image ? (
          <>
            <img
              src={film.image}
              alt={`${film.title} poster`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </>
        ) : (
          <span className="text-gray-600 text-6xl select-none" aria-hidden="true">🎬</span>
        )}

        <span className="absolute top-2 left-2 bg-gray-950/80 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border border-gray-700">
          {index + 1}
        </span>

        <span className={`absolute top-2 right-2 ${badgeColor(film.badge)} text-white text-xs font-bold px-2 py-0.5 rounded`}>
          {film.badge}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            ▶ Tonton
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate mb-1">{film.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="text-yellow-400">★ {film.rating}</span>
          <span>💬 {film.comments}</span>
          <span>{film.year}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-block text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
            {film.genre}
          </span>
          <button
            onClick={() => onToggleWatchlist(film)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${isWatchlisted ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            {isWatchlisted ? "❤️ Watchlist" : "+ Watchlist"}
          </button>
        </div>
      </div>
    </article>
  )
}

export default FilmCard