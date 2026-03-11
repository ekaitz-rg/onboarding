'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type MenuItem = {
  id: string
  name_de: string
  name_en: string
  name_es: string
  description_de: string
  description_en: string
  description_es: string
  category: string
  price: number
  is_vegan: boolean
  is_vegetarian: boolean
}

type Language = 'de' | 'en' | 'es'
type DietType = 'vegan' | 'vegetarian' | 'none'

const ALLERGENS = [
  { code: 'gluten', icon: '🌾', de: 'Gluten', en: 'Gluten', es: 'Gluten' },
  { code: 'crustaceans', icon: '🦞', de: 'Krebstiere', en: 'Crustaceans', es: 'Crustáceos' },
  { code: 'eggs', icon: '🥚', de: 'Eier', en: 'Eggs', es: 'Huevos' },
  { code: 'fish', icon: '🐟', de: 'Fisch', en: 'Fish', es: 'Pescado' },
  { code: 'peanuts', icon: '🥜', de: 'Erdnüsse', en: 'Peanuts', es: 'Cacahuetes' },
  { code: 'soybeans', icon: '🫘', de: 'Soja', en: 'Soybeans', es: 'Soja' },
  { code: 'milk', icon: '🥛', de: 'Milch', en: 'Milk', es: 'Lácteos' },
  { code: 'nuts', icon: '🌰', de: 'Schalenfrüchte', en: 'Tree Nuts', es: 'Frutos de cáscara' },
  { code: 'celery', icon: '🥬', de: 'Sellerie', en: 'Celery', es: 'Apio' },
  { code: 'mustard', icon: '🌿', de: 'Senf', en: 'Mustard', es: 'Mostaza' },
  { code: 'sesame', icon: '🫙', de: 'Sesam', en: 'Sesame', es: 'Sésamo' },
  { code: 'sulphites', icon: '🍷', de: 'Sulfite', en: 'Sulphites', es: 'Sulfitos' },
  { code: 'lupin', icon: '🌼', de: 'Lupinen', en: 'Lupin', es: 'Altramuces' },
  { code: 'molluscs', icon: '🐙', de: 'Weichtiere', en: 'Molluscs', es: 'Moluscos' },
]

const texts = {
  de: { title: 'Speisekarte', empty: 'Keine passenden Gerichte.', vegan: 'Vegan', vegetarian: 'Vegetarisch', prefs: 'Filter', diet: 'Ernährung', allergens: 'Allergene', all: 'Alle', clear: 'Löschen' },
  en: { title: 'Menu', empty: 'No matching dishes.', vegan: 'Vegan', vegetarian: 'Vegetarian', prefs: 'Filter', diet: 'Diet', allergens: 'Allergens', all: 'All', clear: 'Clear all' },
  es: { title: 'Menú', empty: 'No hay platos compatibles.', vegan: 'Vegano', vegetarian: 'Vegetariano', prefs: 'Filtros', diet: 'Dieta', allergens: 'Alérgenos', all: 'Todos', clear: 'Limpiar' },
}

export default function MenuPage() {
  const searchParams = useSearchParams()
  const slug = searchParams.get('restaurant') || 'restaurant-mitte'

  const [language, setLanguage] = useState<Language>((searchParams.get('lang') || 'en') as Language)
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(searchParams.get('allergens')?.split(',').filter(Boolean) || [])
  const [diet, setDiet] = useState<DietType>((searchParams.get('diet') || 'none') as DietType)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showPrefs, setShowPrefs] = useState(false)

  const t = texts[language]

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true)

      const { data: restaurant } = await supabase
        .from('restaurants').select('id').eq('slug', slug).single()

      if (!restaurant) { setLoading(false); return }

      let query = supabase
        .from('menu_items').select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('active', true)

      if (diet === 'vegan') query = query.eq('is_vegan', true)
      if (diet === 'vegetarian') query = query.eq('is_vegetarian', true)

      const { data: allItems } = await query
      if (!allItems) { setLoading(false); return }

      if (selectedAllergens.length > 0) {
        const { data: allergenData } = await supabase
          .from('allergens').select('id, code').in('code', selectedAllergens)

        const allergenIds = allergenData?.map((a) => a.id) || []

        const { data: conflicts } = await supabase
          .from('menu_item_allergens').select('menu_item_id').in('allergen_id', allergenIds)

        const conflictIds = new Set(conflicts?.map((c) => c.menu_item_id))
        setItems(allItems.filter((item) => !conflictIds.has(item.id)))
      } else {
        setItems(allItems)
      }

      setLoading(false)
    }

    fetchMenu()
  }, [language, selectedAllergens, diet])

  const toggleAllergen = (code: string) =>
    setSelectedAllergens(prev =>
      prev.includes(code) ? prev.filter(a => a !== code) : [...prev, code]
    )

  const categories = [...new Set(items.map((i) => i.category))]

  return (
    <main className="min-h-screen bg-neutral-950 text-white max-w-lg mx-auto font-[family-name:var(--font-geist-sans)]">

      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <button
          onClick={() => setShowPrefs(!showPrefs)}
          className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span className={`transition-transform duration-200 ${showPrefs ? 'rotate-45' : ''}`}>✦</span>
          {t.prefs}
          {selectedAllergens.length > 0 && (
            <span className="ml-1 bg-white text-neutral-950 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {selectedAllergens.length}
            </span>
          )}
        </button>
      </div>

      {/* Panel de preferencias */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div
            key="prefs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-neutral-800"
          >
            <div className="px-6 py-6 space-y-6 bg-neutral-900/60">

              {/* Idioma */}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Language</p>
                <div className="flex gap-2">
                  {(['de', 'en', 'es'] as Language[]).map((l) => (
                    <button key={l} onClick={() => setLanguage(l)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${language === l ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dieta */}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">{t.diet}</p>
                <div className="flex gap-2 flex-wrap">
                  {([
                    { value: 'none', label: t.all },
                    { value: 'vegetarian', label: '🥗 ' + t.vegetarian },
                    { value: 'vegan', label: '🌱 ' + t.vegan },
                  ] as { value: DietType; label: string }[]).map((d) => (
                    <button key={d.value} onClick={() => setDiet(d.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${diet === d.value ? 'bg-white text-neutral-950' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alérgenos */}
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">{t.allergens}</p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((a) => {
                    const active = selectedAllergens.includes(a.code)
                    const label = language === 'de' ? a.de : language === 'es' ? a.es : a.en
                    return (
                      <button
                        key={a.code}
                        onClick={() => toggleAllergen(a.code)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${active
                            ? 'bg-red-950 text-red-300 border border-red-800 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                            : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
                          }`}
                      >
                        <span className="text-sm leading-none">{a.icon}</span>
                        <span className="leading-none">{language === 'de' ? a.de : language === 'es' ? a.es : a.en}</span>
                        {active && <span className="text-red-400 leading-none ml-0.5">✕</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Resumen alérgenos activos */}
                {selectedAllergens.length > 0 && (
                  <p className="mt-3 text-xs text-neutral-500">
                    {language === 'es' && `Excluyendo ${selectedAllergens.length} alérgeno${selectedAllergens.length > 1 ? 's' : ''}`}
                    {language === 'en' && `Excluding ${selectedAllergens.length} allergen${selectedAllergens.length > 1 ? 's' : ''}`}
                    {language === 'de' && `${selectedAllergens.length} Allergen${selectedAllergens.length > 1 ? 'e' : ''} ausgeschlossen`}
                    {' · '}
                    <button
                      onClick={() => setSelectedAllergens([])}
                      className="text-neutral-400 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      {t.clear}
                    </button>
                  </p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido del menú */}
      <div className="px-6 py-6">
        {loading && (
          <p className="text-center text-neutral-500 text-sm mt-20 animate-pulse">
            {language === 'de' ? 'Lädt…' : language === 'es' ? 'Cargando…' : 'Loading…'}
          </p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-center text-neutral-500 text-sm mt-20">{t.empty}</p>
        )}

        {!loading && categories.map((category) => (
          <div key={category} className="mb-10">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">{category}</p>
            <div>
              {items.filter((item) => item.category === category).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="py-4 border-b border-neutral-800/50 flex justify-between items-start gap-6 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-white">{item[`name_${language}`]}</h3>
                      {item.is_vegan && (
                        <span className="text-xs bg-green-950 text-green-400 px-2 py-0.5 rounded-full font-normal">
                          {t.vegan}
                        </span>
                      )}
                      {!item.is_vegan && item.is_vegetarian && (
                        <span className="text-xs bg-lime-950 text-lime-400 px-2 py-0.5 rounded-full font-normal">
                          {t.vegetarian}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-500 text-sm mt-0.5 leading-relaxed">
                      {item[`description_${language}`]}
                    </p>
                  </div>
                  <span className="text-white font-medium whitespace-nowrap">{item.price.toFixed(2)} €</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
