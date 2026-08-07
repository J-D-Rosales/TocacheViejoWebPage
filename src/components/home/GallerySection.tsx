import { useEffect, useMemo, useState } from 'react'
import { apiService } from '../../services/apiService'
import type { GalleryItem, GalleryMediaItem, SchoolEvent } from '../../types'
import { LightboxModal } from '../common/LightboxModal'

/** Convierte un evento (con su media de la API) en la forma usada por la galería. */
function toGalleryItem(event: SchoolEvent): GalleryItem {
  const photo = event.media?.find((m) => m.type === 'PHOTO')
  const video = event.media?.find((m) => m.type === 'VIDEO')
  const isVideo = !photo && !!video

  return {
    id: event.id,
    year: event.year,
    title: event.name,
    category: 'Evento',
    date: event.eventDate
      ? new Date(`${event.eventDate}T00:00:00`).toLocaleDateString('es-PE')
      : '',
    desc: event.description ?? '',
    img: photo?.url ?? '',
    mediaType: isVideo ? 'video' : 'image',
    mediaUrl: isVideo ? video?.url : undefined,
  }
}

/** Convierte la media de un evento en la lista navegable del lightbox. */
function toLightboxMedia(event: SchoolEvent): GalleryMediaItem[] {
  return (event.media ?? []).map((m, i) => ({
    id: m.s3Key || i,
    url: m.url ?? '',
    type: m.type === 'VIDEO' ? 'video' : 'image',
  }))
}

export function GallerySection() {
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all')
  const [lightboxEvent, setLightboxEvent] = useState<SchoolEvent | null>(null)

  useEffect(() => {
    let active = true
    apiService
      .getEvents()
      .then((list) =>
        Promise.all(list.map((ev) => apiService.getEvent(ev.id))),
      )
      .then((enriched) => {
        if (active) {
          setEvents(enriched)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar eventos')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const items = useMemo(() => events.map(toGalleryItem), [events])

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a),
    [items],
  )

  const filtered = yearFilter === 'all' ? items : items.filter((g) => g.year === yearFilter)

  const handleOpenLightbox = (item: GalleryItem) => {
    setLightboxEvent(events.find((ev) => ev.id === item.id) ?? null)
  }

  const handleCloseLightbox = () => setLightboxEvent(null)

  const pillClass = (active: boolean) =>
    `cursor-pointer rounded-full border-2 px-[18px] py-2 text-[0.88rem] font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.05] active:scale-95 ${
      active
        ? 'border-navy-800 bg-navy-800 text-gold-400 shadow-md shadow-navy-900/10'
        : 'border-slate-200 bg-white text-slate-600 hover:border-gold-400/60 hover:text-navy-800'
    }`

  return (
    <section id="gallery" className="bg-slate-50 py-[clamp(60px,8vw,100px)]">
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
              Fotos y videos
            </div>
            <h2 className="font-serif text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold text-navy-800">
              Nuestros eventos
            </h2>
          </div>

          {/* Year Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button type="button" key="all" onClick={() => setYearFilter('all')} className={pillClass(yearFilter === 'all')}>
              Todos los años
            </button>
            {years.map((yr) => (
              <button type="button" key={yr} onClick={() => setYearFilter(yr)} className={pillClass(yearFilter === yr)}>
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && <div className="py-12 text-center text-slate-400">Cargando eventos...</div>}
        {!loading && error && (
          <div
            role="alert"
            className="mx-auto max-w-[560px] rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-center text-[0.9rem] font-bold tracking-wide text-red-700"
          >
            No se pudo cargar los eventos: {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">No hay eventos para mostrar.</div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
            {filtered.map((item) => (
              <button
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-navy-900/10 active:scale-[0.99]"
                onClick={() => handleOpenLightbox(item)}
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden bg-blue-100">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-200 text-slate-400">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                      <div className="text-[0.8rem] font-semibold">Ver Galería</div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-900/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-white/80 text-[1.4rem] text-white">
                      ⊕
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-5 pb-5 pt-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <span className="rounded-full border-2 border-gold-400/30 bg-gradient-to-r from-navy-800 to-navy-700 px-3.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.1em] text-gold-400 shadow-md shadow-navy-900/10">
                      Año {item.year}
                    </span>
                    <span className="text-[0.75rem] font-semibold tracking-wide text-slate-400">{item.category}</span>
                  </div>
                  <h3 className="mb-1.5 font-serif text-[1.05rem] font-extrabold text-navy-800">{item.title}</h3>
                  <p className="line-clamp-2 text-[0.88rem] leading-relaxed tracking-wide text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxEvent && (
        <LightboxModal
          galleryItem={toGalleryItem(lightboxEvent)}
          media={toLightboxMedia(lightboxEvent)}
          onClose={handleCloseLightbox}
        />
      )}
    </section>
  )
}
