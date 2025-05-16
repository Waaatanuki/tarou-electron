<script setup lang="ts">
const appStore = useAppStore()

onMounted(async () => {
  const size = await window.electron.ipcRenderer.invoke('get-view-size')
  appStore.viewSize = size
})
</script>

<template>
  <div :style="{ width: `${appStore.viewSize.width}px`, height: `${appStore.viewSize.height}px` }" />
</template>
