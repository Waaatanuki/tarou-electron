import DefaultIcon from '@renderer/assets/icon/icon-128.png'

export function createNotification(options: NotificationOptions) {
  const { title = '通知', body, icon = DefaultIcon } = options
  const notification = new Notification(title, { body, icon })
}

interface NotificationOptions {
  body: string
  title?: string
  icon?: string
}
