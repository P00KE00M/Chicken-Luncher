import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { initDatabase } from './database'
import { getVersions, launchOfflineGame } from './game'
import { getProfiles, createProfile, deleteProfile, saveProfile } from './profiles'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 1024, minHeight: 700,
    show: false, autoHideMenuBar: true, backgroundColor: '#0F1115',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, contextIsolation: true, nodeIntegration: false
    }
  })
  mainWindow.on('ready-to-show', () => mainWindow?.show())
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  initDatabase()
  
  // App IPC
  ipcMain.handle('app:get-version', () => app.getVersion())
  ipcMain.handle('app:get-platform', () => process.platform)
  
  // Profile IPC
  ipcMain.handle('profiles:get', () => getProfiles())
  ipcMain.handle('profiles:create', (_, name, user, ver) => createProfile(name, user, ver))
  ipcMain.handle('profiles:delete', (_, id) => deleteProfile(id))
  ipcMain.handle('profiles:save', (_, p) => saveProfile(p))
  
  // Game IPC
  ipcMain.handle('game:get-versions', async () => await getVersions())
  ipcMain.handle('game:launch', async (event, ver, user) => {
    const gameDir = join(app.getPath('userData'), 'minecraft')
    // Redirect stdout/stderr to renderer
    const log = (msg: string) => event.sender.send('console:log', msg)
    return await launchOfflineGame(ver, user, gameDir, log)
  })
  
  createWindow()
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
