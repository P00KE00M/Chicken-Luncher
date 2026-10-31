import { useEffect, useState } from 'react'
import { useLauncherStore } from '../stores/launcher'

export default function Home() {
  const { username, setUsername } = useLauncherStore()
  const [versions, setVersions] = useState<{id: string}[]>([])
  const [selectedVersion, setSelectedVersion] = useState('1.21.4')
  const [status, setStatus] = useState('Idle')

  useEffect(() => {
    if (window.api) {
      window.api.getVersions().then(v => setVersions(v)).catch(console.error)
    }
  }, [])

  const handlePlay = async () => {
    if (!username) return alert('Please enter a username (Offline Profile)')
    setStatus('Downloading & Launching... (Check console)')
    try {
      await window.api.launch(selectedVersion, username)
      setStatus('Launched!')
    } catch (e: any) {
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <div className="flex flex-col h-full p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {username}!</h1>
          <p className="text-gray-400 text-sm">Ready to jump into the game?</p>
        </div>
        
        {/* User Profile Card */}
        <div className="flex items-center gap-4 bg-dawn-card/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dawn-accent to-yellow-600 flex items-center justify-center text-xl shadow-glow">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-0.5">Offline Profile</span>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white outline-none w-32 placeholder-gray-500" 
              placeholder="Enter Name" 
            />
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-dawn-card/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none">🐔</div>
          
          <div className="text-7xl mb-6 drop-shadow-2xl">🐔</div>
          
          <button 
            onClick={handlePlay}
            className="w-full h-16 rounded-2xl bg-dawn-accent hover:bg-dawn-accentHover text-black font-extrabold text-xl tracking-wide
                       transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-glow flex items-center justify-center gap-2"
          >
            PLAY NOW
          </button>
          
          <div className="mt-6 w-full space-y-3">
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5">
              <span className="text-sm text-gray-400 font-medium">Game Version</span>
              <select 
                value={selectedVersion} 
                onChange={e => setSelectedVersion(e.target.value)}
                className="bg-dawn-sidebar text-sm font-semibold text-dawn-accent outline-none px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer"
              >
                {versions.length === 0 && <option>Loading...</option>}
                {versions.map(v => (
                  <option key={v.id} value={v.id}>{v.id}</option>
                ))}
              </select>
            </div>
            
            <p className="text-center text-xs font-medium text-dawn-accent/80 min-h-[20px]">{status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
