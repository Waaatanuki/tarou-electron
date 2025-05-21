import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const code = useStorage('code', '')
  const token = useStorage('token', '')

  function logout() {
    token.value = ''
  }

  return {
    code,
    token,
    logout,
  }
})
