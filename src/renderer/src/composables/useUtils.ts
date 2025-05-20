import { nanoid } from 'nanoid'

export function useNanoid(length = 10) {
  return nanoid(length)
}

export function openExternal(url: string) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error('Invalid URL protocol')
    return
  }
  window.electron.ipcRenderer.send('open-external', url)
}
