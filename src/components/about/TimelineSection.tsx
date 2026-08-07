import { milestones } from '../../data/schoolData'

export function TimelineSection() {
  return (
    <section className="bg-slate-50 py-[clamp(60px,8vw,96px)]">
      <div className="mx-auto max-w-[900px] px-[clamp(16px,4vw,48px)]">
        <div className="mb-14 text-center">
          <div className="mb-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
            Nuestra Historia
          </div>
          <h2 className="m-0 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-navy-800">
            Hitos Institucionales
          </h2>
        </div>

        <div className="relative">
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`relative flex gap-6 ${i < milestones.length - 1 ? 'mb-8' : 'mb-0'}`}
            >
              {/* Year Badge + Vertical Line */}
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-[3px] border-gold-400 bg-navy-800 shadow-xl shadow-navy-900/20">
                  <span className="text-[0.66rem] font-extrabold tracking-[-0.02em] text-gold-400">
                    {m.year}
                  </span>
                </div>
                {i < milestones.length - 1 && (
                  <div className="mt-1.5 min-h-10 w-1 flex-1 bg-gradient-to-b from-navy-800 to-slate-200" />
                )}
              </div>

              {/* Milestone Content */}
              <div className="mb-2 flex-1 rounded-2xl border-2 border-blue-100 bg-white px-[22px] py-[18px] shadow-xl shadow-navy-900/5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99]">
                <h3 className="m-0 mb-1.5 font-serif text-[1.05rem] font-extrabold text-navy-800">
                  {m.title}
                </h3>
                <p className="m-0 text-[0.88rem] leading-relaxed tracking-wide text-slate-600">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
