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
    proxy: Proxy
  }

  interface BookmarkItem {
    id: string
    name: string
    icon: string
    color: string
    url: string
  }

  interface Proxy {
    mode: 'direct' | 'system' | 'pac_script' | 'fixed_servers'
    preset: 'direct' | 'system' | 'acgp' | 'clash' | 'server'
    scheme?: string
    host?: string
    port?: string
    pacScript?: string
    proxyRules?: string
  }
}
