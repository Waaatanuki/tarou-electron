import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const code = useStorage('code', '')
  const token = useStorage('token', '')
  const uid = useStorage('uid', '')
  function logout() {
    token.value = ''
  }

  return {
    uid,
    code,
    token,
    logout,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
