import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'

interface ViewSizeData {
  width: number
  height: number
}

export function saveViewSize(width: number, height: number): void {
  const data: ViewSizeData = { width, height }
  const filePath = path.join(app.getPath('userData'), 'viewSize.json')
  fs.writeFileSync(filePath, JSON.stringify(data))
}

export function loadViewSize(): ViewSizeData {
  try {
    const filePath = path.join(app.getPath('userData'), 'viewSize.json')
    const data: ViewSizeData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    console.log('=================viewSize.json=========================')
    console.log(data)

    return {
      width: data.width || 350,
      height: data.height || 600,
    }
  }
  catch {
    return { width: 350, height: 670 }
  }
}
