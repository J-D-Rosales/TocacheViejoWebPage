import { useState, useEffect } from 'react'
import type { Page } from './types'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { AdminPage } from './pages/AdminPage'
import logoTV from './assets/TocacheViejoLogo.webp'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isShowing, setIsShowing] = useState(true)       

  useEffect(() => {
    const triggerAnimation = setTimeout(() => setIsAppLoading(false), 2000);
    
    const removeComponent = setTimeout(() => setIsShowing(false), 2500);

    return () => {
      clearTimeout(triggerAnimation);
      clearTimeout(removeComponent);
    };
  }, []);

  return (
    <AuthProvider>
      {/* PANTALLA DE CARGA (Splash Screen) */}
      {isShowing && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-900 transition-all duration-500 ease-in-out ${
            isAppLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          <img
            src={logoTV}
            alt="Logo Institución Educativa Tocache Viejo"
            className="h-24 w-24 animate-bounce object-cover drop-shadow-xl" 
          />
          <div className="mt-6 animate-pulse text-center font-serif text-sm font-extrabold uppercase tracking-widest text-gold-400">
            Institución Educativa
            <br /> TOCACHE VIEJO
          </div>
        </div>
      )}
      <div className="flex min-h-screen flex-col">
        <Navbar currentPage={currentPage} setPage={setCurrentPage} />
        <div className="flex-1">
          {currentPage === 'home' && <HomePage setPage={setCurrentPage} />}
          {currentPage === 'about' && <AboutPage setPage={setCurrentPage} />}
          {currentPage === 'contact' && <ContactPage setPage={setCurrentPage} />}
          {currentPage === 'admin' && <AdminPage setPage={setCurrentPage} />}
        </div>
        {/* Footer hidden on admin dashboard to keep focus clean */}
        {currentPage !== 'admin' && <Footer setPage={setCurrentPage} />}
      </div>
    </AuthProvider>
  )
}
