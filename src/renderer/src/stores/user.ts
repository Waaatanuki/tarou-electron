import type { UserStatus } from 'dashboard'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const code = useStorage('code', '')
  const token = useStorage('token', '')
  const userStatus = useStorage<Partial<UserStatus>>('userStatus', {})
  function logout() {
    token.value = ''
  }

  return {
    code,
    token,
    userStatus,
    logout,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
