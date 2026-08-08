import { useState, useEffect } from 'react'
import type { Page } from '../../types'
import logoTV from '../../assets/TocacheViejoLogo.webp'

interface NavbarProps {
  currentPage: Page
  setPage: (p: Page) => void
}

export function Navbar({ currentPage, setPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links: { label: string; page: Page }[] = [
    { label: 'Inicio', page: 'home' },
    { label: 'Sobre Nosotros', page: 'about' },
    { label: 'Admisiones y Contacto', page: 'contact' },
  ]

  const isAdmin = currentPage === 'admin'

  const handlePageChange = (p: Page) => {
    setPage(p)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const linkClass = (page: Page) =>
    `relative py-1 text-[0.95rem] font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] hover:text-white ${
      currentPage === page
        ? 'font-extrabold text-gold-400 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-gold-400'
        : 'text-white/80'
    }`

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[1000] border-b px-[clamp(16px,4vw,48px)] transition-all duration-300 ${
        scrolled
          ? 'border-gold-400/20 bg-navy-900/95 shadow-xl shadow-navy-900/20 backdrop-blur-md'
          : 'border-b-2 border-white/10 bg-navy-800'
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center">
        {/* Logo */}
        <button
          type='button'
          onClick={() => handlePageChange('home')}
          className="flex shrink-0 cursor-pointer items-center gap-3 border-0 bg-transparent p-0"
        >
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border-b-4 hover:scale-110 active:scale-95">
            <img src={logoTV} alt="Logo" />
          </div>
          <div className="text-left">
            <div className="font-serif text-[1rem] font-bold leading-[1.2] text-white">
              Tocache Viejo
            </div>
            <div className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-gold-400">
              Institución Educativa Primaria
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <div className="ml-auto mr-5 hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              type='button'
              key={l.page}
              onClick={() => handlePageChange(l.page)}
              className={`cursor-pointer border-0 bg-transparent ${linkClass(l.page)}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2.5">
          {/* Discrete Staff / Admin button — only entry point for login */}
          <button
            id="navbar-admin-btn"
            type='button'
            onClick={() => handlePageChange('admin')}
            title="Acceso para Personal Docente"
            aria-label="Portal Administrativo"
            className={`flex cursor-pointer items-center gap-[5px] rounded-full border-2 px-2.5 py-[7px] text-[0.76rem] font-bold tracking-wide transition-all duration-300 hover:scale-[1.05] active:scale-95 ${
              isAdmin
                ? 'border-gold-400/50 bg-gold-400/15 text-gold-400'
                : 'border-white/15 bg-transparent text-white/40 hover:border-white/25 hover:text-white/75'
            }`}
          >
            Portal Administrativo
          </button>

          {/* Enroll CTA */}
          <button
            type='button'
            onClick={() => handlePageChange('contact')}
            className="cursor-pointer rounded-full border-b-4 border-crimson-700 bg-crimson-600 px-[18px] py-[9px] text-[0.82rem] font-extrabold uppercase tracking-[0.04em] text-white shadow-xl shadow-crimson-700/30 transition-all duration-300 hover:scale-[1.03] hover:from-crimson-500 hover:to-crimson-600 active:scale-95"
          >
            Matricúlate
          </button>

          {/* Mobile hamburger */}
          <button
            type='button'
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-2 cursor-pointer border-0 bg-transparent text-white md:hidden"
            aria-label="Alternar menú de navegación"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-900 px-6 pb-5 pt-4 md:hidden">
          {links.map((l) => (
            <button
              type='button'
              key={l.page}
              onClick={() => handlePageChange(l.page)}
              className={`block w-full cursor-pointer border-0 border-b border-white/5 bg-transparent py-3 text-left text-[1rem] tracking-wide ${
                currentPage === l.page ? 'font-extrabold text-gold-400' : 'font-bold text-white/85'
              }`}
            >
              {l.label}
            </button>
          ))}
          {/* Single staff-only entry point in mobile menu too */}
          <button
            type='button'
            onClick={() => handlePageChange('admin')}
            className={`block w-full cursor-pointer border-0 bg-transparent py-3 text-left text-[0.85rem] font-semibold ${
              isAdmin ? 'text-gold-400' : 'text-white/35'
            }`}
          >
            Portal Administrativo
          </button>
        </div>
      )}
    </nav>
  )
}
