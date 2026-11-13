<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '文档', value: 'docs' },
  { label: '示例', value: 'demo' },
  { label: '类型', value: 'types' },
]
const selected = ref<BingCheckboxGroupValue[]>(['docs'])
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-11" name="checkbox-doc-11" v-model="selected" :options="items" direction="row" size="sm" ariaLabel="文档范围" />
  <p>已选择：{{ selected.length ? selected.join('、') : '未选择' }}</p>
</template>
