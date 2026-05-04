import { useState } from 'react'
import AgeGate from './components/AgeGate.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import DealsCarousel from './components/DealsCarousel.jsx'
import CategoryHub from './components/CategoryHub.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import FlavourFinder from './components/FlavourFinder.jsx'
import AIAssistant from './components/AIAssistant.jsx'
import ScalingSection from './components/ScalingSection.jsx'
import LocalTrust from './components/LocalTrust.jsx'
import FAQ from './components/FAQ.jsx'
import PhasePlan from './components/PhasePlan.jsx'
import Footer from './components/Footer.jsx'
import FloatingAssistant from './components/FloatingAssistant.jsx'

export default function App() {
  // When the user filters from a category card we lift the category id here so
  // the ProductGrid can scroll into view and pre-apply the filter.
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantSeed, setAssistantSeed] = useState(null)

  const askAssistantAbout = (productTitle) => {
    setAssistantSeed(`Tell me about: ${productTitle}`)
    setAssistantOpen(true)
  }

  const onPickCategory = (id) => {
    setCategoryFilter(id)
    // Defer scroll until React paints the filter update.
    requestAnimationFrame(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <AgeGate>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="top" className="flex-1">
          <Hero />
          <DealsCarousel onAskAssistant={askAssistantAbout} />
          <CategoryHub onPickCategory={onPickCategory} />
          <ProductGrid
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onAskAssistant={askAssistantAbout}
          />
          <FlavourFinder onAskAssistant={askAssistantAbout} />
          <AIAssistant />
          <ScalingSection />
          <LocalTrust />
          <FAQ />
          <PhasePlan />
        </main>
        <Footer />
        <FloatingAssistant
          open={assistantOpen}
          setOpen={setAssistantOpen}
          seed={assistantSeed}
          clearSeed={() => setAssistantSeed(null)}
        />
      </div>
    </AgeGate>
  )
}
