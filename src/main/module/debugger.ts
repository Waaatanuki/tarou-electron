import type { BrowserWindow, WebContentsView } from 'electron'
import type { NetworkRequestWillBeSentParams } from 'protocal'
import type { NetworkTransaction } from 'tarou'

const ignoreExt = ['css', 'mp3']
const targetUrl = ['gbf.game.mbga.jp']

export function setupDebugger(mainWindow: BrowserWindow, view: WebContentsView) {
  const transactions = new Map<string, NetworkTransaction>()

  view.webContents.debugger.attach('1.3')
  view.webContents.debugger.sendCommand('Network.enable')
  view.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to : ', reason)
  })

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
        catch (error) {
          console.log('Network.getResponseBody报错')
        }
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
        catch (error) {
          console.log({ msg: 'JSON.parse(request.postData)报错', error, url: request.url, postData: request.postData })
        }
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
