import type { Page } from '../../types'

interface FooterProps {
  setPage: (p: Page) => void
}

export function Footer({ setPage }: FooterProps) {
  const handleNav = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const colHeading = 'mb-4 font-serif text-[0.95rem] font-extrabold tracking-wide text-gold-400'

  return (
    <footer className="bg-gradient-to-b from-navy-800 to-navy-900 pt-16 text-white">
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 pb-12">
          {/* Col 1 */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <img
                src="src/assets/TocacheViejoLogo.webp"
                alt="Logo I.E. Tocache Viejo"
                className="h-12 w-auto object-contain"
              />
              <span className="font-serif text-[1.05rem] font-extrabold">
                I.E. Tocache Viejo
              </span>
            </div>
            <p className="max-w-[260px] text-[0.9rem] leading-loose tracking-wide text-white/65">
              Inspirando excelencia y formando el futuro de nuestra juventud. Una tradición de valores, integridad académica y comunidad.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className={colHeading}>
              Enlaces Rápidos
            </h4>
            {[
              { label: 'Inicio', page: 'home' as Page },
              { label: 'Sobre Nosotros', page: 'about' as Page },
              { label: 'Admisiones y Contacto', page: 'contact' as Page },
            ].map((l) => (
              <button
                type="button"
                key={l.label}
                onClick={() => handleNav(l.page)}
                className="block cursor-pointer border-0 bg-transparent py-[5px] text-left text-[0.9rem] font-medium tracking-wide text-white/65 transition-all duration-200 hover:translate-x-1 hover:text-gold-400"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <h4 className={colHeading}>
              Contacto Directo
            </h4>
            <div className="text-[0.9rem] leading-loose tracking-wide text-white/65">
              <div>📍RC5G+H3, Cueva de Chunchi 22540</div>
              <div>📞+51 928462955</div>
              <div>✉️ cresenciarosales9@gmail.com</div>
              <div>🕐 Lun-Sab 8:00 AM – 1:00 PM</div>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className={colHeading}>
              Horario de Atención
            </h4>
            <div className="text-[0.9rem] leading-loose tracking-wide text-white/65">
              <div>Mesa de Partes y Secretaría</div>
              <div className="text-[0.8rem] text-white/45">Lun–Vie: 8:00 AM – 1:00 PM</div>
              <div className="mt-2">Dirección Institucional</div>
              <div className="text-[0.8rem] text-white/45">Lun–Vie: 8:00 AM – 1:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-2 border-gold-400/70 bg-black/20">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-[clamp(16px,4vw,48px)] py-4">
          <p className="m-0 text-[0.75rem] text-white/45">
            © 2026 Institución Educativa Tocache Viejo. Todos los derechos reservados.
          </p>
          <p className="m-0 text-[0.75rem] text-white/35">
            Educando con Excelencia y Valores
          </p>
        </div>
      </div>
    </footer>
  )
}
