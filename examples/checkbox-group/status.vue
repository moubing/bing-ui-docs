<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '代码生成', value: 'code' },
  { label: '视觉回归', value: 'visual' },
  { label: '自动发布', value: 'release' },
]
const selected = ref<BingCheckboxGroupValue[]>(['code'])
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-9" name="checkbox-doc-9"
    v-model="selected" :options="items" status="error" direction="column"
    ariaLabel="发布检查项" ariaDescribedby="release-help"
  />
  <p id="release-help">error 只表示状态样式，不会自动校验最少选择数量；实际规则需在 Form schema 或业务中定义。</p>
  <p>当前值：{{ selected.join('、') }}</p>
</template>
