'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import StepWelcome from '../components/StepWelcome'
import StepLanguage from '../components/StepLanguage'
import StepAllergens from '../components/StepAllergens'
import StepDiet from '../components/StepDiet'

export type Language = 'de' | 'en' | 'es'
export type DietType = 'vegan' | 'vegetarian' | 'none'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [allergens, setAllergens] = useState<string[]>([])
  const [diet, setDiet] = useState<DietType | null>(null)

  const goToMenu = (finalDiet: DietType) => {
    const params = new URLSearchParams({
      lang: language,
      allergens: allergens.join(','),
      diet: finalDiet,
      restaurant: 'restaurant-mitte',
    })
    router.push(`/menu?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepWelcome key="welcome" language={language} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepLanguage key="language" onSelect={(lang) => { setLanguage(lang); setStep(2) }} />
        )}
        {step === 2 && (
          <StepAllergens key="allergens" language={language} selected={allergens} onSelect={setAllergens} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <StepDiet
            key="diet"
            language={language}
            selected={diet}
            onSelect={setDiet}
            onNext={() => goToMenu(diet ?? 'none')}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
