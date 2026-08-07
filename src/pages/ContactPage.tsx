import type { Page } from '../types'
import { ContactHero } from '../components/contact/ContactHero'
import { ContactInfoGrid } from '../components/contact/ContactInfoGrid'
import { ContactForm } from '../components/contact/ContactForm'
import { FaqAccordion } from '../components/contact/FaqAccordion'

interface ContactPageProps {
  setPage: (p: Page) => void
}

export function ContactPage({ setPage }: ContactPageProps) {
  return (
    <main className="bg-slate-50 pb-24">
      <ContactHero setPage={setPage} />
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4vw,48px)] pt-14">
        <ContactInfoGrid />
        <ContactForm />
        <FaqAccordion />
      </div>
    </main>
  )
}
