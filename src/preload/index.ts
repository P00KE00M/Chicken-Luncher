import { contextBridge, ipcRenderer } from 'electron'
const api = {
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPlatform: () => ipcRenderer.invoke('app:get-platform'),
  getVersions: () => ipcRenderer.invoke('game:get-versions'),
  launch: (version: string, username: string) => ipcRenderer.invoke('game:launch', version, username),
  getProfiles: () => ipcRenderer.invoke('profiles:get'),
  createProfile: (name: string, user: string, ver: string) => ipcRenderer.invoke('profiles:create', name, user, ver),
  deleteProfile: (id: string) => ipcRenderer.invoke('profiles:delete', id),
  onConsoleLog: (callback: (msg: string) => void) => ipcRenderer.on('console:log', (_, msg) => callback(msg))
}
if (process.contextIsolated) contextBridge.exposeInMainWorld('api', api)
