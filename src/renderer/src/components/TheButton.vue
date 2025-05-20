<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(defineProps<{
  size?: '' | 'default' | 'small' | 'large'
  type?: '' | 'default' | 'text' | 'success' | 'warning' | 'info' | 'primary' | 'danger'
  color?: string
  icon?: string
  loading?: boolean
}>(), {
  size: 'small',
  type: 'primary',
  color: '#0F766E',
  loading: false,
})
</script>

<template>
  <el-button :type="type" :color="color" :size="size" :loading="loading" :dark="true">
    <div fc gap-2>
      <Icon v-if="icon && !loading" :icon="icon" />
      <slot />
    </div>
  </el-button>
</template>
