export interface Api {
  getVersion: () => Promise<string>
  getPlatform: () => Promise<string>
}
declare global { interface Window { api: Api } }
export {}
