<script setup lang="ts">
import { ref } from 'vue'
import { BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingRadioGroupOption[] = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' },
]
const theme = ref<BingRadioValue | null>('system')
</script>

<template>
  <BingRadioGroup
    v-model="theme" :options="items" direction="row" size="sm"
    id="theme-mode" name="theme-mode" ariaLabel="主题模式"
  />
  <p>当前主题：{{ theme }}</p>
</template>
