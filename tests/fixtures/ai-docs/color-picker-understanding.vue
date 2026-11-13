<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingColorPicker, type BingColorPickerChangePayload, type BingColorPickerExpose, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref('rgba(10, 20, 30, 0.4)')
const compositionMode = new URLSearchParams(location.search).has('composition')
const dialogOpen = ref(false)
const preserve = ref(true)
const disabled = ref(false)
const pickerMounted = ref(true)
const picker = ref<BingColorPickerExpose | null>(null)
const last = ref<BingColorPickerChangePayload | null>(null)
const log = ref<string[]>([])
const presets: BingColorPickerPresetInput[] = ['#abc', { label: '透明绿', value: 'rgba(0, 255, 0, 0.1)' }, 'invalid']
function update(color: string) { log.value.push('update:' + color); if (!preserve.value) value.value = color }
function change(payload: BingColorPickerChangePayload) { last.value = payload; log.value.push('change:' + payload.source); if (preserve.value) value.value = payload.rgba }
</script>

<template>
  <label><input id="preserve" v-model="preserve" type="checkbox">保存透明度</label>
  <label><input id="disabled" v-model="disabled" type="checkbox">禁用颜色</label>
  <button id="invalid" @click="value = 'red'">外部无效颜色</button>
  <button id="mounted" @click="pickerMounted = !pickerMounted">切换挂载</button>
  <button id="focus" @mousedown.prevent @click="picker?.focus()">聚焦方法</button>
  <button id="blur" @mousedown.prevent @click="picker?.blur()">失焦方法</button>
  <button id="open" @click="picker?.openPanel()">打开方法</button>
  <button id="close" @click="picker?.closePanel()">关闭方法</button>
  <BingColorPicker v-if="pickerMounted" ref="picker" :modelValue="value" :presets="presets" :disabled="disabled" ariaLabel="阅读颜色" :panelWidth="'100%'" @update:modelValue="update" @change="change" @open="log.push('open')" @close="log.push('close')" />
  <p role="status">{{ value }}</p>
  <pre id="payload">{{ JSON.stringify(last) }}</pre>
  <pre id="events">{{ JSON.stringify(log) }}</pre>
  <template v-if="compositionMode">
    <BingButton @click="dialogOpen = true">打开颜色表单</BingButton>
    <BingDialog v-model="dialogOpen" title="颜色组合">
      <BingColorPicker v-model="value" ariaLabel="弹窗颜色" />
    </BingDialog>
  </template>
</template>
