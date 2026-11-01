export interface Api {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getVersions: () => Promise<{ id: string, type: string }[]>
  launch: (version: string, username: string) => Promise<number>
  getProfiles: () => Promise<any[]>
  createProfile: (name: string, user: string, ver: string) => Promise<any>
  deleteProfile: (id: string) => Promise<void>
  onConsoleLog: (callback: (msg: string) => void) => void
}
declare global { interface Window { api: Api } }
export {}
