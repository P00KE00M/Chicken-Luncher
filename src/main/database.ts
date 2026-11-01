// Platform-conditional storage:
// - On desktop (Win/Linux/macOS): uses better-sqlite3 when available.
// - On Termux or if native module is missing: JSON file fallback.
import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

type Store = { get: (k: string) => string | null; set: (k: string, v: string) => void }
let store: Store | null = null

function jsonFallback(): Store {
  const dir = app.getPath('userData')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const file = join(dir, 'chicken-launcher.json')
  const read = (): Record<string, string> => {
    try { return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {} }
    catch { return {} }
  }
  return {
    get: (k) => read()[k] ?? null,
    set: (k, v) => { const d = read(); d[k] = v; writeFileSync(file, JSON.stringify(d)) }
  }
}

export function initDatabase(): Store {
  if (store) return store
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require('better-sqlite3')
    const db = new Database(join(app.getPath('userData'), 'chicken-launcher.db'))
    db.pragma('journal_mode = WAL')
    db.exec(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
             CREATE TABLE IF NOT EXISTS versions (id TEXT PRIMARY KEY, name TEXT NOT NULL, installed INTEGER DEFAULT 0);`)
    store = {
      get: (k) => {
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(k) as { value?: string } | undefined
        return row?.value ?? null
      },
      set: (k, v) => {
        db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(k, v)
      }
    }
  } catch {
    store = jsonFallback()
  }
  return store
}
