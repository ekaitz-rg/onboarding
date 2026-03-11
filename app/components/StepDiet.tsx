'use client'

import { motion } from 'framer-motion'
import { Language, DietType } from '../onboarding/page'

const texts = {
  de: { title: 'Deine Ernährung?', subtitle: 'Wähle eine Option', button: 'Weiter' },
  en: { title: 'Your diet?', subtitle: 'Choose one option', button: 'Continue' },
  es: { title: '¿Tu dieta?', subtitle: 'Elige una opción', button: 'Continuar' },
}

const options: { code: DietType; icon: string; de: string; en: string; es: string }[] = [
  { code: 'vegan', icon: '🌱', de: 'Vegan', en: 'Vegan', es: 'Vegano' },
  { code: 'vegetarian', icon: '🥗', de: 'Vegetarisch', en: 'Vegetarian', es: 'Vegetariano' },
  { code: 'none', icon: '🍽️', de: 'Keine Einschränkung', en: 'No restriction', es: 'Sin restricción' },
]

export default function StepDiet({
  language, selected, onSelect, onNext
}: {
  language: Language
  selected: DietType
  onSelect: (diet: DietType) => void
  onNext: () => void
}) {
  const t = texts[language]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">{t.title}</h2>
        <p className="text-neutral-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => onSelect(opt.code)}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition font-medium text-left text-lg ${
              selected === opt.code
                ? 'bg-white text-black'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <span>{opt[language]}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-neutral-200 transition"
      >
        {t.button}
      </button>
    </motion.div>
  )
}
