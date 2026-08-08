import type { Page } from '../../types'
import { statsData } from '../../data/schoolData'
import TVEscuela from '../../assets/TocacheViejoEscuela.webp'

interface HeroSectionProps {
  setPage: (p: Page) => void
}

export function HeroSection({ setPage }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900">
      <img
        src={TVEscuela}
        alt="TocacheViejo escuela"
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/70 to-navy-800/60" />
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-navy-900 to-transparent" />

      {/* Decorative gold line */}
      <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-gold-400 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] pt-[120px] pb-20">
        <div className="max-w-[680px]">

          <h1 className="mt-0 mb-6 font-serif text-[clamp(2.4rem,5.5vw,3.7rem)] font-extrabold leading-[1.2] text-white">
            Disciplina, Estudio 
            <br />
            <em className="italic text-gold-400">
              Trabajo
            </em>
          </h1>

          <p className="mb-10 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-loose tracking-wide text-white/80">
            En la I.E. 0440 de Tocache Viejo, formamos estudiantes con valores, conocimientos y confianza para construir un futuro lleno de oportunidades.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={() => {
                setPage('contact')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="cursor-pointer rounded-full border-b-4 border-crimson-700 bg-crimson-600 px-8 py-4 text-[0.95rem] font-extrabold uppercase tracking-[0.05em] text-white shadow-xl shadow-crimson-700/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:from-crimson-500 hover:to-crimson-600 active:scale-95"
            >
              QUIERO MATRICULARME
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full border-2 border-white/60 bg-white/10 px-8 py-4 text-[0.95rem] font-bold tracking-wide text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-gold-400 hover:bg-white/15 hover:text-gold-400 active:scale-95"
              onClick={() =>
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              VER LOGROS Y EVENTOS
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex flex-wrap gap-10 border-t-2 border-white/15 pt-10">
            {statsData.map((s) => (
              <div key={s.l}>
                <div className="font-serif text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-none text-gold-400">
                  {s.n}
                </div>
                <div className="mt-1 text-[0.78rem] font-bold tracking-wide text-white/60">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
