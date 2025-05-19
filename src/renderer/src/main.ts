import { Icon } from '@iconify/vue'
import { createApp } from 'vue'
import App from './App.vue'
import './styles'

createApp(App).component('Icon', Icon).use(createPinia()).mount('#app')
