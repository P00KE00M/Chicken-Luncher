import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { initDatabase } from './database'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280, height: 800, minWidth: 1024, minHeight: 700,
    show: false, autoHideMenuBar: true, backgroundColor: '#090A0D',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, contextIsolation: true, nodeIntegration: false
    }
  })
  win.on('ready-to-show', () => win.show())
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  initDatabase()
  ipcMain.handle('app:get-version', () => app.getVersion())
  ipcMain.handle('app:get-platform', () => process.platform)
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
