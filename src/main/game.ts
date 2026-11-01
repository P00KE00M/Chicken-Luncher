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

async function downloadAssets(assetIndexUrl: string, gameDir: string, log: (m:string)=>void) {
  log('Checking assets (this may skip if already downloaded)...')
  const { data: assetIndex } = await axios.get(assetIndexUrl)
  const assetsDir = path.join(gameDir, 'assets')
  fs.mkdirSync(path.join(assetsDir, 'indexes'), { recursive: true })
  fs.mkdirSync(path.join(assetsDir, 'objects'), { recursive: true })

  let downloaded = 0
  let skipped = 0

  const assetPromises = Object.values(assetIndex.objects).map(async (obj: any) => {
    const hash = obj.hash
    const subDir = hash.substring(0, 2)
    const url = `${RESOURCES_URL}/${subDir}/${hash}`
    const dest = path.join(assetsDir, 'objects', subDir, hash)
    
    if (fs.existsSync(dest)) {
      skipped++
    } else {
      await downloadFile(url, dest, hash)
      downloaded++
      if (downloaded % 100 === 0) log(`Downloaded ${downloaded} new assets...`)
    }
  })
  
  for (let i = 0; i < assetPromises.length; i += 50) {
    await Promise.all(assetPromises.slice(i, i + 50))
  }
  log(`Assets ready. (Skipped ${skipped} existing, Downloaded ${downloaded} new)`)
}

export async function launchOfflineGame(versionId: string, username: string, gameDir: string, log: (m:string)=>void) {
  const { data: manifest } = await axios.get(MANIFEST_URL)
  const versionData = manifest.versions.find((v: any) => v.id === versionId)
  if (!versionData) throw new Error('Version not found')

  const { data: versionJson } = await axios.get(versionData.url)
  
  // 1. Check & Download Assets
  await downloadAssets(versionJson.assetIndex.url, gameDir, log)

  // 2. Check & Download Client JAR
  const clientJarUrl = versionJson.downloads.client.url
  const clientJarPath = path.join(gameDir, 'versions', versionId, `${versionId}.jar`)
  
  if (fs.existsSync(clientJarPath)) {
    log('Client JAR already exists. Skipping download.')
  } else {
    log('Downloading Client JAR...')
    await downloadFile(clientJarUrl, clientJarPath, versionJson.downloads.client.sha1)
  }

  // 3. Check & Download Libraries
  const libsDir = path.join(gameDir, 'libraries')
  const classpath: string[] = []
  const nativesDir = path.join(gameDir, 'versions', versionId, 'natives')
  fs.mkdirSync(nativesDir, { recursive: true })

  log('Checking Libraries...')
  for (const lib of versionJson.libraries) {
    if (lib.downloads?.artifact) {
      const libPath = path.join(libsDir, lib.downloads.artifact.path)
      if (!fs.existsSync(libPath)) {
        await downloadFile(lib.downloads.artifact.url, libPath, lib.downloads.artifact.sha1)
      }
      classpath.push(libPath)
    }
    
    const nativeKey = process.platform === 'win32' ? 'natives-windows' : 'natives-linux'
    if (lib.downloads?.classifiers?.[nativeKey]) {
      const native = lib.downloads.classifiers[nativeKey]
      const nativePath = path.join(libsDir, native.path)
      if (!fs.existsSync(nativePath)) {
        await downloadFile(native.url, nativePath, native.sha1)
        extractNatives(nativePath, nativesDir)
      }
    }
  }
  classpath.push(clientJarPath)

  log('All files are ready!')
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

  log('Launching Minecraft...')
  const child = spawn('java', args, { cwd: gameDir })
  
  child.stdout.on('data', (data) => log(data.toString().trim()))
  child.stderr.on('data', (data) => log(data.toString().trim()))
  child.on('error', (err) => log('Java Error: ' + err.message))

  return child.pid
}
