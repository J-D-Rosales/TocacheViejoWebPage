import { useCallback, useEffect, useState } from 'react'
import type { GalleryItem, GalleryMediaItem } from '../../types'

interface LightboxModalProps {
  /** Metadatos del evento (título, año, descripción...) */
  galleryItem: GalleryItem
  /** Lista de medios navegables del evento */
  media: GalleryMediaItem[]
  onClose: () => void
}

export function LightboxModal({ galleryItem, media, onClose }: LightboxModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const handlePrev = useCallback(() => {
    setCurrentMediaIndex((i) => (media.length === 0 ? 0 : (i - 1 + media.length) % media.length))
  }, [media.length])

  const handleNext = useCallback(() => {
    setCurrentMediaIndex((i) => (media.length === 0 ? 0 : (i + 1) % media.length))
  }, [media.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, handlePrev, handleNext])

  const current = media.length > 0 ? media[currentMediaIndex] : undefined
  const currentKey = current?.id ?? currentMediaIndex
  const isVideo = current?.type === 'video' || (current?.url ?? '').endsWith('.mp4')

  const placeholderBlock = (label: string, dark?: boolean) => (
    <div
      className={`flex h-full min-h-[55vh] w-full flex-col items-center justify-center gap-2.5 ${
        dark ? 'bg-navy-800 text-slate-400' : 'bg-slate-200 text-slate-600'
      }`}
    >
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="text-[0.85rem] font-semibold">{label}</span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-navy-900 p-6" onClick={onClose}>
      {/* Layer 1: blurred copy of the same media covering the whole backdrop */}
      {current?.url && (
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {isVideo ? (
            <video
              key={currentKey}
              src={current.url}
              className="h-full w-full scale-[1.15] object-cover opacity-80 blur-[20px] brightness-[0.6]"
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img key={currentKey} src={current.url} alt="" className="h-full w-full scale-[1.15] object-cover opacity-80 blur-[20px] brightness-[0.6]" />
          )}
        </div>
      )}

      {/* Foreground card: full media, never cropped */}
      <div className="relative flex max-h-[90vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/30" onClick={(e) => e.stopPropagation()}>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-white">
          {!current ? (
            placeholderBlock('Sin contenido multimedia')
          ) : current.url ? (
            isVideo ? (
              <video
                key={currentKey}
                src={current.url}
                controls
                autoPlay
                className="block h-full w-full object-contain"
              />
            ) : (
              <img
                key={currentKey}
                src={current.url}
                alt={galleryItem.title}
                className="mx-auto block h-auto w-auto max-h-full max-w-full object-contain"
              />
            )
          ) : isVideo ? (
            placeholderBlock('Sin video disponible', true)
          ) : (
            placeholderBlock('Sin imágenes disponibles')
          )}
        </div>

        {/* Metadata (event name, description, date) */}
        <div className="relative z-[2] shrink-0 bg-white px-7 py-6">
          <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-gradient-to-r from-navy-800 to-navy-700 px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-gold-400">
              Año {galleryItem.year}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.72rem] font-bold tracking-wide text-slate-600">
              {galleryItem.category}
            </span>
            {isVideo && (
              <span className="rounded-full bg-crimson-600 px-3 py-1 text-[0.72rem] font-extrabold tracking-wide text-white">
                ▶ VIDEO EN VIVO
              </span>
            )}
            <span className="ml-auto text-[0.8rem] font-semibold tracking-wide text-slate-400">
              {galleryItem.date}
            </span>
          </div>

          <h3 className="mt-0 mb-2 font-serif text-[1.35rem] font-extrabold text-navy-800">
            {galleryItem.title}
          </h3>

          <p className="m-0 text-[0.92rem] leading-relaxed tracking-wide text-slate-600">
            {galleryItem.desc}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-navy-900/85 text-[1.1rem] text-white transition-all duration-200 hover:scale-110 hover:bg-navy-900 active:scale-95"
        >
          ✕
        </button>

        {/* Prev button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          aria-label="Anterior"
          className="absolute top-[35%] left-3.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-navy-900/85 text-[1.2rem] text-white transition-all duration-200 hover:scale-110 hover:bg-navy-900 active:scale-95"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          aria-label="Siguiente"
          className="absolute top-[35%] right-3.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 bg-navy-900/85 text-[1.2rem] text-white transition-all duration-200 hover:scale-110 hover:bg-navy-900 active:scale-95"
        >
          ›
        </button>
      </div>
    </div>
  )
}
