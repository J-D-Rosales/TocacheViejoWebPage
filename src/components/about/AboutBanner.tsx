import type { Page } from '../../types'

interface AboutBannerProps {
 readonly setPage: (p: Page) => void
}

export function AboutBanner({ setPage }: AboutBannerProps) {
  return (
    <section className="relative flex min-h-[320px] items-end overflow-hidden bg-navy-800 pt-[68px]">
      <img
        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=600&fit=crop&auto=format"
        alt="Campus"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      {/* Geometric overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 via-navy-900/75 to-navy-800/70" />
      <div className="absolute top-0 right-0 h-[500px] w-[500px] translate-x-[30%] -translate-y-[30%] rounded-full border border-gold-400/10" />
      <div className="absolute top-0 right-0 h-[300px] w-[300px] translate-x-[20%] -translate-y-[20%] rounded-full border border-gold-400/5" />
      <div className="relative mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] pb-12">
        <div className="mb-3 text-[0.82rem] font-bold tracking-wide text-white/50">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setPage('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Inicio
          </button>
          <span className="mx-2">›</span>
          <span className="text-gold-400">Sobre Nosotros</span>
        </div>
        <h1 className="m-0 font-serif text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold leading-[1.2] text-white">
          Nuestra Historia, Nuestra <em className="italic text-gold-400">Misión</em>
        </h1>
        <p className="mt-3 max-w-[580px] text-[1.02rem] leading-relaxed tracking-wide text-white/70">
          Fundada en 1930, la I.E. 0440 de Tocache Viejo ha crecido desde sus humildes inicios hasta convertirse en una institución educativa con grandes logros y con visión de futuro.
        </p>
      </div>
    </section>
  )
}
