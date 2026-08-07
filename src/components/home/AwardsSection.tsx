import { useEffect, useState } from 'react'
import { apiService } from '../../services/apiService'
import type { SchoolAward } from '../../types'

const DEFAULT_ICON = '🏆'

export function AwardsSection() {
  const [awards, setAwards] = useState<SchoolAward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    apiService
      .getAwards()
      .then((data) => {
        if (active) {
          setAwards(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar premios')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-8 text-center text-slate-400">
          Cargando premios...
        </div>
      )
    }

    if (error) {
      return (
        <div
          role="alert"
          className="mx-auto max-w-[560px] rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-center text-[0.9rem] font-bold tracking-wide text-red-700"
        >
          No se pudo cargar los premios: {error}
        </div>
      )
    }

    if (awards.length === 0) {
      return (
        <div className="py-8 text-center text-slate-400">
          Aún no hay premios registrados.
        </div>
      )
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {awards.map((award) => (
          <div
            key={award.id}
            className="relative overflow-hidden rounded-3xl border-2 border-amber-100 bg-white px-6 py-7 shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/15 active:scale-[0.99]"
          >
            <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-gold-400 to-gold-400/30" />
            <div className="mb-3.5 text-[2.25rem]">{DEFAULT_ICON}</div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="m-0 flex-1 pr-3 font-serif text-[1.05rem] font-extrabold leading-[1.4] text-navy-800">
                {award.name}
              </h3>
              <span className="shrink-0 rounded-full bg-gradient-to-r from-navy-800 to-navy-700 px-3 py-1 text-[0.72rem] font-extrabold tracking-wide text-gold-400">
                {award.year}
              </span>
            </div>
            {award.place && (
              <div className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-[0.74rem] font-extrabold tracking-wide text-amber-900">
                {award.place}
              </div>
            )}
            <p className="m-0 text-[0.88rem] leading-relaxed tracking-wide text-slate-600">
              {award.description}
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden bg-white py-[clamp(60px,8vw,96px)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        <div className="mb-14 text-center">
          <div className="mb-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
            Distinciones y Reconocimientos
          </div>
          <h2 className="mx-auto mb-3.5 font-serif text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold text-navy-800">
            Nuestros logros y reconocimientos
          </h2>
          <p className="mx-auto max-w-[540px] text-[1rem] leading-relaxed tracking-wide text-slate-600">
            A lo largo de los años, nuestra institución ha logrado importantes premios y reconocimientos en diversas áreas.
          </p>
        </div>

        {/* Call the helper function here */}
        {renderContent()}
      </div>
    </section>
  )
}
