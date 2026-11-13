<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const value = ref<string | number | null>(2.5)
const immediate = ref('等待输入')
const debounced = ref('等待输入')
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="value" type="number" :min="0" :max="10" :step="0.5"
      clearable block :debounce-delay="0" ariaLabel="数值输入示例"
      @input="immediate = `${$event} (${typeof $event})`"
      @debounced-input="debounced = `${$event} (${typeof $event})`" />
    <p role="status">模型：{{ JSON.stringify(value) }}；类型：{{ value === null ? 'null' : typeof value }}；input：{{ immediate }}；debounced：{{ debounced }}</p>
    <div style="display: flex; gap: 12px; flex-wrap: wrap">
      <BingButton variant="secondary" size="sm" @click="value = null">重置为空</BingButton>
      <BingButton variant="secondary" size="sm" @click="value = 0">设为零</BingButton>
    </div>
    <BingInput model-value="3" type="number" readonly clearable ariaLabel="只读数值" />
  </div>
</template>
