<script setup lang="ts">
import conf from '@renderer/conf'

const appStore = useAppStore()
const { height } = useWindowSize()

const scrollbarRef = ref<ScrollbarInstance>()
const inputRef = ref<InputInstance>()
const showInput = ref(false)
const newBookmarkName = ref('')
const currentUrl = ref('')
const isSimpleMode = computed(() => appStore.config.bookmark?.simpleMode)
const wrapperWidth = computed(() => isSimpleMode.value ? 30 : 100)
const fixButton = computed(() => [
  { name: '新增', command: 'add', icon: 'i-ph:star-thin' },
  { name: isSimpleMode.value ? '展开' : '折叠', command: 'toggle', icon: isSimpleMode.value ? 'i-tabler:layout-sidebar-left-expand-filled' : 'i-tabler:layout-sidebar-left-collapse-filled' },
])
const marks = computed(() => appStore.config.bookmark?.list || [])

function showContextMenu(index: number, event: MouseEvent) {
  event.preventDefault()

  // 通过 IPC 通知主进程显示菜单
  window.electron.ipcRenderer.send('show-bookmark-menu', {
    x: event.clientX,
    y: event.clientY,
    index,
  })
}

function navigateTo(url: string) {
  window.electron.ipcRenderer.send('navigate-to', url)
}

async function handleCommand(command: string) {
  if (command === 'add') {
    currentUrl.value = await window.electron.ipcRenderer.invoke('add-bookmark')

    if (appStore.config.bookmark!.list.some(item => item.url === currentUrl.value)) {
      createNotification({ body: '该页面已被保存' })
      return
    }

    if (isSimpleMode.value)
      await handleCommand('toggle')
    showInput.value = true
    nextTick(() => {
      scrollbarRef.value?.setScrollTop(9999)
      inputRef.value?.focus()
    })
  }
  if (command === 'toggle') {
    appStore.config.bookmark!.simpleMode = !appStore.config.bookmark!.simpleMode
    window.electron.ipcRenderer.send('toggle-mode', appStore.config.bookmark!.simpleMode)
    await conf.set('bookmark.simpleMode', appStore.config.bookmark!.simpleMode)
  }
}

async function addBookmark() {
  appStore.config.bookmark!.list.push({
    name: newBookmarkName.value.trim() ? newBookmarkName.value.trim() : '未命名',
    url: currentUrl.value,
    icon: 'material-symbols:bookmark-sharp',
    color: '#FAFAFA',
  })
  await conf.set('bookmark.list', toRaw(appStore.config.bookmark!.list))
  newBookmarkName.value = ''
  showInput.value = false
}

window.electron.ipcRenderer.on('delete-bookmark', async (event, index) => {
  appStore.config.bookmark.list.splice(index, 1)
  await conf.set('bookmark.list', toRaw(appStore.config.bookmark!.list))
})
</script>

<template>
  <div h-vh flex flex-col justify-between bg-dark text-xs text-neutral-50 font-bold :style="{ width: `${wrapperWidth}px` }">
    <el-scrollbar ref="scrollbarRef" :height="height - 70">
      <div flex flex-col>
        <div
          v-for="mark, idx in marks"
          :key="mark.url"
          flex cursor-pointer items-center gap-2 p-2 text-xs leading-none hover:bg-gray-700
          @contextmenu="showContextMenu(idx, $event)" @click="navigateTo(mark.url)"
        >
          <Icon :icon="mark.icon" :style="{ color: mark.color }" shrink-0 />
          <div v-if="!isSimpleMode" truncate>
            {{ mark.name }}
          </div>
        </div>
        <div v-if="showInput && !isSimpleMode" fc>
          <el-input
            ref="inputRef"
            v-model="newBookmarkName"
            style="width:78px"
            size="small"
            @blur="addBookmark"
            @keyup.enter="addBookmark"
          />
        </div>
      </div>
    </el-scrollbar>

    <div flex flex-col>
      <div
        v-for="mark in fixButton"
        :key="mark.command"
        flex cursor-pointer items-center gap-2 p-2 leading-none hover:bg-gray-700
        @click="handleCommand(mark.command)"
      >
        <div :class="mark.icon" />
        <div v-if="!isSimpleMode">
          {{ mark.name }}
        </div>
      </div>
    </div>
  </div>
</template>
