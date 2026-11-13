<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue, BingTabsChangePayload, BingTabsFocusPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const active = ref<BingTabValue>('overview')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
const focusLog = ref('等待焦点事件')
const changeLog = ref('等待切换')
function handleFocus(payload: BingTabsFocusPayload) { focusLog.value = `聚焦：${payload.item.label}` }
function handleBlur(payload: BingTabsFocusPayload) { focusLog.value = `失焦：${payload.item.label}` }
function handleChange(payload: BingTabsChangePayload) {
  changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
}
</script>

<template>
  <BingTabs
    v-model="active" :items="items" activation="manual" :loop="false" variant="soft"
    ariaLabel="手动激活示例" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
  />
  <p role="status">{{ focusLog }}；当前：{{ activeItem?.label }}；切换：{{ changeLog }}</p>
  <p>方向键、Home 和 End 移动焦点；Enter 或空格确认选中。点击标签仍会立即切换。</p>
</template>
