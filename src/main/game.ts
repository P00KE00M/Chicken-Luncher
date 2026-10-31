import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { downloadFile, extractNatives } from './downloader'

const MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'

export async function getVersions() {
  const { data } = await axios.get(MANIFEST_URL)
  return data.versions
}

export async function launchOfflineGame(versionId: string, username: string, gameDir: string) {
  // 1. Fetch manifest
  const { data: manifest } = await axios.get(MANIFEST_URL)
  const versionData = manifest.versions.find((v: any) => v.id === versionId)
  if (!versionData) throw new Error('Version not found')

  // 2. Fetch version JSON
  const { data: versionJson } = await axios.get(versionData.url)
  const clientJarUrl = versionJson.downloads.client.url
  const clientJarPath = path.join(gameDir, 'versions', versionId, `${versionId}.jar`)
  
  console.log('Downloading Client JAR...')
  await downloadFile(clientJarUrl, clientJarPath, versionJson.downloads.client.sha1)

  // 3. Download Libraries
  const libsDir = path.join(gameDir, 'libraries')
  const classpath: string[] = []
  const nativesDir = path.join(gameDir, 'versions', versionId, 'natives')
  fs.mkdirSync(nativesDir, { recursive: true })

  console.log('Downloading Libraries...')
  for (const lib of versionJson.libraries) {
    if (lib.downloads?.artifact) {
      const libPath = path.join(libsDir, lib.downloads.artifact.path)
      await downloadFile(lib.downloads.artifact.url, libPath, lib.downloads.artifact.sha1)
      classpath.push(libPath)
    }
    if (lib.downloads?.classifiers?.['natives-linux']) {
      const native = lib.downloads.classifiers['natives-linux']
      const nativePath = path.join(libsDir, native.path)
      await downloadFile(native.url, nativePath, native.sha1)
      extractNatives(nativePath, nativesDir)
    }
  }
  classpath.push(clientJarPath)

  // 4. Build Arguments
  const cpString = classpath.join(':')
  const args = [
    `-Djava.library.path=${nativesDir}`,
    '-cp', cpString,
    versionJson.mainClass,
    '--username', username,
    '--version', versionId,
    '--gameDir', gameDir,
    '--assetsDir', path.join(gameDir, 'assets'),
    '--assetIndex', versionJson.assetIndex.id,
    '--uuid', '00000000000000000000000000000000',
    '--accessToken', 'offline_token',
    '--userType', 'legacy'
  ]

  console.log('Launching Minecraft...')
  const child = spawn('java', args, { cwd: gameDir, stdio: 'inherit' })
  
  child.on('error', (err) => console.error('Failed to start Java. Is Java installed?', err))
  return child.pid
}
