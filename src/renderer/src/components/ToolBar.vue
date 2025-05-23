<script setup lang="ts">
import conf from '@renderer/conf'
import { VueDraggableNext } from 'vue-draggable-next'

const appStore = useAppStore()
const { height } = useWindowSize()

const scrollbarRef = ref<ScrollbarInstance>()
const inputRef = ref<InputInstance>()
const showInput = ref(false)
const newBookmarkName = ref('')
const isSimpleMode = computed(() => appStore.config.bookmark?.simpleMode)
const wrapperWidth = computed(() => isSimpleMode.value ? 30 : 100)
const fixButton = computed(() => [
  { name: '新增', command: 'add', icon: 'ph:star-thin' },
  { name: isSimpleMode.value ? '展开' : '折叠', command: 'toggle', icon: isSimpleMode.value ? 'tabler:layout-sidebar-left-expand-filled' : 'tabler:layout-sidebar-left-collapse-filled' },
  { name: '设置', command: 'set', icon: 'material-symbols:bookmark-star-sharp' },
])

watch(() => appStore.config.bookmark?.list, async () => {
  await conf.set('bookmark.list', toRawData(appStore.config.bookmark!.list))
}, { deep: true })

function showContextMenu(index: number, event: MouseEvent) {
  event.preventDefault()

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
  if (command === 'set') {
    appStore.currentView = 'BookmarkSetting'
  }
}

async function addBookmark() {
  const url = await window.electron.ipcRenderer.invoke('add-bookmark')
  appStore.config.bookmark!.list.push({
    id: useNanoid(),
    name: newBookmarkName.value.trim() ? newBookmarkName.value.trim() : '未命名',
    url,
    icon: 'carbon:bookmark-filled',
    color: '#FAFAFA',
  })

  newBookmarkName.value = ''
  showInput.value = false
}

window.electron.ipcRenderer.on('delete-bookmark', async (event, index) => {
  appStore.config.bookmark!.list.splice(index, 1)
})
</script>

<template>
  <div h-vh flex flex-col justify-between bg-dark text-xs text-neutral-50 font-bold :style="{ width: `${wrapperWidth}px` }">
    <el-scrollbar ref="scrollbarRef" :max-height="height - 140">
      <VueDraggableNext v-model="appStore.config.bookmark!.list" flex flex-col>
        <transition-group name="list">
          <div
            v-for="mark, idx in appStore.config.bookmark!.list"
            :key="mark.id"
            flex cursor-pointer items-center gap-2 p-2 text-xs leading-none hover:bg-gray-700
            @contextmenu="showContextMenu(idx, $event)" @click="navigateTo(mark.url)"
          >
            <Icon :icon="mark.icon" :style="{ color: mark.color }" shrink-0 />
            <div v-if="!isSimpleMode" truncate>
              {{ mark.name }}
            </div>
          </div>
        </transition-group>
      </VueDraggableNext>
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
    </el-scrollbar>

    <div flex flex-col>
      <div
        v-for="mark in fixButton"
        :key="mark.command"
        flex cursor-pointer items-center gap-2 p-2 leading-none hover:bg-gray-700
        @click="handleCommand(mark.command)"
      >
        <Icon :icon="mark.icon" />
        <div v-if="!isSimpleMode">
          {{ mark.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}
</style>
