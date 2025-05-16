// import type { Config } from 'tarou'
// import fs from 'node:fs'
// import path from 'node:path'
// import { app } from 'electron'
// import { debounce, merge } from 'lodash-es'

// // 定义默认设置
// const DEFAULT_CONFIG: Config = {
//   browserWindow: {
//     width: 1000,
//     height: 670,
//   },
//   webContentsView: {
//     width: 325,
//     height: 635,
//   },
//   bookmark: {
//     simpleMode: false,
//     list: [],
//   },
// }

// // 防抖保存（2000ms间隔）
// const debouncedSave = debounce((filePath: string, data: Partial<Setting>) => {
//   const currentSettings = fs.existsSync(filePath)
//     ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
//     : {}

//   const mergedSettings = merge({}, currentSettings, data)

//   fs.writeFileSync(filePath, JSON.stringify(mergedSettings))
//   console.log('=================更新用户配置成功=========================')
// }, 1000)

// export function saveSetting(setting: Partial<Setting>): void {
//   const filePath = path.join(app.getPath('userData'), 'setting.json')
//   debouncedSave(filePath, setting)
// }

// export function loadSetting(): Setting {
//   try {
//     const filePath = path.join(app.getPath('userData'), 'setting.json')
//     const userSettings: Partial<Setting> = JSON.parse(fs.readFileSync(filePath, 'utf8'))

//     console.log('=================获取用户配置成功=========================')
//     return merge({}, DEFAULT_SETTING, userSettings)
//   }
//   catch {
//     return DEFAULT_SETTING
//   }
// }
