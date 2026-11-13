<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingDatePicker, type BingDatePickerExpose, type BingDatePickerModelValue, type BingDatePickerType, type BingDatePickerChangePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const picker = ref<BingDatePickerExpose | null>(null)
const compositionMode = new URLSearchParams(location.search).has('composition')
const dialogOpen = ref(false)
const type = ref<BingDatePickerType>('date')
const range = ref(false)
const value = ref<BingDatePickerModelValue>('2026-07-08')
const disabled = ref(false)
const log = ref<string[]>([])
const parsed = ref('')
function change(payload: BingDatePickerChangePayload) { log.value.push('change'); parsed.value = Array.isArray(payload.parsedValue) ? payload.parsedValue.map(date => date.format('YYYY-MM-DD HH:mm:ss')).join(' / ') : payload.parsedValue?.format('YYYY-MM-DD HH:mm:ss') ?? 'null' }
function mode(next: BingDatePickerType, isRange = false) { picker.value?.closePanel(); type.value = next; range.value = isRange; value.value = isRange ? ['18:00:00', '09:00:00'] : next === 'datetime' ? '2026-07-08 09:30:00' : '2026-07-08'; log.value = [] }
</script>

<template>
  <label><input id="disabled" v-model="disabled" type="checkbox">禁用</label>
  <button id="datetime" @click="mode('datetime')">日期时间模式</button>
  <button id="overnight" @click="mode('time', true)">跨午夜范围</button>
  <button id="external" @click="value = '2026-07-20'">外部模型</button>
  <button id="close" @click="picker?.closePanel()">方法关闭</button>
  <button id="clear" @click="picker?.clear()">方法清空</button>
  <BingDatePicker id="date-reading" ref="picker" v-model="value" :type="type" :range="range" :disabled="disabled" :showShortcuts="false" :smoothScroll="false" ariaLabel="阅读日期" @update:modelValue="log.push('update')" @change="change" @confirm="log.push('confirm')" @cancel="log.push('cancel')" @clear="log.push('clear')" @open="log.push('open')" @close="log.push('close')" />
  <p role="status">{{ JSON.stringify(value) }}</p>
  <pre id="events">{{ JSON.stringify(log) }}</pre>
  <p id="parsed">{{ parsed }}</p>
  <template v-if="compositionMode">
    <BingButton @click="dialogOpen = true">打开日期表单</BingButton>
    <BingDialog v-model="dialogOpen" title="日期组合">
      <BingDatePicker v-model="value" ariaLabel="弹窗日期" />
    </BingDialog>
  </template>
</template>
