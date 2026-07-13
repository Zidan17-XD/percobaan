// LoadingIndicator.jsx
// Komponen: Loading spinner saat data sedang diambil dari API
// Menggunakan: Conditional Rendering (ditampilkan hanya saat loading=true)

function LoadingIndicator({ message = "Memuat data..." }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div className="w-12 h-12 border-4 border-gray-700 border-t-red-500 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}

export default LoadingIndicator