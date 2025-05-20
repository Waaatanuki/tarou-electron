import type { Config } from 'tarou'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const config = ref<Partial<Config>>({})
  const currentView = ref('Dashborad')

  return {
    config,
    currentView,
  }
})
