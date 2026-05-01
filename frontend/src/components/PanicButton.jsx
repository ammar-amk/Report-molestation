import { useEffect } from 'react'

export default function PanicButton() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        window.location.href = 'https://www.google.com'
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[9999] group">
      <button
        onClick={() => { window.location.href = 'https://www.google.com' }}
        className="w-14 h-14 bg-portal-red text-white rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center justify-center text-xl font-bold focus:outline-none"
        aria-label="Quick hide"
      >
        ✕
      </button>
      <span className="absolute bottom-16 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Quick Hide (Esc)
      </span>
    </div>
  )
}
