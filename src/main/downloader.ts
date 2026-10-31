import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
// @ts-ignore (រំលង Type check ព្រោះយើងលុប @types ចេញ)
import AdmZip from 'adm-zip'

export async function downloadFile(url: string, dest: string, sha1?: string): Promise<void> {
  if (fs.existsSync(dest) && sha1) {
    const hash = crypto.createHash('sha1').update(fs.readFileSync(dest)).digest('hex')
    if (hash === sha1) return // Already downloaded and valid
  }
  
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const response = await axios({ url, method: 'GET', responseType: 'stream' })
  const writer = fs.createWriteStream(dest)
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export function extractNatives(jarPath: string, extractTo: string): void {
  const zip = new AdmZip(jarPath)
  fs.mkdirSync(extractTo, { recursive: true })
  zip.extractAllTo(extractTo, true)
}
