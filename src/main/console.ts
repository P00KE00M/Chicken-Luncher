import { BrowserWindow } from 'electron'

export function logToConsole(win: BrowserWindow, msg: string) {
  if (win && !win.isDestroyed()) {
    win.webContents.send('console:log', msg)
  }
}
