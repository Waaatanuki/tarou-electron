import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const viewSize = ref({ width: 325, height: 635 })

  return {
    viewSize,
  }
})
