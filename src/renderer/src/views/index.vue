<script setup lang="ts">
import BookmarkSetting from './bookmark/index.vue'
import Dashborad from './dashboard/index.vue'
import Setting from './setting/index.vue'

const appStore = useAppStore()

const componentMap = {
  Dashborad,
  BookmarkSetting,
  Setting,
}
</script>

<template>
  <div h-vh w-full flex flex-1 overflow-hidden p-2>
    <keep-alive>
      <component :is="componentMap[appStore.currentView]" flex-1 />
    </keep-alive>
  </div>
</template>
