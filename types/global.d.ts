declare module 'tarou' {
  interface Config {
    browserWindow: {
      width: number
      height: number
    }
    webContentsView: {
      bounds: {
        width: number
        height: number
        x: number
        y: number
      }
    }
    bookmark: {
      simpleMode: boolean
      list: BookmarkItem[]
    }
  }

  interface BookmarkItem {
    id: string
    name: string
    icon: string
    color: string
    url: string
  }
}
