export interface Api {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  getVersions: () => Promise<{ id: string, type: string, url: string }[]>
  launch: (version: string, username: string) => Promise<number>
}
declare global { interface Window { api: Api } }
export {}
