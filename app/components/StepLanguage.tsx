'use client'

import { motion } from 'framer-motion'
import { Language } from '../onboarding/page'

const languages = [
  { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
  { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
]

export default function StepLanguage({ onSelect }: { onSelect: (lang: Language) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-6"
    >
      <h2 className="text-3xl font-bold">Choose your language</h2>
      <div className="flex flex-col gap-4 mt-6">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="flex items-center gap-4 bg-neutral-800 hover:bg-neutral-700 transition px-6 py-4 rounded-2xl text-left text-xl font-medium"
          >
            <span className="text-3xl">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
