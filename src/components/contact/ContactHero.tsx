import type { Page } from '../../types'

interface ContactHeroProps {
 setPage: (p: Page) => void
}

export function ContactHero({ setPage }: ContactHeroProps) {
  return (
    <section className="relative flex min-h-[320px] items-end overflow-hidden bg-navy-800 pt-[68px]">
      <img
        src="./src/assets/TocacheViejoEscuela.webp"
        alt="Tocache Viejo escuela"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 to-navy-800/80" />
      <div className="relative mx-auto w-full max-w-[1280px] px-[clamp(16px,4vw,48px)] pb-11">
        <div className="mb-3 text-[0.82rem] font-bold tracking-wide text-white/50">
          <button
            className="cursor-pointer"
            onClick={() => {
              setPage('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Inicio  
          </button>
          <span className="mx-2">›</span>
          <span className="text-gold-400">Admisiones y Contacto</span>
        </div>
        <h1 className="m-0 font-serif text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold leading-[1.2] text-white">
          Admisiones & <em className="italic text-gold-400">Contacto</em>
        </h1>
        <p className="mt-3 max-w-[600px] text-[1.02rem] leading-relaxed tracking-wide text-white/75">
          Estamos encantados con tu interés en la I.E. 0440 de Tocache Viejo. Ponte en contacto con nuestro equipo de admisiones o envía un formulario de consulta a continuación.
        </p>
      </div>
    </section>
  )
}
