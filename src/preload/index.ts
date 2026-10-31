import { contextBridge, ipcRenderer } from 'electron'
const api = {
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
  getPlatform: (): Promise<string> => ipcRenderer.invoke('app:get-platform')
}
if (process.contextIsolated) contextBridge.exposeInMainWorld('api', api)
export type Api = typeof api
