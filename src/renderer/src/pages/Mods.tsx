import { useState } from 'react'

export default function Mods() {
  const [tab, setTab] = useState<'mods'|'resourcepacks'>('mods')
  
  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-3xl font-bold mb-2">Add-ons</h1>
      <p className="text-gray-400 mb-6">Download Mods and Resource Packs directly from Modrinth.</p>
      
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('mods')} className={`px-6 py-2 rounded-xl font-medium transition ${tab === 'mods' ? 'bg-dawn-accent text-black' : 'bg-dawn-card text-gray-400'}`}>Mods</button>
        <button onClick={() => setTab('resourcepacks')} className={`px-6 py-2 rounded-xl font-medium transition ${tab === 'resourcepacks' ? 'bg-dawn-accent text-black' : 'bg-dawn-card text-gray-400'}`}>Resource Packs</button>
      </div>

      <div className="bg-dawn-card rounded-2xl p-6 border border-white/5 flex-1 flex flex-col items-center justify-center">
        <span className="text-5xl mb-4">{tab === 'mods' ? '🧩' : '🎨'}</span>
        <h2 className="text-xl font-bold mb-2">Modrinth Integration</h2>
        <p className="text-gray-400 text-center max-w-md">Search, download, and automatically install {tab === 'mods' ? 'Mods' : 'Resource Packs'} into your active profile.</p>
        <p className="text-sm text-dawn-accent mt-4">(API Integration Coming in Phase 3)</p>
      </div>
    </div>
  )
}
