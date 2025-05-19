<script setup lang="ts">
import conf from '@renderer/conf'

const appStore = useAppStore()

const marks = ref([
  { name: '主页', icon: 'i-carbon-home', url: '3' },
  { name: 'おはよう', icon: 'i-carbon-group', url: '4' },
  { name: '设置', icon: 'i-carbon-settings', url: '5' },
])

const isSimpleMode = computed(() => appStore.config.bookmark?.simpleMode)
const wrapperWidth = computed(() => isSimpleMode.value ? 30 : 100)
const fixButton = computed(() => [
  { name: '新增', command: 'add', icon: 'i-ph:star-thin' },
  { name: isSimpleMode.value ? '展开' : '折叠', command: 'toggle', icon: isSimpleMode.value ? 'i-tabler:layout-sidebar-left-expand-filled' : 'i-tabler:layout-sidebar-left-collapse-filled' },
])

function showContextMenu(mark: any, event: MouseEvent) {
  event.preventDefault()

  // 通过 IPC 通知主进程显示菜单
  window.electron.ipcRenderer.send('show-bookmark-menu', {
    x: event.clientX,
    y: event.clientY,
    mark: toRaw(mark),
  })
}

function navigateTo(url: string) {
  console.log(url)
}

function handleCommand(command: string) {
  if (command === 'add') {
    // 处理新增书签逻辑
  }
  if (command === 'toggle') {
    appStore.config.bookmark!.simpleMode = !appStore.config.bookmark!.simpleMode
    window.electron.ipcRenderer.send('toggle-mode', appStore.config.bookmark!.simpleMode)
    conf.set('bookmark.simpleMode', appStore.config.bookmark!.simpleMode)
  }
}

// 添加 IPC 监听
window.electron.ipcRenderer.on('navigate-to', (event, url) => {
  // 处理导航逻辑
})

window.electron.ipcRenderer.on('delete-bookmark', (event, url) => {
  // 处理删除书签逻辑
})
</script>

<template>
  <div h-vh flex flex-col justify-between bg-dark text-neutral-50 font-bold :style="{ width: `${wrapperWidth}px` }">
    <div flex flex-col>
      <div
        v-for="mark in marks"
        :key="mark.url"
        flex
        cursor-pointer
        items-center gap-2 p-2 text-xs leading-none hover:bg-gray-700 @contextmenu="showContextMenu(mark, $event)" @click="navigateTo(mark.url)"
      >
        <div :class="mark.icon" text-blue-400 />
        <div v-if="!isSimpleMode">
          {{ mark.name }}
        </div>
      </div>
    </div>
    <div flex flex-col>
      <div
        v-for="mark in fixButton"
        :key="mark.command"
        flex
        cursor-pointer
        items-center gap-2 p-2 text-xs leading-none hover:bg-gray-700 @click="handleCommand(mark.command)"
      >
        <div :class="mark.icon" />
        <div v-if="!isSimpleMode">
          {{ mark.name }}
        </div>
      </div>
    </div>
  </div>
</template>
