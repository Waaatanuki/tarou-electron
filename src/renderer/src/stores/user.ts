import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = useStorage('token', '')

  function logout() {
    token.value = ''
  }

  return {
    token,
    logout,
  }
})
