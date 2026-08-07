export function ContactInfoGrid() {
  const cards = [
    {
      title: 'Dirección de la escuela',
      icon: '📍',
      lines: ['San Martín', 'Tocache Viejo', 'Cueva de Chunchi 22540', 'Perú'],
      badge: 'Puerta principal y acceso de visitantes',
    },
    {
      title: 'Teléfono y contacto directo',
      icon: '📞',
      lines: ['+51 928 462 955'],
      badge: 'Lun-Vie 8:00 AM – 4:30 PM',
    },
    {
      title: 'Correo electrónico',
      icon: '✉️',
      lines: [
        'cresenciarosales9@gmail.com',
      ],
      badge: 'Respuesta en 24 horas',
    },
  ]

  return (
    <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl border-2 border-blue-100 bg-white px-6 py-8 shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 active:scale-[0.99]"
        >
          <div className="mb-3.5 text-[2.1rem]">{card.icon}</div>
          <h3 className="mt-0 mb-3 font-serif text-[1.1rem] font-extrabold text-navy-800">
            {card.title}
          </h3>
          <div className="mb-4 text-[0.9rem] leading-loose tracking-wide text-slate-600">
            {card.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <span className="inline-block rounded-full border-2 border-navy-800/15 bg-navy-800/5 px-3 py-1 text-[0.74rem] font-extrabold tracking-wide text-navy-800">
            {card.badge}
          </span>
        </div>
      ))}
    </div>
  )
}
