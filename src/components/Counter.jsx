// Counter.jsx
// Komponen: Menampilkan statistik jumlah film, rating rata-rata, dan jumlah komentar
// Menggunakan: useState, useEffect, Conditional Rendering

import { useState, useEffect } from "react"

const STATS = [
  { label: "Total Film", icon: "🎬", target: 128 },
  { label: "Rating Rata-rata", icon: "⭐", target: 8.2, decimal: true },
  { label: "Total Komentar", icon: "💬", target: 4820 },
  { label: "Genre Tersedia", icon: "🎭", target: 12 },
]

function Counter() {
  // useState: menyimpan nilai counter yang sedang berjalan
  const [counts, setCounts] = useState(STATS.map(() => 0))
  // useState: mengontrol apakah animasi sudah selesai
  const [done, setDone] = useState(false)

  // useEffect: menjalankan animasi count-up saat komponen pertama kali dimuat
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounts(
        STATS.map((s) =>
          s.decimal
            ? parseFloat((s.target * progress).toFixed(1))
            : Math.floor(s.target * progress)
        )
      )
      if (step >= steps) {
        clearInterval(timer)
        // Conditional Rendering: set done=true agar tampilan berubah
        setDone(true)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section
      aria-labelledby="stats-heading"
      className="max-w-7xl mx-auto px-4 py-6"
    >
      <h2
        id="stats-heading"
        className="text-white text-xl font-black mb-4"
      >
        📊 Statistik MovieFlix
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 hover:border-red-500 rounded-xl p-5 text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
          >
            <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
            <p className="text-2xl font-black text-white mt-2">
              {/* Conditional Rendering: tampilkan nilai final atau animasi */}
              {done
                ? stat.decimal
                  ? stat.target.toFixed(1)
                  : stat.target.toLocaleString()
                : stat.decimal
                ? counts[i].toFixed(1)
                : counts[i].toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Counter