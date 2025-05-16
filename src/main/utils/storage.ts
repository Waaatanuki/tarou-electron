import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import { merge } from 'lodash-es'

export interface Setting {
  browserWindow: {
    width: number
    height: number
  }
  webContentsView: {
    width: number
    height: number
  }
}

// 定义默认设置
const DEFAULT_SETTING: Setting = {
  browserWindow: {
    width: 1000,
    height: 670,
  },
  webContentsView: {
    width: 325,
    height: 635,
  },
}

export function saveSetting(setting: Partial<Setting>): void {
  const filePath = path.join(app.getPath('userData'), 'setting.json')

  const currentSettings = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
    : {}

  const mergedSettings = merge({}, currentSettings, setting)

  fs.writeFileSync(filePath, JSON.stringify(mergedSettings))
  console.log('=================更新用户配置成功=========================')
}

export function loadSetting(): Setting {
  try {
    const filePath = path.join(app.getPath('userData'), 'setting.json')
    const userSettings: Partial<Setting> = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    console.log('=================获取用户配置成功=========================')
    return merge({}, DEFAULT_SETTING, userSettings)
  }
  catch {
    return DEFAULT_SETTING
  }
}
