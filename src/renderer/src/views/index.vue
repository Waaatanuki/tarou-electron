<script setup lang="ts">
import BookmarkSetting from './bookmark/index.vue'
import Dashborad from './dashboard/index.vue'

const appStore = useAppStore()

const viewList: { key: string, icon: string }[] = [
  { key: 'Dashborad', icon: 'material-symbols:dashboard' },
  { key: 'BookmarkSetting', icon: 'material-symbols:bookmark-star-sharp' },
]

const segmentedProps = {
  value: 'key',
  label: 'key',
}

const componentMap = {
  Dashborad,
  BookmarkSetting,
}
</script>

<template>
  <div h-vh w-full flex flex-1>
    <component :is="componentMap[appStore.currentView]" flex-1 />

    <div class="custom-segmented">
      <el-segmented v-model="appStore.currentView" direction="vertical" :options="viewList" :props="segmentedProps">
        <template #default="{ item }">
          <Icon :icon="(item as any).icon" />
        </template>
      </el-segmented>
    </div>
  </div>
</template>

<style scoped>
.custom-segmented .el-segmented {
  --el-segmented-item-selected-bg-color: #0F766E;
}
</style>
