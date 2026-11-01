export default function Settings() {
  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      <div className="grid gap-6 max-w-3xl">
        <div className="bg-dawn-card p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold text-dawn-accent mb-2">Java Path</h2>
          <p className="text-sm text-gray-400">Auto-detected. You can manually set it later.</p>
        </div>
        <div className="bg-dawn-card p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold text-dawn-accent mb-2">Memory Allocation</h2>
          <p className="text-sm text-gray-400">Default: 2GB. Adjustable in Phase 2.</p>
        </div>
        <div className="bg-dawn-card p-6 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold text-dawn-accent mb-2">Microsoft Login</h2>
          <p className="text-sm text-gray-400">Secure login to play on public servers (Coming in Phase 2).</p>
        </div>
      </div>
    </div>
  )
}
