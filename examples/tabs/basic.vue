<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue, BingTabsChangePayload, BingTabsFocusPayload, BingTabsProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingTabsProps = {
  "size": "md",
  "variant": "glass",
  "activation": "auto",
  "block": false,
  "loop": true,
  "animated": true,
  "disabled": false
}
// @docs-options:end

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const active = ref<BingTabValue>('overview')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
const changeLog = ref('等待切换')
const focusLog = ref('等待焦点事件')
function handleChange(payload: BingTabsChangePayload) {
  changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
}
function handleFocus(payload: BingTabsFocusPayload) {
  focusLog.value = `聚焦：${payload.item.label}`
}
function handleBlur(payload: BingTabsFocusPayload) {
  focusLog.value = `失焦：${payload.item.label}`
}
</script>

<template>
  <BingTabs
    v-model="active" :items="items" v-bind="options" ariaLabel="文档分组"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <section aria-live="polite">
    <h2>{{ activeItem?.label }}</h2>
    <p>当前 value：{{ active }}。此内容区域由业务根据选中值渲染。</p>
  </section>
  <p role="status">切换：{{ changeLog }}；{{ focusLog }}</p>
</template>
