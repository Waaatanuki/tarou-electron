import type { Config } from 'tarou'
import { Conf, useConf } from 'electron-conf/main'

const DEFAULT_CONFIG: Config = {
  browserWindow: {
    width: 1000,
    height: 670,
  },
  webContentsView: {
    bounds: {
      width: 325,
      height: 635,
      x: 100,
      y: 0,
    },
  },
  bookmark: {
    simpleMode: false,
    list: [],
  },
}

let confInstance: Conf<Config> | null = null

export function initConf() {
  confInstance = new Conf({
    defaults: DEFAULT_CONFIG,
  })
  confInstance.registerRendererListener()
  useConf()
}

export function getConf() {
  if (!confInstance) {
    throw new Error('Conf not initialized')
  }
  return confInstance
}
