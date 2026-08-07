import { useState } from 'react'
import { faqs } from '../../data/schoolData'

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="mt-16">
      <div className="mb-10 text-center">
        <div className="mb-2 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] text-crimson-600">
          Sección de dudas
        </div>
        <h2 className="m-0 font-serif text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold text-navy-800">
          Preguntas Frecuentes
        </h2>
      </div>

      <div className="mx-auto grid max-w-[860px] gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx
          return (
            <div
              key={idx}
              className={`overflow-hidden rounded-2xl border-2 border-blue-100 bg-white transition-all duration-300 ${
                isOpen ? 'shadow-xl shadow-navy-900/10' : 'shadow-none'
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-6 py-[18px] text-left"
              >
                <span className="font-serif text-[1.05rem] font-extrabold text-navy-800">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 text-[1.2rem] font-extrabold text-navy-800 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="border-t-2 border-slate-100 px-6 pt-4 pb-5 text-[0.92rem] leading-loose tracking-wide text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
