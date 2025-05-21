<script setup lang="ts">
const appStore = useAppStore()

const viewList: { key: string, icon: string }[] = [
  { key: 'Dashborad', icon: 'material-symbols:dashboard' },
  { key: 'BookmarkSetting', icon: 'material-symbols:bookmark-star-sharp' },
  { key: 'Setting', icon: 'carbon:settings' },
]

const segmentedProps = {
  value: 'key',
  label: 'key',
}
</script>

<template>
  <div class="custom-segmented">
    <el-segmented v-model="appStore.currentView" direction="vertical" :options="viewList" :props="segmentedProps">
      <template #default="{ item }">
        <Icon :icon="(item as any).icon" />
      </template>
    </el-segmented>
  </div>
</template>

<style scoped>
.custom-segmented .el-segmented {
  --el-segmented-item-selected-bg-color: #0F766E;
}
</style>
