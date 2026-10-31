import { Link } from 'react-router-dom'
export default function Settings() {
  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-bg-secondary border-r border-white/5 p-3">
        <Link to="/" className="block px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5">Home</Link>
        <Link to="/settings" className="block px-4 py-2.5 rounded-lg text-sm bg-chicken-yellow/10 text-chicken-yellow">Settings</Link>
      </aside>
      <main className="flex-1 bg-bg-base p-8">
        <h1 className="text-2xl font-bold text-white/90 mb-6">Settings</h1>
        <div className="max-w-lg space-y-4">
          <div className="bg-bg-card rounded-xl p-5 border border-white/5">
            <h2 className="text-sm font-semibold text-chicken-yellow mb-3">Java Path</h2>
            <p className="text-xs text-gray-500">Phase 2.</p>
          </div>
          <div className="bg-bg-card rounded-xl p-5 border border-white/5">
            <h2 className="text-sm font-semibold text-chicken-yellow mb-3">Memory</h2>
            <p className="text-xs text-gray-500">Phase 2.</p>
          </div>
          <div className="bg-bg-card rounded-xl p-5 border border-white/5">
            <h2 className="text-sm font-semibold text-chicken-yellow mb-3">Authentication</h2>
            <p className="text-xs text-gray-500">Phase 2. No fake login shown.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
