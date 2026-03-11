'use client'

import { motion } from 'framer-motion'
import { Language } from '../onboarding/page'

const texts = {
  de: { title: 'Willkommen', subtitle: 'Lass uns dein Menü personalisieren', button: 'Starten' },
  en: { title: 'Welcome', subtitle: 'Let us personalize your menu', button: 'Start' },
  es: { title: 'Bienvenido', subtitle: 'Vamos a personalizar tu menú', button: 'Empezar' },
}

export default function StepWelcome({ language, onNext }: { language: Language; onNext: () => void }) {
  const t = texts[language]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-6"
    >
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="text-neutral-400 text-lg">{t.subtitle}</p>
      <button
        onClick={onNext}
        className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-neutral-200 transition"
      >
        {t.button}
      </button>
    </motion.div>
  )
}
