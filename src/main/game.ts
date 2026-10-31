import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { downloadFile, extractNatives } from './downloader'

const MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
const RESOURCES_URL = 'https://resources.download.minecraft.net'

export async function getVersions() {
  const { data } = await axios.get(MANIFEST_URL)
  return data.versions
}

async function downloadAssets(assetIndexUrl: string, gameDir: string) {
  console.log('Fetching asset index...')
  const { data: assetIndex } = await axios.get(assetIndexUrl)
  const assetsDir = path.join(gameDir, 'assets')
  fs.mkdirSync(path.join(assetsDir, 'indexes'), { recursive: true })
  fs.mkdirSync(path.join(assetsDir, 'objects'), { recursive: true })

  const assetPromises = Object.values(assetIndex.objects).map(async (obj: any) => {
    const hash = obj.hash
    const subDir = hash.substring(0, 2)
    const url = `${RESOURCES_URL}/${subDir}/${hash}`
    const dest = path.join(assetsDir, 'objects', subDir, hash)
    await downloadFile(url, dest, hash)
  })
  
  console.log(`Downloading ${assetPromises.length} assets... (This may take a while)`)
  // Download in batches to avoid rate limits
  for (let i = 0; i < assetPromises.length; i += 50) {
    await Promise.all(assetPromises.slice(i, i + 50))
  }
}

export async function launchOfflineGame(versionId: string, username: string, gameDir: string) {
  const { data: manifest } = await axios.get(MANIFEST_URL)
  const versionData = manifest.versions.find((v: any) => v.id === versionId)
  if (!versionData) throw new Error('Version not found')

  const { data: versionJson } = await axios.get(versionData.url)
  
  // Download Assets
  await downloadAssets(versionJson.assetIndex.url, gameDir)

  // Download Client JAR
  const clientJarUrl = versionJson.downloads.client.url
  const clientJarPath = path.join(gameDir, 'versions', versionId, `${versionId}.jar`)
  console.log('Downloading Client JAR...')
  await downloadFile(clientJarUrl, clientJarPath, versionJson.downloads.client.sha1)

  // Download Libraries & Natives
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
    if (lib.downloads?.classifiers?.['natives-windows'] && process.platform === 'win32') {
      const native = lib.downloads.classifiers['natives-windows']
      const nativePath = path.join(libsDir, native.path)
      await downloadFile(native.url, nativePath, native.sha1)
      extractNatives(nativePath, nativesDir)
    } else if (lib.downloads?.classifiers?.['natives-linux'] && process.platform === 'linux') {
      const native = lib.downloads.classifiers['natives-linux']
      const nativePath = path.join(libsDir, native.path)
      await downloadFile(native.url, nativePath, native.sha1)
      extractNatives(nativePath, nativesDir)
    }
  }
  classpath.push(clientJarPath)

  // Build Arguments
  const cpString = classpath.join(process.platform === 'win32' ? ';' : ':')
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
    '--userType', 'legacy',
    '--versionType', 'release'
  ]

  console.log('Launching Minecraft...')
  const child = spawn('java', args, { cwd: gameDir, stdio: 'inherit' })
  child.on('error', (err) => console.error('Failed to start Java. Please install Java 17+ on your PC!', err))
  return child.pid
}
