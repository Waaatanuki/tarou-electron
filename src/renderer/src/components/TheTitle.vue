<script setup lang="ts">
const { title, icon } = defineProps<{ title: string, icon: string }>()
</script>

<template>
  <div view-title h-12>
    <div fc gap-1>
      <Icon :icon="icon" />
      <span>{{ title }}</span>
    </div>
    <slot />
  </div>
</template>
