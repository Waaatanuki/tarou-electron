<script setup lang="ts">
import conf from '../conf'

const appStore = useAppStore()
const isDragging = ref(false)
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

    const _clientX = e.clientX - (appStore.config.bookmark!.simpleMode ? 30 : 100)
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
  <div
    h-full w-1 shrink-0
    cursor-col-resize bg-gray-500 hover:bg-gray-200
    @mousedown="startDrag"
  />
</template>

<style scoped>

</style>
