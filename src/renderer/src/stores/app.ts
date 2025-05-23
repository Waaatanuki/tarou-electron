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

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
