import type { Page } from '../types'
import { HeroSection } from '../components/home/HeroSection'
import { GallerySection } from '../components/home/GallerySection'
import { AwardsSection } from '../components/home/AwardsSection'
import { CtaBanner } from '../components/home/CtaBanner'

interface HomePageProps {
  readonly setPage: (p: Page) => void
}

export function HomePage({ setPage }: HomePageProps) {
  return (
    <main>
      <HeroSection setPage={setPage} />
      <GallerySection />
      <AwardsSection />
      <CtaBanner setPage={setPage} />
    </main>
  )
}
