<script setup lang="ts">
import Dashborad from './dashboard/index.vue'
import Party from './party/index.vue'

const width = ref(320)
const isDragging = ref(false)
// 监听宽度变化并通知主进程
watch(width, (newWidth) => {
  window.electron.ipcRenderer.send('resize-webcontents', newWidth)
})

function startDrag(e: MouseEvent) {
  isDragging.value = true
  document.body.style.cursor = 'col-resize'
  e.stopPropagation() // 阻止事件冒泡
  e.preventDefault() // 阻止默认行为
}

function stopDrag() {
  isDragging.value = false
  document.body.style.cursor = ''
}

const onDrag = useThrottleFn((e: MouseEvent) => {
  if (isDragging.value) {
    width.value = e.clientX
  }
}, 16)
// 添加全局事件监听
onMounted(async () => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
})

// 移除事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div h-vh w-full flex flex-1>
    <div
      h-full w-2
      cursor-col-resize bg-gray-300 hover:bg-blue-400
      @mousedown="startDrag"
      @mouseup="stopDrag"
    />
    <ElTabs type="border-card" flex-1>
      <ElTabPane label="主页">
        <Dashborad />
      </ElTabPane>
      <ElTabPane label="队伍信息">
        <Party />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
