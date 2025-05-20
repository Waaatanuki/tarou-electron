<script setup lang="ts">
import conf from '@renderer/conf'

const appStore = useAppStore()
const { height } = useWindowSize()

watch(() => appStore.config.bookmark?.list, async (val) => {
  await conf.set('bookmark.list', toRaw(val))
}, { deep: true })
</script>

<template>
  <div p-2>
    <div view-title>
      <div fc gap-1>
        <Icon icon="material-symbols:bookmark-star-sharp" />
        <span>书签管理</span>
      </div>
      <div>
        <TheButton icon="carbon:document-export">
          导出
        </TheButton>
        <TheButton icon="carbon:document-import">
          导入
        </TheButton>
      </div>
    </div>
    <div>
      <el-scrollbar :max-height="height - 80">
        <div m-auto w-90 flex flex-col gap-2>
          <el-card
            v-for="mark, idx in appStore.config.bookmark?.list || []" :key="idx"
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
                  <TheButton icon="carbon:trash-can" />
                </el-form-item>
              </div>
              <el-form-item label="图标">
                <el-input v-model="mark.icon">
                  <template #suffix>
                    <Icon :icon="mark.icon" />
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
