<script setup lang="ts">
import conf from './conf'
import ViewPanel from './views/index.vue'

const appStore = useAppStore()
const loading = ref(true)

onMounted(async () => {
  appStore.config.webContentsView = await conf.get('webContentsView') as any
  appStore.config.bookmark = await conf.get('bookmark') as any
  loading.value = false
})
</script>

<template>
  <div v-if="!loading" h-vh w-vw flex>
    <MarkBar />
    <GameView />
    <ViewPanel />
  </div>
</template>
