<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import conf from './conf'
import ViewPanel from './views/index.vue'

const appStore = useAppStore()
const loading = ref(true)

onMounted(async () => {
  if (!isDark.value)
    toggleDark()

  appStore.config.webContentsView = await conf.get('webContentsView') as any
  appStore.config.bookmark = await conf.get('bookmark') as any
  loading.value = false

  window.electron.ipcRenderer.on('window-resized', (event, { width, height }) => {
    appStore.config.webContentsView!.bounds.width = width
    appStore.config.webContentsView!.bounds.height = height
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
