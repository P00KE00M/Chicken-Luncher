import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLauncherStore } from '../stores/launcher'

export default function Home() {
  const { username, version, setUsername, setVersion } = useLauncherStore()
  const [platform, setPlatform] = useState('')
  const [appVersion, setAppVersion] = useState('')
  useEffect(() => {
    if (window.api) {
      window.api.getPlatform().then(setPlatform).catch(() => {})
      window.api.getVersion().then(setAppVersion).catch(() => {})
    }
  }, [])
  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-bg-secondary border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <span className="text-2xl">🐔</span>
          <span className="font-bold text-chicken-yellow text-sm">CHICKEN</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link to="/" className="block px-4 py-2.5 rounded-lg text-sm bg-chicken-yellow/10 text-chicken-yellow font-medium">Home</Link>
          <Link to="/settings" className="block px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5">Settings</Link>
        </nav>
        <div className="p-4 border-t border-white/5 text-xs text-gray-600">
          <div>v{appVersion || '0.1.0'}</div><div>{platform || '—'}</div>
        </div>
      </aside>
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-secondary to-[#0a0b10]" />
        <div className="relative z-10 flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-auto">
            <h1 className="text-2xl font-bold text-white/90">Welcome back</h1>
            <div className="flex items-center gap-3 bg-bg-card/60 rounded-xl px-4 py-2 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-chicken-yellow/20 flex items-center justify-center">👤</div>
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="bg-transparent text-sm text-white/80 outline-none w-32" placeholder="Username" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 -mt-8">
            <div className="text-6xl mb-4">🐔</div>
            <button className="w-64 h-16 rounded-2xl bg-chicken-yellow text-black font-bold text-lg
              hover:bg-chicken-gold active:scale-95 transition-all shadow-lg shadow-chicken-yellow/20"
              onClick={() => console.log('Phase 2 required for real launch.')}>PLAY</button>
            <div className="mt-6 flex items-center gap-2 bg-bg-card/60 rounded-lg px-4 py-2 border border-white/5">
              <span className="text-xs text-gray-500">Version:</span>
              <select value={version} onChange={e => setVersion(e.target.value)}
                className="bg-transparent text-sm text-chicken-yellow outline-none">
                <option value="1.21.4">1.21.4</option>
                <option value="1.21.1">1.21.1</option>
                <option value="1.20.4">1.20.4</option>
                <option value="1.20.1">1.20.1</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
