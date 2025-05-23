<script setup lang="ts">
import { getDoc } from '@renderer/api/doc'

const daata = ref()
const userStore = useUserStore()
async function foo() {
  daata.value = await getDoc('schedule')
}
</script>

<template>
  <div>
    我是主页
    <TheButton @click="foo">
      测试
    </TheButton>
    {{ userStore.uid }}
    <div i-carbon-sun dark:i-carbon-moon text-10 icon-btn @click="toggleDark()" />
  </div>
</template>

<style scoped>

</style>
