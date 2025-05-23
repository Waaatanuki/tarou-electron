import type { BrowserWindow, WebContentsView } from 'electron'
import type { NetworkRequestWillBeSentParams } from 'protocal'
import type { NetworkTransaction } from 'tarou'

const ignoreExt = ['css', 'mp3']
const targetUrl = ['gbf.game.mbga.jp']

let currentUrl = ''
const targetPage = [
  { url: '/#mypage', selector: '#status-accordion-wrapper' },
]

export function setupDebugger(mainWindow: BrowserWindow, view: WebContentsView) {
  const transactions = new Map<string, NetworkTransaction>()

  view.webContents.debugger.attach('1.3')
  view.webContents.debugger.sendCommand('Network.enable')
  view.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to : ', reason)
  })

  view.webContents.on('did-navigate', handlePageNavigation)
  view.webContents.on('did-navigate-in-page', handlePageNavigation)

  async function handlePageNavigation() {
    const url: string = await view.webContents.executeJavaScript('document.URL')

    if (url === currentUrl)
      return

    currentUrl = url
    const hitPage = targetPage.find(page => url.includes(page.url))

    if (hitPage) {
      const outerHTML = await getHtmlString(hitPage)
      currentUrl = ''
      if (outerHTML) {
        mainWindow.webContents.send('network-HTML', { url, outerHTML })
      }
    }
  }

  async function getHtmlString(page: { url: string, selector: string }) {
    return new Promise<string>((resolve) => {
      let intervalId: NodeJS.Timeout

      const cleanup = () => {
        if (intervalId)
          clearInterval(intervalId)
      }

      intervalId = setInterval(async () => {
        try {
          const url: string = await view.webContents.executeJavaScript('document.URL')

          if (!url.includes(page.url)) {
            cleanup()
            resolve('')
            return
          }

          const targetHTML = await view.webContents.executeJavaScript(
            `document.querySelector('${page.selector}')?.outerHTML`,
          )

          if (targetHTML) {
            cleanup()
            const contentHTML = await view.webContents.executeJavaScript(
              `document.querySelector('.contents')?.outerHTML`,
            )
            resolve(contentHTML)
          }
        }
        catch (error) { }
      }, 200)
    })
  }

  async function getResponseBody(requestId: string) {
    return new Promise((resolve, reject) => {
      let count = 0
      let resp: any
      let intervalId: NodeJS.Timeout

      const cleanup = () => {
        if (intervalId)
          clearInterval(intervalId)
      }

      intervalId = setInterval(async () => {
        if (count > 10) {
          cleanup()
          reject(new Error('Timeout after 10 attempts'))
          return
        }

        if (resp) {
          cleanup()
          if (!resp.body) {
            resolve(null)
            return
          }
          try {
            resolve(JSON.parse(resp.body))
          }
          catch (error) {
            reject(error)
          }
          return
        }

        try {
          count++
          resp = await view.webContents.debugger.sendCommand('Network.getResponseBody', { requestId })
        }
        catch (error) { }
      }, 100)
    })
  }

  view.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.requestWillBeSent' && !isIgnoredRequest(params)) {
      const { requestId, request } = params as NetworkRequestWillBeSentParams
      let postData = null

      if (request.hasPostData && request.postData) {
        try {
          postData = JSON.parse(request.postData)
        }
        catch (error) { }
      }

      transactions.set(requestId, {
        url: request.url,
        postData,
        responseBody: null,
      })
    }

    if (method === 'Network.responseReceived') {
      const { requestId } = params
      const transaction = transactions.get(requestId)
      if (!transaction)
        return

      getResponseBody(requestId).then((body) => {
        transaction.responseBody = body
        mainWindow.webContents.send('network-transaction', transaction)
        transactions.delete(requestId)
      })
    }

    if (method === 'Network.webSocketFrameReceived') {
      console.log('Network.webSocketFrameReceived')
    }
  })
}

function isIgnoredRequest(params: NetworkRequestWillBeSentParams) {
  const { request } = params

  if (!targetUrl.some(url => request.url.includes(url)))
    return true

  if (params.type !== 'XHR')
    return true

  if (ignoreExt.some(ext => request.url.endsWith(ext)))
    return true

  return false
}
