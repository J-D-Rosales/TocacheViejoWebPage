export function PrincipalMessageSection() {
  return (
    <section className="bg-white py-[clamp(60px,8vw,96px)]">
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-16">
          {/* Photo side */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-blue-100 shadow-xl shadow-navy-900/15">
              <img
                src="src/assets/DIrectoraCrisWeb.webp"
                alt="Directora Cresencia Valeriana Rosales Fuentes"
                className="block h-full w-full object-cover"
              />
            </div>
            <div className="absolute right-6 -left-3 bottom-6 rounded-2xl border-b-4 border-gold-500 bg-gradient-to-r from-navy-800 to-navy-700 p-4 px-[22px] text-white shadow-2xl shadow-navy-900/30">
              <div className="font-serif text-[1rem] font-extrabold">
                Dr. Cresencia Valeriana
              </div>
              <div className="mt-[3px] text-[0.76rem] font-bold tracking-[0.08em] text-gold-400">
                DIRECTORA
              </div>
            </div>
          </div>

          {/* Text & Quote side */}
          <div>
            <div className="mb-3 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
              Palabras de la Directora
            </div>
            <h2 className="mt-0 mb-6 font-serif text-[clamp(1.7rem,2.5vw,2.3rem)] font-extrabold leading-[1.35] text-navy-800">
              Un Mensaje de Bienvenida
            </h2>
            <div className="mb-7 h-1.5 w-14 rounded bg-gradient-to-r from-gold-400 to-gold-400/20" />

            <svg
              width="40"
              height="28"
              viewBox="0 0 40 28"
              fill="#0F2C59"
              className="mb-3 block opacity-15"
            >
              <path d="M16 0H0v16c0 6.627 5.373 12 12 12h4V16H8V8h8V0zm24 0H24v16c0 6.627 5.373 12 12 12h4V16H32V8h8V0z" />
            </svg>

            <blockquote className="m-0 border-l-[4px] border-gold-400 p-0 pl-5">
              <p className="m-0 font-serif text-[clamp(1.05rem,1.5vw,1.25rem)] font-bold italic leading-loose text-slate-800">
                "En la Institución Educativa 0440 de Tocache Viejo, formamos estudiantes capaces, críticos y responsables, comprometidos con su desarrollo personal y el bienestar de su comunidad."
              </p>
            </blockquote>

            <p className="mt-6 text-[0.95rem] leading-relaxed tracking-wide text-slate-600">
              Como directora, me comprometo a liderar con transparencia y trabajo en equipo, promoviendo una educación de calidad que valore nuestra identidad cultural y el entorno natural que nos rodea. En Tocache Viejo, cada niño y niña es importante y cuenta con nuestro apoyo para crecer con confianza y alegría.
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed tracking-wide text-slate-600">
              Los invito a formar parte de nuestra comunidad educativa. Ya sea que estén considerando unirse a nosotros por primera vez o que ya sean parte de nuestra gran familia, aquí encontrarán un hogar donde crecer, aprender y soñar.
            </p>

            <div className="mt-7 border-t-2 border-slate-200 pt-6">
              <div className="font-serif text-[1.05rem] font-extrabold text-navy-800">
                Dir. Cresencia Valeriana Rosales Fuentes
              </div>
              <div className="mt-1 text-[0.85rem] font-medium tracking-wide text-slate-600">
                Directora de la I.E 0440 de Tocache Viejo 
              </div>
              <div className="mt-2.5 font-serif text-[0.86rem] font-bold italic text-slate-400">
                — Disciplina, Estudio y Trabajo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
