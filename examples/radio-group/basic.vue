<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioGroupProps, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingRadioGroupProps = {
  "direction": "wrap",
  "size": "md",
  "status": "default",
  "disabled": false
}
// @docs-options:end

const items: BingRadioGroupOption[] = [
  { label: '标准模式', value: 'standard', description: '默认密度，适合常规表单。' },
  { label: '紧凑模式', value: 'compact', description: '减少垂直空间，适合工具栏。' },
  { label: '沉浸模式', value: 'immersive', description: '更适合展示型页面。' },
  { label: '实验模式', value: 'labs', description: '暂不可选。', disabled: true },
]
const selected = ref<BingRadioValue | null>('standard')
function selectRecommended() { selected.value = 'standard' }
function clear() { selected.value = null }
</script>

<template>
  <BingRadioGroup
    v-model="selected" :options="items" v-bind="options"
    id="display-mode" name="display-mode" ariaLabel="展示模式"
  />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="selectRecommended">选择推荐</BingButton>
    <BingButton size="sm" variant="ghost" @click="clear">清空外部值</BingButton>
  </div>
  <p role="status">当前值：{{ selected === null ? '未选择' : String(selected) }}</p>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
</style>
