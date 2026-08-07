export function MissionVisionSection() {
  const cards = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F2C59" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: 'Nuestra Misión',
      text: 'Somos una institución educativa de nivel primaria con atención multigrado, que brinda una formación integral a niños y niñas de Tocache Viejo. Promovemos el aprendizaje autónomo, el pensamiento crítico y la conciencia ecológica mediante estrategias de atención diferenciada, respetando los ritmos de aprendizaje y fortaleciendo la convivencia democrática y los valores éticos.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F2C59" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      label: 'Nuestra Visión',
      text: 'Ser una institución educativa líder en la educación primaria de Tocache Viejo, modelo de convivencia democrática y gestión participativa, comprometida con el desarrollo integral y sostenible de nuestros estudiantes y comunidad.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F2C59" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      label: 'Nuestros Valores',
      text: 'Honestidad · Respeto · Responsabilidad · Solidaridad · Biodiversidad.',
    },
  ]

  return (
    <section className="bg-slate-50 py-[clamp(60px,8vw,96px)]">
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)]">
        <div className="mb-12 text-center">
          <div className="mb-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
            Nuestra Esencia
          </div>
          <h2 className="m-0 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-navy-800">
            Misión, Visión y Valores
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border-2 border-blue-100 bg-white px-7 py-8 shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.99]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-100 to-amber-50 transition-transform duration-300 hover:scale-110">
                {card.icon}
              </div>
              <div className="mb-4 h-1 w-10 rounded bg-gold-400" />
              <h3 className="mt-0 mb-3 font-serif text-[1.15rem] font-extrabold text-navy-800">
                {card.label}
              </h3>
              <p className="m-0 text-[0.92rem] leading-loose tracking-wide text-slate-600">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
