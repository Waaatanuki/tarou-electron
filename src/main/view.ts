import type { BrowserWindow } from 'electron'
import { ipcMain, Menu, MenuItem, shell, WebContentsView } from 'electron'
import { getConf } from './module/conf'
import { setupDebugger } from './module/debugger'
import { setupProxy } from './module/proxy'

export function createWebView(mainWindow: BrowserWindow) {
  const conf = getConf()
  const webContentsViewConfig = conf.get('webContentsView')
  const proxyConfig = conf.get('proxy')

  const view = new WebContentsView()
  const session = view.webContents.session

  setupProxy(session, proxyConfig)

  mainWindow.contentView.addChildView(view)

  const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  view.webContents.setUserAgent(mobileUserAgent)
  view.webContents.loadURL('https://gbf.game.mbga.jp')

  const bounds = { ...webContentsViewConfig.bounds }
  const [contentWidth, contentHeight] = mainWindow.getContentSize()
  bounds.height = contentHeight

  setViewSize(view, bounds)
  setupDebugger(mainWindow, view)

  mainWindow.on('resize', () => {
    const [contentWidth, contentHeight] = mainWindow.getContentSize()
    bounds.height = contentHeight
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  mainWindow.on('resized', () => {
    const windowBbounds = mainWindow.getBounds()
    const [contentWidth, contentHeight] = mainWindow.getContentSize()
    conf.set('browserWindow', { width: windowBbounds.width, height: windowBbounds.height })
    conf.set('webContentsView.bounds.height', contentHeight)
    mainWindow.webContents.send('window-resized', { width: bounds.width, height: contentHeight })
  })

  ipcMain.on('set-proxy', (event, proxyConfig) => {
    setupProxy(session, proxyConfig)
  })

  ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url)
  })

  ipcMain.on('navigate-to', (event, url) => {
    view.webContents.loadURL(url)
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

  ipcMain.on('toggle-mode', (event, mode) => {
    bounds.x = mode ? 30 : 100
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  ipcMain.on('logout', async (event) => {
    await session.clearStorageData()
    view.webContents.reload()
  })

  ipcMain.on('resize-webcontents', (event, width) => {
    bounds.width = width
    setViewSize(view, bounds)
    conf.set('webContentsView.bounds', bounds)
  })

  ipcMain.handle('add-bookmark', async () => {
    return view.webContents.getURL()
  })

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
