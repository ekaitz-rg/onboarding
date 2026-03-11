import { supabase } from './lib/supabase'

export default async function Home() {
  const { data: allergens, error } = await supabase
    .from('allergens')
    .select('*')

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Alérgenos cargados desde Supabase:</h1>
      <ul className="space-y-2">
        {allergens.map((a) => (
          <li key={a.id} className="flex gap-2">
            <span>{a.icon}</span>
            <span>{a.label_es}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
