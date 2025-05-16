<script setup lang="ts">
import { Conf } from 'electron-conf/renderer'

const conf = new Conf()
const marks = ref([
  { name: '主页', icon: 'i-carbon-home', url: '3' },
  { name: 'おはよう', icon: 'i-carbon-group', url: '4' },
  { name: '设置', icon: 'i-carbon-settings', url: '5' },
])

function showContextMenu(mark: any, event: MouseEvent) {
  event.preventDefault()
  console.log(123)

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

// 添加 IPC 监听
window.electron.ipcRenderer.on('navigate-to', (event, url) => {
  // 处理导航逻辑
})

window.electron.ipcRenderer.on('delete-bookmark', (event, url) => {
  // 处理删除书签逻辑
})
</script>

<template>
  <div w-100px bg-black>
    <div flex flex-col>
      <div
        v-for="mark in marks"
        :key="mark.url"
        flex
        cursor-pointer
        items-center gap-2 p-2 text-xs leading-none transition-colors duration-200 hover:bg-gray-300 @contextmenu="showContextMenu(mark, $event)" @click="navigateTo(mark.url)"
      >
        <div :class="mark.icon" text-blue-400 />
        <div text-white>
          {{ mark.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 添加悬停动画效果 */
div[hover] {
  transform: translateX(2px);
}
</style>
