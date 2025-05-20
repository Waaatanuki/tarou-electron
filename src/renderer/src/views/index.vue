<script setup lang="ts">
import BookmarkSetting from './bookmark/index.vue'
import Dashborad from './dashboard/index.vue'

const appStore = useAppStore()

const componentMap = {
  Dashborad,
  BookmarkSetting,
}
</script>

<template>
  <div h-vh w-full flex flex-1 overflow-hidden>
    <keep-alive>
      <component :is="componentMap[appStore.currentView]" flex-1 />
    </keep-alive>
  </div>
</template>
