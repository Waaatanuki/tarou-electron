import type { BrowserWindow } from 'electron'
import { ipcMain, WebContentsView } from 'electron'
import { loadViewSize, saveViewSize } from './utils/storage'

export function createWebView(mainWindow: BrowserWindow) {
  const [contentWidth, contentHeight] = mainWindow.getContentSize()
  const view = new WebContentsView()
  mainWindow.contentView.addChildView(view)

  const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  view.webContents.setUserAgent(mobileUserAgent)

  const viewSize = loadViewSize()
  viewSize.height = contentHeight
  view.webContents.loadURL('https://gbf.game.mbga.jp')

  view.setBounds({ x: 0, y: 0, width: viewSize.width, height: viewSize.height })

  view.webContents.enableDeviceEmulation({
    screenPosition: 'mobile',
    screenSize: viewSize,
    viewPosition: { x: 0, y: 0 },
    deviceScaleFactor: 1,
    viewSize,
    scale: 1,
  })

  ipcMain.on('resize-webcontents', (event, width) => {
    viewSize.width = width

    view.setBounds({ x: 0, y: 0, ...viewSize })
    // view.webContents.insertCSS(`
    //   html {
    //     zoom: ${viewSize.width / 320};
    //   }
    // `)
  })

  ipcMain.handle('get-view-size', () => {
    return viewSize
  })

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

  view.webContents.on('did-finish-load', () => {
    console.log('================did-finish-load=====================')
    view.webContents.openDevTools()

    // view.webContents.insertCSS(`
    //   html {
    //     zoom: ${viewSize.width / 320};
    //   }
    // `)
  })

  return view
}
