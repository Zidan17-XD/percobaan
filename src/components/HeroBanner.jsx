// HeroBanner.jsx
// Komponen: Slider banner hero otomatis
// Menggunakan: useState (current slide), useEffect (auto-slide timer)

import { useState, useEffect } from "react"

const SLIDES = [
  { title: "The Boys Season 5", desc: "Superhero satiris yang mengguncang dunia kembali hadir lebih gelap.", color: "from-yellow-900", image: "/assets/cover1.webp" },
  { title: "Perfect Crown", desc: "Drama kerajaan yang memukau dengan twist tak terduga di setiap episode.", color: "from-purple-900", image: "/assets/cover2.webp" },
  { title: "Mortal Kombat II", desc: "Pertarungan epik yang menentukan nasib dunia manusia dan Outworld.", color: "from-red-900", image: "/assets/cover3.jpg" },
]

function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const s = SLIDES[current]

  return (
    <section
      aria-label="Banner Utama"
      className="relative mt-16 h-72 md:h-96 flex items-end overflow-hidden transition-all duration-700"
      style={{
        backgroundImage: `url(${s.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient agar teks terbaca */}
      <div className={`absolute inset-0 bg-gradient-to-r ${s.color} to-transparent opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-10 w-full">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
          {s.title}
        </h1>
        <p className="text-gray-300 text-sm md:text-base max-w-lg mb-4">{s.desc}</p>
        <div className="flex gap-3">
          <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-red-700/40 transition-all duration-200 hover:scale-105">
            ▶ Tonton Sekarang
          </button>
          <button className="bg-gray-800/80 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold text-sm border border-gray-700 transition-all duration-200">
            + Tambah Watchlist
          </button>
        </div>
      </div>

      {/* Dot indicator */}
      <div className="absolute bottom-4 right-6 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "bg-red-500 w-6" : "bg-gray-600 w-2"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroBanner