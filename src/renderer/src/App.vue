<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import conf from './conf'
import ViewPanel from './views/index.vue'

const loading = ref(true)
const appStore = useAppStore()
const userStore = useUserStore()
const { handleTransaction, handleHTML } = useTransactionService()

onMounted(async () => {
  if (!isDark.value)
    toggleDark()

  if (!uuidValidate(userStore.code))
    userStore.code = uuidv4()

  appStore.config.webContentsView = await conf.get('webContentsView') as any
  appStore.config.bookmark = await conf.get('bookmark') as any
  appStore.config.proxy = await conf.get('proxy') as any
  loading.value = false

  window.electron.ipcRenderer.on('window-resized', (event, { width, height }) => {
    appStore.config.webContentsView!.bounds.width = width
    appStore.config.webContentsView!.bounds.height = height
  })

  window.electron.ipcRenderer.on('network-transaction', (event, transaction) => {
    handleTransaction(transaction)
  })

  window.electron.ipcRenderer.on('network-HTML', (event, html) => {
    handleHTML(html)
  })
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div v-if="!loading" h-vh w-vw flex>
      <MarkBar shrink-0 />
      <GameView shrink-0 />
      <ResizeBar shrink-0 />
      <ViewPanel />
      <Segment shrink-0 />
    </div>
  </el-config-provider>
</template>
