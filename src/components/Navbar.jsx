// Navbar.jsx
// Komponen: Navigasi utama website
// Menggunakan: useState (menuOpen), Semantic HTML (header, nav, ul, li)

import { useState } from "react"

function Navbar({ searchQuery, setSearchQuery, onSearch }) {
  // useState: mengontrol buka/tutup menu mobile
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 shadow-lg">
      <nav
        className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16"
        aria-label="Navigasi Utama"
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" aria-label="MovieFlix Home">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg group-hover:bg-red-500 transition">
            M
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Movie<span className="text-red-500">Flix</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          {["Home", "Movies", "TV Series", "Genres", "Top Rated"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-red-400 transition-colors duration-200">
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Search Form */}
        <div className="hidden md:flex items-center gap-3">
          <form
            onSubmit={onSearch}
            role="search"
            className="flex items-center bg-gray-800 rounded-lg px-3 py-2 gap-2 border border-gray-700 focus-within:border-red-500 transition"
          >
            <label htmlFor="search-input" className="sr-only">Cari Film</label>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari film..."
              className="bg-transparent text-white text-sm outline-none w-44 placeholder-gray-500"
            />
          </form>
          <a href="#" className="text-gray-300 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-800 transition">
            Masuk
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Conditional Rendering: Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4">
          <form onSubmit={onSearch} role="search" className="flex items-center bg-gray-800 rounded-lg px-3 py-2 gap-2 mb-4 border border-gray-700">
            <label htmlFor="search-mobile" className="sr-only">Cari Film</label>
            <input
              id="search-mobile"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari film..."
              className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-500"
            />
          </form>
          <ul className="space-y-2">
            {["Home", "Movies", "TV Series", "Genres", "Top Rated"].map((item) => (
              <li key={item}>
                <a href="#" className="block text-gray-300 hover:text-white py-2 text-sm">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar