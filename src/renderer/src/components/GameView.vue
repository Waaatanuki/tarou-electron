<script setup lang="ts">
import { ref } from 'vue'

const width = ref(320)

onMounted(async () => {
  const size = await window.electron.ipcRenderer.invoke('get-view-size')
  width.value = size.width
})
</script>

<template>
  <div :style="{ width: `${width}px` }" h-100vh />
</template>
