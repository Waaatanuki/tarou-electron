import type { Proxy } from 'tarou'
import { getConf } from './conf'

export function setupProxy(session: Electron.Session, proxyConfig: Proxy) {
  const conf = getConf()
  conf.set('proxy', proxyConfig)

  const { mode, pacScript, proxyRules } = proxyConfig
  session.setProxy({
    mode,
    ...(pacScript && { pacScript }),
    ...(proxyRules && { proxyRules }),
  })
}
