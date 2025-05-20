declare module 'vue' {
  export interface GlobalComponents {
    Icon: typeof import('@iconify/vue')['Icon']
  }
}

export {}
