import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
// 创建 axios 实例
const service = axios.create({
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

// 请求拦截器
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    throw new Error(
      'Expected \'config\' and \'config.headers\' not to be undefined',
    )
  }
  const userStore = useUserStore()
  if (!uuidValidate(userStore.code))
    userStore.code = uuidv4()

  if (config.url?.startsWith('/admin')) {
    config.baseURL = import.meta.env.VITE_APP_GM_API
    config.url = config.url.replace(new RegExp('^' + '/admin'), '')
    config.headers.Authorization = userStore.token ? `Bearer ${userStore.token}` : undefined
  }
  else if (config.url?.startsWith('/gh')) {
    config.baseURL = import.meta.env.VITE_APP_GH_RAW
    config.url = `${config.url.replace(new RegExp('^' + '/gh'), '')}?${Date.now()}`
  }

  return config
}, (error: any) => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  if (response.status === 200) {
    return response.data
  }
  else {
    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer)
      return response
    ElMessage.error(response?.statusText || 'System Error')
    return Promise.reject(new Error(response?.statusText || 'Error'))
  }
}, (error: AxiosError<{ statusCode: number, message: string }>) => {
  if (error?.response?.data) {
    const { statusCode, message } = error.response.data
    // token 过期,重新登录
    if (statusCode === 401) {
      const userStore = useUserStore()
      userStore.logout()
    }

    ElMessage.error(message || '系统出错')
  }
  return Promise.reject(new Error(error.response?.statusText || 'Error'))
})

// 导出 axios 实例
export default service
