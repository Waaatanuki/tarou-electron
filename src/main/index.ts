import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, session, shell, WebContentsView } from 'electron'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true, // 必须启用
      nodeIntegration: true, // 推荐启用
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    console.log('loadFiledev')
    console.log(process.env.ELECTRON_RENDERER_URL)
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    console.log('loadFile')

    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const view = new WebContentsView()
  mainWindow.contentView.addChildView(view)

  const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  view.webContents.setUserAgent(mobileUserAgent)

  view.webContents.loadURL('https://gbf.game.mbga.jp')
  view.setBounds({ x: 0, y: 0, width: 500, height: 540 })

  try {
    view.webContents.debugger.attach('1.3')
  }
  catch (err) {
    console.log('Debugger attach failed : ', err)
  }

  view.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to : ', reason)
  })

  async function getResponse(requestId: string, cb: (resp: any) => void) {
    let count = 0
    let resp: any

    const go = setInterval(async () => {
      if (count > 100) {
        clearInterval(go)
        return
      }
      if (resp) {
        clearInterval(go)
        try {
          cb(JSON.parse(resp.body))
        }
        catch (error) {
          console.log(error)
        }
        return
      }
      try {
        count++
        resp = await view.webContents.debugger.sendCommand('Network.getResponseBody', { requestId })
      }
      catch (error) {
        console.log(error)
      }
    }, 100)
  }

  view.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      if (params.response.url.includes('/weapon/list')) {
        getResponse(params.requestId, (resp) => {
          mainWindow.webContents.send('resp', resp)
        })
      }
    }
  })

  view.webContents.debugger.sendCommand('Network.enable')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
