<script setup lang="ts">
const appStore = useAppStore()
</script>

<template>
  <div
    :style="{ width: `${appStore.config.webContentsView!.bounds.width}px`, height: '100vh' }"
  />
</template>
