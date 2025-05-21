<script setup lang="ts">
import Proxy from './components/Proxy.vue'

const appStore = useAppStore()
</script>

<template>
  <div>
    <Proxy v-model="appStore.config.proxy" />
  </div>
</template>

<style scoped>

</style>
