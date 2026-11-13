<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingDialog, BingSelect, type BingSelectModelValue, type BingSelectOption, type BingSelectChangePayload } from '@moubing/bing-ui'
const value = ref<BingSelectModelValue>(['outside', 'disabled', 'missing'])
const disabled = ref(false)
const dialog = ref(false)
const nestedValue = ref<BingSelectModelValue>(null)
const options: BingSelectOption[] = [
  { label: 'Alpha 数字', value: 1, detail: '数字编号', meta: { 类别: '数字' } },
  { label: 'Alpha 字符串', value: '1', detail: '字符串编号' },
  { label: '已禁用', value: 'disabled', disabled: true },
  { label: '范围之外', value: 'outside' },
  ...Array.from({ length: 8 }, (_, i) => ({ label: `项目 ${i}`, value: `item-${i}` })),
]
const events = ref<string[]>([])
const payload = ref<BingSelectChangePayload>()
function update(next: BingSelectModelValue) { value.value = next; events.value.push('update') }
function change(next: BingSelectChangePayload) { payload.value = next; events.value.push('change') }
</script>
<template>
  <main style="padding: 24px; max-width: 520px">
    <label><input v-model="disabled" type="checkbox">禁用阅读选择器</label>
    <BingSelect id="select-reading" :modelValue="value" :options="options" :disabled="disabled" multiple
      :smoothScroll="false" :virtualThreshold="8" ariaLabel="阅读选择器" @update:modelValue="update"
      @change="change" @clear="events.push('clear')" @open="events.push('open')" @close="events.push('close')">
      <template #value="{ selectedOptions, placeholder }">{{ selectedOptions.map(option => option.label).join(' / ') || placeholder }}</template>
      <template #option="{ option, selected }">{{ option.label }}{{ selected ? ' 已选' : '' }}</template>
      <template #option-detail="{ option, index }">{{ index }}：{{ option.detail }}</template>
    </BingSelect>
    <pre id="model">{{ JSON.stringify(value) }}</pre>
    <pre id="payload">{{ JSON.stringify(payload) }}</pre>
    <pre id="events">{{ JSON.stringify(events) }}</pre>
    <BingSelect v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" :size="size"
      :options="[{ label: '选项甲', value: 'a' }, { label: '选项乙', value: 'b' }]" :ariaLabel="`${size} 独立选择器`" />
    <BingButton @click="dialog = true">打开组合弹窗</BingButton>
    <BingDialog v-model="dialog" title="选择器组合">
      <BingSelect v-model="nestedValue" :options="options" ariaLabel="弹窗内选择器" />
    </BingDialog>
  </main>
</template>
