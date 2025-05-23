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

  interface NetworkTransaction {
    url: string
    postData?: any
    responseBody?: any
  }
}

declare module 'protocal'{
  interface NetworkRequestWillBeSentParams {
    documentURL: string
    frameId: string
    hasUserGesture: boolean
    initiator: Initiator
    loaderId: string
    redirectHasExtraInfo: boolean
    request: Request
    requestId: string
    timestamp: number
    type: string
    wallTime: number
  }

  interface Initiator {
    stack: any[]
    type: string
  }

  interface Request {
    headers: any[]
    initialPriority: string
    isSameSite: boolean
    method: string
    mixedContentType: string
    referrerPolicy: string
    url: string
    hasPostData?: boolean
    postData?: string
  }
}
