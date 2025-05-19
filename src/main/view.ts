import type { BrowserWindow } from 'electron'
import { ipcMain, Menu, MenuItem, WebContentsView } from 'electron'
import { getConf } from './conf'

export function createWebView(mainWindow: BrowserWindow) {
  const conf = getConf()
  const webContentsViewConfig = conf.get('webContentsView')

  const view = new WebContentsView()
  mainWindow.contentView.addChildView(view)

  const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  view.webContents.setUserAgent(mobileUserAgent)

  view.webContents.loadURL('https://gbf.game.mbga.jp')

  const bounds = { ...webContentsViewConfig.bounds }
  const [contentWidth, contentHeight] = mainWindow.getContentSize()
  bounds.height = contentHeight

  setViewSize(view, bounds)

  // 添加右键菜单处理
  view.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()

    // 添加菜单项
    menu.append(new MenuItem({
      label: '刷新',
      click: () => view.webContents.reload(),
    }))

    menu.append(new MenuItem({
      label: '开发者工具',
      click: () => view.webContents.openDevTools(),
    }))

    menu.popup()
  })

  mainWindow.on('resize', () => {
    const [contentWidth, contentHeight] = mainWindow.getContentSize()
    bounds.height = contentHeight
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  mainWindow.on('resized', () => {
    const bounds = mainWindow.getBounds()
    const [contentWidth, contentHeight] = mainWindow.getContentSize()
    conf.set('browserWindow', { width: bounds.width, height: bounds.height })
    conf.set('webContentsView.bounds.height', contentHeight)
  })

  ipcMain.on('show-bookmark-menu', (event, { x, y, index }) => {
    const menu = Menu.buildFromTemplate([
      {
        label: '删除书签',
        click: () => {
          event.sender.send('delete-bookmark', index)
        },
      },
    ])

    menu.popup({ x, y })
  })

  ipcMain.handle('add-bookmark', async () => {
    return view.webContents.getURL()
  })

  ipcMain.on('toggle-mode', (event, mode) => {
    bounds.x = mode ? 30 : 100
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  ipcMain.on('resize-webcontents', (event, width) => {
    bounds.width = width
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  view.webContents.debugger.attach('1.3')
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
  })

  return view
}

function setViewSize(view: WebContentsView, bounds: { width: number, height: number, x: number, y: number }) {
  view.setBounds(bounds)

  view.webContents.enableDeviceEmulation({
    screenPosition: 'mobile',
    screenSize: { width: bounds.width, height: bounds.height },
    viewPosition: { x: bounds.x, y: bounds.y },
    deviceScaleFactor: 1,
    viewSize: { width: bounds.width, height: bounds.height },
    scale: 1,
  })
}
