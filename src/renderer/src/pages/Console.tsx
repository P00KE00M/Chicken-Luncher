import { useEffect, useState, useRef } from 'react'

export default function Console() {
  const [logs, setLogs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.api) {
      window.api.onConsoleLog((msg) => {
        setLogs(prev => [...prev, msg])
      })
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="flex flex-col h-full p-8">
      <h1 className="text-3xl font-bold mb-6">Game Console</h1>
      <div className="flex-1 bg-black/80 rounded-2xl border border-white/10 p-4 font-mono text-sm overflow-y-auto text-green-400">
        {logs.length === 0 && <p className="text-gray-500">Waiting for game launch...</p>}
        {logs.map((log, i) => <div key={i}>{log}</div>)}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
