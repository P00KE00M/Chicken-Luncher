import { contextBridge, ipcRenderer } from 'electron'
const api = {
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
  getPlatform: (): Promise<string> => ipcRenderer.invoke('app:get-platform'),
  getVersions: (): Promise<any[]> => ipcRenderer.invoke('game:get-versions'),
  launch: (version: string, username: string): Promise<number> => ipcRenderer.invoke('game:launch', version, username)
}
if (process.contextIsolated) contextBridge.exposeInMainWorld('api', api)
export type Api = typeof api
