<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 可以保留或移除原有逻辑
// const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
// const webviewRef = ref<WebviewTag>()

function goHome() {
  // webviewRef.value?.loadURL('https://gbf.game.mbga.jp')
  // console.log(webviewRef.value?.getUserAgent())
}
const arr = ref<string[]>([])

window.electron.ipcRenderer.on('resp', (_event, data) => {
  arr.value.unshift(data)
})
onMounted(() => {
  // webviewRef.value?.addEventListener('dom-ready', () => {
  //   // 设置移动端User-Agent
  //   webviewRef.value?.setUserAgent(
  //     'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  //   )

  //   // 设置视口为移动设备尺寸
  //   webviewRef.value?.insertCSS(`
  //     @viewport {
  //       width: device-width;
  //       zoom: 1.0;
  //     }
  //     body {
  //       min-width: 320px;
  //     }
  //   `)

  //   webviewRef.value?.openDevTools()
  // })

  //  webviewRef.value?.addEventListener('', () => {

  //  })
})
</script>

<template>
  <div class="split-container">
    <!-- 左侧嵌入第三方页面 -->
    <!-- <webview
      ref="webviewRef"
      src="https://gbf.game.mbga.jp"
      class="webview-pane"
      partition="persist:game"
      allowpopups
      useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
    /> -->

    <!-- 右侧自定义内容 -->
    <div class="webview-pane" />
    <div class="custom-pane">
      <div v-for="item, idx in arr" :key="idx">
        {{ item }}
      </div>
      <div>123123</div>
      <button @click="goHome">
        回到主页
      </button>
      <Versions />
      <h2>自定义面板</h2>
      <p>
        这里可以放置你的控制组件或信息展示
      </p>
    </div>
  </div>
</template>

<style>
.split-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.webview-pane {
  /* flex: 1; */
  width: 500px;
  height: 100%;
}

.custom-pane {
  width: 300px; /* 右侧面板宽度 */
  padding: 20px;
  overflow-y: auto;
}
</style>
