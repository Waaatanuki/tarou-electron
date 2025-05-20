<script setup lang="ts">
import conf from '../conf'
import BookmarkSetting from './bookmark/index.vue'
import Dashborad from './dashboard/index.vue'

const appStore = useAppStore()
const isDragging = ref(false)
const currentView = ref('BookmarkSetting')

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

watch(() => appStore.config.webContentsView?.bounds.width, (newWidth) => {
  window.electron.ipcRenderer.send('resize-webcontents', newWidth)
})

function startDrag(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  isDragging.value = true
}

async function stopDrag() {
  if (!isDragging.value)
    return
  isDragging.value = false
  await conf.set('webContentsView.bounds.width', appStore.config.webContentsView?.bounds.width)
  await conf.set('webContentsView.bounds.height', appStore.config.webContentsView?.bounds.height)
}

const onDrag = useThrottleFn((e: MouseEvent) => {
  if (isDragging.value) {
    const MIN_WIDTH = 150
    const MAX_WIDTH = 800

    const _clientX = e.clientX - (appStore.config.bookmark!.simpleMode ? 50 : 100)
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, _clientX))
    appStore.config.webContentsView!.bounds.width = newWidth
  }
}, 16)

onMounted(async () => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div h-vh w-full flex flex-1>
    <div
      h-full w-1
      cursor-col-resize bg-gray-500 hover:bg-gray-200
      @mousedown="startDrag"
    />

    <component :is="componentMap[currentView]" flex-1 />

    <div class="custom-segmented">
      <el-segmented v-model="currentView" direction="vertical" :options="viewList" :props="segmentedProps">
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
