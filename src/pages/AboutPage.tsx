import type { Page } from '../types'
import { AboutBanner } from '../components/about/AboutBanner'
import { MissionVisionSection } from '../components/about/MissionVisionSection'
import { PrincipalMessageSection } from '../components/about/PrincipalMessageSection'
import { TimelineSection } from '../components/about/TimelineSection'

interface AboutPageProps {
  readonly setPage: (p: Page) => void
}

export function AboutPage({ setPage }: AboutPageProps) {
  return (
    <main>
      <AboutBanner setPage={setPage} />
      <MissionVisionSection />
      <PrincipalMessageSection />
      <TimelineSection />
    </main>
  )
}
