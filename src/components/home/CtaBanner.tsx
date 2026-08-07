import type { Page } from '../../types'

interface CtaBannerProps {
 setPage: (p: Page) => void
}

export function CtaBanner({ setPage }: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-crimson-600 py-[clamp(48px,6vw,72px)]">
      <div className="absolute -top-[60px] -right-[60px] h-[360px] w-[360px] rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-black/10" />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-6 px-[clamp(16px,4vw,48px)]">
        <div>
          <h2 className="m-0 mb-2.5 font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-white">
            ¡Únete a nuestra comunidad educativa!
          </h2>
          <p className="m-0 text-[1.05rem] font-medium leading-relaxed tracking-wide text-white/85">
            Las inscripciones para el próximo año académico están abiertas
          </p>
        </div>
        <button
          type='button'
          onClick={() => {
            setPage('contact')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="shrink-0 cursor-pointer rounded-full border-b-4 border-slate-200 bg-white px-8 py-4 text-[0.95rem] font-extrabold uppercase tracking-[0.07em] text-crimson-600 shadow-xl shadow-crimson-700/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95"
        >
          Matricularme
        </button>
      </div>
    </section>
  )
}
