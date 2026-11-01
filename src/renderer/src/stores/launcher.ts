import { create } from 'zustand'
interface S {
  username: string; version: string
  setUsername: (n: string) => void; setVersion: (v: string) => void
}
export const useLauncherStore = create<S>((set) => ({
  username: 'Player', version: '1.21.4',
  setUsername: (username) => set({ username }),
  setVersion: (version) => set({ version })
}))
