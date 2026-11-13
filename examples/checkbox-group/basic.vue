<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupProps, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingCheckboxGroupProps = {
  "direction": "wrap",
  "size": "md",
  "status": "default",
  "disabled": false
}
// @docs-options:end

const items: BingCheckboxGroupOption[] = [
  { label: '键盘导航', value: 'keyboard', description: '支持 Tab、Space 与焦点反馈。' },
  { label: '动效反馈', value: 'motion', description: '开启悬浮、点击和选中动效。' },
  { label: '批量操作', value: 'batch', description: '允许一次选择多个操作对象。' },
  { label: '实验功能', value: 'labs', description: '暂时不可选。', disabled: true },
]
const selected = ref<BingCheckboxGroupValue[]>(['keyboard', 'motion'])
function selectAll() { selected.value = items.filter(item => !item.disabled).map(item => item.value) }
function clear() { selected.value = [] }
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-13" name="checkbox-doc-13" v-model="selected" :options="items" v-bind="options" ariaLabel="功能开关选项" />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="selectAll">全选可用项</BingButton>
    <BingButton size="sm" variant="ghost" @click="clear">清空</BingButton>
  </div>
  <p role="status">当前值：{{ selected.length ? selected.join('、') : '未选择' }}</p>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
</style>
