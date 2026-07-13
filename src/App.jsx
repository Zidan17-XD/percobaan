// App.jsx
// Komponen utama — menyatukan semua komponen
// Menggunakan: useState, Conditional Rendering (tab switching)

import { useState, useEffect } from "react"
import Navbar          from "./components/Navbar"
import HeroBanner      from "./components/HeroBanner"
import FilterBar       from "./components/FilterBar"
import Counter         from "./components/Counter"
import TrendingSection from "./components/TrendingSection"
import DataList        from "./components/DataList"

function App() {
  // useState: query pencarian yang diketik
  const [searchQuery, setSearchQuery]   = useState("")
  // useState: query yang sudah disubmit (aktif difilter)
  const [activeSearch, setActiveSearch] = useState("")
  // useState: genre yang dipilih
  const [selectedGenre, setSelectedGenre] = useState("All")
  // useState: tahun yang dipilih
  const [selectedYear, setSelectedYear]   = useState("All")
  // useState: tab aktif — 'trending' atau 'api'
  const [activeTab, setActiveTab]         = useState("trending")
  // useState: daftar watchlist film yang tersimpan di localStorage
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("movieflix-watchlist")) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("movieflix-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  const handleSearch = (e) => {
    e?.preventDefault()
    setActiveSearch(searchQuery)
  }

  const toggleWatchlist = (film) => {
    const item = {
      id: film.id,
      title: film.title,
      poster_path: film.poster_path || film.image || null,
      release_date: film.release_date || film.year || null,
      vote_average: film.vote_average ?? film.rating ?? null,
    }

    setWatchlist((current) => {
      const exists = current.some((i) => i.id === item.id)
      if (exists) return current.filter((i) => i.id !== item.id)
      return [...current, item]
    })
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* SEMANTIC: header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* SEMANTIC: main */}
      <main>
        <HeroBanner />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onSearch={handleSearch}
        />

        <Counter />

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="flex gap-2 border-b border-gray-800">
            {[
              { id: "trending", label: "🔥 Trending Film" },
              { id: "api",      label: "📡 Data API (Axios)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Rendering: tampilkan konten sesuai tab aktif */}
        {activeTab === "trending" ? (
          <TrendingSection
            searchQuery={activeSearch}
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        ) : (
            <DataList searchQuery={activeSearch} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />
        )}
      </main>

      {/* SEMANTIC: footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8" aria-label="Footer">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-black text-lg mb-1">
            Movie<span className="text-red-500">Flix</span>
          </p>
          <p className="text-gray-600 text-xs">
            © 2026 MovieFlix • React + Tailwind CSS + Axios • UTS Pemrograman Web ST084
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App