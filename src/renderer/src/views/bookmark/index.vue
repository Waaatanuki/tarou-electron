<script setup lang="ts">
const appStore = useAppStore()
const { height } = useWindowSize()
const { open, reset, onChange } = useFileDialog({ accept: '.json' })

async function deleteMark(id: string) {
  const index = appStore.config.bookmark?.list.findIndex(item => item.id === id)
  if (index !== undefined && index !== -1) {
    appStore.config.bookmark?.list.splice(index, 1)
  }
}

function exportBookmarks() {
  const data = appStore.config.bookmark?.list.map(({ id, ...rest }) => rest) || []
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bookmarks_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importBookmarks() {
  reset()
  open()
}

onChange(async (files) => {
  if (!files)
    return

  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      if (file.type !== 'application/json')
        continue
      const data = await loadFile(file)

      for (const item of data) {
        if (item.name && item.url && item.icon && item.color) {
          appStore.config.bookmark!.list.push({
            id: useNanoid(),
            name: item.name,
            url: item.url,
            icon: item.icon,
            color: item.color,
          })
        }
      }
    }
    createNotification({ body: `导入成功` })
  }
  catch (error) {
    ElMessage.error(String(error))
  }
})

function loadFile(file: File) {
  return new Promise<any[]>((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      resolve(JSON.parse(reader.result as string))
    }
    reader.readAsText(file)
  })
}
</script>

<template>
  <div>
    <TheTitle title="书签管理" icon="material-symbols:bookmark-star-sharp">
      <div>
        <TheButton icon="carbon:document-export" @click="exportBookmarks">
          导出
        </TheButton>
        <TheButton icon="carbon:document-import" @click="importBookmarks">
          导入
        </TheButton>
      </div>
    </TheTitle>
    <div>
      <el-scrollbar :max-height="height - 80">
        <div m-auto w-90 flex flex-col gap-2>
          <el-card
            v-for="mark in appStore.config.bookmark?.list || []" :key="mark.id"
            body-style="padding: 10px 10px 0 10px;"
          >
            <el-form size="small">
              <div flex items-center justify-between gap-4>
                <div fc gap-6>
                  <el-form-item label="名称">
                    <el-input v-model="mark.name" style="width: 100px;" />
                  </el-form-item>
                  <el-form-item label="颜色">
                    <el-color-picker v-model="mark.color" ml-2 />
                  </el-form-item>
                </div>
                <el-form-item>
                  <TheButton icon="carbon:trash-can" @click="deleteMark(mark.id)" />
                </el-form-item>
              </div>
              <el-form-item label="图标">
                <el-input v-model="mark.icon">
                  <template #prefix>
                    <Icon :icon="mark.icon" />
                  </template>
                  <template #suffix>
                    <el-popover effect="dark" placement="top-start">
                      <template #reference>
                        <Icon icon="carbon:help" />
                      </template>
                      <div fc>
                        <TheButton @click="openExternal('https://icones.netlify.app/')">
                          获取图标
                        </TheButton>
                      </div>
                    </el-popover>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="地址">
                <el-input v-model="mark.url" />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
