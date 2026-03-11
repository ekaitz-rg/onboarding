'use client'

import { motion } from 'framer-motion'
import { Language } from '../onboarding/page'

const texts = {
  de: { title: 'Hast du Allergien?', subtitle: 'Wähle alle zutreffenden aus', button: 'Weiter', none: 'Keine Allergien' },
  en: { title: 'Any allergies?', subtitle: 'Select all that apply', button: 'Continue', none: 'No allergies' },
  es: { title: '¿Tienes alergias?', subtitle: 'Selecciona todas las que apliquen', button: 'Continuar', none: 'Sin alergias' },
}

const allergens = [
  { code: 'gluten', icon: '🌾', de: 'Gluten', en: 'Gluten', es: 'Gluten' },
  { code: 'crustaceans', icon: '🦐', de: 'Krebstiere', en: 'Crustaceans', es: 'Crustáceos' },
  { code: 'eggs', icon: '🥚', de: 'Eier', en: 'Eggs', es: 'Huevos' },
  { code: 'fish', icon: '🐟', de: 'Fisch', en: 'Fish', es: 'Pescado' },
  { code: 'peanuts', icon: '🥜', de: 'Erdnüsse', en: 'Peanuts', es: 'Cacahuetes' },
  { code: 'soybeans', icon: '🫘', de: 'Soja', en: 'Soybeans', es: 'Soja' },
  { code: 'milk', icon: '🥛', de: 'Milch', en: 'Milk', es: 'Lácteos' },
  { code: 'nuts', icon: '🌰', de: 'Schalenfrüchte', en: 'Tree Nuts', es: 'Frutos de cáscara' },
  { code: 'celery', icon: '🥬', de: 'Sellerie', en: 'Celery', es: 'Apio' },
  { code: 'mustard', icon: '🌿', de: 'Senf', en: 'Mustard', es: 'Mostaza' },
  { code: 'sesame', icon: '🫙', de: 'Sesam', en: 'Sesame', es: 'Sésamo' },
  { code: 'sulphites', icon: '🍷', de: 'Sulfite', en: 'Sulphur Dioxide', es: 'Sulfitos' },
  { code: 'lupin', icon: '🌼', de: 'Lupinen', en: 'Lupin', es: 'Altramuces' },
  { code: 'molluscs', icon: '🐙', de: 'Weichtiere', en: 'Molluscs', es: 'Moluscos' },
]

export default function StepAllergens({
  language, selected, onSelect, onNext
}: {
  language: Language
  selected: string[]
  onSelect: (allergens: string[]) => void
  onNext: () => void
}) {
  const t = texts[language]

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      onSelect(selected.filter((a) => a !== code))
    } else {
      onSelect([...selected, code])
    }
  }

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

      <div className="grid grid-cols-2 gap-3">
        {allergens.map((a) => {
          const isSelected = selected.includes(a.code)
          return (
            <button
              key={a.code}
              onClick={() => toggle(a.code)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition font-medium text-left ${
                isSelected
                  ? 'bg-white text-black'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm">{a[language]}</span>
            </button>
          )
        })}
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
