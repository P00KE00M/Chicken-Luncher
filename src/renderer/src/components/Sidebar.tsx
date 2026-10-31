import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const navs = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Mods', path: '/mods', icon: '🧩' },
    { name: 'Console', path: '/console', icon: '🖥️' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ]
  return (
    <aside className="w-64 bg-dawn-sidebar border-r border-white/5 flex flex-col items-center py-6">
      <div className="flex items-center gap-3 mb-10 px-6 w-full">
        <div className="w-10 h-10 rounded-xl bg-dawn-accent flex items-center justify-center text-xl shadow-glow">🐔</div>
        <div>
          <h1 className="font-bold text-white tracking-wide">CHICKEN</h1>
          <p className="text-xs text-gray-500">Launcher</p>
        </div>
      </div>
      <nav className="flex-1 w-full px-4 space-y-2">
        {navs.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-dawn-accent/10 text-dawn-accent font-semibold shadow-sm' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
              <span className="text-lg">{item.icon}</span>{item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
