<script setup lang="ts">
import { getDoc } from '@renderer/api/doc'
import Stats from './components/Stats.vue'

const daata = ref()
async function foo() {
  daata.value = await getDoc('schedule')
}
</script>

<template>
  <div>
    <Stats />

    <TheButton @click="foo">
      测试
    </TheButton>
    <!-- <div i-carbon-sun dark:i-carbon-moon text-10 icon-btn @click="toggleDark()" /> -->
  </div>
</template>
