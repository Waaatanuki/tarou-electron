<script setup lang="ts">
import type { Proxy } from 'tarou'

const formData = defineModel<Proxy>({ default: { preset: 'direct ' } })

const schemeOptions = [
  { value: 'http', port: '80' },
  { value: 'https', port: '443' },
  { value: 'socks4', port: '1080' },
  { value: 'socks5', port: '1080' },
]

function handlePresetChange() {
  switch (formData.value.preset) {
    case 'acgp':
      formData.value = {
        preset: formData.value.preset,
        mode: 'pac_script',
        pacScript: 'http://127.0.0.1:8123/proxy.pac',
      }
      break
    case 'clash':
      formData.value = {
        preset: formData.value.preset,
        mode: 'fixed_servers',
        scheme: 'socks5',
        host: '127.0.0.1',
        port: '7890',
      }
      break
    case 'server':
      formData.value = {
        preset: formData.value.preset,
        mode: 'fixed_servers',
        scheme: '',
        host: '',
        port: '',
      }
      break
    default:{
      formData.value = {
        preset: formData.value.preset,
        mode: formData.value.preset,
      }
    }
  }
  handleProxyChange()
}

function handleSchemeChange() {
  const scheme = schemeOptions.find(s => s.value === formData.value.scheme)!
  formData.value.port = scheme.port
  handleProxyChange()
}

function handleProxyChange() {
  nextTick(() => {
    if (formData.value.mode === 'fixed_servers') {
      formData.value.proxyRules = `${formData.value.scheme}://${formData.value.host}:${formData.value.port}`
    }
    window.electron.ipcRenderer.send('set-proxy', toRawData(formData.value))
  })
}
</script>

<template>
  <TheTitle title="代理设置" icon="carbon:network-public" />
  <el-form :model="formData" label-width="80" size="small">
    <el-form-item label="代理模式">
      <el-radio-group v-model="formData.preset" @change="handlePresetChange">
        <el-radio-button label="直连" value="direct" />
        <el-radio-button label="系统代理" value="system" />
        <el-radio-button label="ACGP" value="acgp" />
        <el-radio-button label="Clash" value="clash" />
        <el-radio-button label="自定义代理" value="server" />
      </el-radio-group>
    </el-form-item>
    <div v-if="formData.preset === 'server'" flex flex-wrap gap-2>
      <el-form-item label="代理协议">
        <el-select v-model="formData.scheme" style="width: 90px" @change="handleSchemeChange">
          <el-option v-for="s in schemeOptions" :key="s.value" :value="s.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理服务器">
        <el-input v-model="formData.host" style="width: 100px" @change="handleProxyChange" />
      </el-form-item>
      <el-form-item label="代理端口">
        <el-input v-model="formData.port" style="width: 80px" @change="handleProxyChange" />
      </el-form-item>
    </div>
  </el-form>
</template>

<style scoped>

</style>
