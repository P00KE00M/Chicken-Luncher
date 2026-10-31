import { useEffect, useState } from 'react'

export default function Home() {
  const [versions, setVersions] = useState<{id: string}[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [activeProfile, setActiveProfile] = useState<any>(null)
  const [status, setStatus] = useState('Idle')
  
  // Profile Creation States
  const [newProfileName, setNewProfileName] = useState('')
  const [newProfileUser, setNewProfileUser] = useState('')
  const [newProfileVer, setNewProfileVer] = useState('1.21.4')

  useEffect(() => {
    if (window.api) {
      window.api.getVersions().then(setVersions).catch(console.error)
      window.api.getProfiles().then(p => {
        setProfiles(p)
        if (p.length > 0) setActiveProfile(p[0])
      })
    }
  }, [])

  const handleCreate = async () => {
    if (!newProfileName || !newProfileUser) return alert('Fill all fields')
    const p = await window.api.createProfile(newProfileName, newProfileUser, newProfileVer)
    setProfiles([...profiles, p])
    setActiveProfile(p)
    setNewProfileName('')
    setNewProfileUser('')
  }

  const handleDelete = async () => {
    if (!activeProfile) return
    await window.api.deleteProfile(activeProfile.id)
    const updated = profiles.filter(p => p.id !== activeProfile.id)
    setProfiles(updated)
    setActiveProfile(updated[0] || null)
  }

  const handlePlay = async () => {
    if (!activeProfile) return alert('Create a profile first!')
    setStatus('Launching...')
    try {
      await window.api.launch(activeProfile.version, activeProfile.username)
      setStatus('Game running! Check Console.')
    } catch (e: any) {
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profiles</h1>
        <div className="flex gap-2">
          <button onClick={handleDelete} disabled={!activeProfile} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 transition">Delete Profile</button>
          <button className="bg-dawn-card px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition">Edit Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 flex-1">
        {/* Left: Profiles List & Create */}
        <div className="col-span-1 space-y-4">
          <div className="bg-dawn-card/60 p-4 rounded-2xl border border-white/5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400">Create New Profile</h2>
            <input placeholder="Profile Name (e.g. Survival)" value={newProfileName} onChange={e => setNewProfileName(e.target.value)} className="w-full bg-black/20 p-3 rounded-xl outline-none border border-white/5 text-sm" />
            <input placeholder="Minecraft Username" value={newProfileUser} onChange={e => setNewProfileUser(e.target.value)} className="w-full bg-black/20 p-3 rounded-xl outline-none border border-white/5 text-sm" />
            <select value={newProfileVer} onChange={e => setNewProfileVer(e.target.value)} className="w-full bg-black/20 p-3 rounded-xl outline-none border border-white/5 text-sm">
              {versions.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
            </select>
            <button onClick={handleCreate} className="w-full bg-dawn-accent text-black font-bold p-3 rounded-xl hover:bg-dawn-accentHover transition">Create Profile</button>
          </div>

          <div className="space-y-2">
            {profiles.map(p => (
              <div key={p.id} onClick={() => setActiveProfile(p)} className={`p-4 rounded-2xl cursor-pointer border transition ${activeProfile?.id === p.id ? 'bg-dawn-accent/10 border-dawn-accent/50' : 'bg-dawn-card border-white/5 hover:border-white/20'}`}>
                <h3 className="font-bold text-white">{p.name}</h3>
                <p className="text-xs text-gray-400">{p.username} • {p.version}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Play Area */}
        <div className="col-span-2 flex flex-col items-center justify-center bg-dawn-card/40 rounded-3xl border border-white/5 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none">🐔</div>
           <div className="text-7xl mb-6">🐔</div>
           <h2 className="text-2xl font-bold mb-2">{activeProfile ? activeProfile.name : 'No Profile Selected'}</h2>
           <p className="text-gray-400 mb-8">{activeProfile ? `Playing as ${activeProfile.username} on ${activeProfile.version}` : 'Create a profile to start'}</p>
           <button onClick={handlePlay} disabled={!activeProfile} className="w-72 h-16 rounded-2xl bg-dawn-accent text-black font-extrabold text-xl hover:bg-dawn-accentHover transition transform hover:scale-105 disabled:opacity-50 shadow-glow">PLAY</button>
           <p className="mt-4 text-sm text-dawn-accent">{status}</p>
        </div>
      </div>
    </div>
  )
}
