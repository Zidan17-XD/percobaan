// FilterBar.jsx
// Komponen: Form filter pencarian film
// Menggunakan: Semantic HTML (form, fieldset, label, select, input)

const GENRES = ["All", "Action", "Drama", "Comedy", "Romance", "Horror", "Thriller", "Sci-Fi"]
const YEARS  = ["All", "2026", "2025", "2024", "2023", "2022"]

function FilterBar({ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre, selectedYear, setSelectedYear, onSearch }) {
  return (
    <section aria-label="Filter Film" className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <form
          onSubmit={onSearch}
          className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
        >
          {/* Input pencarian */}
          <fieldset className="flex-1">
            <legend className="sr-only">Pencarian Film</legend>
            <label htmlFor="filter-search" className="sr-only">Cari film berdasarkan judul</label>
            <input
              id="filter-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Cari judul film..."
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-red-500 placeholder-gray-500 transition"
            />
          </fieldset>

          {/* Select genre */}
          <fieldset>
            <legend className="sr-only">Filter Genre</legend>
            <label htmlFor="filter-genre" className="sr-only">Pilih Genre</label>
            <select
              id="filter-genre"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-red-500 transition cursor-pointer"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>{g === "All" ? "Semua Genre" : g}</option>
              ))}
            </select>
          </fieldset>

          {/* Select tahun */}
          <fieldset>
            <legend className="sr-only">Filter Tahun</legend>
            <label htmlFor="filter-year" className="sr-only">Pilih Tahun</label>
            <select
              id="filter-year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-red-500 transition cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y === "All" ? "Semua Tahun" : y}</option>
              ))}
            </select>
          </fieldset>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow hover:shadow-red-700/40 transition-all duration-200 hover:scale-105"
          >
            Cari
          </button>
        </form>
      </div>
    </section>
  )
}

export default FilterBar